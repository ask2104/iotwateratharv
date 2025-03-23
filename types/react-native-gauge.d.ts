declare module 'react-native-gauge' {
  import { ViewStyle, TextStyle } from 'react-native';

  interface GaugeProps {
    value: number;
    minValue: number;
    maxValue: number;
    unit?: string;
    label?: string;
    valueStyle?: TextStyle;
    labelStyle?: TextStyle;
    style?: ViewStyle;
  }

  export const Gauge: React.FC<GaugeProps>;
} 