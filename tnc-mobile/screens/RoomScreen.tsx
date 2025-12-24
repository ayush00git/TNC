import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Dimensions, StatusBar, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// Types
interface Room {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Feather.glyphMap;
  color: string;
}

// Data
const ROOMS: Room[] = [
  { id: '1', title: 'Blockchain', description: 'Web3 & DeFi Protocol', iconName: 'box', color: '#6366f1' },
  { id: '2', title: 'Yaps', description: 'General Discussion', iconName: 'hash', color: '#8b5cf6' },
  { id: '3', title: 'AI/ML', description: 'Neural Networks', iconName: 'cpu', color: '#ec4899' },
  { id: '4', title: 'Cloud', description: 'AWS/Azure Arch', iconName: 'cloud', color: '#0ea5e9' },
  { id: '5', title: 'Design', description: 'UI/UX Systems', iconName: 'pen-tool', color: '#f43f5e' },
  { id: '6', title: 'Frontend', description: 'React & CSS', iconName: 'layout', color: '#10b981' },
  { id: '7', title: 'Backend', description: 'DB & API Design', iconName: 'server', color: '#f59e0b' },
];

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // Calculate width for 2 columns with padding

export default function RoomScreen({ navigation }: any) {

  const handleJoinRoom = (room: Room) => {
    navigation.navigate('Chat', { 
      roomTitle: room.title,
      roomId: room.id 
    });
  };

  const renderRoomCard = ({ item }: { item: Room }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleJoinRoom(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
        <Feather name={item.iconName} size={24} color={item.color} />
      </View>
      
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.joinText}>Join</Text>
        <Ionicons name="arrow-forward" size={14} color="#64748b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.title}>Choose a Room</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.avatarPlaceholder}>
             <Text style={styles.avatarText}>A</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Grid List */}
      <FlatList
        data={ROOMS}
        renderItem={renderRoomCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060010',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e1b4b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  avatarText: {
    color: '#818cf8',
    fontSize: 18,
    fontWeight: '600',
  },
  gridContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: '#0A0514',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 16,
    height: 36, // Fixed height for 2 lines
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
});