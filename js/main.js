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

  // const languageData = {
  //   en: {
  //     // Common navigation
  //     nav: {
  //       menu: "MENU",
  //       close: "CLOSE",
  //       bookNow: "BOOK NOW",
  //       about: "ABOUT",
  //       collection: "OUR COLLECTION",
  //       dining: "DINING",
  //       wellness: "WELLNESS",
  //       events: "EVENTS",
  //       contact: "CONTACT",
  //       languageEN: "English",
  //       languageVN: "Vietnamese"
  //     },
      
  //     // Page-specific hero titles
  //     hero: {
  //       home: "Dusit Le Palais Tu Hoa Ha Noi",
  //       about: "About Dusit<br>Le Palais Tu Hoa Ha Noi",
  //       dining: "Dining at Dusit<br>Le Palais Tu Hoa Ha Noi",
  //       wellness: "Wellness at Dusit<br>Le Palais Tu Hoa Ha Noi",
  //     },
      
  //     // Page-specific embracing content
  //     embracing: {
  //       home: {
  //         title: "Embracing the Tu Hoa Legacy",
  //         content: "Step into Princess Tu Hoa's palace by West Lake, where 207 elegant rooms offer serene views and cultural charm. Enjoy diverse dining from Thai to Italian, and experience a blend of modern luxury and sophistication.",
  //         button: "HER STORY"
  //       },
  //       about: {
  //         title: "Her Story",
  //         content: "Inspired by the timeless legacy of Princess Tu Hoa, Dusit Le Palais Tu Hoa Hanoi weaves a rich tapestry of heritage with contemporary luxury. Nestled gracefully by the serene West Lake, our hotel offers an elegant retreat where tradition meets innovation, reflecting the cultural essence of Hanoi in every detail."
  //       },
  //       collection: {
  //         title: "Our Collection",
  //         content: "With 207 thoughtfully designed rooms and suites, it caters to every traveler—whether for business, leisure, or a romantic escape."
  //       },
  //       dining: {
  //         title: "Explore Our Dining",
  //         content: "Discover an array of elegant venues offering diverse culinary delights, each designed to elevate your dining experience with refined luxury and exceptional taste."
  //       },
  //       wellness: {
  //         title: "Our Wellness Essence",
  //         content: "At Dusit Le Palais Tu Hoa Hanoi, our wellness offerings are designed to nurture your body and soul, blending traditional relaxation with modern rejuvenation."
  //       },
  //       events: {
  //         title: "Memorable Events",
  //         content: "From intimate gatherings to grand celebrations, our versatile event spaces provide the perfect backdrop for your special moments."
  //       },
  //       contact: {
  //         title: "Discover Our Location",
  //         content: "Experience the charm of Dusit Le Palais Tu Hoa Hanoi, ideally situated by the serene West Lake, offering easy access to the city's cultural landmarks."
  //       }
  //     },
      
  //     // Common sections
  //     accommodation: {
  //       title: "Accommodation",
  //       viewMore: "VIEW MORE",
  //       rooms: {
  //         deluxe: {
  //           title: "Deluxe",
  //           description: "Breathtaking views, modern comforts, and a relaxing retreat."
  //         },
  //         junior: {
  //           title: "Junior Suite",
  //           description: "A tranquil retreat with a spacious layout and kitchen."
  //         },
  //         superior: {
  //           title: "Superior",
  //           description: "Exquisite luxury room with elegant amenities for a restful stay."
  //         },
  //         oneBedroom: {
  //           title: "One Bedroom Suite",
  //           description: "Elegant, cozy room with premium amenities and bathtub."
  //         }
  //       }
  //     },
      
  //     dining: {
  //       title: "Dining Experiences",
  //       subtitle: "Savor every moment in spaces crafted for connection and cuisine.",
  //       hero: "More than dining – It's an atmosphere to remember.",
  //       restaurants: {
  //         soi: {
  //           title: "SOI Restaurant",
  //           description: "Soi revives authentic Thai cuisine with bold flavors, fresh ingredients, and exquisite presentation. Its vibrant ambiance lifts classics."
  //         },
  //         gourmet: {
  //           title: "Dusit Gourmet",
  //           description: "A chic café serving fresh pastries, gourmet sandwiches, premium coffee, and artisanal teas. Perfect for quick bites or afternoon tea."
  //         },
  //         palais: {
  //           title: "Palais",
  //           description: "Our Lobby Bar offers a relaxed, elegant space to enjoy afternoon tea or drinks – an ideal spot to unwind and savour the moment."
  //         }
  //       }
  //     },
      
  //     wellness: {
  //       title: "Wellness & Lifestyle",
  //       facilities: {
  //         gym: {
  //           title: "GYM Centre",
  //           description: "Maintain your fitness and unwind with our exceptional facilities. Enjoy our well-equipped Fitness Centre – the perfect balance of activity and relaxation."
  //         },
  //         pool: {
  //           title: "Swimming Pool",
  //           description: "Relax and unwind in our stunning swimming pool, surrounded by lush gardens and offering a serene escape from the city."
  //         },
  //         onsen: {
  //           title: "Onsen",
  //           description: "Indulge in an authentic Onsen experience with soothing hot springs, luxurious bath amenities, and a tranquil garden view."
  //         }
  //       }
  //     },
  //     events: {
  //       title: "Event",
  //       facilities: {
  //         mice: {
  //           title: "MICE",
  //           description: "From corporate meetings to grand weddings, our ballrooms, meeting rooms, and rooftop event space provide the perfect backdrop for unforgettable moments — all supported by state-of-the-art facilities and breathtaking views."
  //         }
  //       }
  //     },
      
  //     footer: {
  //       explore: {
  //         title: "Explore",
  //         links: ["Our Collection", "Dining", "Contact"]
  //       },
  //       followUs: {
  //         title: "Follow Us"
  //       },
  //       contact: {
  //         title: "Get In Touch",
  //         address: "Address: 9 Alley 431,<br>Au Co Street, Ha Noi, Viet Nam",
  //         phone: "Phone: +84 24 3200 2222",
  //         email: "Email: dphv@dusit.com"
  //       },
  //       newsletter: {
  //         title: "Sign up for our newsletter",
  //         placeholder: "Email..."
  //       },
  //       copyright: "Dusit Le Palais Tu Hoa Hanoi. All rights reserved"
  //     },
  //     contact_page: {
  //       title: "Contact Us",
  //       locationTitle: "Discover Our Location",
  //       locationContent: "Located in the scenic West Lake area on Au Co Street, Dusit Le Palais Tu Hoa Hanoi offers a serene, luxurious atmosphere with stunning views of West Lake. Just 22 km from the airport, a 20-minute drive away.",
  //       mapTitle: "Contact Us",
  //       address: "Address: 9 Alley 431, Au Co Street, West Lake, Ha Noi, Viet Nam",
  //       phone: "Phone: +84 24 3200 2222",
  //       email: "Email: dphv@dusit.com",
  //       directions: "Get Directions",
  //       breadcrumb: "Contact",
  //       reserveTitle: "A Best Place To Stay. Reserve Now!",
  //       reserveBtn: "Reserve Now"
  //     },

  //     collection_page: {
  //       title: "Our Collection",
  //       content: "With 207 thoughtfully designed rooms and suites, it caters to every traveler—whether for business, leisure, or a romantic escape.",
  //       breadcrumb: "Our Collection",
  //       rooms: {
  //         superior: {
  //           title: "Superior",
  //           size: "28 - 31 sqm",
  //           quantity: "154",
  //           description: "Combining thoughtfully chosen amenities with a touch of luxury, it is the ideal choice for a restful and enjoyable stay."
  //         },
  //         deluxe: {
  //           title: "Deluxe", 
  //           size: "34 - 43 sqm",
  //           quantity: "27",
  //           description: "Soak up panoramic city or lake views, relax in a luxurious bath, and enjoy modern conveniences. Our room is the perfect place to relax or recharge."
  //         },
  //         junior: {
  //           title: "Junior Suite",
  //           size: "50 - 58 sqm", 
  //           quantity: "16",
  //           description: "Unwind in a soothing bathtub and enjoy the convenience of a kitchen area. Its unique design and spacious layout create the perfect retreat."
  //         },
  //         oneBedroom: {
  //           title: "One Bedroom Suite",
  //           size: "51 - 64 sqm",
  //           quantity: "10", 
  //           description: "Experience refined luxury with a cozy bedroom, relaxing bathtub, and premium amenities – an elegant retreat for an unforgettable stay."
  //         }
  //       },
  //       roomLabels: {
  //         size: "SIZE",
  //         quantity: "QUANTITY"
  //       }
  //     },

  //     about_page: {
  //       title: "About Dusit Le Palais Tu Hoa Ha Noi",
  //       story: "Her Story",
  //       storyContent: "Inspired by the timeless legacy of Princess Tu Hoa, Dusit Le Palais Tu Hoa Hanoi weaves a rich tapestry of heritage with contemporary luxury. Nestled gracefully by the serene West Lake, our hotel offers an elegant retreat where tradition meets innovation, reflecting the cultural essence of Hanoi in every detail.",
  //       breadcrumb: "About",
  //       sections: {
  //         historical: {
  //           title: "Historical Inspiration and the Essence of Our Hotel",
  //           content: "Our hotel is inspired by Princess Tu Hoa, a 12th-century daughter of King Ly Than Tong, who pioneered Vietnam's silk industry by establishing the Tam Tang camp by West Lake to teach silk-making. Her spirit of dedication and creativity drives our hotel's vision. Nearby, the 1,000-year-old Kim Lien Pagoda honors her legacy. Through Tu Hoa Palace, we aim to recreate her father's palace, a hub for welcoming visitors and sharing Vietnamese culture and her unique hospitality."
  //         },
  //         architectural: {
  //           title: "Architectural Grandeur and Exquisite Spaces", 
  //           content: "Dusit Le Palais Tu Hoa Hanoi graces a 4,000 m² estate with three basement levels and nine floors, offering 207 exquisitely designed rooms and suites. Its architecture mirrors an ancient palace, blending contemporary Vietnamese style with Ly and Tran dynasty influences—vaulted ceilings, wave motifs, and soft curves—creating a luxurious space steeped in cultural heritage."
  //         },
  //         location: {
  //           title: "Prime Geographic Locale",
  //           content: "Nestled by the scenic West Lake, Tu Hoa Palace blends natural serenity with city vibrancy, just 15–20 minutes from the airport and 10–15 minutes from the Old Quarter. Positioned like a tranquil oasis with panoramic views of the lake, a floral valley, and the historic Old Quarter, it offers over 20 unique room layouts across Superior, Deluxe, and Suite categories. Each stay brings a fresh experience—varying views and designs at the same pricing—making it a distinctive feature of the hotel."
  //         }
  //       }
  //     },
  //     dining_page: {
  //       title: "Dining at Dusit Le Palais Tu Hoa Ha Noi",
  //       breadcrumb: "Dining",
  //       distinguishedTitle: "Distinguished Dining",
  //       distinguishedSubtitle: "Explore an exquisite array of dining venues, each offering a unique blend of authentic flavors, artisanal creations, and refined culinary artistry, designed to elevate your gastronomic journey with unparalleled elegance.",
  //       restaurants: {
  //         soi: {
  //           title: "SOI Restaurant",
  //           description: "Soi brings authentic Thai cuisine to life with bold flavours, fresh ingredients, and traditional techniques. A vibrant setting makes it the ideal place to enjoy Thai classics with a modern twist."
  //         },
  //         gourmet: {
  //           title: "Dusit Gourmet", 
  //           description: "A chic café and bakery offering fresh pastries, gourmet sandwiches, premium coffee, and artisanal teas. Ideal for quick bites or a relaxed afternoon tea."
  //         },
  //         palais: {
  //           title: "Palais Lounge",
  //           description: "Our Lobby Bar provides a relaxed, elegant space to enjoy afternoon tea or drinks – a perfect spot to unwind and savour the moment."
  //         },
  //         vinci: {
  //           title: "Vinci Restaurant and Rooftop Bar",
  //           description: "Vinci delivers a refined dining experience with elegant Italian flavors and serene views, ideal for a relaxed lunch or intimate dinner."
  //         },
  //         pho: {
  //           title: "Phở Lụa", 
  //           description: "Experience authentic Vietnamese pho with rich, aromatic broth and fresh ingredients, served in a warm, welcoming atmosphere."
  //         }
  //       }
  //     },

  //     wellness_page: {
  //       title: "Wellness at Dusit Le Palais Tu Hoa Ha Noi",
  //       breadcrumb: "Wellness",
  //       facilities: {
  //         fitness: {
  //           title: "Fitness Centre",
  //           description: "Stay on top of your fitness routine with our fitness centre, which is open 24 hours daily for your convenience. Whether you prefer an energising morning workout or a late-night session, our modern space ensures a seamless experience."
  //         },
  //         pool: {
  //           title: "Outdoor Swimming Pool (Coming Soon)",
  //           description: "Unwind in our stunning outdoor pool, a serene retreat with breathtaking panoramic views. Whether it's a refreshing morning swim, a leisurely dip, or lounging poolside with a cool drink, relaxation awaits."
  //         },
  //         onsen: {
  //           title: "Onsen",
  //           description: "Indulge in an authentic Onsen experience with soothing hot springs, luxurious bath amenities, and a tranquil garden view."
  //         }
  //       }
  //     },

  //     events_page: {
  //       title: "Events at Dusit Le Palais Tu Hoa Ha Noi", 
  //       breadcrumb: "Events",
  //       subtitle: "Elevate your gatherings with our exquisite venues.",
  //       facilities: {
  //         ballroom: {
  //           title: "Ballroom",
  //           description: "Three spacious, elegantly designed ballrooms with state-of-the-art AV technology, accommodating up to 180 guests. Ideal for conferences, banquets, and grand celebrations."
  //         },
  //         meeting: {
  //           title: "Meeting",
  //           description: "Two versatile rooms, perfect for small corporate meetings, workshops, and similar events."
  //         }
  //       }
  //     },
  //   },
    
  //   vn: {
  //     // Common navigation
  //     nav: {
  //       menu: "MENU",
  //       close: "ĐÓNG",
  //       bookNow: "ĐẶT PHÒNG",
  //       about: "GIỚI THIỆU",
  //       collection: "BỘ SƯU TẬP",
  //       dining: "NHÀ HÀNG",
  //       wellness: "SỨC KHỎE",
  //       events: "SỰ KIỆN",
  //       contact: "LIÊN HỆ",
  //       languageEN: "Tiếng Anh",
  //       languageVN: "Tiếng Việt"
  //     },
      
  //     // Page-specific hero titles
  //     hero: {
  //       home: "Dusit Le Palais Từ Hoa Hà Nội",
  //       about: "Về Dusit<br>Le Palais Từ Hoa Hà Nội",
  //       dining: "Trải Nghiệm Ẩm Thực",
  //       wellness: "Sức Khỏe tại Dusit Le Palais Từ Hoa Hà Nội",
  //     },
      
  //     // Page-specific embracing content
  //     embracing: {
  //       home: {
  //         title: "Kế Thừa Di Sản Từ Hoa",
  //         content: "Bước vào cung điện của Công chúa Từ Hoa bên Hồ Tây, nơi 207 phòng thanh lịch mang đến tầm nhìn yên bình và nét quyến rũ văn hóa. Thưởng thức ẩm thực đa dạng từ Thái đến Ý, và trải nghiệm sự pha trộn giữa sang trọng hiện đại và tinh tế.",
  //         button: "CÂU CHUYỆN CỦA CÔ"
  //       },
  //       about: {
  //         title: "Câu Chuyện Của Cô",
  //         content: "Lấy cảm hứng từ di sản vượt thời gian của Công chúa Từ Hoa, Dusit Le Palais Từ Hoa Hà Nội dệt nên một tấm thảm phong phú về di sản với sự sang trọng đương đại. Tọa lạc uyển chuyển bên Hồ Tây thanh bình, khách sạn của chúng tôi mang đến một nơi nghỉ dưỡng thanh lịch nơi truyền thống gặp gỡ đổi mới, phản ánh bản chất văn hóa của Hà Nội trong từng chi tiết."
  //       },
  //       collection: {
  //         title: "Bộ Sưu Tập Của Chúng Tôi",
  //         content: "Với 207 phòng và suite được thiết kế chu đáo, phục vụ mọi du khách — dù là công việc, giải trí, hay một chuyến nghỉ dưỡng lãng mạn."
  //       },
  //       dining: {
  //         title: "Tinh Hoa Ẩm Thực",
  //         content: "Khám phá thế giới hương vị tại các nhà hàng đặc trưng của chúng tôi, nơi ẩm thực Thái chính thống gặp gỡ nghệ thuật nấu ăn hiện đại trong bầu không khí thanh lịch tinh tế."
  //       },
  //       wellness: {
  //         title: "Tinh Hoa Chăm Sóc Sức Khỏe",
  //         content: "Tại Dusit Le Palais Từ Hoa Hà Nội, các chương trình chăm sóc sức khỏe của chúng tôi được thiết kế để nuôi dưỡng cơ thể và tâm hồn của bạn, kết hợp giữa sự thư giãn truyền thống với sự trẻ hóa hiện đại."
  //       },
  //       events: {
  //         title: "Sự Kiện Đáng Nhớ",
  //         content: "Từ những buổi tụ họp thân mật đến các lễ kỷ niệm hoành tráng, không gian sự kiện đa năng của chúng tôi mang đến bối cảnh hoàn hảo cho những khoảnh khắc đặc biệt của bạn."
  //       },
  //       contact: {
  //         title: "Khám Phá Địa Điểm Của Chúng Tôi",
  //         content: "Trải nghiệm sự quyến rũ của Dusit Le Palais Từ Hoa Hà Nội, tọa lạc lý tưởng bên Hồ Tây yên bình, dễ dàng tiếp cận các điểm tham quan văn hóa của thành phố."
  //       }
  //     },
      
  //     // Common sections
  //     accommodation: {
  //       title: "Phòng Nghỉ",
  //       viewMore: "XEM THÊM",
  //       rooms: {
  //         deluxe: {
  //           title: "Deluxe",
  //           description: "Tầm nhìn ngoạn mục, tiện nghi hiện đại và nơi nghỉ ngơi thư giãn."
  //         },
  //         junior: {
  //           title: "Junior Suite",
  //           description: "Nơi nghỉ dưỡng yên tĩnh với bố cục rộng rãi và nhà bếp."
  //         },
  //         superior: {
  //           title: "Superior",
  //           description: "Phòng sang trọng với tiện nghi thanh lịch cho kỳ nghỉ yên bình."
  //         },
  //         oneBedroom: {
  //           title: "One Bedroom Suite",
  //           description: "Phòng thanh lịch, ấm cúng với tiện nghi cao cấp và bồn tắm."
  //         }
  //       }
  //     },
      
  //     dining: {
  //       title: "Trải Nghiệm Ẩm Thực",
  //       subtitle: "Thưởng thức từng khoảnh khắc trong không gian được tạo ra cho sự kết nối và ẩm thực.",
  //       hero: "Hơn cả ẩm thực – Đó là bầu không khí đáng nhớ.",
  //       restaurants: {
  //         soi: {
  //           title: "Nhà Hàng SOI",
  //           description: "Soi hồi sinh ẩm thực Thái chính thống với hương vị đậm đà, nguyên liệu tươi ngon và cách trình bày tinh tế. Bầu không khí sôi động nâng tầm các món ăn cổ điển."
  //         },
  //         gourmet: {
  //           title: "Dusit Gourmet",
  //           description: "Một quán cà phê thanh lịch phục vụ bánh ngọt tươi, bánh sandwich cao cấp, cà phê đặc biệt và trà thủ công. Hoàn hảo cho bữa ăn nhẹ hoặc trà chiều."
  //         },
  //         palais: {
  //           title: "Palais",
  //           description: "Lobby Bar của chúng tôi mang đến không gian thư giãn, thanh lịch để thưởng thức trà chiều hoặc đồ uống – địa điểm lý tưởng để thư giãn và thưởng thức khoảnh khắc."
  //         }
  //       }
  //     },
      
  //     wellness: {
  //       title: "Sức Khỏe & Lối Sống",
  //       facilities: {
  //         gym: {
  //           title: "Phòng Gym",
  //           description: "Duy trì sức khỏe và thư giãn với các tiện ích đặc biệt của chúng tôi. Tận hưởng Trung tâm Thể dục được trang bị tốt – sự cân bằng hoàn hảo giữa hoạt động và thư giãn."
  //         },
  //         pool: {
  //           title: "Hồ Bơi",
  //           description: "Thư giãn và nghỉ ngơi trong hồ bơi tuyệt đẹp của chúng tôi, được bao quanh bởi những khu vườn xanh mát và mang đến sự thoát ly yên bình khỏi thành phố."
  //         },
  //         onsen: {
  //           title: "Onsen",
  //           description: "Tận hưởng trải nghiệm Onsen chính thống với suối nước nóng dịu nhẹ, tiện nghi tắm sang trọng và tầm nhìn ra khu vườn yên tĩnh."
  //         }
  //       }
  //     },
      
  //     events: {
  //       title: "Sự Kiện",
  //       facilities: {
  //         mice: {
  //           title: "MICE",
  //           description: "Từ các cuộc họp doanh nghiệp đến những đám cưới hoành tráng, phòng tiệc, phòng họp và không gian sự kiện trên sân thượng của chúng tôi mang đến bối cảnh hoàn hảo cho những khoảnh khắc khó quên — tất cả được hỗ trợ bởi các tiện ích hiện đại và tầm nhìn ngoạn mục."
  //         }
  //       }
  //     },
      
  //     footer: {
  //       explore: {
  //         title: "Khám Phá",
  //         links: ["Bộ Sưu Tập", "Nhà Hàng", "Liên Hệ"]
  //       },
  //       followUs: {
  //         title: "Theo Dõi Chúng Tôi"
  //       },
  //       contact: {
  //         title: "Liên Hệ",
  //         address: "Địa chỉ: Ngõ 431 đường Âu Cơ,<br>Quận Tây Hồ, Hà Nội, Việt Nam",
  //         phone: "Điện thoại: +84 24 3200 2222",
  //         email: "Email: dphv@dusit.com"
  //       },
  //       newsletter: {
  //         title: "Đăng ký nhận bản tin",
  //         placeholder: "Email..."
  //       },
  //       copyright: "Dusit Le Palais Từ Hoa Hà Nội. Mọi quyền được bảo lưu"
  //     },
  //     contact_page: {
  //       title: "Liên Hệ",
  //       locationTitle: "Khám Phá Địa Điểm Của Chúng Tôi", 
  //       locationContent: "Tọa lạc tại khu vực Hồ Tây đẹp như tranh trên đường Âu Cơ, Dusit Le Palais Từ Hoa Hà Nội mang đến bầu không khí yên tĩnh, sang trọng với tầm nhìn tuyệt đẹp ra Hồ Tây. Chỉ cách sân bay 22 km, 20 phút lái xe.",
  //       mapTitle: "Liên Hệ Với Chúng Tôi",
  //       address: "Địa chỉ: Ngõ 431 đường Âu Cơ, Quận Tây Hồ, Hà Nội, Việt Nam",
  //       phone: "Điện thoại: +84 24 3200 2222",
  //       email: "Email: dphv@dusit.com", 
  //       directions: "Chỉ Đường",
  //       breadcrumb: "Liên Hệ",
  //       reserveTitle: "Nơi Lưu Trú Tuyệt Vời. Đặt Phòng Ngay!",
  //       reserveBtn: "Đặt Phòng Ngay"
  //     },

  //     collection_page: {
  //       title: "Bộ Sưu Tập Của Chúng Tôi",
  //       content: "Với 207 phòng và suite được thiết kế chu đáo, phục vụ mọi du khách — dù là công việc, giải trí, hay một chuyến nghỉ dưỡng lãng mạn.",
  //       breadcrumb: "Bộ Sưu Tập",
  //       rooms: {
  //         superior: {
  //           title: "Superior",
  //           size: "28 - 31 m²",
  //           quantity: "154",
  //           description: "Kết hợp các tiện nghi được lựa chọn chu đáo với chút sang trọng, đây là lựa chọn lý tưởng cho kỳ nghỉ dưỡng yên bình và thú vị."
  //         },
  //         deluxe: {
  //           title: "Deluxe",
  //           size: "34 - 43 m²", 
  //           quantity: "27",
  //           description: "Ngắm nhìn toàn cảnh thành phố hoặc hồ nước, thư giãn trong bồn tắm sang trọng và tận hưởng các tiện nghi hiện đại. Phòng của chúng tôi là nơi hoàn hảo để thư giãn hoặc nạp lại năng lượng."
  //         },
  //         junior: {
  //           title: "Junior Suite",
  //           size: "50 - 58 m²",
  //           quantity: "16", 
  //           description: "Thư giãn trong bồn tắm êm dịu và tận hưởng sự tiện lợi của khu vực bếp. Thiết kế độc đáo và bố cục rộng rãi tạo nên nơi nghỉ dưỡng hoàn hảo."
  //         },
  //         oneBedroom: {
  //           title: "One Bedroom Suite", 
  //           size: "51 - 64 m²",
  //           quantity: "10",
  //           description: "Trải nghiệm sự sang trọng tinh tế với phòng ngủ ấm cúng, bồn tắm thư giãn và các tiện nghi cao cấp – nơi nghỉ dưỡng thanh lịch cho kỳ nghỉ khó quên."
  //         }
  //       },
  //       roomLabels: {
  //         size: "DIỆN TÍCH",
  //         quantity: "SỐ LƯỢNG"
  //       }
  //     },

  //     about_page: {
  //       title: "Về Dusit Le Palais Từ Hoa Hà Nội",
  //       story: "Câu Chuyện Của Cô", 
  //       storyContent: "Lấy cảm hứng từ di sản vượt thời gian của Công chúa Từ Hoa, Dusit Le Palais Từ Hoa Hà Nội dệt nên một tấm thảm phong phú về di sản với sự sang trọng đương đại. Tọa lạc uyển chuyển bên Hồ Tây thanh bình, khách sạn của chúng tôi mang đến một nơi nghỉ dưỡng thanh lịch nơi truyền thống gặp gỡ đổi mới, phản ánh bản chất văn hóa của Hà Nội trong từng chi tiết.",
  //       breadcrumb: "Giới Thiệu",
  //       sections: {
  //         historical: {
  //           title: "Cảm Hứng Lịch Sử và Tinh Thần Khách Sạn",
  //           content: "Khách sạn của chúng tôi lấy cảm hứng từ Công chúa Từ Hoa, con gái của vua Lý Thần Tông thế kỷ 12, người đã tiên phong trong ngành công nghiệp tơ tằm Việt Nam bằng cách thành lập trại Tam Tang bên Hồ Tây để dạy dệt tơ tằm. Tinh thần cống hiến và sáng tạo của bà thúc đẩy tầm nhìn của khách sạn chúng tôi. Gần đó, chùa Kim Liên ngàn năm tuổi tôn vinh di sản của bà. Thông qua Cung Từ Hoa, chúng tôi mong muốn tái tạo cung điện của cha bà, một trung tâm đón tiếp du khách và chia sẻ văn hóa Việt Nam cũng như lòng hiếu khách độc đáo của bà."
  //         },
  //         architectural: {
  //           title: "Kiến Trúc Hoành Tráng và Không Gian Tinh Tế",
  //           content: "Dusit Le Palais Từ Hoa Hà Nội tọa lạc trên khu đất 4.000 m² với ba tầng hầm và chín tầng, cung cấp 207 phòng và suite được thiết kế tinh tế. Kiến trúc của nó phản ánh một cung điện cổ, pha trộn phong cách Việt Nam đương đại với ảnh hưởng của triều đại Lý và Trần—trần vòm, họa tiết sóng và đường cong mềm mại—tạo ra một không gian sang trọng thấm đẫm di sản văn hóa."
  //         },
  //         location: {
  //           title: "Vị Trí Địa Lý Đắc Địa",
  //           content: "Nằm bên Hồ Tây đẹp như tranh, Cung Từ Hoa kết hợp sự yên tĩnh tự nhiên với sự sôi động của thành phố, chỉ 15-20 phút từ sân bay và 10-15 phút từ Phố Cổ. Được định vị như một ốc đảo yên tĩnh với tầm nhìn toàn cảnh ra hồ, thung lũng hoa và Phố Cổ lịch sử, nó cung cấp hơn 20 bố cục phòng độc đáo trong các danh mục Superior, Deluxe và Suite. Mỗi lần lưu trú mang lại trải nghiệm mới—với những tầm nhìn và thiết kế khác nhau cùng mức giá—làm cho nó trở thành đặc điểm độc đáo của khách sạn."
  //         }
  //       }
  //     },
  //     dining_page: {
  //       title: "Trải Nghiệm Ẩm Thực tại Dusit Le Palais Từ Hoa Hà Nội",
  //       breadcrumb: "Nhà Hàng",
  //       distinguishedTitle: "Ẩm Thực Đẳng Cấp",
  //       distinguishedSubtitle: "Khám phá một loạt các địa điểm ẩm thực tinh tế, mỗi nơi đều mang đến sự pha trộn độc đáo giữa hương vị chính thống, sáng tạo thủ công và nghệ thuật ẩm thực tinh tế, được thiết kế để nâng tầm hành trình ẩm thực của bạn với sự thanh lịch tuyệt vời.",
  //       restaurants: {
  //         soi: {
  //           title: "Nhà Hàng SOI",
  //           description: "Soi mang ẩm thực Thái chính thống trở nên sống động với hương vị đậm đà, nguyên liệu tươi ngon và kỹ thuật truyền thống. Khung cảnh sôi động khiến đây trở thành nơi lý tưởng để thưởng thức các món Thái cổ điển với phong cách hiện đại."
  //         },
  //         gourmet: {
  //           title: "Dusit Gourmet",
  //           description: "Quán cà phê và tiệm bánh thanh lịch phục vụ bánh ngọt tươi, bánh sandwich cao cấp, cà phê đặc biệt và trà thủ công. Lý tưởng cho bữa ăn nhẹ hoặc trà chiều thư giãn."
  //         },
  //         palais: {
  //           title: "Palais Lounge", 
  //           description: "Lobby Bar của chúng tôi mang đến không gian thư giãn, thanh lịch để thưởng thức trà chiều hoặc đồ uống – địa điểm hoàn hảo để thư giãn và thưởng thức khoảnh khắc."
  //         },
  //         vinci: {
  //           title: "Nhà Hàng Vinci và Rooftop Bar",
  //           description: "Vinci mang đến trải nghiệm ẩm thực tinh tế với hương vị Ý thanh lịch và tầm nhìn yên bình, lý tưởng cho bữa trưa thư giãn hoặc bữa tối thân mật."
  //         },
  //         pho: {
  //           title: "Phở Lụa",
  //           description: "Trải nghiệm phở Việt Nam chính thống với nước dùng đậm đà, thơm ngon và nguyên liệu tươi ngon, được phục vụ trong bầu không khí ấm áp, chào đón."
  //         }
  //       }
  //     },

  //     wellness_page: {
  //       title: "Sức Khỏe tại Dusit Le Palais Từ Hoa Hà Nội",
  //       breadcrumb: "Sức Khỏe",
  //       facilities: {
  //         fitness: {
  //           title: "Phòng Tập Gym",
  //           description: "Duy trì thói quen tập luyện của bạn với phòng tập gym mở cửa 24 giờ hàng ngày để phục vụ bạn. Dù bạn thích tập luyện sáng sớm hay buổi tối muộn, không gian hiện đại của chúng tôi đảm bảo trải nghiệm liền mạch."
  //         },
  //         pool: {
  //           title: "Hồ Bơi Ngoài Trời (Sắp Ra Mắt)",
  //           description: "Thư giãn trong hồ bơi ngoài trời tuyệt đẹp của chúng tôi, một nơi nghỉ dưỡng yên tĩnh với tầm nhìn toàn cảnh ngoạn mục. Dù là bơi lội sảng khoái buổi sáng, tắm thư giãn hay nằm dài bên hồ bơi với đồ uống mát lạnh, sự thư giãn đang chờ đón bạn."
  //         },
  //         onsen: {
  //           title: "Onsen",
  //           description: "Thư giãn trong trải nghiệm Onsen chính thống với suối nước nóng, tiện nghi tắm sang trọng và tầm nhìn ra khu vườn yên tĩnh."
  //         },
  //       }
  //     },

  //     events_page: {
  //       title: "Sự Kiện tại Dusit Le Palais Từ Hoa Hà Nội",
  //       breadcrumb: "Sự Kiện", 
  //       subtitle: "Nâng tầm các buổi tụ họp của bạn với những địa điểm tinh tế.",
  //       facilities: {
  //         ballroom: {
  //           title: "Phòng Tiệc",
  //           description: "Ba phòng tiệc rộng rãi, được thiết kế thanh lịch với công nghệ AV hiện đại, có thể chứa tới 180 khách. Lý tưởng cho hội nghị, tiệc buffet và các lễ kỷ niệm hoành tráng."
  //         },
  //         meeting: {
  //           title: "Phòng Họp",
  //           description: "Hai phòng đa năng, hoàn hảo cho các cuộc họp doanh nghiệp nhỏ, hội thảo và các sự kiện tương tự."
  //         }
  //       }
  //     }
  //   }
  // };
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
  // Menu toggle function
  // $('.site-menu-toggle').click(function(){
  //   var $this = $(this);
  //   if ($('body').hasClass('menu-open')) {
  //     $this.removeClass('open');
  //     $('.js-site-navbar').fadeOut(400);
  //     $('body').removeClass('menu-open');
  //     $('html').removeClass('menu-open');
  //     isMenuOpen = false;
  //     isMenuJustClosed = true;


  
  //     $(window).off('wheel.menuOpen touchmove.menuOpen scroll.menuOpen');
  //     $(document).off('keydown.menuOpen');

  //     if(!isMobile && lenis && typeof lenis.start === 'function'){

  //       const currentBodyTop = $('body').css('top');
  //       let scrollY = 0;
        
  //       if (currentBodyTop && currentBodyTop !== 'auto') {
  //         scrollY = Math.abs(parseInt(currentBodyTop) || 0);
  //       }
        
  //       // Reset styles trước khi scroll
  //       $('body').css({
  //         'position': '',
  //         'top': '',
  //         'width': ''
  //       });
  //       $('html').css('overflow', '');
        
  //       // Đảm bảo scrollY hợp lệ trước khi áp dụng
  //       if (scrollY > 0 && scrollY < document.documentElement.scrollHeight) {
  //         window.scrollTo(0, scrollY);
  //       }
        
  //       // Restart Lenis sau khi đã restore position
  //       setTimeout(() => {
  //       if (lenis && typeof lenis.start === 'function') {
  //         try {
  //           lenis.start();
  //         } catch (e) {
  //          
  //         }
  //       }
  //     }, 50);
        
  //     } else {
  //       const currentBodyTop = $('body').css('top');
  //     let scrollY = 0;
      
  //     // Get stored scroll position from body top
  //     if (currentBodyTop && currentBodyTop !== 'auto') {
  //       scrollY = Math.abs(parseInt(currentBodyTop) || 0);
  //     }

  //       // Mobile: Reset scroll đơn giản
  //       $('body').css({
  //         'position': '',
  //         'top': '',
  //         'width': '',
  //         'overflow': '',
  //         'overflow-x': ''
  //       });
        
  //       $('html').css({
  //         'overflow': '',
  //         'overflow-x': '',
  //       });
  //       if (scrollY > 0) {
  //       setTimeout(() => {
  //     window.scrollTo(0, scrollY);
  //     document.documentElement.scrollTop = scrollY;
  //   }, 10);
  //     }
  //     }
      
  //     updateHeaderState();
      
      
  //   } else {

  //     let currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
  //     if (isMobile && isHeaderHidden) {
  //   const headerEl = $('.js-site-header')[0];
  //   headerEl.style.setProperty('transition', 'transform 0.3s ease-in-out', 'important');
  //   headerEl.style.setProperty('transform', 'translateY(0)', 'important');
  //   $('.js-site-header').removeClass('header-hidden');
  //   isHeaderHidden = false;
  // }
  //     $this.addClass('open');
  //     $('.js-site-navbar').fadeIn(400);
  //     $('body').addClass('menu-open');
  //     $('html').addClass('menu-open');
      
  //     isMenuOpen = true;
  //     isMenuJustClosed = false;
  //     // const scrollbarWidth = getScrollbarWidth();
  //     // $('.navbar-nav').css('padding-right', scrollbarWidth + 'px');
  //     // $('.container-fluid').css('padding-right', scrollbarWidth + 'px');
      
  //     // Lock scroll khác nhau cho desktop/mobile
  //     if(!isMobile && lenis){
  //       // Lấy scroll position CHÍNH XÁC trước khi lock
  //       const scrollPosition = lenis.scroll || window.pageYOffset || document.documentElement.scrollTop || 0;
        
  //       // Lock events trước khi stop Lenis
  //       $(window).on('wheel.menuOpen', function(e) {
  //         e.preventDefault();
  //         return false;
  //       });
  //       $(window).on('touchmove.menuOpen', function(e) {
  //         e.preventDefault();
  //         return false;
  //       });
  //       $(document).on('keydown.menuOpen', function(e) {
  //         if([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
  //           e.preventDefault();
  //           return false;
  //         }
  //       });
        
  //       // Stop Lenis sau khi đã lock events
  //       lenis.stop();
        
  //       $('body').css({
  //         'position': 'fixed',
  //         'top': `-${scrollPosition}px`,
  //         'width': '100%'
  //       });
  //       $('html').css('overflow', 'hidden');
        
  //     } else {
  //       // Prevent scroll events trên mobile
  //       $(window).on('scroll.menuOpen touchmove.menuOpen wheel.menuOpen', function(e) {
        
  //         return false;
  //       });
        
  //       $(document).on('keydown.menuOpen', function(e) {
  //         if([32, 33, 34, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
  //           e.preventDefault();
  //           return false;
  //         }
  //       });
  //       requestAnimationFrame(() => {
  //     $('body').css({
  //       'overflow': 'hidden',
  //       'position': 'fixed',
  //       'top': `-${currentScroll}px`,
  //       'width': '100%',
  //       'left': '0',
  //       'right': '0'
  //     });
  //     $('html').css('overflow', 'hidden');
  //     });
  //   }
  //     updateHeaderState();
  //   }
  // });
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
      $('body').css({
        'position': 'fixed',
        'top': `-${currentScroll}px`, // Store scroll position
        'left': '0',
        'right': '0',
        'width': '100%',
        'overflow': 'hidden',
        'touch-action': 'none',
        '-webkit-overflow-scrolling': 'auto'
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
    768: {
      items: 1, // Tablet: 1 item
      margin: 30,
      stagePadding: 20,
      touchDrag: true,     // Enable touch on tablet
      mouseDrag: true, 
     
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

$(document).ready(function(){
  var diningSlider = $('.dining-slider');
  let isDiningSliding = false;
  let currentDiningDotIndex = 0;
  let totalDiningDots = 2;
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
          items: 1, // Mobile: 1 item
          margin: 20,
          touchDrag: true,
          mouseDrag: false,
          pullDrag: true,
          dots: true,
          dotsSpeed: 300,
          autoplay: true,
          autoplayTimeout: 3000,
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
        }
      }
    });
    function updateDiningProgressBar(dotIndex) {
      const progressBar = diningSlider.find('.owl-dots');
      
      if (progressBar.length) {
        // Calculate positions for 6 slides: 0%, 16.666%, 33.333%, 50%, 66.666%, 83.333%
        const positions = [0, 50];
        const position = positions[dotIndex] || 0;
        
        // Set CSS variable and class
        progressBar.css('--dining-active-position', position + '%');
        progressBar[0].style.setProperty('--dining-active-position', position + '%');
        
        progressBar.removeClass('dining-position-0 dining-position-1 dining-position-2 dining-position-3 dining-position-4 dining-position-5');
        progressBar.addClass(`dining-position-${dotIndex}`);
        
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
        
        // Observe all dot elements
        const dots = diningSlider.find('.owl-dots .owl-dot');
        dots.each(function(index) {
          observer.observe(this, {
            attributes: true,
            attributeFilter: ['class']
          });
        });
        
        // Initial check
        setTimeout(() => {
          checkActiveDiningDot();
        }, 100);
      }
    }
    
    // Function to check which dining dot is active
    function checkActiveDiningDot() {
      const activeDot = diningSlider.find('.owl-dots .owl-dot.active');
      
      if (activeDot.length) {
        const allDots = diningSlider.find('.owl-dots .owl-dot');
        const activeDotIndex = allDots.index(activeDot);
        
        if (activeDotIndex !== -1 && activeDotIndex !== currentDiningDotIndex) {
          updateDiningProgressBar(activeDotIndex);

        }
      }
    }
    
    // Initialize dining slider
    diningSlider.on('initialized.owl.carousel', function(event) {
      
      // Start watching dots after initialization
      setTimeout(() => {
        watchDiningDotsChanges();
        updateDiningProgressBar(0); // Set initial position
      }, 200);
    });
    
    // Backup: Also listen to carousel events
    diningSlider.on('changed.owl.carousel', function(event) {
      setTimeout(() => {
        checkActiveDiningDot();
      }, 50);
    });
    
    diningSlider.on('translated.owl.carousel', function(event) {
      setTimeout(() => {
        checkActiveDiningDot();
      }, 100);
    });
    
    // Enhanced manual click handling for dining slider
    diningSlider.find('.owl-dots').on('click', function(e) {
  const clickX = e.offsetX || e.originalEvent.layerX || 0;
  const totalWidth = $(this).width();
  
  if (totalWidth > 0) {
    // Calculate based on 2 sections only (for 2 dots)
    const sectionWidth = totalWidth / 2; // 2 sections for 2 dots
    let targetDot = Math.floor(clickX / sectionWidth);
    targetDot = Math.max(0, Math.min(targetDot, 1)); // Clamp to 0-1
  

    //Use direct owl dot click instead of to.owl.carousel
    const owlDots = diningSlider.find('.owl-dots .owl-dot');
    if (owlDots.eq(targetDot).length) {
      // Trigger actual dot click for better responsiveness
      owlDots.eq(targetDot).trigger('click');

    }
    
    // Immediately update progress bar
    updateDiningProgressBar(targetDot);
  }
});
    
    diningSlider.on('translated.owl.carousel', function(event) {
      setTimeout(() => {
        isDiningSliding = false;
      }, 30);
    });
    
    // Monitor for DOM changes in dining dots
    const diningObserver = new MutationObserver(function(mutations) {
      let shouldCheck = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || 
            (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
          shouldCheck = true;
        }
      });
      
      if (shouldCheck) {
        setTimeout(() => {
          checkActiveDiningDot();
        }, 10);
      }
    });
    
    // Start observing the dining dots container
    setTimeout(() => {
      const dotsContainer = diningSlider.find('.owl-dots')[0];
      if (dotsContainer) {
        diningObserver.observe(dotsContainer, {
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