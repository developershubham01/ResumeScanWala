import nodemailer from "nodemailer";

export class SubscriptionEmailService {
  static isConfigured(): boolean {
    const required = [
      process.env.SMTP_HOST,
      process.env.SMTP_USER,
      process.env.SMTP_PASS,
      process.env.SMTP_FROM,
      process.env.NOTIFICATION_EMAIL,
    ];
    return required.every((val) => val && val.trim().length > 0);
  }

  static async sendSubscriptionNotifications(subscriberEmail: string): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error("Subscription email service is not fully configured.");
    }

    const host = process.env.SMTP_HOST!;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER!;
    const pass = process.env.SMTP_PASS!;
    const from = process.env.SMTP_FROM!;
    const notificationEmail = process.env.NOTIFICATION_EMAIL!;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    // Notify owner
    const ownerMailOptions = {
      from,
      to: notificationEmail,
      subject: "New ResumeScanWala subscriber",
      text: [
        "A new user subscribed to ResumeScanWala updates.",
        "",
        `Subscriber email: ${subscriberEmail}`,
      ].join("\n"),
    };

    // Confirm to subscriber
    const subscriberMailOptions = {
      from,
      to: subscriberEmail,
      subject: "ResumeScanWala subscription confirmed",
      text: [
        "You have successfully subscribed to ResumeScanWala updates.",
        "",
        "We will send you updates about new resume tools, UI improvements, and product changes.",
      ].join("\n"),
    };

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(subscriberMailOptions),
    ]);
  }
}
export default SubscriptionEmailService;
