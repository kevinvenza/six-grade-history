import { useState, useEffect } from 'react';
import { mathTopics } from '../data/mathData';
import type { MathQuestion } from '../data/mathData';
import '../styles/MathQuiz.css';

export default function MathQuiz() {
  const [stage, setStage] = useState<'intro' | 'tutorial' | 'quiz' | 'summary'>('intro');
  const [topicIndex, setTopicIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  
  const [scores, setScores] = useState<Record<string, { correct: number, total: number }>>({});
  
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set(mathTopics.map(t => t.id)));
  const [questionsPerTopic, setQuestionsPerTopic] = useState(2);
  
  const activeTopics = mathTopics.filter(t => selectedTopics.has(t.id));

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generate a new question when entering a quiz stage or next question
  useEffect(() => {
    if (stage === 'quiz' && activeTopics[topicIndex]) {
      setCurrentQuestion(activeTopics[topicIndex].generateQuestion());
      setSelectedOption(null);
      setShowFeedback(false);
    }
  }, [stage, topicIndex, questionIndex, activeTopics]);

  const handleStart = () => {
    setScores({});
    setTopicIndex(0);
    setQuestionIndex(0);
    setStage('tutorial');
  };

  const handleStartTopicQuiz = () => {
    setStage('quiz');
  };

  const handleOptionSelect = (option: string) => {
    if (showFeedback) return; // Prevent double answering
    setSelectedOption(option);
    setShowFeedback(true);
    
    const isCorrect = option === currentQuestion?.correctAnswer;
    const topicId = activeTopics[topicIndex].id;
    
    setScores(prev => {
      const topicScore = prev[topicId] || { correct: 0, total: 0 };
      return {
        ...prev,
        [topicId]: {
          correct: topicScore.correct + (isCorrect ? 1 : 0),
          total: topicScore.total + 1
        }
      };
    });
  };

  const handleNext = () => {
    if (questionIndex + 1 < questionsPerTopic) {
      setQuestionIndex(prev => prev + 1);
    } else {
      // Move to next topic or summary
      if (topicIndex + 1 < activeTopics.length) {
        setTopicIndex(prev => prev + 1);
        setQuestionIndex(0);
        setStage('tutorial');
      } else {
        setStage('summary');
      }
    }
  };

  if (stage === 'intro') {
    const toggleTopic = (id: string) => {
      setSelectedTopics(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return newSet;
      });
    };
    
    const selectAll = () => setSelectedTopics(new Set(mathTopics.map(t => t.id)));
    const clearAll = () => setSelectedTopics(new Set());

    return (
      <div className="math-container">
        <div className="intro-card">
          <h2>6th Grade Math Challenge</h2>
          <p>Customize your practice session!</p>
          
          <div className="quiz-settings">
            <label>
              Questions per topic:
              <select 
                value={questionsPerTopic} 
                onChange={(e) => setQuestionsPerTopic(Number(e.target.value))}
                className="questions-select"
              >
                {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>

          <div className="topic-selection">
            <div className="topic-selection-header">
              <h3>Select Topics ({selectedTopics.size} chosen)</h3>
              <div className="selection-actions">
                <button type="button" onClick={selectAll}>Select All</button>
                <button type="button" onClick={clearAll}>Clear All</button>
              </div>
            </div>
            
            <div className="topic-list">
              {mathTopics.map(t => (
                <label key={t.id} className="topic-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectedTopics.has(t.id)}
                    onChange={() => toggleTopic(t.id)}
                  />
                  <span className="topic-chapter">Ch {t.chapter}</span>
                  {t.title}
                </label>
              ))}
            </div>
          </div>
          
          <button 
            className="start-btn" 
            onClick={handleStart}
            disabled={selectedTopics.size === 0}
          >
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'tutorial') {
    const topic = activeTopics[topicIndex];
    if (!topic) return null;
    return (
      <div className="math-container">
        <div className="tutorial-card">
          <div className="chapter-badge">Chapter {topic.chapter}</div>
          <h2>{topic.title}</h2>
          <div className="tutorial-content">
            <h3>Quick Review:</h3>
            <p>{topic.tutorial}</p>
          </div>
          <button className="start-btn" onClick={handleStartTopicQuiz}>
            Ready for Questions!
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'summary') {
    let totalCorrect = 0;
    let totalQuestions = 0;
    Object.values(scores).forEach(s => {
      totalCorrect += s.correct;
      totalQuestions += s.total;
    });
    
    const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    return (
      <div className="math-container summary-container">
        <div className="summary-card">
          <h2>Exam Complete!</h2>
          <div className="final-score">
            Your Score: {totalCorrect} / {totalQuestions} ({percentage}%)
          </div>
          
          <div className="topic-breakdown">
            <h3>Topic Breakdown</h3>
            <div className="breakdown-grid">
              {activeTopics.map(topic => {
                const s = scores[topic.id] || { correct: 0, total: 0 };
                const needsWork = s.total > 0 && (s.correct / s.total) < 0.6;
                return (
                  <div key={topic.id} className={`breakdown-row ${needsWork ? 'needs-work' : 'good'}`}>
                    <span className="topic-name">{topic.title}</span>
                    <span className="topic-score">{s.correct} / {s.total}</span>
                    {needsWork && <span className="warning-icon">⚠️ Needs Review</span>}
                  </div>
                );
              })}
            </div>
          </div>
          
          <button className="start-btn" onClick={() => setStage('intro')}>Back to Setup</button>
        </div>
      </div>
    );
  }

  // Quiz stage
  const topic = activeTopics[topicIndex];
  if (!topic) return null;
  return (
    <div className="math-container">
      <div className="quiz-header">
        <span className="progress">Topic {topicIndex + 1} of {activeTopics.length}</span>
        <span className="progress">Question {questionIndex + 1} of {questionsPerTopic}</span>
      </div>
      
      <div className="quiz-card">
        <h3>{topic.title}</h3>
        <p className="question-text">{currentQuestion?.question}</p>
        
        <div className="options-grid">
          {currentQuestion?.options.map((option, idx) => {
            let className = 'option-btn';
            if (showFeedback) {
              if (option === currentQuestion.correctAnswer) className += ' correct';
              else if (option === selectedOption) className += ' incorrect';
              else className += ' disabled';
            }
            
            return (
              <button 
                key={idx}
                className={className}
                onClick={() => handleOptionSelect(option)}
                disabled={showFeedback}
              >
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`feedback-box ${selectedOption === currentQuestion?.correctAnswer ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <h4>{selectedOption === currentQuestion?.correctAnswer ? 'Great Job!' : 'Not Quite!'}</h4>
            <p>{currentQuestion?.explanation}</p>
            <button className="next-btn" onClick={handleNext}>
              {questionIndex + 1 < questionsPerTopic ? 'Next Question' : 'Next Topic'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
