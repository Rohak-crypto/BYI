/* =====================================================
   BID YOUR ITEM - DASHBOARD JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       USER NAME
    ================================================= */

    const userNameElement = document.getElementById("dashboardUserName");

    if (userNameElement) {
        const savedUserName = localStorage.getItem("byiUserName");

        if (savedUserName && savedUserName.trim() !== "") {
            userNameElement.textContent = savedUserName;
        } else {
            userNameElement.textContent = "User";
        }
    }


    /* =================================================
       ACTIVE BID COUNT
    ================================================= */

    const activeBidsElement = document.getElementById("activeBids");

    if (activeBidsElement) {
        activeBidsElement.textContent = "08";
    }


    /* =================================================
       WON AUCTIONS COUNT
    ================================================= */

    const wonAuctionsElement = document.getElementById("wonAuctions");

    if (wonAuctionsElement) {
        wonAuctionsElement.textContent = "05";
    }


    /* =================================================
       WISHLIST COUNT
    ================================================= */

    const wishlistCountElement = document.getElementById("wishlistCount");

    if (wishlistCountElement) {
        const wishlistCount =
            parseInt(localStorage.getItem("byiWishlistCount")) || 12;

        wishlistCountElement.textContent =
            wishlistCount.toString().padStart(2, "0");
    }


    /* =================================================
       TOTAL SPENT
    ================================================= */

    const totalSpentElement = document.getElementById("totalSpent");

    if (totalSpentElement) {
        totalSpentElement.textContent = "₹1.2L";
    }


    /* =================================================
       COUNTDOWN TIMERS
    ================================================= */

    startAuctionTimers();


    /* =================================================
       WISHLIST / FAVORITE ITEMS
    ================================================= */

    setupWishlist();


    /* =================================================
       BID BUTTONS
    ================================================= */

    setupBidButtons();


    /* =================================================
       NAVBAR SEARCH
    ================================================= */

    setupSearch();


    /* =================================================
       SMOOTH SCROLL
    ================================================= */

    setupSmoothScroll();


    /* =================================================
       MOBILE NAVBAR
    ================================================= */

    setupMobileNavbar();

});



/* =====================================================
   AUCTION TIMERS
===================================================== */

function startAuctionTimers() {

    const timerElements =
        document.querySelectorAll(".time-left");

    if (!timerElements.length) {
        return;
    }


    timerElements.forEach(function (timer) {

        let timeText = timer.textContent.trim();

        let parts = timeText.split(":");

        if (parts.length !== 3) {
            return;
        }


        let hours = parseInt(parts[0]) || 0;
        let minutes = parseInt(parts[1]) || 0;
        let seconds = parseInt(parts[2]) || 0;


        let totalSeconds =
            (hours * 60 * 60) +
            (minutes * 60) +
            seconds;


        function updateTimer() {

            if (totalSeconds <= 0) {

                timer.textContent = "Ended";

                timer.style.color = "#6c757d";

                return;
            }


            totalSeconds--;


            const remainingHours =
                Math.floor(totalSeconds / 3600);

            const remainingMinutes =
                Math.floor((totalSeconds % 3600) / 60);

            const remainingSeconds =
                totalSeconds % 60;


            timer.textContent =
                formatNumber(remainingHours) + ":" +
                formatNumber(remainingMinutes) + ":" +
                formatNumber(remainingSeconds);


            /* -----------------------------------------
               CHANGE COLOR WHEN TIME IS LOW
            ----------------------------------------- */

            if (totalSeconds <= 300) {

                timer.style.color = "#dc3545";

            } else if (totalSeconds <= 1800) {

                timer.style.color = "#f59e0b";

            } else {

                timer.style.color = "#dc3545";

            }

        }


        updateTimer();

        setInterval(updateTimer, 1000);

    });

}



/* =====================================================
   FORMAT NUMBER
===================================================== */

function formatNumber(number) {

    return number.toString().padStart(2, "0");

}



/* =====================================================
   WISHLIST
===================================================== */

function setupWishlist() {

    const wishlistButtons =
        document.querySelectorAll(".wishlist");


    wishlistButtons.forEach(function (wishlist) {

        wishlist.addEventListener("click", function () {

            const icon =
                wishlist.querySelector("i");


            if (!icon) {
                return;
            }


            const isActive =
                wishlist.classList.contains("active");


            if (isActive) {

                wishlist.classList.remove("active");

                icon.classList.remove("bi-heart-fill");

                icon.classList.add("bi-heart");

                updateWishlistCount(-1);

            } else {

                wishlist.classList.add("active");

                icon.classList.remove("bi-heart");

                icon.classList.add("bi-heart-fill");

                updateWishlistCount(1);

            }

        });

    });

}



/* =====================================================
   UPDATE WISHLIST COUNT
===================================================== */

function updateWishlistCount(change) {

    const countElement =
        document.getElementById("wishlistCount");


    if (!countElement) {
        return;
    }


    let currentCount =
        parseInt(countElement.textContent) || 0;


    currentCount += change;


    if (currentCount < 0) {
        currentCount = 0;
    }


    countElement.textContent =
        currentCount.toString().padStart(2, "0");


    localStorage.setItem(
        "byiWishlistCount",
        currentCount
    );

}



/* =====================================================
   BID BUTTONS
===================================================== */

function setupBidButtons() {

    const bidButtons =
        document.querySelectorAll(".bid-again-btn");


    bidButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const row =
                button.closest("tr");


            if (!row) {
                return;
            }


            const itemNameElement =
                row.querySelector(".item-info strong");


            const itemName =
                itemNameElement
                    ? itemNameElement.textContent.trim()
                    : "this item";


            const currentBidElement =
                row.querySelector("td:nth-child(2) strong");


            const currentBid =
                currentBidElement
                    ? currentBidElement.textContent.trim()
                    : "the current bid";


            const confirmed =
                confirm(
                    "Place a new bid on " +
                    itemName +
                    "?\n\nCurrent bid: " +
                    currentBid
                );


            if (!confirmed) {
                return;
            }


            button.textContent = "Bid Placed";

            button.style.background = "#198754";

            button.style.color = "#ffffff";


            setTimeout(function () {

                button.innerHTML = "Bid Again";

                button.style.background = "";

                button.style.color = "";

            }, 2000);


            showDashboardMessage(
                "Your bid has been placed successfully!"
            );

        });

    });

}



/* =====================================================
   DASHBOARD MESSAGE
===================================================== */

function showDashboardMessage(message) {

    const oldAlert =
        document.querySelector(".dashboard-alert");


    if (oldAlert) {
        oldAlert.remove();
    }


    const alert =
        document.createElement("div");


    alert.className =
        "alert alert-success dashboard-alert";


    alert.innerHTML =
        '<i class="bi bi-check-circle-fill me-2"></i>' +
        message;


    alert.style.position = "fixed";

    alert.style.top = "90px";

    alert.style.right = "25px";

    alert.style.zIndex = "2000";

    alert.style.borderRadius = "10px";

    alert.style.fontSize = "12px";

    alert.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.15)";


    document.body.appendChild(alert);


    setTimeout(function () {

        alert.style.opacity = "0";

        alert.style.transform =
            "translateY(-10px)";

        setTimeout(function () {

            alert.remove();

        }, 300);

    }, 2500);

}



/* =====================================================
   NAVBAR SEARCH
===================================================== */

function setupSearch() {

    const searchInput =
        document.querySelector(".search-nav");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener("keydown", function (event) {

        if (event.key !== "Enter") {
            return;
        }


        event.preventDefault();


        const searchValue =
            searchInput.value.trim();


        if (searchValue === "") {

            showDashboardMessage(
                "Please enter something to search."
            );

            return;

        }


        localStorage.setItem(
            "byiSearchQuery",
            searchValue
        );


        showDashboardMessage(
            'Searching for "' +
            searchValue +
            '"...'
        );

    });

}



/* =====================================================
   SMOOTH SCROLL
===================================================== */

function setupSmoothScroll() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                link.getAttribute("href");


            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

}



/* =====================================================
   MOBILE NAVBAR
===================================================== */

function setupMobileNavbar() {

    const navLinks =
        document.querySelectorAll(
            ".navbar-nav .nav-link"
        );


    const navbarCollapse =
        document.getElementById("navbarMenu");


    if (!navbarCollapse) {
        return;
    }


    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                window.innerWidth <= 991 &&
                navbarCollapse.classList.contains("show")
            ) {

                const collapse =
                    bootstrap.Collapse.getInstance(
                        navbarCollapse
                    );


                if (collapse) {
                    collapse.hide();
                }

            }

        });

    });

}



/* =====================================================
   LOGGED-IN USER HELPER
===================================================== */

/*
   You can use this from login.js later.

   Example:

   localStorage.setItem(
       "byiUserName",
       "Rohak"
   );
*/

function setDashboardUserName(name) {

    if (!name || name.trim() === "") {
        return;
    }


    localStorage.setItem(
        "byiUserName",
        name.trim()
    );


    const element =
        document.getElementById(
            "dashboardUserName"
        );


    if (element) {
        element.textContent = name.trim();
    }

}



/* =====================================================
   LOGOUT HELPER
===================================================== */

function logoutUser() {

    localStorage.removeItem("byiUserName");

    localStorage.removeItem("byiSearchQuery");

    window.location.href =
        "../auth/login.html";

}