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
  const [matches, setMatches] = useState<Match[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Initialize and shuffle
  const initGame = (items: VocabularyItem[] = vocabulary) => {
    setShuffledWords([...items].sort(() => Math.random() - 0.5));
    setShuffledDefinitions([...items].sort(() => Math.random() - 0.5));
    setMatches([]);
    setSelectedWordId(null);
    setSelectedDefinitionId(null);
    setSubmitted(false);
    setScore(null);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Handle selection
  const handleWordClick = (id: string) => {
    if (submitted) return;
    // If already matched, we can allow re-selection (unmatching)
    if (matches.some(m => m.wordId === id)) {
      setMatches(prev => prev.filter(m => m.wordId !== id));
    }
    setSelectedWordId(id);
  };

  const handleDefinitionClick = (id: string) => {
    if (submitted) return;
    if (matches.some(m => m.definitionId === id)) {
      setMatches(prev => prev.filter(m => m.definitionId !== id));
    }
    setSelectedDefinitionId(id);
  };

  // Create match when both are selected
  useEffect(() => {
    if (selectedWordId && selectedDefinitionId) {
      // Remove any existing matches for these IDs
      setMatches(prev => {
        const filtered = prev.filter(m => m.wordId !== selectedWordId && m.definitionId !== selectedDefinitionId);
        return [...filtered, { wordId: selectedWordId, definitionId: selectedDefinitionId }];
      });
      setSelectedWordId(null);
      setSelectedDefinitionId(null);
    }
  }, [selectedWordId, selectedDefinitionId]);

  const handleSubmit = () => {
    let correctCount = 0;
    matches.forEach(match => {
      if (match.wordId === match.definitionId) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleRetryMissed = () => {
    // Keep only correct matches
    const correctMatches = matches.filter(m => m.wordId === m.definitionId);
    setMatches(correctMatches);
    
    // Shuffling again to keep it challenging
    setShuffledWords(prev => [...prev].sort(() => Math.random() - 0.5));
    setShuffledDefinitions(prev => [...prev].sort(() => Math.random() - 0.5));
    
    setSubmitted(false);
    setScore(null);
  };

  const handleStartOver = () => {
    initGame();
  };

  const getMatchForWord = (id: string) => matches.find(m => m.wordId === id);
  const getMatchForDefinition = (id: string) => matches.find(m => m.definitionId === id);

  return (
    <div className="game-container">
      <header>
        <h1>Ancient Egypt Study Match</h1>
        <p className="subtitle">Help your daughter ace her 6th Grade History Final!</p>
      </header>
      
      <p className="instructions">
        {submitted 
          ? "Check your results below. You can retry the ones you missed or start over." 
          : "Match each word with its correct definition. Click a word, then click its definition."}
      </p>

      {submitted && score !== null && (
        <div className="score-summary">
          <h2>Score: {score} / {vocabulary.length}</h2>
          <div className="actions">
            {score < vocabulary.length && (
              <button className="retry-button" onClick={handleRetryMissed}>Retry Missed</button>
            )}
            <button className="reset-button" onClick={handleStartOver}>Start Over</button>
          </div>
        </div>
      )}

      <div className="matching-grid">
        <div className="column words-column">
          <h3>Vocabulary</h3>
          <div className="cards-list">
            {shuffledWords.map(item => {
              const match = getMatchForWord(item.id);
              const isCorrect = submitted && match && match.wordId === match.definitionId;
              const isIncorrect = submitted && match && match.wordId !== match.definitionId;
              const isMatched = !!match;

              return (
                <div
                  key={item.id}
                  className={`card word-card 
                    ${selectedWordId === item.id ? 'selected' : ''} 
                    ${isMatched ? 'matched' : ''} 
                    ${isCorrect ? 'correct' : ''} 
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
              const match = getMatchForDefinition(item.id);
              const isCorrect = submitted && match && match.wordId === match.definitionId;
              const isIncorrect = submitted && match && match.wordId !== match.definitionId;
              const isMatched = !!match;

              return (
                <div
                  key={item.id}
                  className={`card definition-card 
                    ${selectedDefinitionId === item.id ? 'selected' : ''} 
                    ${isMatched ? 'matched' : ''} 
                    ${isCorrect ? 'correct' : ''} 
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

      {!submitted && (
        <div className="game-actions">
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={matches.length === 0}
          >
            Submit All Matches
          </button>
          <button className="reset-button" onClick={handleStartOver}>Reset All</button>
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
