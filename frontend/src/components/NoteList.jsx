import React from "react";

export default function NoteList({ notes, onEdit, onDelete, onNew }) {
  return (
    <div className="note-list">
      <div className="list-header">
        <h2>Notatki</h2>
        <button onClick={onNew}>Nowa</button>
      </div>
      <ul>
        {notes.map(n => (
          <li key={n.id}>
            <div className="item" onClick={() => onEdit(n)}>
              <strong>{n.title || "(bez tytułu)"}</strong>
              <div className="meta">{new Date(n.created_at).toLocaleString()}</div>
            </div>
            <button className="delete" onClick={() => onDelete(n.id)}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
