const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi Firebase
const serviceAccount = require("./service-account.json"); // Jangan upload file ini ke GitHub
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vibefy-690f0-default-rtdb.asia-southeast1.firebasedatabase.app/" // Ganti dengan URL Firebase milikmu
});
const db = admin.database();

// API untuk mendapatkan leaderboard
app.get("/api/leaderboard", async (req, res) => {
    try {
        const snapshot = await db.ref("/leaderboard").orderByChild("listens").limitToLast(10).once("value");
        const leaderboard = snapshot.val();
        res.json(leaderboard);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// API untuk update jumlah pemutaran lagu
app.post("/api/track", async (req, res) => {
    const { userId, userName } = req.body;

    try {
        const ref = db.ref("/leaderboard").child(userId);
        const snapshot = await ref.once("value");
        let listens = snapshot.val() ? snapshot.val().listens : 0;
        listens++;

        await ref.set({
            userName,
            listens
        });

        res.status(200).send("Updated successfully!");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
