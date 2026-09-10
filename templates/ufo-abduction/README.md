# UFO Abduction

A 2D UFO follows a randomized route and collects contributions across the entire grid.

## Chạy và chỉnh sửa

`index.js` giữ contract chung `render({ profile, calendar, options })`. Sửa hình vẽ và animation trong `renderer.js`; bảng màu dark/light dùng chung nằm ở `src/githubStatsTheme.js`.

- `theme`: `auto` (mặc định), `dark`, `light`. Auto đổi màu bằng CSS bên trong SVG.
- `accent`: mã màu HEX sáu chữ số. Không chỉnh màu sẽ giữ nguyên palette gốc theo theme.

```bash
npm test
```

Xem `previews/ufo-abduction.svg` và `previews/ufo-abduction-light.svg`. Tất cả animation có fallback reduced-motion.

## Dữ liệu và animation

UFO 2D bắt đầu ngẫu nhiên, di chuyển qua các vùng của graph và hút hết ô contribution. Weekly contributions tạo đường signal. Thời gian mỗi hành trình được tính trong renderer; option `duration` và `background` cũ đã được thay bằng theme thống nhất.

## Website

Trong ứng dụng có live template library, chọn **UFO Abduction** từ repo để render bằng dữ liệu thật:

```text
/api/github-stats/USERNAME?template=ufo-abduction
/api/github-stats/USERNAME?template=ufo-abduction&theme=light&color=FF4DDE
```

Mẫu được tải tại runtime từ commit hiện hành của catalog, không cần thêm renderer riêng vào website.
