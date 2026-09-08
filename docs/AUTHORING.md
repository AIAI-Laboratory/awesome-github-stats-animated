# Hướng dẫn viết template

## 1. Manifest

`manifest.json` là metadata để catalog hiển thị và renderer biết các option được hỗ trợ. Các trường bắt buộc:

- `id`: trùng tên thư mục, định dạng kebab-case.
- `name`, `description`, `version`, `author`, `license`.
- `entry`: luôn là `./index.js` trong template tiêu chuẩn.
- `width`, `height`: viewBox và kích thước output.
- `tags`: từ khóa tìm kiếm.
- `options`: khai báo từng tùy chọn với `type`, `default` và `description`.

## 2. Dữ liệu đầu vào

```js
{
  profile: {
    login: 'octocat',
    name: 'The Octocat',
    publicRepos: 8,
    followers: 1200,
    activeRepos: [
      { name: 'hello-world', language: 'JavaScript', stars: 42 }
    ],
    activeRepoStars: 42
  },
  calendar: {
    totalContributions: 624,
    currentStreak: 8,
    longestStreak: 31,
    activeDays: 184,
    firstDate: '2025-09-07',
    weeklyTotals: [0, 2, 8],
    days: [
      { date: '2025-09-07', count: 0, level: 0, future: false }
    ]
  },
  options: {}
}
```

Không giả định `name`, `language` hay `activeRepos` luôn có dữ liệu. Luôn giới hạn độ dài text trước khi render.

## 3. Data mapping

Một template tốt giải thích rõ ý nghĩa hình ảnh, ví dụ:

- Contribution level → màu hoặc kích thước của ô.
- Commit → hạt giống, ngôi sao, particle hoặc vật thể được thu thập.
- Streak → dây leo, đường chạy hoặc chuỗi ánh sáng.
- Active repo → cây, hành tinh hoặc module riêng.
- Stars → hoa/quả phát sáng.

## 4. Animation

Animation nên viết bằng CSS bên trong SVG. Luôn thêm fallback:

```css
@media (prefers-reduced-motion: reduce) {
  .animated-element { animation: none; }
}
```

Tránh chu kỳ nhấp nháy mạnh dưới một giây. Dùng `transform` và `opacity` để animation nhẹ hơn.

## 5. Escaping và an toàn

Import helper từ `../../src/sdk.js`:

```js
import { escapeXml, mergeOptions, truncate } from '../../src/sdk.js';
```

Mọi tên người dùng, repo, ngôn ngữ và chuỗi option phải được escape trước khi đưa vào SVG. Template không được đọc biến môi trường hoặc tự gọi GitHub API.

## 6. Kiểm thử

```bash
npm run validate
npm run preview
```

Validator import từng renderer, render với fixture và kiểm tra contract, kích thước, script/event handler, URL ngoài và kích thước file.
