from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


def _build_connect_args(database_url: str) -> dict[str, object]:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False, "timeout": 15}

    if database_url.startswith("postgresql") or database_url.startswith("mysql"):
        return {"connect_timeout": 10}

    return {}


def _create_engine():
    database_url = settings.database_url_clean
    if not database_url:
        raise RuntimeError(
            "DATABASE_URL is not configured. Set it in your environment before starting the backend."
        )

    try:
        return create_engine(
            database_url,
            pool_pre_ping=True,
            pool_timeout=15,
            connect_args=_build_connect_args(database_url),
        )
    except Exception as exc:
        raise RuntimeError(
            "Failed to initialize the database engine. Check DATABASE_URL format and database driver settings."
        ) from exc


engine = _create_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_database_connection() -> None:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise RuntimeError(
            "Database connection failed during startup. Check DATABASE_URL, database availability, network access, "
            "and PostgreSQL SSL requirements such as '?sslmode=require'."
        ) from exc
