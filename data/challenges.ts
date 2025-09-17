export interface Challenge {
  id: number;
  name: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  participants: number;
  submissions: number;
  prize: string;
  description: string;
  image: any; // For require() imports
  tags: string[];
  rules?: string[];
  judgesCriteria?: string[];
  totalPrizeValue?: number;
  submissionDeadline: string;
  winnerAnnouncement?: string;
  backgroundColor?: string;
  themeColor?: string;
}

export interface ChallengeSubmission {
  id: number;
  challengeId: number;
  campaign: string;
  title: string;
  author: string;
  authorAvatar?: any; // For require() imports
  authorBadge?: 'verified' | 'top_chef' | 'rising_star';
  submittedAt: string;
  votes: number;
  comments: number;
  status: 'pending' | 'approved' | 'rejected';
  images: any[]; // For require() imports
  description?: string;
  recipe?: string;
  ingredients?: string[];
  cookingTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  isLiked?: boolean;
  isPinned?: boolean;
  tags?: string[];
  location?: string;
}

export interface ChallengeComment {
  id: number;
  submissionId: number;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

// Mock data for challenges
export const getChallenges = (): Challenge[] => [
  {
    id: 1,
    name: "Air Fryer Challenge",
    status: "active",
    startDate: "2024-12-01",
    endDate: "2024-12-31", 
    participants: 125432,
    submissions: 8921,
    prize: "Air Fryer + KSH 30,000",
    description: "Create the most delicious and healthy air fryer recipe! Show us your creativity with crispy, golden perfection.",
    image: require("@/assets/images/airfryerchallengeposter.jpg"),
    tags: ["healthy", "crispy", "quick", "air-fryer"],
    rules: [
      "Recipe must use an air fryer as the primary cooking method",
      "Include clear step-by-step photos",
      "Recipe should serve 2-4 people",
      "Use locally available ingredients"
    ],
    judgesCriteria: [
      "Creativity and originality (30%)",
      "Visual presentation (25%)",
      "Health value (25%)",
      "Ease of preparation (20%)"
    ],
    totalPrizeValue: 45000,
    submissionDeadline: "2024-12-31T23:59:59",
    winnerAnnouncement: "2025-01-07",
    backgroundColor: "#FFFBF0",
    themeColor: "#FF8F00"
  },
  {
    id: 2,
    name: "New Year Detox",
    status: "upcoming", 
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    participants: 0,
    submissions: 0,
    prize: "KSH 50,000 + Health Package",
    description: "Start the new year right with healthy, detoxifying recipes that cleanse and energize your body.",
    image: require("@/assets/images/greeksalad.jpg"),
    tags: ["detox", "healthy", "green", "cleanse"],
    rules: [
      "Focus on whole, unprocessed ingredients",
      "Include at least 3 vegetables or fruits",
      "No refined sugars or processed foods",
      "Provide nutritional benefits explanation"
    ],
    totalPrizeValue: 50000,
    submissionDeadline: "2025-01-31T23:59:59",
    backgroundColor: "#F8FBF8", 
    themeColor: "#4CAF50"
  },
  {
    id: 3,
    name: "Valentine's Special",
    status: "upcoming",
    startDate: "2025-02-01", 
    endDate: "2025-02-14",
    participants: 0,
    submissions: 0,
    prize: "Romantic Dinner Package + KSH 25,000",
    description: "Create the perfect romantic dish to share with your loved one this Valentine's Day!",
    image: require("@/assets/images/carbonara.jpg"), 
    tags: ["romantic", "special", "sharing", "love"],
    totalPrizeValue: 25000,
    submissionDeadline: "2025-02-14T23:59:59",
    backgroundColor: "#FDF7F7",
    themeColor: "#E91E63"
  }
];

// Mock data for challenge submissions
export const getChallengeSubmissions = (challengeId?: number): ChallengeSubmission[] => {
  const allSubmissions: ChallengeSubmission[] = [

  ];

  return challengeId 
    ? allSubmissions.filter(submission => submission.challengeId === challengeId)
    : allSubmissions;
};

export const getActiveChallenge = (): Challenge | null => {
  const challenges = getChallenges();
  return challenges.find(challenge => challenge.status === 'active') || null;
};

export const getTrendingSubmissions = (): ChallengeSubmission[] => {
  return getChallengeSubmissions()
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10);
};
