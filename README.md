# AIAI GitHub Stats Templates

Kho template SVG animation dành cho [AIAI GitHub Stats](https://aisq.dev/github-stats). Bạn có thể tải một template có sẵn, thay đổi hình vẽ, màu sắc, typography và animation, sau đó gửi lại template mới cho thư viện cộng đồng.

## Template có sẵn

| Template | Mô tả | Preview |
| --- | --- | --- |
| `starter-card` | Bộ khung tối giản, có đủ data mapping để bắt đầu nhanh | [`previews/starter-card.svg`](./previews/starter-card.svg) |
| `ufo-abduction` | UFO 2D bay qua contribution grid và hút commit | [`previews/ufo-abduction.svg`](./previews/ufo-abduction.svg) |
| `repo-garden` | Contribution graph trở thành khu vườn sống | [`previews/repo-garden.svg`](./previews/repo-garden.svg) |
| `particle-collider` | Repo trở thành nguồn hạt, commit va chạm và thắp sáng detector grid | [`previews/particle-collider.svg`](./previews/particle-collider.svg) |
| `field-notes` | Minimal science: chữ monospace, trace theo tuần và contribution dạng chấm | [`previews/field-notes.svg`](./previews/field-notes.svg) |

Tất cả mẫu hỗ trợ **Auto / Dark / Light**, màu chủ đạo và reduced motion. Bản light có hậu cảnh trắng. Preview nền sáng có hậu tố `-light.svg`, ví dụ [`Field Notes light`](./previews/field-notes-light.svg).

## Bắt đầu nhanh

```bash
git clone https://github.com/AIAI-Laboratory/awesome-github-stats-animated.git
cd awesome-github-stats-animated
npm run test
```

Không cần cài package bên ngoài. Node.js 20 trở lên là đủ.

Để tạo template mới:

1. Copy thư mục `templates/_starter` thành `templates/<template-id>`.
2. Sửa `manifest.json` và giữ `id` trùng với tên thư mục.
3. Chỉnh hàm `render()` trong `index.js`; với các mẫu hoàn chỉnh, phần hình vẽ nằm trong `renderer.js`.
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
  particle-collider/
  field-notes/
schema/
  template.schema.json  Chuẩn manifest
src/
  sdk.js                Helper an toàn dùng chung
  githubStatsTheme.js   Auto/Dark/Light và palette dùng chung
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

Trong phiên bản website có Live GitHub Template Library, URL có dạng:

```md
![GitHub stats](https://aisq.dev/api/github-stats/USERNAME?template=TEMPLATE_ID)
```

Website đọc manifest từ nhánh `main`, rồi tải renderer cùng SDK ở một commit thống nhất và render ngay khi người dùng chọn mẫu. Catalog cập nhật mỗi 5 phút; template mới không cần build/deploy lại website. Chỉ bản tích hợp thư viện trên website cần được deploy lần đầu.

```text
/api/github-stats/USERNAME?template=field-notes
/api/github-stats/USERNAME?template=repo-garden&theme=light&color=FF4DDE
/api/github-stats/USERNAME?template=particle-collider&opt.particleA=%2343e2ff
```

Template phải qua review trước khi merge. Môi trường render chỉ cho phép module trong thư mục template, `src/sdk.js` và `src/githubStatsTheme.js`; không có Node, network, filesystem hoặc token. `render()` đồng bộ, tối đa 300 ms / 24 MB, output SVG dưới 500 KB. Không thêm dependency npm vào template.

## Cập nhật phiên bản 2

UFO, Garden, Collider và Starter đã đồng bộ với thiết kế mới nhất. Option `background`, `leaf`, `duration` của các mẫu cũ được thay bằng `theme` và bộ màu được renderer hỗ trợ. Hai mẫu nhiều màu Garden/Collider có `particleA`–`particleD` để nhận palette từ website; giữ mặc định sẽ dùng palette gốc theo theme. Field Notes là mẫu mới phiên bản 1.0.0.

## License

MIT — bạn có thể fork, chỉnh sửa và tái sử dụng với điều kiện giữ thông báo bản quyền.
