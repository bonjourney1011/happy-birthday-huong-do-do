// ---------- Lá thư ngẫu nhiên cho mỗi bài ----------
// Rút kiểu "bốc thăm trong túi": đọc hết các lá rồi mới xáo lại, nên ít khi gặp lại lá vừa đọc.
const THU = window.THONG_DIEP || [];
let tuiThu = [];
let laVuaDoc = -1;

function xaoTron(mang) {
  const ban = [...mang];
  for (let i = ban.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ban[i], ban[j]] = [ban[j], ban[i]];
  }
  return ban;
}

function rutLaThu() {
  if (!tuiThu.length) {
    tuiThu = xaoTron(THU.map((_, i) => i));
    if (tuiThu.length > 1 && tuiThu[tuiThu.length - 1] === laVuaDoc) tuiThu.unshift(tuiThu.pop());
  }
  laVuaDoc = tuiThu.pop();
  return THU[laVuaDoc];
}

function moLaThu() {
  if (!THU.length) return;
  const la = document.getElementById("la-thu");
  document.getElementById("noi-dung-thu").textContent = rutLaThu();
  la.classList.remove("mo");
  void la.offsetWidth; // ép trình duyệt chạy lại hiệu ứng mở thư
  la.classList.add("mo");
}

document.getElementById("ky-ten").textContent = "— " + (window.NGUOI_GUI || "em");
document.getElementById("nut-rut-thu").addEventListener("click", moLaThu);
