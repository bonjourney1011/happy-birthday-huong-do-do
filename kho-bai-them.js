// ---------- Bài chị tự thêm: đọc link YouTube, lấy tên bài, lưu trong trình duyệt ----------
const KHOA_LUU_BAI = "goc-thu-gian-huong:bai-them";
const MAU_ID = /^[\w-]{11}$/;

// Nhận các dạng: youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID, /live/ID,
// music.youtube.com/watch?v=ID, hoặc chỉ dán đúng 11 ký tự ID
function layIdYoutube(link) {
  const chu = (link || "").trim();
  if (MAU_ID.test(chu)) return chu;
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(chu) ? chu : "https://" + chu);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  let id = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v");
    const doan = url.pathname.split("/");
    if (!id && ["shorts", "embed", "live", "v"].includes(doan[1])) id = doan[2];
  }
  return id && MAU_ID.test(id) ? id : null;
}

function docBaiThem() {
  try {
    const ds = JSON.parse(localStorage.getItem(KHOA_LUU_BAI) || "[]");
    return Array.isArray(ds) ? ds.filter((b) => b && MAU_ID.test(b.id)) : [];
  } catch {
    return [];
  }
}

function luuBaiThem(ds) {
  try {
    localStorage.setItem(KHOA_LUU_BAI, JSON.stringify(ds));
    return true;
  } catch {
    return false;
  }
}

// Hỏi YouTube tên bài + kênh. Video cấm nhúng hoặc riêng tư thì báo lỗi luôn,
// còn nếu chỉ rớt mạng thì vẫn cho thêm với tên tạm.
async function layThongTinVideo(id) {
  const link = "https://www.youtube.com/watch?v=" + id;
  try {
    const res = await fetch("https://www.youtube.com/oembed?format=json&url=" + encodeURIComponent(link));
    if (res.status === 401 || res.status === 403) {
      return { loi: "Video này chủ kênh không cho phát ở trang khác, chị chọn bản khác nhé." };
    }
    if (!res.ok) return { loi: "Em không tìm thấy video này (có thể video đã ẩn hoặc riêng tư)." };
    const d = await res.json();
    return { bai: { id, ten: d.title || "Bài chị thêm", caSi: d.author_name || "YouTube", nhom: "them" } };
  } catch {
    return { bai: { id, ten: "Bài chị thêm", caSi: "YouTube", nhom: "them" } };
  }
}
