import { useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

const LEVELS = ['S', 'M', 'L'];
const THEME_KEYS = ['green', 'monokai', 'dark'];
const THEME_LABELS = { green: 'Green', monokai: 'Monokai', dark: 'Dark' };

export default function AccessibilityModal({ visible, onClose }) {
  const { textSize, setTextSize, ballSize, setBallSize, themeKey, setThemeKey, theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.card}>
          <Text style={s.title}>Accessibility</Text>

          <Text style={s.label}>Text Size</Text>
          <View style={s.row}>
            {LEVELS.map((l) => (
              <TouchableOpacity
                key={l}
                style={[s.opt, textSize === l && s.optActive]}
                onPress={() => setTextSize(l)}
              >
                <Text style={[s.optText, textSize === l && s.optTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.label}>Ball Size</Text>
          <View style={s.row}>
            {LEVELS.map((l) => (
              <TouchableOpacity
                key={l}
                style={[s.opt, ballSize === l && s.optActive]}
                onPress={() => setBallSize(l)}
              >
                <Text style={[s.optText, ballSize === l && s.optTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.label}>Theme</Text>
          <View style={s.row}>
            {THEME_KEYS.map((k) => (
              <TouchableOpacity
                key={k}
                style={[s.opt, themeKey === k && s.optActive]}
                onPress={() => setThemeKey(k)}
              >
                <Text style={[s.optText, themeKey === k && s.optTextActive]}>{THEME_LABELS[k]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={s.doneBtn} onPress={onClose}>
            <Text style={s.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: t.overlay, justifyContent: 'center', padding: 24 },
    card: { backgroundColor: t.surface, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: t.border },
    title: { fontSize: 20, fontWeight: 'bold', color: t.gold, textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 14, color: t.textSecondary, fontWeight: 'bold', marginBottom: 8, marginTop: 4 },
    row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
    opt: { flex: 1, backgroundColor: t.optBg, borderRadius: 8, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: t.optBorder },
    optActive: { borderColor: t.gold, backgroundColor: t.optActiveBg },
    optText: { fontSize: 18, fontWeight: 'bold', color: t.optText },
    optTextActive: { color: t.gold },
    doneBtn: { backgroundColor: t.btnPrimary, borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4 },
    doneBtnText: { color: t.btnPrimaryText, fontSize: 16, fontWeight: 'bold' },
  });
}
