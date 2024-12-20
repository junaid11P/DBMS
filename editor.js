const BASE_URL = "http://localhost:3306";
const userId = localStorage.getItem("userId");
const filename = localStorage.getItem("filename"); // Retrieve the filename

document.getElementById("file-name").textContent = `File: ${filename}`;

async function fetchNotes() {
  const response = await fetch(`${BASE_URL}/notes/${userId}`);
  const data = await response.json();
  document.getElementById("notes").value = data.content || "";
}

async function saveNotes() {
  const content = document.getElementById("notes").value;

  await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content }),
  });

  alert("Notes saved!");
}

async function deleteNotes() {
  const confirmed = confirm("Are you sure you want to delete your notes?");
  if (!confirmed) return;

  await fetch(`${BASE_URL}/notes/${userId}`, {
    method: "DELETE",
  });

  alert("Notes deleted!");
  document.getElementById("notes").value = "";
}

function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("filename"); // Clear the filename
  window.location.href = "index.html";
}

fetchNotes();
