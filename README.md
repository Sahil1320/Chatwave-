# ChatWave 🌊

![ChatWave](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)

ChatWave is a cross-platform real-time messaging application built with React Native and Expo, inspired by the core functionalities of WhatsApp. It provides a seamless communication experience with instant message delivery and secure authentication.

## 🚀 Features

- **Real-Time Messaging:** Instant message synchronization across devices using Firebase Firestore.
- **Secure Authentication:** User login and registration powered by Firebase Authentication.
- **Dynamic Routing:** Smooth, native-like navigation and nested layouts handled via Expo Router.
- **Responsive UI:** A mobile-first, intuitive user interface mirroring modern chat applications.
- **Cross-Platform:** Designed to run seamlessly on both Android and iOS devices.

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo, React Navigation (Expo Router)
- **Backend/Database:** Firebase (Firestore)
- **Authentication:** Firebase Auth

## ⚙️ Installation & Setup

To run this project locally on your machine, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahil1320/Chatwave-.git
   cd Chatwave-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a project on the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore Database** and **Authentication** (Email/Password or Google Sign-In).
   - Ensure your Firebase config object is properly setup in `config/firebase.js`.

4. **Start the application**
   ```bash
   npx expo start
   ```

5. **Run on Device/Emulator**
   - Press `a` to open on Android emulator.
   - Press `i` to open on iOS simulator.
   - Or scan the QR code with the Expo Go app on your physical mobile device.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Sahil1320/Chatwave-/issues).

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
