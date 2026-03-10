"use client"

import { useEffect } from "react"

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }

    window.addEventListener('beforeinstallprompt', (e)=>{
      console.log(e)

    })

  }, [])

  return null
}
