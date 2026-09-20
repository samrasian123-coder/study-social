// Six Pillars of Positive Social Media for Students
const POSITIVE_PILLARS = [
  {
    id: "education",
    title: "Education & Learning",
    badge: "Academy",
    icon: "🎓",
    color: "#4f46e5",
    summary: "Transform social feeds from mind-numbing loops into dynamic, on-demand mini universities.",
    description: "Social media democratizes access to the world's greatest professors and researchers. Instead of passive browsing, students can follow academic channels, participate in math challenges, and watch animated scientific dissections.",
    benefits: [
      "Access free lectures from Harvard, MIT, and Oxford on YouTube and Reddit.",
      "Get complex STEM equations simplified through 3D animations and visual breakdowns.",
      "Receive real-time updates on scientific discoveries before they appear in textbooks."
    ],
    studentActionPlan: [
      "Replace 3 entertainment channels with educational ones (e.g., 3Blue1Brown, Kurzgesagt).",
      "Join 1 subject-specific subreddit for instant homework and concept clarification.",
      "Save educational posts into categorized folders (e.g., 'Physics', 'History', 'Vocab')."
    ]
  },
  {
    id: "communication",
    title: "Communication & Discourse",
    badge: "Connect",
    icon: "💬",
    color: "#0284c7",
    summary: "Foster intellectual discourse, cross-cultural friendships, and constructive debate.",
    description: "Digital platforms connect students with peers across the globe, offering exposure to diverse perspectives, languages, and cultures that expand empathy and critical thinking.",
    benefits: [
      "Practice second language skills with native speakers on language exchange forums.",
      "Develop debate and persuasive writing skills through constructive comment sections.",
      "Connect with international students studying the same syllabus or university exams."
    ],
    studentActionPlan: [
      "Join a language exchange community on Discord or Reddit.",
      "Form an online study circle where students quiz each other weekly.",
      "Write constructive, well-researched comments instead of reactionary replies."
    ]
  },
  {
    id: "skills",
    title: "Skill Development",
    badge: "Mastery",
    icon: "⚡",
    color: "#059669",
    summary: "Learn practical, marketable skills outside traditional classroom curriculums.",
    description: "From programming to digital marketing, video editing, public speaking, and financial literacy, social media is an open apprenticeship platform.",
    benefits: [
      "Learn coding through 60-second micro tutorials and open GitHub repositories.",
      "Master tools like Figma, Notion, Excel, and Premiere Pro through creator tutorials.",
      "Follow financial literacy and productivity creators to master time and money."
    ],
    studentActionPlan: [
      "Pick one hard skill (e.g. Python or UI Design) and dedicate 20 mins of daily social time to it.",
      "Participate in weekly online challenges (e.g. #100DaysOfCode, #Inktober).",
      "Replicate tutorial projects and publish your personal variations."
    ]
  },
  {
    id: "career",
    title: "Career & Opportunities",
    badge: "Future",
    icon: "🚀",
    color: "#7c3aed",
    summary: "Build an early professional presence, find internships, and connect with mentors.",
    description: "Proactive students use LinkedIn, Twitter, and professional forums to unlock scholarships, research apprenticeships, and entry-level positions long before graduating.",
    benefits: [
      "Direct line of communication with hiring managers, founders, and professors.",
      "Early notifications of student hackathons, competitions, and scholarship grants.",
      "Establishing a credible digital footprint that impresses university admission boards."
    ],
    studentActionPlan: [
      "Build a polished LinkedIn profile showcasing coursework, projects, and volunteer work.",
      "Politely reach out to 2 alumni working in fields you aspire to enter.",
      "Set alerts for #StudentInternship and #Scholarship keywords."
    ]
  },
  {
    id: "creativity",
    title: "Creativity & Expression",
    badge: "Create",
    icon: "🎨",
    color: "#db2777",
    summary: "Transition from passive content consumer into confident, thoughtful content creator.",
    description: "Publishing creative writing, artwork, music, or video essays allows students to build confidence, receive constructive feedback, and build a digital portfolio.",
    benefits: [
      "Instant feedback loops from supportive global communities of fellow artists and writers.",
      "Portfolio creation that demonstrates tangible initiative to future employers.",
      "Development of multimedia skills: scriptwriting, editing, graphic design, and storytelling."
    ],
    studentActionPlan: [
      "Start a student blog, Substack, or Instagram studygram highlighting your revision notes.",
      "Participate in creative critiques on Behance or r/DesignCritiques.",
      "Teach a concept you recently learned in a short slide deck or video format."
    ]
  },
  {
    id: "collaboration",
    title: "Collaboration & Teamwork",
    badge: "Team",
    icon: "🤝",
    color: "#ea580c",
    summary: "Work together across borders on open-source, civic, and academic initiatives.",
    description: "Student-led initiatives thrive on social platforms. Whether organizing charity drives, environmental campaigns, or student magazines, social media unites motivated minds.",
    benefits: [
      "Collaborate on group research papers or software projects with students worldwide.",
      "Organize community awareness campaigns and student fundraisers efficiently.",
      "Learn modern remote team collaboration techniques used by global companies."
    ],
    studentActionPlan: [
      "Contribute to a beginner-friendly open-source repository or collaborative wiki.",
      "Create a shared Notion/Google Drive workspace for your study group.",
      "Organize a virtual peer-review session before major academic submissions."
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { POSITIVE_PILLARS };
}
