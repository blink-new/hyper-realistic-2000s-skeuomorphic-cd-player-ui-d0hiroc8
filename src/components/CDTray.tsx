import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDroppable } from '@dnd-kit/core'
import { useCDPhysics } from '../hooks/useCDPhysics'

interface CDData {
  id: string
  title: string
  artist: string
  cover: string
  tracks: string[]
}

interface CDTrayProps {
  currentCD: CDData | null
  isPlaying: boolean
  isEjecting: boolean
  selectedTrack: number
  onTrackSelect: (index: number) => void
}

export const CDTray: React.FC<CDTrayProps> = ({
  currentCD,
  isPlaying,
  isEjecting,
  selectedTrack,
  onTrackSelect
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'cd-tray-dropzone'
  })

  const { rotation } = useCDPhysics({ isPlaying, isEjecting })
  const [highlightRotation, setHighlightRotation] = useState(0)

  // Update highlight rotation for realistic light bands
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setHighlightRotation(prev => (prev + 0.5) % 360)
      }, 16) // 60fps
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  return (
    <div className="relative">
      {/* CD Tray Ring - Enhanced Liquid Silver */}
      <div 
        ref={setNodeRef}
        className={`w-80 h-80 rounded-full relative overflow-hidden transition-all duration-300
        ${isOver ? 'scale-105 shadow-2xl' : ''}
        liquid-silver-body liquid-noise ambient-glow`}
        style={{
          background: `linear-gradient(145deg, 
            #f5f7fa 0%, 
            #e2e7ed 15%,
            #f0f3f7 30%,
            #dde3ea 45%,
            #f8f9fb 60%,
            #e8ecf0 75%,
            #f4f6f8 90%,
            #dce2e8 100%)`,
          boxShadow: `
            inset 0 4px 8px rgba(255,255,255,0.9),
            inset 0 -4px 8px rgba(0,0,0,0.1),
            0 8px 24px rgba(0,0,0,0.15),
            0 16px 48px rgba(0,0,0,0.1)`,
          border: '2px solid rgba(220,230,240,0.8)'
        }}
      >
        {/* Dynamic light reflection based on hover */}
        {isOver && (
          <motion.div 
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)',
              mixBlendMode: 'overlay'
            }}
          />
        )}
        
        {/* Inner ring with enhanced depth */}
        <div className="absolute inset-4 rounded-full liquid-silver-body"
          style={{
            background: `linear-gradient(135deg, 
              #e8ecf0 0%, 
              #f4f6f8 50%, 
              #dce2e8 100%)`,
            boxShadow: `
              inset 0 2px 4px rgba(0,0,0,0.1),
              inset 0 -2px 4px rgba(255,255,255,0.8),
              0 2px 8px rgba(0,0,0,0.1)`
          }}
        >
          
          {/* CD or Empty Tray */}
          <div className="absolute inset-2 rounded-full relative overflow-hidden">
            {currentCD ? (
              <motion.div
                className="w-full h-full relative"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isEjecting ? 0 : 1, 
                  opacity: isEjecting ? 0 : 1,
                  rotate: rotation 
                }}
                transition={{ 
                  scale: { duration: 0.8, ease: "easeOut" },
                  opacity: { duration: 0.8 },
                  rotate: { 
                    duration: 0.1, 
                    ease: "linear"
                  }
                }}
              >
                {/* CD Disc - Enhanced Glass Look */}
                <div className="w-full h-full rounded-full relative overflow-hidden glass-disc">
                  
                  {/* Base CD surface with micro texture */}
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(135deg,
                        rgba(245,247,250,0.95) 0%,
                        rgba(255,255,255,0.9) 20%,
                        rgba(240,244,248,0.92) 40%,
                        rgba(255,255,255,0.95) 60%,
                        rgba(245,248,252,0.9) 80%,
                        rgba(240,245,250,0.93) 100%)`,
                      boxShadow: `
                        inset 0 0 20px rgba(255,255,255,0.6),
                        inset 0 -2px 8px rgba(0,0,0,0.08),
                        0 0 24px rgba(0,0,0,0.1)`
                    }}
                  />

                  {/* CD Rainbow Shimmer Effect - Enhanced */}
                  <motion.div 
                    className="absolute inset-0 rounded-full opacity-70"
                    animate={{
                      rotate: rotation 
                    }}
                    transition={{
                      duration: 0.1, 
                      ease: "linear"
                    }}
                    style={{
                      background: `conic-gradient(
                        from 0deg,
                        #ff0080 0deg,
                        #ff4060 30deg,
                        #ff8000 60deg,
                        #ffaa00 90deg,
                        #ffff00 120deg,
                        #aaff00 150deg,
                        #00ff00 180deg,
                        #00ffaa 210deg,
                        #00ffff 240deg,
                        #00aaff 270deg,
                        #0080ff 300deg,
                        #8000ff 330deg,
                        #ff0080 360deg
                      )`,
                      filter: 'blur(1.5px)',
                      mixBlendMode: 'color'
                    }}
                  />

                  {/* Rotating light bands */}
                  <motion.div
                    className="absolute inset-0 rounded-full cd-highlight-band"
                    animate={{ rotate: highlightRotation }}
                    transition={{ duration: 0, ease: "linear" }}
                  />
                  
                  {/* Additional shimmer layers for depth */}
                  {isPlaying && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full opacity-40"
                        animate={{
                          background: [
                            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 50% 80%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.8) 0%, transparent 40%)',
                            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 40%)'
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                      <div className="absolute inset-0 rounded-full opacity-20"
                        style={{
                          background: `conic-gradient(
                            from ${rotation}deg,
                            transparent 0deg,
                            rgba(255,255,255,0.6) 15deg,
                            transparent 30deg,
                            transparent 150deg,
                            rgba(255,255,255,0.4) 165deg,
                            transparent 180deg,
                            transparent 330deg,
                            rgba(255,255,255,0.5) 345deg,
                            transparent 360deg
                          )`
                        }}
                      />
                    </>
                  )}

                  {/* CD Center Hole - Enhanced metallic */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-8 h-8 rounded-full"
                    style={{
                      background: 'linear-gradient(145deg, #6a7583 0%, #4a5568 50%, #2d3748 100%)',
                      boxShadow: `
                        inset 0 2px 4px rgba(255,255,255,0.4),
                        inset 0 -2px 4px rgba(0,0,0,0.6),
                        0 2px 8px rgba(0,0,0,0.3)`
                    }}
                  >
                    <div className="absolute inset-1 rounded-full"
                      style={{
                        background: 'linear-gradient(145deg, #4a5568 0%, #1a202c 100%)',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
                      }}
                    />
                  </div>
                  
                  {/* CD Tracks (visible grooves) - Enhanced */}
                  {[...Array(16)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        rounded-full border opacity-20"
                      style={{
                        width: `${30 + i * 16}px`,
                        height: `${30 + i * 16}px`,
                        borderColor: `rgba(${200 - i * 5}, ${210 - i * 5}, ${220 - i * 5}, 0.4)`,
                        borderWidth: '0.5px'
                      }}
                    />
                  ))}
                  
                  {/* Album Art Reflection - Enhanced */}
                  <div className="absolute inset-8 rounded-full overflow-hidden opacity-50">
                    <img 
                      src={currentCD.cover} 
                      alt={currentCD.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: 'blur(0.5px) saturate(1.2)',
                        mixBlendMode: 'multiply'
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Empty Tray - Enhanced Liquid Silver Surface */
              <div className="w-full h-full rounded-full relative liquid-silver-body"
                style={{
                  background: `linear-gradient(135deg, 
                    #e8ecf0 0%, 
                    #f0f3f6 50%, 
                    #dce2e8 100%)`,
                  boxShadow: `
                    inset 0 4px 12px rgba(0,0,0,0.1),
                    inset 0 -2px 8px rgba(255,255,255,0.6),
                    inset 0 0 24px rgba(200,210,220,0.2)`
                }}
              >
                
                {/* Subtle texture lines */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      rounded-full border"
                    style={{
                      width: `${40 + i * 24}px`,
                      height: `${40 + i * 24}px`,
                      borderColor: `rgba(200, 210, 220, ${0.1 - i * 0.01})`,
                      borderWidth: '1px'
                    }}
                  />
                ))}
                
                {/* Center spindle - Enhanced */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  w-6 h-6 rounded-full"
                  style={{
                    background: 'linear-gradient(145deg, #a0aec0 0%, #718096 50%, #4a5568 100%)',
                    boxShadow: `
                      0 2px 8px rgba(0,0,0,0.3),
                      inset 0 1px 2px rgba(255,255,255,0.6),
                      inset 0 -1px 2px rgba(0,0,0,0.4)`
                  }}
                >
                  <div className="absolute inset-1 rounded-full"
                    style={{
                      background: 'linear-gradient(145deg, #718096 0%, #4a5568 100%)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Tray surface micro scratches and wear */}
        <div className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 40%, transparent 0%, rgba(255,255,255,0.3) 1%, transparent 2%),
              radial-gradient(circle at 70% 60%, transparent 0%, rgba(255,255,255,0.2) 0.5%, transparent 1%),
              radial-gradient(circle at 45% 80%, transparent 0%, rgba(255,255,255,0.25) 0.8%, transparent 1.5%),
              radial-gradient(circle at 80% 30%, transparent 0%, rgba(255,255,255,0.15) 0.5%, transparent 1%)
            `
          }}
        />
      </div>
      
      {/* Track List Display - Enhanced Glass Panel */}
      {currentCD && (
        <motion.div
          className="absolute -right-80 top-0 w-72 glass-panel rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            background: `linear-gradient(135deg, 
              rgba(255,255,255,0.3) 0%, 
              rgba(255,255,255,0.2) 50%,
              rgba(255,255,255,0.15) 100%)`,
            backdropFilter: 'blur(12px) saturate(1.3)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: `
              0 8px 32px rgba(31, 38, 135, 0.15),
              inset 0 2px 4px rgba(255,255,255,0.7),
              inset 0 -2px 4px rgba(0,0,0,0.05)`
          }}
        >
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 drop-shadow-sm">
              {currentCD.title}
            </h3>
            <p className="text-sm text-gray-600 drop-shadow-sm mt-1">
              {currentCD.artist}
            </p>
          </div>
          
          <div className="space-y-1">
            {currentCD.tracks.map((track, index) => (
              <button
                key={index}
                onClick={() => onTrackSelect(index)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${selectedTrack === index 
                    ? 'bg-gradient-to-r from-blue-500/20 to-blue-400/20 text-blue-800 shadow-inner' 
                    : 'text-gray-700 hover:bg-white/20 hover:text-gray-900'
                  }
                  ${selectedTrack === index ? 'track-playing' : ''}`}
                style={{
                  textShadow: selectedTrack === index 
                    ? '0 1px 2px rgba(0,0,0,0.1)' 
                    : '0 1px 1px rgba(255,255,255,0.6)'
                }}
              >
                <span className="font-mono text-xs text-gray-500 mr-2">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {track}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}