'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import translations from './translations'

const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
  t: (key) => key,
  isUrdu: false,
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('rah-language')
    if (saved === 'ur') {
      setLanguage('ur')
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ur'
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ur' : 'en'
      localStorage.setItem('rah-language', next)
      document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr'
      document.documentElement.lang = next
      return next
    })
  }, [])

  const t = useCallback(
    (key) => {
      return translations[language]?.[key] || translations['en']?.[key] || key
    },
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isUrdu: language === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export default LanguageContext
