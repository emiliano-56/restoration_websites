let currentSlide = 0;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, i) => {
        slide.classList.remove("active");
        if (i === currentSlide) {
            slide.classList.add("active");
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(index) {
    showSlide(index);
}

/* AUTO SLIDE (slower + smoother feel) */
setInterval(() => {
    nextSlide();
}, 7000); // 🔥 increased from 5000 → 7000 for better UX

/* INIT */
showSlide(currentSlide);