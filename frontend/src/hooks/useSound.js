import { useCallback } from "react";
import likeSound from "../assets/like.mp3";
import commentSound from "../assets/comment.mp3";
import followSound from "../assets/follow.mp3";

export const useSound = () => {
  // Play sound based on action type
  const playSound = useCallback((type) => {
    let soundFile;

    switch (type) {
      case "like":
        soundFile = likeSound;
        break;
      case "comment":
        soundFile = commentSound;
        break;
      case "follow":
        soundFile = followSound;
        break;
      default:
        return;
    }

    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((error) => {
        console.log("Audio play error:", error);
      });
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  }, []);

  return { playSound };
};
