from sqlmodel import SQLModel, create_engine, Session
from pathlib import Path

DB_FILE = Path("/data/notes.db")
DB_FILE.parent.mkdir(parents=True, exist_ok=True)

DATABASE_URL = f"sqlite:///{DB_FILE}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

def init_db():
    from .models import Note
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
