import { useState, useEffect } from 'react';
import { Trophy, CheckCircle, XCircle, RotateCcw, Target, Zap } from 'lucide-react';
import { fetchBestScoreApi, saveBestScoreApi } from '../services/apiService';

/**
 * QuoteChallenge — Interactive mini-game: "Guess the Author".
 * Displays a quote with 4 multiple-choice author options.
 * Tracks correct/incorrect answers, score, accuracy %, and best score in MySQL database.
 */
function QuoteChallenge({ quotes, onShowToast, user }) {
  const [bestScore, setBestScore] = useState(0);

  // Game state
  const [difficulty, setDifficulty] = useState('Medium'); // Easy, Medium, Hard
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Score tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const totalQuestions = 10;

  // Load best score from MySQL on mount / user change
  useEffect(() => {
    async function loadBestScore() {
      const email = user?.email || 'guest';
      const score = await fetchBestScoreApi(email);
      setBestScore(score);
    }
    loadBestScore();
  }, [user]);

  // Generate new question
  const generateQuestion = () => {
    if (!quotes || quotes.length === 0) return;

    // Pick random target quote
    const targetQuote = quotes[Math.floor(Math.random() * quotes.length)];

    // Get all distinct authors
    const allAuthors = [...new Set(quotes.map(q => q.author))];
    const otherAuthors = allAuthors.filter(a => a !== targetQuote.author);

    // Pick 3 random wrong options
    const shuffledOthers = [...otherAuthors].sort(() => 0.5 - Math.random());
    const wrongOptions = shuffledOthers.slice(0, 3);

    // Combine and shuffle 4 options
    const fourOptions = [...wrongOptions, targetQuote.author].sort(() => 0.5 - Math.random());

    setCurrentQuestion(targetQuote);
    setOptions(fourOptions);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateQuestion();
  }, [quotes]);

  const handleSelectOption = async (author) => {
    if (isAnswered) return;

    setSelectedOption(author);
    setIsAnswered(true);

    const isCorrect = author === currentQuestion.author;

    if (isCorrect) {
      const points = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 30;
      const newScore = currentScore + points;
      setCurrentScore(newScore);
      setCorrectCount(prev => prev + 1);

      if (newScore > bestScore) {
        setBestScore(newScore);
        await saveBestScoreApi(user?.email || 'guest', newScore);
      }

      if (onShowToast) onShowToast('Correct! +Points 🎉', 'success');
    } else {
      setIncorrectCount(prev => prev + 1);
      if (onShowToast) onShowToast(`Incorrect! Correct author: ${currentQuestion.author}`, 'error');
    }
  };

  const handleNextQuestion = () => {
    if (questionCount >= totalQuestions) {
      if (onShowToast) onShowToast(`Challenge Complete! Final Score: ${currentScore}`, 'info');
    } else {
      setQuestionCount(prev => prev + 1);
      generateQuestion();
    }
  };

  const handleRestart = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
    setCurrentScore(0);
    setQuestionCount(1);
    generateQuestion();
  };

  const totalAttempted = correctCount + incorrectCount;
  const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
  const progressPercent = Math.round((questionCount / totalQuestions) * 100);

  if (!currentQuestion) return null;

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '750px' }}>

        {/* Header & Scores */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Trophy size={36} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
            Quote Challenge
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Test your literary knowledge: Guess who said the quote!
          </p>

          {/* Difficulty Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            {['Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                className={`chip ${difficulty === diff ? 'active' : ''}`}
                onClick={() => { setDifficulty(diff); handleRestart(); }}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Score Board Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-accent)' }}>{currentScore}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Best Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b' }}>{bestScore}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#22c55e' }}>{accuracy}%</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Question</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{questionCount}/{totalQuestions}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '6px',
          background: 'var(--bg-glass)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'var(--accent-gradient)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Question Card */}
        <div className="glass-card-static glow-pulse" style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem'
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            &ldquo;{currentQuestion.text}&rdquo;
          </p>

          {/* Multiple Choice Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {options.map((author) => {
              let btnStyle = {
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-glass)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              };

              if (isAnswered) {
                if (author === currentQuestion.author) {
                  btnStyle.background = 'rgba(34, 197, 94, 0.2)';
                  btnStyle.borderColor = '#22c55e';
                  btnStyle.color = '#22c55e';
                } else if (author === selectedOption) {
                  btnStyle.background = 'rgba(239, 68, 68, 0.2)';
                  btnStyle.borderColor = '#ef4444';
                  btnStyle.color = '#ef4444';
                }
              }

              return (
                <button
                  key={author}
                  style={btnStyle}
                  onClick={() => handleSelectOption(author)}
                  disabled={isAnswered}
                >
                  <span>{author}</span>
                  {isAnswered && author === currentQuestion.author && <CheckCircle size={18} style={{ color: '#22c55e' }} />}
                  {isAnswered && author === selectedOption && author !== currentQuestion.author && <XCircle size={18} style={{ color: '#ef4444' }} />}
                </button>
              );
            })}
          </div>

          {/* Next / Restart Control */}
          {isAnswered && (
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              {questionCount < totalQuestions ? (
                <button className="btn-accent" onClick={handleNextQuestion}>
                  Next Question →
                </button>
              ) : (
                <button className="btn-accent" onClick={handleRestart}>
                  <RotateCcw size={18} /> Play Again
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default QuoteChallenge;
