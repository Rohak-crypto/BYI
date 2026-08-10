
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const terms = document.getElementById("terms");

    // First Name
    if(firstName === ""){

        alert("Please enter First Name.");
        return;

    }

    // Last Name
    if(lastName === ""){

        alert("Please enter Last Name.");
        return;

    }

    // Email Validation
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if(!email.match(emailPattern)){

        alert("Please enter a valid Email Address.");
        return;

    }

    // Mobile Validation
    const mobilePattern = /^[6-9]\d{9}$/;

    if(!mobile.match(mobilePattern)){

        alert("Please enter a valid 10-digit Mobile Number.");
        return;

    }

    // Password Length
    if(password.length < 6){

        alert("Password should contain at least 6 characters.");
        return;

    }

    // Confirm Password
    if(password !== confirmPassword){

        alert("Passwords do not match.");
        return;

    }

    // DOB
    if(dob === ""){

        alert("Please select Date of Birth.");
        return;

    }

    // Gender
    if(gender === ""){

        alert("Please select Gender.");
        return;

    }

    // Terms
    if(!terms.checked){

        alert("Please accept Terms & Conditions.");
        return;

    }

    alert("Registration Successful!");

    // Redirect to Login Page

    window.location.href = "login.html";

});