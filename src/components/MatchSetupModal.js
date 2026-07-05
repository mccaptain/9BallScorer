import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

export default function MatchSetupModal({ visible, teamAName, teamBName, onStart, onCancel }) {
  const [aName, setAName] = useState('');
  const [aSl, setASl] = useState('4');
  const [bName, setBName] = useState('');
  const [bSl, setBSl] = useState('4');

  function handleStart() {
    onStart({
      aPlayer: aName.trim() || `${teamAName} Player`,
      aSl: Math.min(9, Math.max(1, parseInt(aSl, 10) || 4)),
      bPlayer: bName.trim() || `${teamBName} Player`,
      bSl: Math.min(9, Math.max(1, parseInt(bSl, 10) || 4)),
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Set Match Players</Text>
          <View style={styles.col}>
            <Text style={styles.teamLabel}>{teamAName}</Text>
            <TextInput style={styles.input} value={aName} onChangeText={setAName} placeholder="Player name" placeholderTextColor="#666" />
            <TextInput
              style={styles.slInput}
              value={aSl}
              onChangeText={setASl}
              keyboardType="number-pad"
              placeholder="SL"
              placeholderTextColor="#666"
            />
          </View>
          <Text style={styles.vs}>VS</Text>
          <View style={styles.col}>
            <Text style={styles.teamLabel}>{teamBName}</Text>
            <TextInput style={styles.input} value={bName} onChangeText={setBName} placeholder="Player name" placeholderTextColor="#666" />
            <TextInput
              style={styles.slInput}
              value={bSl}
              onChangeText={setBSl}
              keyboardType="number-pad"
              placeholder="SL"
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
              <Text style={styles.startBtnText}>Start Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#142814', borderRadius: 12, padding: 20, borderWidth: 1, borderColor: '#2a4a2a' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#ffd700', textAlign: 'center', marginBottom: 16 },
  col: { marginBottom: 10 },
  teamLabel: { fontSize: 12, color: '#8a8', fontWeight: 'bold', marginBottom: 4 },
  input: { backgroundColor: '#1a3a1a', borderRadius: 6, padding: 10, fontSize: 15, color: '#fff', marginBottom: 6 },
  slInput: { backgroundColor: '#1a3a1a', borderRadius: 6, padding: 8, fontSize: 14, color: '#ffd700', width: 60, textAlign: 'center' },
  vs: { fontSize: 14, fontWeight: 'bold', color: '#666', textAlign: 'center', marginVertical: 6 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#333', borderRadius: 8, padding: 12, alignItems: 'center' },
  cancelBtnText: { color: '#aaa', fontSize: 15 },
  startBtn: { flex: 1, backgroundColor: '#2e7d32', borderRadius: 8, padding: 12, alignItems: 'center' },
  startBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
