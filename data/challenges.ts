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
    {
      id: 1,
      challengeId: 1,
      campaign: "Air Fryer Challenge",
      title: "Crispy Air Fryer Chicken Wings",
      author: "Sarah Kimani",
      authorAvatar: require("@/assets/images/food-example.jpg"),
      authorBadge: "verified",
      submittedAt: "2024-12-15T10:30:00",
      votes: 3456,
      comments: 234,
      status: "approved",
      images: [
        require("@/assets/images/chicken-tacos.jpg"),
        require("@/assets/images/chickentikkamasala.jpg"),
        require("@/assets/images/food-example.jpg")
      ],
      description: "These wings are incredibly crispy on the outside and juicy on the inside! My secret is the double-coating technique with a special spice blend.",
      recipe: "Marinate wings for 2 hours, coat with seasoned flour, air fry at 380°F for 25 minutes, flipping halfway through.",
      ingredients: ["Chicken wings", "Flour", "Paprika", "Garlic powder", "Salt", "Pepper", "Buttermilk"],
      cookingTime: 25,
      difficulty: "medium",
      isLiked: true,
      isPinned: true,
      tags: ["chicken", "crispy", "spicy"],
      location: "Nairobi"
    },
    {
      id: 2,
      challengeId: 1,
      campaign: "Air Fryer Challenge",
      title: "Golden Air Fryer Sweet Potato Fries",
      author: "Michael Ochieng",
      authorAvatar: require("@/assets/images/food-example.jpg"),
      authorBadge: "top_chef",
      submittedAt: "2024-12-14T15:45:00",
      votes: 2890,
      comments: 156,
      status: "approved",
      images: [
        require("@/assets/images/stir-fry-rice.jpg"),
        require("@/assets/images/herb-crusted-salmon.jpg")
      ],
      description: "Healthy and delicious alternative to regular fries! Perfectly seasoned with local spices.",
      cookingTime: 20,
      difficulty: "easy",
      isLiked: false,
      tags: ["healthy", "vegetarian", "sweet-potato"],
      location: "Kisumu"
    },
    {
      id: 3,
      challengeId: 1,
      campaign: "Air Fryer Challenge", 
      title: "Air Fryer Fish Fillets with Herbs",
      author: "Grace Wanjiku",
      authorAvatar: require("@/assets/images/food-example.jpg"),
      authorBadge: "rising_star",
      submittedAt: "2024-12-13T09:20:00",
      votes: 1567,
      comments: 89,
      status: "approved",
      images: [
        require("@/assets/images/tilapiacoconut.jpg"),
        require("@/assets/images/herb-crusted-salmon.jpg")
      ],
      description: "Fresh tilapia fillets seasoned with local herbs and spices. Light, healthy, and full of flavor!",
      cookingTime: 15,
      difficulty: "easy",
      isLiked: true,
      tags: ["fish", "healthy", "herbs"],
      location: "Mombasa"
    },
    {
      id: 4,
      challengeId: 1,
      campaign: "Air Fryer Challenge",
      title: "Air Fryer Samosas", 
      author: "Raj Patel",
      authorAvatar: require("@/assets/images/food-example.jpg"),
      submittedAt: "2024-12-12T18:10:00",
      votes: 2145,
      comments: 178,
      status: "approved", 
      images: [
        require("@/assets/images/samosas.jpg"),
        require("@/assets/images/mandazi.jpg"),
        require("@/assets/images/mahamri.jpg")
      ],
      description: "Traditional samosas made healthier in the air fryer! Crispy exterior with spiced vegetable filling.",
      cookingTime: 18,
      difficulty: "medium",
      isLiked: false,
      tags: ["vegetarian", "traditional", "spicy"],
      location: "Nairobi"
    },
    {
      id: 5,
      challengeId: 1,
      campaign: "Air Fryer Challenge",
      title: "Air Fryer Nyama Choma",
      author: "David Kiplagat",
      authorAvatar: require("@/assets/images/food-example.jpg"),
      submittedAt: "2024-12-11T14:25:00",
      votes: 4123,
      comments: 298,
      status: "approved",
      images: [
        require("@/assets/images/ugalisukumabeef.jpeg"),
        require("@/assets/images/githeri.jpg")
      ],
      description: "Classic Kenyan grilled meat made in the air fryer! Perfectly seasoned and incredibly tender.",
      cookingTime: 30,
      difficulty: "medium",
      isLiked: true,
      isPinned: true,
      tags: ["meat", "traditional", "kenyan"],
      location: "Eldoret"
    }
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
