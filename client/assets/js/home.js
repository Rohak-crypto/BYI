/*
// NAVIGATION MENU


const homeLink = document.querySelector('a[href="#"]');
const browseLink = document.querySelector('a[href="#"]'); // Change later
//const categoryLink = document.querySelectorAll(".nav-link")[2];
const aboutLink = document.querySelectorAll(".nav-link")[3];
const contactLink = document.querySelectorAll(".nav-link")[4];

// Home
homeLink.addEventListener("click", function(e){

    e.preventDefault();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

});

// Browse Auctions
browseLink.addEventListener("click", function(e){

    e.preventDefault();

    window.location.href="../auction/browse-auctions.html";

});

// Categories
categoryLink.addEventListener("click", function(e){

    e.preventDefault();

    document.querySelector(".categories").scrollIntoView({

        behavior:"smooth"

    });

});

// About
aboutLink.addEventListener("click", function(e){

    e.preventDefault();

    const about = document.querySelector("#about");

    if(about){

        about.scrollIntoView({

            behavior:"smooth"

        });

    }

});

// Contact
contactLink.addEventListener("click", function(e){

    e.preventDefault();

    const contact = document.querySelector("#contact");

    if(contact){

        contact.scrollIntoView({

            behavior:"smooth"

        });

    }

});



// SEARCH BAR


const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

searchButton.addEventListener("click", function(){

    const keyword = searchInput.value.trim();

    if(keyword===""){

        alert("Please enter a product name.");

        return;

    }

    alert("Searching for : " + keyword);

    // Later connect with backend

});


// Press Enter

searchInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        e.preventDefault();

        searchButton.click();

    }

});



// NOTIFICATION BUTTON



document.querySelector(".btn-notify").addEventListener("click",()=>{

    alert("No new notifications.");

});



// PROFILE BUTTON


document.querySelector(".btn-profile").addEventListener("click",()=>{

    window.location.href="../user/profile.html";

});


// BID YOUR ITEM - HOME PAGE


document.addEventListener("DOMContentLoaded", function () {

    // Navbar Active Link

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {

        link.addEventListener("click", function () {

            navLinks.forEach(item => item.classList.remove("active"));

            this.classList.add("active");

        });

    });

    // ==========================
    // Category Explore Buttons
    // ==========================

    const categoryButtons = document.querySelectorAll(".category-card .btn");

    categoryButtons.forEach(button => {

        button.addEventListener("click", function () {

            const category = this.parentElement.querySelector("h4").innerText;

            console.log(category + " Selected");

            // Redirect to Browse Auctions page
            window.location.href = "../auction/browse-auctions.html";

        });

    });

    // ==========================
    // Wishlist Buttons
    // ==========================

    const wishlistButtons = document.querySelectorAll(".wishlist");

    wishlistButtons.forEach(button => {

        button.addEventListener("click", function () {

            const icon = this.querySelector("i");

            if (icon.classList.contains("bi-heart")) {

                icon.classList.remove("bi-heart");
                icon.classList.add("bi-heart-fill");

                icon.style.color = "red";

            } else {

                icon.classList.remove("bi-heart-fill");
                icon.classList.add("bi-heart");

                icon.style.color = "";

            }

        });

    });

    // ==========================
    // Place Bid Buttons
    // ==========================

    const bidButtons = document.querySelectorAll(".bid-btn");

    bidButtons.forEach(button => {

        button.addEventListener("click", function () {

            window.location.href = "../auction/auction-details.html";

        });

    });

}); */

```javascript
/* =========================================================
   BID YOUR ITEM - HOME PAGE JAVASCRIPT
   Matches the current home.html and home.css
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. NAVBAR SECTION NAVIGATION
       
       Home       -> #hero
       Categories -> #categories
       Auctions   -> #trending
       Contact    -> #contact
    ===================================================== */

    const navbarLinks = document.querySelectorAll(
        ".navbar .nav-link"
    );

    navbarLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            /*
             * Only handle section links.
             * Login link is ignored because it points
             * to the authentication page.
             */

            if (
                targetId &&
                targetId.startsWith("#") &&
                targetId.length > 1
            ) {

                const targetSection =
                    document.querySelector(targetId);

                if (targetSection) {

                    event.preventDefault();

                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    /*
                     * Close Bootstrap mobile navbar
                     * after clicking a navigation item.
                     */

                    const navbarMenu =
                        document.getElementById("navbarMenu");

                    if (
                        navbarMenu &&
                        navbarMenu.classList.contains("show")
                    ) {

                        const navbarCollapse =
                            bootstrap.Collapse.getInstance(
                                navbarMenu
                            );

                        if (navbarCollapse) {
                            navbarCollapse.hide();
                        }

                    }

                }

            }

        });

    });


    /* =====================================================
       2. ACTIVE NAVBAR LINK WHILE SCROLLING
    ===================================================== */

    const sections = document.querySelectorAll(
        "#hero, #categories, #trending, #contact"
    );

    function updateActiveNav() {

        let currentSection = "";

        const scrollPosition =
            window.scrollY + 120;

        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop;

            const sectionHeight =
                section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {

                currentSection =
                    "#" + section.id;

            }

        });


        navbarLinks.forEach(function (link) {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                currentSection
            ) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNav
    );

    updateActiveNav();


    /* =====================================================
       3. HERO SEARCH
    ===================================================== */

    const heroSearchInput =
        document.querySelector(".search-box input");

    const heroSearchButton =
        document.querySelector(".search-box .search-btn");


    function performHeroSearch() {

        if (!heroSearchInput) return;

        const searchValue =
            heroSearchInput.value.trim();

        if (searchValue === "") {

            alert(
                "Please enter a product, brand or category to search."
            );

            heroSearchInput.focus();

            return;

        }


        /*
         * For now, search works on the current homepage.
         * This filters the auction cards according to
         * product name or seller name.
         */

        filterAuctions(searchValue);

        /*
         * Scroll to the auction section so the
         * user can immediately see the results.
         */

        const trendingSection =
            document.getElementById("trending");

        if (trendingSection) {

            trendingSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    }


    if (heroSearchButton) {

        heroSearchButton.addEventListener(
            "click",
            performHeroSearch
        );

    }


    if (heroSearchInput) {

        heroSearchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    performHeroSearch();

                }

            }
        );

    }


    /* =====================================================
       4. NAVBAR SEARCH
    ===================================================== */

    const navbarSearchInput =
        document.querySelector(".search-nav");


    if (navbarSearchInput) {

        navbarSearchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    const searchValue =
                        navbarSearchInput.value.trim();

                    if (searchValue === "") {

                        alert(
                            "Please enter something to search."
                        );

                        return;

                    }

                    /*
                     * Put the value into the main hero
                     * search box if it exists.
                     */

                    if (heroSearchInput) {

                        heroSearchInput.value =
                            searchValue;

                    }

                    filterAuctions(searchValue);


                    const trendingSection =
                        document.getElementById("trending");

                    if (trendingSection) {

                        trendingSection.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }

            }
        );

    }


    /* =====================================================
       5. FILTER AUCTION CARDS
    ===================================================== */

    const auctionCards =
        document.querySelectorAll(".auction-card");


    function filterAuctions(searchText) {

        const search =
            searchText.toLowerCase().trim();

        let foundItems = 0;


        auctionCards.forEach(function (card) {

            const productName =
                card.querySelector(
                    ".auction-body h5"
                );

            const sellerName =
                card.querySelector(
                    ".seller"
                );


            const product =
                productName
                    ? productName.textContent.toLowerCase()
                    : "";

            const seller =
                sellerName
                    ? sellerName.textContent.toLowerCase()
                    : "";


            if (
                product.includes(search) ||
                seller.includes(search)
            ) {

                card.closest(".col-lg-3, .col-md-6").style.display =
                    "";

                foundItems++;

            } else {

                card.closest(".col-lg-3, .col-md-6").style.display =
                    "none";

            }

        });


        /*
         * Show a message when no auction is found.
         */

        let noResults =
            document.getElementById(
                "noAuctionResults"
            );


        if (foundItems === 0) {

            if (!noResults) {

                noResults =
                    document.createElement("div");

                noResults.id =
                    "noAuctionResults";

                noResults.className =
                    "col-12 text-center py-5";

                noResults.innerHTML = '
                    <i class="bi bi-search"
                       style="font-size:40px;color:#94a3b8;">
                    </i>

                    <h5 class="mt-3">
                        No auctions found
                    </h5>

                    <p class="text-muted">
                        Try searching for another product or seller.
                    </p>
                ';

                const auctionRow =
                    document.querySelector(
                        "#trending .row.g-4"
                    );

                if (auctionRow) {
                    auctionRow.appendChild(noResults);
                }

            }

        } else {

            if (noResults) {
                noResults.remove();
            }

        }

    }


    /* =====================================================
       6. CATEGORY BUTTONS
       
       Current HTML:
       Electronics
       Vehicles
       Furniture
       Fashion
       Real Estate
       Antiques

       All buttons currently point to #trending.
    ===================================================== */

    const categoryButtons =
        document.querySelectorAll(".category-btn");


    categoryButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const categoryCard =
                    button.closest(".category-card");

                if (!categoryCard) return;


                const categoryName =
                    categoryCard.querySelector("h4");


                if (!categoryName) return;


                const category =
                    categoryName.textContent
                        .trim()
                        .toLowerCase();


                /*
                 * At the moment your four auction cards
                 * don't contain category information.
                 *
                 * Therefore, clicking a category simply
                 * takes the user to the live auction section.
                 */

                const trendingSection =
                    document.getElementById("trending");

                if (trendingSection) {

                    trendingSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


    /* =====================================================
       7. START BIDDING BUTTON
    ===================================================== */

    const startBiddingButton =
        document.querySelector(
            ".btn-premium-primary"
        );


    if (startBiddingButton) {

        startBiddingButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const trendingSection =
                    document.getElementById(
                        "trending"
                    );

                if (trendingSection) {

                    trendingSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    /* =====================================================
       8. SELL YOUR ITEM BUTTON
    ===================================================== */

    const sellButton =
        document.querySelector(
            ".btn-premium-secondary"
        );


    if (sellButton) {

        sellButton.addEventListener(
            "click",
            function () {

                /*
                 * The HTML already contains:
                 * ../auth/register.html
                 *
                 * We don't override it because your
                 * existing project structure should
                 * handle the navigation.
                 */

                console.log(
                    "Opening seller registration..."
                );

            }
        );

    }


    /* =====================================================
       9. VIEW ALL AUCTIONS
    ===================================================== */

    const viewAllButton =
        document.querySelector(
            ".view-all-btn"
        );


    if (viewAllButton) {

        viewAllButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                /*
                 * Your current home.html does not contain
                 * a separate auctions page.
                 *
                 * Therefore View All Auctions currently
                 * stays on the trending section.
                 */

                const trendingSection =
                    document.getElementById(
                        "trending"
                    );

                if (trendingSection) {

                    trendingSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    /* =====================================================
       10. WISHLIST
    ===================================================== */

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist"
        );


    wishlistButtons.forEach(function (wishlist) {

        wishlist.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const icon =
                    wishlist.querySelector("i");


                if (!icon) return;


                if (
                    icon.classList.contains(
                        "bi-heart"
                    )
                ) {

                    icon.classList.remove(
                        "bi-heart"
                    );

                    icon.classList.add(
                        "bi-heart-fill"
                    );

                    wishlist.style.color =
                        "#dc3545";

                } else {

                    icon.classList.remove(
                        "bi-heart-fill"
                    );

                    icon.classList.add(
                        "bi-heart"
                    );

                    wishlist.style.color =
                        "#64748b";

                }

            }
        );

    });


    /* =====================================================
       11. BID BUTTONS
    ===================================================== */

    const bidButtons =
        document.querySelectorAll(
            ".bid-btn"
        );


    bidButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                const auctionCard =
                    button.closest(
                        ".auction-card"
                    );


                if (!auctionCard) return;


                const productName =
                    auctionCard.querySelector(
                        ".auction-body h5"
                    );


                if (!productName) return;


                const product =
                    productName.textContent.trim();


                /*
                 * Product details page is not part of
                 * this single home.html functionality yet.
                 *
                 * For now show a bidding message.
                 */

                alert(
                    'You selected "${product}".\n\nBidding functionality will be connected when the backend is integrated.'
                );

            }
        );

    });


    /* =====================================================
       12. AUCTION COUNTDOWN TIMERS
       
       The HTML currently contains static timers:
       02:18:45
       05:41:20
       01:52:30
       12:10:18

       This converts them into live countdown timers.
    ===================================================== */

    const timers =
        document.querySelectorAll(
            ".auction-card .timer"
        );


    timers.forEach(function (timer) {

        const initialTime =
            timer.textContent.trim();


        const parts =
            initialTime.split(":");


        if (parts.length !== 3) return;


        let hours =
            parseInt(parts[0], 10);

        let minutes =
            parseInt(parts[1], 10);

        let seconds =
            parseInt(parts[2], 10);


        if (
            isNaN(hours) ||
            isNaN(minutes) ||
            isNaN(seconds)
        ) {
            return;
        }


        let totalSeconds =
            (hours * 60 * 60) +
            (minutes * 60) +
            seconds;


        function updateTimer() {

            if (totalSeconds <= 0) {

                timer.textContent =
                    "ENDED";

                timer.style.color =
                    "#6c757d";

                return;

            }


            totalSeconds--;


            const h =
                Math.floor(
                    totalSeconds / 3600
                );

            const m =
                Math.floor(
                    (totalSeconds % 3600) / 60
                );

            const s =
                totalSeconds % 60;


            timer.textContent =
                String(h).padStart(2, "0") +
                ":" +
                String(m).padStart(2, "0") +
                ":" +
                String(s).padStart(2, "0");

        }


        setInterval(
            updateTimer,
            1000
        );

    });


    /* =====================================================
       13. PROFILE MENU
       
       Bootstrap already handles opening/closing the
       profile dropdown, so we don't interfere with it.
    ===================================================== */

    const profileItems =
        document.querySelectorAll(
            ".profile-menu .dropdown-item"
        );


    profileItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const href =
                    item.getAttribute("href");


                if (
                    href &&
                    href.startsWith("#")
                ) {

                    const target =
                        document.querySelector(
                            href
                        );


                    if (!target) {

                        console.log(
                            '${href} section is not available yet.'
                        );

                    }

                }

            }
        );

    });


    /* =====================================================
       14. NAVBAR WISHLIST BUTTON
    ===================================================== */

    const navbarWishlist =
        document.querySelector(
            ".navbar-actions .icon-btn"
        );


    if (navbarWishlist) {

        navbarWishlist.addEventListener(
            "click",
            function () {

                const wishlistSection =
                    document.querySelector(
                        "#trending"
                    );


                if (wishlistSection) {

                    wishlistSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    /* =====================================================
       15. CONTACT SUPPORT
    ===================================================== */

    const contactButton =
        document.querySelector(
            ".contact-btn"
        );


    if (contactButton) {

        contactButton.addEventListener(
            "click",
            function () {

                console.log(
                    "Opening support email..."
                );

            }
        );

    }


    /* =====================================================
       16. CLEAR SEARCH WHEN RETURNING TO HOME
    ===================================================== */

    window.addEventListener(
        "pageshow",
        function () {

            if (heroSearchInput) {
                heroSearchInput.value = "";
            }

            if (navbarSearchInput) {
                navbarSearchInput.value = "";
            }

        }
    );


    /* =====================================================
       17. FINAL INITIALIZATION
    ===================================================== */

    console.log(
        "Bid Your Item Home Page loaded successfully."
    );

});
```

