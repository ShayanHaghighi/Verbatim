import {useEffect, useRef} from "react";

function BackgroundMusic({url, loop}: { url: string; loop: boolean | undefined }) {
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(url);
        audioRef.current.loop = loop ?? false;
        audioRef.current.volume = 0.5; // optional
        audioRef.current.play().catch(() => {
            // autoplay might be blocked until user interaction
            console.log("Autoplay blocked");
        });

        return () => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, []);

    return null; // or any UI you want
}

export default BackgroundMusic;
