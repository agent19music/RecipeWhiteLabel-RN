# Community Recipes Feature

This feature adds support for community-generated recipes from popular Kenyan TikTok creators to your Royco Recipe app.

## What's Included

### 📂 New Files Created

1. **`/data/community-recipes.ts`** - Contains 7 viral recipes from Kenyan TikTok creators:
   - Ombachi's Famous Kenyan Pilau (Roaming Chef)
   - Chef Kaluhi's Crispy Samosas
   - Mama Caro's Ugali Perfection
   - Chef Njugz's Loaded Nyama Choma
   - Zawadi's Fusion Chapati Wraps
   - KitchenBae's Viral Mukimo
   - Chef Mwangi's Perfect Githeri

2. **`/components/CommunityRecipeCard.tsx`** - Beautiful card component for displaying community recipes with:
   - Creator information and social media handles
   - Video play button for TikTok integration
   - Engagement stats (likes, ratings, saves)
   - Viral badges for popular recipes
   - Share functionality

3. **`/components/CommunityRecipesScreen.tsx`** - Main screen component featuring:
   - Search and filtering capabilities
   - Horizontal scrolling recipe cards
   - Statistics display
   - Creator profile links

### 🔧 Updated Files

1. **`/data/types.ts`** - Extended Recipe interface to include:
   - `videoUrl`: Link to TikTok video
   - `socialMedia`: Platform, handle, and follower information

2. **`/app/community/index.tsx`** - Updated to use the new CommunityRecipesScreen

3. **`/app/(tabs)/pantry/enhanced.tsx`** - Added TikTok Recipes card to promote community content

## 🎨 Design Features

- **Matches your existing design language** using your Colors constants
- **TikTok-inspired UI** with music note icons and video preview
- **Smooth animations** with haptic feedback
- **Responsive horizontal scrolling** with snap-to-interval
- **Viral badges** for popular recipes (5K+ favorites)
- **Creator avatars** and social media integration
- **Video modal** with placeholder for TikTok embed

## 🚀 Next Steps

### Adding Video Assets
1. Replace placeholder image paths with actual recipe photos
2. Add TikTok video URLs to each recipe's `videoUrl` field
3. Implement actual TikTok embed component (currently shows placeholder)

### Example of adding real video:
```typescript
{
  id: 'community-001',
  title: 'Ombachi\'s Famous Kenyan Pilau',
  videoUrl: 'https://www.tiktok.com/@roamingchef/video/actual-video-id',
  socialMedia: {
    platform: 'TikTok',
    handle: '@roamingchef',
    followers: '2.3M',
    videoId: 'actual-video-id',
    embedUrl: 'https://www.tiktok.com/embed/actual-video-id',
  },
  // ... rest of recipe
}
```

### Adding Photo Assets
1. Add photos to `/assets/images/community/` folder
2. Update image paths in community-recipes.ts:
```typescript
image: require('@/assets/images/community/ombachi-pilau.jpg'),
images: [
  require('@/assets/images/community/ombachi-pilau-1.jpg'),
  require('@/assets/images/community/ombachi-pilau-2.jpg'),
]
```

### TikTok Integration
For full TikTok video embedding, you can:
1. Use TikTok's official embed API
2. Implement WebView for TikTok videos
3. Use react-native-tiktok-embed (if available)
4. Link to TikTok app/web (currently implemented)

## 📱 Navigation

- Access via Community tab: `/community`
- Direct access from Pantry screen via "TikTok Recipes" card
- Individual recipe views: `/recipe/[id]`

## 🎯 Key Features

- **Search**: Find recipes by name, creator, or tags
- **Filter**: All, Viral, Recent, Favorites
- **Share**: Share recipes with friends
- **Save**: Bookmark favorite recipes
- **Creator Profiles**: Link to TikTok profiles
- **Analytics**: Track user engagement

## 🔧 Technical Details

- Uses existing Recipe interface with extensions
- Follows your app's color scheme and design patterns
- Implements proper TypeScript typing
- Includes analytics tracking
- Responsive design for all screen sizes
- Smooth animations with Expo Haptics

The feature is ready to use! Just add your video and image assets to complete the integration.
