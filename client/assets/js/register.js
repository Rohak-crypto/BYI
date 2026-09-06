document.querySelectorAll(".show").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const visible = input.type === "text";
    input.type = visible ? "password" : "text";
    button.textContent = visible ? "◉" : "◌";
  });
});

document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;
  const error = document.getElementById("error");

  if (password !== confirm) {
    error.textContent = "Passwords do not match.";
    return;
  }

  error.textContent = "";
  alert("Registration UI is ready. Connect this form to your backend.");
});

