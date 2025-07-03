export const mailgunConfig = () => ({
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunSenderEmail: process.env.MAILGUN_SENDER_EMAIL,
});
