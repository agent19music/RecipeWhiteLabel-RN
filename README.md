<div align="center">
  <img src="https://pub-c6a134c8e1fd4881a475bf80bc0717ba.r2.dev/Untitled%20design.jpg" alt="Kitchen Assistant App Preview" width="100%" />
  
  # 🍳 Kitchen Assistant - White Label Recipe App
  
  **Transform Your Cooking Experience with AI-Powered Recipe Discovery**
  
  [![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
  
  <p align="center">
    <strong>Currently themed for Royco</strong> • Fully customizable white-label solution
  </p>
</div>

---

## ✨ Features

### 🤖 **AI-Powered Recipe Generation**
- **Smart Camera Detection**: Point your camera at ingredients and get instant recipe suggestions
- **Manual Input Mode**: Type or speak your available ingredients
- **Personalized Recommendations**: AI learns your preferences and dietary restrictions
- **East African Cuisine Focus**: Specialized in regional flavors and cooking techniques

### 🎨 **Beautiful Modern Design**
- **Glassmorphism UI**: Stunning blur effects and transparency
- **Dark/Light Mode**: Automatic theme detection with manual override
- **Haptic Feedback**: Tactile responses for enhanced user experience
- **Smooth Animations**: Powered by React Native Reanimated

### 👥 **Community & Social**
- **Recipe Sharing**: Share your culinary creations with the community
- **Challenges**: Participate in cooking challenges and competitions
- **Recipe Discovery**: Explore trending recipes and hidden gems
- **User Ratings**: Rate and review community recipes

### 📅 **Smart Meal Planning**
- **Weekly Planner**: Organize your meals for the entire week
- **Shopping Lists**: Auto-generated grocery lists from meal plans
- **Nutritional Tracking**: Monitor calories, macros, and nutritional values
- **Budget Management**: Track spending and optimize grocery costs

### 🥘 **Intelligent Pantry Management**
- **Inventory Tracking**: Keep track of what's in your kitchen
- **Expiration Alerts**: Never waste food with smart reminders
- **Smart Shopping**: Get notified when staples are running low
- **Recipe Matching**: Find recipes based on available ingredients

### 👨‍🍳 **Cooking Assistant**
- **Step-by-Step Guidance**: Interactive cooking instructions with timers
- **Voice Control**: Hands-free navigation while cooking
- **Video Tutorials**: Visual guides for complex techniques
- **Temperature & Timing Alerts**: Never overcook or undercook again

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- OpenAI API Key for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kitchen-assistant.git
cd kitchen-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your EXPO_PUBLIC_OPENAI_API_KEY to .env

# Start the development server
npm start
```

### Running on Different Platforms

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🏗️ Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── ai/                # AI-powered features
│   ├── community/         # Social features
│   ├── cook/              # Cooking mode
│   ├── onboarding/        # User onboarding flow
│   ├── recipe/            # Recipe details
│   └── profile/           # User profile
├── components/            # Reusable UI components
│   ├── CookingStepper.tsx
│   ├── RecipeCard.tsx
│   └── ...
├── context/              # State management
│   └── AppState.tsx      # Global app state
├── data/                 # Data models and types
│   ├── types.ts         # TypeScript definitions
│   └── recipes.ts       # Recipe database
├── theme/               # Design system
│   └── index.ts        # Theme configuration
└── utils/              # Helper functions
    ├── ai.ts          # OpenAI integration
    └── analytics.ts   # User analytics
```

## 🎨 White Label Customization

This app is designed as a white-label solution, making it easy to rebrand for different clients:

### Branding Options
- **Logo & Icons**: Replace assets in `/assets/images/`
- **Color Scheme**: Modify theme in `/theme/index.ts`
- **App Name**: Update in `app.json`
- **Splash Screen**: Configure in `app.json` plugins section
- **Content Focus**: Adjust cuisine types and recipe database

### Current Theme: Royco
- Primary Color: `#DC143C` (Crimson Red)
- Focus: East African cuisine
- Special Features: Regional spice recommendations

## 🛠️ Tech Stack

- **Frontend Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **AI Integration**: OpenAI GPT-4 Vision
- **Animations**: React Native Reanimated
- **UI Components**: Custom component library with glassmorphism design

## 📱 Key Screens

### Home Dashboard
- Personalized recipe recommendations
- Quick access to AI features
- Daily cooking challenges
- Trending recipes

### AI Kitchen Assistant
- Camera-based ingredient detection
- Voice input for hands-free operation
- Smart recipe generation
- Dietary preference filtering

### Community Hub
- Browse community recipes
- Share your creations
- Join cooking challenges
- Follow favorite chefs

### Smart Pantry
- Visual inventory management
- Expiration tracking
- Shopping list generation
- Waste reduction tips

### Meal Planner
- Drag-and-drop weekly planning
- Nutritional goal tracking
- Budget management
- Family meal coordination

## 🔧 Configuration

### Environment Variables

```env
# AI Configuration
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Analytics (optional)
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id

# API Endpoints (if using backend)
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

### App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- Splash screen
- App icons
- Color schemes

## 📊 Features Roadmap

- [x] AI Recipe Generation
- [x] Community Features
- [x] Meal Planning
- [x] Pantry Management
- [x] Dark Mode Support
- [ ] Offline Mode
- [ ] Multi-language Support
- [ ] Recipe Video Creation
- [ ] Grocery Store Integration
- [ ] Smart Home Device Integration
- [ ] Nutritionist Consultations
- [ ] Restaurant Recommendations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- AI powered by [OpenAI](https://openai.com/)
- Icons from [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
- Animations by [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 📞 Support

For support, email support@kitchenassistant.app or join our [Discord community](https://discord.gg/kitchenassistant).

---

<div align="center">
  <p>
    <strong>Built with ❤️ for food lovers everywhere</strong>
  </p>
  <p>
    <a href="https://github.com/yourusername/kitchen-assistant">GitHub</a> •
    <a href="https://kitchenassistant.app">Website</a> •
    <a href="https://docs.kitchenassistant.app">Documentation</a>
  </p>
</div>
