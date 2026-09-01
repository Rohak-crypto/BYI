document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    const email = document.getElementById("email");

    const password = document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

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


    function validateEmail(value) {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(value);

    }


    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();


        const emailValue =
            email.value.trim().toLowerCase();

        const passwordValue =
            password.value;


        // Email empty

        if (emailValue === "") {

            alert("Please enter your email.");

            email.focus();

            return;

        }


        // Email format

        if (!validateEmail(emailValue)) {

            alert("Please enter a valid email address.");

            email.focus();

            return;

        }


        // Password empty

        if (passwordValue === "") {

            alert("Please enter your password.");

            password.focus();

            return;

        }


        // Password length

        if (passwordValue.length < 6) {

            alert("Password must contain at least 6 characters.");

            password.focus();

            return;

        }


        const registeredUser =
            JSON.parse(localStorage.getItem("byiUser"));


        // No account

        if (!registeredUser) {

            alert(
                "No account found. Please register first."
            );

            window.location.href =
                "register.html";

            return;

        }


        if (registeredUser.email !== emailValue) {

            alert(
                "Email is not registered. Please check your email or register."
            );

            email.focus();

            return;

        }


        if (registeredUser.password !== passwordValue) {

            alert("Incorrect password. Please try again.");

            password.focus();

            return;

        }


        const btn =
            document.querySelector(".btn-login");


        btn.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Logging In...';

        btn.disabled = true;


        // Store login session

        localStorage.setItem(
            "byiLoggedIn",
            "true"
        );


        localStorage.setItem(
            "byiCurrentUser",
            JSON.stringify(registeredUser)
        );


        setTimeout(() => {

            alert(
                "Login Successful! Welcome " +
                registeredUser.firstName + "!"
            );


            window.location.href =
                "../home/home.html";

        }, 1000);

    });

});

