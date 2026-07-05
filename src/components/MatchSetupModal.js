import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

export default function MatchSetupModal({ visible, teamAName, teamBName, onStart, onCancel }) {
  const { theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);
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
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Set Match Players</Text>
          <View style={s.col}>
            <Text style={s.teamLabel}>{teamAName}</Text>
            <TextInput style={s.input} value={aName} onChangeText={setAName} placeholder="Player name" placeholderTextColor={theme.textDark} />
            <TextInput
              style={s.slInput}
              value={aSl}
              onChangeText={setASl}
              keyboardType="number-pad"
              placeholder="SL"
              placeholderTextColor={theme.textDark}
            />
          </View>
          <Text style={s.vs}>VS</Text>
          <View style={s.col}>
            <Text style={s.teamLabel}>{teamBName}</Text>
            <TextInput style={s.input} value={bName} onChangeText={setBName} placeholder="Player name" placeholderTextColor={theme.textDark} />
            <TextInput
              style={s.slInput}
              value={bSl}
              onChangeText={setBSl}
              keyboardType="number-pad"
              placeholder="SL"
              placeholderTextColor={theme.textDark}
            />
          </View>
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel}>
              <Text style={s.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.startBtn} onPress={handleStart}>
              <Text style={s.startBtnText}>Start Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: t.overlay, justifyContent: 'center', padding: 24 },
    card: { backgroundColor: t.surface, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: t.border },
    title: { fontSize: 18, fontWeight: 'bold', color: t.gold, textAlign: 'center', marginBottom: 16 },
    col: { marginBottom: 10 },
    teamLabel: { fontSize: 12, color: t.textSecondary, fontWeight: 'bold', marginBottom: 4 },
    input: { backgroundColor: t.surfaceLight, borderRadius: 6, padding: 10, fontSize: 15, color: t.textPrimary, marginBottom: 6 },
    slInput: { backgroundColor: t.surfaceLight, borderRadius: 6, padding: 8, fontSize: 14, color: t.gold, width: 60, textAlign: 'center' },
    vs: { fontSize: 14, fontWeight: 'bold', color: t.textDark, textAlign: 'center', marginVertical: 6 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
    cancelBtn: { flex: 1, backgroundColor: t.btnNeutral, borderRadius: 8, padding: 12, alignItems: 'center' },
    cancelBtnText: { color: t.btnNeutralText, fontSize: 15 },
    startBtn: { flex: 1, backgroundColor: t.btnPrimary, borderRadius: 8, padding: 12, alignItems: 'center' },
    startBtnText: { color: t.btnPrimaryText, fontSize: 15, fontWeight: 'bold' },
  });
}
