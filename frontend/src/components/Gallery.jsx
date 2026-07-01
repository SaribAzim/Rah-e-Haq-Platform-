'use client'

import { useState, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiZoomIn, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop', alt: 'Food distribution event', category: 'Food Distribution', span: 'col-span-2 row-span-2' },
  { id: 2, src: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop', alt: 'Community volunteers', category: 'Volunteers' },
  { id: 3, src: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=400&fit=crop', alt: 'Educational support', category: 'Education' },
  { id: 4, src: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=400&fit=crop', alt: 'Community gathering', category: 'Community' },
  { id: 5, src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=400&fit=crop', alt: 'Healthcare support', category: 'Healthcare' },
  { id: 6, src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop', alt: 'Food packages preparation', category: 'Food Distribution', span: 'col-span-2' },
  { id: 7, src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=400&fit=crop', alt: 'Children education', category: 'Education' },
  { id: 8, src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=400&fit=crop', alt: 'Team meeting', category: 'Team' },
]

function TiltCard({ image, index, isInView, setSelectedImage }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg'])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.1 + index * 0.05 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group overflow-hidden rounded-2xl cursor-pointer shadow-lg ${image.span || ''}`}
      onClick={() => setSelectedImage(image)}
    >
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="w-full h-full">
        <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full text-xs font-semibold text-dark dark:text-white transform translate-z-10 transition-colors">
          {image.category}
        </span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-z-20">
          <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-colors">
            <FiZoomIn className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handlePrev = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage?.id)
    const prevIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    setSelectedImage(galleryImages[prevIndex])
  }

  const handleNext = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage?.id)
    const nextIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    setSelectedImage(galleryImages[nextIndex])
  }

  return (
    <section id="gallery" className="relative py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-900 transition-colors duration-300" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            <FiZoomIn className="w-4 h-4" />
            Gallery
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-dark dark:text-white mb-6 transition-colors duration-300">
            Moments Of <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Capturing the essence of our work through images that tell stories of compassion, community, and change.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {galleryImages.map((image, i) => (
            <TiltCard key={image.id} image={image} index={i} isInView={isInView} setSelectedImage={setSelectedImage} />
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}>
            <FiX className="w-6 h-6 text-white" />
          </button>
          <button className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); handlePrev() }}>
            <FiChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); handleNext() }}>
            <FiChevronRight className="w-6 h-6 text-white" />
          </button>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative max-w-5xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.src.replace('w=600', 'w=1200').replace('w=400', 'w=1200')} alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <span className="px-3 py-1 bg-primary rounded-full text-xs font-semibold text-white">{selectedImage.category}</span>
              <p className="text-white font-semibold mt-2">{selectedImage.alt}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
