import React from 'react'
import { CDPlayer } from './components/CDPlayer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center p-4">
      <CDPlayer />
    </div>
  )
}

export default App