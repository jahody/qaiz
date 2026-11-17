import React, { useState } from 'react';
import { sound } from '../utils/sound';

interface PracticeScreenProps {
  hearts: number;
  maxHearts: number;
  onRefillHeart: () => void;
  onBackToPath: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  hearts,
  maxHearts,
  onRefillHeart,
  onBackToPath
}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const questions = [
    {
      q: 'Why does Bayes\' Rule matter for real-world AI?',
      options: [
        'It forces you to consider how rare an event is before jumping to conclusions',
        'It makes models run twice as fast on your phone',
        'It replaces neural networks completely'
      ],
      correct: 0,
      exp: 'Bayesian thinking anchors predictions in prior probability, preventing base-rate delusions.'
    },
    {
      q: 'What is the main danger of High Precision at the cost of Low Recall in medical screening?',
      options: [
        'Missing life-threatening diseases in patients',
        'Sending too many false alarm letters',
        'Using too much electricity'
      ],
      correct: 0,
      exp: 'Low recall means real sick patients slip through undetected.'
    },
    {
      q: 'In a Mixture of Experts (MoE) architecture like Qwen, what does the router do?',
      options: [
        'Directs each word to only a few specialized sub-networks',
        'Connects your phone to Wi-Fi',
        'Translates code into Python'
      ],
      correct: 0,
      exp: 'Sparse routing activates only the relevant experts, slashing computational waste.'
    }
  ];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    const correct = idx === questions[currentQ].correct;
    setIsAnswered(true);
    if (correct) sound.playCorrect();
    else sound.playIncorrect();
  };

  const handleNext = () => {
    sound.playTick();
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setIsDone(true);
      sound.playFanfare();
      onRefillHeart();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#F8FAFC', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>🩺 Heart Clinic & Review</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#EF4444' }}>
          <span>❤️</span>
          <span>{hearts}/{maxHearts}</span>
        </div>
      </div>

      {!isDone ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>
            PRACTICE DRILL {currentQ + 1} OF {questions.length}
          </div>

          <div style={{ padding: '16px', background: '#FFFFFF', borderRadius: '16px', border: '2px solid #E2E8F0', marginBottom: '16px', fontWeight: 700, color: '#1E293B', fontSize: '15px' }}>
            {questions[currentQ].q}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {questions[currentQ].options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrectOpt = idx === questions[currentQ].correct;
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
              <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                💡 {questions[currentQ].exp}
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
                {currentQ + 1 < questions.length ? 'Next Question' : 'Complete Review (+1 ❤️)'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '14px' }}>
          <div style={{ fontSize: '50px' }}>❤️‍🩹</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A' }}>Heart Restored!</div>
          <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '280px' }}>
            You completed the review drill. Your mental models are refreshed and 1 Heart was added to your pouch.
          </div>
          <button
            onClick={onBackToPath}
            style={{
              marginTop: '16px',
              padding: '14px 28px',
              borderRadius: '16px',
              background: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Return to Path
          </button>
        </div>
      )}
    </div>
  );
};
