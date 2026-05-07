import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const getChats = (userId, callback) => {
  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  });
};

export const getMessages = (chatId, callback) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

export const sendMessage = async (chatId, senderId, text, type = 'text', imageUrl = null) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const chatRef = doc(db, 'chats', chatId);

  const messageData = {
    text,
    senderId,
    timestamp: serverTimestamp(),
    type,
    status: 'sent'
  };

  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }

  // Add message
  await addDoc(messagesRef, messageData);

  // Update chat last message
  await updateDoc(chatRef, {
    lastMessage: type === 'image' ? '📷 Image' : text,
    lastMessageTime: serverTimestamp(),
    lastMessageSender: senderId
  });
};

export const startChat = async (currentUser, otherUser) => {
  // Check if chat already exists
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', currentUser.uid));
  const querySnapshot = await getDocs(q);
  
  let existingChatId = null;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.participants.includes(otherUser.uid)) {
      existingChatId = doc.id;
    }
  });

  if (existingChatId) {
    return existingChatId;
  }

  // Create new chat
  const newChatRef = await addDoc(chatsRef, {
    participants: [currentUser.uid, otherUser.uid],
    participantDetails: {
      [currentUser.uid]: {
        name: currentUser.displayName,
        photo: currentUser.photoURL || null
      },
      [otherUser.uid]: {
        name: otherUser.displayName,
        photo: otherUser.photoURL || null
      }
    },
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    createdAt: serverTimestamp()
  });

  return newChatRef.id;
};

export const searchUsers = async (searchQuery = '') => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  const allUsers = snapshot.docs.map(doc => doc.data());
  
  if (!searchQuery.trim()) {
    return allUsers;
  }
  
  const queryLower = searchQuery.toLowerCase();
  return allUsers.filter(user => {
    const nameMatch = user.displayName ? user.displayName.toLowerCase().includes(queryLower) : false;
    const emailMatch = user.email ? user.email.toLowerCase().includes(queryLower) : false;
    return nameMatch || emailMatch;
  });
};

export const uploadImage = async (uri, chatId) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `${chatId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `chats/${chatId}/${filename}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};
