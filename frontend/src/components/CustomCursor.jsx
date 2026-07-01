'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    if ('ontouchstart' in window) return

    document.body.style.cursor = 'none'

    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    let mouseX = -100, mouseY = -100
    let cursorX = -100, cursorY = -100

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Dot follows immediately
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        isHoveringRef.current = true
        cursor.classList.add('hovering')
      } else {
        isHoveringRef.current = false
        cursor.classList.remove('hovering')
      }
    }

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.12
      cursorY += (mouseY - cursorY) * 0.12
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    animate()

    return () => {
      document.body.style.cursor = 'auto'
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
      <style>{`
        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 28px;
          height: 28px;
          border: 1.5px solid rgba(15, 118, 110, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: width 0.2s, height 0.2s, border-color 0.2s, background 0.2s;
        }
        .cursor-ring.hovering {
          width: 44px;
          height: 44px;
          border-color: rgba(15, 118, 110, 0.25);
          background: rgba(15, 118, 110, 0.05);
        }
        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 5px;
          height: 5px;
          background: #0F766E;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
        }
      `}</style>
    </>
  )
}
