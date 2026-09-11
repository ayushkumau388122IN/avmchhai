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
async function sendMessage() {

    const input = document.getElementById("messageInput");
    const warning = document.getElementById("warning");

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

    const currentUser = window.firebaseAuth.currentUser;

    if (!currentUser) {
        alert("⚠️ Please sign in with Google first.");
        return;
    }

    const friendUID =
        document.getElementById("friendUID").value.trim();

    if (!/^\d{6}$/.test(friendUID)) {
        alert("⚠️ Please enter your friend's 6-digit UID first.");
        return;
    }

    try {

        await window.firebaseAddDoc(
            window.firebaseCollection(
                window.firebaseDB,
                "chats"
            ),
            {
                senderUid: currentUser.uid,
                receiverUID: friendUID,
                message: message,
                createdAt: new Date()
            }
        );
       const messageBox = document.getElementById("messages");

const newMessage = document.createElement("div");
newMessage.className = "msg sent";
newMessage.textContent = message;

messageBox.appendChild(newMessage);
messageBox.scrollTop = messageBox.scrollHeight;
        input.value = "";

        console.log("✅ Message saved to Firebase.");

    } catch (error) {

        console.error(error);

        alert(
            "❌ Message could not be sent.\n\n" +
            error.message
        );
    }
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
window.addEventListener("firebaseUserReady", function(event) {
    const uid = event.detail.uid;

    const myUIDBox = document.getElementById("myUID");

    if (myUIDBox) {
        myUIDBox.textContent = uid;
    }

    window.currentAVMCHHAIUID = uid;
});
window.startRealtimeChat = function(friendUID) {
        const myUID = window.currentAVMCHHAIUID;

    if (!myUID || !friendUID) {
        console.log("UID information is missing.");
        return;
    }

    const messagesBox = document.getElementById("messages");

    messagesBox.innerHTML = "";

    const chatQuery = window.firebaseQuery(
        window.firebaseCollection(window.firebaseDB, "chats"),
        window.firebaseWhere("receiverUID", "==", myUID)
    );

    window.firebaseOnSnapshot(chatQuery, function(snapshot) {
        snapshot.docChanges().forEach(function(change) {

            if (change.type !== "added") {
                return;
            }

            const data = change.doc.data();

            const message = document.createElement("div");
            message.className = "msg received";
            message.textContent = data.message;

            messagesBox.appendChild(message);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        });
    });
};
