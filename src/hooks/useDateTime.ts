import { useState, useEffect } from 'react'

interface DateTimeOptions {
  format?: 'full' | 'date' | 'time'
  updateInterval?: number
}

export const useDateTime = (options: DateTimeOptions = {}) => {
  const { format = 'full', updateInterval = 1000 } = options
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const formatDateTime = () => {
      const now = new Date()
      
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }).toUpperCase()
      
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      switch (format) {
        case 'date':
          return dateStr
        case 'time':
          return timeStr
        case 'full':
        default:
          return `${dateStr} :: ${timeStr}`
      }
    }

    const update = () => setDateTime(formatDateTime())
    update()
    
    const interval = setInterval(update, updateInterval)
    return () => clearInterval(interval)
  }, [format, updateInterval])

  return dateTime
}

export default useDateTime
