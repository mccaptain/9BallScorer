import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

export default function TeamSetupScreen({ onStart }) {
  const { theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);
  const [teamA, setTeamA] = useState('Team A');
  const [teamB, setTeamB] = useState('Team B');
  const [tournament, setTournament] = useState(false);

  return (
    <View style={s.container}>
      <Text style={s.title}>Team Match Setup</Text>
      <TextInput style={s.teamInput} value={teamA} onChangeText={setTeamA} placeholder="Team A name" placeholderTextColor={theme.textDark} />
      <TextInput style={s.teamInput} value={teamB} onChangeText={setTeamB} placeholder="Team B name" placeholderTextColor={theme.textDark} />
      <View style={s.toggleRow}>
        <Text style={s.toggleLabel}>Tournament (forfeit = 20 pts)</Text>
        <Switch value={tournament} onValueChange={setTournament} trackColor={{ false: theme.btnNeutral, true: theme.btnPrimary }} thumbColor={theme.gold} />
      </View>
      <TouchableOpacity
        style={s.startBtn}
        onPress={() => onStart({ teamA: teamA, teamB: teamB, tournament })}
      >
        <Text style={s.startBtnText}>Start Team Match</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    container: { padding: 16, backgroundColor: t.bg, flex: 1, justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', color: t.gold, textAlign: 'center', marginBottom: 20 },
    teamInput: { backgroundColor: t.surfaceLight, borderRadius: 8, padding: 12, fontSize: 16, color: t.textPrimary, marginBottom: 10 },
    toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 4 },
    toggleLabel: { color: t.textMuted, fontSize: 14 },
    startBtn: { backgroundColor: t.btnPrimary, borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
    startBtnText: { color: t.btnPrimaryText, fontSize: 18, fontWeight: 'bold' },
  });
}
