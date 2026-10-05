// Cá Tầm Mai Anh Đào – tương tác trang
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// ---- Header đổi nền khi cuộn + parallax ảnh hero ----
const header = $('.site-header');
const heroBg = $('[data-parallax]');
let ticking = false;
function onScroll() {
  const y = scrollY;
  header.classList.toggle('scrolled', y > 40);
  if (heroBg && !reduceMotion && y < innerHeight * 1.2) heroBg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// ---- Menu điện thoại ----
const toggle = $('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = document.body.classList.toggle('nav-open');
  toggle.setAttribute('aria-expanded', open);
});
$$('.main-nav a').forEach(a => a.addEventListener('click', () => {
  document.body.classList.remove('nav-open');
  toggle.setAttribute('aria-expanded', false);
}));

// ---- Hiện dần khi cuộn tới ----
const revealIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
}), { rootMargin: '0px 0px -10% 0px' });
$$('[data-reveal]').forEach(el => revealIO.observe(el));
// ảnh trong lưới hiện lần lượt theo cột
$$('.masonry .tile').forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 0.08}s`));

// ---- Số chạy ----
const countIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  countIO.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
  const fmt = n => n.toLocaleString('vi-VN');
  if (reduceMotion) return (el.textContent = fmt(end));
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}), { threshold: 0.6 });
$$('[data-count]').forEach(el => countIO.observe(el));

// ---- Chuyển trang: mỗi mục menu là 1 trang riêng (#gioi-thieu, #hinh-anh, ...) ----
const views = $$('.view');
const navLinks = $$('.main-nav a');
const form = $('#quote-form');
function focusForm() {
  form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  setTimeout(() => {
    $('#f-name').focus({ preventScroll: true });
    form.classList.remove('flash'); void form.offsetWidth; form.classList.add('flash');
  }, reduceMotion ? 0 : 600);
}
function route() {
  const hash = location.hash.slice(1);
  const booking = hash === 'dat-ban'; // nút ĐẶT BÀN → trang Liên hệ + đặt con trỏ vào form
  const view = views.find(v => v.dataset.page === (booking ? 'lien-he' : hash)) || views[0];
  if (!view.classList.contains('is-active')) {
    views.forEach(v => v.classList.toggle('is-active', v === view));
    // chạy lại hiệu ứng xuất hiện mỗi lần mở trang
    $$('[data-reveal]', view).forEach(el => { el.classList.remove('in'); revealIO.observe(el); });
    scrollTo({ top: 0, behavior: 'instant' });
  }
  document.body.dataset.page = view.dataset.page;
  document.title = view.dataset.title;
  navLinks.forEach(a => a.classList.toggle('active', a.hash === '#' + view.dataset.page));
  if (booking) focusForm();
}
addEventListener('hashchange', route);
route();
// đang ở #dat-ban mà bấm Đặt bàn lần nữa: hash không đổi nên gọi trực tiếp
$$('[data-booking]').forEach(a => a.addEventListener('click', ev => {
  if (location.hash === '#dat-ban') { ev.preventDefault(); focusForm(); }
}));

// ---- Gửi form vào Google Form ----
form.addEventListener('submit', async ev => {
  ev.preventDefault();
  const msg = $('.form-msg', form);
  const fields = $$('input, select, textarea', form);
  fields.forEach(f => f.classList.toggle('invalid', !f.checkValidity()));
  const bad = fields.find(f => !f.checkValidity());
  if (bad) {
    msg.className = 'form-msg err';
    msg.textContent = 'Vui lòng nhập đúng Họ tên, Số điện thoại và chọn Nhu cầu.';
    return bad.focus();
  }
  const btn = $('button[type=submit]', form);
  btn.disabled = true; msg.className = 'form-msg'; msg.textContent = 'Đang gửi...';
  try {
    // Google Form không trả CORS nên dùng no-cors: gửi được nhưng không đọc được phản hồi
    await fetch(form.action, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(form)) });
    form.reset();
    msg.className = 'form-msg ok';
    msg.textContent = 'Cảm ơn bạn! Mai Anh Đào đã nhận thông tin và sẽ liên hệ trong thời gian sớm nhất.';
  } catch {
    msg.className = 'form-msg err';
    msg.textContent = 'Chưa gửi được, vui lòng thử lại hoặc gọi 0913.683.605.';
  } finally { btn.disabled = false; }
});
$$('input, select, textarea', form).forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));

// ---- Xem ảnh phóng to ----
const lb = $('#lightbox'), lbImg = $('img', lb);
let group = [], idx = 0;
function show(i) {
  idx = (i + group.length) % group.length;
  lbImg.src = group[idx].href;
  lbImg.alt = $('img', group[idx])?.alt || '';
  $$('.lb-prev, .lb-next', lb).forEach(b => (b.hidden = group.length < 2));
}
$$('.masonry .tile, [data-lightbox]').forEach(a => a.addEventListener('click', ev => {
  ev.preventDefault();
  group = a.matches('.tile') ? $$('.masonry .tile') : $$('[data-lightbox]');
  show(group.indexOf(a));
  lb.showModal();
}));
lb.addEventListener('click', ev => {
  const act = ev.target.dataset.lb;
  if (act === 'prev') show(idx - 1);
  else if (act === 'next') show(idx + 1);
  else if (act === 'close' || ev.target === lb) lb.close();
});
addEventListener('keydown', ev => {
  if (!lb.open) return;
  if (ev.key === 'ArrowLeft') show(idx - 1);
  if (ev.key === 'ArrowRight') show(idx + 1);
});
let touchX = 0;
lb.addEventListener('touchstart', e => (touchX = e.touches[0].clientX), { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
});

// ---- Menu sách lật (chỉ tải khi cuộn gần tới) ----
const book = $('#flipbook');
new IntersectionObserver(([e], io) => {
  if (!e.isIntersecting || !window.St) return;
  io.disconnect();
  const n = +book.dataset.pages;
  const pages = Array.from({ length: n }, (_, i) => `assets/menu/trang-${String(i + 1).padStart(2, '0')}.jpg`);
  book.innerHTML = pages.map((src, i) => `<div class="page"><img src="${src}" alt="Thực đơn trang ${i + 1}"></div>`).join('');
  const flip = new St.PageFlip(book, {
    width: 460, height: 651, size: 'stretch',
    minWidth: 260, maxWidth: 460, minHeight: 368, maxHeight: 651,
    showCover: true, usePortrait: true, mobileScrollSupport: true, maxShadowOpacity: 0.35,
  });
  flip.loadFromHTML($$('.page', book));
  const count = $('.flip-count');
  const update = () => (count.textContent = `${flip.getCurrentPageIndex() + 1} / ${n}`);
  flip.on('flip', update);
  flip.on('changeOrientation', update);
  $('[data-flip=prev]').addEventListener('click', () => flip.flipPrev());
  $('[data-flip=next]').addEventListener('click', () => flip.flipNext());
}, { rootMargin: '400px 0px' }).observe(book);
