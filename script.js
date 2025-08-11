import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addData() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (name && email && username && password) {
        await addDoc(collection(db, "users"), {
            name,
            email,
            username,
            password,
            blocked: false
        });
        loadData();
    }
}

async function loadData() {
    const table = document.getElementById("dataTable");
    table.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = `
            <tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.username}</td>
                <td>${data.blocked ? "🚫 محظور" : "✅ نشط"}</td>
                <td><button class="action-btn edit-btn" onclick="editData('${docSnap.id}', '${data.name}', '${data.email}', '${data.username}', '${data.password}')">✏️</button></td>
                <td><button class="action-btn block-btn" onclick="blockUser('${docSnap.id}', ${data.blocked})">${data.blocked ? "إلغاء الحظر" : "حظر"}</button></td>
                <td><button class="action-btn delete-btn" onclick="deleteData('${docSnap.id}')">🗑️</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

window.deleteData = async function(id) {
    await deleteDoc(doc(db, "users", id));
    loadData();
}

window.blockUser = async function(id, currentStatus) {
    await updateDoc(doc(db, "users", id), { blocked: !currentStatus });
    loadData();
}

window.editData = async function(id, name, email, username, password) {
    let newName = prompt("الاسم الجديد:", name);
    let newEmail = prompt("الإيميل الجديد:", email);
    let newUsername = prompt("اسم المستخدم الجديد:", username);
    let newPassword = prompt("كلمة السر الجديدة:", password);

    if (newName && newEmail && newUsername && newPassword) {
        await updateDoc(doc(db, "users", id), {
            name: newName,
            email: newEmail,
            username: newUsername,
            password: newPassword
        });
        loadData();
    }
}

loadData();