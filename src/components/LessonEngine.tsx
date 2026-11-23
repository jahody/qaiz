import React, { useMemo, useState } from 'react';
import type { ExerciseStep } from '../types';
import { StepVisual, ConfettiCanvas } from './VisualWidgets';
import { sound } from '../utils/sound';
import { formatDollars, roundToStep } from '../utils/format';

interface LessonEngineProps {
  steps: ExerciseStep[];
  hearts: number;
  hapticsEnabled: boolean;
  /** Streak the learner will have once this lesson is completed (shown on the celebration card). */
  streakAfter: number;
  onDeductHeart: () => void;
  onLessonComplete: (earnedXp: number) => void;
  onOutOfHearts: () => void;
  onExit: () => void;
}

interface QueueEntry {
  index: number;
  retry: boolean;
}

const initialSliderValue =(step: ExerciseStep | undefined) => step?.sliderConfig?.defaultValue ?? 0;

function formatSliderValue(step: ExerciseStep, value: number): string {
  const config = step.sliderConfig;
  if (!config) return String(value);
  if (config.format === 'log_dollars') return formatDollars(Math.pow(10, value));
  return `${roundToStep(value, config.step)}${config.unit}`;
}

/** Renders `**bold**` segments; everything else is plain text. */
function renderRichText(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} style={{ color: '#FDE047' }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Stable shuffle of the right-hand column where no item sits beside its own partner. */
function deranged<T extends { id: string }>(items: T[], seedKey: string): T[] {
  if (items.length < 2) return items;
  let seed = hashString(seedKey);
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let attempt = 0; attempt < 20; attempt++) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (shuffled.every((item, i) => item.id !== items[i].id)) return shuffled;
  }
  return [...items.slice(1), items[0]];
}

export const LessonEngine: React.FC<LessonEngineProps> = ({
  steps,
  hearts,
  hapticsEnabled,
  streakAfter,
  onDeductHeart,
  onLessonComplete,
  onOutOfHearts,
  onExit
}) => {
  // Play order; a missed question is queued again (as a retry) just before the celebration.
  const [queue, setQueue] = useState<QueueEntry[]>(() => steps.map((_, index) => ({ index, retry: false })));
  const [pos, setPos] = useState(0);
  const [sliderValue, setSliderValue] = useState<number>(() => initialSliderValue(steps[0]));
  const [selectedBinary, setSelectedBinary] = useState<boolean | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [earnedXp, setEarnedXp] = useState(0);

  // Matching game state
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

  // Step feedback state
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const entry = queue[pos] ?? queue[0];
  const step = steps[entry.index];
  const stepXp = entry.retry ? Math.ceil(step.xpValue / 2) : step.xpValue;
  const progressPercent = ((pos + 1) / queue.length) * 100;
  const outOfHearts = hearts <= 0 && step.type !== 'celebration';

  const rightColumn = useMemo(() => deranged(step.matchingPairs ?? [], step.id), [step]);

  const triggerFeedback = (success: boolean) => {
    if (success) sound.playCorrect();
    else sound.playIncorrect();

    if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(success ? [40, 60, 40] : [100, 50, 100]);
    }
  };

  const resolveAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    triggerFeedback(correct);
    if (correct) {
      setEarnedXp((xp) => xp + stepXp);
      return;
    }
    onDeductHeart();
    setQueue((q) => {
      const celebrationAt = q.findIndex((e, i) => i > pos && steps[e.index].type === 'celebration');
      const insertAt = celebrationAt === -1 ? q.length : celebrationAt;
      return [...q.slice(0, insertAt), { index: entry.index, retry: true }, ...q.slice(insertAt)];
    });
  };

  const handleBinarySelect = (val: boolean) => {
    if (isAnswerChecked || outOfHearts) return;
    setSelectedBinary(val);
    resolveAnswer(val === step.correctAnswer);
  };

  const handleSliderCheck = () => {
    if (isAnswerChecked || outOfHearts || !step.sliderConfig) return;
    const { targetMin, targetMax, step: increment } = step.sliderConfig;
    const val = roundToStep(sliderValue, increment);
    resolveAnswer(val >= targetMin && val <= targetMax);
  };

  const handleOptionSelect = (optionId: string, isOptCorrect: boolean) => {
    if (isAnswerChecked || outOfHearts) return;
    setSelectedOption(optionId);
    resolveAnswer(isOptCorrect);
  };

  const checkPair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const newMatches = [...matchedPairs, leftId];
      setMatchedPairs(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (step.matchingPairs && newMatches.length === step.matchingPairs.length) {
        resolveAnswer(true);
      } else {
        triggerFeedback(true);
      }
    } else {
      triggerFeedback(false);
      onDeductHeart();
      setWrongPair([leftId, rightId]);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPair(null);
      }, 500);
    }
  };

  const handleLeftMatchClick = (id: string) => {
    if (matchedPairs.includes(id) || wrongPair || outOfHearts) return;
    setSelectedLeft(id);
    sound.playTick();
    if (selectedRight) checkPair(id, selectedRight);
  };

  const handleRightMatchClick = (id: string) => {
    if (matchedPairs.includes(id) || wrongPair || outOfHearts) return;
    setSelectedRight(id);
    sound.playTick();
    if (selectedLeft) checkPair(selectedLeft, id);
  };

  const handleContinue = () => {
    sound.playTick();
    if (pos + 1 < queue.length) {
      const nextIndex = queue[pos + 1].index;
      setPos(pos + 1);
      setSliderValue(initialSliderValue(steps[nextIndex]));
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setSelectedBinary(null);
      setSelectedOption(null);
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongPair(null);

      if (steps[nextIndex].type === 'celebration') {
        sound.playFanfare();
      }
    } else {
      sound.playFanfare();
      onLessonComplete(earnedXp);
    }
  };

  const optionStyle = (isSelected: boolean, isOptCorrect: boolean): React.CSSProperties => {
    if (isAnswerChecked && isOptCorrect) return { border: '2px solid #22C55E', background: 'rgba(34, 197, 94, 0.12)' };
    if (isAnswerChecked && isSelected) return { border: '2px solid #EF4444', background: 'rgba(239, 68, 68, 0.12)' };
    if (isSelected) return { border: '2px solid #F59E0B', background: 'rgba(245, 158, 11, 0.1)' };
    return { border: '1px solid rgba(245, 158, 11, 0.2)', background: '#131825' };
  };

  const matchStyle = (id: string, isSelected: boolean, side: 0 | 1): React.CSSProperties => {
    const isMatched = matchedPairs.includes(id);
    const isWrong = wrongPair !== null && wrongPair[side] === id;
    return {
      border: isMatched ? '2px solid #86EFAC' : isWrong ? '2px solid #EF4444' : isSelected ? '2px solid #F59E0B' : '1px solid rgba(245, 158, 11, 0.2)',
      background: isMatched ? 'rgba(34, 197, 94, 0.12)' : isWrong ? 'rgba(239, 68, 68, 0.12)' : isSelected ? 'rgba(245, 158, 11, 0.1)' : '#131825',
      color: isMatched ? '#86EFAC' : '#F8FAFC',
      cursor: isMatched ? 'default' : 'pointer'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0B0F19', position: 'relative' }}>
      {/* Top Navigation & Progress */}
      <div style={{ padding: '14px 18px 8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onExit}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: '#94A3B8'
          }}
          title="Exit lesson"
          aria-label="Exit lesson"
        >
          ✕
        </button>

        {/* Progress Bar */}
        <div style={{ flex: 1, height: '10px', background: '#1E293B', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#F59E0B',
              borderRadius: '10px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Hearts indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#FB7185', fontSize: '15px', fontFamily: 'monospace' }}>
          <span>{hearts > 0 ? '❤️' : '💔'}</span>
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column' }}>
        {entry.retry && (
          <div
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 800,
              marginBottom: '6px',
              fontFamily: 'monospace'
            }}
          >
            ↺ SECOND CHANCE · HALF XP
          </div>
        )}
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#F8FAFC', marginBottom: '8px' }}>
          {step.title}
        </h2>

        {step.visualType && (
          <div style={{ marginBottom: '14px' }}>
            <StepVisual type={step.visualType} value={step.type === 'slider' ? sliderValue : undefined} />
          </div>
        )}

        {/* Concept Card Narrative + takeaway */}
        {step.type === 'concept_card' && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#CBD5E1', whiteSpace: 'pre-line' }}>
              {renderRichText(step.narrative ?? '')}
            </div>
            {step.explanation && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '10px 12px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderLeft: '4px solid #F59E0B',
                  borderRadius: '10px',
                  fontSize: '13px',
                  color: '#FDE047',
                  fontWeight: 600,
                  lineHeight: '1.4'
                }}
              >
                💡 {step.explanation}
              </div>
            )}
          </div>
        )}

        {/* Binary Choice (True/False) */}
        {step.type === 'binary_choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ padding: '14px', background: '#131825', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '15px', fontWeight: 600, color: '#F8FAFC', lineHeight: '1.4' }}>
              "{step.statement}"
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[true, false].map((val) => (
                <button
                  key={String(val)}
                  disabled={isAnswerChecked || outOfHearts}
                  onClick={() => handleBinarySelect(val)}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    ...optionStyle(selectedBinary === val, val === step.correctAnswer),
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: isAnswerChecked ? 'default' : 'pointer',
                    color: '#F8FAFC'
                  }}
                >
                  {val ? 'TRUE' : 'FALSE'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Slider */}
        {step.type === 'slider' && step.sliderConfig && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 600, lineHeight: '1.4' }}>
              {step.question}
            </div>

            <div style={{ background: '#131825', padding: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>
                <span>{step.sliderConfig.labelLow}</span>
                <span style={{ color: '#FDE047', fontWeight: 900, fontSize: '14px' }}>
                  {formatSliderValue(step, sliderValue)}
                </span>
                <span style={{ textAlign: 'right' }}>{step.sliderConfig.labelHigh}</span>
              </div>

              <input
                type="range"
                min={step.sliderConfig.min}
                max={step.sliderConfig.max}
                step={step.sliderConfig.step}
                value={sliderValue}
                onChange={(e) => {
                  sound.playTick();
                  setSliderValue(parseFloat(e.target.value));
                }}
                disabled={isAnswerChecked || outOfHearts}
                aria-label={step.question}
                style={{ width: '100%', accentColor: '#F59E0B', height: '8px', cursor: 'pointer' }}
              />
            </div>

            {!isAnswerChecked && !outOfHearts && (
              <button
                onClick={handleSliderCheck}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#F59E0B',
                  color: '#0B0F19',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Check Answer
              </button>
            )}
          </div>
        )}

        {/* Concept Match (tap pairs) */}
        {step.type === 'concept_match' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>
              {step.question}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {step.matchingPairs?.map((pair) => (
                  <button
                    key={`l-${pair.id}`}
                    disabled={matchedPairs.includes(pair.id)}
                    onClick={() => handleLeftMatchClick(pair.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      ...matchStyle(pair.id, selectedLeft === pair.id, 0),
                      fontWeight: 700,
                      fontSize: '12px',
                      textAlign: 'left'
                    }}
                  >
                    {pair.left} {matchedPairs.includes(pair.id) && '✓'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {rightColumn.map((pair) => (
                  <button
                    key={`r-${pair.id}`}
                    disabled={matchedPairs.includes(pair.id)}
                    onClick={() => handleRightMatchClick(pair.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      ...matchStyle(pair.id, selectedRight === pair.id, 1),
                      fontWeight: 500,
                      fontSize: '11px',
                      textAlign: 'left',
                      lineHeight: '1.2'
                    }}
                  >
                    {pair.right} {matchedPairs.includes(pair.id) && '✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Spot the Flaw / Tradeoff Tribunal */}
        {(step.type === 'spot_the_flaw' || step.type === 'tradeoff_tribunal') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 600, lineHeight: '1.4' }}>
              {step.question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              {step.options?.map((opt) => (
                <button
                  key={opt.id}
                  disabled={isAnswerChecked || outOfHearts}
                  onClick={() => handleOptionSelect(opt.id, !!opt.isCorrect)}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    ...optionStyle(selectedOption === opt.id, !!opt.isCorrect),
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#F8FAFC',
                    cursor: isAnswerChecked ? 'default' : 'pointer'
                  }}
                >
                  <div>{opt.text}</div>
                  {opt.subtext && (
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginTop: '2px' }}>
                      {opt.subtext}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Celebration Step */}
        {step.type === 'celebration' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', flex: 1 }}>
            <ConfettiCanvas />
            <div style={{ fontSize: '50px', margin: '-30px 0 0' }}>🏆</div>
            <div style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
              {renderRichText(step.narrative ?? '')}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px 18px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FDE047' }}>+{earnedXp + step.xpValue} XP</div>
                <div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 700 }}>Earned</div>
              </div>
              <div style={{ background: 'rgba(234, 88, 12, 0.15)', padding: '10px 18px', borderRadius: '14px', border: '1px solid rgba(234, 88, 12, 0.3)' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#FB923C' }}>Day {streakAfter} 🔥</div>
                <div style={{ fontSize: '10px', color: '#EA580C', fontWeight: 700 }}>Streak</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action / Feedback Bar */}
      {step.type !== 'celebration' && (
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid rgba(245, 158, 11, 0.2)',
            background: isAnswerChecked ? (isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)') : outOfHearts ? 'rgba(239, 68, 68, 0.1)' : '#0B0F19'
          }}
        >
          {isAnswerChecked && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '15px', color: isCorrect ? '#4ADE80' : '#FB7185' }}>
                <span>{isCorrect ? `✓ Spot on!${stepXp > 0 ? ` +${stepXp} XP` : ''}` : '✕ Not quite:'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '3px', lineHeight: '1.4' }}>
                {step.explanation}
              </div>
            </div>
          )}

          {outOfHearts ? (
            <>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#FB7185', marginBottom: '2px' }}>💔 Out of hearts</div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', marginBottom: '10px', lineHeight: '1.4' }}>
                Win one back with a quick review drill, or wait for the free refill (1 heart every 4 hours).
              </div>
              <button
                onClick={onOutOfHearts}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#FB7185',
                  color: '#0B0F19',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Go to Practice 🩺
              </button>
            </>
          ) : (
            (step.type === 'concept_card' || isAnswerChecked) && (
              <button
                onClick={handleContinue}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '16px',
                  background: isAnswerChecked ? (isCorrect ? '#22C55E' : '#FB7185') : '#F59E0B',
                  color: '#0B0F19',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                Continue
              </button>
            )
          )}
        </div>
      )}

      {step.type === 'celebration' && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(245, 158, 11, 0.2)', background: '#0B0F19' }}>
          <button
            onClick={() => onLessonComplete(earnedXp + step.xpValue)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: '#F59E0B',
              color: '#0B0F19',
              border: 'none',
              fontWeight: 800,
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #B45309',
              fontFamily: 'monospace'
            }}
          >
            Claim Rewards & Return to Path
          </button>
        </div>
      )}
    </div>
  );
};
