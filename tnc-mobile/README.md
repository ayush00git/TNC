# TNC Mobile

The TNC Mobile application is a cross-platform mobile app developed using Expo and React Native, providing a seamless experience for real-time chat and community interactions.

## Tech Stack

-   **Framework**: Expo (~54.0.30) / React Native
-   **Navigation**: React Navigation (Native Stack)
-   **Real-time**: Socket.io-client
-   **HTTP Client**: Axios
-   **Storage**: React Native Async Storage
-   **Notifications**: Expo Notifications
-   **Permissions**: Expo Device and Image Picker

## Project Structure

```text
tnc-mobile/
├── assets/         # App icons and images
├── components/     # UI components (Buttons, Inputs, etc.)
├── context/        # React Context for global state (e.g., Toast)
├── hooks/          # Custom hooks (e.g., Push Notifications)
├── screens/        # Screen-level components (Login, Chat, Room)
├── services/       # API clients and socket management
├── types/          # TypeScript definitions
├── App.tsx         # App entry point and navigation setup
└── index.ts        # Entry point for development
```

## Architecture

### 1. Real-time Features
The app leverages Socket.io for real-time messaging. It manages socket connections within the `services/socket.ts` and integrates them into the `ChatScreen`.

### 2. Push Notifications
Integrates with Expo Notifications to provide real-time updates even when the app is in the background. Token synchronization with the backend is handled in `App.tsx`.

### 3. Navigation and Auth Flow
The application uses a Native Stack navigator. It performs an initial token check from `AsyncStorage` to determine whether to show the Welcome/Login screens or navigate directly to the chat Rooms.

## Setup and Development

### Prerequisites
-   Node.js installed.
-   Expo Go app on your physical device or an emulator.

### Installation
1.  Navigate to the mobile directory:
    ```bash
    cd tnc-mobile
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration
The mobile app requires a backend API URL. Create a `.env` file in the `tnc-mobile` directory:

| Variable | Description |
| :--- | :--- |
| `EXPO_PUBLIC_API_URL` | The URL of your backend server (e.g., http://192.168.1.5:8001) |

Note: When testing on a physical device, use your machine's local IP address instead of `localhost`.

### Running the application
-   **Start**: `npm start` (opens Expo Dev Tools)
-   **Android**: `npm run android`
-   **iOS**: `npm run ios`
-   **Web**: `npm run web`
