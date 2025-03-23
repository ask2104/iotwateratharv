#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <EEPROM.h>

// WiFi credentials
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

// Pin definitions
const int TDS_PIN = 34;  // Analog pin for TDS sensor
const int TEMP_PIN = 35; // Analog pin for temperature sensor

// Create web server on port 80
WebServer server(80);

// Sensor calibration values
const float TDS_FACTOR = 0.5;  // Adjust based on your sensor
const float TEMP_FACTOR = 0.1; // Adjust based on your sensor

// Store historical data
struct SensorReading {
  float tds;
  float temperature;
  unsigned long timestamp;
};

const int MAX_READINGS = 24; // Store 24 hours of readings
SensorReading readings[MAX_READINGS];
int currentReading = 0;

void setup() {
  Serial.begin(115200);
  
  // Initialize EEPROM
  EEPROM.begin(512);
  
  // Load saved WiFi credentials
  loadWiFiCredentials();
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Setup server routes
  server.on("/sensor-data", HTTP_GET, handleSensorData);
  server.on("/device-status", HTTP_GET, handleDeviceStatus);
  server.on("/wifi-config", HTTP_POST, handleWiFiConfig);
  server.on("/historical-data", HTTP_GET, handleHistoricalData);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  
  // Read sensors every 5 seconds
  static unsigned long lastReading = 0;
  if (millis() - lastReading >= 5000) {
    readSensors();
    lastReading = millis();
  }
}

void readSensors() {
  // Read TDS sensor
  int tdsRaw = analogRead(TDS_PIN);
  float tds = tdsRaw * TDS_FACTOR;
  
  // Read temperature sensor
  int tempRaw = analogRead(TEMP_PIN);
  float temperature = tempRaw * TEMP_FACTOR;
  
  // Store reading
  readings[currentReading] = {
    tds,
    temperature,
    millis()
  };
  
  // Update index
  currentReading = (currentReading + 1) % MAX_READINGS;
}

void handleSensorData() {
  StaticJsonDocument<200> doc;
  doc["tds"] = readings[(currentReading - 1 + MAX_READINGS) % MAX_READINGS].tds;
  doc["temperature"] = readings[(currentReading - 1 + MAX_READINGS) % MAX_READINGS].temperature;
  doc["timestamp"] = readings[(currentReading - 1 + MAX_READINGS) % MAX_READINGS].timestamp;
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
}

void handleDeviceStatus() {
  StaticJsonDocument<200> doc;
  doc["connected"] = WiFi.status() == WL_CONNECTED;
  doc["signal"] = WiFi.RSSI();
  doc["lastSeen"] = millis();
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
}

void handleWiFiConfig() {
  if (server.hasArg("plain")) {
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, server.arg("plain"));
    
    if (error) {
      server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
      return;
    }
    
    const char* newSsid = doc["ssid"];
    const char* newPassword = doc["password"];
    
    // Save to EEPROM
    saveWiFiCredentials(newSsid, newPassword);
    
    // Reconnect with new credentials
    WiFi.disconnect();
    WiFi.begin(newSsid, newPassword);
    
    server.send(200, "application/json", "{\"status\":\"success\"}");
  } else {
    server.send(400, "application/json", "{\"error\":\"No data received\"}");
  }
}

void handleHistoricalData() {
  StaticJsonDocument<4096> doc;
  JsonArray tdsArray = doc.createNestedArray("tds");
  JsonArray tempArray = doc.createNestedArray("temperature");
  
  for (int i = 0; i < MAX_READINGS; i++) {
    int index = (currentReading - i + MAX_READINGS) % MAX_READINGS;
    tdsArray.add(readings[index].tds);
    tempArray.add(readings[index].temperature);
  }
  
  String response;
  serializeJson(doc, response);
  
  server.send(200, "application/json", response);
}

void saveWiFiCredentials(const char* newSsid, const char* newPassword) {
  int addr = 0;
  
  // Save SSID
  for (int i = 0; newSsid[i] != '\0'; i++) {
    EEPROM.write(addr++, newSsid[i]);
  }
  EEPROM.write(addr++, '\0');
  
  // Save password
  for (int i = 0; newPassword[i] != '\0'; i++) {
    EEPROM.write(addr++, newPassword[i]);
  }
  EEPROM.write(addr++, '\0');
  
  EEPROM.commit();
}

void loadWiFiCredentials() {
  int addr = 0;
  char savedSsid[32];
  char savedPassword[64];
  
  // Load SSID
  int i = 0;
  char c;
  while ((c = EEPROM.read(addr++)) != '\0' && i < 31) {
    savedSsid[i++] = c;
  }
  savedSsid[i] = '\0';
  
  // Load password
  i = 0;
  while ((c = EEPROM.read(addr++)) != '\0' && i < 63) {
    savedPassword[i++] = c;
  }
  savedPassword[i] = '\0';
  
  // Update global variables
  ssid = savedSsid;
  password = savedPassword;
} 