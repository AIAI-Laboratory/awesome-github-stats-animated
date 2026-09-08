# Đóng góp template

Cảm ơn bạn muốn biến dữ liệu GitHub thành một câu chuyện trực quan mới.

## Quy trình

1. Fork repository và tạo branch `template/<template-id>`.
2. Copy `templates/_starter` sang một thư mục mới.
3. Chọn `id` duy nhất, viết thường, chỉ gồm chữ cái, số và dấu gạch ngang.
4. Hoàn thiện `manifest.json`, `index.js` và `README.md` của template.
5. Chạy `npm run test` bằng Node.js 20+.
6. Kiểm tra preview ở kích thước thật và kích thước README hẹp.
7. Tạo pull request bằng checklist có sẵn.

## Tiêu chí chấp nhận

- Mapping dữ liệu có ý nghĩa; animation không chỉ mang tính trang trí.
- Nội dung vẫn đọc được khi GitHub tắt animation hoặc người dùng bật reduced motion.
- SVG có `title`, `desc`, `role="img"` và `aria-labelledby`.
- Không dùng font, ảnh hoặc script từ bên ngoài.
- Không nhúng token, email, analytics hoặc dữ liệu cá nhân.
- Không thực hiện network/filesystem access trong renderer.
- Output dưới 500 KB với fixture mặc định.
- Màu sắc đủ tương phản và animation không nhấp nháy quá nhanh.

## Versioning

- Patch: sửa lỗi hình ảnh, không đổi options hay data mapping.
- Minor: thêm option tương thích ngược.
- Major: đổi contract, option hoặc kết quả theo cách không tương thích.

## Review

Maintainer có thể yêu cầu thay đổi về accessibility, hiệu năng, bản quyền hoặc độ an toàn. Template được merge sẽ được phát hành lên catalog theo đợt; merge không đảm bảo deploy ngay lập tức.
