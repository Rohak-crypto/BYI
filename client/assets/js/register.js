"use strict";


document
    .querySelectorAll(".show")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        button.dataset.target
                    );


                if (!input) {
                    return;
                }


                const visible =
                    input.type === "text";


                input.type =
                    visible
                        ? "password"
                        : "text";


                button.textContent =
                    visible
                        ? "◉"
                        : "◌";


                button.setAttribute(
                    "aria-label",
                    visible
                        ? "Show password"
                        : "Hide password"
                );

            }
        );

    });



const form =
    document.getElementById(
        "registerForm"
    );


const nameInput =
    document.getElementById(
        "name"
    );


const emailInput =
    document.getElementById(
        "email"
    );


const phoneInput =
    document.getElementById(
        "phone"
    );


const passwordInput =
    document.getElementById(
        "password"
    );


const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );


const error =
    document.getElementById(
        "error"
    );


const terms =
    document.getElementById(
        "terms"
    );


const registerButton =
    document.getElementById(
        "registerButton"
    );


const passwordRequirements =
    document.getElementById(
        "passwordRequirements"
    );


const passwordStatus =
    document.getElementById(
        "passwordStatus"
    );


const lengthRule =
    document.getElementById(
        "lengthRule"
    );


const uppercaseRule =
    document.getElementById(
        "uppercaseRule"
    );


const lowercaseRule =
    document.getElementById(
        "lowercaseRule"
    );


const digitRule =
    document.getElementById(
        "digitRule"
    );


const specialRule =
    document.getElementById(
        "specialRule"
    );



function validatePassword(password) {

    const hasMinimumLength =
        password.length >= 8;


    const hasUppercase =
        /[A-Z]/.test(password);


    const hasLowercase =
        /[a-z]/.test(password);


    const hasDigit =
        /[0-9]/.test(password);


    const hasSpecialCharacter =
        /[^A-Za-z0-9]/.test(password);


    return (
        hasMinimumLength &&
        hasUppercase &&
        hasLowercase &&
        hasDigit &&
        hasSpecialCharacter
    );

}



function updateRule(
    element,
    valid
) {

    if (!element) {
        return;
    }


    element.classList.toggle(
        "valid",
        valid
    );


    const icon =
        element.querySelector(
            ".rule-icon"
        );


    if (icon) {

        icon.textContent =
            valid
                ? "✓"
                : "×";

    }

}



function updatePasswordRequirements(
    password
) {

    if (!passwordRequirements) {
        return;
    }


    if (password.length === 0) {

        passwordRequirements.style.display =
            "none";

        return;

    }


    passwordRequirements.style.display =
        "block";


    const hasMinimumLength =
        password.length >= 8;


    const hasUppercase =
        /[A-Z]/.test(password);


    const hasLowercase =
        /[a-z]/.test(password);


    const hasDigit =
        /[0-9]/.test(password);


    const hasSpecialCharacter =
        /[^A-Za-z0-9]/.test(password);


    updateRule(
        lengthRule,
        hasMinimumLength
    );


    updateRule(
        uppercaseRule,
        hasUppercase
    );


    updateRule(
        lowercaseRule,
        hasLowercase
    );


    updateRule(
        digitRule,
        hasDigit
    );


    updateRule(
        specialRule,
        hasSpecialCharacter
    );


    const strong =
        hasMinimumLength &&
        hasUppercase &&
        hasLowercase &&
        hasDigit &&
        hasSpecialCharacter;


    if (passwordStatus) {

        if (strong) {

            passwordStatus.textContent =
                "✓ Strong password";

            passwordStatus.className =
                "password-status strong";

        } else {

            passwordStatus.textContent =
                "Password requirements not met";

            passwordStatus.className =
                "password-status weak";

        }

    }

}



if (passwordInput) {

    passwordInput.addEventListener(
        "input",
        () => {

            updatePasswordRequirements(
                passwordInput.value
            );

        }
    );

}



if (nameInput) {

    nameInput.addEventListener(
        "input",
        () => {

            if (
                nameInput.value.length > 25
            ) {

                nameInput.value =
                    nameInput.value.substring(
                        0,
                        25
                    );

            }

        }
    );

}



function showSuccessMessage() {

    const existing =
        document.getElementById(
            "byiRegisterSuccess"
        );


    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement(
            "div"
        );


    notification.id =
        "byiRegisterSuccess";


    notification.innerHTML = `

        <div style="
            width:42px;
            height:42px;
            border-radius:50%;
            background:#e9f6df;
            color:#5d8b3d;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:22px;
            font-weight:700;
            flex-shrink:0;
        ">
            ✓
        </div>


        <div>

            <div style="
                font-size:15px;
                font-weight:700;
                color:#24140d;
                margin-bottom:3px;
            ">
                Registration Successful
            </div>


            <div style="
                font-size:12px;
                color:#75665c;
            ">
                Your account has been created. Redirecting...
            </div>

        </div>

    `;


    notification.style.cssText = `
        position:fixed;
        top:28px;
        right:28px;
        z-index:99999;
        min-width:330px;
        max-width:400px;
        padding:16px 18px;
        display:flex;
        align-items:center;
        gap:13px;
        background:#fffdf9;
        border:1px solid rgba(93,139,61,0.22);
        border-radius:14px;
        box-shadow:0 15px 40px rgba(0,0,0,0.20);
        font-family:"DM Sans",sans-serif;
        animation:byiRegisterSuccessIn 0.35s ease;
    `;


    if (
        !document.getElementById(
            "byiRegisterAnimation"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "byiRegisterAnimation";


        style.textContent = `

            @keyframes byiRegisterSuccessIn {

                from {
                    opacity:0;
                    transform:translateY(-15px);
                }

                to {
                    opacity:1;
                    transform:translateY(0);
                }

            }

            @keyframes byiRegisterSuccessOut {

                from {
                    opacity:1;
                    transform:translateY(0);
                }

                to {
                    opacity:0;
                    transform:translateY(-15px);
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    document.body.appendChild(
        notification
    );

}



function showErrorMessage(
    message
) {

    if (!error) {
        return;
    }


    error.textContent =
        message;


    error.style.color =
        "#ef9d83";


    error.style.fontSize =
        "11px";


    error.style.fontWeight =
        "600";


    error.style.marginTop =
        "10px";


    error.style.textAlign =
        "center";

}



if (form) {

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                nameInput.value.trim();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const phone =
                phoneInput.value.trim();


            const password =
                passwordInput.value;


            const confirm =
                confirmPasswordInput.value;


            error.textContent =
                "";


            if (
                !name ||
                !email ||
                !phone ||
                !password ||
                !confirm
            ) {

                showErrorMessage(
                    "Please fill all required fields."
                );

                return;

            }


            if (name.length > 25) {

                showErrorMessage(
                    "Name must not exceed 25 characters."
                );

                return;

            }


            if (!validatePassword(password)) {

                showErrorMessage(
                    "Please meet all password requirements."
                );

                updatePasswordRequirements(
                    password
                );

                return;

            }


            if (password !== confirm) {

                showErrorMessage(
                    "Passwords do not match."
                );

                return;

            }


            if (
                terms &&
                !terms.checked
            ) {

                showErrorMessage(
                    "Please accept the Terms & Conditions and Privacy Policy."
                );

                return;

            }


            if (registerButton) {

                registerButton.disabled =
                    true;


                registerButton.dataset.originalText =
                    registerButton.innerHTML;


                registerButton.innerHTML = `
                    Creating Account...
                    <b>...</b>
                `;

            }


            try {

                const data =
                    await BYI_API.request(
                        "/api/auth/register",
                        {
                            method: "POST",

                            body: {
                                name,
                                email,
                                phone,
                                password
                            }
                        }
                    );


                BYI_API.saveSession(
                    data
                );


                showSuccessMessage();


                setTimeout(() => {

                    window.location.href =
                        "../../index.html";

                }, 1500);


            } catch (err) {

                showErrorMessage(
                    err.message ||
                    "Registration failed. Please try again."
                );


                if (registerButton) {

                    registerButton.disabled =
                        false;


                    registerButton.innerHTML =
                        registerButton.dataset.originalText ||
                        "Create Account <b>→</b>";

                }

            }

        }
    );

}

