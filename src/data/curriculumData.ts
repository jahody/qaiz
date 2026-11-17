import type { Track, ExerciseStep } from '../types';

// Step definitions for Unit 1.1: The Bayesian Mindset
const UNIT_1_1_STEPS: ExerciseStep[] = [
  {
    id: '1-1-1',
    type: 'concept_card',
    title: 'The Medical Test Paradox',
    visualType: 'doctor_test',
    narrative: `You just tested positive for a rare disease. The test is advertised as 99% accurate.\n\nHow scared should you be? Most people immediately panic and say "99% sure I have it."\n\nMost people are completely wrong. Let's find out why!`,
    explanation: 'Tap "Continue" to see how the math actually works.',
    xpValue: 0
  },
  {
    id: '1-1-2',
    type: 'binary_choice',
    title: 'Your Gut Reaction',
    statement: 'If a 99%-accurate medical test says you are sick, there is a 99% chance you actually have the disease.',
    correctAnswer: false,
    explanation: 'The test accuracy is only half the story! The missing piece is your PRIOR: how rare was this illness before you even took the test?',
    xpValue: 10
  },
  {
    id: '1-1-3',
    type: 'concept_card',
    title: 'Meet the "Prior"',
    visualType: 'prior_pie',
    narrative: `Suppose 10,000 people walk into a health clinic.\n\nThis disease is very rare: only 1 in 10,000 people actually has it. That means:\n• 1 Person is Sick 🔴\n• 9,999 People are Healthy 🟢\n\nYour Prior Probability is just 0.01%!`,
    explanation: 'Before taking the test, you were almost certainly healthy.',
    xpValue: 0
  },
  {
    id: '1-1-4',
    type: 'slider',
    title: 'Simulate the Test Machine',
    visualType: 'accuracy_sim',
    question: 'Drag the Test Accuracy slider to 99% and observe what happens to the 10,000 patients.',
    sliderConfig: {
      min: 90,
      max: 99.9,
      step: 0.1,
      defaultValue: 95,
      unit: '%',
      targetMin: 98.8,
      targetMax: 99.2,
      labelLow: '90% Accuracy',
      labelHigh: '99.9% Accuracy'
    },
    explanation: 'Notice that at 99%, the 1% error rate on 9,999 healthy people creates ~100 FALSE ALARMS! Out of ~101 total positive tests, only 1 is genuinely sick (~1%).',
    xpValue: 15
  },
  {
    id: '1-1-5',
    type: 'concept_card',
    title: "Bayes' Rule: The Balance Scale",
    visualType: 'balance_scale',
    narrative: `Bayes' Rule is a machine for updating beliefs under uncertainty:\n\n1. Prior: What you believed before (rare disease = very low odds)\n2. Evidence: The new clue (test returned positive)\n3. Posterior: Your updated belief (~1% chance)\n\nExtraordinary claims require extraordinary evidence!`,
    explanation: "Now let's test your intuition on another problem.",
    xpValue: 0
  },
  {
    id: '1-1-6',
    type: 'slider',
    title: 'Spam Filter: Guess the Posterior',
    visualType: 'spam_slider',
    question: 'An incoming email contains the word "LOTTERY". Spam emails contain it 80% of the time, but regular emails contain it 5% of the time. Overall, 20% of incoming emails are spam. Where does your updated belief land?',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 20,
      unit: '%',
      targetMin: 45,
      targetMax: 55,
      labelLow: '0% (Clean)',
      labelHigh: '100% (Spam)'
    },
    explanation: 'Nailed it! The word "lottery" is suspicious, but since 80% of all emails are clean, the posterior only rises to about 50/50—not an instant conviction.',
    xpValue: 15
  },
  {
    id: '1-1-7',
    type: 'concept_match',
    title: 'Match the Bayesian Terms',
    question: 'Tap matching pairs connecting AI terms with their intuitive meanings:',
    matchingPairs: [
      { id: '1', left: 'Prior', right: 'Belief before seeing new clues' },
      { id: '2', left: 'Likelihood', right: 'Strength of the new evidence' },
      { id: '3', left: 'Posterior', right: 'Updated belief after combining clues' },
      { id: '4', left: 'Base-Rate Fallacy', right: 'Ignoring how rare an event is' }
    ],
    explanation: 'Flawless! You have the fundamental vocabulary of Bayesian inference down.',
    xpValue: 20
  },
  {
    id: '1-1-8',
    type: 'spot_the_flaw',
    title: 'Spot the Flaw: Airport Scanner',
    visualType: 'airport_scanner',
    question: 'A security vendor pitches an AI scanner: "95% accuracy on 10 million passengers per year!" With only ~50 real threats annually, tap the hidden disaster:',
    options: [
      { id: 'a', text: '95% is high accuracy and completely safe', isCorrect: false },
      { id: 'b', text: 'It will generate ~500,000 false alarms every year!', isCorrect: true },
      { id: 'c', text: 'The scanner requires too much electricity', isCorrect: false }
    ],
    explanation: 'Spot on! 5% of 10,000,000 innocent passengers is half a million false alarms drowning out the 50 true threats.',
    xpValue: 15
  },
  {
    id: '1-1-9',
    type: 'binary_choice',
    title: 'The Power of Compounding Clues',
    statement: 'Taking a second, independent positive test should dramatically raise your suspicion compared to the first test.',
    correctAnswer: true,
    explanation: 'Exactly! The posterior of the first test (~1%) becomes the new prior for the second test. Now the odds jump from 1% to over 50%!',
    xpValue: 10
  },
  {
    id: '1-1-10',
    type: 'celebration',
    title: 'Lesson 1.1 Complete!',
    visualType: 'celebration_trophy',
    narrative: `You've mastered the Bayesian Mindset!\n\nKey Takeaway: Never judge an AI prediction or test without asking: "How rare was this before the test?"`,
    explanation: 'You earned +20 XP and initiated your Day 1 Streak 🔥',
    xpValue: 20
  }
];

// Step definitions for Unit 1.2: Distributions & Spread
const UNIT_1_2_STEPS: ExerciseStep[] = [
  {
    id: '1-2-1',
    type: 'concept_card',
    title: 'The Myth of the Average Human',
    visualType: 'distribution_sim',
    narrative: `In the 1950s, the US Air Force measured 4,000 pilots on 10 physical dimensions to design the "average cockpit."\n\nGuess how many of the 4,000 pilots were average on all 10 dimensions?\n\nExactly ZERO. The "average human" is a statistical illusion.`,
    explanation: 'AI systems that design only for the "mean" fail real individuals.',
    xpValue: 0
  },
  {
    id: '1-2-2',
    type: 'slider',
    title: 'Billionaire in a Bar',
    visualType: 'distribution_sim',
    question: 'Nine teachers making $50k/year sit at a coffee shop. Elon Musk walks in! Drag the billionaire slider to see what happens to the Average vs. the Median.',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 10,
      defaultValue: 0,
      unit: ' Billionaire impact',
      targetMin: 70,
      targetMax: 100,
      labelLow: 'Normal Crowd ($50k avg)',
      labelHigh: 'Billionaire enters (Avg explodes!)'
    },
    explanation: 'Look at that: the Mean shoots up to millions, but the Median (the middle person) stays at $50k. That is why AI models must be tested with median metrics when outliers exist!',
    xpValue: 15
  },
  {
    id: '1-2-3',
    type: 'binary_choice',
    title: 'Mean vs. Median',
    statement: 'If a machine learning loss function is sensitive to extreme outliers, it is likely using Mean Squared Error rather than Absolute Error.',
    correctAnswer: true,
    explanation: 'Correct! Squaring errors makes large mistakes exponentially more punishing, dragging the model towards extreme outliers.',
    xpValue: 10
  },
  {
    id: '1-2-4',
    type: 'concept_match',
    title: 'Match the Spread Concepts',
    question: 'Match the distribution terms with their real-world meaning:',
    matchingPairs: [
      { id: '1', left: 'Mean', right: 'Tugged easily by single giant outliers' },
      { id: '2', left: 'Median', right: 'Rock-solid middle value' },
      { id: '3', left: 'Variance', right: 'How spread out the data points are' },
      { id: '4', left: 'Bell Curve', right: 'Symmetric cluster around the center' }
    ],
    explanation: 'Great job! Understanding variance helps you understand why models overfit.',
    xpValue: 20
  },
  {
    id: '1-2-5',
    type: 'celebration',
    title: 'Lesson 1.2 Complete!',
    visualType: 'celebration_trophy',
    narrative: `You've conquered Distributions & Spread!\n\nAlways ask whether a model is being evaluated on averages that hide the true spread.`,
    explanation: 'You earned +15 XP! Ready for Risk & Confidence.',
    xpValue: 15
  }
];

// Step definitions for Unit 1.3: Risk & Confidence
const UNIT_1_3_STEPS: ExerciseStep[] = [
  {
    id: '1-3-1',
    type: 'concept_card',
    title: 'The Precision vs. Recall Seesaw',
    visualType: 'balance_scale',
    narrative: `Every AI model faces a dilemma:\n\n• Be paranoid: Flag everything suspicious so you never miss a threat (High Recall, many false alarms).\n• Be cautious: Only flag when 100% certain to avoid annoying users (High Precision, but misses real threats).`,
    explanation: 'You can rarely maximize both at the same time.',
    xpValue: 0
  },
  {
    id: '1-3-2',
    type: 'tradeoff_tribunal',
    title: 'Trade-off: Cancer Detection AI',
    question: 'You are setting the decision threshold for a lung cancer detection model. Which priority do you choose?',
    options: [
      { id: 'a', text: 'High Precision (Fewer false alarms, but some cancers slip through)', isCorrect: false, subtext: 'Dangerous: Missed cancer is fatal.' },
      { id: 'b', text: 'High Recall (Catch every single possible cancer, accept follow-up biopsies)', isCorrect: true, subtext: 'Safe: Better a false alarm biopsy than a missed tumor.' }
    ],
    explanation: 'Spot on! In life-or-death diagnostics, High Recall always takes precedence over High Precision.',
    xpValue: 15
  },
  {
    id: '1-3-3',
    type: 'tradeoff_tribunal',
    title: 'Trade-off: Spam Filter',
    question: 'Now you are setting the threshold for an email spam filter. Which priority do you choose?',
    options: [
      { id: 'a', text: 'High Precision (Only send to spam folder if 99.9% sure; let a few junk emails slip into inbox)', isCorrect: true, subtext: 'Safe: A missed junk mail is annoying; a missed job offer is catastrophic.' },
      { id: 'b', text: 'High Recall (Aggressively filter spam, but occasionally delete important job offers)', isCorrect: false, subtext: 'Dangerous: You would miss important real emails.' }
    ],
    explanation: 'Exactly the opposite! For spam, High Precision is critical so legitimate emails never get lost.',
    xpValue: 15
  },
  {
    id: '1-3-4',
    type: 'celebration',
    title: 'Track 1 Mastered!',
    visualType: 'celebration_trophy',
    narrative: `You've completed Track 1: Thinking in Odds!\n\nYou now possess the statistical intuition behind modern AI decision making.`,
    explanation: '+20 XP awarded! Track 2: Fueling the Machine is now unlocked.',
    xpValue: 20
  }
];

// Step definitions for Unit 2.2: Embeddings
const UNIT_2_2_STEPS: ExerciseStep[] = [
  {
    id: '2-2-1',
    type: 'concept_card',
    title: 'Turning Worlds to Numbers',
    visualType: 'embedding_sim',
    narrative: `Computers cannot read Shakespeare or look at paintings—they only understand numbers.\n\nAn **Embedding** turns concepts into coordinates on an infinite semantic map. Words with similar meanings cluster together!`,
    explanation: 'Notice how Cat and Dog are neighbors, while Laptop and Server live in another district.',
    xpValue: 0
  },
  {
    id: '2-2-2',
    type: 'binary_choice',
    title: 'Vector Arithmetic',
    statement: 'If you take the vector for "King", subtract "Man", and add "Woman", modern language models land closest to "Queen".',
    correctAnswer: true,
    explanation: 'Yes! This famous Word2Vec property proved that neural networks capture relational concepts geometrically in vector space.',
    xpValue: 10
  },
  {
    id: '2-2-3',
    type: 'celebration',
    title: 'Embedding Explorer Cleared!',
    visualType: 'celebration_trophy',
    narrative: `You understand how LLMs represent semantic meaning as high-dimensional coordinates.`,
    explanation: '+15 XP awarded!',
    xpValue: 15
  }
];

// Step definitions for Unit 3.1: The Bouncer (Single Neuron)
const UNIT_3_1_STEPS: ExerciseStep[] = [
  {
    id: '3-1-1',
    type: 'concept_card',
    title: 'The Club Bouncer',
    visualType: 'neuron_bouncer',
    narrative: `A single artificial neuron is like a discerning club bouncer:\n\n• Inputs: Observations (Dark clouds, cold wind)\n• Weights: Volume knobs that decide how much each clue matters\n• Bias: The baseline skepticism threshold`,
    explanation: 'The neuron only fires if the weighted sum crosses the bias barrier.',
    xpValue: 0
  },
  {
    id: '3-1-2',
    type: 'slider',
    title: 'Tune the Bouncer Dial',
    visualType: 'neuron_bouncer',
    question: 'Adjust the weight dial on "Clouds" until the weighted sum clears 10 and the neuron fires "Bring Umbrella"!',
    sliderConfig: {
      min: 0,
      max: 15,
      step: 1,
      defaultValue: 4,
      unit: ' Weight',
      targetMin: 10,
      targetMax: 15,
      labelLow: '0 (Ignore Clouds)',
      labelHigh: '15 (Heavy Importance)'
    },
    explanation: 'The neuron fired! You adjusted the weight dial just like a training algorithm adjusts parameters during backpropagation.',
    xpValue: 15
  },
  {
    id: '3-1-3',
    type: 'celebration',
    title: 'Neuron Bouncer Cleared!',
    visualType: 'celebration_trophy',
    narrative: `You understand the fundamental building block of all deep neural networks.`,
    explanation: '+15 XP awarded!',
    xpValue: 15
  }
];

// Step definitions for Unit 5.1: The Attention Revolution
const UNIT_5_1_STEPS: ExerciseStep[] = [
  {
    id: '5-1-1',
    type: 'concept_card',
    title: 'Why Transformers Won',
    visualType: 'attention_sim',
    narrative: `Old AI read books like a person reading with a magnifying glass: one word at a time from left to right. By page 50, it forgot page 1.\n\nThe **Transformer** reads the entire page at once! Every word uses "Self-Attention" to link with every other word simultaneously.`,
    explanation: 'Try the attention beam simulator below.',
    xpValue: 0
  },
  {
    id: '5-1-2',
    type: 'concept_card',
    title: 'Explore the Attention Matrix',
    visualType: 'attention_sim',
    narrative: `In the sentence: "The cat sat on the mat because it was tired", what does "it" refer to?\n\nSelf-attention beams direct 85% of "it's" attention to "cat" and almost none to "mat". That is how LLMs resolve pronouns!`,
    explanation: 'Tap continue to test your comprehension.',
    xpValue: 10
  },
  {
    id: '5-1-3',
    type: 'celebration',
    title: 'Attention Mastered!',
    visualType: 'celebration_trophy',
    narrative: `You now know the exact secret behind ChatGPT, Claude, and Gemini!`,
    explanation: '+20 XP awarded!',
    xpValue: 20
  }
];

// Step definitions for Unit 5.2: Mixture of Experts (MoE & Qwen)
const UNIT_5_2_STEPS: ExerciseStep[] = [
  {
    id: '5-2-1',
    type: 'concept_card',
    title: 'The Smart Office (MoE)',
    visualType: 'moe_sim',
    narrative: `Dense models fire every single neuron for every single word—even when answering "What is 2+2?". That burns massive electricity.\n\nModels like **Qwen 2.5-Max**, **Mixtral**, and **DeepSeek** use **Mixture of Experts (MoE)**. A fast router directs each word to only 2 specialized experts out of 8!`,
    explanation: 'You get the intellect of an 800-billion model with the speed and cost of a small model.',
    xpValue: 0
  },
  {
    id: '5-2-2',
    type: 'binary_choice',
    title: 'Sparse vs. Dense Compute',
    statement: 'A Mixture-of-Experts model activates every single parameter for every single token generated.',
    correctAnswer: false,
    explanation: 'False! MoE is "sparse": it only activates a fraction of its total parameters (typically ~25%) per token, dramatically speeding up inference.',
    xpValue: 10
  },
  {
    id: '5-2-3',
    type: 'celebration',
    title: 'MoE Architecture Cleared!',
    visualType: 'celebration_trophy',
    narrative: `You now understand the architecture powering modern open-weight giants like Qwen!`,
    explanation: '+20 XP awarded!',
    xpValue: 20
  }
];

// Step definitions for Unit 6.1: The ReAct Loop (Agents)
const UNIT_6_1_STEPS: ExerciseStep[] = [
  {
    id: '6-1-1',
    type: 'concept_card',
    title: 'From Chatbot to Autonomous Agent',
    visualType: 'react_sim',
    narrative: `A raw LLM is just a text autocomplete machine. It cannot browse the web, check your calendar, or edit code.\n\nAn **Agent** wraps the model in a **ReAct loop**:\n1. SENSE: Read user request\n2. PLAN: Think about steps\n3. ACT: Call an external tool (terminal, web, API)\n4. OBSERVE: Read the tool output and decide what to do next!`,
    explanation: 'Observe the trace in the card above.',
    xpValue: 0
  },
  {
    id: '6-1-2',
    type: 'spot_the_flaw',
    title: 'Spot the Agent Glitch',
    question: 'An agent receives an error: "404 Not Found" from an API. It immediately retries the exact same command 1,000 times in a row. What guardrail was missing?',
    options: [
      { id: 'a', text: 'The agent needed a faster GPU', isCorrect: false },
      { id: 'b', text: 'An Execution Watchdog / Loop-Breaker to halt infinite loops', isCorrect: true },
      { id: 'c', text: 'More training data on English grammar', isCorrect: false }
    ],
    explanation: 'Exactly! Agent harnesses need supervisors and timeout watchdogs to break repetitive loops and preserve tokens.',
    xpValue: 15
  },
  {
    id: '6-1-3',
    type: 'celebration',
    title: 'Agentic Thinking Cleared!',
    visualType: 'celebration_trophy',
    narrative: `You understand how autonomous agents use tools and harnesses to act in the digital world.`,
    explanation: '+20 XP awarded!',
    xpValue: 20
  }
];

// Master Track Curriculum
export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Track 1: Thinking in Odds',
    metaphor: 'Betting chips on weather forecasts',
    color: '#3B82F6',
    units: [
      {
        id: 'unit-1-1',
        order: 1,
        title: 'The Bayesian Mindset',
        subtitle: 'Updating beliefs with clues & priors',
        totalSteps: 10,
        status: 'active',
        icon: '⚖️',
        steps: UNIT_1_1_STEPS
      },
      {
        id: 'unit-1-2',
        order: 2,
        title: 'Distributions & Spread',
        subtitle: 'Bell curves & why averages lie',
        totalSteps: 5,
        status: 'active',
        icon: '📊',
        steps: UNIT_1_2_STEPS
      },
      {
        id: 'unit-1-3',
        order: 3,
        title: 'Risk & Confidence',
        subtitle: 'Precision vs recall trade-offs',
        totalSteps: 4,
        status: 'active',
        icon: '🎯',
        steps: UNIT_1_3_STEPS
      }
    ]
  },
  {
    id: 'track-2',
    title: 'Track 2: Fueling the Machine',
    metaphor: 'Refining crude oil into rocket fuel',
    color: '#10B981',
    units: [
      {
        id: 'unit-2-1',
        order: 4,
        title: 'Garbage In, Garbage Out',
        subtitle: 'Selection bias & dirty datasets',
        totalSteps: 4,
        status: 'active',
        icon: '🛢️',
        steps: UNIT_1_3_STEPS // re-use baseline or custom
      },
      {
        id: 'unit-2-2',
        order: 5,
        title: 'Turning Worlds to Numbers',
        subtitle: 'Embeddings & semantic coordinate maps',
        totalSteps: 3,
        status: 'active',
        icon: '🗺️',
        steps: UNIT_2_2_STEPS
      }
    ]
  },
  {
    id: 'track-3',
    title: 'Track 3: The Neural Engine',
    metaphor: 'The club bouncer and assembly line',
    color: '#8B5CF6',
    units: [
      {
        id: 'unit-3-1',
        order: 6,
        title: 'The Bouncer (Single Neuron)',
        subtitle: 'Weights as dials, bias as barrier',
        totalSteps: 3,
        status: 'active',
        icon: '🧠',
        steps: UNIT_3_1_STEPS
      }
    ]
  },
  {
    id: 'track-5',
    title: 'Track 5: Frontier Architectures',
    metaphor: 'From walkie-talkies to global town hall',
    color: '#EC4899',
    units: [
      {
        id: 'unit-5-1',
        order: 7,
        title: 'The Attention Revolution',
        subtitle: 'How Transformers read everything at once',
        totalSteps: 3,
        status: 'active',
        icon: '🔍',
        steps: UNIT_5_1_STEPS
      },
      {
        id: 'unit-5-2',
        order: 8,
        title: 'Mixture of Experts (Qwen/MoE)',
        subtitle: 'Activating 2 out of 8 specialized experts',
        totalSteps: 3,
        status: 'active',
        icon: '🧩',
        steps: UNIT_5_2_STEPS
      }
    ]
  },
  {
    id: 'track-6',
    title: 'Track 6: Autonomous Agents',
    metaphor: 'Autonomous task force with case board',
    color: '#6366F1',
    units: [
      {
        id: 'unit-6-1',
        order: 9,
        title: 'The ReAct Loop',
        subtitle: 'Sense -> Plan -> Act -> Observe',
        totalSteps: 3,
        status: 'active',
        icon: '🤖',
        steps: UNIT_6_1_STEPS
      }
    ]
  }
];

export const PILOT_LESSON_STEPS = UNIT_1_1_STEPS;
