import React, { useState, useEffect } from "react";

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note]);

  return (
    <div className="editor">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tytuł" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Treść notatki..." />
      <div className="actions">
        <button onClick={() => onSave({ ...note, title, content })}>Zapisz</button>
        <button onClick={onCancel}>Anuluj</button>
      </div>
    </div>
  );
}
