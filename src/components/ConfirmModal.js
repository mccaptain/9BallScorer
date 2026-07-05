import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useAccessibility } from '../context/AccessibilityContext';

export default function ConfirmModal({ visible, title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) {
  const { theme } = useAccessibility();
  const s = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={s.overlay}>
        <View style={s.modal}>
          <Text style={s.title}>{title}</Text>
          {message && <Text style={s.message}>{message}</Text>}
          <View style={s.buttons}>
            <TouchableOpacity style={s.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
              <Text style={s.cancelText}>{cancelLabel || 'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.confirmBtn} onPress={onConfirm} activeOpacity={0.7}>
              <Text style={s.confirmText}>{confirmLabel || 'Confirm'}</Text>
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
      width: '75%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: t.borderLight,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: t.gold,
      marginBottom: 8,
    },
    message: {
      fontSize: 14,
      color: t.textMuted,
      textAlign: 'center',
      marginBottom: 20,
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
    confirmBtn: {
      flex: 1,
      backgroundColor: t.btnDanger,
      borderRadius: 10,
      padding: 14,
      alignItems: 'center',
    },
    confirmText: {
      color: t.btnDangerText,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
