import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function SettingsScreen() {
  const { userData } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const SettingItem = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={Colors.textSecondary} />
      </View>
      <View style={styles.settingDetails}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {userData?.photoURL ? (
            <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Ionicons name="person" size={30} color={Colors.textLight} />
            </View>
          )}
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{userData?.displayName || 'User'}</Text>
          <Text style={styles.profileStatus} numberOfLines={1}>
            {userData?.about || 'Hey there! I am using ChatWave.'}
          </Text>
        </View>
        <Ionicons name="qr-code" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.settingsGroup}>
        <SettingItem 
          icon="key-outline" 
          title="Account" 
          subtitle="Security notifications, change number" 
        />
        <SettingItem 
          icon="lock-closed-outline" 
          title="Privacy" 
          subtitle="Block contacts, disappearing messages" 
        />
        <SettingItem 
          icon="person-circle-outline" 
          title="Avatar" 
          subtitle="Create, edit, profile photo" 
        />
        <SettingItem 
          icon="chatbubbles-outline" 
          title="Chats" 
          subtitle="Theme, wallpapers, chat history" 
        />
        <SettingItem 
          icon="notifications-outline" 
          title="Notifications" 
          subtitle="Message, group & call tones" 
        />
        <SettingItem 
          icon="pie-chart-outline" 
          title="Storage and data" 
          subtitle="Network usage, auto-download" 
        />
        <SettingItem 
          icon="help-circle-outline" 
          title="Help" 
          subtitle="Help center, contact us, privacy policy" 
        />
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={Colors.danger} />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>from</Text>
        <Text style={styles.footerBrand}>Meta</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderAvatar: {
    backgroundColor: Colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 8,
    backgroundColor: Colors.chatBackground,
  },
  settingsGroup: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    padding: 15,
    paddingLeft: 20,
    alignItems: 'center',
  },
  settingIcon: {
    width: 40,
    alignItems: 'flex-start',
  },
  settingDetails: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoutText: {
    fontSize: 16,
    color: Colors.danger,
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },
});
