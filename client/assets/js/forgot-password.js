"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const stepEmail = document.getElementById("stepEmail");
    const stepOtp = document.getElementById("stepOtp");
    const stepSuccess = document.getElementById("stepSuccess");

    const forgotPasswordForm =
        document.getElementById("forgotPasswordForm");

    const verifyOtpForm =
        document.getElementById("verifyOtpForm");

    const resetEmail =
        document.getElementById("resetEmail");

    const emailDisplay =
        document.getElementById("emailDisplay");

    const otpInput =
        document.getElementById("otp");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const emailMessage =
        document.getElementById("emailMessage");

    const otpMessage =
        document.getElementById("otpMessage");

    const sendOtpBtn =
        document.getElementById("sendOtpBtn");

    const resetPasswordBtn =
        document.getElementById("resetPasswordBtn");

    const resendOtpBtn =
        document.getElementById("resendOtpBtn");


    let registeredEmail = "";
    let resendTimer = null;
    let resendSeconds = 0;


    function showMessage(element, message, type = "error") {

        if (!element) {
            return;
        }

        element.textContent = message;

        element.classList.remove(
            "success",
            "error"
        );

        element.classList.add(type);

    }


    function setButtonLoading(button, loading, text) {

        if (!button) {
            return;
        }

        button.disabled = loading;

        if (loading) {

            button.dataset.originalText =
                button.textContent;

            button.innerHTML = `
                <span>
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Please wait...
                </span>
            `;

        } else {

            button.innerHTML = `
                <span>${text}</span>
            `;

        }

    }


    function showStep(step) {

        stepEmail.style.display = "none";
        stepOtp.style.display = "none";
        stepSuccess.style.display = "none";

        step.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function startResendTimer() {

        clearInterval(resendTimer);

        resendSeconds = 30;

        resendOtpBtn.disabled = true;

        resendOtpBtn.textContent =
            `Resend OTP (${resendSeconds}s)`;

        resendTimer = setInterval(() => {

            resendSeconds--;

            if (resendSeconds <= 0) {

                clearInterval(resendTimer);

                resendOtpBtn.disabled = false;

                resendOtpBtn.textContent =
                    "Resend OTP";

                return;
            }

            resendOtpBtn.textContent =
                `Resend OTP (${resendSeconds}s)`;

        }, 1000);

    }


    forgotPasswordForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const email =
                resetEmail.value.trim().toLowerCase();

            showMessage(
                emailMessage,
                ""
            );

            if (!email) {

                showMessage(
                    emailMessage,
                    "Please enter your email address."
                );

                return;
            }


            setButtonLoading(
                sendOtpBtn,
                true,
                "Send OTP"
            );


            try {

                const response =
                    await BYI_API.request(
                        "/api/auth/forgot-password",
                        {
                            method: "POST",
                            body: {
                                email
                            }
                        }
                    );


                registeredEmail = email;

                emailDisplay.textContent =
                    email;


                showStep(stepOtp);


                showMessage(
                    otpMessage,
                    response.message ||
                    "OTP sent successfully. Check your email.",
                    "success"
                );


                startResendTimer();


            } catch (error) {

                showMessage(
                    emailMessage,
                    error.message ||
                    "Unable to send OTP."
                );

            } finally {

                setButtonLoading(
                    sendOtpBtn,
                    false,
                    "Send OTP"
                );

            }

        }
    );


    verifyOtpForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const otp =
                otpInput.value.trim();

            const password =
                newPassword.value;

            const confirm =
                confirmPassword.value;


            showMessage(
                otpMessage,
                ""
            );


            if (!/^\d{6}$/.test(otp)) {

                showMessage(
                    otpMessage,
                    "Please enter the 6-digit OTP."
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    otpMessage,
                    "Password must contain at least 6 characters."
                );

                return;
            }


            if (password !== confirm) {

                showMessage(
                    otpMessage,
                    "Passwords do not match."
                );

                return;
            }


            setButtonLoading(
                resetPasswordBtn,
                true,
                "Reset Password"
            );


            try {

                const response =
                    await BYI_API.request(
                        "/api/auth/reset-password",
                        {
                            method: "POST",
                            body: {
                                email: registeredEmail,
                                otp,
                                newPassword: password
                            }
                        }
                    );


                showStep(stepSuccess);

                showMessage(
                    otpMessage,
                    response.message ||
                    "Password reset successfully.",
                    "success"
                );


            } catch (error) {

                showMessage(
                    otpMessage,
                    error.message ||
                    "Unable to reset password."
                );

            } finally {

                setButtonLoading(
                    resetPasswordBtn,
                    false,
                    "Reset Password"
                );

            }

        }
    );


    resendOtpBtn.addEventListener(
        "click",
        async () => {

            if (!registeredEmail) {
                return;
            }

            resendOtpBtn.disabled = true;

            try {

                const response =
                    await BYI_API.request(
                        "/api/auth/forgot-password",
                        {
                            method: "POST",
                            body: {
                                email: registeredEmail
                            }
                        }
                    );


                showMessage(
                    otpMessage,
                    response.message ||
                    "A new OTP has been sent.",
                    "success"
                );


                otpInput.value = "";

                startResendTimer();


            } catch (error) {

                showMessage(
                    otpMessage,
                    error.message ||
                    "Unable to resend OTP."
                );

                resendOtpBtn.disabled = false;

                resendOtpBtn.textContent =
                    "Resend OTP";

            }

        }
    );


    document
        .querySelectorAll(".password-toggle")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        document.getElementById(
                            button.dataset.target
                        );

                    if (!target) {
                        return;
                    }

                    const icon =
                        button.querySelector("i");


                    if (target.type === "password") {

                        target.type = "text";

                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );

                    } else {

                        target.type = "password";

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );

                    }

                }
            );

        });


    otpInput.addEventListener(
        "input",
        () => {

            otpInput.value =
                otpInput.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

        }
    );

});
