import { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

const BALL_COLORS = {
  1: '#f5c518', 2: '#1a3a8a', 3: '#cc2222', 4: '#5a1a7a',
  5: '#dd4411', 6: '#1a6a3a', 7: '#8a1a1a', 8: '#111111',
};

const ROWS = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const RATIO = 3 + 2 * (10 / 36); // ballSize * 3 + gap * 2, gap = ballSize * 10/36

export default function BallGrid({ myPocketed, otherPocketed, onToggle, numberCircleSize = 18, disabled = false }) {
  const { ballScale, theme } = useAccessibility();
  const { width: windowWidth } = useWindowDimensions();
  const s = useMemo(() => makeStyles(theme), [theme]);
  const [availWidth, setAvailWidth] = useState(0);
  const [availHeight, setAvailHeight] = useState(Infinity);
  const effectiveWidth = availWidth > 0 ? availWidth : windowWidth * 0.85;
  const fillRatio = Math.min(1, 0.7 + (ballScale - 1.3) * 0.5);
  const fromWidth = Math.floor((effectiveWidth * fillRatio) / RATIO);
  const fromHeight = availHeight < Infinity ? Math.floor(availHeight / RATIO) : Infinity;
  const ballSize = Math.max(16, Math.min(fromWidth, fromHeight));
  const gap = Math.round(ballSize * (10 / 36));
  const circleSize = Math.round(ballSize * (numberCircleSize / 36));
  const ballFontSize = Math.round(ballSize * (12 / 36));

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
          { backgroundColor: n === 1 ? theme.ball1Color : BALL_COLORS[n] || (n === 9 ? theme.ball9Color : '#fff') },
          stateStyle,
        ]}
      >
        {n === 9 && (
          <View style={s.stripeWrap}>
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
    <View style={{ flex: 1 }} onLayout={(e) => { setAvailWidth(e.nativeEvent.layout.width); setAvailHeight(e.nativeEvent.layout.height); }}>
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
      backgroundColor: t.stripeColor,
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
