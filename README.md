# BetPot Web Invitation Page

A beautiful, responsive web page for BetPot bet invitations. This page allows users to view bet details and join challenges directly through the BetPot app.

## Features

- 🎯 **Beautiful Design**: Modern, responsive design with gradient backgrounds
- 📱 **Mobile Optimized**: Works perfectly on mobile devices
- 🔗 **Deep Linking**: Automatically opens the BetPot app when available
- 📊 **Analytics Ready**: Built-in analytics tracking
- 🎨 **Customizable**: Easy to customize colors and styling

## Usage

The invitation page accepts an invite code as a URL parameter:

```
https://yourusername.github.io/betpot-web-invite/?code=HAPPY-PANDA-123
```

## Setup

1. **Fork or clone this repository**
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Update the app configuration** in your Flutter app:
   ```dart
   // lib/core/config/app_config.dart
   static const String webInviteBaseUrl = String.fromEnvironment(
     'WEB_INVITE_BASE_URL',
     defaultValue: 'https://yourusername.github.io/betpot-web-invite',
   );
   ```

## Customization

### Colors
Edit `styles.css` to change the color scheme:
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Primary color for accents */
color: #667eea;
```

### Content
Modify `script.js` to change the placeholder bet data or add real Firebase integration.

## Development

To test locally:
1. Open `index.html` in a web browser
2. Add `?code=TEST-CODE-123` to the URL to simulate an invite

## License

MIT License - feel free to use and modify as needed. 