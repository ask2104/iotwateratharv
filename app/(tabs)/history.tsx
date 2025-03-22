import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { useState } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function History() {
  const [tdsData] = useState([
    { x: new Date('2024-01-20T00:00:00'), y: 250 },
    { x: new Date('2024-01-20T04:00:00'), y: 280 },
    { x: new Date('2024-01-20T08:00:00'), y: 310 },
    { x: new Date('2024-01-20T12:00:00'), y: 290 },
    { x: new Date('2024-01-20T16:00:00'), y: 270 },
    { x: new Date('2024-01-20T20:00:00'), y: 260 },
    { x: new Date('2024-01-20T23:59:59'), y: 255 },
  ]);

  const [tempData] = useState([
    { x: new Date('2024-01-20T00:00:00'), y: 25 },
    { x: new Date('2024-01-20T04:00:00'), y: 24 },
    { x: new Date('2024-01-20T08:00:00'), y: 26 },
    { x: new Date('2024-01-20T12:00:00'), y: 28 },
    { x: new Date('2024-01-20T16:00:00'), y: 27 },
    { x: new Date('2024-01-20T20:00:00'), y: 26 },
    { x: new Date('2024-01-20T23:59:59'), y: 25 },
  ]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>24-hour Trends</Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>TDS Levels (PPM)</Text>
        <VictoryChart
          width={screenWidth - 32}
          height={200}
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}>
          <VictoryAxis
            tickFormat={(t) => {
              const date = new Date(t);
              return `${date.getHours()}:00`;
            }}
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryLine
            data={tdsData}
            style={{
              data: { stroke: '#0891b2' },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Temperature (°C)</Text>
        <VictoryChart
          width={screenWidth - 32}
          height={200}
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}>
          <VictoryAxis
            tickFormat={(t) => {
              const date = new Date(t);
              return `${date.getHours()}:00`;
            }}
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryLine
            data={tempData}
            style={{
              data: { stroke: '#f97316' },
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.readingsList}>
        <Text style={styles.readingsTitle}>Recent Readings</Text>
        {tdsData.reverse().map((reading, index) => (
          <View key={index} style={styles.readingItem}>
            <View>
              <Text style={styles.readingTime}>
                {new Date(reading.x).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text style={styles.readingDate}>
                {new Date(reading.x).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.readingValues}>
              <Text style={styles.readingValue}>{reading.y} PPM</Text>
              <Text style={styles.readingValue}>
                {tempData[tdsData.length - 1 - index].y}°C
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 32,
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  chartContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  chartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
  },
  readingsList: {
    padding: 16,
  },
  readingsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
  },
  readingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  readingTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#0f172a',
  },
  readingDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  readingValues: {
    alignItems: 'flex-end',
  },
  readingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0f172a',
  },
});