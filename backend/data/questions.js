// ==================================================
// BACKEND — APARNA
//
// File: backend/data/questions.js
//
// Purpose:
// Question bank for the Aptitude Assessment Module.
// Contains curated multiple-choice questions across:
// 1. Quantitative Aptitude
// 2. Logical Reasoning
// 3. Verbal Ability
// ==================================================

const questionBank = [
  // --- QUANTITATIVE APTITUDE ---
  {
    id: 1,
    category: 'Quantitative Aptitude',
    topic: 'Percentages',
    question: 'If the price of a commodity increases by 25%, by what percentage must a household reduce its consumption so as not to increase the expenditure?',
    options: ['15%', '20%', '25%', '30%'],
    correctAnswer: 1, // index 1 = 20%
    explanation: 'Formula: [R / (100 + R)] * 100% = [25 / 125] * 100% = (1/5) * 100% = 20% reduction.'
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    question: 'A shopkeeper sells an article at Rs. 840 making a profit of 20%. What was the cost price of the article?',
    options: ['Rs. 680', 'Rs. 700', 'Rs. 720', 'Rs. 750'],
    correctAnswer: 1, // Rs. 700
    explanation: 'Cost Price = Selling Price / (1 + Profit%) = 840 / 1.20 = Rs. 700.'
  },
  {
    id: 3,
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    question: 'A can complete a project in 12 days and B can complete the same project in 24 days. Working together, how many days will they take to finish the work?',
    options: ['6 days', '8 days', '10 days', '18 days'],
    correctAnswer: 1, // 8 days
    explanation: 'Combined 1 day work = (1/12) + (1/24) = 3/24 = 1/8. Hence, together they take 8 days.'
  },
  {
    id: 4,
    category: 'Quantitative Aptitude',
    topic: 'Ratios and Proportions',
    question: 'The ratio of two numbers is 3 : 5. If 10 is added to each number, the ratio becomes 5 : 7. What are the original numbers?',
    options: ['15 and 25', '18 and 30', '12 and 20', '9 and 15'],
    correctAnswer: 0, // 15 and 25
    explanation: '(3x + 10) / (5x + 10) = 5/7 => 21x + 70 = 25x + 50 => 4x = 20 => x = 5. Numbers are 3(5)=15 and 5(5)=25.'
  },
  {
    id: 5,
    category: 'Quantitative Aptitude',
    topic: 'Simple Interest',
    question: 'A sum of money doubles itself at simple interest in 8 years. What is the annual rate of interest?',
    options: ['10%', '12.5%', '15%', '16.66%'],
    correctAnswer: 1, // 12.5%
    explanation: 'SI = Principal (P). Formula: SI = (P * R * T) / 100 => P = (P * R * 8)/100 => R = 100/8 = 12.5%.'
  },
  {
    id: 6,
    category: 'Quantitative Aptitude',
    topic: 'Averages',
    question: 'The average score of a batsman in 10 innings is 32. How many runs must he score in his next inning to raise his average by 4 runs?',
    options: ['68 runs', '72 runs', '76 runs', '80 runs'],
    correctAnswer: 2, // 76 runs
    explanation: 'Required Total = 11 * 36 = 396. Current Total = 10 * 32 = 320. Next inning runs = 396 - 320 = 76 runs.'
  },
  {
    id: 7,
    category: 'Quantitative Aptitude',
    topic: 'Speed, Time & Distance',
    question: 'A train 180 meters long is traveling at a speed of 54 km/hr. How much time will it take to pass a telegraph post?',
    options: ['10 seconds', '12 seconds', '15 seconds', '18 seconds'],
    correctAnswer: 1, // 12 seconds
    explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 180 / 15 = 12 seconds.'
  },

  // --- LOGICAL REASONING ---
  {
    id: 8,
    category: 'Logical Reasoning',
    topic: 'Number Series',
    question: 'Find the next number in the series: 4, 9, 25, 49, 121, ?',
    options: ['144', '169', '196', '225'],
    correctAnswer: 1, // 169
    explanation: 'The series consists of squares of consecutive prime numbers: 2^2=4, 3^2=9, 5^2=25, 7^2=49, 11^2=121, 13^2=169.'
  },
  {
    id: 9,
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    question: 'If in a code language, "ROSE" is written as "TQUG", how will "MIND" be written in the same language?',
    options: ['OKPF', 'OJPE', 'NKPF', 'PKQF'],
    correctAnswer: 0, // OKPF
    explanation: 'Each letter is shifted forward by +2 positions in the alphabet: M+2=O, I+2=K, N+2=P, D+2=F.'
  },
  {
    id: 10,
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    question: 'Pointing to a gentleman, Neha said, "His only brother is the father of my daughter\'s father." How is the gentleman related to Neha\'s husband?',
    options: ['Father', 'Uncle', 'Brother', 'Grandfather'],
    correctAnswer: 1, // Uncle
    explanation: 'Neha\'s daughter\'s father is Neha\'s husband. His father is the husband\'s father. The gentleman is the brother of husband\'s father, so he is the husband\'s Uncle (Paternal Uncle).'
  },
  {
    id: 11,
    category: 'Logical Reasoning',
    topic: 'Directions Sense',
    question: 'Rahul walks 10 km towards North. From there, he turns right and walks 6 km. Finally, he turns right and walks 10 km. How far is he from his starting point?',
    options: ['6 km East', '10 km West', '6 km North', '16 km South'],
    correctAnswer: 0, // 6 km East
    explanation: 'North 10 km, East 6 km, South 10 km brings him back to the horizontal level of the starting point, exactly 6 km East.'
  },
  {
    id: 12,
    category: 'Logical Reasoning',
    topic: 'Logical Deductions',
    question: 'Statements: All laptops are devices. Some devices are phones. Conclusion I: Some laptops are phones. Conclusion II: All devices are laptops.',
    options: ['Only Conclusion I follows', 'Only Conclusion II follows', 'Both follow', 'Neither follows'],
    correctAnswer: 3, // Neither follows
    explanation: 'There is no direct universal intersection given between laptops and phones, nor are all devices laptops.'
  },
  {
    id: 13,
    category: 'Logical Reasoning',
    topic: 'Analogy',
    question: 'Architect : Building :: Sculptor : ?',
    options: ['Museum', 'Statue', 'Chisel', 'Stone'],
    correctAnswer: 1, // Statue
    explanation: 'An architect designs/creates a building; a sculptor creates a statue.'
  },

  // --- VERBAL ABILITY ---
  {
    id: 14,
    category: 'Verbal Ability',
    topic: 'Synonyms',
    question: 'Select the synonym for the word: "PRAGMATIC"',
    options: ['Theoretical', 'Practical', 'Idealistic', 'Impulsive'],
    correctAnswer: 1, // Practical
    explanation: 'Pragmatic means dealing with things sensibly and realistically based on practical rather than theoretical considerations.'
  },
  {
    id: 15,
    category: 'Verbal Ability',
    topic: 'Antonyms',
    question: 'Select the antonym for the word: "CANDID"',
    options: ['Honest', 'Frank', 'Deceitful', 'Outspoken'],
    correctAnswer: 2, // Deceitful
    explanation: 'Candid means straightforward and sincere. Its opposite is deceitful or secretive.'
  },
  {
    id: 16,
    category: 'Verbal Ability',
    topic: 'Sentence Correction',
    question: 'Choose the grammatically correct option: "Neither the manager nor the employees _____ present at the briefing yesterday."',
    options: ['was', 'were', 'is', 'are'],
    correctAnswer: 1, // were
    explanation: 'In "neither...nor" constructions, the verb agrees with the closer subject ("employees", plural), so "were" is correct for past tense.'
  },
  {
    id: 17,
    category: 'Verbal Ability',
    topic: 'Grammar & Prepositions',
    question: 'She is proficient _____ data structures and algorithms.',
    options: ['with', 'in', 'at', 'about'],
    correctAnswer: 1, // in
    explanation: 'The adjective "proficient" is traditionally paired with the preposition "in" (proficient in a subject/skill).'
  },
  {
    id: 18,
    category: 'Verbal Ability',
    topic: 'Idioms & Phrases',
    question: 'What is the meaning of the idiom: "Bite the bullet"?',
    options: ['To act aggressively', 'To face a painful situation with courage', 'To shoot accurately', 'To avoid responsibility'],
    correctAnswer: 1, // To face a painful situation with courage
    explanation: '"Bite the bullet" means to endure a painful or difficult situation with resilience and courage.'
  },
  {
    id: 19,
    category: 'Verbal Ability',
    topic: 'Vocabulary',
    question: 'Choose the correct word to fill in the blank: "The candidate gave a very _____ answer during the technical interview."',
    options: ['lucid', 'opaque', 'tardy', 'hasty'],
    correctAnswer: 0, // lucid
    explanation: 'Lucid means clear, easily understood, and articulate.'
  },
  {
    id: 20,
    category: 'Verbal Ability',
    topic: 'Sentence Completion',
    question: 'Despite the tight deadlines, the development team managed to deliver the project _____ quality.',
    options: ['compromising on', 'without compromising on', 'at the cost of', 'with deteriorating'],
    correctAnswer: 1, // without compromising on
    explanation: 'The word "Despite" indicates a contrast, meaning they met deadlines while successfully maintaining high quality.'
  }
];

module.exports = questionBank;
