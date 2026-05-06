import nodemailer from "nodemailer";

// 🔥 Transporter (Gmail example — you can switch to SMTP later)
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID, // your email
    pass: process.env.EMAIL_PASSWORD, // app password (NOT normal password)
  },
});

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailParams) {
  try {
    const info = await transporter.sendMail({
      from: `"CRM System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Email Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}