# TNC Frontend

The frontend for the TNC project is a high-performance web application built with React, Vite, and Tailwind CSS. It focuses on a premium user experience with smooth animations and real-time capabilities.

## Tech Stack

-   **Framework**: React (v19)
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS (v4)
-   **Animations**: GSAP
-   **Smooth Scrolling**: Lenis
-   **Real-time**: Socket.io-client
-   **HTTP Client**: Axios
-   **Content Rendering**: React Markdown with Highlight.js

## Project Structure

```text
frontend/
├── public/         # Static assets
├── src/
│   ├── assets/     # Images and styles
│   ├── components/ # Reusable UI components
│   ├── hooks/      # Custom React hooks
│   ├── Pages/      # Page-level components (Home, Blog, Chat, etc.)
│   ├── services/   # External service clients (Socket.io)
│   ├── App.tsx     # Main application component
│   └── main.tsx    # Application entry point
├── index.html      # HTML template
├── vite.config.ts  # Vite configuration and proxy setup
└── tsconfig.json   # TypeScript configuration
```

## Architecture

### 1. Interactive Routing
The application uses `react-router-dom` for client-side routing. Key pages include a dynamic home page, comprehensive blog management (read, write, edit), and a real-time chat interface.

### 2. Design and Experience
-   **Modern UI**: Utilizes Tailwind CSS 4 for a utility-first design system.
-   **Smooth Transitions**: Integrated GSAP and Lenis for cinematic scrolling and fluid animations.
-   **Markdown Support**: Blogs support full markdown rendering with syntax highlighting.

### 3. Real-time Communication
The frontend connects to the backend via Socket.io for real-time room-based chatting, managed in `src/services/socket.ts`.

## Setup and Development

### Prerequisites
-   Node.js installed.
-   Backend server running (default expects http://localhost:8001).

### Installation
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration
The frontend uses a Vite proxy to communicate with the backend during development. This is configured in `vite.config.ts`.

If production environment variables are needed, create a `.env` file following standard Vite conventions.

### Running the application
-   **Development**: `npm run dev` (starts the Vite development server)
-   **Build**: `npm run build` (generates an optimized production build in the `dist` folder)
-   **Preview**: `npm run preview` (previews the production build locally)
