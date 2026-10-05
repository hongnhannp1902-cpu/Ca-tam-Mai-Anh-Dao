# Website Cá Tầm Mai Anh Đào

Website (HTML/CSS/JS thuần, không cần build) cho Nhà hàng Cá Tầm Mai Anh Đào – Đà Lạt.

Mỗi mục menu là một trang riêng, mở theo địa chỉ: `#gioi-thieu`, `#hinh-anh`, `#thuc-don`, `#tuyen-dung`, `#lien-he`
(trang chủ là địa chỉ gốc). Nút **Đặt bàn** dẫn tới `#dat-ban` = trang Liên hệ và đặt sẵn con trỏ vào form.
Nội dung từng trang nằm trong các khối `<div class="view" data-page="...">` của `index.html`.

## Chạy demo trên Netlify
1. Đăng nhập https://app.netlify.com bằng tài khoản GitHub.
2. **Add new site → Import an existing project → GitHub** → chọn repo `Ca-tam-Mai-Anh-Dao`.
3. Build command: để trống · Publish directory: `/` → **Deploy**.
4. Mỗi lần có thay đổi trên nhánh `main`, Netlify tự cập nhật.

## Cấu trúc
```
index.html                 Toàn bộ nội dung trang
assets/css/style.css       Giao diện (màu sắc ở đầu file, mục :root)
assets/js/main.js          Hiệu ứng, form, xem ảnh, sách lật
assets/js/page-flip.browser.js   Thư viện sách lật (StPageFlip, MIT)
assets/img/intro/          Ảnh mục Giới thiệu
assets/img/gallery/        Ảnh mục Hình ảnh (ảnh lớn) + thumb/ (ảnh nhỏ cho lưới)
assets/img/tuyen-dung/     Poster tuyển dụng (có mã QR)
assets/menu/               16 trang menu (trang-01.jpg … trang-16.jpg) + file PDF tải về
```

## Sửa nội dung thường gặp
- **Chữ, số điện thoại, địa chỉ**: tìm và sửa trực tiếp trong `index.html`.
- **Thêm ảnh vào mục Hình ảnh**: đặt ảnh lớn vào `assets/img/gallery/`, ảnh nhỏ (rộng ~900px) cùng tên vào `assets/img/gallery/thumb/`, rồi copy thêm 1 dòng `<a class="tile" ...>` trong `index.html` (mục `HÌNH ẢNH`).
- **Đổi menu**: thay các file `assets/menu/trang-XX.jpg` (giữ tỉ lệ A4 dọc) và `data-pages="16"` nếu số trang khác.

## Form liên hệ
Form "Nhận thông tin Báo giá" gửi thẳng vào Google Form (dữ liệu về Google Sheets, email thông báo theo cài đặt của Google Form).
Các mã trường `entry.*` nằm trong `index.html`. Nếu sửa câu hỏi trong Google Form, các lựa chọn của trường **Nhu cầu** phải giữ đúng chữ:
`Đặt bàn`, `Đặt đoàn`, `Tiệc/Sự kiện`, `Khác`.
