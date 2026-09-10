# Starter Card

Đây là template nên copy khi bắt đầu một thiết kế mới. Nó minh họa:

- Cách đọc `profile` và `calendar`.
- Cách merge options từ manifest.
- Cách escape dữ liệu người dùng.
- Cách render contribution grid 53 × 7.
- Cách hỗ trợ `prefers-reduced-motion`.
- Auto/Dark/Light ngay trong SVG; background trắng ở light mode.

## Tùy biến nhanh

- Đổi hình dạng từng contribution trong hàm `renderDays()`.
- Thêm mapping mới từ streak hoặc active repo vào phần `body`.
- Đổi palette mặc định trong `manifest.json`.
- Giữ nguyên accessible `title` và `description` khi thay bố cục.

Sau khi copy thư mục này, đổi tên folder và `manifest.id` thành cùng một ID kebab-case.

Options: `theme` (`auto` mặc định), `accent` (HEX) và `showHandle` (boolean). Từ v2, `theme` thay cho option `background`. Helper palette được import từ `src/githubStatsTheme.js`, có sẵn trong môi trường render của website.
