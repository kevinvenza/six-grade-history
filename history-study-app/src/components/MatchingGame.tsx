import React, { useState, useEffect } from 'react';
import { vocabulary, type VocabularyItem } from '../data/vocabulary';
import '../styles/MatchingGame.css';

interface Match {
  wordId: string;
  definitionId: string;
}

const MatchingGame: React.FC = () => {
  const [shuffledWords, setShuffledWords] = useState<VocabularyItem[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<VocabularyItem[]>([]);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(null);
  
  // Track incorrect matches to show red briefly or persistently until clicked again
  const [incorrectMatches, setIncorrectMatches] = useState<Match[]>([]);
  
  // Scoring
  const [attempts, setAttempts] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);

  // Initialize and shuffle
  const initGame = (items: VocabularyItem[] = vocabulary) => {
    setShuffledWords([...items].sort(() => Math.random() - 0.5));
    setShuffledDefinitions([...items].sort(() => Math.random() - 0.5));
    setIncorrectMatches([]);
    setSelectedWordId(null);
    setSelectedDefinitionId(null);
    setAttempts(0);
    setMatchesFound(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Handle selection
  const handleWordClick = (id: string) => {
    // If it was marked incorrect, remove it from incorrectMatches
    if (incorrectMatches.some(m => m.wordId === id)) {
      setIncorrectMatches(prev => prev.filter(m => m.wordId !== id));
    }
    setSelectedWordId(id);
  };

  const handleDefinitionClick = (id: string) => {
    if (incorrectMatches.some(m => m.definitionId === id)) {
      setIncorrectMatches(prev => prev.filter(m => m.definitionId !== id));
    }
    setSelectedDefinitionId(id);
  };

  // Create match when both are selected
  useEffect(() => {
    if (selectedWordId && selectedDefinitionId) {
      setAttempts(prev => prev + 1);
      
      if (selectedWordId === selectedDefinitionId) {
        // Correct match! Remove from screen
        setShuffledWords(prev => prev.filter(w => w.id !== selectedWordId));
        setShuffledDefinitions(prev => prev.filter(d => d.id !== selectedDefinitionId));
        setMatchesFound(prev => prev + 1);
        
        // Ensure not in incorrectMatches
        setIncorrectMatches(prev => prev.filter(m => m.wordId !== selectedWordId && m.definitionId !== selectedDefinitionId));
      } else {
        // Incorrect match
        setIncorrectMatches(prev => {
          const filtered = prev.filter(m => m.wordId !== selectedWordId && m.definitionId !== selectedDefinitionId);
          return [...filtered, { wordId: selectedWordId, definitionId: selectedDefinitionId }];
        });
      }
      setSelectedWordId(null);
      setSelectedDefinitionId(null);
    }
  }, [selectedWordId, selectedDefinitionId]);

  const handleStartOver = () => {
    initGame();
  };

  const isGameOver = vocabulary.length > 0 && matchesFound === vocabulary.length;
  
  const getIncorrectMatchForWord = (id: string) => incorrectMatches.find(m => m.wordId === id);
  const getIncorrectMatchForDefinition = (id: string) => incorrectMatches.find(m => m.definitionId === id);

  const wrongAttempts = Math.max(0, attempts - vocabulary.length);
  const scoreRaw = Math.max(0, vocabulary.length - wrongAttempts);
  const scorePercent = Math.round((scoreRaw / vocabulary.length) * 100);

  return (
    <div className="game-container">
      <header>
        <h1>Ancient Egypt Study Match</h1>
        <p className="subtitle">Help your daughter ace her 6th Grade History Final!</p>
      </header>
      
      <p className="instructions">
        {isGameOver 
          ? "Great job! You have matched all the words." 
          : "Match each word with its correct definition. Click a word, then click its definition."}
      </p>

      {isGameOver && (
        <div className="score-summary">
          <h2>Score: {scorePercent}%</h2>
          <p>You found all {vocabulary.length} matches with {wrongAttempts} incorrect attempt{wrongAttempts !== 1 ? 's' : ''}.</p>
          <div className="actions">
            <button className="reset-button" onClick={handleStartOver}>Play Again</button>
          </div>
        </div>
      )}

      {!isGameOver && (
        <div className="matching-grid">
          <div className="column words-column">
            <h3>Vocabulary</h3>
            <div className="cards-list">
              {shuffledWords.map(item => {
                const incorrectMatch = getIncorrectMatchForWord(item.id);
                const isIncorrect = !!incorrectMatch;

                return (
                  <div
                    key={item.id}
                    className={`card word-card 
                      ${selectedWordId === item.id ? 'selected' : ''} 
                      ${isIncorrect ? 'incorrect' : ''}`}
                    onClick={() => handleWordClick(item.id)}
                  >
                    {item.word}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="column definitions-column">
            <h3>Definitions</h3>
            <div className="cards-list">
              {shuffledDefinitions.map(item => {
                const incorrectMatch = getIncorrectMatchForDefinition(item.id);
                const isIncorrect = !!incorrectMatch;

                return (
                  <div
                    key={item.id}
                    className={`card definition-card 
                      ${selectedDefinitionId === item.id ? 'selected' : ''} 
                      ${isIncorrect ? 'incorrect' : ''}`}
                    onClick={() => handleDefinitionClick(item.id)}
                  >
                    {item.definition}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!isGameOver && (
        <div className="game-actions">
          <button className="reset-button" onClick={handleStartOver}>Reset All</button>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
