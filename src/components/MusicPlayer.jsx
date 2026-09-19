import React, { useState, useRef } from 'react';
import { songsData } from '../data/musicData';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaSearch, FaVolumeUp } from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [currentSong, setCurrentSong] = useState(songsData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [volume, setVolume] = useState(1);

  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSongSelect = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current.play();
    }, 100);
  };

  const handleNext = () => {
    const currentIndex = songsData.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songsData.length;
    handleSongSelect(songsData[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = songsData.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songsData.length) % songsData.length;
    handleSongSelect(songsData[prevIndex]);
  };

  const filteredSongs = songsData.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || song.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="spotify-container">
      <h1 className="header-title">Spotify <span>Web Player</span></h1>

      {/* Search Bar & Categorization */}
      <div className="top-controls">
        <div className="search-wrapper">
          <FaSearch style={{ position: 'absolute', left: '14px', top: '15px', color: '#b3b3b3' }} />
          <input 
            type="text" 
            placeholder="Search songs, artists..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {['All', 'Pop', 'Lofi', 'Electronic'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Player Section */}
      <div className="hero-player">
        <img src={currentSong.cover} alt={currentSong.title} className="hero-cover" />
        <div className="hero-details">
          <span className="hero-tag">{currentSong.category}</span>
          <h2 className="hero-song-title">{currentSong.title}</h2>
          <p className="hero-artist">{currentSong.artist}</p>

          <audio ref={audioRef} src={currentSong.src} volume={volume} onEnded={handleNext} />

          <div className="playback-controls">
            <button onClick={handlePrev} className="control-icon"><FaStepBackward /></button>
            <button onClick={togglePlay} className="play-pause-circle">
              {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: '2px' }} />}
            </button>
            <button onClick={handleNext} className="control-icon"><FaStepForward /></button>
          </div>
        </div>

        <div className="volume-wrapper">
          <FaVolumeUp />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => {
              setVolume(e.target.value);
              if(audioRef.current) audioRef.current.volume = e.target.value;
            }}
          />
        </div>
      </div>

      {/* Playlist Section */}
      <div>
        <h3 className="playlist-heading">Playlist</h3>
        <div>
          {filteredSongs.map((song) => (
            <div 
              key={song.id} 
              onClick={() => handleSongSelect(song)}
              className={`playlist-row ${currentSong.id === song.id ? 'active' : ''}`}
            >
              <div className="row-left">
                <img src={song.cover} alt={song.title} className="row-cover" />
                <div>
                  <h4 style={{ fontWeight: 600, margin: '0 0 4px 0', fontSize: '0.95rem' }}>{song.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#b3b3b3', margin: 0 }}>{song.artist}</p>
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#b3b3b3' }}>{song.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;