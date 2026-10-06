// const password = document.getElementById("password");
// const toggle = document.getElementById("togglePassword");
// const form = document.getElementById("loginForm");

// if (toggle && password) {
//   toggle.addEventListener("click", () => {
//     const hidden = password.type === "password";
//     password.type = hidden ? "text" : "password";
//     toggle.textContent = hidden ? "◌" : "◉";
//   });
// }

// document.querySelectorAll(".role-switch button").forEach(button => {
//   button.addEventListener("click", () => {
//     document.querySelectorAll(".role-switch button").forEach(btn => btn.classList.remove("active"));
//     button.classList.add("active");
//   });
// });

// form.addEventListener("submit", async event => {
//   event.preventDefault();
//   const email = document.getElementById("email").value.trim();
//   const enteredPassword = password.value;

//   if (!email || !enteredPassword) {
//     alert("Please enter your email and password.");
//     return;
//   }

//   try {
//     const data = await BYI_API.request("/api/auth/login", {
//       method: "POST",
//       body: { email, password: enteredPassword }
//     });
//     BYI_API.saveSession(data);
//     alert("Login Successful!");
//     window.location.href = "../../index.html";
//   } catch (error) {
//     alert(error.message);
//   }
// });


"use strict";

const password =
    document.getElementById("password");

const toggle =
    document.getElementById("togglePassword");

const form =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");


if (toggle && password) {

    toggle.addEventListener("click", () => {

        const hidden =
            password.type === "password";

        password.type =
            hidden ? "text" : "password";

        toggle.textContent =
            hidden ? "◌" : "◉";

        toggle.setAttribute(
            "aria-label",
            hidden
                ? "Hide password"
                : "Show password"
        );

    });

}


document
    .querySelectorAll(".role-switch button")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".role-switch button")
                .forEach(btn => {

                    btn.classList.remove("active");

                });

            button.classList.add("active");

        });

    });


function showSuccessMessage(message) {

    const existing =
        document.getElementById("byiSuccessMessage");

    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");

    notification.id =
        "byiSuccessMessage";

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
                Login Successful
            </div>

            <div style="
                font-size:12px;
                color:#75665c;
            ">
                Welcome back! Redirecting...
            </div>
        </div>
    `;


    notification.style.cssText = `
        position:fixed;
        top:28px;
        right:28px;
        z-index:99999;
        min-width:310px;
        max-width:380px;
        padding:16px 18px;
        display:flex;
        align-items:center;
        gap:13px;
        background:#fffdf9;
        border:1px solid rgba(93,139,61,0.22);
        border-radius:14px;
        box-shadow:0 15px 40px rgba(0,0,0,0.20);
        font-family:"DM Sans",sans-serif;
        animation:byiSuccessIn 0.35s ease;
    `;


    if (!document.getElementById("byiSuccessAnimation")) {

        const style =
            document.createElement("style");

        style.id =
            "byiSuccessAnimation";

        style.textContent = `
            @keyframes byiSuccessIn {
                from {
                    opacity:0;
                    transform:translateY(-15px);
                }

                to {
                    opacity:1;
                    transform:translateY(0);
                }
            }

            @keyframes byiSuccessOut {
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

        document.head.appendChild(style);

    }


    document.body.appendChild(
        notification
    );

}


function showErrorMessage(message) {

    let notification =
        document.getElementById(
            "byiLoginError"
        );

    if (notification) {
        notification.remove();
    }


    notification =
        document.createElement("div");

    notification.id =
        "byiLoginError";

    notification.textContent =
        message;


    notification.style.cssText = `
        position:fixed;
        top:28px;
        right:28px;
        z-index:99999;
        min-width:280px;
        max-width:380px;
        padding:14px 18px;
        background:#fff4f1;
        border:1px solid rgba(180,75,58,0.25);
        border-radius:12px;
        color:#a53f31;
        font-family:"DM Sans",sans-serif;
        font-size:13px;
        font-weight:600;
        box-shadow:0 12px 35px rgba(0,0,0,0.16);
        animation:byiSuccessIn 0.35s ease;
    `;


    document.body.appendChild(
        notification
    );


    setTimeout(() => {

        notification.style.animation =
            "byiSuccessOut 0.3s ease forwards";

        setTimeout(() => {

            notification.remove();

        }, 300);

    }, 3500);

}


if (form) {

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const enteredPassword =
                password.value;


            if (!email || !enteredPassword) {

                showErrorMessage(
                    "Please enter your email and password."
                );

                return;

            }


            if (loginButton) {

                loginButton.disabled = true;

                loginButton.dataset.originalText =
                    loginButton.innerHTML;

                loginButton.innerHTML = `
                    Please wait...
                    <span>...</span>
                `;

            }


            try {

                const data =
                    await BYI_API.request(
                        "/api/auth/login",
                        {
                            method: "POST",

                            body: {
                                email,
                                password: enteredPassword
                            }
                        }
                    );


                BYI_API.saveSession(data);


                showSuccessMessage(
                    "Login Successful"
                );


                setTimeout(() => {

                    window.location.href =
                        "../../index.html";

                }, 1200);


            } catch (error) {

                showErrorMessage(
                    error.message ||
                    "Login failed. Please try again."
                );


                if (loginButton) {

                    loginButton.disabled = false;

                    loginButton.innerHTML =
                        loginButton.dataset.originalText ||
                        'Login <span>→</span>';

                }

            }

        }
    );

}


