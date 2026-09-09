# Git Particle Collider

Template biến activity GitHub thành một thí nghiệm máy gia tốc hạt:

- repository → nguồn hạt và particle chạy trên quỹ đạo;
- programming language → ký hiệu loại hạt;
- commit → năng lượng chùm tia;
- contribution → detector hit;
- streak → độ ổn định của chùm tia;
- star → photon được phát hiện.

Hai repo được chọn làm nguồn bắn hạt vào tâm va chạm. Tối đa tám active repo cùng chuyển động trên nhiều quỹ đạo với tốc độ lệch nhau, sau đó mảnh va chạm rơi xuống contribution detector grid. Collision rate tăng dần từ `0` đến tỷ lệ active day thực tế.

## Tùy chỉnh

| Option | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `theme` | `auto` | `auto`, `dark` hoặc `light`; auto dùng `prefers-color-scheme` ngay trong SVG |
| `accent` | `#ff5a4f` | Lõi va chạm và điểm nhấn chính |
| `particleA` | `#43e2ff` | Beam trái và detector |
| `particleB` | `#ffc857` | Tia va chạm phụ |
| `particleC` | `#ba77ff` | Beam phải |
| `particleD` | `#63e6a3` | Hạt và debris bổ sung |

Nếu nền tảng tạo palette analogic năm màu, map màu gốc vào `accent` và bốn màu còn lại lần lượt vào `particleA`–`particleD`. Template không tự gọi API hoặc tải tài nguyên bên ngoài.

## Chạy preview

```bash
npm run test
```

Preview được tạo tại `previews/particle-collider.svg`. Animation có fallback cho `prefers-reduced-motion`.

Sau khi template được duyệt trên nền tảng, cách nhúng dự kiến:

```md
![GitHub Particle Collider](https://aisq.dev/api/github-stats/USERNAME?template=particle-collider)
```
