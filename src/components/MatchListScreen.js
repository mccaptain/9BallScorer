import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';
import { calculateTeamTotals, forfeitSlot } from '../utils/teamMatch';
import MatchSetupModal from './MatchSetupModal';

export default function MatchListScreen({ teamMatch, setTeamMatch, onStartMatch, onSummary }) {
  const { theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);
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
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Team Match</Text>
      <Text style={s.subtitle}>
        {teamMatch.teamA.name} vs {teamMatch.teamB.name}
      </Text>

      <View style={s.scoreBar}>
        <Text style={s.scoreTeam}>{teamMatch.teamA.name}: {totals.A}</Text>
        <Text style={s.scoreDash}>-</Text>
        <Text style={s.scoreTeam}>{teamMatch.teamB.name}: {totals.B}</Text>
      </View>

      {teamMatch.slots.map((slot) => (
        <View key={slot.id} style={s.slotCard}>
          <View style={s.slotHeader}>
            <Text style={s.slotNum}>Match {slot.id}</Text>
            <Text style={[s.statusBadge, slot.status === 'pending' ? s.status_pending : slot.status === 'active' ? s.status_active : slot.status === 'completed' ? s.status_completed : s.status_forfeit]}>
              {slot.status === 'pending' ? 'Not Started' : slot.status === 'active' ? 'In Progress' : slot.status === 'completed' ? 'Completed' : 'Forfeit'}
            </Text>
          </View>

          {(slot.status === 'active' || slot.status === 'completed' || slot.status === 'forfeit') && (
            <Text style={s.playerNames}>
              {slot.aPlayer || '?'} vs {slot.bPlayer || '?'}
            </Text>
          )}

          {slot.status === 'completed' && slot.match && (
            <Text style={s.result}>
              Winner: {slot.match.winner === 1 ? slot.aPlayer : slot.bPlayer} —
              Match pts: {slot.match.matchPoints ? `${slot.match.matchPoints.winner}-${slot.match.matchPoints.loser}` : '?'}
            </Text>
          )}

          {slot.status === 'forfeit' && (
            <Text style={s.result}>
              {slot.forfeit.awardedTo === 'A' ? teamMatch.teamA.name : teamMatch.teamB.name} gets {slot.forfeit.pts} pts
            </Text>
          )}

          {slot.status === 'pending' && (
            <View>
              <View style={s.slotActions}>
                <TouchableOpacity style={s.playBtn} onPress={() => setSetupSlot(slot.id)}>
                  <Text style={s.playBtnText}>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.menuBtn} onPress={() => setMenuSlot(menuSlot === slot.id ? null : slot.id)}>
                  <Text style={s.menuBtnText}>⋮</Text>
                </TouchableOpacity>
              </View>
              {menuSlot === slot.id && (
                <View style={s.forfeitRow}>
                  <TouchableOpacity style={s.forfeitBtn} onPress={() => handleForfeit(slot.id, 'A')}>
                    <Text style={s.forfeitBtnText}>Forfeit → {teamMatch.teamA.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.forfeitBtn} onPress={() => handleForfeit(slot.id, 'B')}>
                    <Text style={s.forfeitBtnText}>Forfeit → {teamMatch.teamB.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {slot.status === 'active' && (
            <View>
              <View style={s.slotActions}>
                <TouchableOpacity style={s.playBtn} onPress={() => onStartMatch(slot.id, null)}>
                  <Text style={s.playBtnText}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.menuBtn} onPress={() => setMenuSlot(menuSlot === slot.id ? null : slot.id)}>
                  <Text style={s.menuBtnText}>⋮</Text>
                </TouchableOpacity>
              </View>
              {menuSlot === slot.id && (
                <View style={s.forfeitRow}>
                  <TouchableOpacity style={s.forfeitBtn} onPress={() => handleForfeit(slot.id, 'A')}>
                    <Text style={s.forfeitBtnText}>Forfeit → {teamMatch.teamA.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.forfeitBtn} onPress={() => handleForfeit(slot.id, 'B')}>
                    <Text style={s.forfeitBtnText}>Forfeit → {teamMatch.teamB.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      {allDone && (
        <TouchableOpacity style={s.summaryBtn} onPress={onSummary}>
          <Text style={s.summaryBtnText}>View Results</Text>
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

function makeStyles(t) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: t.scrollBg },
    content: { padding: 16 },
    title: { fontSize: 20, fontWeight: 'bold', color: t.gold, textAlign: 'center' },
    subtitle: { fontSize: 13, color: t.textSecondary, textAlign: 'center', marginBottom: 12 },
    scoreBar: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 16 },
    scoreTeam: { fontSize: 16, fontWeight: 'bold', color: t.textPrimary },
    scoreDash: { fontSize: 16, color: t.textDark },
    slotCard: { backgroundColor: t.slotCardBg, borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: t.border },
    slotHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    slotNum: { fontSize: 14, fontWeight: 'bold', color: t.gold },
    statusBadge: { fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    status_pending: { color: t.statusPendingText, backgroundColor: t.statusPendingBg },
    status_active: { color: t.statusActiveText, backgroundColor: t.statusActiveBg },
    status_completed: { color: t.statusCompletedText, backgroundColor: t.statusCompletedBg },
    status_forfeit: { color: t.statusForfeitText, backgroundColor: t.statusForfeitBg },
    playerNames: { fontSize: 13, color: t.textPrimary, marginBottom: 4 },
    result: { fontSize: 12, color: t.textSecondary, fontStyle: 'italic' },
    slotActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
    playBtn: { flex: 1, backgroundColor: t.btnPrimary, borderRadius: 6, padding: 10, alignItems: 'center' },
    playBtnText: { color: t.btnPrimaryText, fontWeight: 'bold', fontSize: 14 },
    menuBtn: { width: 36, backgroundColor: t.btnNeutral, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    menuBtnText: { color: t.btnNeutralText, fontSize: 20, lineHeight: 24 },
    forfeitRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
    forfeitBtn: { flex: 1, backgroundColor: t.forfeitBtnBg, borderRadius: 6, padding: 8, alignItems: 'center' },
    forfeitBtnText: { color: t.forfeitBtnText, fontSize: 12 },
    summaryBtn: { backgroundColor: t.summaryBtnBg, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 12 },
    summaryBtnText: { color: t.summaryBtnText, fontSize: 18, fontWeight: 'bold' },
  });
}
