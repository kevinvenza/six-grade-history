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
        <button 
          className={subject === 'religion' ? 'active' : ''} 
          onClick={() => setSubject('religion')}
        >
          Religion
        </button>
        <button 
          className={subject === 'spanish' ? 'active' : ''} 
          onClick={() => setSubject('spanish')}
        >
          Spanish
        </button>
      </div>
      <MatchingGame subject={subject} />
    </div>
  )
}

export default App
