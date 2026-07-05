import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { calculateTeamTotals } from '../utils/teamMatch';

export default function TeamSummaryScreen({ teamMatch, onNew }) {
  const { theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);
  const totals = calculateTeamTotals(teamMatch);
  const winner = totals.winner === 'A' ? teamMatch.teamA.name : teamMatch.teamB.name;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.trophy}>🏆</Text>
      <Text style={s.title}>{winner} Wins!</Text>
      <Text style={s.subtitle}>{teamMatch.teamA.name} {totals.A} – {totals.B} {teamMatch.teamB.name}</Text>

      {teamMatch.slots.map((slot) => {
        const pts = (() => {
          if (slot.status === 'forfeit') {
            return slot.forfeit.awardedTo === 'A'
              ? `${slot.forfeit.pts} – 0`
              : `0 – ${slot.forfeit.pts}`;
          }
          if (slot.status === 'completed' && slot.match?.matchPoints) {
            const mp = slot.match.matchPoints;
            return slot.match.winner === 1
              ? `${mp.winner} – ${mp.loser}`
              : `${mp.loser} – ${mp.winner}`;
          }
          return '–';
        })();
        return (
          <View key={slot.id} style={s.matchRow}>
            <Text style={s.matchLabel}>Match {slot.id}</Text>
            <Text style={s.matchPlayers}>
              {slot.aPlayer} vs {slot.bPlayer}
            </Text>
            <Text style={s.matchPts}>{pts}</Text>
            {slot.status === 'forfeit' && <Text style={s.forfeitTag}>Forfeit</Text>}
            {slot.status === 'completed' && slot.match && (
              <Text style={s.winnerName}>
                Winner: {slot.match.winner === 1 ? slot.aPlayer : slot.bPlayer}
              </Text>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={s.newBtn} onPress={onNew}>
        <Text style={s.newBtnText}>New Team Match</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: t.scrollBg },
    content: { padding: 16, alignItems: 'center' },
    trophy: { fontSize: 48, marginBottom: 8 },
    title: { fontSize: 28, fontWeight: 'bold', color: t.gold, marginBottom: 4 },
    subtitle: { fontSize: 16, color: t.textMuted, marginBottom: 20 },
    matchRow: {
      backgroundColor: t.matchRowBg,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: t.border,
      alignSelf: 'stretch',
    },
    matchLabel: { fontSize: 11, color: t.gold, fontWeight: 'bold', marginBottom: 2 },
    matchPlayers: { fontSize: 13, color: t.textPrimary, marginBottom: 2 },
    matchPts: { fontSize: 15, fontWeight: 'bold', color: t.textSecondary },
    forfeitTag: { fontSize: 11, color: t.btnDanger, fontWeight: 'bold' },
    winnerName: { fontSize: 11, color: t.textSecondary, fontStyle: 'italic' },
    newBtn: { backgroundColor: t.btnPrimary, borderRadius: 10, padding: 16, paddingHorizontal: 40, marginTop: 16 },
    newBtnText: { color: t.btnPrimaryText, fontSize: 18, fontWeight: 'bold' },
  });
}
