import React, { useState } from 'react';
import type { ExerciseStep } from '../types';
import {
  DoctorTestVisual,
  PriorPieVisual,
  AccuracySimVisual,
  BalanceScaleVisual,
  DistributionSimVisual,
  EmbeddingSimVisual,
  NeuronBouncerVisual,
  AttentionSimVisual,
  MoERoutingVisual,
  ReActTraceVisual,
  ConfettiCanvas
} from './VisualWidgets';
import { sound } from '../utils/sound';

interface LessonEngineProps {
  steps: ExerciseStep[];
  hearts: number;
  onDeductHeart: () => void;
  onLessonComplete: (earnedXp: number) => void;
  onExit: () => void;
}

export const LessonEngine: React.FC<LessonEngineProps> = ({
  steps,
  hearts,
  onDeductHeart,
  onLessonComplete,
  onExit
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedBinary, setSelectedBinary] = useState<boolean | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(95);
  const [spamSliderValue, setSpamSliderValue] = useState<number>(20);
  const [selectedFlawOption, setSelectedFlawOption] = useState<string | null>(null);

  // Matching game state
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Step feedback state
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const step = steps[currentStepIndex] || steps[0];
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  const triggerHaptic = (success: boolean) => {
    if (success) sound.playCorrect();
    else sound.playIncorrect();

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(success ? [40, 60, 40] : [100, 50, 100]);
    }
  };

  const handleBinarySelect = (val: boolean) => {
    if (isAnswerChecked) return;
    setSelectedBinary(val);
    const correct = val === step.correctAnswer;
    setIsCorrect(correct);
    setIsAnswerChecked(true);
    triggerHaptic(correct);
    if (!correct) onDeductHeart();
  };

  const handleSliderCheck = () => {
    if (isAnswerChecked) return;
    const config = step.sliderConfig!;
    const val = step.visualType === 'spam_slider' ? spamSliderValue : sliderValue;
    const correct =
      config.targetMin !== undefined &&
      config.targetMax !== undefined &&
      val >= config.targetMin &&
      val <= config.targetMax;

    setIsCorrect(correct);
    setIsAnswerChecked(true);
    triggerHaptic(correct);
    if (!correct) onDeductHeart();
  };

  const handleOptionSelect = (optionId: string, isOptCorrect: boolean) => {
    if (isAnswerChecked) return;
    setSelectedFlawOption(optionId);
    setIsCorrect(isOptCorrect);
    setIsAnswerChecked(true);
    triggerHaptic(isOptCorrect);
    if (!isOptCorrect) onDeductHeart();
  };

  const handleLeftMatchClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedLeft(id);
    sound.playTick();
    if (selectedRight) {
      checkPair(id, selectedRight);
    }
  };

  const handleRightMatchClick = (id: string) => {
    if (matchedPairs.includes(id)) return;
    setSelectedRight(id);
    sound.playTick();
    if (selectedLeft) {
      checkPair(selectedLeft, id);
    }
  };

  const checkPair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      const newMatches = [...matchedPairs, leftId];
      setMatchedPairs(newMatches);
      setSelectedLeft(null);
      setSelectedRight(null);
      triggerHaptic(true);

      if (step.matchingPairs && newMatches.length === step.matchingPairs.length) {
        setIsCorrect(true);
        setIsAnswerChecked(true);
      }
    } else {
      triggerHaptic(false);
      onDeductHeart();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  const handleContinue = () => {
    sound.playTick();
    if (currentStepIndex + 1 < steps.length) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setSelectedBinary(null);
      setSelectedFlawOption(null);
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if next is celebration
      if (steps[nextIndex].type === 'celebration') {
        sound.playFanfare();
      }
    } else {
      sound.playFanfare();
      onLessonComplete(step.xpValue || 15);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FFFFFF', position: 'relative' }}>
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
            color: '#64748B'
          }}
          title="Exit lesson"
        >
          ✕
        </button>

        {/* Progress Bar */}
        <div style={{ flex: 1, height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#22C55E',
              borderRadius: '10px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Hearts indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, color: '#EF4444', fontSize: '15px' }}>
          <span>❤️</span>
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 18px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
          {step.title}
        </h2>

        {/* Visual Renderers */}
        <div style={{ marginBottom: '14px' }}>
          {step.visualType === 'doctor_test' && <DoctorTestVisual />}
          {step.visualType === 'prior_pie' && <PriorPieVisual />}
          {step.visualType === 'accuracy_sim' && <AccuracySimVisual accuracy={sliderValue} />}
          {step.visualType === 'balance_scale' && <BalanceScaleVisual />}
          {step.visualType === 'distribution_sim' && <DistributionSimVisual outlierBonus={sliderValue} />}
          {step.visualType === 'embedding_sim' && <EmbeddingSimVisual />}
          {step.visualType === 'neuron_bouncer' && <NeuronBouncerVisual weightsSum={sliderValue} />}
          {step.visualType === 'attention_sim' && <AttentionSimVisual />}
          {step.visualType === 'moe_sim' && <MoERoutingVisual />}
          {step.visualType === 'react_sim' && <ReActTraceVisual />}
        </div>

        {/* Concept Card Narrative */}
        {step.type === 'concept_card' && (
          <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-line', flex: 1 }}>
            {step.narrative}
          </div>
        )}

        {/* Binary Choice (True/False) */}
        {step.type === 'binary_choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #CBD5E1', fontSize: '15px', fontWeight: 600, color: '#1E293B', lineHeight: '1.4' }}>
              "{step.statement}"
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                disabled={isAnswerChecked}
                onClick={() => handleBinarySelect(true)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: selectedBinary === true ? '3px solid #3B82F6' : '2px solid #E2E8F0',
                  background: selectedBinary === true ? '#EFF6FF' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: isAnswerChecked ? 'default' : 'pointer',
                  color: '#1E293B'
                }}
              >
                TRUE
              </button>
              <button
                disabled={isAnswerChecked}
                onClick={() => handleBinarySelect(false)}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: selectedBinary === false ? '3px solid #3B82F6' : '2px solid #E2E8F0',
                  background: selectedBinary === false ? '#EFF6FF' : '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: isAnswerChecked ? 'default' : 'pointer',
                  color: '#1E293B'
                }}
              >
                FALSE
              </button>
            </div>
          </div>
        )}

        {/* Interactive Slider */}
        {step.type === 'slider' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#334155', fontWeight: 600, lineHeight: '1.4' }}>
              {step.question}
            </div>

            <div style={{ background: '#F1F5F9', padding: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                <span>{step.sliderConfig?.labelLow}</span>
                <span style={{ color: '#2563EB', fontWeight: 900 }}>
                  {step.visualType === 'spam_slider'
                    ? `${spamSliderValue}%`
                    : `${sliderValue}${step.sliderConfig?.unit || '%'}`}
                </span>
                <span>{step.sliderConfig?.labelHigh}</span>
              </div>

              <input
                type="range"
                min={step.sliderConfig?.min}
                max={step.sliderConfig?.max}
                step={step.sliderConfig?.step}
                value={step.visualType === 'spam_slider' ? spamSliderValue : sliderValue}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  sound.playTick();
                  if (step.visualType === 'spam_slider') setSpamSliderValue(val);
                  else setSliderValue(val);
                }}
                disabled={isAnswerChecked}
                style={{ width: '100%', accentColor: '#2563EB', height: '8px', cursor: 'pointer' }}
              />
            </div>

            {!isAnswerChecked && (
              <button
                onClick={handleSliderCheck}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Check Simulation
              </button>
            )}
          </div>
        )}

        {/* Concept Match (Duolingo Style Tap Pairs) */}
        {step.type === 'concept_match' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
              {step.question}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {step.matchingPairs?.map((pair) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isSelected = selectedLeft === pair.id;
                  return (
                    <button
                      key={`l-${pair.id}`}
                      disabled={isMatched}
                      onClick={() => handleLeftMatchClick(pair.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        border: isMatched ? '2px solid #86EFAC' : isSelected ? '2px solid #3B82F6' : '1px solid #CBD5E1',
                        background: isMatched ? '#DCFCE7' : isSelected ? '#EFF6FF' : '#FFFFFF',
                        color: isMatched ? '#15803D' : '#1E293B',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: isMatched ? 'default' : 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {pair.left} {isMatched && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Right Column (interspersed) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  step.matchingPairs?.[1],
                  step.matchingPairs?.[3],
                  step.matchingPairs?.[0],
                  step.matchingPairs?.[2]
                ]
                  .filter(Boolean)
                  .map((pair) => {
                    const isMatched = matchedPairs.includes(pair!.id);
                    const isSelected = selectedRight === pair!.id;
                    return (
                      <button
                        key={`r-${pair!.id}`}
                        disabled={isMatched}
                        onClick={() => handleRightMatchClick(pair!.id)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          border: isMatched ? '2px solid #86EFAC' : isSelected ? '2px solid #3B82F6' : '1px solid #CBD5E1',
                          background: isMatched ? '#DCFCE7' : isSelected ? '#EFF6FF' : '#FFFFFF',
                          color: isMatched ? '#15803D' : '#1E293B',
                          fontWeight: 500,
                          fontSize: '11px',
                          cursor: isMatched ? 'default' : 'pointer',
                          textAlign: 'left',
                          lineHeight: '1.2'
                        }}
                      >
                        {pair!.right} {isMatched && '✓'}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Spot the Flaw / Tradeoff Tribunal */}
        {(step.type === 'spot_the_flaw' || step.type === 'tradeoff_tribunal') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#334155', fontWeight: 600 }}>
              {step.question}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              {step.options?.map((opt) => {
                const isSelected = selectedFlawOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    disabled={isAnswerChecked}
                    onClick={() => handleOptionSelect(opt.id, !!opt.isCorrect)}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #3B82F6' : '1px solid #CBD5E1',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '13px',
                      color: '#1E293B',
                      cursor: isAnswerChecked ? 'default' : 'pointer'
                    }}
                  >
                    <div>{opt.text}</div>
                    {opt.subtext && (
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                        {opt.subtext}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Celebration Step */}
        {step.type === 'celebration' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '14px', flex: 1 }}>
            <ConfettiCanvas />
            <div style={{ fontSize: '50px', margin: '-30px 0 0' }}>🏆</div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#16A34A' }}>Commute Lesson Cleared!</div>
            <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
              {step.narrative}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
              <div style={{ background: '#FEF3C7', padding: '10px 18px', borderRadius: '14px', border: '1px solid #FCD34D' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#D97706' }}>+{step.xpValue || 20} XP</div>
                <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 700 }}>Earned</div>
              </div>
              <div style={{ background: '#FFEDD5', padding: '10px 18px', borderRadius: '14px', border: '1px solid #FDBA74' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#EA580C' }}>Day 1 🔥</div>
                <div style={{ fontSize: '10px', color: '#C2410C', fontWeight: 700 }}>Streak Active</div>
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
            borderTop: '1px solid #E2E8F0',
            background: isAnswerChecked ? (isCorrect ? '#F0FDF4' : '#FEF2F2') : '#FFFFFF'
          }}
        >
          {isAnswerChecked && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '15px', color: isCorrect ? '#16A34A' : '#DC2626' }}>
                <span>{isCorrect ? '✓ Spot on!' : '✕ Keep in mind:'}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#334155', marginTop: '3px', lineHeight: '1.4' }}>
                {step.explanation}
              </div>
            </div>
          )}

          {(step.type === 'concept_card' || isAnswerChecked) && (
            <button
              onClick={handleContinue}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                background: isAnswerChecked ? (isCorrect ? '#22C55E' : '#EF4444') : '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step.type === 'celebration' && (
        <div style={{ padding: '14px 18px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <button
            onClick={() => onLessonComplete(step.xpValue || 20)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '16px',
              background: '#22C55E',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #16A34A'
            }}
          >
            Claim Rewards & Return to Path
          </button>
        </div>
      )}
    </div>
  );
};
