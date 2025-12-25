const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc } = require('firebase/firestore');

const app = express();
app.use(express.json());

// --- ដាក់ Firebase Config របស់អ្នកនៅទីនេះ ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.post('/api/aba-webhook', async (req, res) => {
    try {
        const messageText = req.body.message ? req.body.message.text : "";
        console.log("សារទទួលបាន:", messageText);

        if (messageText.includes("9.99")) {
            const userQuery = query(collection(db, "users"), 
                              where("status", "==", "pending"), 
                              where("pendingAmount", "==", "$9.99"));

            const querySnapshot = await getDocs(userQuery);
            for (const docSnap of querySnapshot.docs) {
                await updateDoc(docSnap.ref, { status: "paid" });
            }
            return res.status(200).send("Updated Success");
        }
        res.status(200).send("Ignored");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = app;
