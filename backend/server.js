const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path');

// Inisialisasi Express
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS untuk akses dari frontend
app.use(cors());

// Inisialisasi Firebase
const serviceAccount = require('./service-account.json'); // Lokasi file service-account.json

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vibefy-690f0-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();
const leaderboardRef = db.ref('leaderboard');

// Endpoint untuk mengambil data leaderboard
app.get('/api/leaderboard', (req, res) => {
  leaderboardRef.orderByChild('score').limitToLast(10).once('value', (snapshot) => {
    const leaderboardData = snapshot.val();
    const leaderboardArray = [];

    for (let id in leaderboardData) {
      leaderboardArray.push({
        id,
        ...leaderboardData[id]
      });
    }

    res.json(leaderboardArray.reverse());
  });
});

// Menyajikan halaman leaderboard (frontend) jika mengakses /leaderboard
app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/leaderboard.html'));
});

// Menjalankan server Express
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
