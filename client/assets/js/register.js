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

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const phone = document.getElementById("phone").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const existingUser = users.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );


  if (existingUser) {

    error.textContent = "An account with this email already exists.";

    return;

  }

  const newUser = {

    name: name,

    email: email,

    phone: phone,

    password: password

  };

  users.push(newUser);

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration Successful!");
  window.location.href = "../../pages/auth/login.html";

});

