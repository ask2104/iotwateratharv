import { StyleSheet, View, Platform } from 'react-native';
import { Text as RNText } from 'react-native';
import { useMemo } from 'react';

interface GaugeChartProps {
  value: number;
  maxValue: number;
  size: number;
  thickness?: number;
  title: string;
  unit: string;
  color: string;
}

// Import Skia components only for native platforms
let SkiaComponents: any = null;
if (Platform.OS !== 'web') {
  try {
    SkiaComponents = require('@shopify/react-native-skia');
  } catch (error) {
    console.warn('Failed to load Skia components:', error);
  }
}

export function GaugeChart({
  value,
  maxValue,
  size,
  thickness = 15,
  title,
  unit,
  color,
}: GaugeChartProps) {
  // For web platform or if Skia failed to load, show a simplified version
  if (Platform.OS === 'web' || !SkiaComponents) {
    return (
      <View style={styles.container}>
        <View style={[styles.gauge, { width: size, height: size / 2 }]}>
          <RNText style={[styles.value, { color: '#1e293b' }]}>
            {Math.round(value)}
          </RNText>
          <RNText style={[styles.unit, { color: '#64748b' }]}>
            {unit}
          </RNText>
          <RNText style={[styles.title, { color: '#64748b' }]}>
            {title}
          </RNText>
        </View>
      </View>
    );
  }

  const { Canvas, Group, Path, Skia, Text } = SkiaComponents;
  
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfCircumference = circumference / 2;
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100); // Clamp between 0-100
  const strokeDashOffset = halfCircumference - (percentage / 100) * halfCircumference;

  const path = useMemo(() => {
    if (!Skia?.Path?.Make) {
      console.warn('Skia Path.Make is not available');
      return null;
    }

    try {
      const startAngle = Math.PI;
      const endAngle = 0;

      const skPath = Skia.Path.Make();
      skPath.addArc(
        { x: thickness / 2, y: thickness / 2, width: size - thickness, height: size - thickness },
        startAngle * (180 / Math.PI),
        (endAngle - startAngle) * (180 / Math.PI)
      );
      return skPath;
    } catch (error) {
      console.error('Failed to create Skia path:', error);
      return null;
    }
  }, [size, thickness]);

  if (!path) {
    return (
      <View style={styles.container}>
        <RNText style={styles.errorText}>Failed to render gauge</RNText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Canvas style={{ width: size, height: size / 2 + 40 }}>
        <Group>
          <Path
            path={path}
            style="stroke"
            strokeWidth={thickness}
            strokeCap="round"
            color="#e5e5e5"
          />
          <Path
            path={path}
            style="stroke"
            strokeWidth={thickness}
            strokeCap="round"
            color={color}
            strokeDasharray={[halfCircumference, halfCircumference]}
            strokeDashOffset={strokeDashOffset}
          />
          <Text
            x={size / 2}
            y={size / 2 - 10}
            text={`${Math.round(value)}`}
            font={{ family: 'SpaceGrotesk-SemiBold', size: 32 }}
            color="#1e293b"
            textAlign="center"
          />
          <Text
            x={size / 2}
            y={size / 2 + 20}
            text={unit}
            font={{ family: 'Inter-SemiBold', size: 14 }}
            color="#64748b"
            textAlign="center"
          />
          <Text
            x={size / 2}
            y={size / 2 + 40}
            text={title}
            font={{ family: 'Inter-Regular', size: 14 }}
            color="#64748b"
            textAlign="center"
          />
        </Group>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  gauge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 32,
    marginBottom: 4,
  },
  unit: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#ef4444',
  },
});