# Góc thư giãn của Hương Đô Đô (Jasmine Đỗ)

Trang tĩnh (HTML/CSS/JS), chạy thẳng trên GitHub Pages, không cần build.

## Có gì trong trang
- Nhạc Đen và Vũ có sẵn (18 bài, lấy từ kênh chính thức), lọc theo Tất cả / Đen / Vũ / Chị thêm.
- Ô dán link YouTube để thêm bài. Bài thêm được lưu trong trình duyệt của người dùng.
- Nút **Trộn bài** để phát ngẫu nhiên. Hết bài thì tự chuyển bài tiếp.
- Mỗi lần mở một bài sẽ hiện một **lá thư ngẫu nhiên**. Bấm "Rút lá khác" để đọc lá khác.

## Sửa nội dung
| Muốn sửa | File |
|---|---|
| Lời trong các lá thư, tên người ký | `thong-diep.js` |
| Bài có sẵn (thêm/bớt) | `danh-sach-bai-hat.js` — `id` là 11 ký tự sau `v=` trong link YouTube |
| Lời chào đầu trang, chân trang | `index.html` |
| Màu sắc | biến màu đầu file `style.css` |

## Xem thử trên máy
Nhạc YouTube không phát khi mở file trực tiếp (`file://`). Chạy `python -m http.server 8000`
trong thư mục này rồi mở `http://localhost:8000`.

## Đưa lên GitHub Pages
1. Tạo repo Public, đẩy thư mục này lên nhánh `main`.
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.
3. Sau 1–2 phút trang có ở `https://<tên-github>.github.io/<tên-repo>/`.
