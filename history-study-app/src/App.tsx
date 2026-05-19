import { useState } from 'react'
import MatchingGame from './components/MatchingGame'
import MathQuiz from './components/MathQuiz'
import type { Subject } from './data/vocabulary'
import './styles/MatchingGame.css'

type AppSection = Subject | 'math'

function App() {
  const [section, setSection] = useState<AppSection>('history')

  return (
    <div className="App">
      <div className="subject-toggle">
        <button 
          className={section === 'history' ? 'active' : ''} 
          onClick={() => setSection('history')}
        >
          History
        </button>
        <button 
          className={section === 'ela' ? 'active' : ''} 
          onClick={() => setSection('ela')}
        >
          ELA
        </button>
        <button 
          className={section === 'religion' ? 'active' : ''} 
          onClick={() => setSection('religion')}
        >
          Religion
        </button>
        <button 
          className={section === 'spanish' ? 'active' : ''} 
          onClick={() => setSection('spanish')}
        >
          Spanish
        </button>
        <button 
          className={section === 'math' ? 'active' : ''} 
          onClick={() => setSection('math')}
        >
          Math
        </button>
      </div>
      
      {section === 'math' ? (
        <MathQuiz />
      ) : (
        <MatchingGame subject={section} />
      )}
    </div>
  )
}

export default App
