import { useState, useEffect, useRef, useCallback } from 'react'

interface CDPhysicsProps {
  isPlaying: boolean
  isEjecting: boolean
}

interface CDPhysicsReturn {
  rotation: number
  startSpin: () => void
  stopSpin: () => void
}

export const useCDPhysics = ({ isPlaying, isEjecting }: CDPhysicsProps): CDPhysicsReturn => {
  const [rotation, setRotation] = useState(0)
  const rotationSpeed = useRef(0) // degrees per frame
  const animationFrameId = useRef<number | null>(null)
  const targetSpeed = useRef(0)

  const animate = useCallback(() => {
    // Update speed based on target
    if (rotationSpeed.current < targetSpeed.current) {
      // Accelerate
      rotationSpeed.current = Math.min(
        rotationSpeed.current + 0.3,
        targetSpeed.current
      )
    } else if (rotationSpeed.current > targetSpeed.current) {
      // Decelerate
      rotationSpeed.current = Math.max(
        rotationSpeed.current - 0.2,
        targetSpeed.current
      )
    }

    // Update rotation
    setRotation((prevRotation) => (prevRotation + rotationSpeed.current) % 360)

    // Continue animation if speed > 0 or target > 0
    if (rotationSpeed.current > 0 || targetSpeed.current > 0) {
      animationFrameId.current = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(animationFrameId.current as number)
      animationFrameId.current = null
    }
  }, [])

  const startSpin = useCallback(() => {
    targetSpeed.current = 6 // Target speed for spinning
    if (animationFrameId.current === null) {
      animationFrameId.current = requestAnimationFrame(animate)
    }
  }, [animate])

  const stopSpin = useCallback(() => {
    targetSpeed.current = 0 // Target speed for stopping
    // Animation continues until speed reaches 0
  }, [])

  // Handle play/pause/eject state changes
  useEffect(() => {
    if (isEjecting) {
      targetSpeed.current = 0
      rotationSpeed.current = 0 // Stop immediately on eject
    } else if (isPlaying) {
      startSpin()
    } else {
      stopSpin()
    }
  }, [isPlaying, isEjecting, startSpin, stopSpin])

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
    }
  }, [])

  return {
    rotation,
    startSpin,
    stopSpin
  }
}