import type { Track, ExerciseStep } from '../types';

// XP convention: concept cards 0, binary choice 10, slider / spot-the-flaw / trade-off 15,
// concept match 20, celebration 10 (lesson-completion bonus). Lesson XP = correct answers + bonus.
// Explanations show after right AND wrong answers, so state the answer neutrally (no "Nailed it!").

// Unit 1.1: The Bayesian Mindset
const UNIT_1_1_STEPS: ExerciseStep[] = [
  {
    id: '1-1-1',
    type: 'concept_card',
    title: 'The Medical Test Paradox',
    visualType: 'doctor_test',
    narrative: `You just tested positive for a rare disease. The test is advertised as 99% accurate.\n\nHow scared should you be? Most people immediately panic and say "99% sure I have it."\n\nMost people are completely wrong. Let's find out why!`,
    explanation: 'Keep your gut answer in mind: the next card puts it to the test.',
    xpValue: 0
  },
  {
    id: '1-1-2',
    type: 'binary_choice',
    title: 'Your Gut Reaction',
    statement: 'If a 99%-accurate medical test says you are sick, there is a 99% chance you actually have the disease.',
    correctAnswer: false,
    explanation: 'False. Test accuracy is only half the story. The missing piece is the prior: how rare the disease was before you took the test.',
    xpValue: 10
  },
  {
    id: '1-1-3',
    type: 'concept_card',
    title: 'Meet the "Prior"',
    visualType: 'prior_pie',
    narrative: `Suppose 10,000 people walk into a health clinic.\n\nThis disease is very rare: only 1 in 10,000 people actually has it. That means:\n• 1 person is sick 🔴\n• 9,999 people are healthy 🟢\n\nYour **prior probability** of being sick is just 0.01%.`,
    explanation: 'Before the test, you were almost certainly healthy.',
    xpValue: 0
  },
  {
    id: '1-1-4',
    type: 'slider',
    title: 'Simulate the Test Machine',
    visualType: 'accuracy_sim',
    question: 'Drag the Test Accuracy slider to 99% and watch what happens to the 10,000 patients.',
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
    explanation: 'At 99%, the 1% error rate hits 9,999 healthy people and produces about 100 false alarms. With ~101 positive results and only 1 truly sick person, a positive result means roughly a 1% chance of being sick.',
    xpValue: 15
  },
  {
    id: '1-1-5',
    type: 'concept_card',
    title: "Bayes' Rule: The Balance Scale",
    visualType: 'balance_scale',
    narrative: `**Bayes' Rule** is a recipe for updating beliefs under uncertainty:\n\n1. Prior: what you believed before (rare disease, very low odds)\n2. Evidence: how much more likely the clue is if the belief is true than if it is false (a positive test)\n3. Posterior: your updated belief (~1% chance)\n\nExtraordinary claims require extraordinary evidence!`,
    explanation: 'A strong clue can only lift a tiny prior so far. Now try it on email.',
    xpValue: 0
  },
  {
    id: '1-1-6',
    type: 'slider',
    title: 'Spam Filter: Guess the Posterior',
    question: 'An email contains the word "LOTTERY". 80% of spam emails contain it, but so do 5% of normal emails. Only 1 in 20 emails in this inbox is spam. How likely is this email to be spam?',
    sliderConfig: {
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 5,
      unit: '%',
      targetMin: 40,
      targetMax: 52,
      labelLow: '0% (Clean)',
      labelHigh: '100% (Spam)'
    },
    explanation: 'About 46%. Picture 1,000 emails: 50 are spam, and 40 of those say LOTTERY. Of the 950 normal emails, about 48 say it too. So 40 of the ~88 LOTTERY emails are spam: close to a coin flip, not a sure thing.',
    xpValue: 15
  },
  {
    id: '1-1-7',
    type: 'concept_match',
    title: 'Match the Bayesian Terms',
    question: 'Tap matching pairs to connect each term with its meaning:',
    matchingPairs: [
      { id: '1', left: 'Prior', right: 'Belief before seeing new clues' },
      { id: '2', left: 'Likelihood', right: 'How expected the clue is if the belief is true' },
      { id: '3', left: 'Posterior', right: 'Updated belief after combining clues' },
      { id: '4', left: 'Base-Rate Fallacy', right: 'Ignoring how rare an event is' }
    ],
    explanation: 'These four terms are the core vocabulary of Bayesian reasoning.',
    xpValue: 20
  },
  {
    id: '1-1-8',
    type: 'spot_the_flaw',
    title: 'Spot the Flaw: Airport Scanner',
    question: 'A security vendor pitches an AI scanner: "95% accuracy on 10 million passengers per year!" With only ~50 real threats a year, what is the hidden disaster?',
    options: [
      { id: 'a', text: '95% is high accuracy and completely safe', isCorrect: false },
      { id: 'b', text: 'It will raise about 500,000 false alarms every year', isCorrect: true },
      { id: 'c', text: 'The scanner needs too much electricity', isCorrect: false }
    ],
    explanation: '5% of ~10,000,000 innocent passengers is about 500,000 false alarms a year. Even if the scanner caught all ~50 real threats, only about 1 alarm in 10,000 would be real.',
    xpValue: 15
  },
  {
    id: '1-1-9',
    type: 'binary_choice',
    title: 'The Power of Compounding Clues',
    statement: 'A second, independent positive result from the same 99% test should sharply raise your suspicion compared with the first result alone.',
    correctAnswer: true,
    explanation: 'True. The ~1% posterior from the first test becomes the prior for the second. A second independent positive lifts the chance from about 1% to about 50%.',
    xpValue: 10
  },
  {
    id: '1-1-10',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `Key takeaway: never judge a test or an AI prediction without asking "How rare was this before the evidence?"`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 1.2: Distributions & Spread
const UNIT_1_2_STEPS: ExerciseStep[] = [
  {
    id: '1-2-1',
    type: 'concept_card',
    title: 'The Myth of the Average Pilot',
    visualType: 'cockpit_average',
    narrative: `In 1950, US Air Force researcher Gilbert Daniels measured 4,063 pilots to check whether cockpits built for the "average pilot" fit real pilots.\n\nHe picked 10 body measurements and counted a pilot as average on one if they fell in the middle 30% of the range.`,
    explanation: 'Make a guess before the next card: how many pilots were average on all 10?',
    xpValue: 0
  },
  {
    id: '1-2-2',
    type: 'spot_the_flaw',
    title: 'How Many Average Pilots?',
    visualType: 'cockpit_average',
    question: 'Out of 4,063 pilots, how many were average on all 10 measurements?',
    options: [
      { id: 'a', text: 'About 1,000: roughly a quarter of them', isCorrect: false },
      { id: 'b', text: 'About 100: a small but solid group', isCorrect: false },
      { id: 'c', text: 'Zero', isCorrect: true }
    ],
    explanation: 'Zero. Each person is average on some traits and far from it on others, so a design (or a model) tuned to the "average person" can fit almost nobody.',
    xpValue: 15
  },
  {
    id: '1-2-3',
    type: 'slider',
    title: 'Billionaire in a Bar',
    visualType: 'distribution_sim',
    question: "Nine teachers in a bar each have a net worth of about $50k. Then a newcomer walks in. Drag the newcomer's net worth up until the bar's mean passes $10 million, and watch the median.",
    sliderConfig: {
      min: 4.7,
      max: 9,
      step: 0.1,
      defaultValue: 4.7,
      unit: '',
      targetMin: 7.95,
      targetMax: 9,
      labelLow: '$50k',
      labelHigh: '$1 billion',
      format: 'log_dollars'
    },
    explanation: 'A newcomer worth $100 million lifts the mean past $10 million, yet the median stays at $50k: the two middle people out of ten are still teachers. With extreme outliers, the median describes the typical person far better than the mean.',
    xpValue: 15
  },
  {
    id: '1-2-4',
    type: 'binary_choice',
    title: 'Mean vs. Median in Training',
    statement: 'If a model\'s training is thrown off by a few extreme outliers, it is more likely using Mean Squared Error than Mean Absolute Error.',
    correctAnswer: true,
    explanation: 'True. Squaring makes big errors count much more (an error 10× larger costs 100× more), so outliers pull the model hard. Fittingly, squared error is minimized by the mean and absolute error by the median.',
    xpValue: 10
  },
  {
    id: '1-2-5',
    type: 'concept_match',
    title: 'Match the Spread Concepts',
    question: 'Match each term with its meaning:',
    matchingPairs: [
      { id: '1', left: 'Mean', right: 'Pulled easily by one giant outlier' },
      { id: '2', left: 'Median', right: 'The middle value; outliers barely move it' },
      { id: '3', left: 'Variance', right: 'Average squared distance from the mean' },
      { id: '4', left: 'Bell Curve', right: 'Symmetric hump around the center' }
    ],
    explanation: 'Mean and variance summarize data well only when there are no wild outliers.',
    xpValue: 20
  },
  {
    id: '1-2-6',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `When someone quotes an average, ask what the spread looks like and whether outliers are hiding in it.`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 1.3: Risk & Confidence
const UNIT_1_3_STEPS: ExerciseStep[] = [
  {
    id: '1-3-1',
    type: 'concept_card',
    title: 'The Precision vs. Recall Seesaw',
    visualType: 'tradeoff_sim',
    narrative: `Most classifiers give each case a score, and you choose the threshold for raising an alarm.\n\n• **Precision**: of the cases you flagged, how many were real?\n• **Recall**: of the real cases, how many did you catch?\n\nLower the threshold and recall rises, but so do false alarms. Raise it and precision rises, but more real cases slip through.`,
    explanation: 'Drag the threshold in the simulator: you can rarely max out both at once.',
    xpValue: 0
  },
  {
    id: '1-3-2',
    type: 'tradeoff_tribunal',
    title: 'Trade-off: Cancer Screening AI',
    question: 'You are setting the alarm threshold for a lung-cancer screening model. Every flagged scan gets a follow-up exam. What do you prioritize?',
    options: [
      { id: 'a', text: 'High precision: flag only near-certain cases', isCorrect: false, subtext: 'Fewer follow-up exams, but some cancers are missed.' },
      { id: 'b', text: 'High recall: flag anything suspicious', isCorrect: true, subtext: 'More follow-up exams, but fewer cancers slip through.' }
    ],
    explanation: 'High recall. In screening, a missed cancer costs far more than a false alarm, and the follow-up exams weed out the false positives.',
    xpValue: 15
  },
  {
    id: '1-3-3',
    type: 'tradeoff_tribunal',
    title: 'Trade-off: Spam Filter',
    question: 'Now you are setting the threshold for an email spam filter. What do you prioritize?',
    options: [
      { id: 'a', text: 'High precision: move mail to spam only when very sure', isCorrect: true, subtext: 'Some junk reaches your inbox.' },
      { id: 'b', text: 'High recall: catch nearly every spam email', isCorrect: false, subtext: 'Some real mail lands in the spam folder.' }
    ],
    explanation: 'High precision. Here the costs flip: junk in your inbox is a nuisance, but a job offer buried in the spam folder can be costly.',
    xpValue: 15
  },
  {
    id: '1-3-4',
    type: 'binary_choice',
    title: 'The Accuracy Trap',
    statement: 'A fraud detector that is 99% accurate must be catching most of the fraud.',
    correctAnswer: false,
    explanation: 'False. If only 1% of transactions are fraud, a model that never flags anything is already 99% accurate, with zero recall. On rare events, check precision and recall, not accuracy.',
    xpValue: 10
  },
  {
    id: '1-3-5',
    type: 'celebration',
    title: 'Track 1 Complete!',
    narrative: `You've completed Track 1: Probability & Statistics!\n\nYou now have the statistical intuition behind how AI systems make decisions under uncertainty.`,
    explanation: 'Track complete.',
    xpValue: 10
  }
];

// Unit 2.1: Garbage In, Garbage Out
const UNIT_2_1_STEPS: ExerciseStep[] = [
  {
    id: '2-1-1',
    type: 'concept_card',
    title: 'The Missing Bombers',
    visualType: 'survivorship_plane',
    narrative: `A model can only learn from the data it is shown. Skewed data in, skewed model out: **garbage in, garbage out**.\n\nDuring World War II, statistician Abraham Wald worked on a classic version of this trap: where should bombers get extra armor? Picture the damage on planes that made it back: holes all over the wings and fuselage, very few on the engines.`,
    explanation: 'Before the next card: where would you add the armor?',
    xpValue: 0
  },
  {
    id: '2-1-2',
    type: 'spot_the_flaw',
    title: 'Where Does the Armor Go?',
    visualType: 'survivorship_plane',
    question: 'You can armor only part of the plane. Based on the returning bombers, where should the armor go?',
    options: [
      { id: 'a', text: 'On the wings and fuselage, where the holes are', isCorrect: false },
      { id: 'b', text: 'On the engines, where returning planes had almost no holes', isCorrect: true },
      { id: 'c', text: 'Spread thinly over the whole plane', isCorrect: false }
    ],
    explanation: 'The engines. These planes survived their hits. Planes hit in the engines mostly never came back, so they never showed up in the data. That is survivorship bias: the missing data matters most.',
    xpValue: 15
  },
  {
    id: '2-1-3',
    type: 'binary_choice',
    title: 'Delete the Column, Delete the Bias?',
    statement: "A hiring model trained on a company's past hiring decisions becomes fair once you delete the 'gender' column.",
    correctAnswer: false,
    explanation: 'False. Other features can stand in for the deleted one. In 2018, Reuters reported that Amazon had abandoned an experimental recruiting model that learned to penalize résumés containing the word "women\'s", because it was trained on a decade of mostly male applicants.',
    xpValue: 10
  },
  {
    id: '2-1-4',
    type: 'concept_match',
    title: 'Match the Data Traps',
    question: 'Match each data problem with what it means:',
    matchingPairs: [
      { id: '1', left: 'Selection bias', right: "The sample doesn't represent the real population" },
      { id: '2', left: 'Survivorship bias', right: "Only the 'survivors' make it into the data" },
      { id: '3', left: 'Label noise', right: 'Some training examples carry the wrong answer' },
      { id: '4', left: 'Proxy variable', right: 'A feature that quietly stands in for another' }
    ],
    explanation: 'Each of these poisons a dataset long before training starts.',
    xpValue: 20
  },
  {
    id: '2-1-5',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `You can now spot skewed data before it turns into a skewed model.\n\nAlways ask: who or what is missing from this dataset?`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 2.2: Embeddings
const UNIT_2_2_STEPS: ExerciseStep[] = [
  {
    id: '2-2-1',
    type: 'concept_card',
    title: 'Turning Worlds to Numbers',
    visualType: 'embedding_sim',
    narrative: `Neural networks work with numbers, not words. An **embedding** turns a word (or a sentence, or an image) into a list of numbers: a point in a space with hundreds or thousands of dimensions.\n\nTraining places things with similar meanings close together.`,
    explanation: 'In the 2-D sketch, Cat and Dog are neighbors while Laptop and Server cluster elsewhere.',
    xpValue: 0
  },
  {
    id: '2-2-2',
    type: 'binary_choice',
    title: 'Vector Arithmetic',
    statement: 'In classic word embeddings such as word2vec, "King" − "Man" + "Woman" lands closest to "Queen".',
    correctAnswer: true,
    explanation: 'True. The 2013 word2vec research showed that some relationships, like male → female, become consistent directions in the space. One caveat: the input words themselves are excluded from the search, and many analogies work less neatly than this famous one.',
    xpValue: 10
  },
  {
    id: '2-2-3',
    type: 'spot_the_flaw',
    title: 'Meaning Beats Keywords',
    question: 'A search engine ranks documents by embedding similarity. You search for "cheap flights to Paris". Which document should rank highest?',
    options: [
      { id: 'a', text: "Budget airfare deals to France's capital", isCorrect: true },
      { id: 'b', text: 'Cheap places to eat in Paris, Texas', isCorrect: false },
      { id: 'c', text: 'Train timetable for Berlin', isCorrect: false }
    ],
    explanation: 'The airfare page. It shares no keywords with your query, yet its meaning is closest. The Paris, Texas page shares two keywords but is about something else. Embeddings match meaning, not exact words.',
    xpValue: 15
  },
  {
    id: '2-2-4',
    type: 'celebration',
    title: 'Track 2 Complete!',
    narrative: `You've completed Track 2: Data & Embeddings!\n\nYou know why data quality decides model quality, and how embeddings turn meaning into numbers a network can use.`,
    explanation: 'Track complete.',
    xpValue: 10
  }
];

// Unit 3.1: The Bouncer (Single Neuron)
const UNIT_3_1_STEPS: ExerciseStep[] = [
  {
    id: '3-1-1',
    type: 'concept_card',
    title: 'The Club Bouncer',
    visualType: 'neuron_bouncer',
    narrative: `A single artificial neuron works like a picky club bouncer: it looks at a few clues, weighs each one, adds them up, and says YES only if the total clears its bar.\n\nHere the question is "bring an umbrella?":\n• **Inputs**: the clues (storm clouds, cold wind)\n• **Weights**: dials for how much each clue counts\n• **Bias**: sets how high the bar is`,
    explanation: 'Right now Clouds × 4 + Wind × 3 = 7, below the bar of 10, so the neuron stays silent.',
    xpValue: 0
  },
  {
    id: '3-1-2',
    type: 'slider',
    title: 'Tune the Weight Dial',
    visualType: 'neuron_bouncer',
    question: 'Clouds and wind are both present, and wind adds 3. Turn the Clouds weight up until the total reaches the bar of 10 and the neuron fires.',
    sliderConfig: {
      min: 0,
      max: 15,
      step: 1,
      defaultValue: 4,
      unit: '',
      targetMin: 7,
      targetMax: 15,
      labelLow: '0 (ignore clouds)',
      labelHigh: '15 (clouds matter a lot)'
    },
    explanation: 'Any Clouds weight of 7 or more works: 7 + 3 = 10. Training does this automatically: gradient descent nudges millions of weights, using gradients computed by backpropagation.',
    xpValue: 15
  },
  {
    id: '3-1-3',
    type: 'binary_choice',
    title: 'Hard Switch or Smooth Dial?',
    statement: 'The neurons in modern deep networks output a hard yes/no, just like this bouncer.',
    correctAnswer: false,
    explanation: 'False. Modern networks use smooth activation functions such as ReLU or GELU. A hard on/off step is flat almost everywhere, and training needs a slope to know which way to turn each dial.',
    xpValue: 10
  },
  {
    id: '3-1-4',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `You understand the basic building block of deep neural networks: weighted inputs, a bias, and an activation.`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 3.2: The Assembly Line (layers & gradient descent)
const UNIT_3_2_STEPS: ExerciseStep[] = [
  {
    id: '3-2-1',
    type: 'concept_card',
    title: 'From One Neuron to Many Layers',
    visualType: 'layer_stack',
    narrative: `One neuron can only draw a single dividing line. Stack thousands of them into **layers** and you get an assembly line: each layer turns the previous layer's output into something more useful.\n\nIn image models, researchers found that early layers react to edges and colors, middle layers to textures and shapes, and deep layers to whole objects like faces or wheels.\n\n"Deep" learning simply means many layers.`,
    explanation: 'Nobody programs those features by hand. They emerge during training.',
    xpValue: 0
  },
  {
    id: '3-2-2',
    type: 'concept_card',
    title: 'Hiking Down in the Fog',
    visualType: 'gradient_descent_sim',
    narrative: `How does training find good weights? It measures how wrong the network is with a **loss** score, then works out which small change to each weight would lower it. That direction is the **gradient**.\n\nPicture a hiker in thick fog feeling for the downhill slope, one step at a time. The **learning rate** is the step size.`,
    explanation: 'With tiny steps the ball is still far from the bottom after 6 steps. You pick the step size next.',
    xpValue: 0
  },
  {
    id: '3-2-3',
    type: 'slider',
    title: 'Tune the Learning Rate',
    visualType: 'gradient_descent_sim',
    question: 'Pick a learning rate that gets the ball to the bottom within 6 steps without jumping past it.',
    sliderConfig: {
      min: 0.05,
      max: 1.1,
      step: 0.05,
      defaultValue: 0.05,
      unit: '',
      targetMin: 0.25,
      targetMax: 0.5,
      labelLow: 'Tiny steps',
      labelHigh: 'Giant leaps'
    },
    explanation: 'Anything from 0.25 to 0.5 works here. Smaller rates crawl; above 0.5 the ball jumps past the bottom and zig-zags; above 1.0 it flies off entirely. Real training tunes the learning rate for the same reason, and often lowers it as training goes on.',
    xpValue: 15
  },
  {
    id: '3-2-4',
    type: 'binary_choice',
    title: 'The Best Weights?',
    statement: 'Gradient descent is guaranteed to find the best possible weights for a deep network.',
    correctAnswer: false,
    explanation: "False. A deep network's loss landscape has many valleys and flat stretches, and gradient descent only follows the local slope. In practice it reliably finds weights that work well, with no guarantee they are the best possible.",
    xpValue: 10
  },
  {
    id: '3-2-5',
    type: 'concept_match',
    title: 'Match the Training Terms',
    question: 'Match each term with its meaning:',
    matchingPairs: [
      { id: '1', left: 'Loss', right: 'A score of how wrong the model is' },
      { id: '2', left: 'Gradient', right: 'Which way each weight should move to cut the loss' },
      { id: '3', left: 'Learning rate', right: 'How big each training step is' },
      { id: '4', left: 'Layer', right: "One stage of the network's assembly line" }
    ],
    explanation: 'Training is this loop repeated millions of times: measure the loss, follow the gradient, take a step.',
    xpValue: 20
  },
  {
    id: '3-2-6',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `You understand how stacked layers learn: a loss, a gradient, and many small steps downhill.`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 3.3: Memorize vs. Understand (overfitting)
const UNIT_3_3_STEPS: ExerciseStep[] = [
  {
    id: '3-3-1',
    type: 'concept_card',
    title: 'The Answer-Key Student',
    visualType: 'overfit_sim',
    narrative: `A student who memorizes last year's answer key aces the practice exam and fails the real one. Models can do the same: that's **overfitting**.\n\nSo we hold back data the model never trains on. Error on the training data shows how well it learned its examples; error on held-out **test** data shows how well it generalizes.`,
    explanation: 'This model is still too simple: it gets plenty wrong on both kinds of data.',
    xpValue: 0
  },
  {
    id: '3-3-2',
    type: 'slider',
    title: 'Find the Sweet Spot',
    visualType: 'overfit_sim',
    question: 'Turn the complexity dial to where the model does best on data it has never seen.',
    sliderConfig: {
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 2,
      unit: '',
      targetMin: 5,
      targetMax: 6,
      labelLow: '1 (too simple)',
      labelHigh: '10 (memorizes)'
    },
    explanation: 'Around 5 to 6, test error bottoms out. Simpler models underfit: they miss the pattern. More complex ones keep shrinking training error while test error climbs again, because they start memorizing noise.',
    xpValue: 15
  },
  {
    id: '3-3-3',
    type: 'binary_choice',
    title: 'Perfect Practice Scores',
    statement: 'If a model makes almost no errors on its training data, it will work well on new data.',
    correctAnswer: false,
    explanation: 'False. A near-perfect training score can simply mean memorization. Only performance on held-out data tells you whether the model generalizes.',
    xpValue: 10
  },
  {
    id: '3-3-4',
    type: 'spot_the_flaw',
    title: 'Spot the Flaw: The 99% Model',
    question: 'A team reports 99% accuracy for a model that predicts hospital readmissions. You learn they checked test-set accuracy after every tweak, hundreds of times. What is the problem?',
    options: [
      { id: 'a', text: 'The test set quietly became part of tuning, so 99% is too optimistic', isCorrect: true },
      { id: 'b', text: 'No medical model can ever reach 99%', isCorrect: false },
      { id: 'c', text: 'They should have trained on a bigger GPU', isCorrect: false }
    ],
    explanation: 'Every peek at the test set leaks information into your choices. Tune on a separate validation set and use the test set once, at the end, for an honest score.',
    xpValue: 15
  },
  {
    id: '3-3-5',
    type: 'concept_match',
    title: 'Match the Data Splits',
    question: 'Match each term with its role:',
    matchingPairs: [
      { id: '1', left: 'Training set', right: 'Examples the model learns from' },
      { id: '2', left: 'Validation set', right: 'Held-out data for tuning choices' },
      { id: '3', left: 'Test set', right: 'Untouched data for the final, honest score' },
      { id: '4', left: 'Overfitting', right: 'Great on training data, poor on new data' }
    ],
    explanation: 'Keeping these three splits apart is what makes a reported score believable.',
    xpValue: 20
  },
  {
    id: '3-3-6',
    type: 'celebration',
    title: 'Track 3 Complete!',
    narrative: `You've completed Track 3: Neural Networks!\n\nNeurons, layers, gradient descent and overfitting: you know how networks learn, and how they fool themselves.`,
    explanation: 'Track complete.',
    xpValue: 10
  }
];

// Unit 4.1: Next-Token Prediction
const UNIT_4_TOKENS_STEPS: ExerciseStep[] = [
  {
    id: '4-1-1',
    type: 'concept_card',
    title: 'Chopping Text into Tokens',
    visualType: 'token_sim',
    narrative: `A language model doesn't read letters or whole words. Text is chopped into **tokens**: common words, word pieces and punctuation. In English a token averages roughly ¾ of a word, though every model has its own tokenizer.\n\nEach token then becomes an embedding, and that's what the network works with.`,
    explanation: 'Tokens are also the unit that model usage is measured and priced in.',
    xpValue: 0
  },
  {
    id: '4-1-2',
    type: 'concept_card',
    title: 'One Token at a Time',
    visualType: 'temperature_sim',
    narrative: `At its core, an LLM does one thing over and over: given the tokens so far, it scores every possible next token and turns the scores into probabilities. It picks one, appends it, and repeats. Whole essays come out one token at a time.\n\n**Temperature** controls the pick: low temperature favors the top choice, high temperature spreads the odds to less likely tokens.`,
    explanation: 'Drag the temperature in the simulator and watch the odds for the next word shift.',
    xpValue: 0
  },
  {
    id: '4-1-3',
    type: 'binary_choice',
    title: 'Turning Down the Heat',
    statement: "Setting temperature to 0 makes a model's answers more creative and varied.",
    correctAnswer: false,
    explanation: 'False. Temperature 0 means (nearly) always picking the most likely token, so output becomes predictable. Higher temperatures add variety, and with it more risk of odd choices.',
    xpValue: 10
  },
  {
    id: '4-1-4',
    type: 'spot_the_flaw',
    title: 'The Strawberry Problem',
    question: 'Older chatbots often miscounted the letter "r" in "strawberry". What is the most likely reason?',
    options: [
      { id: 'a', text: 'They see the word as a few multi-letter tokens, not as single letters', isCorrect: true },
      { id: 'b', text: 'The word never appeared in their training data', isCorrect: false },
      { id: 'c', text: 'Counting needs more memory than a chatbot has', isCorrect: false }
    ],
    explanation: 'Tokens. The model receives "strawberry" as a couple of chunks, so the individual letters are never directly in front of it. Newer models do better, often by spelling the word out or reasoning step by step.',
    xpValue: 15
  },
  {
    id: '4-1-5',
    type: 'binary_choice',
    title: 'A Giant Lookup Table?',
    statement: 'An LLM answers questions by looking up stored sentences from its training text.',
    correctAnswer: false,
    explanation: "False. Training compresses patterns from the text into the model's weights; there is no table of sentences to look up. That's why it can write fluent text it never saw, and also why it can be confidently wrong.",
    xpValue: 10
  },
  {
    id: '4-1-6',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `You know what an LLM actually does: predict the next token, again and again, with temperature deciding how adventurous each pick is.`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 4.2: The Attention Revolution
const UNIT_4_ATTENTION_STEPS: ExerciseStep[] = [
  {
    id: '5-1-1',
    type: 'concept_card',
    title: 'Why Transformers Won',
    visualType: 'attention_sim',
    narrative: `Older language models (recurrent networks) read text one word at a time, squeezing everything so far into a small memory. Details from far back faded.\n\nThe **Transformer** (2017) lets each word look directly at the other words in its context through **self-attention**, and it processes a whole passage in parallel during training. In chat models like GPT, Claude and Gemini, each word looks back at all the words before it.`,
    explanation: 'Tap "it" in the sentence: most of its attention goes to "cat".',
    xpValue: 0
  },
  {
    id: '5-1-2',
    type: 'binary_choice',
    title: 'Can Attention Peek Ahead?',
    statement: 'When a chat model like GPT processes the word "it" in a sentence, it can already attend to words that come after "it".',
    correctAnswer: false,
    explanation: 'False. Chat models use causal (masked) attention: each word sees only earlier words, because the model writes text left to right. Encoder models such as BERT, built for understanding rather than writing, look in both directions.',
    xpValue: 10
  },
  {
    id: '5-1-3',
    type: 'spot_the_flaw',
    title: 'Who Is "It"?',
    question: '"The trophy didn\'t fit in the suitcase because it was too big." What does "it" refer to?',
    options: [
      { id: 'a', text: 'The trophy', isCorrect: true },
      { id: 'b', text: 'The suitcase', isCorrect: false }
    ],
    explanation: 'The trophy. Change "big" to "small" and "it" flips to the suitcase. Getting this right takes world knowledge, and attention is what lets a model connect "it", "big" and "trophy" across the sentence.',
    xpValue: 15
  },
  {
    id: '5-1-4',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `You now know the core mechanism inside the Transformers behind ChatGPT, Claude and Gemini.`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 4.3: Mixture of Experts
const UNIT_4_MOE_STEPS: ExerciseStep[] = [
  {
    id: '5-2-1',
    type: 'concept_card',
    title: 'The Smart Office (MoE)',
    visualType: 'moe_sim',
    narrative: `A dense model runs every one of its parameters for every token it reads or writes.\n\nA **Mixture-of-Experts (MoE)** model splits some layers into many "expert" sub-networks, and a small router sends each token to just a few of them. Mixtral 8x7B picks 2 of 8 experts per layer; DeepSeek-V3 and Qwen3 pick 8 out of 128 or more.`,
    explanation: 'The experts aren\'t neat "math" or "French" departments: the router learns its own division of labor, token by token.',
    xpValue: 0
  },
  {
    id: '5-2-2',
    type: 'binary_choice',
    title: 'Sparse vs. Dense Compute',
    statement: 'A Mixture-of-Experts model uses every one of its parameters for every token.',
    correctAnswer: false,
    explanation: 'False. MoE is sparse. DeepSeek-V3 holds 671 billion parameters but uses about 37 billion per token, and Qwen3-235B-A22B uses about 22 billion of its 235 billion. That cuts compute per token, though all experts still have to fit in memory.',
    xpValue: 10
  },
  {
    id: '5-2-3',
    type: 'spot_the_flaw',
    title: 'Spot the Flaw: Laptop MoE',
    question: 'A startup claims: "Our MoE model has 400B parameters but only 17B are active per token, so it runs on a laptop GPU with 24 GB of memory." What is the catch?',
    options: [
      { id: 'a', text: 'All 400B parameters still have to be loaded in memory', isCorrect: true },
      { id: 'b', text: 'Active parameters have no effect on speed', isCorrect: false },
      { id: 'c', text: 'MoE models cannot run on GPUs', isCorrect: false }
    ],
    explanation: 'All 400B parameters must stay loaded, because the router can pick any expert for the next token. That is roughly 200 GB even at 4 bits per parameter. Only the math per token shrinks to 17B parameters.',
    xpValue: 15
  },
  {
    id: '5-2-4',
    type: 'celebration',
    title: 'Track 4 Complete!',
    narrative: `You've completed Track 4: Large Language Models!\n\nTokens, attention and sparse experts: you understand the machinery behind today's largest language models, including open-weight ones like DeepSeek-V3 and Qwen3.`,
    explanation: 'Track complete.',
    xpValue: 10
  }
];

// Unit 5.1: The ReAct Loop (Agents)
const UNIT_5_1_STEPS: ExerciseStep[] = [
  {
    id: '6-1-1',
    type: 'concept_card',
    title: 'From Chatbot to Agent',
    visualType: 'react_sim',
    narrative: `On its own, a language model only produces text. It cannot check a live timetable, browse the web or run code.\n\nAn **agent** wraps the model in a loop. **ReAct** ("reason + act", 2022) is a classic version:\n1. THOUGHT: the model reasons about what to do next\n2. ACTION: it asks for a tool call (search, API, terminal)\n3. OBSERVATION: the harness runs the tool and feeds back the result\n...and repeats until it can give a final answer.`,
    explanation: 'The trace above shows one full loop, from thought to final answer.',
    xpValue: 0
  },
  {
    id: '6-1-2',
    type: 'binary_choice',
    title: 'Who Runs the Tool?',
    statement: 'In an agent loop, the language model itself executes the tool, for example by making the API call.',
    correctAnswer: false,
    explanation: 'False. The model only writes a request, such as a tool name and arguments. The surrounding harness executes it and passes the result back as an observation. That harness is also where permission checks and limits live.',
    xpValue: 10
  },
  {
    id: '6-1-3',
    type: 'spot_the_flaw',
    title: 'Spot the Agent Glitch',
    question: 'An agent gets "404 Not Found" from an API and retries the exact same call 1,000 times in a row. What guardrail was missing?',
    options: [
      { id: 'a', text: 'A faster GPU', isCorrect: false },
      { id: 'b', text: 'A loop guard: retry and step limits that halt repetition', isCorrect: true },
      { id: 'c', text: 'More training data on English grammar', isCorrect: false }
    ],
    explanation: 'A loop guard. Agent harnesses cap steps and retries, back off after errors and stop when the model repeats itself, so one bad response can\'t burn time and tokens forever. A 404 rarely fixes itself on retry anyway.',
    xpValue: 15
  },
  {
    id: '6-1-4',
    type: 'celebration',
    title: 'Lesson Complete!',
    narrative: `You understand how agents use tools inside a harness to act in the digital world.`,
    explanation: 'Lesson complete.',
    xpValue: 10
  }
];

// Unit 5.2: Hallucinations & RAG
const UNIT_5_2_STEPS: ExerciseStep[] = [
  {
    id: '6-2-1',
    type: 'concept_card',
    title: 'Fluent, Confident, Wrong',
    narrative: `Because an LLM predicts plausible next tokens, it can produce fluent, confident text that is simply false. This is called a **hallucination**.\n\nIn 2023, a US federal judge fined two lawyers and their law firm $5,000 after they filed a brief citing court cases that ChatGPT had made up.`,
    explanation: 'Plausible is not the same as true, so important claims need a source you can check.',
    xpValue: 0
  },
  {
    id: '6-2-2',
    type: 'concept_card',
    title: 'Open-Book Answers with RAG',
    visualType: 'rag_sim',
    narrative: `**Retrieval-Augmented Generation (RAG)** grounds the model in real documents:\n1. Turn the question into an embedding\n2. Search a document collection for the closest passages\n3. Paste those passages into the prompt\n4. Ask the model to answer from them and cite its sources`,
    explanation: "It's the embedding search from Track 2, put to work.",
    xpValue: 0
  },
  {
    id: '6-2-3',
    type: 'binary_choice',
    title: 'Does RAG Retrain the Model?',
    statement: 'RAG works by retraining the model on your documents.',
    correctAnswer: false,
    explanation: "False. RAG leaves the model's weights untouched and supplies documents at question time, so updating what it knows is as simple as updating the document collection.",
    xpValue: 10
  },
  {
    id: '6-2-4',
    type: 'spot_the_flaw',
    title: 'Spot the Flaw: The Stale Answer',
    question: "A company's RAG chatbot tells a customer the refund window is 14 days. The current policy says 30. The bot quoted its source accurately. What went wrong?",
    options: [
      { id: 'a', text: 'The document collection still held the old policy', isCorrect: true },
      { id: 'b', text: 'The temperature was set too low', isCorrect: false },
      { id: 'c', text: 'The model needed more attention heads', isCorrect: false }
    ],
    explanation: 'Garbage in, garbage out, once again: retrieval found an outdated document and the model repeated it faithfully. RAG is only as good as the collection it searches, so stale documents must be updated or removed.',
    xpValue: 15
  },
  {
    id: '6-2-5',
    type: 'concept_match',
    title: 'Match the Grounding Terms',
    question: 'Match each term with its meaning:',
    matchingPairs: [
      { id: '1', left: 'Hallucination', right: 'Fluent output that is false' },
      { id: '2', left: 'Retrieval', right: 'Finding passages relevant to the question' },
      { id: '3', left: 'Grounding', right: 'Tying the answer to supplied sources' },
      { id: '4', left: 'Citation', right: 'A pointer that lets you check the source' }
    ],
    explanation: 'Retrieval plus citations turns "trust me" into "check for yourself".',
    xpValue: 20
  },
  {
    id: '6-2-6',
    type: 'celebration',
    title: 'Track 5 Complete!',
    narrative: `You've completed Track 5: Agents & RAG!\n\nYou know how agents think, act and observe in a loop, and how grounding answers in real documents keeps them from making things up. Replay any lesson or run practice drills to keep your streak alive.`,
    explanation: 'Track complete.',
    xpValue: 10
  }
];

// Master curriculum. Unit ids are stored in users' completedLessons, so never rename them.
// Ids don't follow display numbering: track 4 is 'track-5' (units 'unit-4-1', 'unit-5-*'),
// track 5 is 'track-6' ('unit-6-*'). New ids only need to be unique.
export const TRACKS: Track[] = [
  {
    id: 'track-1',
    title: 'Track 1: Probability & Statistics',
    color: '#F59E0B',
    units: [
      {
        id: 'unit-1-1',
        title: "Bayes' Rule",
        subtitle: 'Base rates, priors & false positives',
        icon: '⚖️',
        steps: UNIT_1_1_STEPS
      },
      {
        id: 'unit-1-2',
        title: 'Averages & Outliers',
        subtitle: 'Mean vs. median & variance',
        icon: '📊',
        steps: UNIT_1_2_STEPS
      },
      {
        id: 'unit-1-3',
        title: 'Precision & Recall',
        subtitle: 'Alarm thresholds & why accuracy misleads',
        icon: '🎯',
        steps: UNIT_1_3_STEPS
      }
    ]
  },
  {
    id: 'track-2',
    title: 'Track 2: Data & Embeddings',
    color: '#34D399',
    units: [
      {
        id: 'unit-2-1',
        title: 'Biased Data',
        subtitle: 'Selection & survivorship bias, proxy variables',
        icon: '🛢️',
        steps: UNIT_2_1_STEPS
      },
      {
        id: 'unit-2-2',
        title: 'Embeddings',
        subtitle: 'Words as vectors & semantic search',
        icon: '🗺️',
        steps: UNIT_2_2_STEPS
      }
    ]
  },
  {
    id: 'track-3',
    title: 'Track 3: Neural Networks',
    color: '#38BDF8',
    units: [
      {
        id: 'unit-3-1',
        title: 'The Artificial Neuron',
        subtitle: 'Weights, bias & activation',
        icon: '🧠',
        steps: UNIT_3_1_STEPS
      },
      {
        id: 'unit-3-2',
        title: 'Layers & Gradient Descent',
        subtitle: 'Loss, gradients & learning rate',
        icon: '🏭',
        steps: UNIT_3_2_STEPS
      },
      {
        id: 'unit-3-3',
        title: 'Overfitting',
        subtitle: 'Training, validation & test sets',
        icon: '🎓',
        steps: UNIT_3_3_STEPS
      }
    ]
  },
  {
    id: 'track-5',
    title: 'Track 4: Large Language Models',
    color: '#A78BFA',
    units: [
      {
        id: 'unit-4-1',
        title: 'Next-Token Prediction',
        subtitle: 'Tokens, probabilities & temperature',
        icon: '🔮',
        steps: UNIT_4_TOKENS_STEPS
      },
      {
        id: 'unit-5-1',
        title: 'Attention & Transformers',
        subtitle: 'Why Transformers replaced RNNs, causal attention',
        icon: '🔍',
        steps: UNIT_4_ATTENTION_STEPS
      },
      {
        id: 'unit-5-2',
        title: 'Mixture of Experts',
        subtitle: 'Active vs. total parameters',
        icon: '🧩',
        steps: UNIT_4_MOE_STEPS
      }
    ]
  },
  {
    id: 'track-6',
    title: 'Track 5: Agents & RAG',
    color: '#F472B6',
    units: [
      {
        id: 'unit-6-1',
        title: 'Agents & Tool Use',
        subtitle: 'The ReAct loop & guardrails',
        icon: '🤖',
        steps: UNIT_5_1_STEPS
      },
      {
        id: 'unit-6-2',
        title: 'Hallucinations & RAG',
        subtitle: 'Retrieval, grounding & citations',
        icon: '📚',
        steps: UNIT_5_2_STEPS
      }
    ]
  }
];
