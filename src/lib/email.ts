function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "http://localhost:3000";
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const baseUrl = getBaseUrl();
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  console.log("========================================");
  console.log("EMAIL VERIFICATION");
  console.log(`To: ${email}`);
  console.log(`Link: ${verifyUrl}`);
  console.log("========================================");

  // In production, replace with nodemailer or email API:
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({
  //   from: '"AgriFarm" <noreply@agrifarm.com>',
  //   to: email,
  //   subject: "Verify your AgriFarm account",
  //   html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
  // });
}
