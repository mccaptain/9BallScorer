import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';

export default function TeamSetupScreen({ onStart }) {
  const [teamA, setTeamA] = useState('Team A');
  const [teamB, setTeamB] = useState('Team B');
  const [tournament, setTournament] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Match Setup</Text>
      <TextInput style={styles.teamInput} value={teamA} onChangeText={setTeamA} placeholder="Team A name" placeholderTextColor="#666" />
      <TextInput style={styles.teamInput} value={teamB} onChangeText={setTeamB} placeholder="Team B name" placeholderTextColor="#666" />
      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Tournament (forfeit = 20 pts)</Text>
        <Switch value={tournament} onValueChange={setTournament} trackColor={{ false: '#333', true: '#2e7d32' }} thumbColor="#ffd700" />
      </View>
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => onStart({ teamA: teamA, teamB: teamB, tournament })}
      >
        <Text style={styles.startBtnText}>Start Team Match</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0d1f0d', flex: 1, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffd700', textAlign: 'center', marginBottom: 20 },
  teamInput: { backgroundColor: '#1a3a1a', borderRadius: 8, padding: 12, fontSize: 16, color: '#fff', marginBottom: 10 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 4 },
  toggleLabel: { color: '#aaa', fontSize: 14 },
  startBtn: { backgroundColor: '#2e7d32', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
