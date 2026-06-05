'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  offset?: number
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  offset = 0,
}: ParallaxLayerProps) {
  return (
    <motion.div
      style={{
        y: offset,
      }}
      animate={{
        y: offset,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  )
}
