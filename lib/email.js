import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "soma70132@gmail.com",
    pass: "ewcw faoy clxy xfwc",
  },
});

export async function sendEmail({ to, subject, text, html }) {
  await transporter.sendMail({
    from: `"Aabha Dental Clinic" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
