
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

  const enteredPassword = password.value;

  if (!email || !enteredPassword) {

    alert("Please enter your email and password.");

    return;

  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(

    registeredUser =>

      registeredUser.email.toLowerCase() === email.toLowerCase() &&

      registeredUser.password === enteredPassword

  );

  if (!user) {

    alert("Incorrect email or password. Please try again.");

    return;

  }

  localStorage.setItem("loggedInUser", JSON.stringify(user));


  alert("Login Successful!");

  window.location.href = "../../pages/home/home.html";

});

