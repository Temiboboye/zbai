// Pitch Deck Navigation Script

let currentSlide = 1;
const totalSlides = 11;

// Get elements
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const slideCounter = document.getElementById('slide-counter');

// Initialize
function init() {
    showSlide(currentSlide);
    updateCounter();
    updateButtons();
}

// Show specific slide
function showSlide(n) {
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    const slideToShow = document.getElementById(`slide-${n}`);
    if (slideToShow) {
        slideToShow.classList.add('active');
    }
}

// Update counter
function updateCounter() {
    slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
}

// Update button states
function updateButtons() {
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// Go to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
        updateCounter();
        updateButtons();
    }
}

// Go to previous slide
function prevSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
        updateCounter();
        updateButtons();
    }
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Home') {
        e.preventDefault();
        currentSlide = 1;
        showSlide(currentSlide);
        updateCounter();
        updateButtons();
    } else if (e.key === 'End') {
        e.preventDefault();
        currentSlide = totalSlides;
        showSlide(currentSlide);
        updateCounter();
        updateButtons();
    } else if (e.key >= '1' && e.key <= '9') {
        // Jump to slide by number
        const slideNum = parseInt(e.key);
        if (slideNum <= totalSlides) {
            currentSlide = slideNum;
            showSlide(currentSlide);
            updateCounter();
            updateButtons();
        }
    }
});

// Swipe support for touch devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        prevSlide();
    }
}

// Initialize on load
init();

// Fullscreen toggle (F key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

// Print all slides (P key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        window.print();
    }
});

console.log('🚀 ZeroBounce AI Pitch Deck Loaded');
console.log('Navigation: Arrow keys, Space, Enter');
console.log('Shortcuts: F (fullscreen), P (print), 1-9 (jump to slide), Home/End');
