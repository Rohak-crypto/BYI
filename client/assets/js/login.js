const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
const form = document.getElementById("loginForm");

toggle.addEventListener("click", () => {
  const hidden = password.type === "password";
  password.type = hidden ? "text" : "password";
  toggle.textContent = hidden ? "◌" : "◉";
});

document.querySelectorAll(".role-switch button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".role-switch button")
      .forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email || !password.value) return;
  alert("Login UI is ready. Connect this form to your backend/authentication.");
});

