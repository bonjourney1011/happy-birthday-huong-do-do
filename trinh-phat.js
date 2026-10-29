// ---------- Trạng thái ----------
let tatCaBai = [...(window.BAI_HAT_MAC_DINH || []), ...docBaiThem()];
let boLoc = "tat-ca";
let tron = false;
let thuTu = []; // id các bài theo thứ tự sẽ phát (đã lọc, có thể đã trộn)
let viTri = -1;
let baiDangPhat = null;
let player = null;
let sanSang = false;
let choPhat = null; // bài được chọn trước khi YouTube tải xong
let loiLienTiep = 0;

const $ = (id) => document.getElementById(id);

function baiTheoLoc() {
  return boLoc === "tat-ca" ? tatCaBai : tatCaBai.filter((b) => b.nhom === boLoc);
}

// Dựng lại hàng chờ, giữ bài đang phát ở đúng chỗ
function dungThuTu() {
  const ids = baiTheoLoc().map((b) => b.id);
  const hienTai = baiDangPhat && baiDangPhat.id;
  if (tron) {
    const conLai = xaoTron(ids.filter((id) => id !== hienTai));
    thuTu = ids.includes(hienTai) ? [hienTai, ...conLai] : conLai;
  } else {
    thuTu = ids;
  }
  viTri = thuTu.indexOf(hienTai);
}

// ---------- Phát nhạc ----------
function phatBai(id) {
  const bai = tatCaBai.find((b) => b.id === id);
  if (!bai) return;
  baiDangPhat = bai;
  viTri = thuTu.indexOf(id);
  $("bao-loi").hidden = true;
  if (sanSang) player.loadVideoById(id);
  else choPhat = id;
  $("ten-bai").textContent = bai.ten;
  $("ca-si").textContent = bai.caSi;
  veDanhSach();
  moLaThu();
}

function baiTiep() {
  if (!thuTu.length) return;
  phatBai(thuTu[(viTri + 1) % thuTu.length]);
}

function baiTruoc() {
  if (!thuTu.length) return;
  phatBai(thuTu[viTri <= 0 ? thuTu.length - 1 : viTri - 1]);
}

function batTatPhat() {
  if (!baiDangPhat) return baiTiep();
  if (!sanSang) return;
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
}

function hienDangPhat(dangPhat) {
  document.body.classList.toggle("dang-phat", dangPhat);
  $("nut-phat").setAttribute("aria-label", dangPhat ? "Tạm dừng" : "Phát");
  $("nut-phat").querySelector("use").setAttribute("href", dangPhat ? "#i-dung" : "#i-phat");
}

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("video", {
    videoId: thuTu[0],
    playerVars: { playsinline: 1, rel: 0 },
    events: {
      onReady: () => {
        sanSang = true;
        if (choPhat) player.loadVideoById(choPhat);
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) loiLienTiep = 0;
        if (e.data === YT.PlayerState.ENDED) baiTiep();
        hienDangPhat(e.data === YT.PlayerState.PLAYING);
      },
      onError: () => {
        $("bao-loi").textContent = "Bài này YouTube không cho phát ở đây, em chuyển sang bài tiếp nhé.";
        $("bao-loi").hidden = false;
        if (++loiLienTiep < thuTu.length) setTimeout(baiTiep, 2000);
      },
    },
  });
};

// ---------- Danh sách bài ----------
function veDanhSach() {
  const ds = $("ds-bai");
  ds.replaceChildren();
  baiTheoLoc().forEach((bai) => {
    const dong = $("mau-bai").content.firstElementChild.cloneNode(true);
    dong.dataset.id = bai.id;
    dong.classList.toggle("dang-chon", bai === baiDangPhat);
    dong.querySelector("img").src = `https://i.ytimg.com/vi/${bai.id}/mqdefault.jpg`;
    dong.querySelector(".ten").textContent = bai.ten;
    dong.querySelector(".ca-si").textContent = bai.caSi;
    dong.querySelector(".nut-xoa").hidden = bai.nhom !== "them";
    ds.appendChild(dong);
  });
  $("ds-trong").hidden = ds.children.length > 0;
  document.querySelectorAll(".chip").forEach((chip) => {
    const loc = chip.dataset.loc;
    const dem = loc === "tat-ca" ? tatCaBai.length : tatCaBai.filter((b) => b.nhom === loc).length;
    chip.querySelector("b").textContent = dem;
    chip.setAttribute("aria-pressed", loc === boLoc);
  });
}

$("ds-bai").addEventListener("click", (e) => {
  const dong = e.target.closest("li");
  if (!dong) return;
  if (e.target.closest(".nut-xoa")) return xoaBai(dong.dataset.id);
  phatBai(dong.dataset.id);
});

$("bo-loc").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  boLoc = chip.dataset.loc;
  dungThuTu();
  veDanhSach();
});

$("nut-tron").addEventListener("click", () => {
  tron = !tron;
  $("nut-tron").setAttribute("aria-pressed", tron);
  dungThuTu();
  if (!baiDangPhat) baiTiep();
});

$("nut-phat").addEventListener("click", batTatPhat);
$("nut-tiep").addEventListener("click", baiTiep);
$("nut-lui").addEventListener("click", baiTruoc);

// ---------- Thêm / xoá bài chị tự thêm ----------
function luuVaVeLai() {
  const ok = luuBaiThem(tatCaBai.filter((b) => b.nhom === "them"));
  dungThuTu();
  veDanhSach();
  return ok;
}

$("form-them").addEventListener("submit", async (e) => {
  e.preventDefault();
  const bao = $("bao-them");
  const id = layIdYoutube($("o-link").value);
  if (!id) return (bao.textContent = "Link này chưa đúng, chị dán link YouTube của bài hát nhé.");
  const cu = tatCaBai.find((b) => b.id === id);
  if (cu) return (bao.textContent = `Bài «${cu.ten}» có trong danh sách rồi chị ơi.`);

  const nut = e.submitter || $("form-them").querySelector("button");
  nut.disabled = true;
  bao.textContent = "Em đang lấy tên bài…";
  const { bai, loi } = await layThongTinVideo(id);
  nut.disabled = false;
  if (loi) return (bao.textContent = loi);

  tatCaBai.push(bai);
  const daLuu = luuVaVeLai();
  $("o-link").value = "";
  bao.textContent = `Đã thêm «${bai.ten}». Chị bấm vào bài để nghe nhé.` +
    (daLuu ? "" : " (Trình duyệt này không lưu được, tải lại trang sẽ mất bài.)");
});

function xoaBai(id) {
  const bai = tatCaBai.find((b) => b.id === id);
  if (!bai || !confirm(`Xoá «${bai.ten}» khỏi danh sách?`)) return;
  tatCaBai = tatCaBai.filter((b) => b !== bai);
  luuVaVeLai();
}

// ---------- Mở góc thư giãn (trình duyệt cần một cú chạm mới cho phát nhạc) ----------
$("nut-mo").addEventListener("click", () => {
  $("man-mo").classList.add("an");
  baiTiep();
});

dungThuTu();
veDanhSach();
