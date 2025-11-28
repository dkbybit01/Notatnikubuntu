// Frontend will call relative path /api/* (nginx proxies to backend)
const BASE = "/api";

export async function listNotes() {
  const r = await fetch(`${BASE}/notes`);
  return r.json();
}
export async function getNote(id) {
  const r = await fetch(`${BASE}/notes/${id}`);
  return r.json();
}
export async function createNote(payload) {
  const r = await fetch(`${BASE}/notes`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });
  return r.json();
}
export async function updateNote(id, payload) {
  const r = await fetch(`${BASE}/notes/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });
  return r.json();
}
export async function deleteNote(id) {
  await fetch(`${BASE}/notes/${id}`, { method: "DELETE" });
}
