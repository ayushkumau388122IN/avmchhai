const pages = ["welcome", "rules", "verify", "chat", "report"];

function showPage(pageId) {
    pages.forEach(function(page) {
        const element = document.getElementById(page);

        if (element) {
            element.classList.remove("active");
        }
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo(0, 0);
}


function startChat() {
    const realPerson = document.getElementById("realPerson");
    const rulesAgree = document.getElementById("rulesAgree");

    if (!realPerson.checked || !rulesAgree.checked) {
        alert(
            "⚠️ Please complete both safety confirmations before continuing."
        );
        return;
    }

    showPage("chat");
}


function checkUnsafe(message) {

    const unsafePatterns = [
        /\b\d{10}\b/,
        /\botp\b/i,
        /\bpassword\b/i,
        /\baddress\b/i,
        /\bschool\b/i,
        /\bupi\b/i,
        /send money/i,
        /pay me/i,
        /https?:\/\//i
    ];

    return unsafePatterns.some(function(pattern) {
        return pattern.test(message);
    });
}
function sendMessage() {

    const input = document.getElementById("messageInput");
    const warning = document.getElementById("warning");
    const messages = document.getElementById("messages");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    if (checkUnsafe(message)) {

        warning.textContent =
            "⚠️ Safety Warning: Please do not share personal information, OTP, passwords, payment details or suspicious links.";

        warning.classList.remove("hidden");

        return;
    }

    warning.classList.add("hidden");

    const messageBox = document.createElement("div");

    messageBox.className = "msg sent";
    messageBox.textContent = message;

    messages.appendChild(messageBox);

    messages.scrollTop = messages.scrollHeight;

    input.value = "";
}


function handleEnter(event) {

    if (event.key === "Enter") {
        sendMessage();
    }
}


function reportMessage() {

    showPage("report");
}


function submitReport() {

    const reason =
        document.getElementById("reportReason").value;

    document.getElementById("reportStatus").textContent =
        "✓ Report submitted for review: " + reason;
}


function showSafetyReminder() {

    alert(
        "⚠️ AVMCHHAI Safety Reminder\n\n" +
        "Do not share your address, school, phone number, password or OTP with unknown people."
    );
}
       function generateTestUID() {
    const uid =
        "AVM-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random().toString(36).substring(2, 8).toUpperCase();

    localStorage.setItem("avmchhai_test_uid", uid);

    alert("✅ Your AVMCHHAI UID is:\n\n" + uid);
}

window.addEventListener("load", function () {
    if (!localStorage.getItem("avmchhai_test_uid")) {
        generateTestUID();
    }
});
// Search friend's UID
window.searchFriendUID = async function () {

    const friendUID = document.getElementById("friendUID").value.trim();
    const resultBox = document.getElementById("uidSearchResult");

    if (!/^\d{6}$/.test(friendUID)) {
        resultBox.textContent = "⚠️ Please enter a valid 6-digit UID.";
        return;
    }

    resultBox.textContent = "🔎 Searching...";

    try {
        const uidRef = window.firebaseDoc(
            window.firebaseDB,
            "uidLookup",
            friendUID
        );

        const uidDoc = await window.firebaseGetDoc(uidRef);

        if (!uidDoc.exists()) {
            resultBox.textContent = "❌ UID not found.";
            return;
        }

        resultBox.textContent = "✅ UID found. You can start chatting.";

    } catch (error) {
        console.error(error);
        resultBox.textContent = "❌ Unable to search UID.";
    }
};
