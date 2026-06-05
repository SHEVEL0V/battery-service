'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right'
  once?: boolean
}

const directionVariants = {
  up: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  once = true,
}: ScrollRevealProps) {
  const variants = directionVariants[direction]

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      transition={{
        duration: 0.6,
        delay,
        ease: 'easeOut',
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
