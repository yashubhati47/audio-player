// App.js
import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    const storedTrackIndex = parseInt(localStorage.getItem('currentTrackIndex')) || 0;
    const storedCurrentTime = parseFloat(localStorage.getItem('currentTime')) || 0;

    setPlaylist(storedPlaylist);
    setCurrentTrackIndex(storedTrackIndex);
    setCurrentTime(storedCurrentTime);
  }, []);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
    localStorage.setItem('currentTime', currentTime);
  }, [playlist, currentTrackIndex, currentTime]);

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (files.length > 0) {
      const newPlaylist = [...playlist];

      for (const file of files) {
        newPlaylist.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
      }

      setPlaylist(newPlaylist);
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
    audioRef.current.currentTime = currentTime;
    audioRef.current.play();
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileChange} multiple />
      <audio
        ref={audioRef}
        src={playlist[currentTrackIndex]?.url}
        controls
        autoPlay
        onEnded={playNextTrack}
        onTimeUpdate={handleTimeUpdate}
        currentTime={currentTime}
      />
      <h2>Playlist</h2>
      <ul>
        {playlist.map((track, index) => (
          <li key={index} onClick={() => playTrack(index)}>
            {track.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioPlayer;
