'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  FiSend, FiX, FiMessageCircle, FiChevronDown,
  FiHeart, FiUsers, FiMapPin, FiGift,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { sendChatMessage } from '@/lib/api'

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { id: 'programs',  icon: FiGift,          label: 'Our Programs',      labelUr: 'ہمارے پروگرام',  msg: 'What programs does Rah-E-Haq offer?',     msgUr: 'راہِ حق کے کیا پروگرام ہیں؟' },
  { id: 'volunteer', icon: FiUsers,          label: 'How to Volunteer',  labelUr: 'رضاکار کیسے بنیں', msg: 'How can I volunteer with Rah-E-Haq?',      msgUr: 'میں راہِ حق کے ساتھ رضاکار کیسے بن سکتا ہوں؟' },
  { id: 'donate',    icon: FiHeart,          label: 'Make a Donation',   labelUr: 'عطیہ دیں',        msg: 'How can I donate to Rah-E-Haq?',          msgUr: 'میں راہِ حق کو عطیہ کیسے دے سکتا ہوں؟' },
  { id: 'contact',   icon: FiMapPin,         label: 'Contact Info',      labelUr: 'رابطہ کی معلومات',msg: 'How can I contact Rah-E-Haq?',            msgUr: 'راہِ حق سے رابطہ کیسے کریں؟' },
]

const PLACEHOLDER_TEXTS = [
  'Ask me anything about Rah-E-Haq…',
  'How can I volunteer?',
  'What programs do you offer?',
  'How can I donate?',
  'کچھ بھی پوچھیں…',
]

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "السلام علیکم! I'm **Amal**, the AI assistant for Rah-E-Haq NGO. I can help you learn about our programs, how to volunteer, donate, and much more. How can I help you today? 🌿",
  id: 'welcome',
  timestamp: new Date(),
}

// ─────────────────────────────────────────────────────────────
//  SPRING CONFIG
// ─────────────────────────────────────────────────────────────
const PANEL_SPRING = { type: 'spring', stiffness: 320, damping: 30 }
const BUBBLE_SPRING = { type: 'spring', stiffness: 400, damping: 28 }
const CHIP_SPRING   = { type: 'spring', stiffness: 500, damping: 35 }

// ─────────────────────────────────────────────────────────────
//  ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const panelVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 24, originX: 0, originY: 1 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: PANEL_SPRING,
  },
  exit: {
    opacity: 0, scale: 0.88, y: 20,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
}

const userBubbleVariants = {
  hidden:  { opacity: 0, x: 30, scale: 0.9 },
  visible: { opacity: 1, x: 0,  scale: 1, transition: BUBBLE_SPRING },
}

const botBubbleVariants = {
  hidden:  { opacity: 0, x: -30, scale: 0.9 },
  visible: { opacity: 1, x: 0,   scale: 1,  transition: BUBBLE_SPRING },
}

const typingVariants = {
  hidden:  { opacity: 0, x: -20, scale: 0.85 },
  visible: { opacity: 1, x: 0,   scale: 1, transition: { ...BUBBLE_SPRING, delay: 0.05 } },
  exit:    { opacity: 0, scale: 0.85, transition: { duration: 0.15 } },
}

const chipContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit:   { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const chipVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.85 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: CHIP_SPRING },
  exit:    { opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.18 } },
}

const dotVariants = {
  bounce: (i) => ({
    y: [0, -8, 0],
    transition: { duration: 0.6, repeat: Infinity, repeatType: 'loop', delay: i * 0.15, ease: 'easeInOut' },
  }),
}

// ─────────────────────────────────────────────────────────────
//  HELPER: format markdown-style bold
// ─────────────────────────────────────────────────────────────
function renderContent(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    // Render newlines
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 ? <br /> : null}</span>
    ))
  })
}

// ─────────────────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────

function ToggleButton({ isOpen, hasUnread, onClick }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 20 })
  const sy = useSpring(my, { stiffness: 200, damping: 20 })
  const [showTooltip, setShowTooltip] = useState(false)
  const btnRef = useRef(null)

  const handleMouseMove = (e) => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left - r.width / 2) * 0.25)
    my.set((e.clientY - r.top  - r.height/ 2) * 0.25)
  }
  const handleMouseLeave = () => { mx.set(0); my.set(0) }

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.92 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.92 }}
            transition={{ duration: 0.18 }}
            className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl pointer-events-none"
          >
            Chat with Amal
            <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[5px] border-transparent border-l-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rotating gradient ring */}
      <div
        className="absolute inset-[-5px] rounded-full pointer-events-none"
        style={{
          background: 'conic-gradient(from 0deg, #0F766E, #22C55E, #F59E0B, #0F766E)',
          animation: `rotateRing ${isOpen ? '2s' : '4s'} linear infinite`,
          borderRadius: '50%',
          padding: '2px',
        }}
      >
        <div className="w-full h-full rounded-full bg-slate-50" />
      </div>

      {/* Main button */}
      <motion.button
        ref={btnRef}
        id="amal-chat-toggle"
        aria-label="Open Amal chatbot"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.9 }}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-700 text-white flex items-center justify-center shadow-2xl shadow-primary/40 chat-toggle-glow z-10 cursor-pointer overflow-hidden"
      >
        {/* Inner shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <FiX className="w-6 h-6 relative z-10" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <FiMessageCircle className="w-6 h-6" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 25 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white z-20 flex items-center justify-center"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────
function ChatHeader({ language, onLangToggle, onClose }) {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      left: `${10 + i * 11}%`,
      delay: `${i * 0.7}s`,
      dur: `${3 + (i % 3)}s`,
      size: 2 + (i % 2),
    })), [])

  return (
    <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary via-emerald-700 to-emerald-900 px-4 py-4 flex items-center gap-3">
      {/* Header particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              left: p.left, bottom: '-4px',
              width: `${p.size}px`, height: `${p.size}px`,
              animation: `chatParticleFloat ${p.dur} ease-in-out ${p.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* Sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-transparent pointer-events-none" />

      {/* Avatar */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex-shrink-0 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg"
      >
        <HiSparkles className="w-5 h-5 text-secondary" />
        {/* Online dot */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-emerald-800 animate-pulse" />
      </motion.div>

      {/* Name + status */}
      <div className="flex-1 relative z-10">
        <p className="font-display font-bold text-white text-sm leading-none">Amal</p>
        <p className="text-white/70 text-xs mt-0.5 font-medium">Rah-E-Haq Assistant • Online</p>
      </div>

      {/* Language toggle */}
      <div className="relative flex-shrink-0 z-10">
        <button
          id="amal-lang-toggle"
          onClick={onLangToggle}
          aria-label="Toggle language"
          className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-0.5 gap-0 cursor-pointer"
        >
          {['en', 'ur'].map((lang) => (
            <span
              key={lang}
              className={`relative z-10 px-2.5 py-1 text-[10px] font-semibold rounded-full transition-colors duration-200 ${
                language === lang ? 'text-primary' : 'text-white/70'
              }`}
            >
              {lang === 'en' ? 'EN' : 'اردو'}
              {language === lang && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 bg-white rounded-full z-[-1]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </span>
          ))}
        </button>
      </div>

      {/* Close */}
      <motion.button
        id="amal-chat-close"
        onClick={onClose}
        whileHover={{ rotate: 90 }}
        whileTap={{ scale: 0.85 }}
        transition={{ duration: 0.2 }}
        aria-label="Close chat"
        className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <FiX className="w-4 h-4" />
      </motion.button>
    </div>
  )
}

// ── Typing Indicator ──────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      variants={typingVariants}
      initial="hidden" animate="visible" exit="exit"
      className="flex items-end gap-2 mb-3"
    >
      {/* Bot avatar micro */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex-shrink-0 flex items-center justify-center shadow-md">
        <HiSparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md shadow-slate-100 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 transition-colors duration-300">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            animate="bounce"
            className="w-2 h-2 rounded-full bg-primary/50"
          />
        ))}
      </div>
    </motion.div>
  )
}

// ── Message Bubble ────────────────────────────────────────────
function MessageBubble({ msg, language }) {
  const isUser = msg.role === 'user'
  const [showTime, setShowTime] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowTime(true), 500)
    return () => clearTimeout(t)
  }, [])

  const timeStr = msg.timestamp
    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <motion.div
      variants={isUser ? userBubbleVariants : botBubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: Math.random() }}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex-shrink-0 flex items-center justify-center shadow-md self-end"
        >
          <HiSparkles className="w-3.5 h-3.5 text-white" />
        </motion.div>
      )}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors duration-300 ${
            isUser
              ? 'bg-gradient-to-br from-primary to-emerald-700 text-white rounded-br-sm shadow-primary/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-100 dark:border-slate-700 shadow-slate-100 dark:shadow-none'
          }`}
          dir={language === 'ur' ? 'rtl' : 'ltr'}
        >
          {renderContent(msg.content)}
        </div>
        <AnimatePresence>
          {showTime && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-slate-400 px-1"
            >
              {timeStr}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Shimmer placeholder ───────────────────────────────────────
function ShimmerBubble() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-primary/20 flex-shrink-0 chat-shimmer" />
      <div className="flex flex-col gap-2 max-w-[60%]">
        <div className="h-4 w-40 rounded-full chat-shimmer" />
        <div className="h-4 w-28 rounded-full chat-shimmer" />
      </div>
    </div>
  )
}

// ── Quick Chips ───────────────────────────────────────────────
function QuickChips({ language, onSelect }) {
  return (
    <motion.div
      variants={chipContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="px-4 pb-3 flex flex-wrap gap-2"
    >
      {QUICK_CHIPS.map((chip) => {
        const Icon = chip.icon
        const label = language === 'ur' ? chip.labelUr : chip.label
        const msg   = language === 'ur' ? chip.msgUr   : chip.msg
        return (
          <motion.button
            key={chip.id}
            id={`chip-${chip.id}`}
            variants={chipVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onSelect(msg)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-primary/20 dark:border-primary/40 text-primary text-xs font-medium shadow-sm hover:bg-primary/5 dark:hover:bg-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span dir={language === 'ur' ? 'rtl' : 'ltr'}>{label}</span>
          </motion.button>
        )
      })}
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Chatbot() {
  const [isOpen, setIsOpen]           = useState(false)
  const [messages, setMessages]       = useState([WELCOME_MESSAGE])
  const [input, setInput]             = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [language, setLanguage]       = useState('en')
  const [hasUnread, setHasUnread]     = useState(true)
  const [showChips, setShowChips]     = useState(true)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  const messagesEndRef  = useRef(null)
  const scrollAreaRef   = useRef(null)
  const inputRef        = useRef(null)

  // Rotate placeholder text
  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDER_TEXTS.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // Auto-scroll
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  // Show/hide scroll-to-bottom button
  const handleScroll = () => {
    const el = scrollAreaRef.current
    if (!el) return
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollBtn(distFromBottom > 80)
  }

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [isOpen])

  // Build history for API (exclude welcome message)
  const getHistory = useCallback(() => {
    return messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))
  }, [messages])

  // Send message
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isLoading) return

    setInput('')
    setShowChips(false)

    const userMsg = {
      role: 'user',
      content: trimmed,
      id: `u-${Date.now()}`,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const data = await sendChatMessage(trimmed, getHistory(), language)
      const botMsg = {
        role: 'assistant',
        content: data.reply,
        id: `b-${Date.now()}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      const errMsg = {
        role: 'assistant',
        content: language === 'ur'
          ? 'معذرت، ابھی تکنیکی مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں۔'
          : "Sorry, I'm having trouble connecting. Please try again in a moment.",
        id: `err-${Date.now()}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, language, getHistory])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const toggleLanguage = () => {
    setLanguage((l) => (l === 'en' ? 'ur' : 'en'))
  }

  const charCount = input.length
  const maxChars  = 1000
  const charWarn  = charCount > maxChars * 0.8

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            id="amal-chat-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ originX: 0, originY: 1 }}
            className="w-[360px] sm:w-[390px] max-h-[580px] flex flex-col rounded-2xl shadow-2xl shadow-slate-900/25 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300"
          >
            {/* Header */}
            <ChatHeader
              language={language}
              onLangToggle={toggleLanguage}
              onClose={() => setIsOpen(false)}
            />

            {/* Messages Area */}
            <div
              ref={scrollAreaRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 pt-4 pb-1 chat-scroll min-h-[260px]"
              style={{ maxHeight: '340px' }}
            >
              {/* Message list */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} language={language} />
                ))}
              </motion.div>

              {/* Loading states */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <TypingIndicator />
                    <ShimmerBubble />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-to-bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-20 right-4 w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-primary dark:text-emerald-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-colors z-10 cursor-pointer"
                  aria-label="Scroll to bottom"
                >
                  <FiChevronDown className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick Chips */}
            <AnimatePresence>
              {showChips && (
                <QuickChips key="chips" language={language} onSelect={sendMessage} />
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="h-px bg-slate-200/70 dark:bg-slate-700/70 mx-4 transition-colors duration-300" />

            {/* Input Bar */}
            <div className="px-3 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_rgba(15,118,110,0.1)]">
                <input
                  ref={inputRef}
                  id="amal-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={maxChars}
                  placeholder={PLACEHOLDER_TEXTS[placeholderIdx]}
                  dir={language === 'ur' ? 'rtl' : 'ltr'}
                  className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none min-w-0 font-sans"
                  disabled={isLoading}
                />
                {/* Character counter */}
                <AnimatePresence>
                  {charWarn && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`text-[10px] flex-shrink-0 ${charCount >= maxChars ? 'text-red-400' : 'text-amber-400'}`}
                    >
                      {maxChars - charCount}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Send button */}
                <motion.button
                  id="amal-chat-send"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  aria-label="Send message"
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-700 text-white flex items-center justify-center shadow-md shadow-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="spin"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <motion.div key="send" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <FiSend className="w-3.5 h-3.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Footer note */}
              <p className="text-center text-[10px] text-slate-400 mt-2">
                Powered by Groq AI · Rah-E-Haq NGO
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <ToggleButton
        isOpen={isOpen}
        hasUnread={hasUnread}
        onClick={() => setIsOpen((v) => !v)}
      />
    </div>
  )
}
