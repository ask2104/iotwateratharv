# ESP32 Water Quality Monitor Firmware

This firmware runs on an ESP32 microcontroller to monitor water quality parameters using TDS and temperature sensors.

## Hardware Requirements

- ESP32 Development Board
- TDS Sensor (connected to GPIO 34)
- Temperature Sensor (connected to GPIO 35)
- Power supply (3.3V or 5V)

## Software Requirements

- Arduino IDE
- ESP32 Board Support
- Required Libraries:
  - ArduinoJson
  - WebServer (included with ESP32)

## Setup Instructions

1. Install Arduino IDE from https://www.arduino.cc/en/software

2. Add ESP32 board support:
   - Open Arduino IDE
   - Go to File > Preferences
   - Add to "Additional Boards Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to Tools > Board > Boards Manager
   - Search for "esp32"
   - Install "ESP32 by Espressif Systems"

3. Install required libraries:
   - Go to Tools > Manage Libraries
   - Search for and install:
     - "ArduinoJson" by Benoit Blanchon

4. Configure the firmware:
   - Open `esp32_firmware.ino` in Arduino IDE
   - Update WiFi credentials:
     ```cpp
     const char* ssid = "YourWiFiSSID";
     const char* password = "YourWiFiPassword";
     ```
   - Adjust sensor calibration factors if needed:
     ```cpp
     const float TDS_FACTOR = 0.5;  // Adjust based on your sensor
     const float TEMP_FACTOR = 0.1; // Adjust based on your sensor
     ```

5. Upload the firmware:
   - Select your ESP32 board from Tools > Board
   - Select the correct port from Tools > Port
   - Click Upload

## API Endpoints

The firmware provides the following HTTP endpoints:

- `GET /sensor-data`: Get current sensor readings
- `GET /device-status`: Get device connection status
- `POST /wifi-config`: Configure WiFi settings
- `GET /historical-data`: Get historical sensor data

## Troubleshooting

1. If the device doesn't connect to WiFi:
   - Check WiFi credentials
   - Ensure the network is 2.4GHz (ESP32 doesn't support 5GHz)
   - Check signal strength

2. If sensor readings are incorrect:
   - Verify sensor connections
   - Adjust calibration factors
   - Check power supply

3. If the web server is not accessible:
   - Check the IP address in Serial Monitor
   - Ensure the device and client are on the same network
   - Check firewall settings

## License

MIT License - See LICENSE file for details 