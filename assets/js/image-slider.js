const imageSlider = document.getElementById("image-slider");
const slidesContainer = document.getElementById("slides-container");
const textContent = document.querySelector(".text-content");
const VISIBLE_SLIDES = 4;
let currentActiveIndex = 0;
let slides = [];
let texts = [];
// متغیرهای AutoPlay
const AUTO_PLAY_INTERVAL = 3000;
let autoPlayTimer;
// متغیرهای Drag
let isDragging = false;
let startPos = 0;
const DRAG_THRESHOLD = 50;
// ----------------------------------------------------
// مقداردهی اولیه اسلایدها و متن‌ها از HTML
// ----------------------------------------------------
function initializeSlider() {
  slides = document.querySelectorAll(".slide-item");
  texts = document.querySelectorAll(".text-content-wrapper");
  // به‌روزرسانی اولیه
  updateSliderPositions();
  updateTextContent();
}
// ----------------------------------------------------
// به‌روزرسانی موقعیت اسلایدها
// ----------------------------------------------------
function updateSliderPositions() {
  slides.forEach((slide, index) => {
    let position = index - currentActiveIndex;
    if (position < 0) {
      position += slides.length;
    }
    slide.className = "slide-item";
    if (position === 0) {
      slide.classList.add("slide-active");
    } else if (position === 1) {
      slide.classList.add("slide-next");
    } else if (position === 2) {
      slide.classList.add("slide-far");
    } else if (position === 3) {
      slide.classList.add("slide-hidden");
    }
  });
}
// ----------------------------------------------------
// به‌روزرسانی محتوای متنی
// ----------------------------------------------------
function updateTextContent() {
  texts.forEach((text, index) => {
    text.classList.toggle("active", index === currentActiveIndex);
  });
}
// ----------------------------------------------------
// توابع اصلی اسلاید
// ----------------------------------------------------
function updateSlider(direction) {
  currentActiveIndex =
    (currentActiveIndex + direction + slides.length) % slides.length;
  updateSliderPositions();
  updateTextContent();
  // ریست کردن AutoPlay پس از تعامل دستی
  resetAutoPlay();
}
// ----------------------------------------------------
// قابلیت AutoPlay
// ----------------------------------------------------
function startAutoPlay() {
  autoPlayTimer = setInterval(() => updateSlider(1), AUTO_PLAY_INTERVAL);
}
function resetAutoPlay() {
  clearInterval(autoPlayTimer);
  startAutoPlay();
}
// ----------------------------------------------------
// قابلیت Drag (اسلاید با موس)
// ----------------------------------------------------
imageSlider.addEventListener("mousedown", (e) => {
  isDragging = true;
  startPos = e.clientX;
  imageSlider.classList.add("dragging");
  clearInterval(autoPlayTimer);
});
document.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  imageSlider.classList.remove("dragging");
  const endPos = e.clientX;
  const diff = startPos - endPos;
  if (Math.abs(diff) > DRAG_THRESHOLD) {
    updateSlider(diff > 0 ? 1 : -1);
  }
  resetAutoPlay();
});
imageSlider.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
});

initializeSlider();
//   startAutoPlay();