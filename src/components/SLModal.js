import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const SL_TARGETS = {
  1: 14, 2: 19, 3: 25, 4: 31, 5: 38,
  6: 46, 7: 55, 8: 65, 9: 75,
};

export default function SLModal({ visible, playerName, currentSl, onSelect, onClose }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{playerName}</Text>
          <Text style={styles.sub}>Select Skill Level</Text>
          <View style={styles.grid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((sl) => (
              <TouchableOpacity
                key={sl}
                style={[
                  styles.slBtn,
                  sl === currentSl && styles.slBtnActive,
                ]}
                onPress={() => {
                  onSelect(sl);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.slValue, sl === currentSl && styles.slValueActive]}>
                  {sl}
                </Text>
                <Text style={[styles.slTarget, sl === currentSl && styles.slTargetActive]}>
                  {SL_TARGETS[sl]}pts
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
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
    borderWidth: 2,
    borderColor: '#2a5a2a',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sub: {
    fontSize: 14,
    color: '#8a8',
    marginBottom: 16,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  slBtn: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#2a4a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a5a3a',
  },
  slBtnActive: {
    borderColor: '#ffd700',
    backgroundColor: '#2d4d1a',
  },
  slValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ddd',
  },
  slValueActive: {
    color: '#ffd700',
  },
  slTarget: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  slTargetActive: {
    color: '#8a8',
  },
  cancel: {
    marginTop: 16,
    padding: 10,
  },
  cancelText: {
    color: '#888',
    fontSize: 16,
  },
});
