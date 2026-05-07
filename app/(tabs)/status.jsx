import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function StatusScreen() {
  const { userData } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.myStatusContainer}>
        <View style={styles.avatarContainer}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Ionicons name="person" size={24} color={Colors.textLight} />
            </View>
          )}
          <View style={styles.addIconContainer}>
            <Ionicons name="add" size={16} color="white" />
          </View>
        </View>
        <View style={styles.statusDetails}>
          <Text style={styles.statusTitle}>My status</Text>
          <Text style={styles.statusSubtitle}>Tap to add status update</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.recentUpdatesHeader}>
        <Text style={styles.recentUpdatesText}>Recent updates</Text>
      </View>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent updates</Text>
      </View>

      <TouchableOpacity style={styles.fabSecondary}>
        <Ionicons name="pencil" size={24} color={Colors.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  myStatusContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatarContainer: {
    marginRight: 15,
    position: 'relative',
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
  addIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  statusDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recentUpdatesHeader: {
    padding: 15,
    paddingBottom: 8,
    backgroundColor: Colors.chatBackground,
  },
  recentUpdatesText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
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
  fabSecondary: {
    position: 'absolute',
    bottom: 95,
    right: 28,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
