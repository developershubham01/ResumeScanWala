from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401
from app.api.routes import router
from app.core.config import settings
from app.core.database import Base, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info("Application startup initiated.")
    try:
        logger.info("Creating tables if needed.")
        Base.metadata.create_all(bind=engine)
        logger.info("Application startup completed successfully.")
    except Exception:
        logger.exception("Application startup failed.")
        raise
    yield


app = FastAPI(
    title="AI Resume Analyzer & Job Matcher API",
    description="Analyze resumes against job descriptions using Gemini and return ATS-focused insights.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
