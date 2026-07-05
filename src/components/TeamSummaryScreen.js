import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { calculateTeamTotals } from '../utils/teamMatch';

export default function TeamSummaryScreen({ teamMatch, onNew }) {
  const totals = calculateTeamTotals(teamMatch);
  const winner = totals.winner === 'A' ? teamMatch.teamA.name : teamMatch.teamB.name;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.trophy}>🏆</Text>
      <Text style={styles.title}>{winner} Wins!</Text>
      <Text style={styles.subtitle}>{teamMatch.teamA.name} {totals.A} – {totals.B} {teamMatch.teamB.name}</Text>

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
          <View key={slot.id} style={styles.matchRow}>
            <Text style={styles.matchLabel}>Match {slot.id}</Text>
            <Text style={styles.matchPlayers}>
              {slot.aPlayer} vs {slot.bPlayer}
            </Text>
            <Text style={styles.matchPts}>{pts}</Text>
            {slot.status === 'forfeit' && <Text style={styles.forfeitTag}>Forfeit</Text>}
            {slot.status === 'completed' && slot.match && (
              <Text style={styles.winnerName}>
                Winner: {slot.match.winner === 1 ? slot.aPlayer : slot.bPlayer}
              </Text>
            )}
          </View>
        );
      })}

      <TouchableOpacity style={styles.newBtn} onPress={onNew}>
        <Text style={styles.newBtnText}>New Team Match</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1f0d' },
  content: { padding: 16, alignItems: 'center' },
  trophy: { fontSize: 48, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffd700', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#aaa', marginBottom: 20 },
  matchRow: {
    backgroundColor: '#142814',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a4a2a',
    alignSelf: 'stretch',
  },
  matchLabel: { fontSize: 11, color: '#ffd700', fontWeight: 'bold', marginBottom: 2 },
  matchPlayers: { fontSize: 13, color: '#fff', marginBottom: 2 },
  matchPts: { fontSize: 15, fontWeight: 'bold', color: '#8a8' },
  forfeitTag: { fontSize: 11, color: '#c44', fontWeight: 'bold' },
  winnerName: { fontSize: 11, color: '#8a8', fontStyle: 'italic' },
  newBtn: { backgroundColor: '#2e7d32', borderRadius: 10, padding: 16, paddingHorizontal: 40, marginTop: 16 },
  newBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
