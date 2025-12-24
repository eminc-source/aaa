// =============================================
// ALGO ACCOUNT ABILITY - Main JavaScript
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeDateDisplay();
    initializeRetroEffects();
});

// =============================================
// DATE DISPLAY
// =============================================

function initializeDateDisplay() {
    const dateElement = document.getElementById('current-date');
    
    function updateDate() {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        // Format: MON DEC 23 2024 :: 14:30:45
        const formatted = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }).toUpperCase() + ' :: ' + 
        now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        dateElement.textContent = formatted;
    }
    
    updateDate();
    setInterval(updateDate, 1000);
}

// =============================================
// RETRO EFFECTS
// =============================================

function initializeRetroEffects() {
    // Add typing effect to status indicators
    const statusTexts = document.querySelectorAll('.status-text');
    statusTexts.forEach(text => {
        const originalText = text.textContent;
        text.textContent = '';
        typeText(text, originalText, 100);
    });
    
    // Add hover sound effect simulation (visual feedback)
    const buttons = document.querySelectorAll('.retro-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.filter = 'brightness(1.2)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.filter = 'brightness(1)';
        });
    });
    
    // Add glitch effect on logo hover
    const logoLetters = document.querySelectorAll('.logo-letter');
    logoLetters.forEach(letter => {
        letter.addEventListener('mouseenter', () => {
            letter.classList.add('glitch');
            setTimeout(() => letter.classList.remove('glitch'), 200);
        });
    });
}

// Typing effect function
function typeText(element, text, speed) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// =============================================
// NAVIGATION (Placeholder for future functionality)
// =============================================

function navigateTo(section) {
    console.log('Navigating to:', section);
    // Future: Handle navigation between different views
}

// =============================================
// DATA LOADING (Placeholder for future functionality)
// =============================================

function loadOrganizationData(orgType) {
    console.log('Loading data for:', orgType);
    // Future: Load data from spreadsheets/reports
}

// =============================================
// CHART RENDERING (Placeholder for future functionality)
// =============================================

function renderChart(type, data, options) {
    console.log('Rendering chart:', type, data, options);
    // Future: Render charts with retro styling
}
