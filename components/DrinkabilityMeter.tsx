import { StyleSheet, View, Text } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react-native';

interface DrinkabilityMeterProps {
  tds: number;
  temperature: number;
}

export function DrinkabilityMeter({ tds, temperature }: DrinkabilityMeterProps) {
  const getDrinkabilityStatus = () => {
    if (tds < 300 && temperature < 30) {
      return {
        status: 'Safe',
        color: '#22c55e',
        icon: CheckCircle2,
        message: 'Water is safe to drink',
      };
    } else if (tds < 500 && temperature < 35) {
      return {
        status: 'Caution',
        color: '#eab308',
        icon: AlertTriangle,
        message: 'Water quality needs attention',
      };
    } else {
      return {
        status: 'Unsafe',
        color: '#ef4444',
        icon: XCircle,
        message: 'Water is not safe to drink',
      };
    }
  };

  const { status, color, icon: Icon, message } = getDrinkabilityStatus();

  return (
    <View style={styles.container}>
      <View style={[styles.statusContainer, { backgroundColor: `${color}15` }]}>
        <Icon size={24} color={color} />
        <View style={styles.textContainer}>
          <Text style={[styles.status, { color }]}>{status}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  textContainer: {
    marginLeft: 12,
  },
  status: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
});