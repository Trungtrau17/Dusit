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
      // Force show overlay on mobile/tablet
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
      // Reset to hover behavior on desktop
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
  });

function updateMenuOverlay() {
  const header = document.querySelector('.site-header');
  const navbar = document.querySelector('.site-navbar');
  const overlay = document.querySelector('.menu-overlay');
  
  if (header && navbar && overlay) {
    // Force recalculate bằng cách trigger reflow
    header.offsetHeight;
    navbar.offsetWidth;
    
    const headerHeight = header.offsetHeight;
    // Cập nhật overlay position
    overlay.style.top = `${headerHeight}px`;
  }
}
$(document).ready(function() {
  // Hero Slider với cấu trúc giống events slider
  var heroSlider = $('.hero-slider');
  let currentHeroDotIndex = 0;
  let videoHasPlayed = false;
  if (heroSlider.length) {
    heroSlider.owlCarousel({
      loop: false,
      autoplay: false,
      margin: 0,
      nav: false,
      dots: true,
      items: 1,
      stagePadding: 0,
      smartSpeed: 1500,
      slideBy: 1,
      center: false,
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      touchDrag: true,
      mouseDrag: true,
      pullDrag: true,
      freeDrag: false,
      touchTreshold: 100,
      dotsSpeed: 600,
      dragEndSpeed: 600,
      responsive: {
        0: {
          items: 1,
          margin: 0,
          touchDrag: true,
          mouseDrag: false,
          pullDrag: true,
          dots: true,
          dotsSpeed: 400,

        },
        600: {
          items: 1,
          margin: 0,
          touchDrag: true,
          mouseDrag: true,
          dots: true,
          dotsSpeed: 500,
 
        },
        1000: {
          items: 1,
          margin: 0,
          touchDrag: true,
          mouseDrag: true,
          pullDrag: true,
          dots: true,
        }
      }
    });
    
    const heroVideo = heroSlider.find('.hero-video')[0];
    
    if (heroVideo) {
      // Listen for video ended event
      heroVideo.addEventListener('ended', () => {
        console.log('Video ended - advancing to next slide');
        videoHasPlayed = true;
        heroSlider.trigger('next.owl.carousel');
        
        // Start autoplay cho các slides sau
        setTimeout(() => {
          heroSlider.trigger('play.owl.autoplay', [6000]);
        }, 1000);
      });
      
      
      // Listen for video error
      heroVideo.addEventListener('error', (e) => {
        console.log('Video error - advancing to next slide:', e);
        setTimeout(() => {
          heroSlider.trigger('next.owl.carousel');
        }, 2000);
      });
    }
    // Hero slider progress bar functionality
    function updateHeroProgressBar(dotIndex) {
      const progressBar = heroSlider.find('.owl-dots');
      
      if (progressBar.length) {
        // 2 slides: 0% và 100%
        const positions = [0, 100];
        const position = positions[dotIndex] || 0;
        
        // Set CSS variable and class
        progressBar.css('--hero-active-position', position + '%');
        progressBar[0].style.setProperty('--hero-active-position', position + '%');
        
        progressBar.removeClass('hero-position-0 hero-position-1');
        progressBar.addClass(`hero-position-${dotIndex}`);
        
        currentHeroDotIndex = dotIndex;
        
        // Force repaint
        progressBar[0].offsetHeight;
      }
    }
    
    // Monitor hero dots changes
    function watchHeroDotsChanges() {
      const dotsContainer = heroSlider.find('.owl-dots')[0];
      
      if (dotsContainer) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              checkActiveHeroDot();
            }
          });
        });
        
        const dots = heroSlider.find('.owl-dots .owl-dot');
        dots.each(function(index) {
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
          });
        });
        
        setTimeout(() => {
          checkActiveHeroDot();
        }, 100);
      }
    }
    
    function checkActiveHeroDot() {
      const activeDot = heroSlider.find('.owl-dots .owl-dot.active');
      
      if (activeDot.length) {
        const allDots = heroSlider.find('.owl-dots .owl-dot');
        const activeDotIndex = allDots.index(activeDot);
        
        if (activeDotIndex !== -1) {
          updateHeroProgressBar(activeDotIndex);
        }
      }
    }
    
    // Initialize hero slider
    heroSlider.on('initialized.owl.carousel', function(event) {
      setTimeout(() => {
        watchHeroDotsChanges();
        updateHeroProgressBar(0);
      }, 200);
    });
    
    heroSlider.on('changed.owl.carousel translated.owl.carousel', function(event) {
      setTimeout(() => {
        checkActiveHeroDot();
      }, 50);
    });
    
    // Manual click handling for hero progress bar
    heroSlider.find('.owl-dots').on('click', function(e) {
      const clickX = e.offsetX || (e.originalEvent && e.originalEvent.layerX) || 0;
      const totalWidth = $(this).width();
      
      if (totalWidth > 0) {
        // 2 sections for 2 slides
        const sectionWidth = totalWidth / 2;
        let targetDot = Math.floor(clickX / sectionWidth);
        targetDot = Math.max(0, Math.min(targetDot, 1)); // Clamp to 0-1
        
        const owlDots = heroSlider.find('.owl-dots .owl-dot');
        if (owlDots.eq(targetDot).length) {
          heroSlider.trigger('to.owl.carousel', [targetDot, 1000]);
        }
        
        updateHeroProgressBar(targetDot);
        if (targetDot === 0) {
          videoHasPlayed = false;
          heroSlider.trigger('stop.owl.autoplay');
          if (heroVideo) {
            heroVideo.currentTime = 0;
            setTimeout(() => {
              heroVideo.play().catch(e => console.log('Video replay failed:', e));
            }, 500);
          }
        }
      }
    });
    
    // Auto-play video when slide changes to video
    heroSlider.on('changed.owl.carousel', function(event) {
      const currentSlide = event.item.index;
      if (currentSlide === 0) {
        // Video slide - reset và play video
        if (heroVideo && !videoHasPlayed) {
          heroVideo.currentTime = 0;
          setTimeout(() => {
            heroVideo.play().catch(e => console.log('Video autoplay failed:', e));
          }, 500);
        }
      } else {
        // Non-video slides - pause video
        if (heroVideo) {
          heroVideo.pause();
        }
      }
    });
    
    // Stop autoplay when reaching video slide
    heroSlider.on('translated.owl.carousel', function(event) {
      const currentSlide = event.item.index;
      const currentSlideElement = heroSlider.find('.owl-item').eq(currentSlide);
      const videoElement = currentSlideElement.find('.hero-video');
      
      if (videoElement.length) {
        // Stop autoplay when video slide is active
        heroSlider.trigger('stop.owl.autoplay');
        
        // Resume autoplay after video duration or user interaction
        setTimeout(() => {
          if (!videoElement[0].paused) {
            heroSlider.trigger('play.owl.autoplay', [6000]);
          }
        }, 8000); // Resume after 8 seconds
      }
    });
  }
});
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
    if (isMobile) {
      const headerEl = $('.js-site-header')[0];
      headerEl.style.setProperty('transition', 'transform 0.7s ease-in-out', 'important');
      headerEl.style.setProperty('transform', 'translateY(-100%)', 'important');
    } else {
      // DESKTOP: Keep existing approach
      $('.js-site-header').css({
        'transform': 'translateY(-100%)',
        'transition': 'transform 0.7s ease-in-out',
        'will-change': 'transform'
      });
    }
    
    $('.js-site-header').addClass('header-hidden');
    isHeaderHidden = true;
  }
}

function showHeader() {
  if (isHeaderHidden) {
    if (isMobile) {
      const headerEl = $('.js-site-header')[0];
      headerEl.style.setProperty('transition', 'transform 0.7s ease-in-out', 'important');
      headerEl.style.setProperty('transform', 'translateY(0)', 'important');
    } else {
      // DESKTOP: Keep existing approach
      $('.js-site-header').css({
        'transform': 'translateY(0)',
        'transition': 'transform 0.7s ease-in-out',
        'will-change': 'transform'
      });
    }
    
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
      
      const velocityThreshold = isMobile ? 0.2 : scrollVelocityThreshold;
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
  
  // Thêm Lenis smooth scroll
  function initializeScroll() {
  // Cleanup existing
  if (lenis && typeof lenis.destroy === 'function') {
    try {
      lenis.destroy();
    } catch (e) {
    }
  }
  lenis = null;
  
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (!isMobile) {
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

      lenis.on('scroll', (e) => {
        const scrollY = e.scroll || 0;
        const currentTime = Date.now();
        
        if (!isInitialized) {
          lastScrollY = scrollY;
          lastScrollTime = currentTime;
          isInitialized = true;
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
            initializeNativeScroll();
            return;
          }
        } else {
          initializeNativeScroll();
          return;
        }
      }
      
      rafId = requestAnimationFrame(raf);

    } catch (error) {
      initializeNativeScroll();
    }
  } else {
    initializeNativeScroll();
  }

}

function initializeNativeScroll() {
  $(window).off('scroll.main');
  
  $(window).on('scroll.main', function() {
    const scrollY = $(this).scrollTop();
    const currentTime = Date.now();
    
    if (!isInitialized) {
      lastScrollY = scrollY;
      lastScrollTime = currentTime;
      isInitialized = true;
      return;
    }
    // CRITICAL: Update isScrolled for mobile
    isScrolled = scrollY > 200;
    
    // CRITICAL: Update header state for mobile
    if (!isMenuOpen) {
      updateHeaderState();
    }
    
    // CRITICAL: Apply header hide/show logic on mobile
    throttledHeaderScroll(scrollY);
  });
}

  // Reinitialize on resize
$(window).resize(function() {
  const wasMobile = isMobile;
  isMobile = $(window).width() < 1200;
  
  if (wasMobile !== isMobile) {
    // Screen size category changed
    isInitialized = false;
    const wasHidden = isHeaderHidden;
    
    lenis = null;
    
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    
    $(window).off('scroll.main');
    
    setTimeout(() => {
      // RESTORE: Header state after initialization
      if (wasHidden) {
        hideHeader(); // Re-apply hide with proper transition
      } else {
        showHeader(); // Re-apply show with proper transition
      }
      
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
      // Native scroll for mobile
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
  $('.site-menu-toggle').off('click').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    
    var $this = $(this);
    if ($('body').hasClass('menu-open')) {

      $this.removeClass('open');
      $('.js-site-navbar').fadeOut(400);
      const bodyTop = $('body').css('top');
      let scrollY = 0;
      
      if (bodyTop && bodyTop !== 'auto' && bodyTop !== '0px') {
        scrollY = Math.abs(parseInt(bodyTop) || 0);
      }
      // CRITICAL: Remove all classes immediately
      $('body').removeClass('menu-open');
      $('html').removeClass('menu-open');
      
      // CRITICAL: Remove ALL possible event listeners
      $(window).off('scroll.menuOpen touchmove.menuOpen wheel.menuOpen touchstart.menuOpen');
      $(document).off('keydown.menuOpen touchstart.menuOpen touchmove.menuOpen');
      
      // CRITICAL: Reset ALL styles completely
      $('body, html').css({
        'position': '',
        'top': '',
        'width': '',
        'height': '',
        'overflow': '',
        'overflow-x': '',
        'overflow-y': '',
        'touch-action': '',
        '-webkit-overflow-scrolling': '',
        'overscroll-behavior': '',
        'left': '',
        'right': ''
      });
    //   

    
      if (scrollY > 0) {
        // Multiple methods to ensure scroll restoration
        window.scrollTo(0, scrollY);
        document.documentElement.scrollTop = scrollY;
        document.body.scrollTop = scrollY;
        
        // Force scroll after a small delay
        setTimeout(() => {
          window.scrollTo(0, scrollY);
          document.documentElement.scrollTop = scrollY;
        }, 10);
      }
      // Restart Lenis if available
      if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
        setTimeout(() => {
          try {
            lenis.start();
          } catch (e) {
          
          }
        }, 100);
      }
      
      isMenuOpen = false;
      updateHeaderState();

      
    } else {
      // OPEN MENU - CSS-only approach
      const currentScroll = window.pageYOffset || 
                          document.documentElement.scrollTop || 
                          document.body.scrollTop || 0;
      if (isMobile && isHeaderHidden) {
        const headerEl = $('.js-site-header')[0];
        if (headerEl) {
          headerEl.style.setProperty('transform', 'translateY(0)', 'important');
          $('.js-site-header').removeClass('header-hidden');
          isHeaderHidden = false;
        }
      }
      
      $this.addClass('open');
      $('.js-site-navbar').fadeIn(400);
      $('body').addClass('menu-open');
      $('html').addClass('menu-open');
      if (isMobile) {
        
        // $('.lenis').css({
        //   'position': 'fixed',
        //   // 'top': `-${currentScroll}px`,
        //   // 'left': '0',
        //   // 'right': '0',
        //   // 'width': '100%',
        //   // 'overflow': 'hidden',
        // });
        $('body').css({
          'position': 'fixed',
          'top': `-${currentScroll}px`, // Store scroll position
          'left': '0',
          'right': '0',
          'width': '100%',
          'overflow': 'hidden',
          'touch-action': 'none',
        
        });
        $('html').css({
          'overflow': 'hidden',
          'touch-action': 'none'
        });
      } else {
        // DESKTOP: Stop Lenis and apply position
        if (typeof lenis !== 'undefined' && lenis && typeof lenis.stop === 'function') {
          lenis.stop();
        }
        
        $('body').css({
          'position': 'fixed',
          'top': `-${currentScroll}px`,
          'width': '100%'
        });
        $('html').css('overflow', 'hidden');
      }
      
      isMenuOpen = true;
      updateHeaderState();
      
    }
  });
  

// ADD: Emergency cleanup function
function forceCleanupMenu() {
  
  const bodyTop = $('body').css('top');
  let scrollY = 0;
  
  if (bodyTop && bodyTop !== 'auto' && bodyTop !== '0px') {
    scrollY = Math.abs(parseInt(bodyTop) || 0);
  }
  // Remove all classes
  $('body').removeClass('menu-open');
  $('html').removeClass('menu-open');
  $('.site-menu-toggle').removeClass('open');
  $('.js-site-navbar').hide();
  
  // Remove ALL event listeners
  $(window).off('scroll.menuOpen touchmove.menuOpen wheel.menuOpen touchstart.menuOpen');
  $(document).off('keydown.menuOpen touchstart.menuOpen touchmove.menuOpen keyup.menuOpen');
  
  // Reset ALL styles
  $('body, html').css({
    'position': '',
    'top': '',
    'width': '',
    'height': '',
    'overflow': '',
    'overflow-x': '',
    'overflow-y': '',
    'touch-action': '',
    '-webkit-overflow-scrolling': '',
    'overscroll-behavior': '',
    'left': '',
    'right': ''
  });
  
  if (scrollY > 0) {
    window.scrollTo(0, scrollY);
    document.documentElement.scrollTop = scrollY;
    document.body.scrollTop = scrollY;
    
    setTimeout(() => {
      window.scrollTo(0, scrollY);
      document.documentElement.scrollTop = scrollY;
    }, 10);
  }
  // Reset flags
  isMenuOpen = false;
  
  // Restart Lenis
  if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
    setTimeout(() => {
      try {
        lenis.start();
      } catch (e) {
      
      }
    }, 100);
  }
  

}

// ADD: Auto cleanup on page load
$(document).ready(function() {
  setTimeout(forceCleanupMenu, 500);
  
  // Double tap emergency cleanup
  let tapCount = 0;
  $(document).on('touchend', function() {
    if (window.innerWidth <= 768) {
      tapCount++;
      if (tapCount === 3) { // Triple tap
        forceCleanupMenu();
      }
      setTimeout(() => tapCount = 0, 1000);
    }
  });
});
  // THÊM click overlay để đóng menu
$('.menu-overlay').click(function() {
  if ($('body').hasClass('menu-open')) {
    $('.site-menu-toggle').trigger('click'); // Trigger close menu
  }
});

// THÊM ESC key để đóng menu
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
  touchDrag: true,      // Enable touch drag
  mouseDrag: true,      // Enable mouse drag  
  pullDrag: true,       // Enable pull drag
  freeDrag: false, 
  touchTreshold: 100,   // Minimum distance for touch to trigger slide
  dotsSpeed: 400,       // Speed for dot navigation
  dragEndSpeed: 400, 
  responsive: {
    0: {
      items: 1, // Mobile: 1 item
      margin: 20,
      stagePadding: 0,
      touchDrag: true,     // Enable touch on mobile
      mouseDrag: false,    // Disable mouse on mobile
      pullDrag: true,      // Enable pull
      dots: true,
      dotsSpeed: 300, 
      autoplay: true,      // Enable autoplay on mobile
    },
    600: {
      items: 1, // Tablet: 1 item
      margin: 30,
      stagePadding: 0,
      touchDrag: true,     // Enable touch on tablet
      mouseDrag: true, 
      dots: true,
      dotsSpeed: 300, 
      autoplay: true, 
      
    },
    
    1000: {
      items: 2, // Desktop: 2 items
      margin: 40,
      stagePadding: 0,
      touchDrag: true,    // Disable touch on desktop
      mouseDrag: true,
      dots: false,  
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
  center: true,
  animateOut: false,
  animateIn: false,
  touchDrag: true,      // Enable touch drag
  mouseDrag: true,      // Enable mouse drag
  pullDrag: true,       // Enable pull drag
  freeDrag: false,      // Disable free drag
  stagePadding: 0,

  touchTreshold: 100,   // Minimum swipe distance
  dotsSpeed: 400,
  dragEndSpeed: 400,
  responsive: {
    0: {
      items: 1, // Mobile: 1 item
      margin: 20,
      smartSpeed: 1000,
      touchDrag: true,     // Enable touch on mobile
      mouseDrag: false,    // Disable mouse on mobile
      pullDrag: true,
      dots: true,
      dotsSpeed: 300,
      autoplay: true,
    },
    600: {
      items: 1, // Tablet: 1 item  
      margin: 50,
      smartSpeed: 1100,
      touchDrag: true,     // Enable touch on tablet
      mouseDrag: true,
      dots: true,
      dotsSpeed: 300,
      autoplay: true,
    },
    1000: {
      items: 1, // Desktop: 1 item
      margin: 0,
      smartSpeed: 1200,
      touchDrag: true,
      mouseDrag: true,
      pullDrag: false, 
      dots: false,
      dotsSpeed: 300,
      autoplay: false,
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
  };

  // Navigation events cho section-2 (wellness) - QUAN TRỌNG: chỉ target buttons trong section-2
  $('.section-2 .nav-button.prev').off('click').on('click', function(e) {
    e.preventDefault();
    weSlidePrev();
  });

  $('.section-2 .nav-button.next').off('click').on('click', function(e) {
    e.preventDefault();
    weSlideNext();
  });

$(document).ready(function() {
  var accommodationSlider = $('.accommodation-slider');
  let currentAccommodationDotIndex = 0;
  
  if (accommodationSlider.length && $(window).width() <= 950) {
    
    function updateAccommodationProgressBar(dotIndex) {
      const progressBar = accommodationSlider.find('.owl-dots');
      
      if (progressBar.length) {
        // Calculate positions for 4 slides: 0%, 25%, 50%, 75%
        const positions = [0, 25, 50, 75];
        const position = positions[dotIndex] || 0;
        
        // Set CSS variable and class
        progressBar.css('--accommodation-active-position', position + '%');
        progressBar[0].style.setProperty('--accommodation-active-position', position + '%');
        
        progressBar.removeClass('accommodation-position-0 accommodation-position-1 accommodation-position-2 accommodation-position-3');
        progressBar.addClass(`accommodation-position-${dotIndex}`);
        
        currentAccommodationDotIndex = dotIndex;
        
        // Force repaint
        progressBar[0].offsetHeight;
      }
    }
    
    function watchAccommodationDotsChanges() {
      const dotsContainer = accommodationSlider.find('.owl-dots')[0];
      
      if (dotsContainer) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              checkActiveAccommodationDot();
            }
          });
        });
        
        const dots = accommodationSlider.find('.owl-dots .owl-dot');
        dots.each(function(index) {
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
          });
        });
        
        setTimeout(() => {
          checkActiveAccommodationDot();
        }, 100);
      }
    }
    
    function checkActiveAccommodationDot() {
      const activeDot = accommodationSlider.find('.owl-dots .owl-dot.active');
      
      if (activeDot.length) {
        const allDots = accommodationSlider.find('.owl-dots .owl-dot');
        const activeDotIndex = allDots.index(activeDot);
        
        if (activeDotIndex !== -1 && activeDotIndex !== currentAccommodationDotIndex) {
          updateAccommodationProgressBar(activeDotIndex);
        }
      }
    }
    
    // Manual click handling for accommodation progress bar
    accommodationSlider.find('.owl-dots').on('click', function(e) {
      const clickX = e.offsetX || (e.originalEvent && e.originalEvent.layerX) || 0;
      const totalWidth = $(this).width();
      
      if (totalWidth > 0) {
        const sectionWidth = totalWidth / 4; // 4 sections for 4 rooms
        let targetDot = Math.floor(clickX / sectionWidth);
        targetDot = Math.max(0, Math.min(targetDot, 3)); // Clamp to 0-3
        
        const owlDots = accommodationSlider.find('.owl-dots .owl-dot');
        if (owlDots.eq(targetDot).length) {
          accommodationSlider.trigger('to.owl.carousel', [targetDot, 1000]);
        }
        
        updateAccommodationProgressBar(targetDot);
      }
    });
    
    // Initialize
    accommodationSlider.on('initialized.owl.carousel', function(event) {
      setTimeout(() => {
        watchAccommodationDotsChanges();
        updateAccommodationProgressBar(0);
      }, 200);
    });
    
    accommodationSlider.on('changed.owl.carousel translated.owl.carousel', function(event) {
      setTimeout(() => {
        checkActiveAccommodationDot();
      }, 50);
    });
  }
  
  // Add wellness progress bar functionality
  var weSlider = $('.we-slider');
  let currentWellnessDotIndex = 0;
  
  if (weSlider.length && $(window).width() <= 950) {
    
    function updateWellnessProgressBar(dotIndex) {
      const progressBar = weSlider.find('.owl-dots');
      
      if (progressBar.length) {
        // Calculate positions for 3 slides: 0%, 33.333%, 66.666%
        const positions = [0, 33.333, 66.666];
        const position = positions[dotIndex] || 0;
        
        // Set CSS variable and class
        progressBar.css('--wellness-active-position', position + '%');
        progressBar[0].style.setProperty('--wellness-active-position', position + '%');
        
        progressBar.removeClass('wellness-position-0 wellness-position-1 wellness-position-2');
        progressBar.addClass(`wellness-position-${dotIndex}`);
        
        currentWellnessDotIndex = dotIndex;
        
        // Force repaint
        progressBar[0].offsetHeight;
      }
    }
    
    function watchWellnessDotsChanges() {
      const dotsContainer = weSlider.find('.owl-dots')[0];
      
      if (dotsContainer) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              checkActiveWellnessDot();
            }
          });
        });
        
        const dots = weSlider.find('.owl-dots .owl-dot');
        dots.each(function(index) {
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
          });
        });
        
        setTimeout(() => {
          checkActiveWellnessDot();
        }, 100);
      }
    }
    
    function checkActiveWellnessDot() {
      const activeDot = weSlider.find('.owl-dots .owl-dot.active');
      
      if (activeDot.length) {
        const allDots = weSlider.find('.owl-dots .owl-dot');
        const activeDotIndex = allDots.index(activeDot);
        
        if (activeDotIndex !== -1 && activeDotIndex !== currentWellnessDotIndex) {
          updateWellnessProgressBar(activeDotIndex);
        }
      }
    }
    
    // Manual click handling for wellness progress bar
    weSlider.find('.owl-dots').on('click', function(e) {
      const clickX = e.offsetX || (e.originalEvent && e.originalEvent.layerX) || 0;
      const totalWidth = $(this).width();
      
      if (totalWidth > 0) {
        const sectionWidth = totalWidth / 3; // 3 sections for 3 wellness items
        let targetDot = Math.floor(clickX / sectionWidth);
        targetDot = Math.max(0, Math.min(targetDot, 2)); // Clamp to 0-2
        
        const owlDots = weSlider.find('.owl-dots .owl-dot');
        if (owlDots.eq(targetDot).length) {
          weSlider.trigger('to.owl.carousel', [targetDot, 1000]);
        }
        
        updateWellnessProgressBar(targetDot);
      }
    });
    
    // Initialize
    weSlider.on('initialized.owl.carousel', function(event) {
      setTimeout(() => {
        watchWellnessDotsChanges();
        updateWellnessProgressBar(0);
      }, 200);
    });
    
    weSlider.on('changed.owl.carousel translated.owl.carousel', function(event) {
      setTimeout(() => {
        checkActiveWellnessDot();
      }, 50);
    });
  }
});
$(window).resize(function() {
  const isMobileTablet = $(window).width() <= 950;
  
  if (isMobileTablet) {
    // Enable progress bars trên mobile/tablet
    $('.accommodation-slider, .we-slider').each(function() {
      const $slider = $(this);
      setTimeout(() => {
        $slider.trigger('refresh.owl.carousel');
      }, 100);
    });
  }
});


$(document).ready(function(){
  var diningSlider = $('.dining-slider');
  let isDiningSliding = false;
  let currentDiningDotIndex = 0;
  if (diningSlider.length) {
    diningSlider.owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 4500,
      autoplayHoverPause: true,
      margin: 10, // Giữ gap như hiện tại
      nav: false,
      dots: true,
      items: 3, // Hiển thị 3 items trên desktop
      stagePadding: 0,
      smartSpeed: 1000,
      slideBy: 3,
      center: false,
      animateOut: false,
      animateIn: false,
      touchDrag: true,
      mouseDrag: true,
      pullDrag: true,
      freeDrag: false,
      touchTreshold: 100,
      dotsSpeed: 400,
      dragEndSpeed: 400,
      responsive: {
        0: {
          items: 1, // Mobile: 1 item
          margin: 20,
          touchDrag: true,
          mouseDrag: false,
          pullDrag: true,
          dots: true,
          dotsSpeed: 300,
          autoplay: true,
          autoplayTimeout: 3000,
          slideBy: 1,
        },
        600: {
          items: 2, // Tablet: 2 items
          margin: 10,
          touchDrag: true,
          mouseDrag: true,
          dots: true,
          dotsSpeed: 300,
          autoplay: true,
          autoplayTimeout: 3500,
          slideBy: 2,
        },
        1000: {
          items: 3, // Desktop: 3 items
          margin: 10,
          touchDrag: true,
          mouseDrag: true,
          pullDrag: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4500,
          slideBy: 3, 
        }
      }
    });
    function getDiningProgressInfo() {
      const screenWidth = $(window).width();
      let totalDots, segmentWidth, deviceType;
      
      // Count actual dots on screen
      const actualDots = diningSlider.find('.owl-dots .owl-dot').length;
      
      if (screenWidth < 600) {
        // Mobile: 1 item = 6 dots (giả sử có 6 dining items)
        totalDots = actualDots; // Dùng số dots thực tế
        segmentWidth = 100 / totalDots; // 100% / số dots
        deviceType = 'mobile';
      } else if (screenWidth < 1000) {
        // Tablet: 2 items = 3 dots
        totalDots = actualDots;
        segmentWidth = 100 / totalDots;
        deviceType = 'tablet';
      } else {
        // Desktop: 3 items = 2 dots
        totalDots = actualDots;
        segmentWidth = 100 / totalDots;
        deviceType = 'desktop';
      }
      
      return {
        totalDots: totalDots,
        segmentWidth: segmentWidth,
        deviceType: deviceType
      };
    }
    
    function updateDiningProgressBar(dotIndex) {
      const progressBar = diningSlider.find('.owl-dots');
      const progressInfo = getDiningProgressInfo();
      
      if (progressBar.length) {
        // Tính toán position dựa vào dot index
        const translatePercent = dotIndex * 100; // Mỗi dot = 1 segment = 100%
        
        // Set CSS variables
        progressBar.css('--dining-active-position', translatePercent + '%');
        progressBar.css('--dining-segment-width', progressInfo.segmentWidth + '%');
        
        progressBar[0].style.setProperty('--dining-active-position', translatePercent + '%');
        progressBar[0].style.setProperty('--dining-segment-width', progressInfo.segmentWidth + '%');
        
        // Remove all position classes
        progressBar.removeClass((index, className) => {
          return (className.match(/(^|\s)dining-\w+-position-\d+/g) || []).join(' ');
        });
        
        // Add appropriate position class
        progressBar.addClass(`dining-${progressInfo.deviceType}-position-${dotIndex}`);
        
        currentDiningDotIndex = dotIndex;
        
        // Force repaint
        progressBar[0].offsetHeight;
      }
    }
    
    // Monitor dining dots changes
    function watchDiningDotsChanges() {
      const dotsContainer = diningSlider.find('.owl-dots')[0];
      
      if (dotsContainer) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              checkActiveDiningDot();
            }
          });
        });
        
        const dots = diningSlider.find('.owl-dots .owl-dot');
        dots.each(function(index) {
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
          });
        });
        
        setTimeout(() => {
          checkActiveDiningDot();
        }, 100);
      }
    }
    
    function checkActiveDiningDot() {
      const activeDot = diningSlider.find('.owl-dots .owl-dot.active');
      
      if (activeDot.length) {
        const allDots = diningSlider.find('.owl-dots .owl-dot');
        const activeDotIndex = allDots.index(activeDot);
        
        if (activeDotIndex !== -1) {
          updateDiningProgressBar(activeDotIndex);
        }
      }
    }
    
    // Initialize dining slider
    diningSlider.on('initialized.owl.carousel', function(event) {
      setTimeout(() => {
        watchDiningDotsChanges();
        updateDiningProgressBar(0);
      }, 200);
    });
    
    diningSlider.on('changed.owl.carousel translated.owl.carousel', function(event) {
      setTimeout(() => {
        checkActiveDiningDot();
      }, 50);
    });
    
    // Enhanced manual click handling
    diningSlider.find('.owl-dots').on('click', function(e) {
      const clickX = e.offsetX || (e.originalEvent && e.originalEvent.layerX) || 0;
      const totalWidth = $(this).width();
      const progressInfo = getDiningProgressInfo();
      
      if (totalWidth > 0) {
        const sectionWidth = totalWidth / progressInfo.totalDots;
        let targetDot = Math.floor(clickX / sectionWidth);
        targetDot = Math.max(0, Math.min(targetDot, progressInfo.totalDots - 1));
        
        const owlDots = diningSlider.find('.owl-dots .owl-dot');
        if (owlDots.eq(targetDot).length) {
          diningSlider.trigger('to.owl.carousel', [targetDot, 1000]);
        }
        
        updateDiningProgressBar(targetDot);
      }
    });
    
    // Update on window resize
    $(window).resize(function() {
      setTimeout(() => {
        checkActiveDiningDot();
      }, 300);
    });
  }
});

$(document).ready(function() {
  var eventsSlider = $('.events-slider');
  let currentDotIndex = 0;
  let totalDots = 3;
  if (eventsSlider.length) {
    eventsSlider.owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplayHoverPause: true,
      margin: 10,
      nav: false,
      dots: true,
      items: 1,
      stagePadding: 0,
      smartSpeed: 1000,
      slideBy: 1,
      center: false,
      animateOut: false,
      animateIn: false,
      touchDrag: true,
      mouseDrag: true,
      pullDrag: true,
      freeDrag: false,
      touchTreshold: 100,
      dotsSpeed: 400,
      dragEndSpeed: 400,
      responsive: {
        0: {
          items: 1,
          margin: 5,
          touchDrag: true,
          mouseDrag: false,
          pullDrag: true,
          dots: true,
          dotsSpeed: 300,
          autoplay: true,
          autoplayTimeout: 3000,
        },
        600: {
          items: 1,
          margin: 10,
          touchDrag: true,
          mouseDrag: true,
          dots: true,
          dotsSpeed: 300,
          autoplay: true,
          autoplayTimeout: 3500,
        },
        1000: {
          items: 1,
          margin: 10,
          touchDrag: true,
          mouseDrag: true,
          pullDrag: true,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4000,
        }
      }
    });
    // Events slider event tracking
    function updateEventsProgressBar(dotIndex) {
      const progressBar = eventsSlider.find('.owl-dots');
      
      if (progressBar.length) {
        // Simple calculation: dot 0 = 0%, dot 1 = 33.333%, dot 2 = 66.666%
        const positions = [0, 33.333, 66.666];
        const position = positions[dotIndex] || 0;
        
        // Set CSS variable and class
        progressBar.css('--active-position', position + '%');
        progressBar[0].style.setProperty('--active-position', position + '%');
        
        progressBar.removeClass('position-0 position-1 position-2');
        progressBar.addClass(`position-${dotIndex}`);
        
        currentDotIndex = dotIndex;
        
        // Force repaint
        progressBar[0].offsetHeight;
      }
    }
    
    // Monitor dots changes with MutationObserver
    function watchDotsChanges() {
      const dotsContainer = eventsSlider.find('.owl-dots')[0];
      
      if (dotsContainer) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              // Check which dot is currently active
              checkActiveDot();
            }
          });
        });
        
        // Observe all dot elements
        const dots = eventsSlider.find('.owl-dots .owl-dot');
        dots.each(function(index) {
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
          });
        });
        
        // Initial check
        setTimeout(() => {
          checkActiveDot();
        }, 100);
      }
    }
    
    // Function to check which dot is active
    function checkActiveDot() {
      const activeDot = eventsSlider.find('.owl-dots .owl-dot.active');
      
      if (activeDot.length) {
        const allDots = eventsSlider.find('.owl-dots .owl-dot');
        const activeDotIndex = allDots.index(activeDot);
        
        if (activeDotIndex !== -1 && activeDotIndex !== currentDotIndex) {
          updateEventsProgressBar(activeDotIndex);
        
        }
      }
    }
    
    // Initialize
    eventsSlider.on('initialized.owl.carousel', function(event) {
  
      
      // Start watching dots after initialization
      setTimeout(() => {
        watchDotsChanges();
        updateEventsProgressBar(0); // Set initial position
      }, 200);
    });
    
    // Backup: Also listen to carousel events
    eventsSlider.on('changed.owl.carousel', function(event) {
      // Small delay to ensure dots are updated
      setTimeout(() => {
        checkActiveDot();
      }, 50);
    });
    
    eventsSlider.on('translated.owl.carousel', function(event) {
      // Another check after animation completes
      setTimeout(() => {
        checkActiveDot();
      }, 100);
    });
    
    // Enhanced manual click handling - mimic dot clicks
    eventsSlider.find('.owl-dots').on('click', function(e) {
      const clickX = e.offsetX || e.originalEvent.layerX || 0;
      const totalWidth = $(this).width();
      
      if (totalWidth > 0) {
        // Calculate which section was clicked (0, 1, 2)
        const sectionWidth = totalWidth / 3;
        let targetDot = Math.floor(clickX / sectionWidth);
        targetDot = Math.max(0, Math.min(targetDot, 2)); // Clamp to 0-2
        
      
        
        // Simulate clicking the actual owl dot
        const owlDots = eventsSlider.find('.owl-dots .owl-dot');
        if (owlDots.eq(targetDot).length) {
          eventsSlider.trigger('to.owl.carousel', [targetDot, 1000]);
        }
        
        // Immediately update progress bar for instant feedback
        updateEventsProgressBar(targetDot);
      }
    });
    
    // ENHANCED: Monitor for DOM changes in dots
    const observer = new MutationObserver(function(mutations) {
      let shouldCheck = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck) {
        setTimeout(() => {
          checkActiveDot();
        }, 10);
      }
    });
    
    // Start observing the dots container
    setTimeout(() => {
      const dotsContainer = eventsSlider.find('.owl-dots')[0];
      if (dotsContainer) {
        observer.observe(dotsContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class']
        });
      }
    }, 500);
    
  } 
});
$(document).ready(function() {  
  setTimeout(() => {
    if (typeof Fancybox !== 'undefined') {
      try {
        Fancybox.destroy();
      } catch (e) {
        console.log('No existing Fancybox instances to destroy');
      }
      
      // Initialize new instance
      Fancybox.bind('.events-image .owl-item:not(.cloned) [data-fancybox="gallery-lounge"]', {
        // Infinite gallery
        infinite: true,
        // Toolbar buttons
        Toolbar: {
          display: {
            left: ["counter"],
            middle: [],
            right: ["slideshow", "thumbs", "close"],
          },
        },
        
        // Thumbs configuration
        Thumbs: {
          type: "classic",
          autoStart: true,
          hideOnClose: true,
          axis: "x",
        },
        
        // Image settings
        Images: {
          zoom: true,
          Panzoom: {
            wheelAction: false,      // TẮT zoom bằng scroll wheel
            panOnlyZoomed: true,     // Chỉ cho phép pan khi đã zoom
            wheelSpeed: 0,           // Set wheel speed = 0
            wheel: false,         
          }
        },
        contentClick: "toggleZoom",
        backdropClick: "close",
        hideScrollbar: false,
        // Animation
        showClass: "f-fadeIn",
        hideClass: "f-fadeOut",
        keyboard: {
          Escape: "close",
          Delete: "close", 
          Backspace: "close",
          PageUp: "prev",
          PageDown: "next",
          ArrowLeft: "prev",
          ArrowRight: "next",
        },
        
        // Events
        on: {
          // Before show
          init: () => {
            // dừng autoplay và chặn tương tác kéo
            $('.owl-carousel').trigger('stop.owl.autoplay');
            document.body.classList.add('fancybox-open');
            const currentScroll = window.pageYOffset || 
                                document.documentElement.scrollTop || 
                                document.body.scrollTop || 0;
            
            if (isMobile) {
              // MOBILE: Áp dụng logic giống menu mobile
              $('body').css({
                'position': 'fixed',
                'top': `-${currentScroll}px`,
                'left': '0',
                'right': '0',
                'width': '100%',
                'overflow': 'hidden',
                'touch-action': 'none',
              });
              $('html').css({
                'overflow': 'hidden',
                'touch-action': 'none'
              });
            } else {
              // DESKTOP: Stop Lenis và apply position giống menu desktop
              if (typeof lenis !== 'undefined' && lenis && typeof lenis.stop === 'function') {
                lenis.stop();
              }
              
              $('body').css({
                'position': 'fixed',
                'top': `-${currentScroll}px`,
                'width': '100%'
              });
              $('html').css('overflow', 'hidden');
            }
          },
          destroy: () => {
            $('.owl-carousel').trigger('play.owl.autoplay');
            document.body.classList.remove('fancybox-open');
            const bodyTop = $('body').css('top');
            let scrollY = 0;
            
            if (bodyTop && bodyTop !== 'auto' && bodyTop !== '0px') {
              scrollY = Math.abs(parseInt(bodyTop) || 0);
            }
            
            // Fallback: sử dụng data attribute
            if (scrollY === 0) {
              scrollY = parseInt(document.body.getAttribute('data-fancybox-scroll-y') || '0');
            }
            $('body, html').css({
              'position': '',
              'top': '',
              'width': '',
              'height': '',
              'overflow': '',
              'overflow-x': '',
              'overflow-y': '',
              'touch-action': '',
              '-webkit-overflow-scrolling': '',
              'overscroll-behavior': '',
              'left': '',
              'right': ''
            });
            
            // 4. KHÔI PHỤC SCROLL POSITION
            if (scrollY > 0) {
              // Multiple methods để đảm bảo scroll restoration
              window.scrollTo(0, scrollY);
              document.documentElement.scrollTop = scrollY;
              document.body.scrollTop = scrollY;
              
              // Force scroll sau delay nhỏ
              setTimeout(() => {
                window.scrollTo(0, scrollY);
                document.documentElement.scrollTop = scrollY;
              }, 10);
            }
            
            // 5. KHÔI PHỤC LENIS NẾU CÓ (GIỐNG MENU)
            if (typeof lenis !== 'undefined' && lenis && typeof lenis.start === 'function') {
              setTimeout(() => {
                try {
                  lenis.start();
                } catch (e) {
                  console.log('Lenis restart failed:', e);
                }
              }, 100);
            }
          }
        },
      });
    } else {
      console.error('Fancybox not found');
    }
  }, 200);
  


});


  function initAOS() {
  const isMobileDevice = window.innerWidth < 1024;
  
  if (isMobileDevice) {
    // MOBILE: Enable AOS với settings tối ưu cho mobile
    AOS.init({
      duration: 800,        // Nhanh hơn cho mobile
      easing: 'ease-in-out',
      once: true,
      delay: 0,             // Không delay trên mobile
      offset: 80,           // Trigger sớm hơn trên mobile
      mirror: false,
      anchorPlacement: 'top-bottom',
      disable: false,       //Enable AOS trên mobile
      startEvent: 'DOMContentLoaded',
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99
    });
  } else {
    // DESKTOP: Settings như cũ
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      delay: 0,
      offset: 120,
      mirror: false,
      anchorPlacement: 'top-bottom',
      disable: false
    });
  }
}

// Initialize AOS
initAOS();

// Reinitialize AOS on window resize
$(window).resize(function() {
  // Debounce resize để tránh spam
  clearTimeout(window.aosResizeTimeout);
  window.aosResizeTimeout = setTimeout(() => {
    initAOS();
    AOS.refresh(); // Refresh để recalculate positions
  }, 150);
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