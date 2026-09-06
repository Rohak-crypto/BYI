document.addEventListener("DOMContentLoaded", function () {

    const pages = document.querySelectorAll(".page");
    const sideButtons = document.querySelectorAll(".side-btn");
    const pageButtons = document.querySelectorAll("[data-page]");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let toastTimer;

    function showToast(message) {

        if (!toast || !toastMessage) {
            return;
        }

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }


    function openPage(pageName) {

        const targetPage = document.getElementById(pageName);

        if (!targetPage) {
            return;
        }


        /* Hide every page */

        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });


        /* Show selected page */

        targetPage.classList.add("active-page");


        /* Update left sidebar active button */

        sideButtons.forEach(function (button) {

            button.classList.remove("active");

            if (button.dataset.page === pageName) {
                button.classList.add("active");
            }

        });


        /* Scroll content to top */

        const content = document.querySelector(".content");

        if (content) {
            content.scrollTop = 0;
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        /* Change browser hash without reloading */

        history.replaceState(null, "", "#" + pageName);

    }

    sideButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const pageName = button.dataset.page;

            openPage(pageName);

        });

    });


    pageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const pageName = button.dataset.page;

            openPage(pageName);

        });

    });

    const heroButton = document.querySelector(".hero-btn");

    if (heroButton) {

        heroButton.addEventListener("click", function () {

            openPage("auctions");

            showToast("Opening My Auctions");

        });

    }

    const heartButtons = document.querySelectorAll(
        ".heart-btn, .remove-heart"
    );


    heartButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.stopPropagation();

            const icon = button.querySelector("i");

            if (!icon) {
                return;
            }


            if (
                icon.classList.contains("fa-regular")
            ) {

                icon.classList.remove("fa-regular");

                icon.classList.add("fa-solid");

                button.classList.add("liked");

                showToast("Item added to wishlist");

            } else {

                icon.classList.remove("fa-solid");

                icon.classList.add("fa-regular");

                button.classList.remove("liked");

                showToast("Item removed from wishlist");

            }

        });

    });


    const bidButtons = document.querySelectorAll(
        ".bid-btn, .small-action"
    );


    bidButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const text = button.textContent.trim();

            if (text.includes("Edit")) {

                showToast("Auction edit page opened");

            } else if (text.includes("Increase")) {

                showToast("Bid amount can be increased");

            } else if (text.includes("Details")) {

                showToast("Auction details opened");

            } else if (text.includes("Bid")) {

                showToast("Bid window opened");

            } else {

                showToast("Action completed");

            }

        });

    });


    const messageButtons =
        document.querySelectorAll(".message-btn");


    messageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            showToast("Opening message");

        });

    });

    const createAuctionBtn =
        document.getElementById("createAuctionBtn");


    if (createAuctionBtn) {

        createAuctionBtn.addEventListener("click", function () {

            showToast("Create Auction form opened");

        });

    }


    const addFundsBtn =
        document.getElementById("addFundsBtn");


    if (addFundsBtn) {

        addFundsBtn.addEventListener("click", function () {

            showToast("Add Funds option selected");

        });

    }


    const notificationBtn =
        document.getElementById("notificationBtn");


    if (notificationBtn) {

        notificationBtn.addEventListener("click", function () {

            showToast("You have 3 new notifications");

        });

    }




    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                const searchValue =
                    searchInput.value.trim();


                if (searchValue === "") {

                    showToast("Please enter an auction name");

                } else {

                    showToast(
                        'Searching for "' +
                        searchValue +
                        '"'
                    );

                }

            }

        });

    }


    const settingButtons =
        document.querySelectorAll(".setting-action");


    settingButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            showToast(
                button.textContent.trim() +
                " option selected"
            );

        });

    });


    const hash =
        window.location.hash.replace("#", "");


    if (
        hash &&
        document.getElementById(hash)
    ) {

        openPage(hash);

    } else {

        openPage("dashboard");

    }

    const disabledNav =
        document.querySelectorAll(".nav-disabled");


    disabledNav.forEach(function (navItem) {

        navItem.addEventListener("click", function (event) {

            event.preventDefault();

            event.stopPropagation();

        });

    });

});