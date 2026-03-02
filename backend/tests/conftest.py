"""
Pytest Configuration and Fixtures
"""
import pytest
import asyncio
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.core.database import Base, get_db
from app.main import app


# Use SQLite for testing
TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session() -> Generator:
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    
    from app.models.models import User
    # Insert a mock user into the database for endpoints querying it
    dummy = User(id=1, email="test@example.com", hashed_password="pw", credits=100)
    session.add(dummy)
    session.commit()
    
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session, monkeypatch) -> Generator:
    """Create a test client with database override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    from app.core.deps import get_current_user, get_current_user_id
    from app.models.models import User
    from app.tasks import process_bulk_job

    def override_get_current_user_id():
        return 1

    def override_get_current_user():
        return User(id=1, email="test@example.com", credits=100)

    # Mock celery task to bypass Redis
    monkeypatch.setattr(process_bulk_job, "delay", lambda *args, **kwargs: True)

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user_id] = override_get_current_user_id
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_emails():
    """Sample emails for testing."""
    return {
        "valid": "test@gmail.com",
        "invalid_syntax": "not-an-email",
        "disposable": "test@tempmail.com",
        "role_based": "admin@example.com",
        "o365": "test@microsoft.com",
    }
