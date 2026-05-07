import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function CallsScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.createLinkContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="link" size={24} color="white" />
        </View>
        <View style={styles.linkDetails}>
          <Text style={styles.linkTitle}>Create call link</Text>
          <Text style={styles.linkSubtitle}>Share a link for your WhatsApp call</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.recentHeader}>
        <Text style={styles.recentText}>Recent</Text>
      </View>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No recent calls</Text>
      </View>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="call" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  createLinkContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconContainer: {
    marginRight: 15,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  linkSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recentHeader: {
    padding: 15,
    paddingBottom: 8,
    backgroundColor: Colors.background,
  },
  recentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
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
});
