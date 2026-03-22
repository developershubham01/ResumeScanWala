from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    database_url: str = ""
    cors_origins: str = "http://localhost:5173"
    max_file_size_mb: int = 5
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = ""
    smtp_use_tls: bool = True
    notification_email: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def database_url_clean(self) -> str:
        return self.database_url.strip()

    @property
    def smtp_configured(self) -> bool:
        required_values = [
            self.smtp_host.strip(),
            self.smtp_username.strip(),
            self.smtp_password.strip(),
            self.smtp_from_email.strip(),
            self.notification_email.strip(),
        ]
        return all(required_values)

settings = Settings()
