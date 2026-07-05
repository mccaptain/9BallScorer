import { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

export default function NameEditModal({ visible, playerName, currentSl, onSave, onClose }) {
  const { theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);
  const [text, setText] = useState(playerName);
  const [sl, setSl] = useState(currentSl);

  const handleSave = () => {
    const trimmed = text.trim();
    if (trimmed) {
      onSave(trimmed, sl);
    }
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={s.overlay}>
        <View style={s.modal}>
          <Text style={s.title}>Edit Player</Text>
          <TextInput
            style={s.input}
            value={text}
            onChangeText={setText}
            autoFocus
            selectTextOnFocus
            placeholder="Player name"
            placeholderTextColor={theme.textDark}
          />
          <Text style={s.slLabel}>Skill Level</Text>
          <View style={s.slRow}>
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <TouchableOpacity
                key={n}
                style={[s.slBtn, sl === n && s.slBtnActive]}
                onPress={() => setSl(n)}
              >
                <Text style={[s.slBtnText, sl === n && s.slBtnTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.buttons}>
            <TouchableOpacity style={s.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.7}>
              <Text style={s.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: t.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: t.surfaceLight,
      borderRadius: 16,
      padding: 24,
      width: '85%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: t.borderLight,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: t.gold,
      marginBottom: 16,
    },
    input: {
      width: '100%',
      backgroundColor: t.inputBg,
      borderRadius: 10,
      padding: 12,
      fontSize: 18,
      color: t.inputText,
      borderWidth: 1,
      borderColor: t.borderLight,
      marginBottom: 12,
      textAlign: 'center',
    },
    slLabel: {
      fontSize: 13,
      color: t.textSecondary,
      fontWeight: 'bold',
      marginBottom: 8,
      alignSelf: 'flex-start',
    },
    slRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 16,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    slBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: t.inputBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: t.borderLight,
    },
    slBtnActive: {
      borderColor: t.gold,
      backgroundColor: t.surfaceLighter,
    },
    slBtnText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: t.textMuted,
    },
    slBtnTextActive: {
      color: t.gold,
    },
    buttons: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
    },
    cancelBtn: {
      flex: 1,
      backgroundColor: t.btnNeutral,
      borderRadius: 10,
      padding: 14,
      alignItems: 'center',
    },
    cancelText: {
      color: t.btnNeutralText,
      fontSize: 16,
      fontWeight: 'bold',
    },
    saveBtn: {
      flex: 1,
      backgroundColor: t.btnPrimary,
      borderRadius: 10,
      padding: 14,
      alignItems: 'center',
    },
    saveText: {
      color: t.btnPrimaryText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
