import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { IoVolumeHighOutline } from "react-icons/io5";
import { CiVolumeMute } from "react-icons/ci";
function VideoPlayer({ media }) {
  const videoTag = useRef();
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const handleClick = () => {
    if (isPlaying) {
      videoTag.current.pause();
      setIsPlaying(false);
    } else {
      videoTag.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoTag.current;
          if (video) {
            if (entry.isIntersecting) {
              video.play();
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.6 },
    );

    if (videoTag.current) {
      observer.observe(videoTag.current);
    }

    return () => {
      if (videoTag.current) {
        observer.unobserve(videoTag.current);
      }
    };
  }, []);

  return (
    <div className="h-full relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        src={media}
        ref={videoTag}
        autoPlay
        loop
        muted={mute}
        className="h-full cursor-pointer w-full object-cover rounded-2xl"
        onClick={handleClick}
      />
      <div
        className="absolute bottom-1.5 right-2.5 p-2 rounded-full flex items-center justify-center z-50 cursor-pointer"
        onClick={() => {
          setMute((prev) => !prev);
        }}
      >
        {!mute ? (
          <IoVolumeHighOutline className="w-5 h-5 text-white cursor-pointer" />
        ) : (
          <CiVolumeMute className="w-5 h-5 text-white cursor-pointer" />
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
