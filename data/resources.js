// Curated high-value educational social media and open learning resources
const LEARNING_RESOURCES = [
  // Programming & Technology
  {
    id: "prog-1",
    category: "Programming",
    title: "freeCodeCamp",
    platform: "YouTube & Web",
    type: "Free Courses",
    url: "https://www.youtube.com/@freecodecamp",
    description: "Full-length 5-10 hour comprehensive tutorials on Python, JavaScript, Web Dev, AI, and CS fundamentals with no ads.",
    tags: ["Coding", "Python", "Web Dev", "Full Courses"]
  },
  {
    id: "prog-2",
    category: "Programming",
    title: "r/learnprogramming",
    platform: "Reddit",
    type: "Community",
    url: "https://www.reddit.com/r/learnprogramming/",
    description: "The world's largest collaborative peer-learning community for programmers of all skill levels.",
    tags: ["Peer Help", "Community", "Debugging", "Career Advice"]
  },
  {
    id: "prog-3",
    category: "Programming",
    title: "Fireship",
    platform: "YouTube",
    type: "Fast Tech Summaries",
    url: "https://www.youtube.com/@Fireship",
    description: "High-energy 100-second code breakdowns, modern framework overviews, and developer news.",
    tags: ["Tech Trends", "100 Seconds", "JavaScript", "Quick Learning"]
  },
  {
    id: "prog-4",
    category: "Programming",
    title: "CS50: Harvard Computer Science",
    platform: "YouTube & edX",
    type: "University Lecture",
    url: "https://cs50.harvard.edu/x/",
    description: "World renowned introductory computer science course taught by David J. Malan.",
    tags: ["Harvard", "Foundations", "Algorithms", "C/Python"]
  },

  // English & Communication
  {
    id: "eng-1",
    category: "English",
    title: "BBC Learning English",
    platform: "YouTube & App",
    type: "Grammar & Speaking",
    url: "https://www.youtube.com/@bbclearningenglish",
    description: "Daily bite-sized videos covering 6-minute English, pronunciation, business vocabulary, and idioms.",
    tags: ["Pronunciation", "Vocabulary", "British English", "Listening"]
  },
  {
    id: "eng-2",
    category: "English",
    title: "TED & TED-Ed",
    platform: "YouTube",
    type: "Speeches & Animations",
    url: "https://www.youtube.com/@TEDEd",
    description: "Captivating short animated lessons and world-class orators to improve vocabulary and presentation skills.",
    tags: ["Presentations", "Rhetoric", "Storytelling", "Critical Thinking"]
  },
  {
    id: "eng-3",
    category: "English",
    title: "r/EnglishLearning",
    platform: "Reddit",
    type: "Q&A Community",
    url: "https://www.reddit.com/r/EnglishLearning/",
    description: "Friendly forum where native speakers clarify subtle grammar rules, nuances, and natural phrasing.",
    tags: ["Grammar Q&A", "Proofreading", "Natural English"]
  },

  // Mathematics
  {
    id: "math-1",
    category: "Mathematics",
    title: "3Blue1Brown",
    platform: "YouTube",
    type: "Visual Math",
    url: "https://www.youtube.com/@3blue1brown",
    description: "The gold standard of visual mathematical intuition: linear algebra, calculus, neural networks, and probability.",
    tags: ["Calculus", "Linear Algebra", "Visual Intuition", "Geometry"]
  },
  {
    id: "math-2",
    category: "Mathematics",
    title: "Khan Academy Math",
    platform: "YouTube & Web",
    type: "Step-by-Step",
    url: "https://www.khanacademy.org/math",
    description: "Complete mastery from basic school arithmetic through differential equations and statistics.",
    tags: ["School Prep", "Exams", "SAT", "College Math"]
  },
  {
    id: "math-3",
    category: "Mathematics",
    title: "Numberphile",
    platform: "YouTube",
    type: "Math Curiosities",
    url: "https://www.youtube.com/@numberphile",
    description: "World-class mathematicians exploring mind-bending numbers, paradoxes, and real-world math mysteries.",
    tags: ["Math Fun", "Number Theory", "Paradoxes"]
  },

  // Science
  {
    id: "sci-1",
    category: "Science",
    title: "Veritasium",
    platform: "YouTube",
    type: "Physics & Inquiry",
    url: "https://www.youtube.com/@veritasium",
    description: "Mind-opening physics experiments, scientific counter-intuitions, and deep dives into nature.",
    tags: ["Physics", "Scientific Method", "Experiments"]
  },
  {
    id: "sci-2",
    category: "Science",
    title: "Kurzgesagt – In a Nutshell",
    platform: "YouTube",
    type: "Animated Science",
    url: "https://www.youtube.com/@kurzgesagt",
    description: "Exquisite animations explaining biology, space, quantum mechanics, evolution, and medicine.",
    tags: ["Biology", "Astrophysics", "Medicine", "Philosophy"]
  },
  {
    id: "sci-3",
    category: "Science",
    title: "r/AskScience",
    platform: "Reddit",
    type: "Peer-Reviewed Q&A",
    url: "https://www.reddit.com/r/askscience/",
    description: "Ask any scientific question and receive rigorously peer-vetted answers from scientists and researchers.",
    tags: ["Peer Reviewed", "Research", "Curiosity"]
  },

  // General Knowledge & Intellectual Growth
  {
    id: "gk-1",
    category: "General Knowledge",
    title: "CrashCourse",
    platform: "YouTube",
    type: "Educational Series",
    url: "https://www.youtube.com/@crashcourse",
    description: "High-quality fast-paced series covering World History, Economics, Psychology, Philosophy, and Literature.",
    tags: ["History", "Economics", "Psychology", "School Curriculum"]
  },
  {
    id: "gk-2",
    category: "General Knowledge",
    title: "Vox Borders & Explained",
    platform: "YouTube",
    type: "Geopolitics & Analysis",
    url: "https://www.youtube.com/@vox",
    description: "Engaging video journalism explaining global news, geopolitical history, maps, and societal trends.",
    tags: ["Geopolitics", "Data Journalism", "World Affairs"]
  },
  {
    id: "gk-3",
    category: "General Knowledge",
    title: "r/TodayILearned",
    platform: "Reddit",
    type: "Fact Bites",
    url: "https://www.reddit.com/r/todayilearned/",
    description: "Verified historical, scientific, and cultural facts with mandatory credible citations.",
    tags: ["Trivia", "History Facts", "Verified Sources"]
  },

  // Career Skills & Professional Growth
  {
    id: "car-1",
    category: "Career Skills",
    title: "LinkedIn Learning & Student Hub",
    platform: "LinkedIn",
    type: "Networking & Portfolios",
    url: "https://www.linkedin.com/",
    description: "Build an online resume, display verified certificates, connect with mentors, and explore internships.",
    tags: ["Resume", "Internships", "Mentors", "Networking"]
  },
  {
    id: "car-2",
    category: "Career Skills",
    title: "Ali Abdaal – Study Techniques",
    platform: "YouTube",
    type: "Productivity",
    url: "https://www.youtube.com/@aliabdaal",
    description: "Evidence-based revision techniques: Active Recall, Spaced Repetition, and deep work systems.",
    tags: ["Active Recall", "Spaced Repetition", "Time Management"]
  },
  {
    id: "car-3",
    category: "Career Skills",
    title: "Harvard Business Review Ideas",
    platform: "YouTube & LinkedIn",
    type: "Leadership & Management",
    url: "https://www.youtube.com/@harvardbusinessreview",
    description: "Interpersonal communication, workplace resilience, negotiation, and strategic thinking.",
    tags: ["Leadership", "Workplace Skills", "Strategy"]
  }
];

// Support both ES module and global script inclusion
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LEARNING_RESOURCES };
}
