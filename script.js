// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// بيانات الاتصال بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyCEDOqcalrRXDXG-Gkipms2fkkTLw2KUEQ",
  authDomain: "ssss-b11c6.firebaseapp.com",
  projectId: "ssss-b11c6",
  storageBucket: "ssss-b11c6.firebasestorage.app",
  messagingSenderId: "1011926445138",
  appId: "1:1011926445138:web:aa35bf90712edb1e75838b",
  measurementId: "G-CXJ122PY8J"
};

// تهيئة التطبيق وقاعدة البيانات
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// تحميل بيانات العملاء من Firestore
async function loadData() {
    const table = document.getElementById("dataTable");
    table.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "users")); // يفترض أن العملاء موجودين في collection اسمها users
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = `
            <tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.username}</td>
                <td>${data.blocked ? "🚫 محظور" : "✅ نشط"}</td>
                <td><button class="action-btn edit-btn" onclick="editData('${docSnap.id}', '${data.name}', '${data.email}', '${data.username}', '${data.password}')">✏️ تعديل</button></td>
                <td><button class="action-btn block-btn" onclick="blockUser('${docSnap.id}', ${data.blocked})">${data.blocked ? "إلغاء الحظر" : "حظر"}</button></td>
                <td><button class="action-btn delete-btn" onclick="deleteData('${docSnap.id}')">🗑️ حذف</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

// حذف عميل
window.deleteData = async function(id) {
    if (confirm("هل أنت متأكد من الحذف؟")) {
        await deleteDoc(doc(db, "users", id));
        loadData();
    }
}

// حظر / إلغاء حظر عميل
window.blockUser = async function(id, currentStatus) {
    await updateDoc(doc(db, "users", id), { blocked: !currentStatus });
    loadData();
}

// تعديل بيانات عميل
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

// تشغيل تحميل البيانات عند فتح الصفحة
loadData();
