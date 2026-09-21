document.querySelectorAll(".show").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    button.textContent = visible ? "◉" : "◌";
  });
});

document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const error = document.getElementById("error");
  const terms = document.getElementById("terms");

  if (!name || !email || !password) {
    error.textContent = "Please fill all required fields.";
    return;
  }
  if (password !== confirm) {
    error.textContent = "Passwords do not match.";
    return;
  }
  if (password.length < 6) {
    error.textContent = "Password must contain at least 6 characters.";
    return;
  }
  if (terms && !terms.checked) {
    error.textContent = "Please accept the terms and conditions.";
    return;
  }

  try {
    const data = await BYI_API.request("/api/auth/register", {
      method: "POST",
      body: { name, email, phone, password }
    });
    BYI_API.saveSession(data);
    alert("Registration Successful!");
    window.location.href = "../../index.html";
  } catch (err) {
    error.textContent = err.message;
  }
});
