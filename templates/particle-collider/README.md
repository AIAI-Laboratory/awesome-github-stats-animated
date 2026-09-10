# Git Particle Collider

Repository particles follow intersecting orbits, collide and illuminate a contribution detector.

## Chạy và chỉnh sửa

`index.js` giữ contract chung `render({ profile, calendar, options })`. Sửa hình vẽ và animation trong `renderer.js`; bảng màu dark/light dùng chung nằm ở `src/githubStatsTheme.js`.

- `theme`: `auto` (mặc định), `dark`, `light`. Auto đổi màu bằng CSS bên trong SVG.
- `accent`: mã màu HEX sáu chữ số. Không chỉnh màu sẽ giữ nguyên palette gốc theo theme.
- `particleA`–`particleD`: bốn màu phụ khi tùy biến palette. Website có thể tạo chúng từ màu chủ đạo bằng The Color API; template không tự gọi network.

```bash
npm test
```

Xem `previews/particle-collider.svg` và `previews/particle-collider-light.svg`. Tất cả animation có fallback reduced-motion.

## Dữ liệu và animation

Mỗi lần render chọn hai repo làm nguồn, tạo mã experiment ngẫu nhiên. Tối đa 10 repo chạy nhiều quỹ đạo ngược chiều và giao nhau. Collision rate tăng từ 0 đến tỷ lệ active days, không giả lập tăng số commit thật.

## Website

Trong ứng dụng có live template library, chọn **Git Particle Collider** từ repo để render bằng dữ liệu thật:

```text
/api/github-stats/USERNAME?template=particle-collider
/api/github-stats/USERNAME?template=particle-collider&theme=light&color=FF4DDE
```

Mẫu được tải tại runtime từ commit hiện hành của catalog, không cần thêm renderer riêng vào website.
