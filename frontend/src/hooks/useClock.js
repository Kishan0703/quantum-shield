import React, { useState, useEffect } from 'react'
export function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19) + ' UTC')
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}
