document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const dob = document.getElementById("dob");
    const gender = document.getElementById("gender");
    const profile = document.getElementById("profile");
    const terms = document.getElementById("terms");


    function validateEmail(value) {

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(value);

    }


    function validateMobile(value) {

        const regex = /^[6-9]\d{9}$/;

        return regex.test(value);

    }


    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();


        const firstNameValue = firstName.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim().toLowerCase();
        const mobileValue = mobile.value.trim();
        const passwordValue = password.value;
        const confirmPasswordValue = confirmPassword.value;
        const dobValue = dob.value;
        const genderValue = gender.value;


        // First Name

        if (firstNameValue === "") {

            alert("Please enter your first name.");
            firstName.focus();
            return;

        }


        // Last Name

        if (lastNameValue === "") {

            alert("Please enter your last name.");
            lastName.focus();
            return;

        }


        // Email

        if (emailValue === "") {

            alert("Please enter your email address.");
            email.focus();
            return;

        }

        if (!validateEmail(emailValue)) {

            alert("Please enter a valid email address.");
            email.focus();
            return;

        }


        // Mobile

        if (mobileValue === "") {

            alert("Please enter your mobile number.");
            mobile.focus();
            return;

        }

        if (!validateMobile(mobileValue)) {

            alert("Please enter a valid 10-digit Indian mobile number.");
            mobile.focus();
            return;

        }


        // Password

        if (passwordValue === "") {

            alert("Please create a password.");
            password.focus();
            return;

        }

        if (passwordValue.length < 6) {

            alert("Password must contain at least 6 characters.");
            password.focus();
            return;

        }


        // Confirm Password

        if (confirmPasswordValue === "") {

            alert("Please confirm your password.");
            confirmPassword.focus();
            return;

        }

        if (passwordValue !== confirmPasswordValue) {

            alert("Passwords do not match.");
            confirmPassword.focus();
            return;

        }


        // Date of Birth

        if (dobValue === "") {

            alert("Please select your date of birth.");
            dob.focus();
            return;

        }


        // Gender

        if (genderValue === "") {

            alert("Please select your gender.");
            gender.focus();
            return;

        }


        // Terms

        if (!terms.checked) {

            alert("Please agree to the Terms & Conditions.");
            terms.focus();
            return;

        }

        const existingUser =
            JSON.parse(localStorage.getItem("byiUser"));

        if (existingUser &&
            existingUser.email === emailValue) {

            alert("An account with this email already exists. Please login.");

            window.location.href = "login.html";

            return;

        }


        let profileImage = "";

        if (profile.files && profile.files.length > 0) {

            const file = profile.files[0];

            const reader = new FileReader();

            reader.onload = function () {

                profileImage = reader.result;

                saveUser(profileImage);

            };

            reader.readAsDataURL(file);

        } else {

            saveUser("");

        }

        function saveUser(profileImage) {

            const user = {

                firstName: firstNameValue,

                lastName: lastNameValue,

                fullName:
                    firstNameValue + " " + lastNameValue,

                email: emailValue,

                mobile: mobileValue,

                password: passwordValue,

                dob: dobValue,

                gender: genderValue,

                profileImage: profileImage

            };


            // Save registered user

            localStorage.setItem(
                "byiUser",
                JSON.stringify(user)
            );


            // Mark user as logged in

            localStorage.setItem(
                "byiLoggedIn",
                "true"
            );


            // Save currently logged-in user

            localStorage.setItem(
                "byiCurrentUser",
                JSON.stringify(user)
            );


            const button =
                registerForm.querySelector(
                    'button[type="submit"]'
                );

            button.innerHTML =
                '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';

            button.disabled = true;


            setTimeout(() => {

                alert("Account created successfully!");

                window.location.href =
                    "../home/home.html";

            }, 1200);

        }

    });

});

