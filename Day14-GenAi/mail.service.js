import nodemailer from "nodemailer";

// ✅ Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
});

// ✅ Verify transporter
transporter.verify()
    .then(() => console.log("✅ Email transporter is ready"))
    .catch((err) => console.error("❌ Email transporter failed:", err));

// ✅ Send Email Function
export async function sendEmail({ to, subject, html, text = "" }) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.messageId);

    return `Email successfully sent to ${to}`;
}