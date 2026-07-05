import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';

export default function NameEditModal({ visible, playerName, currentSl, onSave, onClose }) {
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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Player</Text>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
            selectTextOnFocus
            placeholder="Player name"
            placeholderTextColor="#666"
          />
          <Text style={styles.slLabel}>Skill Level</Text>
          <View style={styles.slRow}>
            {[1,2,3,4,5,6,7,8,9].map((n) => (
              <TouchableOpacity
                key={n}
                style={[styles.slBtn, sl === n && styles.slBtnActive]}
                onPress={() => setSl(n)}
              >
                <Text style={[styles.slBtnText, sl === n && styles.slBtnTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.7}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#1a3a1a',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a5a2a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#0d1f0d',
    borderRadius: 10,
    padding: 12,
    fontSize: 18,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#2a5a2a',
    marginBottom: 12,
    textAlign: 'center',
  },
  slLabel: {
    fontSize: 13,
    color: '#8a8',
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
    backgroundColor: '#0d1f0d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a5a2a',
  },
  slBtnActive: {
    borderColor: '#ffd700',
    backgroundColor: '#2a4a2a',
  },
  slBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#aaa',
  },
  slBtnTextActive: {
    color: '#ffd700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#2e7d32',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
