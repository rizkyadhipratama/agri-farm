function getBaseUrl() {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  return "http://localhost:3000";
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const baseUrl = getBaseUrl();
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  if (process.env.RESEND_API_KEY) {
    const from = process.env.EMAIL_FROM || "AgriFarm <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: "Verify your AgriFarm account",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
            <h2 style="color:#16a34a">Welcome to AgriFarm 🌱</h2>
            <p>Thank you for registering. Please verify your email to activate your account.</p>
            <a href="${verifyUrl}"
               style="display:inline-block;padding:12px 24px;background:#16a34a;
                      color:white;border-radius:8px;text-decoration:none;margin:16px 0">
              Verify My Email
            </a>
            <p style="color:#6b7280;font-size:13px">
              Or copy this link: ${verifyUrl}<br/>
              This link expires in 24 hours.
            </p>
          </div>
        `,
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