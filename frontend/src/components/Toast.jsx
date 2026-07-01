'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi'

const icons = {
  success: FiCheck,
  error: FiAlertCircle,
  info: FiInfo,
}

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9998] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || FiCheck
          const color = colors[toast.type] || colors.success
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="pointer-events-auto flex items-center gap-4 bg-white rounded-2xl shadow-2xl shadow-slate-900/15 p-4 min-w-[300px] max-w-sm border border-slate-100"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="font-semibold text-slate-800 text-sm">{toast.title}</p>
                )}
                <p className="text-slate-500 text-sm leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <FiX className="w-4 h-4 text-slate-400" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
