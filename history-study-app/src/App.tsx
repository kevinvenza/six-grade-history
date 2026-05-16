import { useState } from 'react'
import MatchingGame from './components/MatchingGame'
import type { Subject } from './data/vocabulary'
import './styles/MatchingGame.css'

function App() {
  const [subject, setSubject] = useState<Subject>('history')

  return (
    <div className="App">
      <div className="subject-toggle">
        <button 
          className={subject === 'history' ? 'active' : ''} 
          onClick={() => setSubject('history')}
        >
          History
        </button>
        <button 
          className={subject === 'ela' ? 'active' : ''} 
          onClick={() => setSubject('ela')}
        >
          ELA
        </button>
      </div>
      <MatchingGame subject={subject} />
    </div>
  )
}

export default App
