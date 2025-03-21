const audioPlayer = document.getElementById("audioPlayer"); // Ambil elemen audio
const playlist = document.getElementById("playlist");
const playStopBtn = document.getElementById("playStopBtn");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

let currentSongIndex = sessionStorage.getItem("currentSongIndex") || 0;
let isPlaying = sessionStorage.getItem("isPlaying") === "true";
let savedTime = parseFloat(sessionStorage.getItem("currentTime")) || 0;

// Jika lagu belum diset, gunakan lagu pertama
if (!sessionStorage.getItem("audioSrc")) {
    sessionStorage.setItem("audioSrc", songs[currentSongIndex].url);
}

// Pastikan daftar lagu dibuat ulang setiap kali halaman dimuat
function loadPlaylist() {
    playlist.innerHTML = ""; // Kosongkan daftar lama

    songs.forEach((song, index) => {
        const songItem = document.createElement("li");
        songItem.textContent = song.title;
        songItem.addEventListener("click", () => {
            currentSongIndex = index;
            playSong();
        });
        playlist.appendChild(songItem);
    });
}

// Panggil saat halaman dimuat
window.addEventListener("DOMContentLoaded", loadPlaylist);


// Atur audio player dari sessionStorage
audioPlayer.src = sessionStorage.getItem("audioSrc");
audioPlayer.currentTime = savedTime;

// Jika sebelumnya lagu sedang dimainkan, lanjutkan memutar
if (isPlaying) {
    audioPlayer.play();
    playStopBtn.textContent = "■"; // Tampilkan tombol stop
}

// Fungsi untuk memutar lagu
function playSong() {
    audioPlayer.src = songs[currentSongIndex].url;
    audioPlayer.play();
    isPlaying = true;
    playStopBtn.textContent = "■"; // Tampilkan tombol stop

    // Simpan status lagu di sessionStorage
    sessionStorage.setItem("audioSrc", songs[currentSongIndex].url);
    sessionStorage.setItem("currentSongIndex", currentSongIndex);
    sessionStorage.setItem("isPlaying", "true");
}

// Fungsi Play/Stop dalam satu tombol
playStopBtn.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playStopBtn.textContent = "■";
        isPlaying = true;
    } else {
        audioPlayer.pause();
        playStopBtn.textContent = "▶";
        isPlaying = false;
    }
    sessionStorage.setItem("isPlaying", isPlaying);
});

// Update progress bar saat lagu dimainkan
audioPlayer.addEventListener("timeupdate", () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + "%";

    // Simpan waktu lagu ke sessionStorage
    sessionStorage.setItem("currentTime", audioPlayer.currentTime);
});

// Saat lagu selesai, pindah ke lagu berikutnya secara otomatis
audioPlayer.addEventListener("ended", () => {
    currentSongIndex++; // Pindah ke lagu berikutnya
    
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0; // Jika sudah di akhir, kembali ke awal
    }

    playSong(); // Putar lagu berikutnya
});


// Fungsi berpindah halaman tanpa menghentikan lagu
function changePage(url) {
    document.body.classList.add("fade-out");
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}


document.addEventListener("DOMContentLoaded", function () {
    const reqLaguBtn = document.getElementById("reqLaguBtn");
    const popup = document.getElementById("requestPopup");
    const overlay = document.getElementById("popupOverlay");
    const closeBtn = document.querySelector(".close-btn");

    // Event untuk membuka pop-up
    reqLaguBtn.addEventListener("click", function () {
        popup.classList.add("show");
        overlay.classList.add("show");
    });

    // Event untuk menutup pop-up
    closeBtn.addEventListener("click", function () {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    });

    // Menutup pop-up jika klik di luar area pop-up
    overlay.addEventListener("click", function () {
        popup.classList.remove("show");
        overlay.classList.remove("show");
    });
});



