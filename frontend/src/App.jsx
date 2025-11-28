import React, { useEffect, useState } from "react";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import * as api from "./api";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  async function reload() {
    setLoading(true);
    const data = await api.listNotes();
    setNotes(data);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  function newNote() {
    setEditing({ title: "", content: "" });
  }

  async function save(note) {
    if (note.id) {
      await api.updateNote(note.id, note);
    } else {
      await api.createNote(note);
    }
    setEditing(null);
    reload();
  }

  async function remove(id) {
    if (!confirm("Na pewno usunąć?")) return;
    await api.deleteNote(id);
    reload();
  }

  return (
    <div className="container">
      <h1>Notatnik</h1>
      <div className="main">
        <NoteList notes={notes} onEdit={n => setEditing(n)} onDelete={remove} onNew={newNote} />
        <div className="editor-pane">
          {editing ? (
            <NoteEditor note={editing} onSave={save} onCancel={() => setEditing(null)} />
          ) : (
            <div className="placeholder">
              {loading ? "Ładowanie..." : "Wybierz notatkę lub stwórz nową"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
