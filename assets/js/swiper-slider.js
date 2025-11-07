jQuery(document).ready(function ($) {
  $(".slider").each(function () {
    var setting = $(this).attr("data-settings");
    var id = $(this).attr("id");
    var items = JSON.parse(setting);
    var autoplaySetting =
      items.autoplay === "false"
        ? !1
        : {
            delay: 3000,
            disableOnInteraction: !1,
            pauseOnMouseEnter: !0,
          };
    new Swiper("#" + id, {
      slidesPerView: items.columns,
      spaceBetween: items.space || 0,
      autoplay: autoplaySetting,
      loop: items.infinite,
      centeredSlides: items.centerMode,
      navigation: {
        nextEl: "#" + id + " .swiper-button-next",
        prevEl: "#" + id + " .swiper-button-prev",
      },
      pagination: {
        el: "#" + id + " .swiper-pagination",
        clickable: !0,
        dynamicBullets: !1,
      },
      breakpoints: {
        10: { slidesPerView: items.columns_mobile },
        480: { slidesPerView: items.columns_mobile_tablet },
        768: { slidesPerView: items.columns_tablet },
        1024: { slidesPerView: items.columns },
      },
      // Add callback to run border animation after slider initialization
      on: {
        init: function () {
          initializeBorderAnimation();
        },
        resize: function () {
          initializeBorderAnimation(); // Re-run on resize to handle responsive changes
        },
      },
    });
  });
});