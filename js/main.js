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
  // ✅ WINDOWS SCALING AUTO-DETECTION & COMPENSATION

function detectAndCompensateScaling() {
  const dpr = window.devicePixelRatio;
  const userAgent = navigator.userAgent;
  const isWindows = userAgent.indexOf('Windows') !== -1;
  
  // Log scaling info
  console.log('🖥️ Display Scaling Info:', {
    devicePixelRatio: dpr,
    scaling: Math.round(dpr * 100) + '%',
    platform: isWindows ? 'Windows' : 'Other',
    resolution: screen.width + 'x' + screen.height,
    viewport: window.innerWidth + 'x' + window.innerHeight
  });
  
  if (isWindows) {
    let compensationFactor = 1;
    let logMessage = '';
    
    if (dpr === 1.25) {
      // 125% scaling - đồng nghiệp
      compensationFactor = 1.05;
      logMessage = '🔧 Applied 125% scaling compensation (+5%)';
      
      // Specific adjustments cho 125%
      $('.site-header .site-logo img').css('height', '70px');
      $('.site-hero-inner .heading').css('font-size', '52px');
      $('.book-btn').css({
        'padding': '16px 22px',
        'font-size': '13px'
      });
      
    } else if (dpr === 1.5) {
      // 150% scaling - máy bạn
      compensationFactor = 0.95;
      logMessage = '🔧 Applied 150% scaling compensation (-5%)';
      
      // Specific adjustments cho 150%
      $('.site-header .site-logo img').css('height', '68px');
      $('.site-hero-inner .heading').css('font-size', '50px');
      $('.book-btn').css({
        'padding': '14px 20px',
        'font-size': '12px'
      });
      
    } else if (dpr === 1.75) {
      // 175% scaling
      compensationFactor = 0.90;
      logMessage = '🔧 Applied 175% scaling compensation (-10%)';
      
      $('.site-header .site-logo img').css('height', '72px');
      $('.site-hero-inner .heading').css('font-size', '54px');
    }
    
    // Apply zoom compensation
    if (compensationFactor !== 1) {
      document.body.style.zoom = compensationFactor;
      console.log(logMessage);
      
      // Add class để track compensation
      $('body').addClass('scaling-compensated scaling-' + Math.round(dpr * 100));
    }
  }
  
  // Add debug info to page (remove in production)
  if (window.location.hostname.includes('ngrok') || window.location.hostname === 'localhost') {
    const debugInfo = $(`
      <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; font-size: 12px; z-index: 10000; border-radius: 5px;">
        <div>DPR: ${dpr} (${Math.round(dpr * 100)}%)</div>
        <div>Screen: ${screen.width}x${screen.height}</div>
        <div>Viewport: ${window.innerWidth}x${window.innerHeight}</div>
        <div>Zoom: ${document.body.style.zoom || '1'}</div>
      </div>
    `);
    $('body').append(debugInfo);
    
    // Auto hide after 5 seconds
    setTimeout(() => debugInfo.fadeOut(), 5000);
  }
}

// Run on load và resize
$(document).ready(function() {
  detectAndCompensateScaling();
});

$(window).resize(function() {
  detectAndCompensateScaling();
});

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
  // Detect DevTools
let devtools = {
  open: false,
  orientation: null
};

function detectDevTools() {
  const threshold = 160;
  
  setInterval(() => {
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    
    if (heightThreshold || widthThreshold) {
      if (!devtools.open) {
        devtools.open = true;
        $('body').addClass('devtools-open');
        
        // ✅ Force enable scroll khi DevTools mở
        if (typeof lenis !== 'undefined') {
          lenis.start();
        }
        
        // Reset any scroll locks
        $(window).off('wheel.menuOpen touchmove.menuOpen');
        $(document).off('keydown.menuOpen');
        
        $('html, body').css({
          'overflow': 'auto',
          'position': 'static',
          'padding-right': '0'
        });
      }
    } else {
      if (devtools.open) {
        devtools.open = false;
        $('body').removeClass('devtools-open');
      }
    }
  }, 500);
}
  $(window).resize(function() {
  const windowWidth = $(window).width();
  
  if (windowWidth < 1200) {
    // Mobile/Tablet mode - simplify scroll
    console.log('🔧 Responsive mode detected, adjusting scroll...');
    
    // Reset HTML/body overflow
    $('html, body').css({
      'overflow': 'auto',
      'overflow-x': 'hidden',
      'overflow-y': 'auto',
      'position': 'static',
      'height': 'auto',
      'width': '100%'
    });
    
    // Restart Lenis with simplified settings
    lenis.stop();
    setTimeout(() => {
      lenis.start();
      lenis.resize();
    }, 100);
    
    // Force remove any conflicting classes
    $('body').removeClass('devtools-open');
    $('.lenis').css({
      'overflow': 'auto',
      'height': 'auto'
    });
    
  } else {
    // Desktop mode - normal scroll
    console.log('🖥️ Desktop mode detected');
    lenis.resize();
  }
});
  // Start detection
  detectDevTools();
  function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    outer.parentNode.removeChild(outer);
    
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
      duration: 1.5, // thời gian kéo dài scroll (cao hơn = chậm hơn)
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
      $this.removeClass('open');
      $('.js-site-navbar').fadeOut(400);
      $('body').removeClass('menu-open');
      $('html').removeClass('menu-open');
      isMenuOpen = false;
      isMenuJustClosed = true; // Đánh dấu menu vừa đóng
      $('body').removeClass('menu-open');
$('html').removeClass('menu-open');

// ✅ RESET padding
$('body').css('padding-right', '');
$('.site-header').css('padding-right', '');
$('.container-fluid').css('padding-right', '');
      $(window).off('wheel.menuOpen touchmove.menuOpen');
      $(document).off('keydown.menuOpen');
      // window.scrollTo(0, scrollPosition);

      lenis.start();
      updateHeaderState();
      
      const currentScroll = lenis ? lenis.scroll : (window.pageYOffset || document.documentElement.scrollTop);
      isScrolled = currentScroll > 200;
      if(!$('.site-header').is(':hover')){
        if (isScrolled) {
          $('.js-site-header').addClass('scrolled');
        } else {
          $('.js-site-header').removeClass('scrolled');
      }
      }
    } else {
      $this.addClass('open');
      $('.js-site-navbar').fadeIn(400);
      $('body').addClass('menu-open');
      $('html').addClass('menu-open');
      
      isMenuOpen = true;
      isMenuJustClosed = false;
      const scrollbarWidth = getScrollbarWidth();
$('body').css('padding-right', scrollbarWidth + 'px');
$('.site-header').css('padding-right', scrollbarWidth + 'px');
$('.container-fluid').css('padding-right', scrollbarWidth + 'px');
      // Lưu vị trí scroll hiện tại
    // scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    // KHÓA scroll bằng cách chặn các sự kiện scroll
    $(window).on('wheel.menuOpen', function(e) {
      e.preventDefault();
      return false;
    });
    $(window).on('touchmove.menuOpen', function(e) {
      e.preventDefault();
      return false;
    });
    $(document).on('keydown.menuOpen', function(e) {
      // Disable arrow keys, page up/down, space, home, end
      if([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
        return false;
      }
    });
    lenis.stop();
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