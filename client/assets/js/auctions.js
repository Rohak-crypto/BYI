const auctions = [

    {
        name: "Luxury Wrist Watch",
        category: "Fashion",
        price: 45000,
        time: 2 * 3600 + 15 * 60 + 30,
        image: "assets/images/watch.jpg",
        tags: ["Trending", "Live Now"]
    },

    {
        name: "Vintage Camera",
        category: "Electronics",
        price: 22500,
        time: 1 * 3600 + 40 * 60 + 12,
        image: "assets/images/camera.jpg",
        tags: ["Trending", "Live Now", "Most Bids"]
    },

    {
        name: "Antique Wooden Chair",
        category: "Furniture",
        price: 12800,
        time: 3 * 3600 + 20 * 60 + 45,
        image: "assets/images/chair.jpg",
        tags: ["Trending", "Live Now"]
    },

    {
        name: "Diamond Necklace",
        category: "Jewellery",
        price: 75000,
        time: 50 * 60 + 10,
        image: "assets/images/necklace.jpg",
        tags: ["Trending", "Live Now", "Ending Soon"]
    },

    {
        name: "Classic Painting",
        category: "Art & Collectibles",
        price: 60000,
        time: 4 * 3600 + 12 * 60 + 22,
        image: "assets/images/painting.jpg",
        tags: ["Trending", "Live Now", "Newly Listed"]
    },

    {
        name: "Vintage Car Model",
        category: "Vehicles",
        price: 280000,
        time: 1 * 3600 + 10 * 60 + 5,
        image: "assets/images/car.jpg",
        tags: ["Trending", "Live Now", "Ending Soon"]
    },

    {
        name: "Leather Handbag",
        category: "Fashion",
        price: 18000,
        time: 2 * 3600 + 45 * 60 + 18,
        image: "assets/images/handbag.jpg",
        tags: ["Trending", "Live Now"]
    },

    {
        name: "Latest Smartphone",
        category: "Electronics",
        price: 38000,
        time: 1 * 3600 + 5 * 60 + 18,
        image: "assets/images/phone.jpg",
        tags: ["Trending", "Live Now", "Most Bids"]
    },

    {
        name: "Gramophone",
        category: "Collectibles",
        price: 32000,
        time: 3 * 3600 + 15 * 60 + 40,
        image: "assets/images/gramophone.jpg",
        tags: ["Trending", "Live Now", "Newly Listed"]
    },

    {
        name: "Designer Sofa",
        category: "Furniture",
        price: 55000,
        time: 5 * 3600 + 20 * 60 + 15,
        image: "assets/images/sofa.jpg",
        tags: ["Trending", "Live Now"]
    }

];



let activeTab = "Trending";
let selectedAuction = null;

const auctionGrid =
    document.getElementById("auctionGrid");

const emptyState =
    document.getElementById("emptyState");

const priceRange =
    document.getElementById("priceRange");

const sortSelect =
    document.getElementById("sortSelect");

const searchInput =
    document.getElementById("globalSearch");

const clearAllButton =
    document.getElementById("clearAll");

const bidModal =
    document.getElementById("bidModal");

const modalItem =
    document.getElementById("modalItem");

const modalCurrent =
    document.getElementById("modalCurrent");

const bidAmount =
    document.getElementById("bidAmount");

const confirmBidButton =
    document.getElementById("confirmBid");

const closeModalButton =
    document.getElementById("closeModal");

const bidMessage =
    document.getElementById("bidMessage");


/* =========================================================
   TOAST
========================================================= */

let toastElement =
    document.getElementById("auctionToast");


if (!toastElement) {

    toastElement =
        document.createElement("div");

    toastElement.id =
        "auctionToast";

    toastElement.className =
        "auction-toast";

    document.body.appendChild(
        toastElement
    );

}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(number) {

    return "₹ " +
        Number(number).toLocaleString("en-IN");

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(totalSeconds) {

    totalSeconds =
        Math.max(
            0,
            Math.floor(Number(totalSeconds))
        );


    const hours =
        String(
            Math.floor(
                totalSeconds / 3600
            )
        ).padStart(2, "0");


    const minutes =
        String(
            Math.floor(
                (totalSeconds % 3600) / 60
            )
        ).padStart(2, "0");


    const seconds =
        String(
            totalSeconds % 60
        ).padStart(2, "0");


    return `${hours}:${minutes}:${seconds}`;

}


/* =========================================================
   SHOW TOAST
========================================================= */

function showAuctionToast(message) {

    if (!toastElement) {
        return;
    }


    toastElement.textContent =
        message;


    toastElement.classList.add(
        "show"
    );


    clearTimeout(
        toastElement.hideTimer
    );


    toastElement.hideTimer =
        setTimeout(
            () => {

                toastElement.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   GET SELECTED CATEGORIES
========================================================= */

function getSelectedCategories() {

    return [
        ...document.querySelectorAll(
            ".auction-category:checked"
        )
    ].map(
        checkbox => checkbox.value
    );

}


/* =========================================================
   GET SELECTED STATUS
========================================================= */

function getSelectedStatuses() {

    return [
        ...document.querySelectorAll(
            ".auction-status:checked"
        )
    ].map(
        checkbox => checkbox.value
    );

}


/* =========================================================
   FILTER + SORT + RENDER
========================================================= */

function renderAuctions() {

    if (!auctionGrid) {
        return;
    }


    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    /* -----------------------------------------------------
       CATEGORY FILTER
    ----------------------------------------------------- */

    const selectedCategories =
        getSelectedCategories();


    /* -----------------------------------------------------
       STATUS FILTER
    ----------------------------------------------------- */

    const selectedStatuses =
        getSelectedStatuses();


    /* -----------------------------------------------------
       PRICE FILTER
    ----------------------------------------------------- */

    const maximumPrice =
        priceRange
            ? Number(priceRange.value)
            : 500000;


    /* -----------------------------------------------------
       SORT
    ----------------------------------------------------- */

    const sortType =
        sortSelect
            ? sortSelect.value
            : "Trending";


    /* -----------------------------------------------------
       FILTER AUCTIONS
    ----------------------------------------------------- */

    let filteredAuctions =
        auctions.filter(
            auction => {


                /* Search */

                const searchableText =
                    (
                        auction.name +
                        " " +
                        auction.category
                    )
                    .toLowerCase();


                const matchesSearch =
                    !searchText ||
                    searchableText.includes(
                        searchText
                    );


                /* Category */

                const matchesCategory =
                    selectedCategories.length === 0 ||
                    selectedCategories.includes(
                        auction.category
                    );


                /* Price */

                const matchesPrice =
                    auction.price <=
                    maximumPrice;


                /* Status */

                const matchesStatus =
                    selectedStatuses.length === 0 ||
                    selectedStatuses.some(
                        status =>
                            auction.tags.includes(
                                status
                            )
                    );


                /* Active Tab */

                const matchesTab =
                    auction.tags.includes(
                        activeTab
                    );


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesPrice &&
                    matchesStatus &&
                    matchesTab
                );

            }
        );


    /* =====================================================
       SORTING
    ===================================================== */

    if (
        sortType ===
        "Price: Low to High"
    ) {

        filteredAuctions.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    else if (
        sortType ===
        "Price: High to Low"
    ) {

        filteredAuctions.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    else if (
        sortType ===
        "Time Left"
    ) {

        filteredAuctions.sort(
            (a, b) =>
                a.time - b.time
        );

    }


    /* =====================================================
       CREATE CARDS
    ===================================================== */

    auctionGrid.innerHTML =
        filteredAuctions.map(
            auction => {


                const originalIndex =
                    auctions.indexOf(
                        auction
                    );


                return `

                    <article class="card">

                        <div class="card-image">

                            <img
                                src="${auction.image}"
                                alt="${auction.name}"
                                onerror="this.style.display='none';"
                            >

                            <span class="live-badge">
                                LIVE
                            </span>

                            <button
                                class="heart"
                                type="button"
                                aria-label="Favorite"
                                onclick="toggleFavorite(this)"
                            >
                                ♡
                            </button>

                        </div>


                        <div class="card-body">

                            <h3>
                                ${auction.name}
                            </h3>


                            <div class="category-name">
                                ${auction.category}
                            </div>


                            <div class="card-meta">

                                <div>

                                    <span class="meta-label">
                                        Current Bid
                                    </span>

                                    <span class="bid-price">
                                        ${formatMoney(
                                            auction.price
                                        )}
                                    </span>

                                </div>


                                <div>

                                    <span class="meta-label">
                                        Time Left
                                    </span>

                                    <span
                                        class="time"
                                        data-auction-index="${originalIndex}"
                                    >
                                        ${formatTime(
                                            auction.time
                                        )}
                                    </span>

                                </div>

                            </div>


                            <button
                                class="bid-button"
                                type="button"
                                onclick="placeBid(${originalIndex})"
                            >
                                Place Bid
                            </button>

                        </div>

                    </article>

                `;

            }
        ).join("");


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (emptyState) {

        emptyState.hidden =
            filteredAuctions.length !== 0;

    }

}


function toggleFavorite(button) {

    if (!button) {
        return;
    }


    button.classList.toggle(
        "saved"
    );


    if (
        button.classList.contains(
            "saved"
        )
    ) {

        button.textContent =
            "♥";

        showAuctionToast(
            "Added to favorites"
        );

    }

    else {

        button.textContent =
            "♡";

        showAuctionToast(
            "Removed from favorites"
        );

    }

}

function placeBid(auctionIndex) {

    const auction =
        auctions[auctionIndex];


    if (!auction) {
        return;
    }


    selectedAuction =
        auction;


    if (modalItem) {

        modalItem.textContent =
            auction.name;

    }


    if (modalCurrent) {

        modalCurrent.textContent =
            formatMoney(
                auction.price
            );

    }


    if (bidAmount) {

        bidAmount.value =
            "";

        bidAmount.min =
            auction.price + 1;

        bidAmount.placeholder =
            `Enter more than ${formatMoney(
                auction.price
            )}`;

    }


    if (bidMessage) {

        bidMessage.textContent =
            "";

        bidMessage.className =
            "bid-message";

    }


    if (bidModal) {

        bidModal.classList.remove(
            "hidden"
        );

        bidModal.classList.add(
            "show"
        );

    }


    setTimeout(
        () => {

            if (bidAmount) {
                bidAmount.focus();
            }

        },
        100
    );

}

function closeBidModal() {

    if (bidModal) {

        bidModal.classList.remove(
            "show"
        );

        bidModal.classList.add(
            "hidden"
        );

    }


    selectedAuction =
        null;

}


function confirmBid() {

    if (!selectedAuction) {
        return;
    }


    const enteredAmount =
        Number(
            bidAmount
                ? bidAmount.value
                : 0
        );


    const currentBid =
        Number(
            selectedAuction.price
        );



    if (
        !enteredAmount ||
        enteredAmount <= 0
    ) {

        showBidMessage(
            "Please enter a valid bid amount.",
            "error"
        );

        return;
    }


    if (
        enteredAmount <=
        currentBid
    ) {

        showBidMessage(
            `Please bid higher than ${formatMoney(
                currentBid
            )}.`,
            "error"
        );

        if (bidAmount) {
            bidAmount.focus();
        }

        return;
    }


    selectedAuction.price =
        enteredAmount;


    const itemName =
        selectedAuction.name;


    closeBidModal();


    renderAuctions();


    showAuctionToast(
        `Bid placed successfully on ${itemName}`
    );

}



function showBidMessage(
    message,
    type
) {

    if (!bidMessage) {
        return;
    }


    bidMessage.textContent =
        message;


    bidMessage.className =
        `bid-message ${type}`;

}



if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeBidModal
    );

}



if (confirmBidButton) {

    confirmBidButton.addEventListener(
        "click",
        confirmBid
    );

}


if (bidAmount) {

    bidAmount.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                confirmBid();

            }


            if (
                event.key === "Escape"
            ) {

                closeBidModal();

            }

        }
    );

}



if (bidModal) {

    bidModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                bidModal
            ) {

                closeBidModal();

            }

        }
    );

}


document
    .querySelectorAll(
        ".auction-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {


                    /* Remove active */

                    document
                        .querySelectorAll(
                            ".auction-tab"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    /* Add active */

                    tab.classList.add(
                        "active"
                    );


                    /* Change tab */

                    activeTab =
                        tab.dataset.tab;


                    /* Render */

                    renderAuctions();

                }
            );

        }
    );



document
    .querySelectorAll(
        ".auction-category"
    )
    .forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                renderAuctions
            );

        }
    );



document
    .querySelectorAll(
        ".auction-status"
    )
    .forEach(
        checkbox => {

            checkbox.addEventListener(
                "change",
                renderAuctions
            );

        }
    );


if (priceRange) {

    priceRange.addEventListener(
        "input",
        renderAuctions
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderAuctions
    );

}



if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        renderAuctions
    );

}


if (clearAllButton) {

    clearAllButton.addEventListener(
        "click",
        () => {


            /* Clear categories */

            document
                .querySelectorAll(
                    ".auction-category"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            false;

                    }
                );
            document
                .querySelectorAll(
                    ".auction-status"
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            false;

                    }
                );
            const liveNow =
                document.querySelector(
                    ".auction-status[value='Live Now']"
                );


            if (liveNow) {

                liveNow.checked =
                    true;

            }

            if (priceRange) {

                priceRange.value =
                    priceRange.max ||
                    500000;

            }

            if (searchInput) {

                searchInput.value =
                    "";

            }

            if (sortSelect) {

                sortSelect.value =
                    "Trending";

            }
            activeTab =
                "Trending";


            document
                .querySelectorAll(
                    ".auction-tab"
                )
                .forEach(
                    tab => {

                        tab.classList.remove(
                            "active"
                        );

                    }
                );


            const trendingTab =
                document.querySelector(
                    ".auction-tab[data-tab='Trending']"
                );


            if (trendingTab) {

                trendingTab.classList.add(
                    "active"
                );

            }


            renderAuctions();

        }
    );

}
setInterval(
    () => {

        auctions.forEach(
            auction => {

                if (auction.time > 0) {

                    auction.time--;

                }

            }
        );


        document
            .querySelectorAll(
                ".time[data-auction-index]"
            )
            .forEach(
                timer => {

                    const index =
                        Number(
                            timer.dataset.auctionIndex
                        );


                    const auction =
                        auctions[index];


                    if (!auction) {
                        return;
                    }


                    timer.textContent =
                        formatTime(
                            auction.time
                        );

                }
            );

    },
    1000
);
renderAuctions();