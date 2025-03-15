import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Meditation.css';

const Meditation = () => {
  const song = useRef(null);
  const video = useRef(null);
  const playButton = useRef(null);
  const outline = useRef(null);
  const timeDisplay = useRef(null);
  const [fakeDuration, setFakeDuration] = useState(600);
  const [isPlaying, setIsPlaying] = useState(false);

  const outlineLength = 2 * Math.PI * 216.5;

  useEffect(() => {
    outline.current.style.strokeDashoffset = outlineLength;
    outline.current.style.strokeDasharray = outlineLength;
    timeDisplay.current.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`;
  }, [fakeDuration, outlineLength]);

  const checkPlaying = () => {
    if (song.current.paused) {
      song.current.play();
      video.current.play();
      playButton.current.src = '../svg/pause.svg';
      setIsPlaying(true);
    } else {
      song.current.pause();
      video.current.pause();
      playButton.current.src = '../svg/play.svg';
      setIsPlaying(false);
    }
  };

  const restartSong = () => {
    song.current.currentTime = 0;
    console.log('Restarted song');
  };

  const handleTimeSelect = (time) => {
    setFakeDuration(time);
    timeDisplay.current.textContent = `${Math.floor(time / 60)}:${Math.floor(time % 60)}`;
  };

  const handleSoundChange = async (sound, videoSrc) => {
    const wasPlaying = !song.current.paused;
    song.current.pause();
    video.current.pause();
    song.current.src = sound;
    video.current.src = videoSrc;
    await song.current.load();
    await video.current.load();
    if (wasPlaying) {
      song.current.play();
      video.current.play();
    }
  };

  const handleTimeUpdate = () => {
    const currentTime = song.current.currentTime;
    const elapsed = fakeDuration - currentTime;
    const seconds = Math.floor(elapsed % 60);
    const minutes = Math.floor(elapsed / 60);
    timeDisplay.current.textContent = `${minutes}:${seconds}`;

    const progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
    outline.current.style.strokeDashoffset = progress;

    if (currentTime >= fakeDuration) {
      song.current.pause();
      song.current.currentTime = 0;
      playButton.current.src = '../svg/play.svg';
      video.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="app">
      <nav className="meditation-nav">
        <Link to="/home" className="back-button">← Back to Home</Link>
        <h1 className='session-head'>Meditation Session</h1>
      </nav>
      <div className="vid-container">
        <video ref={video} loop>
          <source src="../video/rain.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="time-select">
        <button onClick={() => handleTimeSelect(120)}>2 Minutes</button>
        <button onClick={() => handleTimeSelect(300)} className="medium-mins">5 Minutes</button>
        <button onClick={() => handleTimeSelect(600)} className="long-mins">10 Minutes</button>
      </div>
      <div className="player-container">
        <audio ref={song} onTimeUpdate={handleTimeUpdate}>
          <source src="../sounds/rain.mp3" />
        </audio>
        <img ref={playButton} src="../svg/play.svg" className="play" onClick={checkPlaying} alt="play button" />
        <svg className="track-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="226.5" cy="226.5" r="216.5" stroke="white" strokeWidth="20" />
        </svg>
        <svg ref={outline} className="moving-outline" width="453" height="453" viewBox="0 0 453 453" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="226.5" cy="226.5" r="216.5" stroke="#018EBA" strokeWidth="20" />
        </svg>
        <img src="../svg/replay.svg" className="replay" onClick={restartSong} alt="replay button" />
        <h3 ref={timeDisplay} className="time-display">0:00</h3>
      </div>
      <div className="sound-picker">
        <button onClick={() => handleSoundChange('../sounds/rain.mp3', '../video/rain.mp4')}><img src="../svg/rain.svg" alt="rain" /></button>
        <button onClick={() => handleSoundChange('../sounds/beach.mp3', '../video/beach.mp4')}><img src="../svg/beach.svg" alt="beach" /></button>
      </div>
    </div>
  );
};

export default Meditation;