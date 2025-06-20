import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDraggable } from '@dnd-kit/core'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CDData {
  id: string
  title: string
  artist: string
  cover: string
  tracks: string[]
}

interface CDLibraryProps {
  cds: CDData[]
  onCDSelect: (cd: CDData) => void
  currentCD: CDData | null
  selectedCDId: string | null
  onCDCaseSelect: (cdId: string) => void
}

interface CDCaseProps {
  cd: CDData
  index: number
  isCenter: boolean
  isCurrent: boolean
  isSelected: boolean
  onSelect: () => void
  onDragToPlayer: (cd: CDData) => void
}

const CDCase: React.FC<CDCaseProps> = ({ 
  cd, 
  index, 
  isCenter, 
  isCurrent,
  isSelected,
  onSelect,
  onDragToPlayer
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Only enable dragging when selected
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: cd.id,
    data: { cd },
    disabled: !isSelected
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : isSelected ? 30 : isCenter ? 20 : 10 - Math.abs(index)
  } : {
    zIndex: isSelected ? 30 : isCenter ? 20 : 10 - Math.abs(index)
  }

  const handleClick = () => {
    if (!isSelected) {
      onSelect()
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleDoubleClick = () => {
    if (isSelected) {
      onDragToPlayer(cd)
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...(isSelected ? attributes : {})}
      {...(isSelected ? listeners : {})}
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        ${isSelected ? 'cursor-move' : 'cursor-pointer'}`}
      initial={false}
      animate={{
        x: `${index * 60}px`,
        scale: isSelected ? 1.15 : (isCenter ? 1.05 : 0.9 - Math.abs(index) * 0.05),
        rotateY: isOpen ? 25 : index * -5,
        opacity: isDragging ? 0.5 : 1
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={!isDragging ? { 
        scale: isSelected ? 1.18 : (isCenter ? 1.08 : 0.93 - Math.abs(index) * 0.05),
        y: -10
      } : {}}
    >
      {/* CD Case - Enhanced Glass/Plastic Effect */}
      <div className={`relative ${isOpen ? 'preserve-3d' : ''}`}>
        <div className={`w-48 h-48 relative rounded-lg overflow-hidden
          ${isSelected ? 'ring-4 ring-blue-400/50 shadow-2xl' : ''}
          ${isCurrent ? 'ring-2 ring-green-400/50' : ''}`}
          style={{
            background: `linear-gradient(135deg,
              rgba(255,255,255,0.4) 0%,
              rgba(255,255,255,0.2) 50%,
              rgba(255,255,255,0.1) 100%)`,
            backdropFilter: 'blur(8px) saturate(1.2)',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: `
              0 ${isSelected ? '16px 48px' : '8px 24px'} rgba(0,0,0,${isSelected ? 0.2 : 0.15}),
              inset 0 2px 4px rgba(255,255,255,0.6),
              inset 0 -2px 4px rgba(0,0,0,0.05)`,
            transform: isOpen ? 'rotateY(25deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s'
          }}
        >
          {/* Case Front Cover */}
          <div className="absolute inset-0">
            <img
              src={cd.cover}
              alt={cd.title}
              className="w-full h-full object-cover"
              style={{
                filter: isSelected ? 'brightness(1.05) saturate(1.2)' : 'brightness(0.95)'
              }}
            />
            
            {/* Plastic case reflection overlay */}
            <div className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg,
                  rgba(255,255,255,0.4) 0%,
                  transparent 30%,
                  transparent 70%,
                  rgba(255,255,255,0.2) 100%)`,
                mixBlendMode: 'overlay'
              }}
            />
            
            {/* Case surface scratches */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.1) 49%, rgba(255,255,255,0.1) 51%, transparent 52%),
                  linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.05) 49%, rgba(255,255,255,0.05) 51%, transparent 52%)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          </div>

          {/* Case Spine */}
          <div className="absolute left-0 top-0 w-3 h-full cd-case-spine"
            style={{
              transform: 'rotateY(-90deg) translateZ(6px)',
              transformOrigin: 'left center'
            }}
          />

          {/* Case Back (visible when open) */}
          {isOpen && (
            <div className="absolute inset-0 bg-gray-800/90 rounded-lg p-4"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="text-white space-y-2 paper-texture p-3 rounded">
                <h4 className="font-semibold text-sm">{cd.title}</h4>
                <p className="text-xs opacity-80">{cd.artist}</p>
                <div className="mt-3 space-y-1">
                  {cd.tracks.map((track, idx) => (
                    <p key={idx} className="text-xs opacity-70">
                      {idx + 1}. {track}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3D CD inside case (visible when open) */}
        {isOpen && (
          <motion.div
            className="absolute inset-4 rounded-full"
            initial={{ rotateY: 0, x: 0 }}
            animate={{ rotateY: -15, x: 30 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(10px)'
            }}
          >
            <div className="w-full h-full rounded-full glass-disc relative overflow-hidden">
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
                src={cd.cover} 
                alt={cd.title}
                className="absolute inset-6 rounded-full object-cover opacity-80"
              />
            </div>
          </motion.div>
        )}

        {/* Selection glow effect */}
        {isSelected && (
          <motion.div
            className="absolute -inset-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              zIndex: -1
            }}
          />
        )}
      </div>

      {/* Title below case */}
      <motion.div
        className="mt-4 text-center"
        animate={{
          opacity: isCenter || isSelected ? 1 : 0.7
        }}
      >
        <h3 className={`text-sm font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'} 
          drop-shadow-sm truncate max-w-[180px] mx-auto`}>
          {cd.title}
        </h3>
        <p className="text-xs text-gray-600 drop-shadow-sm truncate max-w-[180px] mx-auto">
          {cd.artist}
        </p>
      </motion.div>
    </motion.div>
  )
}

export const CDLibrary: React.FC<CDLibraryProps> = ({ 
  cds, 
  onCDSelect, 
  currentCD,
  selectedCDId,
  onCDCaseSelect
}) => {
  const [centerIndex, setCenterIndex] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const handlePrevious = useCallback(() => {
    setCenterIndex((prev) => (prev - 1 + cds.length) % cds.length)
  }, [cds.length])

  const handleNext = useCallback(() => {
    setCenterIndex((prev) => (prev + 1) % cds.length)
  }, [cds.length])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious()
    } else if (e.key === 'ArrowRight') {
      handleNext()
    } else if (e.key === 'Enter' && focusedIndex !== null) {
      onCDCaseSelect(cds[focusedIndex].id)
    }
  }, [handlePrevious, handleNext, focusedIndex, onCDCaseSelect, cds])

  return (
    <div 
      className="relative h-80 w-full overflow-hidden rounded-2xl glass-panel p-8"
      style={{
        background: `linear-gradient(135deg, 
          rgba(255,255,255,0.1) 0%, 
          rgba(255,255,255,0.05) 100%)`,
        backdropFilter: 'blur(20px) saturate(1.1)',
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.1),
          inset 0 2px 4px rgba(255,255,255,0.5),
          inset 0 -2px 4px rgba(0,0,0,0.05)`
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Navigation Buttons */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 premium-button 
          rounded-full p-3 interactive-hover specular-highlight"
        aria-label="Previous CD"
      >
        <ChevronLeft size={20} className="premium-text" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 premium-button 
          rounded-full p-3 interactive-hover specular-highlight"
        aria-label="Next CD"
      >
        <ChevronRight size={20} className="premium-text" />
      </button>

      {/* CD Cases Carousel */}
      <div className="relative h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {cds.map((cd, index) => {
            const relativeIndex = ((index - centerIndex + cds.length) % cds.length) - Math.floor(cds.length / 2)
            const isVisible = Math.abs(relativeIndex) <= 2
            
            if (!isVisible) return null

            return (
              <CDCase
                key={cd.id}
                cd={cd}
                index={relativeIndex}
                isCenter={index === centerIndex}
                isCurrent={currentCD?.id === cd.id}
                isSelected={selectedCDId === cd.id}
                onSelect={() => {
                  setCenterIndex(index)
                  setFocusedIndex(index)
                  onCDCaseSelect(cd.id)
                }}
                onDragToPlayer={onCDSelect}
              />
            )
          })}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs text-gray-600 drop-shadow-sm">
          Use arrow keys or click to navigate • Select then drag CD to player
        </p>
      </div>
    </div>
  )
}