// Get invite code from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const inviteCode = urlParams.get('code');

console.log('🔍 Debug: Invite code from URL:', inviteCode);

// Store invite code globally for delayed loading
window.inviteCode = inviteCode;

if (!inviteCode) {
    showError('Invalid invitation link');
} else {
    // Check if Firebase is already ready
    if (window.firebaseReady) {
        console.log('🚀 Firebase ready, starting data load for invite code:', inviteCode);
        loadBetDataFromFirebase(inviteCode);
    } else {
        console.log('⏳ Firebase not ready yet, waiting...');
        // Wait for Firebase to be ready
        waitForFirebase();
    }
}

function waitForFirebase() {
    const checkInterval = setInterval(() => {
        if (window.firebaseReady) {
            console.log('✅ Firebase is now ready, starting data load');
            clearInterval(checkInterval);
            loadBetDataFromFirebase(window.inviteCode);
        }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.firebaseReady) {
            console.error('❌ Firebase failed to initialize within 10 seconds');
            showError('Failed to connect to database. Please try again.');
        }
    }, 10000);
}

async function loadBetDataFromFirebase(inviteCode) {
    try {
        console.log('📡 Connecting to Firebase...');
        showLoading(true);
        
        // Check if Firebase is available
        if (!window.firebaseDb) {
            throw new Error('Firebase not initialized');
        }
        
        console.log('🔍 Querying Firestore for invite code:', inviteCode);
        
        // Query Firestore for the bet with this invite code
        const betsRef = window.firebaseDb.collection('bets');
        const q = betsRef.where('inviteCode', '==', inviteCode);
        const querySnapshot = await q.get();
        
        console.log('📊 Query result:', querySnapshot.size, 'bets found');
        
        if (querySnapshot.empty) {
            console.log('❌ No bet found with invite code:', inviteCode);
            showError('Bet not found or invite code has expired');
            return;
        }
        
        const betDoc = querySnapshot.docs[0];
        const betData = betDoc.data();
        
        console.log('📋 Bet data retrieved:', betData);
        
        // Check if invite code has expired
        if (betData.inviteCodeExpiry) {
            const expiryDate = betData.inviteCodeExpiry.toDate();
            const now = new Date();
            
            console.log('⏰ Expiry check:', { expiryDate, now, isExpired: now > expiryDate });
            
            if (now > expiryDate) {
                showError('This invitation has expired');
                return;
            }
        }
        
        // Check if bet is already joined
        if (betData.isJoined) {
            console.log('❌ Bet already joined');
            showError('This bet has already been joined');
            return;
        }
        
        console.log('🎁 Getting reward count...');
        
        // Get reward count
        const rewardsRef = window.firebaseDb.collection('rewards');
        const rewardsQuery = rewardsRef.where('betId', '==', betDoc.id);
        const rewardsSnapshot = await rewardsQuery.get();
        const rewardCount = rewardsSnapshot.size;
        
        console.log('🎁 Reward count:', rewardCount);
        
        // Format the data for display
        const displayData = {
            challengeText: betData.challengeText,
            frequency: betData.frequency === 'daily' ? 'Daily' : 'Weekly',
            duration: `${betData.durationInWeeks} ${betData.durationInWeeks === 1 ? 'week' : 'weeks'}`,
            category: formatCategory(betData.category),
            rewardCount: rewardCount,
            expiryTime: formatExpiryTime(betData.inviteCodeExpiry),
            creatorId: betData.creatorId,
            betId: betDoc.id
        };
        
        console.log('🎨 Formatted display data:', displayData);
        
        // Update UI with real bet data
        updateUI(displayData);
        
        console.log('✅ UI updated successfully');
        
        // Track successful page view
        trackEvent('invite_page_view', { 
            inviteCode,
            betId: betDoc.id,
            category: betData.category,
            frequency: betData.frequency
        });
        
    } catch (error) {
        console.error('❌ Error loading bet data:', error);
        console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        showError(`Failed to load bet information: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

function formatCategory(category) {
    const categories = {
        'fitness': 'Fitness',
        'health': 'Health',
        'learning': 'Learning',
        'productivity': 'Productivity',
        'social': 'Social',
        'creativity': 'Creativity',
        'finance': 'Finance',
        'other': 'Other'
    };
    return categories[category] || 'Other';
}

function formatExpiryTime(expiryDate) {
    if (!expiryDate) return '48 hours';
    
    const expiry = expiryDate.toDate();
    const now = new Date();
    const diffMs = expiry - now;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Expired';
    if (diffHours < 24) return `${diffHours} hours`;
    if (diffHours < 48) return `${Math.ceil(diffHours / 24)} day`;
    return `${Math.ceil(diffHours / 24)} days`;
}

function updateUI(betData) {
    document.getElementById('challengeText').textContent = betData.challengeText;
    document.getElementById('frequency').textContent = betData.frequency;
    document.getElementById('duration').textContent = betData.duration;
    document.getElementById('category').textContent = betData.category;
    document.getElementById('rewardCount').textContent = `${betData.rewardCount} ${betData.rewardCount === 1 ? 'reward' : 'rewards'}`;
    document.getElementById('expiryTime').textContent = betData.expiryTime;
    
    // Store bet data for join function
    window.currentBetData = betData;
}

function showLoading(show) {
    const button = document.getElementById('joinButton');
    const loading = document.getElementById('loading');
    
    if (show) {
        button.style.display = 'none';
        loading.style.display = 'block';
    } else {
        button.style.display = 'flex';
        loading.style.display = 'none';
    }
}

function joinBet() {
    if (!window.currentBetData) {
        showError('Bet data not loaded');
        return;
    }
    
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

    // Track join attempt
    trackEvent('join_button_click', { 
        inviteCode,
        betId: window.currentBetData.betId,
        category: window.currentBetData.category,
        frequency: window.currentBetData.frequency
    });

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
    
    // Track error
    trackEvent('invite_page_error', { 
        inviteCode,
        error: message 
    });
}

// Handle page visibility changes (when app opens)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // App opened successfully
        console.log('BetPot app opened');
        trackEvent('app_opened', { inviteCode });
    }
});

// Analytics tracking function
function trackEvent(eventName, parameters = {}) {
    // In a real implementation, you might want to send analytics
    // to Google Analytics, Firebase Analytics, or similar
    console.log('Analytics Event:', eventName, parameters);
    
    // You can also send to Firebase Analytics if configured
    if (window.gtag) {
        window.gtag('event', eventName, parameters);
    }
} 