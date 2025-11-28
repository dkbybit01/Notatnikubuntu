from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select, Session
from typing import List

from .database import init_db, get_session
from .models import Note

app = FastAPI(title="Notatnik API")

# Allow everything on API (backend may be proxied by nginx; this is permissive for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/notes", response_model=List[Note])
def list_notes(session: Session = Depends(get_session)):
    notes = session.exec(select(Note).order_by(Note.created_at.desc())).all()
    return notes

@app.get("/api/notes/{note_id}", response_model=Note)
def get_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.post("/api/notes", response_model=Note, status_code=201)
def create_note(note: Note, session: Session = Depends(get_session)):
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@app.put("/api/notes/{note_id}", response_model=Note)
def update_note(note_id: int, note_data: Note, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.title = note_data.title
    note.content = note_data.content
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@app.delete("/api/notes/{note_id}", status_code=204)
def delete_note(note_id: int, session: Session = Depends(get_session)):
    note = session.get(Note, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    session.delete(note)
    session.commit()
    return
