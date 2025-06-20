// Get invite code from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const inviteCode = urlParams.get('code');

if (!inviteCode) {
    showError('Invalid invitation link');
} else {
    // Simulate loading bet data (in real implementation, this would fetch from Firebase)
    // For now, we'll use placeholder data
    setTimeout(() => {
        loadBetData();
    }, 500);
}

function loadBetData() {
    // In a real implementation, you would fetch bet data from Firebase
    // using the invite code. For now, we'll use placeholder data.
    
    // Example bet data structure
    const betData = {
        challengeText: "Exercise for 30 minutes every day",
        frequency: "Daily",
        duration: "2 weeks",
        category: "Fitness",
        rewardCount: 3,
        expiryTime: "48 hours"
    };

    // Update UI with bet data
    document.getElementById('challengeText').textContent = betData.challengeText;
    document.getElementById('frequency').textContent = betData.frequency;
    document.getElementById('duration').textContent = betData.duration;
    document.getElementById('category').textContent = betData.category;
    document.getElementById('rewardCount').textContent = `${betData.rewardCount} rewards`;
    document.getElementById('expiryTime').textContent = betData.expiryTime;
}

function joinBet() {
    const button = document.getElementById('joinButton');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');

    // Hide any previous error
    error.style.display = 'none';

    // Show loading state
    button.style.display = 'none';
    loading.style.display = 'block';

    // Try to open the BetPot app with the invite code
    const appUrl = `betpot://join?code=${inviteCode}`;
    const fallbackUrl = `https://betpot.app/join?code=${inviteCode}`;

    // Try to open the app
    window.location.href = appUrl;

    // If the app doesn't open within 2 seconds, show instructions
    setTimeout(() => {
        loading.style.display = 'none';
        button.style.display = 'flex';
        
        // Check if we're still on the same page (app didn't open)
        if (document.visibilityState !== 'hidden') {
            showError('BetPot app not found. Please install the app first.');
        }
    }, 2000);
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
}

// Handle page visibility changes (when app opens)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // App opened successfully
        console.log('BetPot app opened');
    }
});

// Add some basic analytics (optional)
function trackEvent(eventName, parameters = {}) {
    // In a real implementation, you might want to send analytics
    // to Google Analytics, Firebase Analytics, or similar
    console.log('Analytics Event:', eventName, parameters);
}

// Track page view
trackEvent('invite_page_view', { inviteCode });

// Track button clicks
document.getElementById('joinButton').addEventListener('click', () => {
    trackEvent('join_button_click', { inviteCode });
}); 