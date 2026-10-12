import nodemailer from 'nodemailer';

let transport;

function getTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: { user, pass },
  });
  return transport;
}

function from() {
  return process.env.SMTP_FROM || `DevCodeHub <${process.env.SMTP_USER}>`;
}

export async function sendResetEmail(to, link) {
  const t = getTransport();
  if (!t) {
    // Dev without SMTP: surface the link in the server log so the flow works.
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[mail disabled] password reset for ${to}: ${link}`);
      return;
    }
    throw new Error('SMTP_USER and SMTP_PASS are not set.');
  }
  await t.sendMail({
    from: from(),
    to,
    subject: 'Reset your DevCodeHub password',
    text: `Reset your password using this link. It expires in 1 hour.\n\n${link}\n\nIf you did not ask for this, ignore this email.`,
    html: `<p>Reset your DevCodeHub password. The link expires in 1 hour.</p><p><a href="${link}">Reset password</a></p><p>If you did not ask for this, ignore this email.</p>`,
  });
}

export async function sendGoogleOnlyEmail(to, loginUrl) {
  const t = getTransport();
  if (!t) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[mail disabled] ${to} uses Google sign-in: ${loginUrl}`);
      return;
    }
    throw new Error('SMTP_USER and SMTP_PASS are not set.');
  }
  await t.sendMail({
    from: from(),
    to,
    subject: 'Sign in to DevCodeHub with Google',
    text: `This account signs in with Google and has no password. Sign in here: ${loginUrl}`,
  });
}
