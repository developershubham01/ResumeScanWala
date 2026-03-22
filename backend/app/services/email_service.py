import smtplib
from email.message import EmailMessage

from app.core.config import settings


class SubscriptionEmailService:
    @staticmethod
    def send_subscription_notifications(subscriber_email: str) -> None:
        if not settings.smtp_configured:
            raise ValueError("Subscription email service is not configured.")

        owner_message = EmailMessage()
        owner_message["Subject"] = "New ResumeScanWala subscriber"
        owner_message["From"] = settings.smtp_from_email
        owner_message["To"] = settings.notification_email
        owner_message.set_content(
            "\n".join(
                [
                    "A new user subscribed to ResumeScanWala updates.",
                    "",
                    f"Subscriber email: {subscriber_email}",
                ]
            )
        )

        subscriber_message = EmailMessage()
        subscriber_message["Subject"] = "ResumeScanWala subscription confirmed"
        subscriber_message["From"] = settings.smtp_from_email
        subscriber_message["To"] = subscriber_email
        subscriber_message.set_content(
            "\n".join(
                [
                    "You have successfully subscribed to ResumeScanWala updates.",
                    "",
                    "We will send you updates about new resume tools, UI improvements, and product changes.",
                ]
            )
        )

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            server.ehlo()
            if settings.smtp_use_tls:
                server.starttls()
                server.ehlo()
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(owner_message)
            server.send_message(subscriber_message)
