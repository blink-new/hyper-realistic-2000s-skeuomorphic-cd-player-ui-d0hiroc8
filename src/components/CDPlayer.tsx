import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { CDTray } from './CDTray';
import { Controls } from './Controls';
import { CDLibrary } from './CDLibrary';
import { useMousePosition } from '../hooks/useMousePosition';

interface CDData {
  id: string;
  title: string;
  artist: string;
  cover: string;
  tracks: string[];
}

export const CDPlayer: React.FC = () => {
  const [currentCD, setCurrentCD] = useState<CDData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [bass, setBass] = useState(50);
  const [isEjecting, setIsEjecting] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [activeDragCD, setActiveDragCD] = useState<CDData | null>(null);
  const [selectedCDId, setSelectedCDId] = useState<string | null>(null);

  const mousePosition = useMousePosition();
  const playerRef = useRef<HTMLDivElement>(null);

  // Sample CD data
  const cdLibrary: CDData[] = [
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'Synthwave Collective',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      tracks: ['neon lights', 'digital love', 'retrowave', 'city nights', 'electric soul']
    },
    {
      id: '2',
      title: 'Ocean Waves',
      artist: 'Ambient Shores',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      tracks: ['deep blue', 'coastal breeze', 'sunrise calm', 'tidal flow', 'peaceful waters']
    },
    {
      id: '3',
      title: 'Urban Pulse',
      artist: 'Metro Beats',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop',
      tracks: ['street rhythm', 'city lights', 'underground', 'metro line', 'concrete jungle']
    }
  ];

  const handlePlay = () => {
    if (currentCD) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleEject = async () => {
    if (currentCD) {
      setIsEjecting(true);
      setIsPlaying(false);
      
      // Simulate eject animation duration
      setTimeout(() => {
        setCurrentCD(null);
        setIsEjecting(false);
        setSelectedTrack(0);
      }, 2000);
    }
  };

  const handleCDInsert = (cd: CDData) => {
    if (!currentCD && !isEjecting) {
      setCurrentCD(cd);
      setIsPlaying(true);
      setSelectedTrack(0);
    }
  };

  const handleTrackSelect = (trackIndex: number) => {
    setSelectedTrack(trackIndex);
    if (currentCD) {
      setIsPlaying(true);
    }
  };

  const handleSkipForward = () => {
    if (currentCD) {
      setSelectedTrack((prev) => (prev + 1) % currentCD.tracks.length);
      setIsPlaying(true);
    }
  };

  const handleSkipBack = () => {
    if (currentCD) {
      setSelectedTrack((prev) => (prev - 1 + currentCD.tracks.length) % currentCD.tracks.length);
      setIsPlaying(true);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const cd = event.active.data.current?.cd;
    if (cd && cd.id === selectedCDId) { // Only allow dragging if selected
      setActiveDragCD(cd);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && over.id === 'cd-tray-dropzone' && active.data.current) {
      handleCDInsert(active.data.current.cd);
    }
    setActiveDragCD(null);
    setSelectedCDId(null);
  };

  const handleCDSelect = (cdId: string) => {
    setSelectedCDId(cdId);
  };

  // Calculate lighting effects based on mouse position
  const lightingStyle = {
    background: `radial-gradient(
      600px circle at ${mousePosition.x}px ${mousePosition.y}px,
      rgba(255,255,255,0.1),
      rgba(255,255,255,0.05) 40%,
      rgba(255,255,255,0.02) 80%
    )`
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <motion.div
        ref={playerRef}
        className="relative w-full max-w-6xl mx-auto perspective-1000"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Dynamic lighting overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          style={lightingStyle}
        />
        
        {/* Main CD Player Unit */}
        <div className="relative bg-gradient-to-br from-gray-200 to-gray-400 
          rounded-3xl p-8 shadow-2xl border border-gray-300 overflow-hidden
          liquid-silver-body">
          
          {/* Brushed metal texture overlay */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-white to-transparent"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 1px,
                rgba(255,255,255,0.1) 1px,
                rgba(255,255,255,0.1) 2px
              )`
            }}
          />

          {/* CD Tray - Center */}
          <div className="flex justify-center mb-8">
            <CDTray
              currentCD={currentCD}
              isPlaying={isPlaying}
              isEjecting={isEjecting}
              selectedTrack={selectedTrack}
              onTrackSelect={handleTrackSelect}
            />
          </div>

          {/* Physical Controls */}
          <Controls
            isPlaying={isPlaying}
            volume={volume}
            bass={bass}
            onPlay={handlePlay}
            onEject={handleEject}
            onVolumeChange={setVolume}
            onBassChange={setBass}
            hasCD={!!currentCD}
            onSkipForward={handleSkipForward}
            onSkipBack={handleSkipBack}
          />
        </div>

        {/* CD Library - Bottom */}
        <div className="mt-8">
          <CDLibrary
            cds={cdLibrary}
            onCDSelect={handleCDInsert}
            currentCD={currentCD}
            selectedCDId={selectedCDId}
            onCDCaseSelect={handleCDSelect}
          />
        </div>
      </motion.div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragCD && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 0.5, rotate: 15 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-200 
              shadow-2xl border border-slate-200 opacity-90"
          >
            <div className="absolute inset-0 rounded-full opacity-60"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  #ff0080 0deg,
                  #ff8000 60deg,
                  #ffff00 120deg,
                  #80ff00 180deg,
                  #00ff80 240deg,
                  #0080ff 300deg,
                  #ff0080 360deg
                )`,
                filter: 'blur(1px)'
              }}
            />
            <img
              src={activeDragCD.cover}
              alt={activeDragCD.title}
              className="absolute inset-4 rounded-full object-cover opacity-70"
            />
          </motion.div>
        )}
      </DragOverlay>
    </DndContext>
  );
};