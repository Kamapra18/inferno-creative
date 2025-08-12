const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwg9cF2CClnAUI13Sr_9VKRhHDkimdch2QnbVNyMLoA2uX4GyN3FGadXcyy8hU9Xq5Q1g/exec";
let allGuests = [];

// Fungsi untuk mengkonversi timestamp ke format "waktu yang lalu"
function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) {
    return "Baru saja";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} menit yang lalu`;
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} minggu yang lalu`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} bulan yang lalu`;
  } else {
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} tahun yang lalu`;
  }
}

// Submit Form
document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  showLoader(true);

  fetch(SCRIPT_URL, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.status === "success") {
        showPopup("✅ Terima kasih, konfirmasi Anda sudah tersimpan.");
        form.reset();
        loadGuests(); // reload daftar tamu
      } else {
        showPopup("❌ Terjadi kesalahan, coba lagi.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showPopup("❌ Terjadi kesalahan, coba lagi.");
    })
    .finally(() => {
      showLoader(false);
    });
});

// Loader
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}

// Popup
function showPopup(msg) {
  const popup = document.getElementById("popup");
  document.getElementById("popupMsg").textContent = msg;
  popup.style.display = "block";
  setTimeout(() => (popup.style.display = "none"), 3000);
}

// Load daftar tamu
function loadGuests() {
  showLoader(true);
  fetch(SCRIPT_URL)
    .then((res) => res.json())
    .then((data) => {
      allGuests = Array.isArray(data) ? data : [];
      renderGuests();
    })
    .catch((error) => {
      console.error("Error loading guests:", error);
      allGuests = [];
      renderGuests();
    })
    .finally(() => {
      showLoader(false);
    });
}

// Render daftar tamu
function renderGuests() {
  const guestList = document.getElementById("guestList");

  if (allGuests.length === 0) {
    guestList.innerHTML =
      '<p style="text-align: center; color: #888;">Belum ada tamu yang konfirmasi.</p>';
  } else {
    guestList.innerHTML = allGuests
      .map((guest) => {
        // ganti text panjang jadi singkat
        const statusText =
          guest.kehadiran === "Berhalangan Hadir"
            ? "Tidak Hadir"
            : guest.kehadiran;

        return `
        <div class="guest-card">
          <div class="guest-header">
            <div class="guest-name">${guest.nama}</div>
            <div class="guest-status ${
              statusText === "Tidak Hadir" ? "tidak-hadir" : ""
            }">
              ${statusText}
            </div>
          </div>
          <div class="guest-time"> ${timeAgo(guest.timestamp)}</div>
          <p class="guest-message">${guest.pesan || "Tidak ada pesan"}</p>
        </div>
      `;
      })
      .join("");
  }
}

// Initial load
document.addEventListener("DOMContentLoaded", loadGuests);
