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
  let isMobile = $(window).width() < 1200;
  let lenis = null;
  let rafId = null;
  $(document).ready(function() {
    
    function handleOverlayVisibility() {
    const isMobileOrTablet = $(window).width() <= 1024;
    
    if (isMobileOrTablet) {
      // ✅ Force show overlay on mobile/tablet
      $('.image-container .overlay-content').css({
        'max-height': 'clamp(300px, 70vh, 400px)',
        'opacity': '1',
        'transition': 'none'
      });
      
      $('.image-container .overlay-text').css({
        'transform': 'translateY(0)',
        'transition': 'none'
      });
    } else {
      // ✅ Reset to hover behavior on desktop
      $('.image-container .overlay-content').css({
        'max-height': '',
        'opacity': '',
        'transition': ''
      });
      
      $('.image-container .overlay-text').css({
        'transform': '',
        'transition': ''
      });
    }
  }
  handleOverlayVisibility();
  $(window).resize(handleOverlayVisibility);
    // Reset header state
    isHeaderHidden = false;
    isInitialized = false; 
    $('.js-site-header').removeClass('header-hidden');
    
    // Initialize baseline state
    setTimeout(() => {
      $('.js-site-header').removeClass('scrolled');
      $('.site-header').css('transition', 'all 0.7s ease-in-out');
      $(window).trigger('resize');
      initializeScroll();
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
function updateMenuOverlay() {
  const header = document.querySelector('.site-header');
  const navbar = document.querySelector('.site-navbar');
  const overlay = document.querySelector('.menu-overlay');
  
  if (header && navbar && overlay) {
    // ✅ Force recalculate bằng cách trigger reflow
    header.offsetHeight;
    navbar.offsetWidth;
    
    const headerHeight = header.offsetHeight;
    
    
    // ✅ Cập nhật overlay position
    overlay.style.top = `${headerHeight}px`;
  
    
    
  }
}

// Cập nhật khi resize
$(window).resize(updateMenuOverlay);
$(document).ready(updateMenuOverlay);
  
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
      console.log('✅ Header hidden successfully');
    }
  }

function showHeader() {
  if (isHeaderHidden) {
      $('.js-site-header').css({
        'transform': 'translateY(0)',
        'transition': 'transform 0.7s ease-in-out'
      });
      $('.js-site-header').removeClass('header-hidden');
      isHeaderHidden = false;
      console.log('✅ Header shown successfully');
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
    
    console.log('🎯 handleHeaderScroll called with:', {
    currentScrollY: currentScrollY,
    isMenuOpen: isMenuOpen,
    minScrollDistance: minScrollDistance,
    isHeaderHidden: isHeaderHidden,
    lastScrollY: lastScrollY
  });
    isScrolled = currentScrollY > 200;
    
    if (!isMenuOpen && currentScrollY > minScrollDistance) {
      const scrollVelocity = calculateScrollVelocity(currentScrollY, currentTime);
      const scrollDirection = currentScrollY - lastScrollY;
      const isActuallyScrolling = Math.abs(scrollDirection) > 0.5;
      
      const velocityThreshold = isMobile ? 0.2 : scrollVelocityThreshold;
      console.log('🔍 Scroll analysis:', {
      scrollVelocity: scrollVelocity,
      scrollDirection: scrollDirection,
      velocityThreshold: velocityThreshold,
      isActuallyScrolling: isActuallyScrolling,
      isMobile: isMobile,
      willTrigger: scrollVelocity > velocityThreshold && isActuallyScrolling
    });
      if (scrollVelocity > scrollVelocityThreshold && isActuallyScrolling) {
        if (scrollDirection > 0) {
          console.log('⬇️ Hiding header - scroll down detected');
          hideHeader();
        } else if (scrollDirection < 0) {
          console.log('⬆️ Showing header - scroll up detected');
          showHeader();
        }
      }
    } else if (currentScrollY <= minScrollDistance) {
      console.log('🔝 At top - showing header');
      showHeader();
    }
    
    lastScrollY = currentScrollY;
    lastScrollTime = currentTime;
  }

  const throttledHeaderScroll = throttle(handleHeaderScroll, 8);
  
  // Thêm Lenis smooth scroll
  function initializeScroll() {
    console.log('🔄 Initializing scroll system...');
  console.log('isMobile:', isMobile);
  console.log('Lenis available:', typeof Lenis);
  
  // Cleanup existing
  if (lenis && typeof lenis.destroy === 'function') {
    try {
      lenis.destroy();
      console.log('✅ Previous Lenis instance destroyed');
    } catch (e) {
      console.warn('⚠️ Error destroying lenis:', e);
    }
  }
  lenis = null;
  
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (!isMobile) {
    // ✅ DESKTOP: Use Lenis (existing code)
    console.log('🖥️ Desktop detected - initializing Lenis...');
    
    try {
      if (typeof Lenis === 'undefined') {
        throw new Error('Lenis constructor not available');
      }
      
      lenis = new Lenis({
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
        lerp: 0.1,
        wrapper: window,
        content: document.documentElement,
        wheelEventsTarget: window,
        syncTouch: true,
        normalizeWheel: true,
        gestureDirection: 'vertical',
        smoothWheel: true,
        autoResize: true,
        prevent: (node) => node.classList.contains('no-lenis')
      });

      if (!lenis || typeof lenis.on !== 'function') {
        throw new Error('Lenis instance creation failed');
      }

      console.log('✅ Lenis instance created successfully:', lenis);

      lenis.on('scroll', (e) => {
        const scrollY = e.scroll || 0;
        const currentTime = Date.now();
        
        if (!isInitialized) {
          lastScrollY = scrollY;
          lastScrollTime = currentTime;
          isInitialized = true;
          console.log('📍 Lenis initialized with scroll position:', scrollY);
          return;
        }
        
        isScrolled = scrollY > 200;
        
        if (!isMenuOpen) {
          updateHeaderState();
        }
        
        throttledHeaderScroll(scrollY);
      });

      function raf(time) {
        if (lenis && typeof lenis.raf === 'function') {
          try {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
          } catch (error) {
            console.error('❌ Lenis RAF error:', error);
            initializeNativeScroll();
            return;
          }
        } else {
          console.warn('⚠️ Lenis not available in RAF, falling back');
          initializeNativeScroll();
          return;
        }
      }
      
      rafId = requestAnimationFrame(raf);
      console.log('✅ Lenis RAF loop started');
      
    } catch (error) {
      console.error('❌ Failed to initialize Lenis:', error);
      console.log('🔄 Falling back to native scroll');
      initializeNativeScroll();
    }
  } else {
    // ✅ MOBILE: Use native scroll with proper header logic
    console.log('📱 Mobile detected - using native scroll with header logic');
    initializeNativeScroll();
  }
  
  setTimeout(() => {
    console.log('🔍 Final check - lenis variable:', typeof lenis);
    console.log('🔍 Final check - lenis instance:', lenis);
  }, 500);
}
function initializeNativeScroll() {
  console.log('🔄 Initializing native scroll with header logic...');
  $(window).off('scroll.main');
  
  $(window).on('scroll.main', function() {
    const scrollY = $(this).scrollTop();
    const currentTime = Date.now();
    
    console.log('📱 Mobile scroll event:', {
      scrollY: scrollY,
      isInitialized: isInitialized,
      isMenuOpen: isMenuOpen,
      currentTime: currentTime
    });
    if (!isInitialized) {
      lastScrollY = scrollY;
      lastScrollTime = currentTime;
      isInitialized = true;
      console.log('📍 Native scroll initialized with position:', scrollY);
      return;
    }
    console.log('📱 Processing scroll after initialization...');
    // ✅ CRITICAL: Update isScrolled for mobile
    isScrolled = scrollY > 200;
    
    // ✅ CRITICAL: Update header state for mobile
    if (!isMenuOpen) {
      updateHeaderState();
    }
    
    // ✅ CRITICAL: Apply header hide/show logic on mobile
    throttledHeaderScroll(scrollY);
  });
  
  console.log('✅ Native scroll with header logic initialized');
}

  // Reinitialize on resize
$(window).resize(function() {
  const wasMobile = isMobile;
  isMobile = $(window).width() < 1200;
  
  if (wasMobile !== isMobile) {
    // Screen size category changed
    isInitialized = false;
    if (lenis && typeof lenis.destroy === 'function') {
      try {
        lenis.destroy();
        console.log('✅ Lenis destroyed on resize');
      } catch (e) {
        console.warn('Error destroying lenis on resize:', e);
      }
    }
    lenis = null;
    
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    
    $(window).off('scroll.main');
    
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
    let currentScroll;
    if (lenis && !isMobile) {
      currentScroll = lenis.scroll;
    } else {
      // ✅ Native scroll for mobile
      currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
    }
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

      if(!isMobile && lenis && typeof lenis.start === 'function'){
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
        if (lenis && typeof lenis.start === 'function') {
          try {
            lenis.start();
          } catch (e) {
            console.warn('Error starting lenis:', e);
          }
        }
      }, 50);
        
      } else {
        const currentBodyTop = $('body').css('top');
      let scrollY = 0;
      
      // ✅ Get stored scroll position from body top
      if (currentBodyTop && currentBodyTop !== 'auto') {
        scrollY = Math.abs(parseInt(currentBodyTop) || 0);
      }
      
      console.log('Mobile close menu - restoring scroll to:', scrollY);
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
        if (scrollY > 0) {
        window.scrollTo(0, scrollY);
        document.documentElement.scrollTop = scrollY;
        document.body.scrollTop = scrollY;
      }
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
      // const scrollbarWidth = getScrollbarWidth();
      // $('.navbar-nav').css('padding-right', scrollbarWidth + 'px');
      // $('.container-fluid').css('padding-right', scrollbarWidth + 'px');
      
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
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
      // ✅ Apply fixed position with stored scroll
      $('body').css({
        'overflow': 'hidden',
        'position': 'fixed',
        'top': `-${currentScroll}px`,
        'width': '100%',
        'left': '0',
        'right': '0'
      });
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
  touchDrag: true,      // ✅ Enable touch drag
  mouseDrag: true,      // ✅ Enable mouse drag  
  pullDrag: true,       // ✅ Enable pull drag
  freeDrag: false, 
  touchTreshold: 100,   // ✅ Minimum distance for touch to trigger slide
  dotsSpeed: 400,       // ✅ Speed for dot navigation
  dragEndSpeed: 400, 
  responsive: {
    0: {
      items: 1, // Mobile: 1 item
      margin: 20,
      stagePadding: 30,
      touchDrag: true,     // ✅ Enable touch on mobile
      mouseDrag: false,    // ✅ Disable mouse on mobile
      pullDrag: true,      // ✅ Enable pull
      dotsSpeed: 300, 
    },
    600: {
      items: 1, // Tablet: 1 item
      margin: 30,
      stagePadding: 50,
      touchDrag: true,     // ✅ Enable touch on tablet
      mouseDrag: true, 
    },
    1000: {
      items: 2, // Desktop: 2 items
      margin: 40,
      stagePadding: 0,
      touchDrag: false,    // ✅ Disable touch on desktop
      mouseDrag: true,  
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
  touchDrag: true,      // ✅ Enable touch drag
  mouseDrag: true,      // ✅ Enable mouse drag
  pullDrag: true,       // ✅ Enable pull drag
  freeDrag: false,      // ✅ Disable free drag
  

  touchTreshold: 100,   // ✅ Minimum swipe distance
  dotsSpeed: 400,
  dragEndSpeed: 400,
  responsive: {
    0: {
      items: 1, // Mobile: 1 item
      margin: 0,
      smartSpeed: 1000,
      touchDrag: true,     // ✅ Enable touch on mobile
      mouseDrag: false,    // ✅ Disable mouse on mobile
      pullDrag: true,
    },
    600: {
      items: 1, // Tablet: 1 item  
      margin: 0,
      smartSpeed: 1100,
      touchDrag: true,     // ✅ Enable touch on tablet
      mouseDrag: true,
    },
    1000: {
      items: 1, // Desktop: 1 item
      margin: 0,
      smartSpeed: 1200,
      touchDrag: false,
      mouseDrag: true,
      pullDrag: false, 
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
    anchorPlacement: 'top-bottom',
    disable: false, 
    startEvent: 'DOMContentLoaded'
  });

// For about.html
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('about-page');
});

// For wellness.html  
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('wellness-page');
});

// For events.html
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('events-page');
});

// For dining.html
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('dining-page');
});

// For room detail pages (superior.html, deluxe.html, junior.html, one_bedroom.html)
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('room-detail-page');
});

  
})(jQuery);