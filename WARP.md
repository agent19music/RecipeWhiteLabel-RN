# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

RecipeWhiteLabel-RN is a React Native Expo application focused on recipe management and AI-powered cooking assistance. The app provides intelligent recipe generation from ingredients using computer vision and OpenAI's GPT models, with a focus on East African cuisine and cooking experiences.

## Essential Commands

### Development Workflow
```bash
# Install dependencies
npm install

# Start development server
npx expo start
# or
npm start

# Platform-specific development
npm run android    # Launch on Android emulator/device
npm run ios        # Launch on iOS simulator/device  
npm run web        # Launch web version

# Code quality
npm run lint       # Run ESLint with Expo config
```

### Project Reset (if needed)
```bash
npm run reset-project    # Moves current app to app-example and creates fresh starter
```

### Development Server Options
When running `npx expo start`, you'll have options to:
- Press `i` for iOS simulator
- Press `a` for Android emulator  
- Press `w` for web browser
- Press `r` to reload
- Press `m` to toggle menu

## Architecture Overview

### Core Structure
- **File-based Routing**: Uses Expo Router with `/app` directory for all screens
- **Context Management**: Central app state via `AppStateProvider` for user preferences and onboarding
- **Theme System**: Custom theme provider with light/dark mode support and glassmorphism design
- **AI Integration**: OpenAI-powered ingredient detection and recipe generation with local caching
- **TypeScript**: Comprehensive type definitions for recipes, nutrition, and user preferences

### Key Directories

#### `/app` - Screen Components (Expo Router)
- `_layout.tsx` - Root layout with providers and navigation setup
- `(tabs)/` - Main tab navigation (Home, Pantry, Community)
- `onboarding/` - Multi-step user onboarding flow
- `ai/` - AI-powered features (camera, manual input, recipe generation)
- `cook/[id].tsx` - Dynamic cooking interface with step-by-step guidance
- `recipe/[id].tsx` - Detailed recipe view

#### `/components` - Reusable UI Components
- Modern component library with glassmorphism design
- Recipe-specific components (`RecipeCard`, `ChallengeCard`, `IngredientRow`)
- Interactive elements (`ModernButton`, `CookingStepper`, `ProgressDots`)
- Animation components (`CookingAnimations`, `HapticTab`)

#### `/context` - State Management
- `AppState.tsx` - Global app state including user preferences and onboarding status

#### `/data` - Data Layer
- `types.ts` - Comprehensive TypeScript definitions for recipes, nutrition, ingredients
- `enhanced-recipes.ts` - Curated recipe database with rich metadata
- `recipes.ts` - Legacy recipe data and compatibility functions

#### `/utils` - Business Logic
- `ai.ts` - OpenAI integration for vision analysis and recipe generation
- `analytics.ts` - User analytics tracking
- `fakeCamera.ts` - Development utilities

#### `/theme` - Design System
- Centralized theme with design tokens for spacing, colors, typography
- Glassmorphism design system with blur effects and opacity variations
- Dark/light mode support

### Data Flow Architecture

1. **Recipe Management**: Recipes support both curated content and AI-generated content with comprehensive metadata
2. **AI Integration**: Camera-based ingredient detection → OpenAI vision analysis → Recipe generation with caching
3. **User Preferences**: Dietary restrictions, allergies, cooking goals stored in AsyncStorage
4. **Theme System**: Automatic dark/light mode detection with manual override capability

### Key Features

#### AI-Powered Recipe Generation
- Computer vision for ingredient detection from photos
- Natural language recipe generation with East African cuisine focus
- Local caching system to reduce API calls and costs
- Support for dietary restrictions and cooking preferences

#### Enhanced Recipe Data Model
- Multi-format ingredient support (legacy + enhanced)
- Detailed cooking steps with timing and temperature guidance
- Comprehensive nutrition information
- Rating and social features
- AI-generated vs curated content tracking

#### Modern UI/UX
- Glassmorphism design with blur effects and transparency
- Haptic feedback integration
- Smooth animations with React Native Reanimated
- Responsive design for multiple screen sizes

## Development Patterns

### TypeScript Usage
- Comprehensive type safety with strict mode enabled
- Complex union types for recipe variations and user preferences  
- Generic interfaces for flexible data structures

### Component Architecture
- Function components with hooks
- Custom theme hook integration: `const { palette } = useTheme()`
- Accessibility-first approach with proper ARIA labels

### State Management
- Context API for global state (user prefs, onboarding)
- AsyncStorage for persistence
- Local component state for UI interactions

### AI Integration Patterns
- Retry logic with exponential backoff for API calls
- Comprehensive error handling and fallback responses
- Caching strategy to minimize costs and improve performance
- Environment variable configuration for API keys

## Configuration Notes

### Environment Variables
- `EXPO_PUBLIC_OPENAI_API_KEY` - Required for AI features
- Set up in `.env` file (not committed to version control)

### Platform-Specific Features
- Camera integration with `expo-camera`
- File system access with proper web/mobile handling
- Haptic feedback on supported platforms

### VSCode Integration
- Auto-fix on save enabled
- Import organization and member sorting
- ESLint integration with Expo configuration

### Expo Configuration
- New Architecture enabled (`newArchEnabled: true`)
- Edge-to-edge Android support
- Typed routes enabled for better DX
- Custom splash screen with brand colors

This is an Expo/React Native project with advanced AI integration, so development should follow React Native best practices while leveraging Expo's managed workflow benefits.
