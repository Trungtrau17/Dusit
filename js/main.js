(function($) {

	'use strict';
  let lastScrollTime = 0;
  let lastScrollY = 0;
  let scrollPosition = 0;
  var isMenuOpen = false;
  var isScrolled = false;
  let isHeaderHidden = false;
  let isInitialized = false;
  let isMenuJustClosed = false
  const scrollVelocityThreshold = 0.5; // Tốc độ scroll tối thiểu (px/ms)
  const minScrollDistance = 50;


  $(document).ready(function() {
    // Reset header state
    isHeaderHidden = false;
    $('.js-site-header').removeClass('header-hidden');
    
    // Initialize baseline state
    setTimeout(() => {
      $('.js-site-header').removeClass('scrolled');
      $('.site-header').css('transition', 'all 0.7s ease-in-out');
      $(window).trigger('resize');
    }, 100);
    const criticalImages = [
      'images/Deluxe.webp',
      'images/Junior.webp',
      'images/Soi_Restaurant.webp',
      'images/Gourmet.webp',
      'images/Palais_Lounge_3.webp',
      'images/DUSIT_Le_Palais_Tu_Hoa_Hanoi_Logo_Black.webp',
      'images/DUSIT_Le_Palais_Tu_Hoa_Hanoi_Logo_White.webp',
    ];
  
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
  });
function getScrollbarWidth() {
  const div = document.createElement('div');
  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';
  document.body.appendChild(div);
  
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);
  
  return scrollbarWidth;
}
  
  // Optimized throttle
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  function hideHeader() {
    if (!isHeaderHidden) {
      $('.js-site-header').css({
        'transform': 'translateY(-100%)',
        'transition': 'transform 0.7s ease-in-out'
      });
      $('.js-site-header').addClass('header-hidden');
      isHeaderHidden = true;
    }
  }

function showHeader() {
  if (isHeaderHidden) {
      $('.js-site-header').css({
        'transform': 'translateY(0)',
        'transition': 'transform 0.s ease-in-out'
      });
      $('.js-site-header').removeClass('header-hidden');
      isHeaderHidden = false;
    }
  }

  function calculateScrollVelocity(currentScrollY, currentTime) {
    const scrollDistance = Math.abs(currentScrollY - lastScrollY);
    const timeElapsed = currentTime - lastScrollTime;
    
    if (timeElapsed === 0 || timeElapsed > 100) return 0;
    
    return scrollDistance / timeElapsed;
  }

  // Hàm xử lý scroll chính dựa trên tốc độ
  function handleHeaderScroll(currentScrollY) {
    const currentTime = Date.now();
    
    isScrolled = currentScrollY > 200;
    
    if (!isMenuOpen && currentScrollY > minScrollDistance) {
      const scrollVelocity = calculateScrollVelocity(currentScrollY, currentTime);
      const scrollDirection = currentScrollY - lastScrollY;
      const isActuallyScrolling = Math.abs(scrollDirection) > 0.5;
      
      if (scrollVelocity > scrollVelocityThreshold && isActuallyScrolling) {
        if (scrollDirection > 0) {
          hideHeader();
        } else if (scrollDirection < 0) {
          showHeader();
        }
      }
    } else if (currentScrollY <= minScrollDistance) {
      showHeader();
    }
    
    lastScrollY = currentScrollY;
    lastScrollTime = currentTime;
  }

  const throttledHeaderScroll = throttle(handleHeaderScroll, 8);
  let lenis;
  let isMobile = $(window).width() < 1200;
  // Thêm Lenis smooth scroll
  function initializeScroll() {
  if (!isMobile) {
    // Desktop - use Lenis
      lenis = new Lenis({
      duration: 2, // thời gian kéo dài scroll (cao hơn = chậm hơn)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.1, // Thêm lerp để mượt hơn
      
      wrapper: window, // Hoặc document.body
      content: document.documentElement,
      wheelEventsTarget: window, // Thêm để tối ưu wheel events
      syncTouch: true,
      normalizeWheel: true,
      // Thêm option để tương thích với fixed elements
      gestureDirection: 'vertical',
      smoothWheel: true,
      autoResize: true,
      prevent: (node) => node.classList.contains('no-lenis')
    });

  // Lenis scroll handler thay thế jQuery
  lenis.on('scroll', (e) => {
    const scrollY = e.scroll;
    const currentTime = Date.now();
    // Khởi tạo lastScrollY trong lần scroll đầu tiên
    if (!isInitialized) {
      lastScrollY = scrollY;
      lastScrollTime = currentTime;
      isInitialized = true;
      return; // Skip processing cho lần đầu tiên
    }
    // Update scroll state
    isScrolled = scrollY > 200;
    
    // Header state update
    if (!isMenuOpen) {
      updateHeaderState();
    }
    // 3. Header hide/show logic
    throttledHeaderScroll(scrollY);

  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  }
  else{
    // Mobile - use native scroll
    $(window).on('scroll', function() {
      const scrollY = $(this).scrollTop();
      // Handle native scroll events
      isScrolled = scrollY > 200;
      if (!isMenuOpen) {
        updateHeaderState();
      }
      throttledHeaderScroll(scrollY);
    });
  }}
  // Initialize based on screen size
  initializeScroll();
  // Reinitialize on resize
$(window).resize(function() {
  const wasMobile = isMobile;
  isMobile = $(window).width() < 1200;
  
  if (wasMobile !== isMobile) {
    // Screen size category changed
    if (lenis) {
      lenis.destroy();
      lenis = null;
    }
    $(window).off('scroll');
    
    setTimeout(() => {
      initializeScroll();
    }, 100);
  }
});
  // Function để update header state
  function updateHeaderState() {
    if (isMenuOpen) {
      // Khi menu open, luôn dùng style menu
      $('.js-site-header').addClass('scrolled');
      $('.site-header').css({
        'transition': 'all 0.7s ease-in-out',
        'background-color': '#F4F2EF',
        'border': 'none'
      });
      $('.site-header .site-menu-toggle .menu-text').css({
        'color': '#373635'
      });
      $('.site-header .site-menu-toggle .menu-icon span').css({
        'background-color': '#373635'
      });
      $('.site-header .language-switch').css({
        'color': '#373635'
      });
      $('.site-header .book-btn').css({
        'background-color': '#373635'
      });
    } else {
      // Khi menu close - chỉ xử lý nếu KHÔNG đang hover
      if (!$('.site-header').is(':hover')) {
      // Xác định theme theo scroll position
        if (isScrolled) {
          $('.js-site-header').addClass('scrolled');
        } else {
          $('.js-site-header').removeClass('scrolled');
        }
      }

      // Reset inline styles
      $('.site-header').css({
        'transition': 'all 0.7s ease-in-out',
        'background-color': '',
        'border': ''
      });
      $('.site-header .site-menu-toggle .menu-text').css({
        'color': ''
      });
      $('.site-header .site-menu-toggle .menu-icon span').css({
        'background-color': ''
      });
      $('.site-header .language-switch').css({
        'color': ''
      });
      $('.site-header .book-btn').css({
        'background-color': '',
        
      });
    }
  }
  $('.site-header').hover(
  function() {
    // CSS sẽ tự handle logo transition
    $('.js-site-header').addClass('scrolled');
  },
  function() {
    isMenuJustClosed = false;
    
    if (isMenuOpen) {
      $('.js-site-header').addClass('scrolled');
      return;
    }
    const currentScroll = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
    const actuallyScrolled = currentScroll > 200;
    isScrolled = actuallyScrolled;
    // CSS sẽ tự handle logo transition
    if (actuallyScrolled) {
      $('.js-site-header').addClass('scrolled');
    } else {
      $('.js-site-header').removeClass('scrolled');
    }
  }
);
  // Menu toggle function
  $('.site-menu-toggle').click(function(){
    var $this = $(this);
    if ($('body').hasClass('menu-open')) {
      // ✅ FIX: Close menu - lưu position trước khi thay đổi
      $this.removeClass('open');
      $('.js-site-navbar').fadeOut(400);
      $('body').removeClass('menu-open');
      $('html').removeClass('menu-open');
      isMenuOpen = false;
      isMenuJustClosed = true;

      // ✅ RESET padding
      $('.navbar-nav').css('padding-right', '');
      $('.container-fluid').css('padding-right', '');
      
      // ✅ FIX: Remove event listeners TRƯỚC khi restore scroll
      $(window).off('wheel.menuOpen touchmove.menuOpen scroll.menuOpen');
      $(document).off('keydown.menuOpen');

      if(!isMobile && lenis){
        // ✅ FIX: Cải thiện logic restore scroll position
        const currentBodyTop = $('body').css('top');
        let scrollY = 0;
        
        if (currentBodyTop && currentBodyTop !== 'auto') {
          scrollY = Math.abs(parseInt(currentBodyTop) || 0);
        }
        
        // ✅ Reset styles trước khi scroll
        $('body').css({
          'position': '',
          'top': '',
          'width': ''
        });
        $('html').css('overflow', '');
        
        // ✅ Đảm bảo scrollY hợp lệ trước khi áp dụng
        if (scrollY > 0 && scrollY < document.documentElement.scrollHeight) {
          window.scrollTo(0, scrollY);
        }
        
        // ✅ Restart Lenis sau khi đã restore position
        setTimeout(() => {
          lenis.start();
        }, 50);
        
      } else {
        // ✅ Mobile: Reset scroll đơn giản
        $('body').css({
          'position': 'static',
          'top': 'auto',
          'width': 'auto',
          'overflow': 'auto',
          'overflow-x': 'hidden'
        });
        
        $('html').css({
          'overflow': 'auto',
          'overflow-x': 'hidden',
        });
      }
      
      updateHeaderState();
      
      
    } else {
      // ✅ FIX: Open menu - cải thiện logic lưu position
      $this.addClass('open');
      $('.js-site-navbar').fadeIn(400);
      $('body').addClass('menu-open');
      $('html').addClass('menu-open');
      
      isMenuOpen = true;
      isMenuJustClosed = false;
      const scrollbarWidth = getScrollbarWidth();
      $('.navbar-nav').css('padding-right', scrollbarWidth + 'px');
      $('.container-fluid').css('padding-right', scrollbarWidth + 'px');
      
      // Lock scroll khác nhau cho desktop/mobile
      if(!isMobile && lenis){
        // Lấy scroll position CHÍNH XÁC trước khi lock
        const scrollPosition = lenis.scroll || window.pageYOffset || document.documentElement.scrollTop || 0;
        
        // Lock events trước khi stop Lenis
        $(window).on('wheel.menuOpen', function(e) {
          e.preventDefault();
          return false;
        });
        $(window).on('touchmove.menuOpen', function(e) {
          e.preventDefault();
          return false;
        });
        $(document).on('keydown.menuOpen', function(e) {
          if([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            return false;
          }
        });
        
        // Stop Lenis sau khi đã lock events
        lenis.stop();
        
        // Áp dụng fixed position với scroll position chính xác
        $('body').css({
          'position': 'fixed',
          'top': `-${scrollPosition}px`,
          'width': '100%'
        });
        $('html').css('overflow', 'hidden');
        
      } else {
        // Mobile: Lock scroll bằng CSS và events
        $('body').css('overflow', 'hidden');
        $('html').css('overflow', 'hidden');
        
        // Prevent scroll events trên mobile
        $(window).on('scroll.menuOpen touchmove.menuOpen wheel.menuOpen', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
        
        $(document).on('keydown.menuOpen', function(e) {
          if([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            return false;
          }
        });
      }
      updateHeaderState();
    }
  });
  // ✅ THÊM click overlay để đóng menu
$('.menu-overlay').click(function() {
  if ($('body').hasClass('menu-open')) {
    $('.site-menu-toggle').trigger('click'); // Trigger close menu
  }
});

// ✅ THÊM ESC key để đóng menu
$(document).keydown(function(e) {
  if (e.key === "Escape" && $('body').hasClass('menu-open')) {
    $('.site-menu-toggle').trigger('click'); // Trigger close menu
  }
});

  $('nav .dropdown').hover(function(){
		var $this = $(this);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		$this.find('.dropdown-menu').addClass('show');
	}, function(){
		var $this = $(this);
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			$this.find('.dropdown-menu').removeClass('show');
	});
  
  //Home slider
  $('.home-slider').owlCarousel({
    loop:true,
    autoplay: true,
    margin:10,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav:true,
    autoplayHoverPause: true,
    items: 1,
    autoheight: true,
    navText : ["<span class='ion-chevron-left'></span>","<span class='ion-chevron-right'></span>"],
    responsive:{
      0:{
        items:1,
        nav:false
      },
      600:{
        items:1,
        nav:false
      },
      1000:{
        items:1,
        nav:true
      }
    }
	});

	// owl carousel
	var majorCarousel = $('.js-carousel-1');
	majorCarousel.owlCarousel({
    loop:true,
    autoplay: true,
    stagePadding: 7,
    margin: 20,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav: true,
    autoplayHoverPause: true,
    items: 3,
    navText : ["<span class='ion-chevron-left'></span>","<span class='ion-chevron-right'></span>"],
    responsive:{
      0:{
        items:1,
        nav:false
      },
      600:{
        items:2,
        nav:false
      },
      1000:{
        items:3,
        nav:true,
        loop:false
      }
  	}
	});

  var dateAndTime = function() {
    $('#m_date').datepicker({
      'format': 'm/d/yyyy',
      'autoclose': true
    });
    $('#checkin_date, #checkout_date').datepicker({
      'format': 'd MM, yyyy',
      'autoclose': true
    });
    $('#m_time').timepicker();
  };
  dateAndTime();


 
  
  // Accommodation Slider
var accommodationSlider = $('.accommodation-slider');
let isSliding = false; // Flag để prevent spam click
let slideTimeout; // Timeout để reset flag
accommodationSlider.owlCarousel({
  loop: true, // Enable loop
  autoplay: false, // Tắt autoplay để user control
  margin: 40, // Khoảng cách giữa items
  nav: false, // Tắt nav mặc định, dùng custom nav
  dots: false, // Tắt dots
  items: 2, // Hiển thị 2 items cùng lúc
  stagePadding: 0,
  smartSpeed: 1200, // Tốc độ transition
  slideBy: 1, // Chuyển 1 item mỗi lần
  center: false,
  // Tắt tất cả hiệu ứng fade
  animateOut: false, // Tắt animateOut
  animateIn: false,  // Tắt animateIn
   
  responsive: {
    0: {
      items: 1, // Mobile: 1 item
      margin: 20,
      stagePadding: 30
    },
    600: {
      items: 1, // Tablet: 1 item
      margin: 30,
      stagePadding: 50
    },
    1000: {
      items: 2, // Desktop: 2 items
      margin: 40,
      stagePadding: 0
    }
  }
});
// Override transition sau khi Owl Carousel khởi tạo

// Event tracking để handle loop transition
accommodationSlider.on('translate.owl.carousel', function(event) {
  isSliding = true;
});

accommodationSlider.on('translated.owl.carousel', function(event) {
  // Reset sau khi hoàn thành
  setTimeout(() => {
    isSliding = false;
  }, 30);
});

// Protected navigation
function slideNext() {
  if (!isSliding) {
    accommodationSlider.trigger('next.owl.carousel');
  }
}

function slidePrev() {
  if (!isSliding) {
    accommodationSlider.trigger('prev.owl.carousel');
  }
}

$('.nav-button.prev').off('click').on('click', function(e) {
  e.preventDefault();
  slidePrev();
});

$('.nav-button.next').off('click').on('click', function(e) {
  e.preventDefault();
  slideNext();
});

// Wellness & Events Slider  
var weSlider = $('.we-slider');
let isWeSliding = false; // Flag riêng cho wellness slider
let weSlideTimeout; // Timeout riêng cho wellness

weSlider.owlCarousel({
  loop: true,
  autoplay: false,
  margin: 0, // Không cần margin vì chỉ hiển thị 1 item
  nav: false,
  dots: false,
  items: 1, // Chỉ hiển thị 1 item
  stagePadding: 0,
  smartSpeed: 1200,
  slideBy: 1,
  center: false,
  animateOut: false,
  animateIn: false,
  responsive: {
    0: {
      items: 1, // Mobile: 1 item
      margin: 0,
      smartSpeed: 1000
    },
    600: {
      items: 1, // Tablet: 1 item  
      margin: 0,
      smartSpeed: 1100
    },
    1000: {
      items: 1, // Desktop: 1 item
      margin: 0,
      smartSpeed: 1200
    }
  }
});

// Event tracking cho wellness slider
weSlider.on('translate.owl.carousel', function(event) {
  isWeSliding = true;
});

weSlider.on('translated.owl.carousel', function(event) {
  setTimeout(() => {
    isWeSliding = false;
  }, 30);
});

// Protected navigation cho wellness slider
function weSlideNext() {
  if (!isWeSliding) {
    weSlider.trigger('next.owl.carousel');
  }
}

function weSlidePrev() {
  if (!isWeSliding) {
    weSlider.trigger('prev.owl.carousel');
  }
}

// Navigation events cho section-2 (wellness) - QUAN TRỌNG: chỉ target buttons trong section-2
$('.section-2 .nav-button.prev').off('click').on('click', function(e) {
  e.preventDefault();
  weSlidePrev();
});

$('.section-2 .nav-button.next').off('click').on('click', function(e) {
  e.preventDefault();
  weSlideNext();
});
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    delay: 0,
    offset: 120,
    mirror: false,      
    anchorPlacement: 'top-bottom'
  });

  
})(jQuery);