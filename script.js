function sendMessage() {
    const input = document.getElementById("messageInput");
    const message = input.value.trim();

    if (message === "") {
        return;
    }

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

    const isUnsafe = unsafePatterns.some(pattern =>
        pattern.test(message)
    );

    const warning = document.getElementById("warning");

    if (isUnsafe) {
        warning.textContent =
            "⚠️ Safety Warning: Please do not share personal information, payment details, OTP, passwords or suspicious links.";

        warning.style.display = "block";
        return;
    }

    warning.style.display = "none";

    const messageBox = document.createElement("div");
    messageBox.className = "message sent";
    messageBox.textContent = message;

    const messages = document.getElementById("messages");

    if (messages) {
        messages.appendChild(messageBox);
        messages.scrollTop = messages.scrollHeight;
    }

    input.value = "";
}


function reportMessage() {
    const reason = prompt(
        "Why do you want to report this message?\n\n" +
        "1. Abusive message\n" +
        "2. Harassment\n" +
        "3. Scam / Fraud\n" +
        "4. Personal information\n" +
        "5. Other"
    );

    if (reason !== null && reason.trim() !== "") {
        alert(
            "Report submitted successfully.\n" +
            "The message will be reviewed."
        );
    }
}


function showSafetyReminder() {
    alert(
        "⚠️ AVMCHHAI Safety Reminder\n\n" +
        "Do not share your address, school, phone number, password or OTP with unknown people."
    );
}
