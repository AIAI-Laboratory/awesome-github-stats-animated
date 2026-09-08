# AIAI GitHub Stats Templates

Kho template SVG animation dành cho [AIAI GitHub Stats](https://aisq.dev/github-stats). Bạn có thể tải một template có sẵn, thay đổi hình vẽ, màu sắc, typography và animation, sau đó gửi lại template mới cho thư viện cộng đồng.

## Template có sẵn

| Template | Mô tả | Preview |
| --- | --- | --- |
| `starter-card` | Bộ khung tối giản, có đủ data mapping để bắt đầu nhanh | [`previews/starter-card.svg`](./previews/starter-card.svg) |
| `ufo-abduction` | UFO 2D bay qua contribution grid và hút commit | [`previews/ufo-abduction.svg`](./previews/ufo-abduction.svg) |
| `repo-garden` | Contribution graph trở thành khu vườn sống | [`previews/repo-garden.svg`](./previews/repo-garden.svg) |

## Bắt đầu nhanh

```bash
git clone https://github.com/AIAI-Laboratory/github-stats-templates.git
cd github-stats-templates
npm run test
```

Không cần cài package bên ngoài. Node.js 20 trở lên là đủ.

Để tạo template mới:

1. Copy thư mục `templates/_starter` thành `templates/<template-id>`.
2. Sửa `manifest.json` và giữ `id` trùng với tên thư mục.
3. Chỉnh hàm `render()` trong `index.js`.
4. Chạy `npm run test` để validate và tạo preview.
5. Mở `previews/<template-id>.svg` để kiểm tra animation.
6. Gửi pull request theo hướng dẫn trong [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Cấu trúc repository

```text
templates/
  _starter/
    manifest.json       Metadata và options mặc định
    index.js            Hàm render SVG
    README.md           Cách tùy biến template
  ufo-abduction/
  repo-garden/
schema/
  template.schema.json  Chuẩn manifest
src/
  sdk.js                Helper an toàn dùng chung
fixtures/
  example-stats.js      Dữ liệu giả để preview
scripts/
  validate.mjs          Kiểm tra contract và SVG nguy hiểm
  render.mjs            Render toàn bộ preview
previews/               SVG được tạo từ fixture
```

## Contract của renderer

Mỗi `index.js` phải export một hàm đồng bộ:

```js
export function render({ profile, calendar, options }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>`;
}
```

- `profile`: tên, username, số repo/follower, danh sách active repo và stars.
- `calendar.days`: 371 ngày theo thứ tự tuần, mỗi ngày có `date`, `count`, `level`, `future`.
- `calendar`: tổng contribution, current streak, longest streak, active days và weekly totals.
- `options`: giá trị mặc định từ manifest được merge với lựa chọn của người dùng.

Chi tiết đầy đủ nằm trong [`docs/AUTHORING.md`](./docs/AUTHORING.md).

## Quy tắc an toàn

Template chỉ tạo SVG thuần. Không dùng network request, filesystem, `eval`, `<script>`, event handler như `onclick`, hoặc tài nguyên HTTP bên ngoài. Tất cả dữ liệu người dùng phải đi qua `escapeXml()`.

`npm run validate` sẽ từ chối các mẫu vi phạm những quy tắc cơ bản này. Template vẫn được review thủ công trước khi xuất hiện trên nền tảng.

## Sử dụng trên README

Sau khi template được duyệt và tích hợp vào catalog của nền tảng, URL có dạng:

```md
![GitHub stats](https://aisq.dev/api/github-stats/USERNAME?template=TEMPLATE_ID)
```

Việc có mặt trong repository chưa tự động đồng nghĩa template đã được deploy. Pull request cần qua validate, review thiết kế và bước phát hành của AIAI.

## License

MIT — bạn có thể fork, chỉnh sửa và tái sử dụng với điều kiện giữ thông báo bản quyền.
