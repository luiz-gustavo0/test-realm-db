import React from 'react';
import { ModalProps, StyleSheet, View, Modal } from 'react-native';

interface Props extends ModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export function CustomModal({ visible, onClose, children, ...rest }: Props) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={onClose}
      {...rest}>
      <View style={styles.container}>{children}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
