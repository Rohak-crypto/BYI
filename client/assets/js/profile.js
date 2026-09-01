document.addEventListener("DOMContentLoaded", function () {

    let user = null;


    const currentUser = localStorage.getItem("byiCurrentUser");
    const registeredUser = localStorage.getItem("byiUser");
    const userData = localStorage.getItem("user");

    try {

        if (currentUser) {
            user = JSON.parse(currentUser);
        }
        else if (registeredUser) {
            user = JSON.parse(registeredUser);
        }
        else if (userData) {
            user = JSON.parse(userData);
        }

    } catch (error) {

        console.error("Error reading user data:", error);

    }


    // =====================================================
    // IF USER DATA NOT FOUND
    // =====================================================

    if (!user) {

        console.warn("No registered user found in localStorage.");

        /*
            Do not immediately redirect.
            This allows you to see the page and debug
            localStorage if necessary.
        */

        return;

    }


    // =====================================================
    // GET HTML ELEMENTS
    // =====================================================

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const fullName =
        document.getElementById("fullName");

    const email =
        document.getElementById("email");

    const phone =
        document.getElementById("phone");

    const dob =
        document.getElementById("dob");

    const address =
        document.getElementById("address");

    const city =
        document.getElementById("city");

    const state =
        document.getElementById("state");

    const pincode =
        document.getElementById("pincode");

    const country =
        document.getElementById("country");

    const accountType =
        document.getElementById("accountType");


    // =====================================================
    // CREATE FULL NAME
    // =====================================================

    let userFullName = "";

    if (user.fullName) {

        userFullName = user.fullName;

    }
    else {

        userFullName =
            `${user.firstName || ""} ${user.lastName || ""}`.trim();

    }


    // =====================================================
    // DISPLAY PROFILE NAME
    // =====================================================

    if (profileName) {

        profileName.textContent =
            userFullName || "User Name";

    }


    // =====================================================
    // DISPLAY PROFILE EMAIL
    // =====================================================

    if (profileEmail) {

        profileEmail.textContent =
            user.email || "No email available";

    }


    // =====================================================
    // DISPLAY FULL NAME
    // =====================================================

    if (fullName) {

        fullName.value =
            userFullName;

    }


    // =====================================================
    // DISPLAY EMAIL
    // =====================================================

    if (email) {

        email.value =
            user.email || "";

    }


    // =====================================================
    // DISPLAY MOBILE NUMBER
    // =====================================================

    if (phone) {

        phone.value =
            user.mobile ||
            user.phone ||
            "";

    }


    // =====================================================
    // DISPLAY DATE OF BIRTH
    // =====================================================

    if (dob) {

        dob.value =
            user.dob || "";

    }


    // =====================================================
    // DISPLAY ADDRESS
    // =====================================================

    if (address) {

        address.value =
            user.address || "";

    }


    // =====================================================
    // DISPLAY CITY
    // =====================================================

    if (city) {

        city.value =
            user.city || "";

    }


    // =====================================================
    // DISPLAY STATE
    // =====================================================

    if (state) {

        state.value =
            user.state || "";

    }


    // =====================================================
    // DISPLAY PINCODE
    // =====================================================

    if (pincode) {

        pincode.value =
            user.pincode ||
            user.pinCode ||
            "";

    }


    // =====================================================
    // DISPLAY COUNTRY
    // =====================================================

    if (country) {

        country.value =
            user.country ||
            "India";

    }


    // =====================================================
    // DISPLAY ACCOUNT TYPE
    // =====================================================

    if (accountType) {

        accountType.value =
            user.accountType ||
            "Buyer";

    }


    // =====================================================
    // EDIT PROFILE
    // =====================================================

    const editProfileBtn =
        document.getElementById("editProfileBtn");

    const formActions =
        document.getElementById("formActions");

    const profileForm =
        document.getElementById("profileForm");

    const cancelBtn =
        document.getElementById("cancelBtn");


    // All editable fields
    const editableFields = [

        fullName,
        email,
        phone,
        dob,
        address,
        city,
        state,
        pincode,
        country

    ].filter(Boolean);


    // =====================================================
    // EDIT PROFILE BUTTON
    // =====================================================

    if (editProfileBtn) {

        editProfileBtn.addEventListener("click", function () {

            editableFields.forEach(function (field) {

                field.disabled = false;

            });


            // Show Save / Cancel buttons

            if (formActions) {

                formActions.style.display = "flex";

            }


            // Hide Edit Profile button

            editProfileBtn.style.display = "none";

        });

    }


    // =====================================================
    // CANCEL EDITING
    // =====================================================

    if (cancelBtn) {

        cancelBtn.addEventListener("click", function () {

            // Restore original values

            if (fullName) {
                fullName.value = userFullName;
            }

            if (email) {
                email.value = user.email || "";
            }

            if (phone) {
                phone.value =
                    user.mobile ||
                    user.phone ||
                    "";
            }

            if (dob) {
                dob.value = user.dob || "";
            }

            if (address) {
                address.value = user.address || "";
            }

            if (city) {
                city.value = user.city || "";
            }

            if (state) {
                state.value = user.state || "";
            }

            if (pincode) {
                pincode.value =
                    user.pincode ||
                    user.pinCode ||
                    "";
            }

            if (country) {
                country.value =
                    user.country ||
                    "India";
            }


            // Disable fields again

            editableFields.forEach(function (field) {

                field.disabled = true;

            });


            // Hide Save / Cancel

            if (formActions) {

                formActions.style.display = "none";

            }


            // Show Edit button

            editProfileBtn.style.display =
                "inline-block";

        });

    }


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    if (profileForm) {

        profileForm.addEventListener("submit", function (event) {

            event.preventDefault();


            // ---------------------------------------------
            // GET UPDATED VALUES
            // ---------------------------------------------

            const updatedName =
                fullName ? fullName.value.trim() : "";

            const updatedEmail =
                email ? email.value.trim() : "";

            const updatedPhone =
                phone ? phone.value.trim() : "";

            const updatedDob =
                dob ? dob.value : "";

            const updatedAddress =
                address ? address.value.trim() : "";

            const updatedCity =
                city ? city.value.trim() : "";

            const updatedState =
                state ? state.value.trim() : "";

            const updatedPincode =
                pincode ? pincode.value.trim() : "";

            const updatedCountry =
                country ? country.value.trim() : "";


            // ---------------------------------------------
            // VALIDATION
            // ---------------------------------------------

            if (updatedName === "") {

                alert("Please enter your full name.");

                fullName.focus();

                return;

            }


            if (updatedEmail === "") {

                alert("Please enter your email address.");

                email.focus();

                return;

            }


            // ---------------------------------------------
            // UPDATE USER OBJECT
            // ---------------------------------------------

            user.fullName =
                updatedName;

            user.email =
                updatedEmail;

            user.mobile =
                updatedPhone;

            user.phone =
                updatedPhone;

            user.dob =
                updatedDob;

            user.address =
                updatedAddress;

            user.city =
                updatedCity;

            user.state =
                updatedState;

            user.pincode =
                updatedPincode;

            user.country =
                updatedCountry;


            // ---------------------------------------------
            // SAVE UPDATED USER
            // ---------------------------------------------

            localStorage.setItem(
                "byiCurrentUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "byiUser",
                JSON.stringify(user)
            );


            // ---------------------------------------------
            // UPDATE SCREEN
            // ---------------------------------------------

            if (profileName) {

                profileName.textContent =
                    updatedName;

            }

            if (profileEmail) {

                profileEmail.textContent =
                    updatedEmail;

            }


            // ---------------------------------------------
            // DISABLE FIELDS
            // ---------------------------------------------

            editableFields.forEach(function (field) {

                field.disabled = true;

            });


            // ---------------------------------------------
            // HIDE SAVE / CANCEL
            // ---------------------------------------------

            if (formActions) {

                formActions.style.display = "none";

            }


            // ---------------------------------------------
            // SHOW EDIT BUTTON
            // ---------------------------------------------

            if (editProfileBtn) {

                editProfileBtn.style.display =
                    "inline-block";

            }


            alert("Profile updated successfully!");

        });

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            const confirmLogout =
                confirm("Are you sure you want to logout?");

            if (!confirmLogout) {
                return;
            }


            // Remove logged-in session

            localStorage.removeItem("byiCurrentUser");

            localStorage.removeItem("byiLoggedIn");


            // Go to login page

            window.location.href =
                "../auth/login.html";

        });

    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const changePasswordBtn =
        document.getElementById("changePasswordBtn");

    if (changePasswordBtn) {

        changePasswordBtn.addEventListener("click", function () {

            alert(
                "Change Password feature will be available soon."
            );

        });

    }

});

