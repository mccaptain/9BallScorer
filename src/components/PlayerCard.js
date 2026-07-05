import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

export default function PlayerCard({ name, sl, points, target, rackPts, onNamePress }) {
  const { textScale, theme } = useAccessibility();
  const remaining = target - (points + rackPts);
  const showNeeds = remaining > 0 && remaining < 10;
  const s = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={s.card}>
      <View style={s.top}>
        <View>
          <TouchableOpacity onPress={onNamePress}>
            <Text style={[s.name, { fontSize: Math.round(18 * textScale) }]}>{name}</Text>
          </TouchableOpacity>
          <Text style={[s.slText, { fontSize: Math.round(11 * textScale) }]}>SL:{sl}</Text>
        </View>
        <View style={s.badges}>
          {showNeeds && (
            <View style={s.needsBadge}>
              <Text style={[s.needsText, { fontSize: Math.round(9 * textScale) }]}>ONLY NEEDS {remaining}</Text>
            </View>
          )}
          <View style={s.badge}>
            <Text style={[s.badgeLabel, { fontSize: Math.round(9 * textScale) }]}>RACK</Text>
            <Text style={[s.badgeValue, { fontSize: Math.round(16 * textScale) }]}>{rackPts}</Text>
          </View>
          <View style={s.badge}>
            <Text style={[s.badgeLabel, { fontSize: Math.round(9 * textScale) }]}>MATCH</Text>
            <Text style={[s.badgeValue, { fontSize: Math.round(16 * textScale) }]}>{points}/{target}</Text>
          </View>
        </View>
      </View>
        <View style={s.targetRow}>
          <View style={s.progressBg}>
            <View
              style={[
                s.progressFill,
                { width: `${Math.min(100, (points / target) * 100)}%` },
              ]}
            />
          </View>
        </View>
    </View>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    card: {
      backgroundColor: t.surfaceCard,
      borderRadius: 10,
      padding: 10,
      borderWidth: 2,
      borderColor: t.gold,
    },
    top: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    name: {
      fontWeight: 'bold',
      color: t.gold,
    },
    slText: {
      color: t.textSecondary,
      marginTop: 2,
    },
    badges: {
      flexDirection: 'row',
      gap: 6,
    },
    needsBadge: {
      backgroundColor: t.needsBg,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
      justifyContent: 'center',
    },
    needsText: {
      color: t.needsText,
      fontWeight: 'bold',
    },
    badge: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
      alignItems: 'center',
      minWidth: 40,
    },
    badgeLabel: {
      color: t.textSecondary,
      fontWeight: 'bold',
    },
    badgeValue: {
      color: t.textPrimary,
      fontWeight: 'bold',
    },
    targetRow: {
      marginTop: 6,
    },
    progressBg: {
      height: 8,
      backgroundColor: t.progressBg,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: t.progressFill,
      borderRadius: 2,
    },
  });
}
