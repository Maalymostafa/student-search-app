// Global variables
let searchTimeout = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Student Search App initialized');
    
    // Add event listeners
    const codeInput = document.getElementById('codeInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Enter key support
    codeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchCode();
        }
    });
    
    // Real-time validation
    codeInput.addEventListener('input', function() {
        validateInput(this.value);
    });
    
    // Focus management
    codeInput.addEventListener('focus', function() {
        this.select();
    });
});

// Validate input in real-time
function validateInput(value) {
    const searchBtn = document.getElementById('searchBtn');
    const isValid = value && value.length >= 2;
    
    searchBtn.disabled = !isValid;
    
    if (isValid) {
        searchBtn.style.opacity = '1';
    } else {
        searchBtn.style.opacity = '0.6';
    }
}

// Main search function
async function searchCode() {
    const code = document.getElementById('codeInput').value.trim();
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const searchBtn = document.getElementById('searchBtn');
    
    // Input validation
    if (!code || code.length < 2) {
        showError('برجاء كتابة الكود');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Make API call
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle response
        if (data.success) {
            showResult(data.html);
        } else {
            showError(data.message || 'حدث خطأ في البحث');
        }
        
    } catch (error) {
        console.error('Search error:', error);
        showError('حدث خطأ في الاتصال بالخادم');
    } finally {
        setLoadingState(false);
    }
}

// Set loading state
function setLoadingState(isLoading) {
    const loadingDiv = document.getElementById('loading');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');
    
    if (isLoading) {
        loadingDiv.style.display = 'flex';
        searchBtn.disabled = true;
        resultDiv.innerHTML = '';
    } else {
        loadingDiv.style.display = 'none';
        searchBtn.disabled = false;
    }
}

// Show search results
function showResult(html) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = html;
    
    // Add animation class
    resultDiv.style.animation = 'none';
    resultDiv.offsetHeight; // Trigger reflow
    resultDiv.style.animation = 'fadeIn 0.5s ease-out';
    
    // Scroll to results
    resultDiv.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Show error message
function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
    
    // Add animation
    resultDiv.style.animation = 'none';
    resultDiv.offsetHeight; // Trigger reflow
    resultDiv.style.animation = 'fadeIn 0.5s ease-out';
}

// Utility function to format student code
function formatStudentCode(code) {
    // Remove any non-alphanumeric characters and convert to uppercase
    return code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

// Utility function to check if code is valid
function isValidCode(code) {
    const allowedPrefixes = ['G4', 'G5', 'G6', 'P1'];
    const prefix = code.substring(0, 2).toUpperCase();
    return allowedPrefixes.includes(prefix);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to search
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        searchCode();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        document.getElementById('codeInput').value = '';
        document.getElementById('result').innerHTML = '';
        document.getElementById('codeInput').focus();
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function() {
    // Add touch feedback
}, { passive: true });

// Performance optimization: Debounce search
function debounceSearch(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(searchTimeout);
            func(...args);
        };
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(later, wait);
    };
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchCode,
        validateInput,
        formatStudentCode,
        isValidCode
    };
}
