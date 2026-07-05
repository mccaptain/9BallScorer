import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { calculateTeamTotals, forfeitSlot } from '../utils/teamMatch';
import MatchSetupModal from './MatchSetupModal';

export default function MatchListScreen({ teamMatch, setTeamMatch, onStartMatch, onSummary }) {
  const [setupSlot, setSetupSlot] = useState(null);
  const [menuSlot, setMenuSlot] = useState(null);
  const totals = calculateTeamTotals(teamMatch);
  const allDone = teamMatch.slots.every((s) => s.status === 'completed' || s.status === 'forfeit');

  function handleForfeit(slotId, awardedTo) {
    setTeamMatch((prev) => forfeitSlot(prev, slotId, awardedTo, prev.tournament));
    setMenuSlot(null);
  }

  function handleSetupComplete(data) {
    onStartMatch(setupSlot, data);
    setSetupSlot(null);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Team Match</Text>
      <Text style={styles.subtitle}>
        {teamMatch.teamA.name} vs {teamMatch.teamB.name}
      </Text>

      <View style={styles.scoreBar}>
        <Text style={styles.scoreTeam}>{teamMatch.teamA.name}: {totals.A}</Text>
        <Text style={styles.scoreDash}>-</Text>
        <Text style={styles.scoreTeam}>{teamMatch.teamB.name}: {totals.B}</Text>
      </View>

      {teamMatch.slots.map((slot) => (
        <View key={slot.id} style={styles.slotCard}>
          <View style={styles.slotHeader}>
            <Text style={styles.slotNum}>Match {slot.id}</Text>
            <Text style={[styles.statusBadge, styles[`status_${slot.status}`]]}>
              {slot.status === 'pending' ? 'Not Started' : slot.status === 'active' ? 'In Progress' : slot.status === 'completed' ? 'Completed' : 'Forfeit'}
            </Text>
          </View>

          {(slot.status === 'active' || slot.status === 'completed' || slot.status === 'forfeit') && (
            <Text style={styles.playerNames}>
              {slot.aPlayer || '?'} vs {slot.bPlayer || '?'}
            </Text>
          )}

          {slot.status === 'completed' && slot.match && (
            <Text style={styles.result}>
              Winner: {slot.match.winner === 1 ? slot.aPlayer : slot.bPlayer} —
              Match pts: {slot.match.matchPoints ? `${slot.match.matchPoints.winner}-${slot.match.matchPoints.loser}` : '?'}
            </Text>
          )}

          {slot.status === 'forfeit' && (
            <Text style={styles.result}>
              {slot.forfeit.awardedTo === 'A' ? teamMatch.teamA.name : teamMatch.teamB.name} gets {slot.forfeit.pts} pts
            </Text>
          )}

          {slot.status === 'pending' && (
            <View>
              <View style={styles.slotActions}>
                <TouchableOpacity style={styles.playBtn} onPress={() => setSetupSlot(slot.id)}>
                  <Text style={styles.playBtnText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuSlot(menuSlot === slot.id ? null : slot.id)}>
                  <Text style={styles.menuBtnText}>⋮</Text>
                </TouchableOpacity>
              </View>
              {menuSlot === slot.id && (
                <View style={styles.forfeitRow}>
                  <TouchableOpacity style={styles.forfeitBtn} onPress={() => handleForfeit(slot.id, 'A')}>
                    <Text style={styles.forfeitBtnText}>Forfeit → {teamMatch.teamA.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.forfeitBtn} onPress={() => handleForfeit(slot.id, 'B')}>
                    <Text style={styles.forfeitBtnText}>Forfeit → {teamMatch.teamB.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {slot.status === 'active' && (
            <View>
              <View style={styles.slotActions}>
                <TouchableOpacity style={styles.playBtn} onPress={() => onStartMatch(slot.id, null)}>
                  <Text style={styles.playBtnText}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuSlot(menuSlot === slot.id ? null : slot.id)}>
                  <Text style={styles.menuBtnText}>⋮</Text>
                </TouchableOpacity>
              </View>
              {menuSlot === slot.id && (
                <View style={styles.forfeitRow}>
                  <TouchableOpacity style={styles.forfeitBtn} onPress={() => handleForfeit(slot.id, 'A')}>
                    <Text style={styles.forfeitBtnText}>Forfeit → {teamMatch.teamA.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.forfeitBtn} onPress={() => handleForfeit(slot.id, 'B')}>
                    <Text style={styles.forfeitBtnText}>Forfeit → {teamMatch.teamB.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      {allDone && (
        <TouchableOpacity style={styles.summaryBtn} onPress={onSummary}>
          <Text style={styles.summaryBtnText}>View Results</Text>
        </TouchableOpacity>
      )}

      <MatchSetupModal
        visible={setupSlot !== null}
        teamAName={teamMatch.teamA.name}
        teamBName={teamMatch.teamB.name}
        onStart={handleSetupComplete}
        onCancel={() => setSetupSlot(null)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1f0d' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#ffd700', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#8a8', textAlign: 'center', marginBottom: 12 },
  scoreBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 },
  scoreTeam: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  scoreDash: { fontSize: 16, color: '#666' },
  slotCard: { backgroundColor: '#142814', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#2a4a2a' },
  slotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  slotNum: { fontSize: 14, fontWeight: 'bold', color: '#ffd700' },
  statusBadge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  status_pending: { color: '#aaa', backgroundColor: '#333' },
  status_active: { color: '#fff', backgroundColor: '#b8860b' },
  status_completed: { color: '#fff', backgroundColor: '#2e7d32' },
  status_forfeit: { color: '#fff', backgroundColor: '#8a1a1a' },
  playerNames: { fontSize: 13, color: '#fff', marginBottom: 4 },
  result: { fontSize: 12, color: '#8a8', fontStyle: 'italic' },
  slotActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  playBtn: { flex: 1, backgroundColor: '#2e7d32', borderRadius: 6, padding: 10, alignItems: 'center' },
  playBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  menuBtn: { width: 36, backgroundColor: '#333', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  menuBtnText: { color: '#aaa', fontSize: 20, lineHeight: 24 },
  forfeitRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  forfeitBtn: { flex: 1, backgroundColor: '#3a1a1a', borderRadius: 6, padding: 8, alignItems: 'center' },
  forfeitBtnText: { color: '#c88', fontSize: 12 },
  summaryBtn: { backgroundColor: '#ffd700', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 12 },
  summaryBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
