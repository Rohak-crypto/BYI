const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
const form = document.getElementById("loginForm");

if (toggle && password) {
  toggle.addEventListener("click", () => {
    const hidden = password.type === "password";
    password.type = hidden ? "text" : "password";
    toggle.textContent = hidden ? "◌" : "◉";
  });
}

document.querySelectorAll(".role-switch button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".role-switch button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

form.addEventListener("submit", async event => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const enteredPassword = password.value;

  if (!email || !enteredPassword) {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const data = await BYI_API.request("/api/auth/login", {
      method: "POST",
      body: { email, password: enteredPassword }
    });
    BYI_API.saveSession(data);
    alert("Login Successful!");
    window.location.href = "../../index.html";
  } catch (error) {
    alert(error.message);
  }
});
