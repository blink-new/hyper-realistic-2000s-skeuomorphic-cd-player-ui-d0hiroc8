import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

interface ControlsProps {
  isPlaying: boolean
  volume: number
  bass: number
  onPlay: () => void
  onEject: () => void
  onVolumeChange: (value: number) => void
  onBassChange: (value: number) => void
  onSkipBack: () => void
  onSkipForward: () => void
  hasCD: boolean
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  volume,
  bass,
  onPlay,
  onEject,
  onVolumeChange,
  onBassChange,
  onSkipBack,
  onSkipForward,
  hasCD
}) => {
  const [volumeRotation, setVolumeRotation] = useState(0)
  const [bassRotation, setBassRotation] = useState(0)

  const handleVolumeKnob = (delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume + delta))
    const newRotation = (newVolume / 100) * 270 - 135 // -135° to +135°
    setVolumeRotation(newRotation)
    onVolumeChange(newVolume)
  }

  const handleBassKnob = (delta: number) => {
    const newBass = Math.max(0, Math.min(100, bass + delta))
    const newRotation = (newBass / 100) * 270 - 135 // -135° to +135°
    setBassRotation(newRotation)
    onBassChange(newBass)
  }

  return (
    <div className="flex items-center justify-center space-x-12">
      
      {/* Skip Back Button */}
      <motion.button
        onClick={onSkipBack}
        className="w-12 h-10 premium-button rounded-xl flex items-center justify-center
          interactive-hover depth-layer-1 specular-highlight"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        disabled={!hasCD}
        style={{
          filter: hasCD ? 'none' : 'grayscale(40%) opacity(60%)'
        }}
      >
        <SkipBack size={18} className="premium-text" />
      </motion.button>

      {/* Play/Pause Button - Main Control */}
      <motion.button
        onClick={onPlay}
        className="w-20 h-20 premium-button rounded-full flex items-center justify-center
          interactive-hover depth-layer-3 specular-highlight relative overflow-hidden"
        whileHover={{ scale: 1.08, y: -3 }}
        whileTap={{ scale: 0.92 }}
        disabled={!hasCD}
        style={{
          filter: hasCD ? 'none' : 'grayscale(40%) opacity(60%)'
        }}
      >
        {/* Enhanced button surface */}
        <div className="absolute inset-0 rounded-full chrome-reflective" />
        <div className="relative z-10">
          {isPlaying ? (
            <Pause size={28} className="premium-text" />
          ) : (
            <Play size={28} className="premium-text ml-1" />
          )}
        </div>
        
        {/* LED-like indicator when active */}
        {hasCD && (
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            animate={{
              backgroundColor: isPlaying ? '#22c55e' : '#64748b',
              boxShadow: isPlaying 
                ? '0 0 8px rgba(34, 197, 94, 0.6), inset 0 1px 2px rgba(255,255,255,0.3)' 
                : '0 0 4px rgba(100, 116, 139, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>

      {/* Skip Forward Button */}
      <motion.button
        onClick={onSkipForward}
        className="w-12 h-10 premium-button rounded-xl flex items-center justify-center
          interactive-hover depth-layer-1 specular-highlight"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        disabled={!hasCD}
        style={{
          filter: hasCD ? 'none' : 'grayscale(40%) opacity(60%)'
        }}
      >
        <SkipForward size={18} className="premium-text" />
      </motion.button>

      {/* Volume Knob */}
      <div className="flex flex-col items-center space-y-3">
        <motion.div
          className="w-16 h-16 premium-knob rounded-full relative cursor-pointer
            interactive-hover depth-layer-2 specular-highlight overflow-hidden"
          whileHover={{ scale: 1.05, y: -2 }}
          onWheel={(e) => {
            e.preventDefault()
            handleVolumeKnob(e.deltaY > 0 ? -5 : 5)
          }}
        >
          <motion.div
            className="absolute inset-1 rounded-full chrome-reflective
              flex items-center justify-center"
            animate={{ rotate: volumeRotation }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Knob notches */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-3 bg-gray-700 rounded-full opacity-60"
                style={{
                  top: '8px',
                  transformOrigin: '50% 24px',
                  transform: `rotate(${i * 30}deg)`
                }}
              />
            ))}
            
            {/* Main indicator line */}
            <div className="absolute w-1 h-4 bg-gray-800 rounded-full top-3
              depth-layer-1" />
          </motion.div>
          
          {/* Volume level indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2
            text-xs premium-text-light font-mono">
            {Math.round(volume)}
          </div>
        </motion.div>
        <span className="text-xs premium-text-light font-medium tracking-wider">
          VOLUME
        </span>
      </div>

      {/* Bass Knob */}
      <div className="flex flex-col items-center space-y-3">
        <motion.div
          className="w-20 h-20 premium-knob rounded-full relative cursor-pointer
            interactive-hover depth-layer-2 specular-highlight overflow-hidden"
          whileHover={{ scale: 1.05, y: -2 }}
          onWheel={(e) => {
            e.preventDefault()
            handleBassKnob(e.deltaY > 0 ? -5 : 5)
          }}
        >
          <motion.div
            className="absolute inset-1 rounded-full chrome-reflective
              flex items-center justify-center"
            animate={{ rotate: bassRotation }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Bass knob deep grooves */}
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-5 bg-gray-800 rounded-full opacity-70"
                style={{
                  top: '10px',
                  transformOrigin: '50% 30px',
                  transform: `rotate(${i * 22.5}deg)`
                }}
              />
            ))}
            
            {/* Main indicator line */}
            <div className="absolute w-1.5 h-6 bg-gray-900 rounded-full top-3
              depth-layer-1" />
          </motion.div>
          
          {/* Bass level indicator */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2
            text-xs premium-text-light font-mono">
            {Math.round(bass)}
          </div>
        </motion.div>
        <span className="text-xs premium-text-light font-medium tracking-wider">
          BASS
        </span>
      </div>

      {/* Eject Button */}
      <motion.button
        onClick={onEject}
        className="px-6 py-3 premium-button rounded-full flex items-center space-x-2
          interactive-hover depth-layer-1 specular-highlight relative overflow-hidden"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        disabled={!hasCD}
        style={{
          filter: hasCD ? 'none' : 'grayscale(40%) opacity(60%)'
        }}
      >
        <span className="premium-text font-medium text-sm tracking-wide">
          EJECT
        </span>
        
        {/* Button surface enhancement */}
        <div className="absolute inset-0 rounded-full chrome-reflective" />
      </motion.button>
    </div>
  )
}