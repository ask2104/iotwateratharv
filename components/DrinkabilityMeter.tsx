import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DrinkabilityMeterProps {
  status: string;
  color: string;
}

export const DrinkabilityMeter: React.FC<DrinkabilityMeterProps> = ({ status, color }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.meter, { backgroundColor: color }]}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  meter: {
    width: 200,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});