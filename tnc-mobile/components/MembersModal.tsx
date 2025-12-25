import React from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, SafeAreaView, Platform, StatusBar
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// --- Types ---
export interface Member {
  id: string | number;
  name: string;
  avatar: string;
}

interface MembersModalProps {
  visible: boolean;
  onClose: () => void;
  members?: Member[]; // Optional: if you pass data from parent
  roomTitle?: string;
  currentUserId?: string;
}

// --- Mock Data (Fallback) ---
const MOCK_MEMBERS: Member[] = [
  { id: 1, name: "Alex Dev", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Alex" },
  { id: 2, name: "Sarah Chen", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Sarah" },
  { id: 3, name: "Mike Ross", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Mike" },
  { id: 4, name: "Jessica Suits", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Jessica" },
  { id: 5, name: "Harvey Specter", avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Harvey" },
];

export default function MembersModal({ visible, onClose, members = MOCK_MEMBERS, roomTitle = "Room Members", currentUserId }: MembersModalProps) {

  const renderMember = ({ item }: { item: Member }) => (
    <View style={styles.memberRow}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.memberName}>
          {item.name} {String(item.id) === String(currentUserId) ? "(You)" : ""}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* The Modal Card */}
        <View style={styles.modalContainer}>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{roomTitle}</Text>
              <Text style={styles.subtitle}>{members.length} members</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer Action (Optional) */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.inviteButton}>
              <Feather name="user-plus" size={18} color="#fff" />
              <Text style={styles.inviteText}>Invite People</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)', // Dimmed background
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0A0514', // Slightly lighter than pure black bg
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%', // Takes up bottom 80% of screen
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#1A1625',
    borderRadius: 12,
  },
  listContent: {
    padding: 24,
  },
  // Member Row
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#1e1b4b',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
  },

  // Footer
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  inviteButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  inviteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});