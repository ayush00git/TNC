import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Dimensions, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import client from '../services/client'; // Import client
import { Room } from '../types'; // Import Room type
import { useToast } from '../context/ToastContext';

// UI Helper to map generic rooms to icons/colors if they don't have them
const getRoomStyle = (index: number) => {
  const styles = [
    { icon: 'box', color: '#6366f1' },
    { icon: 'hash', color: '#8b5cf6' },
    { icon: 'cpu', color: '#ec4899' },
    { icon: 'cloud', color: '#0ea5e9' },
    { icon: 'pen-tool', color: '#f43f5e' },
    { icon: 'layout', color: '#10b981' },
    { icon: 'server', color: '#f59e0b' },
  ];
  return styles[index % styles.length] as { icon: keyof typeof Feather.glyphMap; color: string };
};

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function RoomScreen({ navigation }: any) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await client.get('/api/room/allRooms');
      // response.data.rooms is the array based on controller
      setRooms(response.data.rooms);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      showToast('Failed to load rooms', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (room: Room) => {
    // Optional: Call join API first if needed, but for now we just enter navigation
    // The backend `handleJoining` is mapped to `GET /:roomId/join` which is unconventional (GET usually safe).
    // Let's call it to ensure membership is recorded if the backend requires it.
    try {
      await client.get(`/api/room/${room.roomId}/join`);
    } catch (error) {
      console.log("Join room silent fail (maybe already joined or error)", error);
      // Continue anyway to let user see chat
    }

    navigation.navigate('Chat', {
      roomTitle: room.title,
      roomId: room.roomId // Pass String ID for API lookups (e.g. "general")
    });
  };

  const renderRoomCard = ({ item, index }: { item: Room; index: number }) => {
    const style = getRoomStyle(index);
    const iconName = item.iconName ? (item.iconName as keyof typeof Feather.glyphMap) : style.icon;
    const color = item.color || style.color;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleJoinRoom(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Feather name={iconName} size={24} color={color} />
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.title}>Choose a Room</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={fetchRooms}>
          {/* Refresh logic */}
          <View style={styles.avatarPlaceholder}>
            <Feather name="refresh-cw" size={18} color="#818cf8" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Grid List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoomCard}
          keyExtractor={item => item._id}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>No active rooms found.</Text>
          }
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060010',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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