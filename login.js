const BASE_URL = "http://localhost:3306";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const filename = document.getElementById("filename").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, password }),
    });

    if (response.ok) {
      const { userId } = await response.json();
      localStorage.setItem("userId", userId);
      window.location.href = "editor.html";
    } else {
      document.getElementById("error-message").innerText = await response.text();
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
