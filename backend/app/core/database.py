from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_startup_migrations() -> None:
    if engine.dialect.name != "mysql":
        return

    inspector = inspect(engine)
    if "analyses" not in inspector.get_table_names():
        return

    columns = {column["name"]: column for column in inspector.get_columns("analyses")}
    statements: list[str] = []

    extracted_type = str(columns.get("extracted_text", {}).get("type", "")).lower()
    if "longtext" not in extracted_type:
        statements.append("ALTER TABLE analyses MODIFY COLUMN extracted_text LONGTEXT NOT NULL")

    job_description_type = str(columns.get("job_description", {}).get("type", "")).lower()
    if "longtext" not in job_description_type:
        statements.append("ALTER TABLE analyses MODIFY COLUMN job_description LONGTEXT NOT NULL")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
