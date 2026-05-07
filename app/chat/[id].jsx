import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { getMessages, sendMessage, uploadImage } from '../../services/chatService';
import { Colors } from '../../constants/colors';

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { user } = useAuth();
  const flatListRef = useRef();

  useEffect(() => {
    if (!id) return;

    const unsubscribe = getMessages(id, (fetchedMessages) => {
      setMessages(fetchedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      await sendMessage(id, user.uid, textToSend);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUploadingImage(true);
        const imageUrl = await uploadImage(result.assets[0].uri, id);
        await sendMessage(id, user.uid, '', 'image', imageUrl);
      }
    } catch (error) {
      console.error('Error picking/uploading image:', error);
      Alert.alert('Error', 'Could not upload the image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUnsupported = (featureName) => {
    Alert.alert('Feature coming soon', `${featureName} will be available in a future update!`);
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === user.uid;
    const timeString = item.timestamp 
      ? new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          {item.type === 'image' && item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
          ) : null}
          
          {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}
          
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{timeString}</Text>
            {isMyMessage && (
              <Ionicons 
                name={item.status === 'read' ? 'checkmark-done' : 'checkmark-done'} 
                size={14} 
                color={item.status === 'read' ? Colors.tickBlue : Colors.tickGrey} 
                style={styles.messageStatus}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: name || 'Chat',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.backgroundContainer}></View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.iconButton} onPress={() => handleUnsupported('Emoji picker')}>
              <Ionicons name="happy-outline" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Message"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            
            <TouchableOpacity style={styles.iconButton} onPress={handlePickImage} disabled={uploadingImage}>
              {uploadingImage ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons name="attach-outline" size={24} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
            
            {!inputText.trim() && (
              <TouchableOpacity style={styles.iconButton} onPress={() => handleUnsupported('Camera')}>
                <Ionicons name="camera-outline" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={inputText.trim() ? handleSend : () => handleUnsupported('Voice notes')}
          >
            <Ionicons 
              name={inputText.trim() ? "send" : "mic"} 
              size={20} 
              color="white" 
              style={inputText.trim() ? styles.sendIcon : null}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.chatBackground,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.chatBackground,
    zIndex: -1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessageBubble: {
    backgroundColor: Colors.chatBubbleSent,
    borderTopRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: Colors.chatBubbleReceived,
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  messageStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    marginRight: 8,
    paddingHorizontal: 8,
    elevation: 1,
  },
  iconButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  sendIcon: {
    marginLeft: 4,
  },
});
