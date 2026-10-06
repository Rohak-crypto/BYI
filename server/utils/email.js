const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendPasswordResetOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: "Bid Your Item - Password Reset OTP",

        text: `Your Bid Your Item password reset OTP is ${otp}. This OTP will expire in 10 minutes. If you did not request a password reset, please ignore this email.`,

        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                padding: 30px;
                background: #f7f2eb;
                color: #2b180e;
            ">

                <h2 style="margin-bottom: 10px;">
                    Bid Your Item
                </h2>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    Your password reset OTP is:
                </p>

                <div style="
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    padding: 18px;
                    text-align: center;
                    background: #ffffff;
                    border-radius: 10px;
                    margin: 20px 0;
                ">
                    ${otp}
                </div>

                <p>
                    This OTP will expire in
                    <strong>10 minutes</strong>.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <hr style="
                    border: 0;
                    border-top: 1px solid #ddd;
                    margin: 25px 0;
                ">

                <p style="
                    font-size: 12px;
                    color: #777;
                ">
                    This is an automated email from Bid Your Item.
                </p>

            </div>
        `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("OTP email sent successfully");
    console.log("To:", email);
    console.log("Message ID:", info.messageId);

    return info;
}

module.exports = {
    transporter,
    sendPasswordResetOTP
};
