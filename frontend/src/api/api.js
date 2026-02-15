const API_BASE = "http://127.0.0.1:8000/api/v1";

export async function registerStudent(formData) {
  const res = await fetch(`${API_BASE}/students/register`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}
