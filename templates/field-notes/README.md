# Field Notes

A minimal scientific activity record with a weekly trace, contribution dots and quiet animation.

## Chạy và chỉnh sửa

`index.js` giữ contract chung `render({ profile, calendar, options })`. Sửa hình vẽ và animation trong `renderer.js`; bảng màu dark/light dùng chung nằm ở `src/githubStatsTheme.js`.

- `theme`: `auto` (mặc định), `dark`, `light`. Auto đổi màu bằng CSS bên trong SVG.
- `accent`: mã màu HEX sáu chữ số. Không chỉnh màu sẽ giữ nguyên palette gốc theo theme.

```bash
npm test
```

Xem `previews/field-notes.svg` và `previews/field-notes-light.svg`. Tất cả animation có fallback reduced-motion.

## Dữ liệu và animation

Bốn chỉ số: contributions, current streak, longest streak, active days. Trace theo tuần được tính từ calendar; một điểm chuyển động chậm dọc trace. Contribution graph là ma trận chấm, hoạt động ít/nhiều tương ứng độ đậm. Chuyển động chỉ mang tính trình bày, không thay đổi dữ liệu.

## Website

Trong ứng dụng có live template library, chọn **Field Notes** từ repo để render bằng dữ liệu thật:

```text
/api/github-stats/USERNAME?template=field-notes
/api/github-stats/USERNAME?template=field-notes&theme=light&color=FF4DDE
```

Mẫu được tải tại runtime từ commit hiện hành của catalog, không cần thêm renderer riêng vào website.
