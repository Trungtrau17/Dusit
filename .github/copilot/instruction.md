1. Quy tắc chung:

Luôn tuân thủ nội dung và quy chuẩn từ file detailed design.
Mọi phản hồi, giải thích, ví dụ code đều sử dụng tiếng Việt.
2. HTML:

Sử dụng cấu trúc semantic HTML5: <header>, <nav>, <main>, <section>, <footer>, v.v.
Đặt tên class rõ ràng, nhất quán, ưu tiên theo chuẩn BEM hoặc theo detailed design.
Đảm bảo accessibility: thêm thuộc tính alt cho hình ảnh, aria-label cho các thành phần tương tác.
Tích hợp Bootstrap đúng chuẩn, sử dụng các class grid, spacing, utility để đảm bảo responsive.
3. CSS:

Mọi màu sắc, font chữ, kích thước, khoảng cách đều phải lấy từ file thiết kế chi tiết.
Ưu tiên sử dụng class thay vì style inline, toàn bộ style phải nằm trong file CSS.
Kết hợp hợp lý giữa class utility của Bootstrap và custom CSS.
Đảm bảo responsive, kiểm tra giao diện trên nhiều thiết bị, sử dụng media queries khi cần.
Nếu có thể, sử dụng biến CSS để dễ bảo trì.
4. Javascript/Jquery:

Sử dụng Jquery cho các thao tác DOM, hiệu ứng, sự kiện (menu, slider, animation) theo đúng detailed design.
Không thay đổi cấu trúc HTML bằng JS nếu không cần thiết, chỉ thêm/xóa class hoặc xử lý sự kiện.
Tối ưu hiệu suất: hạn chế thao tác DOM lặp lại, debounce/throttle các sự kiện scroll, resize.
Đảm bảo tương thích với các plugin/component của Bootstrap/Jquery, tránh xung đột.
5. Phản hồi:

Luôn trả lời bằng tiếng Việt, giải thích rõ ràng, dễ hiểu.
Nếu chưa rõ yêu cầu thiết kế, hãy hỏi lại để xác nhận với file detailed design.
Lưu ý:
Các quy tắc này giúp đảm bảo dự án Hotel Website có giao diện nhất quán, dễ bảo trì, tối ưu hiệu suất và đúng với yêu cầu thiết kế.