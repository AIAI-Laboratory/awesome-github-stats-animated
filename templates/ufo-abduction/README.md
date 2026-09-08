# UFO Abduction

Một UFO 2D bay qua nhiều vùng của contribution graph. Các ô commit sáng được hút lên theo từng pha rồi xuất hiện lại khi chu kỳ mới bắt đầu.

## Data mapping

- Contribution level → cường độ màu đỏ.
- Active contribution → vật thể được UFO hút.
- Weekly totals → đường signal phía trên graph.
- Total/current streak/active days → các metric ở header.

## Options

- `accent`: màu signal, đèn UFO và active commit.
- `background`: nền thẻ.
- `duration`: thời gian hoàn thành một vòng bay, từ 10–40 giây.

Bạn có thể sửa route trong `@keyframes flight`, hình thân tàu trong `renderUfo()` và logic chia phase trong `renderCells()`.
