# TNC (The Nerds Community)

A real-time chat application designed for tech enthusiasts to connect, discuss, and collaborate in dedicated rooms. Built with a modern full-stack architecture using React and Node.js.

## Repositories

This monorepo contains:
- **`tnc-mobile`**: The React Native mobile application (Expo).
- **`backend`**: The Node.js/Express server with MongoDB and Socket.io.
- **`frontend`**: (Optional/Legacy) Web frontend interface.

## Tech Stack

### Mobile App
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack)
- **Styling**: StyleSheet (Custom Dark Theme)
- **State/Storage**: Context API, Async Storage
- **HTTP Client**: Axios
- **Socket**: Socket.io

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io (Ready for integration)
- **Authentication**: JWT & Cookies
- **Email**: Nodemailer (Gmail SMTP)

## Features

- **Authentication**: Sign Up, Login, and Forgot Password (via OTP/Link).
- **Rooms**: specialized chat rooms (Blockchain, AI/ML, Frontend, etc.).
- **Real-time Chat**: Instant messaging in rooms.
- **Rich Media**: Image and Code snippet sharing.
- **Persistent Logic**: Auto-login via Async Storage tokens.
- **Modern UI**: Dark mode aesthetic with custom Toast notifications.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Instance (Local or Atlas)
- Expo Go on your phone or an emulator.

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file based on .env.local (PORT, MONGO_URL, JWT_SECRET, etc.)
npm run dev
```

### 2. Mobile Setup
```bash
cd tnc-mobile
npm install
# Create .env file with EXPO_PUBLIC_API_URL=http://<YOUR_IP>:8001
npm expo start
```

## 🤝 Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
