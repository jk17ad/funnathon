// Global variables
let bladderChart, timelineChart, intakeChart, holdTimeChart;
let soundEnabled = true;
let intakeHistory = [];
let userProfile = {
    height: 170,
    weight: 70,
    age: 30
};
let selectedDrinkType = 'water';
let autoSubmitInterval;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    loadIntakeHistory();
    initializeEventListeners();
    initializeCharts();
    updateCalculations();
    updateInsights();
    checkAchievements();
    createFloatingParticles();
    startAutoSubmit();
});

// Start auto-submit interval
function startAutoSubmit() {
    // Auto-submit every 5 minutes
    autoSubmitInterval = setInterval(() => {
        if (intakeHistory.length > 0) {
            autoSubmitData();
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// Auto-submit data without user interaction
function autoSubmitData() {
    const submissionData = {
        userProfile: userProfile,
        intakeHistory: intakeHistory,
        timestamp: new Date().toISOString(),
        totalIntake: intakeHistory.reduce((sum, entry) => sum + entry.amount, 0),
        autoSubmitted: true
    };
    
    localStorage.setItem('peeSubmission', JSON.stringify(submissionData));
    
    // Play subtle auto-submit sound
    if (soundEnabled) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.05;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    // Show subtle notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #8bc34a);
        color: white;
        padding: 10px 20px;
        border-radius: 10px;
        font-family: 'Fredoka', sans-serif;
        font-size: 0.9rem;
        z-index: 1000;
        animation: slideInRight 0.5s ease;
    `;
    notification.textContent = '💾 Auto-saved!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Create floating particles in background
function createFloatingParticles() {
    const colors = ['#4fc3f7', '#667eea', '#764ba2', '#f093fb', '#ffeaa7'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            opacity: 0.3;
            animation: floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.appendChild(particle);
    }
}

// Load user profile from local storage
function loadUserProfile() {
    const saved = localStorage.getItem('peeUserProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
        document.getElementById('height').value = userProfile.height;
        document.getElementById('weight').value = userProfile.weight;
        document.getElementById('age').value = userProfile.age;
        updateDisplayValues();
    }
}

// Save user profile to local storage
function saveUserProfile() {
    userProfile.height = parseInt(document.getElementById('height').value);
    userProfile.weight = parseInt(document.getElementById('weight').value);
    userProfile.age = parseInt(document.getElementById('age').value);
    localStorage.setItem('peeUserProfile', JSON.stringify(userProfile));
}

// Load intake history from local storage
function loadIntakeHistory() {
    const saved = localStorage.getItem('peeIntakeHistory');
    if (saved) {
        const data = JSON.parse(saved);
        // Only load today's entries
        const today = new Date().toDateString();
        intakeHistory = data.filter(entry => new Date(entry.timestamp).toDateString() === today);
    }
}

// Save intake history to local storage
function saveIntakeHistory() {
    localStorage.setItem('peeIntakeHistory', JSON.stringify(intakeHistory));
}

// Initialize event listeners
function initializeEventListeners() {
    // Range inputs
    document.getElementById('waterAmount').addEventListener('input', function() {
        document.getElementById('waterAmountDisplay').textContent = this.value + ' mL';
        updateCalculations();
        if (Math.random() > 0.7) {
            const randomSound = ['boing', 'toot', 'slurp'][Math.floor(Math.random() * 3)];
            playSound(randomSound);
        }
    });

    document.getElementById('height').addEventListener('input', function() {
        document.getElementById('heightDisplay').textContent = this.value + ' cm';
        updateCalculations();
        saveUserProfile();
        if (Math.random() > 0.7) {
            playSound('boing');
        }
    });

    document.getElementById('weight').addEventListener('input', function() {
        document.getElementById('weightDisplay').textContent = this.value + ' kg';
        updateCalculations();
        updateInsights();
        saveUserProfile();
        if (Math.random() > 0.7) {
            playSound('toot');
        }
    });

    document.getElementById('age').addEventListener('input', function() {
        document.getElementById('ageDisplay').textContent = this.value + ' years';
        updateCalculations();
        saveUserProfile();
        if (Math.random() > 0.7) {
            playSound('slurp');
        }
    });

    // Temperature buttons
    document.querySelectorAll('.temp-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.temp-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const tempSounds = ['boing', 'toot', 'slurp'];
            playSound(tempSounds[Math.floor(Math.random() * tempSounds.length)]);
            updateCalculations();
        });
    });

    // Drink type buttons
    document.querySelectorAll('.drink-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.drink-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedDrinkType = this.dataset.type;
            const drinkSounds = ['slurp', 'boing', 'toot'];
            playSound(drinkSounds[Math.floor(Math.random() * drinkSounds.length)]);
            updateCalculations();
        });
    });

    // Hydration status
    document.getElementById('hydrationStatus').addEventListener('change', function() {
        updateCalculations();
        playSound('click');
    });

    // Add log button
    document.getElementById('addLogBtn').addEventListener('click', addToIntakeLog);

    // Submit button
    document.getElementById('submitBtn').addEventListener('click', submitData);

    // Sound toggle
    document.getElementById('soundToggle').addEventListener('click', toggleSound);
}

// Update display values
function updateDisplayValues() {
    document.getElementById('heightDisplay').textContent = userProfile.height + ' cm';
    document.getElementById('weightDisplay').textContent = userProfile.weight + ' kg';
    document.getElementById('ageDisplay').textContent = userProfile.age + ' years';
}

// Toggle sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.textContent = soundEnabled ? '🔊 Sound Effects: ON' : '🔇 Sound Effects: OFF';
}

// Play sound effect
function playSound(type) {
    if (!soundEnabled) return;
    
    // Create audio context for simple beep sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
        // Happy ascending arpeggio
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'warning') {
        // Warning low tone
        oscillator.frequency.value = 261.63; // C4
        gainNode.gain.value = 0.12;
        oscillator.type = 'sawtooth';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'info') {
        // Soft informative tone
        oscillator.frequency.value = 392.00; // G4
        gainNode.gain.value = 0.1;
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === 'click') {
        // Quick click sound
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.05;
        oscillator.type = 'square';
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
    } else if (type === 'water') {
        // Water-like bubbling sound
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.1;
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'achievement') {
        // Celebration sound
        oscillator.frequency.value = 523.25;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
        oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === 'slurp') {
        // Funny slurp sound
        oscillator.frequency.value = 150;
        gainNode.gain.value = 0.12;
        oscillator.type = 'sawtooth';
        oscillator.start();
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.3);
        oscillator.stop(audioContext.currentTime + 0.4);
    } else if (type === 'boing') {
        // Funny boing sound
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
        oscillator.type = 'sine';
        oscillator.start();
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(350, audioContext.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'toot') {
        // Funny toot sound
        oscillator.frequency.value = 150;
        gainNode.gain.value = 0.12;
        oscillator.type = 'square';
        oscillator.start();
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Core calculation logic
function calculateUrineProductionTime() {
    const waterAmount = parseInt(document.getElementById('waterAmount').value);
    const temp = document.querySelector('.temp-btn.active').dataset.temp;
    const hydration = document.getElementById('hydrationStatus').value;
    
    // Base time in minutes
    let baseTime = 20; // Average 20 minutes
    
    // Temperature modifier
    const tempModifiers = {
        'ice-cold': 1.1,
        'cold': 1.05,
        'room': 1.0,
        'warm': 0.95,
        'hot': 0.9
    };
    
    // Hydration modifier
    const hydrationModifiers = {
        'well-hydrated': 0.8,
        'normal': 1.0,
        'dehydrated': 1.5
    };
    
    // Drink type modifier (diuretics process faster)
    const drinkTypeModifiers = {
        'water': 1.0,
        'coffee': 0.7,      // Caffeine is a diuretic
        'tea': 0.8,         // Tea has some caffeine
        'soda': 0.85,       // Caffeine + sugar
        'juice': 1.1,       // Takes longer due to sugar
        'alcohol': 0.5      // Strong diuretic effect
    };
    
    // Quantity modifier (more water = faster initial urge)
    const quantityModifier = 1 - (waterAmount / 2000) * 0.3;
    
    const totalTime = baseTime * tempModifiers[temp] * hydrationModifiers[hydration] * drinkTypeModifiers[selectedDrinkType] * quantityModifier;
    
    return Math.max(5, Math.min(120, totalTime)); // Clamp between 5 and 120 minutes
}

function calculateBladderCapacity() {
    const weight = parseInt(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    
    // Weight-based formula: 7 mL per kg
    const weightCapacity = weight * 7;
    
    // Adult baseline
    const adultBaseline = 500;
    
    // Blend the formulas
    const capacity = (weightCapacity + adultBaseline) / 2;
    
    // Age adjustment (bladder capacity decreases slightly with age)
    const ageFactor = 1 - ((age - 30) / 100) * 0.2;
    
    return Math.round(capacity * ageFactor);
}

function calculateHoldTimes() {
    const bladderCapacity = calculateBladderCapacity();
    
    // Safe hold time: 3-5 hours
    const safeHoldTime = 4; // hours
    
    // Maximum hold time: 6-8 hours
    const maxHoldTime = 7; // hours
    
    return {
        safe: safeHoldTime,
        max: maxHoldTime
    };
}

function calculateUrgencyLevel() {
    const waterAmount = parseInt(document.getElementById('waterAmount').value);
    const bladderCapacity = calculateBladderCapacity();
    const urineTime = calculateUrineProductionTime();
    
    // Current urine volume (simplified calculation)
    const currentUrine = waterAmount * 0.8; // About 80% becomes urine
    const fillPercentage = (currentUrine / bladderCapacity) * 100;
    
    let urgencyLevel, urgencyText, urgencyColor;
    
    if (fillPercentage < 30) {
        urgencyLevel = 25;
        urgencyText = '😊 Relaxed';
        urgencyColor = 'linear-gradient(90deg, #4caf50, #8bc34a)';
    } else if (fillPercentage < 50) {
        urgencyLevel = 50;
        urgencyText = '😐 Getting There';
        urgencyColor = 'linear-gradient(90deg, #ffeb3b, #ffc107)';
    } else if (fillPercentage < 70) {
        urgencyLevel = 75;
        urgencyText = '😅 Moderate';
        urgencyColor = 'linear-gradient(90deg, #ff9800, #ff5722)';
    } else {
        urgencyLevel = 100;
        urgencyText = '😰 Urgent!';
        urgencyColor = 'linear-gradient(90deg, #f44336, #e91e63)';
    }
    
    return {
        level: urgencyLevel,
        text: urgencyText,
        color: urgencyColor,
        fillPercentage: fillPercentage
    };
}

// Update all calculations and displays
function updateCalculations() {
    const urineTime = calculateUrineProductionTime();
    const bladderCapacity = calculateBladderCapacity();
    const holdTimes = calculateHoldTimes();
    const urgency = calculateUrgencyLevel();
    
    // Update results
    document.getElementById('urineTime').textContent = Math.round(urineTime) + ' min';
    document.getElementById('bladderCapacity').textContent = bladderCapacity + ' mL';
    document.getElementById('safeHoldTime').textContent = holdTimes.safe + ' hrs';
    document.getElementById('maxHoldTime').textContent = holdTimes.max + ' hrs';
    
    // Update urgency indicator
    const urgencyFill = document.getElementById('urgencyFill');
    urgencyFill.style.width = urgency.level + '%';
    urgencyFill.style.background = urgency.color;
    document.getElementById('urgencyText').textContent = urgency.text;
    
    // Update pee clock
    const now = new Date();
    const urgeTime = new Date(now.getTime() + urineTime * 60000);
    document.getElementById('peeClock').textContent = urgeTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Update bladder animation
    const bladderFill = document.getElementById('bladderFill');
    const bladderText = document.getElementById('bladderText');
    bladderFill.style.height = Math.min(urgency.fillPercentage, 100) + '%';
    bladderText.textContent = Math.round(urgency.fillPercentage) + '%';
    
    // Update warning
    const warningBox = document.getElementById('warningBox');
    if (urgency.level >= 75) {
        warningBox.style.display = 'block';
    } else {
        warningBox.style.display = 'none';
    }
    
    // Update charts
    updateCharts();
}

// Add to intake log
function addToIntakeLog() {
    const waterAmount = parseInt(document.getElementById('waterAmount').value);
    const temp = document.querySelector('.temp-btn.active').dataset.temp;
    
    const entry = {
        amount: waterAmount,
        temperature: temp,
        drinkType: selectedDrinkType,
        timestamp: new Date().toISOString()
    };
    
    intakeHistory.push(entry);
    saveIntakeHistory();
    
    // Play funny sound based on drink type
    const funnySounds = ['slurp', 'boing', 'toot', 'water'];
    const randomSound = funnySounds[Math.floor(Math.random() * funnySounds.length)];
    playSound(randomSound);
    createWaterDrops();
    
    // Update insights and charts
    updateInsights();
    updateCharts();
    checkAchievements();
    
    // Show brief notification
    showNotification('Added ' + waterAmount + 'mL ' + selectedDrinkType + ' to your log! 💧');
}

// Create water drop animation
function createWaterDrops() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'water-drop';
            drop.style.left = Math.random() * window.innerWidth + 'px';
            drop.style.top = '-20px';
            document.body.appendChild(drop);
            
            setTimeout(() => drop.remove(), 2000);
        }, i * 100);
    }
}

// Create confetti animation
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-family: 'Fredoka', sans-serif;
        font-size: 1rem;
        z-index: 1000;
        animation: slideInRight 0.5s ease, glow 1s ease infinite;
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 2500);
}

// Submit data function
function submitData() {
    const submitBtn = document.getElementById('submitBtn');
    
    // Play funny submission sound
    playFunnySubmitSound();
    
    // Create celebration effect
    createConfetti();
    createWaterDrops();
    
    // Change button state
    submitBtn.textContent = '✅ Submitted!';
    submitBtn.classList.add('submitted');
    
    // Auto-save all data
    const submissionData = {
        userProfile: userProfile,
        intakeHistory: intakeHistory,
        timestamp: new Date().toISOString(),
        totalIntake: intakeHistory.reduce((sum, entry) => sum + entry.amount, 0)
    };
    
    localStorage.setItem('peeSubmission', JSON.stringify(submissionData));
    
    // Show funny notification
    const funnyMessages = [
        "🎉 Data submitted! Your bladder thanks you!",
        "💪 Success! You're a hydration hero!",
        "🚀 Blast off! Data sent to the cloud (of knowledge)!",
        "✨ Amazing! Your pee data is now legendary!",
        "🏆 Winner! Data saved like a champion!",
        "🎊 Wohoo! Information securely stored!",
        "💧 Splendid! Your data is now safe and sound!"
    ];
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    showNotification(randomMessage);
    
    // Reset button after 3 seconds
    setTimeout(() => {
        submitBtn.textContent = '🚀 Submit & Save Data';
        submitBtn.classList.remove('submitted');
    }, 3000);
}

// Funny submit sound effect
function playFunnySubmitSound() {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a funny ascending sequence
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major scale
    const duration = 0.08;
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
        gainNode.gain.value = 0.1;
        
        oscillator.start(audioContext.currentTime + index * duration);
        oscillator.stop(audioContext.currentTime + (index + 1) * duration);
    });
    
    // Add a final "tada" chord
    setTimeout(() => {
        const chord = [523.25, 659.25, 783.99]; // C major chord
        chord.forEach(freq => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.value = 0.08;
            osc.start();
            osc.stop(audioContext.currentTime + 0.5);
        });
    }, notes.length * duration * 1000);
}

// Update health insights
function updateInsights() {
    const weight = parseInt(document.getElementById('weight').value);
    const dailyGoal = Math.round(weight * 35); // 35 mL per kg
    const todayIntake = intakeHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const progress = Math.round((todayIntake / dailyGoal) * 100);
    
    document.getElementById('dailyGoal').textContent = dailyGoal + ' mL';
    document.getElementById('todayIntake').textContent = todayIntake + ' mL';
    document.getElementById('progress').textContent = Math.min(progress, 100) + '%';
    
    // Update tips based on progress
    const tipsList = document.getElementById('tipsList');
    if (progress < 50) {
        tipsList.innerHTML = `
            <li>💧 You're behind on hydration! Drink more water</li>
            <li>🥤 Try to drink water with every meal</li>
            <li>⏰ Set reminders to drink water regularly</li>
            <li>🍵 Herbal tea counts toward your goal too!</li>
        `;
    } else if (progress < 100) {
        tipsList.innerHTML = `
            <li>💧 Good progress! Keep drinking water</li>
            <li>🚽 Don't forget to take bathroom breaks</li>
            <li>🥤 Aim for small sips throughout the day</li>
            <li>🏃‍♂️ Stay active for better hydration</li>
        `;
    } else {
        tipsList.innerHTML = `
            <li>🎉 Amazing! You've hit your daily goal!</li>
            <li>💧 Continue maintaining good habits</li>
            <li>🚽 Remember to listen to your body</li>
            <li>⚖️ Balance is key - don't overhydrate</li>
        `;
    }
}

// Check and update achievements
function checkAchievements() {
    // First Log
    if (intakeHistory.length >= 1) {
        unlockBadge('badgeFirstLog');
    }
    
    // Well Hydrated
    const weight = parseInt(document.getElementById('weight').value);
    const dailyGoal = weight * 35;
    const todayIntake = intakeHistory.reduce((sum, entry) => sum + entry.amount, 0);
    if (todayIntake >= dailyGoal) {
        unlockBadge('badgeHydrated');
        if (!document.getElementById('badgeHydrated').dataset.celebrated) {
            createConfetti();
            document.getElementById('badgeHydrated').dataset.celebrated = 'true';
        }
    }
    
    // Hydration Champion (3x daily goal)
    if (todayIntake >= dailyGoal * 3) {
        unlockBadge('badgeChampion');
    }
    
    // Consistent (5+ entries)
    if (intakeHistory.length >= 5) {
        unlockBadge('badgeConsistent');
    }
}

function unlockBadge(badgeId) {
    const badge = document.getElementById(badgeId);
    if (badge.classList.contains('locked')) {
        badge.classList.remove('locked');
        playSound('achievement');
        createConfetti();
    }
}

// Initialize Chart.js charts
function initializeCharts() {
    // Bladder Capacity Doughnut Chart
    const bladderCtx = document.getElementById('bladderChart').getContext('2d');
    bladderChart = new Chart(bladderCtx, {
        type: 'doughnut',
        data: {
            labels: ['Urine', 'Available Space', 'Urgency Zone'],
            datasets: [{
                data: [100, 300, 100],
                backgroundColor: ['#4fc3f7', '#e0e0e0', '#ff9800'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Urine Production Timeline Chart
    const timelineCtx = document.getElementById('timelineChart').getContext('2d');
    timelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
            labels: ['0m', '15m', '30m', '45m', '60m', '90m', '120m'],
            datasets: [{
                label: 'Urine Volume (mL)',
                data: [0, 50, 100, 150, 200, 250, 300],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Daily Water Intake Chart
    const intakeCtx = document.getElementById('intakeChart').getContext('2d');
    intakeChart = new Chart(intakeCtx, {
        type: 'bar',
        data: {
            labels: intakeHistory.map((_, i) => `Log ${i + 1}`),
            datasets: [{
                label: 'Water (mL)',
                data: intakeHistory.map(entry => entry.amount),
                backgroundColor: '#4fc3f7',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Hold Time vs Volume Chart
    const holdTimeCtx = document.getElementById('holdTimeChart').getContext('2d');
    holdTimeChart = new Chart(holdTimeCtx, {
        type: 'line',
        data: {
            labels: ['0', '100', '200', '300', '400', '500', '600'],
            datasets: [{
                label: 'Hold Time (hrs)',
                data: [0, 1, 2, 3, 4, 5, 6],
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 8
                }
            }
        }
    });
}

// Update all charts
function updateCharts() {
    const waterAmount = parseInt(document.getElementById('waterAmount').value);
    const bladderCapacity = calculateBladderCapacity();
    const urineTime = calculateUrineProductionTime();
    
    // Update bladder chart
    const urineVolume = waterAmount * 0.8;
    const urgencyZone = bladderCapacity * 0.3;
    const availableSpace = bladderCapacity - urineVolume - urgencyZone;
    
    bladderChart.data.datasets[0].data = [
        Math.max(0, urineVolume),
        Math.max(0, availableSpace),
        urgencyZone
    ];
    bladderChart.update();
    
    // Update timeline chart
    const timelineData = [0];
    for (let i = 15; i <= 120; i += 15) {
        if (i <= urineTime) {
            timelineData.push((i / urineTime) * urineVolume);
        } else {
            timelineData.push(urineVolume);
        }
    }
    timelineChart.data.datasets[0].data = timelineData;
    timelineChart.update();
    
    // Update intake chart
    intakeChart.data.labels = intakeHistory.map((_, i) => `Log ${i + 1}`);
    intakeChart.data.datasets[0].data = intakeHistory.map(entry => entry.amount);
    intakeChart.update();
    
    // Update hold time chart
    const holdTimeData = [0];
    for (let i = 100; i <= 600; i += 100) {
        const holdTime = (i / bladderCapacity) * 7;
        holdTimeData.push(Math.min(holdTime, 8));
    }
    holdTimeChart.data.datasets[0].data = holdTimeData;
    holdTimeChart.update();
}
