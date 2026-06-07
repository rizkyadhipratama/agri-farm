function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "http://localhost:3000";
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const baseUrl = getBaseUrl();
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AgriFarm <noreply@agrifarm.com>",
        to: email,
        subject: "Verify your AgriFarm account",
        html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Failed to send email via Resend:", err);
    }
    return;
  }

  console.log("========================================");
  console.log("EMAIL VERIFICATION");
  console.log(`To: ${email}`);
  console.log(`Link: ${verifyUrl}`);
  console.log("========================================");
}