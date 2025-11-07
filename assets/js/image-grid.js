document.addEventListener("DOMContentLoaded", function () {
  const imageGrid = document.getElementById("imageGrid");
  const loadingElement = document.getElementById("loading");
  const transitionTime = 4000;
  let currentImageSet = 0;
  let imagePaths = [];
  let totalImages = 84; // مقدار پیش‌فرض برای دسکتاپ

  // تابع برای به‌روزرسانی تعداد تصاویر بر اساس عرض صفحه
  function updateGridSize() {
    const width = window.innerWidth;
    let newTotalImages = 84;
    let cols = 14;
    let rows = 6;

    if (width > 1200) {
      // دسکتاپ
      newTotalImages = 84;
      cols = 14;
    } else if (width > 768) {
      // تبلت
      newTotalImages = 60;
      cols = 10;
    } else if (width > 480) {
      // موبایل
      newTotalImages = 36;
      cols = 6;
    } else {
      // موبایل کوچک
      newTotalImages = 24;
      cols = 4;
    }

    // فقط در صورت تغییر تعداد یا ستون‌ها، DOM را به‌روزرسانی کن
    if (
      newTotalImages !== totalImages ||
      imageGrid.style.gridTemplateColumns !== `repeat(${cols}, 1fr)`
    ) {
      totalImages = newTotalImages;
      imageGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      imageGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

      // حذف تصاویر اضافی
      const currentItems = imageGrid.querySelectorAll(".grid-item");
      if (currentItems.length > totalImages) {
        for (let i = totalImages; i < currentItems.length; i++) {
          imageGrid.removeChild(currentItems[i]);
        }
      }
      // اضافه کردن تصاویر جدید در صورت نیاز
      if (currentItems.length < totalImages) {
        createGridItems(currentItems.length, totalImages);
      }
    }
  }

  // ایجاد آیتم‌های گرید
  function createGridItems(startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
      const gridItem = document.createElement("div");
      gridItem.className = "grid-item";

      // ایجاد دو لایه تصویر برای هر سلول (برای انتقال نرم)
      for (let j = 0; j < 2; j++) {
        const img = document.createElement("img");
        img.className = `grid-image layer${j + 1} w-h-100`;
        // استفاده از تصاویر مختلف برای هر سلول
        const imageIndex = (i + j * totalImages) % imagePaths.length;
        img.src =
          imagePaths[imageIndex] ||
          `https://picsum.photos/200/200?random=${i + j * 100}`; // Fallback
        gridItem.appendChild(img);
      }
      imageGrid.appendChild(gridItem);
    }
  }

  // تولید مسیرهای تصاویر
  function generateImagePaths() {
    const paths = [];
    for (let i = 1; i <= 160; i++) {
      paths.push(`assets/img/pc/name (${i}).jpg`);
    }
    if (paths.length === 0) {
      for (let i = 1; i <= 160; i++) {
        paths.push(`https://picsum.photos/200/200?random=${i}`);
      }
    }
    return paths;
  }

  // بارگذاری تصاویر
  function preloadImages(paths, callback) {
    let loaded = 0;
    const total = paths.length;
    if (total === 0) {
      callback();
      return;
    }
    paths.forEach((path) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === total) {
          callback();
        }
      };
      img.src = path;
    });
  }

  // تابع برای تغییر تصاویر
  function changeImages() {
    const allLayer1 = document.querySelectorAll(".grid-item .layer1");
    const allLayer2 = document.querySelectorAll(".grid-item .layer2");

    // افزایش شماره ست تصاویر
    currentImageSet =
      (currentImageSet + 1) % Math.ceil(imagePaths.length / totalImages);

    // به روزرسانی تمام تصاویر لایه 2 به صورت همزمان
    allLayer2.forEach((img, index) => {
      const imageIndex =
        (index + currentImageSet * totalImages) % imagePaths.length;
      img.src =
        imagePaths[imageIndex] ||
        `https://picsum.photos/200/200?random=${
          index + currentImageSet * totalImages + 100
        }`;
    });

    setTimeout(() => {
      allLayer1.forEach((img) => {
        img.style.opacity = "0";
      });
      allLayer2.forEach((img) => {
        img.style.opacity = "0.5";
      });
    }, 50);

    setTimeout(() => {
      allLayer1.forEach((img, index) => {
        img.src = allLayer2[index].src;
        img.style.opacity = "0.5";
      });
      allLayer2.forEach((img) => {
        img.style.opacity = "0";
      });
    }, 1600);
  }

  // راه‌اندازی اولیه
  function initialize() {
    imagePaths = generateImagePaths();
    preloadImages(imagePaths, () => {
      loadingElement.style.display = "none";
      updateGridSize();
      setTimeout(changeImages, 2000);
      setInterval(changeImages, transitionTime);
    });
  }

  initialize();
  window.addEventListener("resize", updateGridSize);
});