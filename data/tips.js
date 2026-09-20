// StudySocial Daily Positive Tips & Mindsets for Students
const DAILY_TIPS = [
  {
    id: 1,
    category: "Algorithm Mastery",
    tip: "Curate your algorithm: Follow 5 educational creators and like 10 academic posts today. Your feed will automatically transform into a digital classroom!",
    action: "Search for a top educator in your field on YouTube or LinkedIn."
  },
  {
    id: 2,
    category: "Career Networking",
    tip: "LinkedIn is not just for graduates. Connect with alumni from your school or college and send polite messages asking about their career journey.",
    action: "Send a polite connection request to an alumni in your dream profession."
  },
  {
    id: 3,
    category: "Focused Learning",
    tip: "Use Reddit for peer-reviewed questions: Subreddits like r/learnprogramming, r/AskScience, or r/HomeworkHelp are goldmines of collaborative explanations.",
    action: "Bookmark 2 subject-specific subreddits instead of meme pages."
  },
  {
    id: 4,
    category: "Micro-learning",
    tip: "Turn 15 minutes of idle scrolling into micro-learning. Follow accounts that share 60-second vocabulary, coding syntax, or historical facts.",
    action: "Replace one celebrity gossip account with an educational creator."
  },
  {
    id: 5,
    category: "Collaborative Study",
    tip: "Create virtual study rooms with friends on Discord or WhatsApp to quiz each other before exams. Accountability increases retention by up to 65%.",
    action: "Schedule a 30-minute group study sprint with a classmate."
  },
  {
    id: 6,
    category: "Show Your Work",
    tip: "Share your study notes, drawings, or coding projects publicly. Teaching concepts to an audience is the ultimate test of understanding (The Feynman Technique).",
    action: "Post a quick summary of something new you learned today."
  },
  {
    id: 7,
    category: "Mental Balance",
    tip: "Social media should inspire you, not drain you. If an account triggers comparison or anxiety, mute or unfollow it with zero hesitation.",
    action: "Do a quick 2-minute audit of your following list."
  },
  {
    id: 8,
    category: "Global Awareness",
    tip: "Follow leading researchers, professors, and open-source contributors on X (Twitter). You'll discover breakthroughs weeks before textbooks publish them.",
    action: "Find and follow the official handle of NASA, MIT, or Nature."
  },
  {
    id: 9,
    category: "Creative Expression",
    tip: "Use platforms like Pinterest or Behance for visual research, mind-mapping, and design inspiration for school projects and presentations.",
    action: "Create a moodboard or idea pin for your upcoming project."
  },
  {
    id: 10,
    category: "Opportunity Hunter",
    tip: "Scholarships, summer internships, and student hackathons are announced first on social media. Search hashtags like #StudentInternship or #ScholarshipAlert.",
    action: "Save a search filter for student opportunities in your city or field."
  }
];

// Helper to get tip of the day based on day of year
function getDailyTip() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
}

// Support both ES module and global script inclusion
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DAILY_TIPS, getDailyTip };
}
