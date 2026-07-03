import { useCallback, useRef, useEffect } from 'react';

export function useNotificationSound() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isEnabledRef = useRef(false);

    // Initialize audio element
    const initAudio = useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/notification.mp3');
            audioRef.current.volume = 0.9;
        }
    }, []);

    // Enable audio on first user interaction
    useEffect(() => {
        const enableAudio = () => {
            if (!isEnabledRef.current) {
                initAudio();
                // Play and immediately pause to "unlock" audio
                audioRef.current?.play().then(() => {
                    audioRef.current?.pause();
                    audioRef.current!.currentTime = 0;
                    isEnabledRef.current = true;
                }).catch(() => {
                    // Ignore errors during initialization
                });
            }
        };

        // Listen for any user interaction
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });

        return () => {
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
    }, [initAudio]);

    const playSound = useCallback(() => {
        initAudio();

        if (audioRef.current) {
            // Reset to start if already playing
            audioRef.current.currentTime = 0;

            // Play the sound
            audioRef.current.play().catch(() => {
                // Silently fail if audio can't play
            });
        }
    }, [initAudio]);

    return { playSound };
}
