# Repo Garden

A spacious contribution garden with growing plants, a streak vine and active repository trees.

## Chạy và chỉnh sửa

`index.js` giữ contract chung `render({ profile, calendar, options })`. Sửa hình vẽ và animation trong `renderer.js`; bảng màu dark/light dùng chung nằm ở `src/githubStatsTheme.js`.

- `theme`: `auto` (mặc định), `dark`, `light`. Auto đổi màu bằng CSS bên trong SVG.
- `accent`: mã màu HEX sáu chữ số. Không chỉnh màu sẽ giữ nguyên palette gốc theo theme.
- `particleA`–`particleD`: bốn màu phụ khi tùy biến palette. Website có thể tạo chúng từ màu chủ đạo bằng The Color API; template không tự gọi network.

```bash
npm test
```

Xem `previews/repo-garden.svg` và `previews/repo-garden-light.svg`. Tất cả animation có fallback reduced-motion.

## Dữ liệu và animation

Mỗi ngày là một ô đất; mức activity quyết định chồi và hoa. Longest streak là dây leo; active repo là cây; stars là quả sáng. Không có người khổng lồ; luống vườn được mở rộng, đất trong light mode sáng hơn. Options `leaf` và `background` cũ được thay bằng theme và palette chung.

## Website

Trong ứng dụng có live template library, chọn **Repo Garden** từ repo để render bằng dữ liệu thật:

```text
/api/github-stats/USERNAME?template=repo-garden
/api/github-stats/USERNAME?template=repo-garden&theme=light&color=FF4DDE
```

Mẫu được tải tại runtime từ commit hiện hành của catalog, không cần thêm renderer riêng vào website.
