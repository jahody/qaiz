import React, { useState } from 'react';
import type { Track } from '../types';
import { sound } from '../utils/sound';
import { pickPracticeQuestions } from '../utils/practice';
import { formatDuration } from '../utils/progress';

export const PRACTICE_XP_REWARD = 5;
const PASS_MARK = 2;

interface PracticeScreenProps {
  tracks: Track[];
  completedLessons: string[];
  hearts: number;
  maxHearts: number;
  /** Milliseconds until the next free heart, or null when hearts are full. */
  nextHeartInMs: number | null;
  onReward: (kind: 'heart' | 'xp') => void;
  onBackToPath: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  tracks,
  completedLessons,
  hearts,
  maxHearts,
  nextHeartInMs,
  onReward,
  onBackToPath
}) => {
  const [questions, setQuestions] = useState(() => pickPracticeQuestions(tracks, completedLessons));
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<'heart' | 'xp' | 'failed' | null>(null);

  const question = questions[currentQ];
  const heartsFull = hearts >= maxHearts;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    const correct = idx === question.correct;
    setIsAnswered(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }
  };

  const handleNext = () => {
    sound.playTick();
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      return;
    }
    if (correctCount >= PASS_MARK) {
      const kind = heartsFull ? 'xp' : 'heart';
      sound.playFanfare();
      onReward(kind);
      setResult(kind);
    } else {
      setResult('failed');
    }
  };

  const restart = () => {
    sound.playTick();
    setQuestions(pickPracticeQuestions(tracks, completedLessons));
    setCurrentQ(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC', padding: '16px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>🩺 Heart Clinic & Review</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#EF4444' }}>
          <span>❤️</span>
          <span>{hearts}/{maxHearts}</span>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '14px' }}>
        {heartsFull
          ? `Hearts full: pass a drill for +${PRACTICE_XP_REWARD} XP.`
          : `Get ${PASS_MARK} of ${questions.length} right to win a heart.${nextHeartInMs !== null ? ` Next free heart in ${formatDuration(nextHeartInMs)}.` : ''}`}
      </div>

      {result === null ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>
            PRACTICE DRILL {currentQ + 1} OF {questions.length}
          </div>

          <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: '16px', border: '2px solid #E2E8F0', marginBottom: '16px', fontWeight: 700, color: '#1E293B', fontSize: '15px', lineHeight: '1.4' }}>
            {question.q}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === question.correct;
              let borderColor = '#E2E8F0';
              let bgColor = '#FFFFFF';

              if (isAnswered) {
                if (isCorrectOpt) {
                  borderColor = '#22C55E';
                  bgColor = '#F0FDF4';
                } else if (isSelected) {
                  borderColor = '#EF4444';
                  bgColor = '#FEF2F2';
                }
              } else if (isSelected) {
                borderColor = '#3B82F6';
                bgColor = '#EFF6FF';
              }

              return (
                <button
                  key={opt}
                  disabled={isAnswered}
                  onClick={() => handleSelect(idx)}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: `2px solid ${borderColor}`,
                    background: bgColor,
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#1E293B',
                    cursor: isAnswered ? 'default' : 'pointer'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px', lineHeight: '1.4' }}>
                💡 {question.exp}
              </div>
              <button
                onClick={handleNext}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#22C55E',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                {currentQ + 1 < questions.length ? 'Next Question' : 'Finish Drill'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '14px' }}>
          <div style={{ fontSize: '50px' }}>{result === 'heart' ? '❤️‍🩹' : result === 'xp' ? '⚡' : '📚'}</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: result === 'failed' ? '#D97706' : '#16A34A' }}>
            {result === 'heart' ? 'Heart Restored!' : result === 'xp' ? `+${PRACTICE_XP_REWARD} XP` : 'Almost there'}
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '280px', lineHeight: '1.4' }}>
            {result === 'heart' && `You got ${correctCount} of ${questions.length} right, and 1 heart went back into your pouch.`}
            {result === 'xp' && `You got ${correctCount} of ${questions.length} right. Your hearts were already full, so you earned XP instead.`}
            {result === 'failed' && `You got ${correctCount} of ${questions.length} right. You need ${PASS_MARK} to pass, so try a fresh drill.`}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {(result === 'failed' || !heartsFull) && (
              <button
                onClick={restart}
                style={{ padding: '14px 20px', borderRadius: '16px', background: '#FFFFFF', color: '#2563EB', border: '2px solid #BFDBFE', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}
              >
                {result === 'failed' ? 'Try Again' : 'Another Drill'}
              </button>
            )}
            <button
              onClick={onBackToPath}
              style={{ padding: '14px 20px', borderRadius: '16px', background: '#2563EB', color: '#FFFFFF', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}
            >
              Return to Path
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
