// Referensi elemen DOM
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
const music = document.getElementById("bgMusic");
const musicIcon = document.getElementById("musicIcon");
const musicTitle = document.getElementById("musicTitle");

// Pastikan elemen tombol hadiah ada di HTML dengan ID 'openGiftBtn'
const openGiftBtn = document.getElementById('openGiftBtn');
// Pastikan ada kontainer di HTML untuk animasi kue dan balon
// Kontainer ini akan digunakan untuk menampung balon gambar yang terbang
const animationContainer = document.getElementById('animationContainer');

// URL gambar kue dan balon (PASTIKAN JALUR INI BENAR!)
// Ganti dengan jalur gambar yang sesuai di proyekmu
const cakeImageUrl = 'Assets/Kue.png'; // Jalur sudah kamu perbarui
const balloonImageUrl = 'Assets/ballon.png'; // Jalur sudah kamu perbarui

// Playlist musik
const playlist = [
  { file: 'Music/Ed Sheeran - Perfect.mp3', title: 'Ed Sheeran - Perfect' },
  { file: 'Music/Taylor Swift - Love Story (Taylor’s Version) Lirik Terjemahan.mp3', title: 'Taylor Swift - Love Story' }, // Pastikan path ini benar
  { file: 'Music/Third Song.mp3', title: 'Untukmu, Sayang' } // Pastikan path ini benar
];
let currentTrack = 0; // Indeks lagu yang sedang diputar

// Fungsi untuk menampilkan halaman berdasarkan ID
function showPage(sectionId) {
  // Sembunyikan semua section dan header
  document.querySelectorAll("section, header").forEach(el => {
    el.style.display = "none";
  });

  const page = document.getElementById(sectionId);
  if (page) {
    page.style.display = "block";

    // Refresh AOS (Animate On Scroll) setelah elemen terlihat
    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }, 100);
  } else {
    console.warn(`Halaman dengan ID: ${sectionId} tidak ditemukan!`);
  }

  // Mainkan musik saat user klik tombol pertama kali
  if (music && music.paused) {
    playMusic(currentTrack);
  }
}

// Fungsi yang dipanggil saat tombol "Buka Hadiah 🎁" diklik
function bukaHadiah() {
  showPage('mainGallery'); // Mengarahkan ke galeri utama

  if (music && music.paused) {
    playMusic(currentTrack);
  }
}

// Tambahkan di script.js
document.addEventListener("mousemove", function (e) {
  const text = document.createElement("div");
  text.classList.add("floating-text");
  text.textContent = "I ❤️ U";
  text.style.left = `${e.pageX}px`;
  text.style.top = `${e.pageY}px`;
  document.body.appendChild(text);
  setTimeout(() => {
    text.remove();
  }, 1000);
});


// Play musik dari playlist berdasarkan indeks
function playMusic(index) {
  if (index >= playlist.length) {
    index = 0;
  }
  if (index < 0) {
    index = playlist.length - 1;
  }

  currentTrack = index;
  music.src = playlist[currentTrack].file;
  musicTitle.textContent = playlist[currentTrack].title;

  music.play()
    .then(() => {
      musicIcon.classList.add("spin");
    })
    .catch(error => {
      console.error("Gagal memutar musik:", error);
      alert("Browser mungkin memblokir autoplay. Silakan klik ikon musik atau tombol untuk memulai.");
      musicIcon.classList.remove("spin");
    });
}

// Fungsi untuk memutar lagu berikutnya
function nextMusic() {
  playMusic(currentTrack + 1);
}

// Fungsi untuk memutar lagu sebelumnya
function prevMusic() {
  playMusic(currentTrack - 1);
}

// Event listener: Musik selesai → lanjut ke lagu berikutnya
music.addEventListener('ended', () => {
  nextMusic();
});

// Event listener: Musik dijeda → hapus spin dan update judul
music.addEventListener('pause', () => {
  musicIcon.classList.remove("spin");
  musicTitle.textContent = "⏸️ Lagu dijeda";
});

// Event listener: Musik diputar → tambahkan spin
music.addEventListener('play', () => {
  musicIcon.classList.add("spin");
});

// Event listener: Toggle musik saat ikon diklik
musicIcon.addEventListener("click", () => {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
});

function showSecretMessage() {
  document.getElementById("secretPopup").style.display = "block";
}

function closeSecretMessage() {
  document.getElementById("secretPopup").style.display = "none";
}

// --- Animasi Kue dan Balon (saat klik tombol hadiah) ---

// Fungsi untuk membuat elemen kue (dengan efek "achievement")
function createCake() {
    const cake = document.createElement('img');
    cake.src = cakeImageUrl;
    cake.alt = 'Birthday Cake';
    cake.classList.add('animated-cake'); // Kelas ini akan mengontrol posisi dan animasi
    document.body.appendChild(cake); // Tambahkan kue langsung ke body agar posisinya fixed di tengah layar

    // Hapus kue setelah animasinya selesai (atau saat overlay hilang)
    setTimeout(() => {
        cake.remove();
    }, 2000); // Sesuaikan dengan durasi animasi CSS `cakeAppear` + sedikit jeda
}

// Fungsi untuk membuat elemen balon (gambar)
function createBalloonImage() {
    const balloon = document.createElement('img');
    balloon.src = balloonImageUrl;
    balloon.alt = 'Balloon';
    balloon.classList.add('animated-element', 'animated-balloon'); // animated-element untuk properti dasar
                                                                 // animated-balloon untuk animasi terbang

    // Posisi acak di bagian bawah layar
    const startX = Math.random() * (window.innerWidth - 60); // 60px lebar balon
    balloon.style.left = `${startX}px`;
    balloon.style.bottom = `-50px`; // Mulai dari bawah layar

    animationContainer.appendChild(balloon); // Tambahkan balon ke animationContainer

    // Hapus balon setelah animasi selesai
    setTimeout(() => {
        balloon.remove();
    }, 4000); // Sesuaikan dengan durasi animasi CSS `riseAndFade`
}

// Fungsi yang dipanggil saat tombol "Buka Hadiah Spesial" diklik
function handleOpenGift() {
    // 1. Buat overlay gelap
    const overlay = document.createElement('div');
    overlay.classList.add('cake-overlay');
    document.body.appendChild(overlay); // Tambahkan overlay ke body agar menutupi seluruh layar

    // Beri sedikit jeda agar overlay muncul dulu, lalu animasikan kue dan balon
    setTimeout(() => {
        overlay.classList.add('show'); // Aktifkan transisi opacity untuk overlay

        // 2. Munculkan kue besar di tengah
        createCake();

        // 3. Munculkan beberapa balon gambar secara acak
        for (let i = 0; i < 15; i++) { // Jumlah balon
            setTimeout(() => {
                createBalloonImage();
            }, i * 150); // Selang waktu 150ms antara setiap balon
        }

        // 4. Setelah animasi selesai, baru arahkan ke link hadiah
        // Beri waktu animasi kue dan balon untuk berjalan sebelum mengarahkan link
        setTimeout(() => {
            window.open('https://www.instagram.com/sweetdump300324/?utm_source=ig_web_button_share_sheet', '_blank'); // Buka link hadiah

            // Hapus overlay setelah mengarahkan ke link (opsional, tergantung transisi)
            overlay.classList.remove('show'); // Mulai transisi menghilang
            setTimeout(() => overlay.remove(), 600); // Hapus overlay setelah transisi opacity selesai
        }, 2500); // Sesuaikan durasi ini: (durasi animasi kue + jeda ekstra)
                  // Kue 1s, balon 4s (tapi muncul berurutan). 2.5s cukup untuk efek
    }, 100); // Sedikit jeda sebelum overlay muncul (opsional, agar transisi lebih halus)
}

// Tambahkan event listener ke tombol "Buka Hadiah Spesial"
if (openGiftBtn) {
  openGiftBtn.addEventListener('click', handleOpenGift);
}

// --- Animasi Balon di Canvas (dari kode lama) ---
// Ini adalah animasi balon yang terus-menerus di latar belakang menggunakan canvas
// KODE INI SEKARANG HANYA AKAN BERJALAN JIKA KAMU SECARA EKSPLISIT MEMANGGILNYA
let balloonsCanvas = [];
const MAX_BALLOONS_CANVAS = 50;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createBalloonCanvas() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 20, // mulai dari bawah
    size: Math.random() * 20 + 20,
    speed: Math.random() * 1 + 0.5,
    color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    stringLength: Math.random() * 20 + 30
  };
}

function drawBalloonsCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balloonsCanvas.forEach((balloon, index) => {
    // Balon (lingkaran)
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.fillStyle = balloon.color;
    ctx.ellipse(balloon.x, balloon.y, balloon.size * 0.6, balloon.size, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tali balon
    ctx.beginPath();
    ctx.moveTo(balloon.x, balloon.y + balloon.size);
    ctx.lineTo(balloon.x, balloon.y + balloon.size + balloon.stringLength);
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Pergerakan ke atas
    balloon.y -= balloon.speed;
    if (balloon.y + balloon.size < 0) balloonsCanvas.splice(index, 1);
  });
}

function animateBalloonsCanvas() {
  if (balloonsCanvas.length < MAX_BALLOONS_CANVAS) {
    balloonsCanvas.push(createBalloonCanvas());
  }
  drawBalloonsCanvas();
  requestAnimationFrame(animateBalloonsCanvas);
}

// --- Animasi Hati (dari kode lama, perlu definisi jika ingin digunakan) ---
/*
function animateHearts() {
  console.log("Fungsi animateHearts() dipanggil.");
  requestAnimationFrame(animateHearts);
}
*/

// Inisialisasi Aplikasi saat DOM selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas(); // Sesuaikan ukuran canvas
  AOS.init(); // Inisialisasi AOS (hanya sekali)
  // animateBalloonsCanvas(); // BARIS INI DIKOMENTARI AGAR BALON CANVAS TIDAK MUNCUL DI AWAL
  // animateHearts(); // Dikomentari karena belum didefinisikan
});

// Sesuaikan ukuran canvas saat jendela diubah ukurannya
window.addEventListener('resize', resizeCanvas);
