# BetPot Web Invitation Page

A beautiful, responsive web page for BetPot bet invitations. This page allows users to view bet details and join challenges directly through the BetPot app.

## Features

- 🎯 **Beautiful Design**: Modern, responsive design with gradient backgrounds
- 📱 **Mobile Optimized**: Works perfectly on mobile devices
- 🔗 **Deep Linking**: Automatically opens the BetPot app when available
- 📊 **Real Firebase Integration**: Fetches actual bet data from Firestore
- 🔒 **Secure**: Only shows data for valid, unexpired invite codes
- 🎨 **Customizable**: Easy to customize colors and styling

## Firebase Integration

This web page integrates with Firebase to fetch real bet data:

- **Firestore**: Reads bet and reward data using invite codes
- **Security Rules**: Public read access only for valid, unexpired invite codes
- **Real-time Data**: Shows actual challenge text, frequency, duration, and reward count
- **Expiry Handling**: Automatically checks if invite codes have expired

## Usage

The invitation page accepts an invite code as a URL parameter:

```
https://profiler666.github.io/betpot-web-invite/?code=HAPPY-PANDA-123
```

## Setup

### 1. GitHub Pages Setup

1. **Fork or clone this repository**
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

### 2. Firebase Configuration

The Firebase configuration is already set up for the BetPot project:
- **Project ID**: `betpot-81530`
- **API Key**: Configured in `index.html`
- **Security Rules**: Deployed to allow public read access for invite codes

### 3. Update Flutter App Configuration

Update your Flutter app configuration:
```dart
// lib/core/config/app_config.dart
static const String webInviteBaseUrl = String.fromEnvironment(
  'WEB_INVITE_BASE_URL',
  defaultValue: 'https://profiler666.github.io/betpot-web-invite',
);
```

## Security

The web page implements several security measures:

1. **Invite Code Validation**: Only shows data for valid invite codes
2. **Expiry Checking**: Automatically checks if invite codes have expired
3. **Join Status**: Prevents access to already joined bets
4. **Firestore Rules**: Server-side validation of access permissions

## Data Flow

1. **User visits invitation link** with invite code
2. **Web page queries Firestore** for bet with that invite code
3. **Security rules validate** the request (valid code, not expired, not joined)
4. **Page displays bet details** (challenge, frequency, duration, rewards)
5. **User clicks "Join"** to open the BetPot app
6. **App handles joining** through the existing join flow

## Customization

### Colors
Edit `styles.css` to change the color scheme:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Primary color for accents */
color: #667eea;
```

### Firebase Configuration
If you need to change the Firebase project, update the configuration in `index.html`:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    // ... other config
};
```

## Development

To test locally:
1. Open `index.html` in a web browser
2. Add `?code=TEST-CODE-123` to the URL to simulate an invite
3. Check browser console for Firebase connection status

## Analytics

The page includes basic analytics tracking:
- Page views with invite code and bet details
- Join button clicks
- Error tracking
- App opening detection

## License

MIT License - feel free to use and modify as needed. 