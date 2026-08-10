

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

   

    togglePassword.addEventListener("click", () => {

        const icon = togglePassword.querySelector("i");

        if (password.type === "password") {

            password.type = "text";

            icon.classList.remove("bi-eye");
            icon.classList.add("bi-eye-slash");

        } else {

            password.type = "password";

            icon.classList.remove("bi-eye-slash");
            icon.classList.add("bi-eye");

        }

    });

    // ===============================
    // Email Validation
    // ===============================

    function validateEmail(value) {

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(value);

    }

    // ===============================
    // Login Validation
    // ===============================

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        const emailValue = email.value.trim();
        const passwordValue = password.value.trim();

        if(emailValue === ""){

            alert("Please enter your email.");

            email.focus();

            return;

        }

        if(!validateEmail(emailValue)){

            alert("Please enter a valid email address.");

            email.focus();

            return;

        }

        if(passwordValue === ""){

            alert("Please enter your password.");

            password.focus();

            return;

        }

        if(passwordValue.length < 6){

            alert("Password must contain at least 6 characters.");

            password.focus();

            return;

        }

        // Success

        const btn = document.querySelector(".btn-login");

        btn.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Logging In...
        `;

        btn.disabled = true;

        setTimeout(() => {

            alert("Login Successful!");

            window.location.href = "../home/home.html";

        },1500);

    });

});