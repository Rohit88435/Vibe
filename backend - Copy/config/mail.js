import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: `${process.env.EMAIL}`,
      to,
      subject: "Reset Your Password",
      html: ` <p>
              Your OTP for password reset is <b>${otp}</b>.
              It expires in 5 minutes.
        </p>`,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email send error:", error.message);
    throw error;
  }
};

export default sendMail;
