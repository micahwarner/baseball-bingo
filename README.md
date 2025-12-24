# Baseball Bingo

A fun and interactive Progressive Web App (PWA) for baseball fans to play bingo while watching games at the stadium! Mark squares as you see events happen during the game, and try to get five in a row to win!

Perfect for enhancing your stadium experience, Baseball Bingo turns watching baseball into an engaging game where you track real-time events like home runs, strikeouts, stolen bases, and more.

## Features

**Core Gameplay**
- Interactive 5x5 bingo cards with 24 unique baseball events plus a free center square
- Automatic win detection for rows, columns, diagonals, and blackouts
- Real-time progress tracking with visual progress bar
- Built-in game timer/stopwatch

**Statistics & Analytics**
- Track games played, wins, win rate, and streaks
- Win type analysis showing your most common win patterns
- Time analytics with average win times and fastest bingo records
- Visual charts showing game history and performance
- Export/import statistics

**User Experience**
- Dark mode with smooth theme transitions
- Optional sound effects with volume control
- Toast notifications for user feedback
- Confetti animations for wins (optional)
- Win animations highlighting winning squares
- Accessibility options: reduced motion and high contrast modes

**Sharing & Social**
- Share cards or win screenshots as images
- Web Share API for native sharing on mobile devices
- Social media integration (Twitter, Facebook)
- Shareable URLs with encoded card data
- Export/import settings

**Progressive Web App**
- Installable on mobile and desktop
- Offline support with service worker caching
- App-like full-screen experience
- Fast loading with optimized assets
- Auto-updates in the background

**Reliability**
- Graceful error handling with user-friendly messages
- Persistent game state and statistics in local storage
- Features degrade gracefully when APIs aren't available
- Automatically ends inactive games after 30 minutes

## How to Play

1. Start a New Game: Click "New Card" to generate a unique bingo card
2. Watch the Game: As you watch the baseball game, look for events on your card
3. Mark Squares: Tap or click a square when you see that event happen
4. Win Conditions:
   - Bingo: Get 5 squares in a row (horizontal, vertical, or diagonal)
   - Blackout: Mark all 25 squares for the ultimate achievement!
5. Free Space: The center square is automatically marked as "FREE SPACE"
6. Track Progress: Watch your progress bar and timer as you play
7. Share Your Win: Share your card or win screenshot with friends!

### Win Types

- Horizontal: 5 squares in any row
- Vertical: 5 squares in any column
- Diagonal: 5 squares diagonally (top-left to bottom-right or top-right to bottom-left)
- Blackout: All 25 squares marked

## PWA Features

### Installation

**Mobile (iOS/Android):**
1. Open the app in your browser
2. Tap the share button
3. Select "Add to Home Screen"
4. The app icon will appear on your home screen

**Desktop (Chrome/Edge):**
1. Click the install icon in the address bar
2. Or go to Settings → Install Baseball Bingo

### Offline Support

Once installed, the app works offline:
- All static assets are cached
- Service worker handles offline requests
- Game state persists in local storage

### App Experience

- Standalone mode opens without browser UI
- Full-screen immersive experience
- Fast loading with optimized assets
- Service worker updates automatically in background

## Browser Support

- Chrome/Edge: 90+ (Full support)
- Firefox: 88+ (Full support)
- Safari: 14+ (Full support, iOS 14.5+)
- Opera: 76+ (Full support)
- Internet Explorer: Not supported

### Feature Support

- Web Share API: iOS Safari 12.1+, Chrome Android 61+
- Service Workers: All modern browsers
- LocalStorage: All browsers
- Clipboard API: Modern browsers (fallback available)

## Configuration

### Adding New Events

Edit `src/utils/bingoEvents.js` to add or modify baseball events:

```javascript
export const BINGO_EVENTS = [
  "Home Run",
  "Strikeout",
  "Your New Event",
  // ... existing events
];

export const EVENT_EMOJIS = {
  "Home Run": "⚾",
  "Strikeout": "❌",
  "Your New Event": "🎯",
  // ... existing emojis
};
```

### Customizing Colors

Edit `tailwind.config.js` to customize the baseball theme colors:

```javascript
colors: {
  'baseball-red': '#BA0C2F',
  'baseball-blue': '#002D72',
  'grass-green': '#228B22',
}
```

## Technology Stack

- React 19.1.1 - Modern UI library
- Vite 7.1.7 - Build tool and dev server
- Tailwind CSS 3.4 - Utility-first CSS framework
- Vite PWA Plugin - PWA support with Workbox
- html2canvas - Screenshot generation for sharing
- Recharts - Chart library for statistics

## Troubleshooting

**App doesn't work offline after installation**
- Clear browser cache and reinstall the PWA

**Service worker not updating**
- Unregister service worker in DevTools → Application → Service Workers

**Sharing doesn't work**
- Web Share API requires HTTPS (works automatically on Vercel)

## License

This project is open source and available under the MIT License.
