import React, { useEffect, useRef, useState } from 'react';
import type { VisualType } from '../types';
import { formatDollars } from '../utils/format';

/**
 * Renders the illustration for a lesson step. `value` is the step's slider value on slider steps
 * and undefined elsewhere, so slider-driven visuals fall back to their own resting value.
 */
export const StepVisual: React.FC<{ type: VisualType; value?: number }> = ({ type, value }) => {
  switch (type) {
    case 'doctor_test':
      return <DoctorTestVisual />;
    case 'prior_pie':
      return <PriorPieVisual />;
    case 'accuracy_sim':
      return <AccuracySimVisual accuracy={value ?? 99} />;
    case 'balance_scale':
      return <BalanceScaleVisual />;
    case 'cockpit_average':
      return <CockpitAverageVisual />;
    case 'distribution_sim':
      return <DistributionSimVisual netWorthLog10={value ?? 4.7} />;
    case 'tradeoff_sim':
      return <TradeoffSimVisual />;
    case 'survivorship_plane':
      return <SurvivorshipPlaneVisual />;
    case 'embedding_sim':
      return <EmbeddingSimVisual />;
    case 'neuron_bouncer':
      return <NeuronBouncerVisual cloudWeight={value ?? 4} />;
    case 'layer_stack':
      return <LayerStackVisual />;
    case 'gradient_descent_sim':
      return <GradientDescentVisual learningRate={value ?? 0.1} />;
    case 'overfit_sim':
      return <OverfitVisual complexity={value ?? 2} />;
    case 'token_sim':
      return <TokenVisual />;
    case 'temperature_sim':
      return <TemperatureVisual />;
    case 'rag_sim':
      return <RagVisual />;
    case 'attention_sim':
      return <AttentionSimVisual />;
    case 'moe_sim':
      return <MoERoutingVisual />;
    case 'react_sim':
      return <ReActTraceVisual />;
  }
};

const DoctorTestVisual: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '16px', background: '#F0F9FF', borderRadius: '16px', border: '2px solid #BAE6FD' }}>
    <div style={{ fontSize: '42px', marginBottom: '8px' }}>🩺 📋</div>
    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0369A1' }}>Lab Result: POSITIVE</div>
    <div style={{ fontSize: '13px', color: '#0284C7', marginTop: '4px' }}>Test Certified: 99% Sensitivity & Specificity</div>
    <div style={{ display: 'inline-block', marginTop: '10px', background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '12px', fontWeight: 700, fontSize: '12px' }}>
      Advertised Accuracy: 99%
    </div>
  </div>
);

const PriorPieVisual: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '2px solid #E2E8F0' }}>
    <svg width="160" height="160" viewBox="0 0 100 100" style={{ margin: '0 auto', display: 'block' }}>
      <circle cx="50" cy="50" r="45" fill="#22C55E" />
      <circle cx="50" cy="8" r="3.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', fontWeight: 700 }}>
      <span style={{ color: '#16A34A' }}>🟢 9,999 Healthy (99.99%)</span>
      <span style={{ color: '#DC2626' }}>🔴 1 Sick (0.01%)</span>
    </div>
  </div>
);

const AccuracySimVisual: React.FC<{ accuracy: number }> = ({ accuracy }) => {
  const healthyCount = 9999;
  const errorRate = (100 - accuracy) / 100;
  const falseAlarms = Math.round(healthyCount * errorRate);
  const realSick = 1;
  const totalPositives = falseAlarms + realSick;
  const realOdds = ((realSick / totalPositives) * 100).toFixed(1);

  return (
    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '2px solid #E2E8F0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <div style={{ background: '#FEF2F2', padding: '10px', borderRadius: '12px', border: '1px solid #FECACA', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: 700 }}>False Alarms</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#DC2626' }}>~{falseAlarms}</div>
          <div style={{ fontSize: '11px', color: '#B91C1C' }}>Healthy flagged</div>
        </div>
        <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '12px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700 }}>Truly Sick</div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#16A34A' }}>1</div>
          <div style={{ fontSize: '11px', color: '#15803D' }}>Real positive</div>
        </div>
      </div>

      <div style={{ background: '#EFF6FF', padding: '12px', borderRadius: '12px', border: '1px solid #BFDBFE', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>Probability you are actually sick:</div>
        <div style={{ fontSize: '26px', fontWeight: 900, color: '#2563EB', margin: '2px 0' }}>{realOdds}%</div>
        <div style={{ fontSize: '11px', color: '#3B82F6' }}>1 real case out of {totalPositives} positive results</div>
      </div>
    </div>
  );
};

const BalanceScaleVisual: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '16px', background: '#FAF5FF', borderRadius: '16px', border: '2px solid #E9D5FF' }}>
    <div style={{ fontSize: '42px', marginBottom: '4px' }}>⚖️</div>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '8px', fontSize: '12px', fontWeight: 700 }}>
      <div style={{ color: '#7E22CE' }}>
        <div>Prior Belief</div>
        <div style={{ fontSize: '11px', color: '#A855F7', fontWeight: 500 }}>Base rate anchor</div>
      </div>
      <div style={{ color: '#0369A1' }}>
        <div>New Evidence</div>
        <div style={{ fontSize: '11px', color: '#0EA5E9', fontWeight: 500 }}>Test clue weight</div>
      </div>
    </div>
  </div>
);

// The 1950 US Air Force cockpit study (Gilbert Daniels)
const CockpitAverageVisual: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '16px', background: '#F0F9FF', borderRadius: '16px', border: '2px solid #BAE6FD' }}>
    <div style={{ fontSize: '36px', marginBottom: '4px' }}>✈️</div>
    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369A1' }}>4,063 pilots × 10 body measurements</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px', margin: '10px auto 0', maxWidth: '260px' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          style={{ height: '22px', borderRadius: '6px', background: '#E0F2FE', border: '1px solid #7DD3FC', fontSize: '10px', fontWeight: 700, color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {i + 1}
        </div>
      ))}
    </div>
    <div style={{ fontSize: '11px', color: '#0284C7', marginTop: '6px' }}>"Average" = inside the middle 30% on a measurement</div>
    <div style={{ display: 'inline-block', marginTop: '10px', background: '#FEF2F2', color: '#DC2626', padding: '4px 12px', borderRadius: '12px', fontWeight: 800, fontSize: '12px', border: '1px solid #FECACA' }}>
      Average on all 10: ? pilots
    </div>
  </div>
);

// Nine people worth $50k plus one newcomer, on a log scale
const DistributionSimVisual: React.FC<{ netWorthLog10: number }> = ({ netWorthLog10 }) => {
  const teacher = 50_000;
  const newcomer = Math.pow(10, netWorthLog10);
  const values = [...Array(9).fill(teacher), newcomer].sort((a, b) => a - b);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const median = (values[4] + values[5]) / 2;

  const LOG_MIN = 4;
  const LOG_SPAN = 5.3;
  const x = (v: number) => 15 + ((Math.log10(v) - LOG_MIN) / LOG_SPAN) * 200;
  const teacherX = x(teacher);
  const newcomerX = x(newcomer);
  const newcomerY = Math.abs(newcomerX - teacherX) < 7 ? 13 : 76;

  return (
    <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '16px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
      <svg width="230" height="108" viewBox="0 0 230 108" style={{ margin: '0 auto', display: 'block' }}>
        {/* Axis */}
        <line x1="15" y1="86" x2="218" y2="86" stroke="#CBD5E1" strokeWidth="1.5" />
        {[
          { v: 1e4, label: '$10k' },
          { v: 1e6, label: '$1M' },
          { v: 1e8, label: '$100M' }
        ].map((t) => (
          <g key={t.label}>
            <line x1={x(t.v)} y1="84" x2={x(t.v)} y2="89" stroke="#94A3B8" strokeWidth="1" />
            <text x={x(t.v)} y="100" fontSize="9" fill="#64748B" textAnchor="middle">{t.label}</text>
          </g>
        ))}

        {/* Median (stable) and mean (pulled by the newcomer) */}
        <line x1={x(median)} y1="6" x2={x(median)} y2="86" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" />
        <line x1={x(mean)} y1="6" x2={x(mean)} y2="86" stroke="#EF4444" strokeWidth="2.5" style={{ transition: 'all 0.2s ease' }} />

        {/* Nine teachers stacked at $50k */}
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={teacherX} cy={76 - i * 7} r="3.2" fill="#3B82F6" />
        ))}
        {/* The newcomer */}
        <circle cx={newcomerX} cy={newcomerY} r="4.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" style={{ transition: 'all 0.2s ease' }} />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '6px', fontSize: '12px', fontWeight: 700 }}>
        <div style={{ color: '#059669' }}>
          <span>Median: {formatDollars(median)}</span>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>The middle person</div>
        </div>
        <div style={{ color: '#DC2626' }}>
          <span>Mean: {formatDollars(mean)}</span>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Pulled by the newcomer</div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '6px' }}>
        🔵 9 teachers · 🟠 newcomer · log scale
      </div>
    </div>
  );
};

// Precision vs recall at an adjustable decision threshold
const SICK_SCORES = [0.92, 0.81, 0.66, 0.38];
const HEALTHY_SCORES = [0.74, 0.55, 0.42, 0.31, 0.24, 0.17, 0.11, 0.06];

const TradeoffSimVisual: React.FC = () => {
  const [threshold, setThreshold] = useState(0.5);
  const tp = SICK_SCORES.filter((s) => s >= threshold).length;
  const fn = SICK_SCORES.length - tp;
  const fp = HEALTHY_SCORES.filter((s) => s >= threshold).length;
  const precision = tp + fp > 0 ? `${Math.round((tp / (tp + fp)) * 100)}%` : '–';
  const recall = `${Math.round((tp / SICK_SCORES.length) * 100)}%`;
  const x = (s: number) => 52 + s * 168;

  return (
    <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: '16px', border: '2px solid #E2E8F0' }}>
      <svg width="230" height="84" viewBox="0 0 230 84" style={{ margin: '0 auto', display: 'block' }}>
        <rect x={x(threshold)} y="4" width={x(1) - x(threshold)} height="66" fill="rgba(245, 158, 11, 0.12)" />
        <line x1={x(0)} y1="70" x2={x(1)} y2="70" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x={x(0)} y="81" fontSize="9" fill="#64748B" textAnchor="middle">0</text>
        <text x={(x(0) + x(1)) / 2} y="81" fontSize="9" fill="#64748B" textAnchor="middle">model score</text>
        <text x={x(1)} y="81" fontSize="9" fill="#64748B" textAnchor="middle">1</text>
        <text x="2" y="23" fontSize="9" fill="#991B1B" fontWeight="bold">sick</text>
        <text x="2" y="53" fontSize="9" fill="#166534" fontWeight="bold">healthy</text>
        {SICK_SCORES.map((s) => (
          <circle key={`s${s}`} cx={x(s)} cy="20" r="5" fill="#EF4444" opacity={s >= threshold ? 1 : 0.35} />
        ))}
        {HEALTHY_SCORES.map((s) => (
          <circle key={`h${s}`} cx={x(s)} cy="50" r="5" fill="#22C55E" opacity={s >= threshold ? 1 : 0.35} />
        ))}
        <line x1={x(threshold)} y1="2" x2={x(threshold)} y2="72" stroke="#F59E0B" strokeWidth="3" />
        <text x={Math.min(x(threshold) + 4, 192)} y="10" fontSize="9" fill="#B45309" fontWeight="bold">flag ▸</text>
      </svg>

      <input
        type="range"
        min={0.05}
        max={0.95}
        step={0.05}
        value={threshold}
        onChange={(e) => setThreshold(parseFloat(e.target.value))}
        aria-label="Alarm threshold"
        style={{ width: '100%', accentColor: '#2563EB', cursor: 'pointer', marginTop: '4px' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '6px', textAlign: 'center' }}>
        {[
          { label: 'Precision', value: precision, color: '#2563EB' },
          { label: 'Recall', value: recall, color: '#7C3AED' },
          { label: 'False alarms', value: fp, color: '#DC2626' },
          { label: 'Missed', value: fn, color: '#B45309' }
        ].map((tile) => (
          <div key={tile.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '6px 2px' }}>
            <div style={{ fontSize: '15px', fontWeight: 900, color: tile.color }}>{tile.value}</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748B' }}>{tile.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Returning bombers: damage where planes could survive a hit
const SurvivorshipPlaneVisual: React.FC = () => {
  const holes = [
    [30, 54], [38, 58], [58, 52], [66, 59], [95, 55], [125, 52], [150, 58], [158, 53], [190, 56], [196, 52],
    [108, 22], [112, 34], [107, 70], [113, 82], [110, 92], [96, 100], [126, 101], [111, 46]
  ];
  return (
    <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
      <svg width="220" height="118" viewBox="0 0 220 118" style={{ margin: '0 auto', display: 'block' }}>
        {/* Wings, fuselage, tail */}
        <rect x="14" y="48" width="192" height="15" rx="7" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        <rect x="102" y="8" width="16" height="100" rx="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        <rect x="84" y="96" width="52" height="9" rx="4" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
        {/* Engines */}
        {[48, 80, 140, 172].map((cx) => (
          <ellipse key={cx} cx={cx} cy="55" rx="7" ry="10" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
        ))}
        {/* Bullet holes */}
        {holes.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.4" fill="#DC2626" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '8px', fontSize: '11px', fontWeight: 700 }}>
        <span style={{ color: '#DC2626' }}>● bullet holes</span>
        <span style={{ color: '#475569' }}>⬮ engines</span>
      </div>
      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Damage on bombers that made it back</div>
    </div>
  );
};

// Vector Embedding Coordinate Visual
const EmbeddingSimVisual: React.FC = () => (
  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
    <svg width="220" height="130" viewBox="0 0 220 130" style={{ margin: '0 auto', display: 'block' }}>
      {/* Grid lines */}
      <line x1="10" y1="65" x2="210" y2="65" stroke="#E2E8F0" strokeWidth="1" />
      <line x1="110" y1="10" x2="110" y2="120" stroke="#E2E8F0" strokeWidth="1" />

      {/* Cluster 1: Animals */}
      <circle cx="50" cy="35" r="5" fill="#3B82F6" />
      <text x="58" y="38" fontSize="11" fill="#1E40AF" fontWeight="bold">Cat [0.2, 0.8]</text>

      <circle cx="65" cy="45" r="5" fill="#3B82F6" />
      <text x="73" y="48" fontSize="11" fill="#1E40AF" fontWeight="bold">Dog [0.3, 0.7]</text>

      {/* Cluster 2: Tech */}
      <circle cx="160" cy="95" r="5" fill="#10B981" />
      <text x="110" y="105" fontSize="11" fill="#065F46" fontWeight="bold">Laptop [0.8, 0.2]</text>

      <circle cx="175" cy="105" r="5" fill="#10B981" />
      <text x="125" y="118" fontSize="11" fill="#065F46" fontWeight="bold">Server [0.9, 0.1]</text>
    </svg>
    <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px', fontWeight: 600 }}>
      Similar meanings sit close together.
    </div>
    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
      2-D sketch: real embeddings have hundreds to thousands of dimensions
    </div>
  </div>
);

// Single neuron: two weighted clues against a threshold
const WIND_WEIGHT = 3;
const NEURON_THRESHOLD = 10;

const NeuronBouncerVisual: React.FC<{ cloudWeight: number }> = ({ cloudWeight }) => {
  const total = cloudWeight + WIND_WEIGHT;
  const fires = total >= NEURON_THRESHOLD;
  return (
    <div style={{ background: '#FAF5FF', padding: '16px', borderRadius: '16px', border: '2px solid #E9D5FF', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
        <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#6B21A8' }}>
          <div>🌧️ Clouds × {cloudWeight}</div>
          <div style={{ marginTop: '8px' }}>💨 Wind × {WIND_WEIGHT}</div>
        </div>

        {/* Central Neuron Node */}
        <div
          style={{
            width: '74px',
            height: '74px',
            flexShrink: 0,
            borderRadius: '50%',
            background: fires ? '#22C55E' : '#E2E8F0',
            border: fires ? '4px solid #16A34A' : '4px solid #94A3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: fires ? '#FFFFFF' : '#475569',
            fontWeight: 800,
            fontSize: '12px',
            boxShadow: fires ? '0 0 16px rgba(34, 197, 94, 0.6)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <div>Σ = {total}</div>
          <div style={{ fontSize: '9px' }}>Bar: {NEURON_THRESHOLD}</div>
        </div>

        {/* Decision Output */}
        <div style={{ textAlign: 'left', fontWeight: 800, fontSize: '13px', color: fires ? '#15803D' : '#991B1B', whiteSpace: 'pre-line' }}>
          {fires ? '⚡ FIRES\n"Bring umbrella"' : '⛔ SILENT\n"No umbrella"'}
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#7E22CE', marginTop: '10px' }}>Both clues present (input = 1 each)</div>
    </div>
  );
};

// Deep network as an assembly line of layers (image-model example)
const LayerStackVisual: React.FC = () => (
  <div style={{ background: '#FAF5FF', padding: '14px', borderRadius: '16px', border: '2px solid #E9D5FF', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
      {[
        { icon: '🖼️', label: 'Pixels', sub: 'input' },
        { icon: '〰️', label: 'Edges', sub: 'early layer' },
        { icon: '🔷', label: 'Shapes', sub: 'middle layer' },
        { icon: '🐱', label: '"Cat!"', sub: 'output' }
      ].map((stage, i) => (
        <React.Fragment key={stage.label}>
          {i > 0 && <span style={{ color: '#A855F7', fontWeight: 900, fontSize: '14px' }}>›</span>}
          <div style={{ background: '#FFFFFF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '8px 4px', width: '64px' }}>
            <div style={{ fontSize: '22px' }}>{stage.icon}</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B21A8' }}>{stage.label}</div>
            <div style={{ fontSize: '9px', color: '#A855F7' }}>{stage.sub}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
    <div style={{ fontSize: '10px', color: '#7E22CE', marginTop: '8px' }}>Each layer builds on the one before it</div>
  </div>
);

// Gradient descent on loss = w², starting at w = 4: each step multiplies w by (1 − 2 × learning rate)
const GD_START = 4;
const GD_STEPS = 6;

const GradientDescentVisual: React.FC<{ learningRate: number }> = ({ learningRate }) => {
  const factor = 1 - 2 * learningRate;
  const path = Array.from({ length: GD_STEPS + 1 }, (_, k) => GD_START * Math.pow(factor, k));
  const finalLoss = path[GD_STEPS] ** 2;
  const diverges = Math.abs(factor) > 1;
  const overshoots = factor < 0;
  const reached = !overshoots && Math.abs(path[GD_STEPS]) < 0.1;
  const status = diverges
    ? { text: '💥 Diverging: every jump lands farther away', color: '#DC2626' }
    : overshoots
    ? { text: '↔️ Overshooting: bouncing past the bottom', color: '#B45309' }
    : reached
    ? { text: '✅ Reached the bottom', color: '#15803D' }
    : { text: '🐢 Still crawling downhill', color: '#475569' };

  const W = 5;
  const clamp = (w: number) => Math.max(-W, Math.min(W, w));
  const x = (w: number) => 15 + ((clamp(w) + W) / (2 * W)) * 200;
  const y = (w: number) => 100 - (Math.min(w * w, W * W) / (W * W)) * 88;
  const curve = Array.from({ length: 41 }, (_, i) => -W + i * 0.25)
    .map((w) => `${x(w)},${y(w)}`)
    .join(' ');

  return (
    <div style={{ background: '#FAF5FF', padding: '14px 16px', borderRadius: '16px', border: '2px solid #E9D5FF', textAlign: 'center' }}>
      <svg width="230" height="108" viewBox="0 0 230 108" style={{ margin: '0 auto', display: 'block' }}>
        <polyline points={curve} fill="none" stroke="#C4B5FD" strokeWidth="3" />
        <text x="115" y="106" fontSize="9" fill="#7E22CE" textAnchor="middle">weight →</text>
        <text x="8" y="10" fontSize="9" fill="#7E22CE">loss</text>
        {path.slice(1).map((w, k) => (
          <line key={`l${k}`} x1={x(path[k])} y1={y(path[k])} x2={x(w)} y2={y(w)} stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3,2" />
        ))}
        {path.map((w, k) => (
          <circle key={`b${k}`} cx={x(w)} cy={y(w)} r={k === 0 ? 5 : 4} fill={k === 0 ? '#7C3AED' : '#F59E0B'} opacity={0.35 + (0.65 * k) / GD_STEPS} />
        ))}
      </svg>
      <div style={{ fontSize: '12px', fontWeight: 800, color: status.color, marginTop: '4px' }}>{status.text}</div>
      <div style={{ fontSize: '11px', color: '#6B21A8', marginTop: '2px' }}>
        Loss after {GD_STEPS} steps: {finalLoss > 25 ? 'off the chart' : finalLoss < 0.001 ? '≈ 0' : finalLoss.toFixed(3)}
      </div>
    </div>
  );
};

// Training vs test error as model complexity grows (illustrative curves)
const trainError = (c: number) => 0.55 * Math.exp(-0.45 * (c - 1));
const testError = (c: number) => 0.6 * Math.exp(-0.5 * (c - 1)) + 0.03 * (c - 1);

const OverfitVisual: React.FC<{ complexity: number }> = ({ complexity }) => {
  const x = (c: number) => 30 + ((c - 1) / 9) * 185;
  const y = (e: number) => 92 - (e / 0.6) * 82;
  const points = (fn: (c: number) => number) =>
    Array.from({ length: 37 }, (_, i) => 1 + i * 0.25)
      .map((c) => `${x(c)},${y(fn(c))}`)
      .join(' ');
  const pct = (e: number) => `${(e * 100).toFixed(1)}%`;

  return (
    <div style={{ background: '#FAF5FF', padding: '14px 16px', borderRadius: '16px', border: '2px solid #E9D5FF', textAlign: 'center' }}>
      <svg width="230" height="104" viewBox="0 0 230 104" style={{ margin: '0 auto', display: 'block' }}>
        <line x1="30" y1="92" x2="215" y2="92" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="30" y1="8" x2="30" y2="92" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="24" y="14" fontSize="9" fill="#64748B" textAnchor="end">error</text>
        <text x="122" y="103" fontSize="9" fill="#64748B" textAnchor="middle">model complexity →</text>
        <polyline points={points(trainError)} fill="none" stroke="#3B82F6" strokeWidth="2.5" />
        <polyline points={points(testError)} fill="none" stroke="#EF4444" strokeWidth="2.5" />
        <line x1={x(complexity)} y1="6" x2={x(complexity)} y2="92" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx={x(complexity)} cy={y(trainError(complexity))} r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx={x(complexity)} cy={y(testError(complexity))} r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '6px', fontSize: '12px', fontWeight: 700 }}>
        <div style={{ color: '#2563EB' }}>
          Training error: {pct(trainError(complexity))}
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Examples it studied</div>
        </div>
        <div style={{ color: '#DC2626' }}>
          Test error: {pct(testError(complexity))}
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Data it never saw</div>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '6px' }}>Illustrative curves</div>
    </div>
  );
};

// Text split into tokens (illustrative; every model has its own tokenizer)
const TOKENS = ['Token', 'ization', ' isn', "'t", ' magic', '!'];
const TOKEN_COLORS = ['#DBEAFE', '#FCE7F3', '#DCFCE7', '#FEF3C7', '#EDE9FE', '#FFE4E6'];

const TokenVisual: React.FC = () => (
  <div style={{ background: '#FDF2F8', padding: '14px', borderRadius: '16px', border: '2px solid #FBCFE8', textAlign: 'center' }}>
    <div style={{ fontSize: '12px', fontWeight: 700, color: '#9D174D', marginBottom: '8px' }}>"Tokenization isn't magic!"</div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
      {TOKENS.map((t, i) => (
        <span
          key={i}
          style={{ background: TOKEN_COLORS[i % TOKEN_COLORS.length], border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 6px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#1E293B', whiteSpace: 'pre' }}
        >
          {t.replace(/^ /, '·')}
        </span>
      ))}
    </div>
    <div style={{ fontSize: '11px', color: '#BE185D', marginTop: '8px', fontWeight: 600 }}>6 tokens (· marks a space)</div>
    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Illustrative split: every model has its own tokenizer</div>
  </div>
);

// Next-token probabilities at an adjustable temperature
const NEXT_TOKENS = [
  { word: 'mat', logit: 3.0 },
  { word: 'floor', logit: 2.2 },
  { word: 'sofa', logit: 1.8 },
  { word: 'roof', logit: 1.0 },
  { word: 'moon', logit: -0.5 }
];

const TemperatureVisual: React.FC = () => {
  const [temperature, setTemperature] = useState(1);
  const probs =
    temperature < 0.05
      ? NEXT_TOKENS.map((_, i) => (i === 0 ? 1 : 0))
      : (() => {
          const exps = NEXT_TOKENS.map((t) => Math.exp(t.logit / temperature));
          const sum = exps.reduce((a, b) => a + b, 0);
          return exps.map((e) => e / sum);
        })();

  return (
    <div style={{ background: '#FDF2F8', padding: '14px 16px', borderRadius: '16px', border: '2px solid #FBCFE8' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#9D174D', marginBottom: '8px', textAlign: 'center' }}>
        "The cat sat on the ___"
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NEXT_TOKENS.map((t, i) => (
          <div key={t.word} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 40px', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 }}>
            <span style={{ color: '#831843', textAlign: 'right' }}>{t.word}</span>
            <div style={{ background: '#FFFFFF', borderRadius: '6px', height: '12px', overflow: 'hidden', border: '1px solid #FBCFE8' }}>
              <div style={{ width: `${probs[i] * 100}%`, height: '100%', background: '#EC4899', transition: 'width 0.2s ease' }} />
            </div>
            <span style={{ color: '#BE185D' }}>{Math.round(probs[i] * 100)}%</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#9D174D', marginTop: '10px' }}>
        <span>0 · predictable</span>
        <span>Temperature {temperature.toFixed(1)}</span>
        <span>2 · varied</span>
      </div>
      <input
        type="range"
        min={0}
        max={2}
        step={0.1}
        value={temperature}
        onChange={(e) => setTemperature(parseFloat(e.target.value))}
        aria-label="Temperature"
        style={{ width: '100%', accentColor: '#2563EB', cursor: 'pointer' }}
      />
    </div>
  );
};

// Retrieval-Augmented Generation pipeline
const RagVisual: React.FC = () => (
  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '14px', border: '2px solid #E2E8F0', fontSize: '12px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ color: '#0369A1', fontWeight: 700 }}>❓ QUESTION: "How long do I have to return a purchase?"</div>
      <div style={{ color: '#7C3AED', fontWeight: 700 }}>🔎 RETRIEVE: embedding search over the company's documents</div>
      <div style={{ color: '#B45309', fontWeight: 700 }}>
        📄 TOP PASSAGE: <code style={{ background: '#FEF3C7', padding: '1px 4px', borderRadius: '4px' }}>Returns policy v3: "Refunds within 30 days of delivery."</code>
      </div>
      <div style={{ color: '#15803D', fontWeight: 700 }}>🧠 GENERATE: the model answers from that passage</div>
      <div style={{ color: '#4338CA', fontWeight: 800 }}>💬 ANSWER: "You have 30 days from delivery [Returns policy v3]."</div>
    </div>
  </div>
);

// Self-attention from "it" in a left-to-right (causal) model; illustrative weights
const ATTENTION_WORDS = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
const IT_INDEX = 7;
const ATTENTION_FROM_IT: Record<number, string> = { 1: '80%', 5: '8%' };

const AttentionSimVisual: React.FC = () => {
  const [active, setActive] = useState(false);

  return (
    <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '2px solid #E2E8F0' }}>
      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>
        Tap "it" to see where it looks:
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {ATTENTION_WORDS.map((w, i) => {
          const isIt = i === IT_INDEX;
          const isFuture = active && i > IT_INDEX;
          const weight = active ? ATTENTION_FROM_IT[i] : undefined;
          const isHigh = weight === '80%';

          return (
            <button
              key={i}
              onClick={() => isIt && setActive(true)}
              style={{
                padding: '6px 9px',
                borderRadius: '8px',
                border: isIt
                  ? active
                    ? '2px solid #2563EB'
                    : '2px dashed #F59E0B'
                  : isHigh
                  ? '2px solid #10B981'
                  : '1px solid #CBD5E1',
                background: isIt && active ? '#EFF6FF' : isHigh ? '#DCFCE7' : weight ? '#FEF3C7' : '#FFFFFF',
                color: isIt ? '#1D4ED8' : isHigh ? '#15803D' : '#1E293B',
                opacity: isFuture ? 0.35 : 1,
                fontWeight: isIt || isHigh ? 800 : 500,
                fontSize: '13px',
                cursor: isIt ? 'pointer' : 'default'
              }}
            >
              {w}
              {weight && ` ${isHigh ? '🔥' : '⚡'} ${weight}`}
            </button>
          );
        })}
      </div>

      {active && (
        <div style={{ fontSize: '10px', color: '#64748B', marginTop: '8px', textAlign: 'center', lineHeight: '1.4' }}>
          Illustrative weights from one attention head. Faded words come later, and a chat model reading left to right can't see them yet.
        </div>
      )}
    </div>
  );
};

// Mixture of Experts: per-token routing in one layer (Mixtral-style top-2 of 8)
const MOE_ROUTES: Array<{ token: string; experts: [number, number] }> = [
  { token: 'The', experts: [0, 5] },
  { token: 'tax', experts: [2, 6] },
  { token: 'rate', experts: [2, 3] },
  { token: 'in', experts: [0, 7] },
  { token: 'France', experts: [1, 4] }
];

const MoERoutingVisual: React.FC = () => (
  <div style={{ background: '#FDF2F8', padding: '14px', borderRadius: '16px', border: '2px solid #FBCFE8', textAlign: 'center' }}>
    <div style={{ fontSize: '12px', fontWeight: 700, color: '#9D174D', marginBottom: '8px' }}>
      The router picks 2 of 8 experts for each token
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxWidth: '270px', margin: '0 auto' }}>
      {MOE_ROUTES.map((route) => (
        <div key={route.token} style={{ display: 'grid', gridTemplateColumns: '52px repeat(8, 1fr)', gap: '4px', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#831843', textAlign: 'right', paddingRight: '4px' }}>"{route.token}"</div>
          {Array.from({ length: 8 }, (_, e) => {
            const on = route.experts.includes(e);
            return (
              <div
                key={e}
                style={{
                  height: '18px',
                  borderRadius: '5px',
                  border: on ? '2px solid #DB2777' : '1px solid #E2E8F0',
                  background: on ? '#FCE7F3' : '#FFFFFF',
                  fontSize: '8px',
                  fontWeight: on ? 800 : 500,
                  color: on ? '#9D174D' : '#CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {on ? '⚡' : `E${e + 1}`}
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div style={{ fontSize: '11px', color: '#BE185D', marginTop: '8px', fontWeight: 600 }}>
      Mixtral 8x7B: ~13B of ~47B parameters work on each token
    </div>
  </div>
);

// ReAct Agent Execution Loop Visual
const ReActTraceVisual: React.FC = () => (
  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '14px', border: '2px solid #E2E8F0', fontSize: '12px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ color: '#0369A1', fontWeight: 700 }}>💭 THOUGHT: "The user wants today's departure. That's live data I can't know from training, so I'll use a tool."</div>
      <div style={{ color: '#B45309', fontWeight: 700 }}>🛠️ ACTION: Call tool <code style={{ background: '#FEF3C7', padding: '1px 4px', borderRadius: '4px' }}>get_departures(line='CommuterA')</code></div>
      <div style={{ color: '#15803D', fontWeight: 700 }}>👀 OBSERVATION: <code style={{ background: '#DCFCE7', padding: '1px 4px', borderRadius: '4px' }}>{'{departs: "17:42", platform: 3, status: "on time"}'}</code></div>
      <div style={{ color: '#4338CA', fontWeight: 800 }}>💬 FINAL ANSWER: "Your train leaves at 17:42 from platform 3 and is on time."</div>
    </div>
  </div>
);

// Confetti Particle Canvas
export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 360;
    canvas.height = 250;

    const pieces: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    for (let i = 0; i < 70; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 3,
        speedY: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
      });
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '200px', display: 'block' }} />;
};
