import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { getChats } from '../../services/chatService';
import { Colors } from '../../constants/colors';

export default function ChatsScreen() {
  const [chats, setChats] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = getChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats);
    });

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }) => {
    // Find the other participant's details
    const otherUserId = item.participants.find(id => id !== user.uid);
    const otherUser = item.participantDetails?.[otherUserId] || { name: 'Unknown User' };

    // Format time
    const timeString = item.lastMessageTime 
      ? new Date(item.lastMessageTime.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item.id}?name=${encodeURIComponent(otherUser.name)}`)}
      >
        <View style={styles.avatarContainer}>
          {otherUser.photo ? (
            <Image source={{ uri: otherUser.photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Ionicons name="person" size={24} color={Colors.textLight} />
            </View>
          )}
        </View>
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>{otherUser.name}</Text>
            <Text style={styles.chatTime}>{timeString}</Text>
          </View>
          <View style={styles.messageRow}>
            {item.lastMessageSender === user.uid && (
              <Ionicons name="checkmark-done" size={16} color={Colors.tickBlue} style={styles.tick} />
            )}
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage || 'Tap to chat'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chats yet. Start a new conversation!</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/new-chat')}
      >
        <Ionicons name="chatbox-ellipses" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderAvatar: {
    backgroundColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tick: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
