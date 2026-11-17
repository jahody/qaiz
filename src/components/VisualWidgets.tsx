import React, { useEffect, useRef } from 'react';

export const DoctorTestVisual: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '16px', background: '#F0F9FF', borderRadius: '16px', border: '2px solid #BAE6FD' }}>
    <div style={{ fontSize: '42px', marginBottom: '8px' }}>🩺 📋</div>
    <div style={{ fontSize: '17px', fontWeight: 800, color: '#0369A1' }}>Lab Result: POSITIVE</div>
    <div style={{ fontSize: '13px', color: '#0284C7', marginTop: '4px' }}>Test Certified: 99% Sensitivity & Specificity</div>
    <div style={{ display: 'inline-block', marginTop: '10px', background: '#DCFCE7', color: '#15803D', padding: '4px 12px', borderRadius: '12px', fontWeight: 700, fontSize: '12px' }}>
      Advertised Accuracy: 99%
    </div>
  </div>
);

export const PriorPieVisual: React.FC = () => (
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

export const AccuracySimVisual: React.FC<{ accuracy: number }> = ({ accuracy }) => {
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

export const BalanceScaleVisual: React.FC = () => (
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

// Interactive Bell Curve & Outlier Visual
export const DistributionSimVisual: React.FC<{ outlierBonus?: number }> = ({ outlierBonus = 0 }) => {
  const baseAvg = 50;
  const skewedAvg = (baseAvg + outlierBonus * 0.4).toFixed(0);

  return (
    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '2px solid #E2E8F0', textAlign: 'center' }}>
      <svg width="220" height="100" viewBox="0 0 220 100" style={{ margin: '0 auto', display: 'block' }}>
        {/* Bell Curve Fill */}
        <path
          d="M 10 90 Q 60 90 90 60 Q 110 15 110 15 Q 110 15 130 60 Q 160 90 210 90 Z"
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="3"
        />
        {/* Median Line (Stable) */}
        <line x1="110" y1="15" x2="110" y2="90" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" />
        {/* Skewed Mean Marker (Moves right if outlier is present) */}
        <line
          x1={110 + outlierBonus * 0.8}
          y1="25"
          x2={110 + outlierBonus * 0.8}
          y2="90"
          stroke="#EF4444"
          strokeWidth="3"
        />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: '12px', fontWeight: 700 }}>
        <div style={{ color: '#059669' }}>
          <span>Median (Middle): $50k</span>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Stays rock solid</div>
        </div>
        <div style={{ color: '#DC2626' }}>
          <span>Mean (Average): ${skewedAvg}k</span>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>Pulled by 1 billionaire</div>
        </div>
      </div>
    </div>
  );
};

// Vector Embedding Coordinate Visual
export const EmbeddingSimVisual: React.FC = () => (
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
      Semantic Distance: Similar meanings live close together in coordinate space!
    </div>
  </div>
);

// Single Neuron Bouncer Visual
export const NeuronBouncerVisual: React.FC<{ weightsSum: number }> = ({ weightsSum }) => {
  const fires = weightsSum >= 10;
  return (
    <div style={{ background: '#FAF5FF', padding: '16px', borderRadius: '16px', border: '2px solid #E9D5FF', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#6B21A8' }}>
          <div>🌧️ Storm Clouds (+8)</div>
          <div style={{ marginTop: '8px' }}>💨 Cold Wind (+4)</div>
        </div>

        {/* Central Neuron Node */}
        <div
          style={{
            width: '74px',
            height: '74px',
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
          <div>Σ = {weightsSum}</div>
          <div style={{ fontSize: '9px' }}>Goal: 10</div>
        </div>

        {/* Decision Output */}
        <div style={{ textAlign: 'left', fontWeight: 800, fontSize: '13px', color: fires ? '#15803D' : '#991B1B' }}>
          {fires ? '⚡ FIRED!\n"Bring Umbrella"' : '⛔ BLOCKED\n"Stay in bag"'}
        </div>
      </div>
    </div>
  );
};

// Attention Heatmap Interactive Simulation
export const AttentionSimVisual: React.FC = () => {
  const [selectedWord, setSelectedWord] = React.useState<'it' | 'cat' | 'mat'>('it');

  return (
    <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '16px', border: '2px solid #E2E8F0' }}>
      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '8px' }}>
        Tap "it" to see which word the Transformer links it to:
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'].map((w) => {
          const isTarget = w.toLowerCase() === selectedWord;
          const isHighAttention = selectedWord === 'it' && w.toLowerCase() === 'cat';
          const isMediumAttention = selectedWord === 'it' && w.toLowerCase() === 'tired';

          return (
            <button
              key={w + Math.random()}
              onClick={() => {
                if (w.toLowerCase() === 'it' || w.toLowerCase() === 'cat' || w.toLowerCase() === 'mat') {
                  setSelectedWord(w.toLowerCase() as 'it' | 'cat' | 'mat');
                }
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: isTarget ? '2px solid #2563EB' : isHighAttention ? '2px solid #10B981' : '1px solid #CBD5E1',
                background: isTarget ? '#EFF6FF' : isHighAttention ? '#DCFCE7' : isMediumAttention ? '#FEF3C7' : '#FFFFFF',
                color: isTarget ? '#1D4ED8' : isHighAttention ? '#15803D' : '#1E293B',
                fontWeight: isTarget || isHighAttention ? 800 : 500,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {w} {isHighAttention && '🔥 85%'} {isMediumAttention && '⚡ 12%'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Mixture of Experts (MoE / Qwen) Routing Simulation
export const MoERoutingVisual: React.FC = () => (
  <div style={{ background: '#FDF2F8', padding: '14px', borderRadius: '16px', border: '2px solid #FBCFE8', textAlign: 'center' }}>
    <div style={{ fontSize: '12px', fontWeight: 700, color: '#9D174D', marginBottom: '8px' }}>
      Prompt: "Calculate French tax code" ➔ Router Router picks 2 of 8:
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
      {[
        { name: 'French Expert', active: true },
        { name: 'Math / Tax', active: true },
        { name: 'Python Code', active: false },
        { name: 'Creative Writing', active: false },
        { name: 'Physics', active: false },
        { name: 'Legal Rules', active: false },
        { name: 'Medical', active: false },
        { name: 'History', active: false }
      ].map((exp) => (
        <div
          key={exp.name}
          style={{
            padding: '8px 4px',
            borderRadius: '8px',
            border: exp.active ? '2px solid #DB2777' : '1px solid #E2E8F0',
            background: exp.active ? '#FCE7F3' : '#FFFFFF',
            color: exp.active ? '#9D174D' : '#94A3B8',
            fontSize: '10px',
            fontWeight: exp.active ? 800 : 500
          }}
        >
          {exp.active ? '⚡ ' : '💤 '}
          {exp.name}
        </div>
      ))}
    </div>
    <div style={{ fontSize: '11px', color: '#BE185D', marginTop: '8px', fontWeight: 600 }}>
      Result: 75% less energy consumed per word!
    </div>
  </div>
);

// ReAct Agent Execution Loop Visual
export const ReActTraceVisual: React.FC = () => (
  <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '14px', border: '2px solid #E2E8F0', fontSize: '12px' }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ color: '#0369A1', fontWeight: 700 }}>💭 THOUGHT: "User wants today's train schedule. My training cutoff has passed."</div>
      <div style={{ color: '#B45309', fontWeight: 700 }}>🛠️ ACTION: Call tool <code style={{ background: '#FEF3C7', padding: '1px 4px', borderRadius: '4px' }}>get_train_api(line='CommuterA')</code></div>
      <div style={{ color: '#15803D', fontWeight: 700 }}>👀 OBSERVATION: "Train departs at 17:42, on time."</div>
      <div style={{ color: '#4338CA', fontWeight: 800 }}>💬 FINAL ANSWER: "Your train departs in 8 minutes from Platform 3!"</div>
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
