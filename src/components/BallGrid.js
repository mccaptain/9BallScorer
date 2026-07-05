import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

const BALL_COLORS = {
  1: '#f5c518', 2: '#1a3a8a', 3: '#cc2222', 4: '#5a1a7a',
  5: '#dd4411', 6: '#1a6a3a', 7: '#8a1a1a', 8: '#111111',
};

const ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

export default function BallGrid({ myPocketed, otherPocketed, onToggle, numberCircleSize = 18, disabled = false }) {
  const { ballScale, textScale, theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);
  const ballSize = Math.round(36 * ballScale);
  const circleSize = Math.round(numberCircleSize * ballScale);
  const ballFontSize = Math.round(12 * textScale);
  const gap = Math.round(10 * ballScale);

  function renderBall(n) {
    const myState = myPocketed[n];
    const takenByOther = !!otherPocketed[n];
    const isDisabled = takenByOther || disabled;

    let stateStyle = s.available;
    let ballLabel = String(n);
    if (myState === 'made') {
      stateStyle = s.made;
      ballLabel = '✗';
    } else if (myState === 'dead') {
      stateStyle = s.dead;
      ballLabel = '●';
    } else if (takenByOther) {
      stateStyle = s.taken;
    }

    return (
      <TouchableOpacity
        key={n}
        onPress={() => onToggle?.(n)}
        disabled={isDisabled}
        activeOpacity={0.6}
        style={[
          s.ball,
          { width: ballSize, height: ballSize, borderRadius: ballSize / 2 },
          { backgroundColor: BALL_COLORS[n] || '#fff' },
          stateStyle,
        ]}
      >
        {n === 9 && (
          <View style={[s.stripeWrap, { width: ballSize, height: ballSize }]}>
            <View style={[s.stripe, { width: Math.round(ballSize * 0.6), borderRadius: Math.round(ballSize * 0.06) }]} />
          </View>
        )}
        <View
          style={[
            s.numberCircle,
            { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
          ]}
        >
          <Text style={[s.ballText, { fontSize: ballFontSize }]}>{ballLabel}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View>
      {ROWS.map((row, i) => (
        <View key={row[0]} style={[s.row, { gap, marginBottom: i < 2 ? gap : 0 }]}>
          {row.map(renderBall)}
        </View>
      ))}
    </View>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    ball: {
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    stripeWrap: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stripe: {
      height: '100%',
      backgroundColor: '#f5c518',
    },
    numberCircle: {
      backgroundColor: t.numberCircle,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    available: { opacity: 1 },
    made: {
      borderColor: t.gold,
      borderWidth: 3,
      opacity: 1,
    },
    dead: {
      borderColor: t.gold,
      borderWidth: 3,
      opacity: 0.5,
    },
    taken: {
      opacity: 0.15,
      borderColor: t.textDark,
    },
    ballText: {
      fontWeight: 'bold',
      color: t.ballText,
    },
  });
}
