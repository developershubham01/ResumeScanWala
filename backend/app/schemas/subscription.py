import re

from pydantic import BaseModel, Field, field_validator


EMAIL_PATTERN = re.compile(r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$", re.IGNORECASE)


class SubscriptionRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not EMAIL_PATTERN.match(normalized):
            raise ValueError("Enter a valid email address.")
        return normalized


class SubscriptionResponse(BaseModel):
    message: str
    email_notification_sent: bool
    is_new_subscription: bool
