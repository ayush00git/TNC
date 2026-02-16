# TNC (The Nerds Community)

TNC is a comprehensive, real-time communication platform designed for tech enthusiasts. It facilitates connection, discussion, and collaboration through dedicated chat rooms, providing a seamless experience across web and mobile interfaces.

## Project Structure

This repository is organized as a monorepo containing the following components:

-   **[Backend](backend/README.md)**: A Node.js and Express 5 server managing business logic, data persistence with MongoDB, and real-time orchestration via Socket.io.
-   **[Frontend](frontend/README.md)**: A high-performance web application built with React 19, Vite, and Tailwind CSS 4, featuring smooth GSAP animations.
-   **[Mobile](tnc-mobile/README.md)**: A cross-platform mobile application developed with Expo and React Native.

## Core Features

-   **Cross-Platform Synchronization**: Unified experience across web and mobile applications.
-   **Real-time Communication**: Low-latency messaging in specialized chat rooms powered by WebSockets.
-   **Secure Authentication**: Robust user management including registration, multi-method password recovery, and email verification.
-   **Content Management**: Full CRUD capabilities for blog posts with markdown support and syntax highlighting.
-   **Project Showcase**: A dedicated space for community members to share and explore technical projects.
-   **Push Notifications**: Real-time updates delivered to mobile devices via Expo Notifications.
-   **Rich Media**: Support for image sharing and code snippet distribution within chat environments.

## Tech Stack Summary

### Backend
-   Node.js, Express 5, TypeScript
-   MongoDB with Mongoose ODM
-   Socket.io (WebSockets)
-   AWS S3 (Blob Storage)
-   Nodemailer (Communication)

### Frontend (Web)
-   React 19, Vite, TypeScript
-   Tailwind CSS 4
-   GSAP & Lenis (Animations and Smooth Scrolling)
-   Socket.io-client
-   React Markdown

### Mobile App
-   Expo, React Native, TypeScript
-   React Navigation
-   Socket.io-client
-   Async Storage (Local Persistence)

## Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   MongoDB instance (Local or Atlas)
-   Expo Go app (for mobile development)

### Quick Setup

1.  **Initialize Backend**:
    ```bash
    cd backend
    npm install
    # Configure .env based on .env.local
    npm run dev
    ```

2.  **Initialize Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Initialize Mobile**:
    ```bash
    cd tnc-mobile
    npm install
    npx expo start
    ```

For detailed configuration options and API documentation, please refer to the README files within each subdirectory.

## Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a Pull Request.
