"use strict";

(() => {
    const $ = (selector, root = document) =>
        root.querySelector(selector);

    const $$ = (selector, root = document) =>
        [...root.querySelectorAll(selector)];

    let auctions = [];
    let activeTab = "Trending";
    let selectedAuction = null;
    let toastTimer = null;
    let isSubmittingBid = false;

    const auctionGrid = $("#auctionGrid");
    const emptyState = $("#emptyState");
    const clearAll = $("#clearAll");
    const priceRange = $("#priceRange");
    const sortSelect = $("#sortSelect");

    const searchInput =
        $("#searchInput") ||
        $("#globalSearch");

    const bidModal = $("#bidModal");

    const closeBidBtn =
        $("#closeBidBtn") ||
        $("#closeModal");

    const bidModalItem =
        $("#bidModalItem") ||
        $("#modalItem");

    const bidAmountInput =
        $("#bidAmountInput") ||
        $("#bidAmount");

    const confirmBidBtn =
        $("#confirmBidBtn") ||
        $("#confirmBid");

    const bidError =
        $("#bidError") ||
        $("#bidMessage");

    let toast = $("#toast");


    // ==========================================
    // PRICE FORMAT
    // ==========================================

    function formatPrice(value) {

        return "₹" +
            Number(value || 0).toLocaleString("en-IN");

    }


    // ==========================================
    // HTML ESCAPING
    // ==========================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ==========================================
    // DATE HANDLING
    // ==========================================

    function parseAuctionDate(value) {

        if (!value) {
            return null;
        }

        let normalized = value;

        // Handle MySQL DATETIME format.
        if (
            typeof normalized === "string" &&
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(normalized)
        ) {

            normalized = normalized.replace(" ", "T");

        }

        const date = new Date(normalized);

        return Number.isNaN(date.getTime())
            ? null
            : date;

    }


    // ==========================================
    // NORMALIZE AUCTION DATA
    // ==========================================

    function normalizeAuction(item, index = 0) {

        const currentBid = Number(
            item.currentBid ??
            item.current_bid ??
            item.price ??
            item.startingPrice ??
            item.starting_price ??
            0
        );

        const startingPrice = Number(
            item.startingPrice ??
            item.starting_price ??
            currentBid
        );

        let image =
            item.image ??
            item.image_url ??
            item.imageUrl ??
            "";

        if (
            image &&
            !/^(https?:|data:|\/)/i.test(image)
        ) {

            image = "/" + image.replace(/^\.\//, "");

        }

        let endAt =
            item.endAt ??
            item.end_at ??
            item.end_time ??
            item.endDate ??
            item.end_date ??
            null;

        const parsedEnd = parseAuctionDate(endAt);

        if (
            !parsedEnd &&
            Number.isFinite(Number(item.secondsRemaining)) &&
            Number(item.secondsRemaining) > 0
        ) {

            endAt = new Date(
                Date.now() +
                Number(item.secondsRemaining) * 1000
            ).toISOString();

        } else if (parsedEnd) {

            endAt = parsedEnd.toISOString();

        }

        const startAt =
            item.startAt ??
            item.start_at ??
            item.start_time ??
            item.startDate ??
            item.start_date ??
            null;

        const parsedStart = parseAuctionDate(startAt);

        return {

            id:
                item.id ??
                item.auction_id ??
                index + 1,

            name:
                item.name ??
                item.title ??
                item.item_name ??
                "Auction Item",

            category:
                item.category ??
                "General",

            description:
                item.description ??
                "",

            startingPrice,

            currentBid,

            price: currentBid,

            bidCount: Number(
                item.bidCount ??
                item.bid_count ??
                0
            ),

            image:
                image ||
                "/assets/images/gramophone.jpg",

            startAt:
                parsedStart
                    ? parsedStart.toISOString()
                    : startAt,

            endAt,

            status: String(
                item.status ?? "live"
            ).toLowerCase(),

            tags:
                Array.isArray(item.tags)
                    ? item.tags
                    : []

        };

    }


    // ==========================================
    // CURRENT BID
    // ==========================================

    function getCurrentBid(auction) {

        return Number(
            auction.currentBid ??
            auction.current_bid ??
            auction.price ??
            auction.startingPrice ??
            auction.starting_price ??
            0
        );

    }


    // ==========================================
    // AUCTION END TIME
    // ==========================================

    function getEndTime(auction) {

        const end = parseAuctionDate(
            auction.endAt ??
            auction.end_at ??
            auction.end_time
        );

        return end
            ? end.getTime()
            : null;

    }


    // ==========================================
    // REMAINING TIME
    // ==========================================

    function getSecondsRemaining(auction) {

        const endTime = getEndTime(auction);

        if (endTime === null) {
            return 0;
        }

        return Math.max(
            0,
            Math.floor(
                (endTime - Date.now()) / 1000
            )
        );

    }


    // ==========================================
    // CHECK LIVE AUCTION
    // ==========================================

    function isAuctionLive(auction) {

        const closedStatuses = [
            "ended",
            "closed",
            "cancelled",
            "canceled",
            "completed"
        ];

        return (
            !closedStatuses.includes(
                String(auction.status || "").toLowerCase()
            ) &&
            getSecondsRemaining(auction) > 0
        );

    }


    // ==========================================
    // COUNTDOWN FORMAT
    // ==========================================

    function formatTime(seconds) {

        seconds = Math.max(
            0,
            Math.floor(Number(seconds) || 0)
        );

        const days = Math.floor(seconds / 86400);

        const hours = Math.floor(
            (seconds % 86400) / 3600
        );

        const minutes = Math.floor(
            (seconds % 3600) / 60
        );

        const secs = seconds % 60;

        if (days > 0) {

            return (
                String(days).padStart(2, "0") +
                "d " +
                String(hours).padStart(2, "0") +
                ":" +
                String(minutes).padStart(2, "0")
            );

        }

        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(secs).padStart(2, "0")
        );

    }


    // ==========================================
    // ENDING SOON
    // ==========================================

    function isEndingSoon(auction) {

        const seconds = getSecondsRemaining(auction);

        return (
            seconds > 0 &&
            seconds <= 24 * 60 * 60
        );

    }


    // ==========================================
    // NEWLY LISTED
    // ==========================================

    function isNewlyListed(auction) {

        const start = parseAuctionDate(
            auction.startAt
        );

        return Boolean(
            start &&
            Date.now() - start.getTime() <=
            24 * 60 * 60 * 1000
        );

    }


    // ==========================================
    // BID ERROR MESSAGE
    // ==========================================

    function showBidError(message) {

        if (!bidError) {
            return;
        }

        bidError.textContent = message || "";

        bidError.style.display =
            message ? "block" : "none";

    }


    // ==========================================
    // TOAST MESSAGE
    // ==========================================

    function showToast(message) {

        if (!toast) {

            toast = document.createElement("div");

            toast.id = "toast";

            toast.className = "toast";

            document.body.appendChild(toast);

        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 2800);

    }


    // ==========================================
    // LOAD AUCTIONS FROM BACKEND
    // ==========================================

    async function loadAuctionsFromServer() {

        if (
            !window.BYI_API ||
            typeof window.BYI_API.request !== "function"
        ) {

            console.error(
                "BYI_API is missing. Load api.js before auctions.js."
            );

            auctions = [];

            renderAuctions(
                "Backend API helper was not loaded."
            );

            return;

        }

        try {

            const response =
                await window.BYI_API.request(
                    "/api/auctions",
                    {
                        method: "GET"
                    }
                );

            const rows = Array.isArray(response)
                ? response
                : Array.isArray(response?.auctions)
                    ? response.auctions
                    : Array.isArray(response?.data?.auctions)
                        ? response.data.auctions
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

            auctions = rows.map(
                (item, index) =>
                    normalizeAuction(item, index)
            );

            renderAuctions();

        } catch (error) {

            console.error(
                "Auction loading error:",
                error
            );

            auctions = [];

            renderAuctions(
                "Unable to load auctions. Check your server."
            );

            showToast(
                error.message ||
                "Unable to load auctions."
            );

        }

    }


    // ==========================================
    // FILTER AUCTIONS
    // ==========================================

    function getFilteredAuctions() {

        let result = [...auctions];

        const search =
            searchInput?.value?.trim().toLowerCase() || "";

        if (search) {

            result = result.filter(auction => {

                const searchableText = [
                    auction.name,
                    auction.category,
                    auction.description
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(search);

            });

        }


        // Category filters: supports both HTML class names.

        const selectedCategories = $$( 
            ".category:checked, .auction-category:checked"
        ).map(input =>
            input.value.trim().toLowerCase()
        );

        if (selectedCategories.length) {

            result = result.filter(auction => {

                const category = String(
                    auction.category || ""
                )
                    .trim()
                    .toLowerCase();

                return selectedCategories.some(selected => {

                    if (selected === "art & collectibles") {

                        return (
                            category === "art" ||
                            category === selected
                        );

                    }

                    if (selected === "home & living") {

                        return (
                            category === selected ||
                            category === "furniture"
                        );

                    }

                    if (selected === "sports & hobbies") {

                        return (
                            category === "sports" ||
                            category === selected
                        );

                    }

                    return category === selected;

                });

            });

        }


        // Price filter.

        const maxPrice = Number(
            priceRange?.value || 500000
        );

        if (
            maxPrice <
            Number(priceRange?.max || 500000)
        ) {

            result = result.filter(auction =>
                getCurrentBid(auction) <= maxPrice
            );

        }


        // Status filters: supports both HTML class names.

        const selectedStatuses = $$( 
            ".status:checked, .auction-status:checked"
        ).map(input =>
            input.value.trim().toLowerCase()
        );

        if (selectedStatuses.length) {

            result = result.filter(auction => {

                return selectedStatuses.some(status => {

                    if (status === "live now") {
                        return isAuctionLive(auction);
                    }

                    if (status === "ending soon") {
                        return isEndingSoon(auction);
                    }

                    if (status === "most bids") {
                        return Number(auction.bidCount || 0) > 0;
                    }

                    if (status === "newly listed") {
                        return isNewlyListed(auction);
                    }

                    return false;

                });

            });

        }


        // Tabs.

        if (activeTab === "Ending Soon") {

            result = result.filter(isEndingSoon);

        }

        if (activeTab === "Most Bids") {

            result.sort((a, b) =>
                Number(b.bidCount || 0) -
                Number(a.bidCount || 0)
            );

        }

        if (activeTab === "Newly Listed") {

            result = result.filter(isNewlyListed);

        }


        // Sorting.

        const sort = sortSelect?.value || "Trending";

        if (sort === "Price: Low to High") {

            result.sort((a, b) =>
                getCurrentBid(a) - getCurrentBid(b)
            );

        }

        if (sort === "Price: High to Low") {

            result.sort((a, b) =>
                getCurrentBid(b) - getCurrentBid(a)
            );

        }

        if (sort === "Time Left") {

            result.sort((a, b) =>
                getSecondsRemaining(a) -
                getSecondsRemaining(b)
            );

        }

        if (sort === "Trending") {

            result.sort((a, b) =>
                Number(b.bidCount || 0) -
                Number(a.bidCount || 0)
            );

        }

        return result;

    }


    // ==========================================
    // RENDER AUCTION CARDS
    // ==========================================

    function renderAuctions(
        message = "No auctions match your filters."
    ) {

        if (!auctionGrid) {

            console.error(
                "#auctionGrid was not found."
            );

            return;

        }

        const filtered = getFilteredAuctions();

        if (!filtered.length) {

            auctionGrid.innerHTML = "";

            if (emptyState) {

                emptyState.hidden = false;

                emptyState.textContent = message;

            }

            return;

        }

        if (emptyState) {
            emptyState.hidden = true;
        }


        auctionGrid.innerHTML = filtered.map(auction => {

            const currentBid = getCurrentBid(auction);

            const secondsRemaining =
                getSecondsRemaining(auction);

            const live = isAuctionLive(auction);

            return `

                <article
                    class="card integrated-auction-card"
                    data-auction-id="${escapeHTML(auction.id)}"
                >

                    <div class="card-image position-relative">

                        <img
                            src="${escapeHTML(auction.image)}"
                            alt="${escapeHTML(auction.name)}"
                            loading="lazy"
                            class="integrated-auction-image"
                        >

                        <span class="live-badge ${live ? "" : "ended-badge"}">
                            ${live ? "LIVE" : "ENDED"}
                        </span>

                        <button
                            type="button"
                            class="heart integrated-heart"
                            data-favorite="${escapeHTML(auction.id)}"
                            aria-label="Add to wishlist"
                        >
                            ♡
                        </button>

                    </div>


                    <div class="card-body integrated-auction-body">

                        <div class="category-name integrated-auction-category">
                            ${escapeHTML(auction.category)}
                        </div>

                        <h3>
                            ${escapeHTML(auction.name)}
                        </h3>

                        <div class="card-meta integrated-auction-meta">

                            <div>

                                <span class="meta-label">
                                    Current Bid
                                </span>

                                <div class="bid-price integrated-bid-price">
                                    ${formatPrice(currentBid)}
                                </div>

                            </div>


                            <div>

                                <span class="meta-label">
                                    Ends In
                                </span>

                                <strong
                                    class="time auction-countdown"
                                    data-auction-id="${escapeHTML(auction.id)}"
                                >
                                    ${live
                                        ? formatTime(secondsRemaining)
                                        : "Ended"
                                    }
                                </strong>

                            </div>

                        </div>


                        <button
                            type="button"
                            class="bid-button integrated-bid-button"
                            data-bid="${escapeHTML(auction.id)}"
                            ${live ? "" : "disabled"}
                        >
                            ${live ? "Place Bid" : "Auction Ended"}
                        </button>

                    </div>

                </article>

            `;

        }).join("");

    }


    // ==========================================
    // CARD CLICK EVENTS
    // Event delegation prevents lost click events
    // after cards are re-rendered.
    // ==========================================

    function setupCardEvents() {

        if (
            !auctionGrid ||
            auctionGrid.dataset.eventsBound === "true"
        ) {
            return;
        }

        auctionGrid.dataset.eventsBound = "true";


        auctionGrid.addEventListener("click", async event => {

            // PLACE BID BUTTON

            const bidButton = event.target.closest("[data-bid]");

            if (
                bidButton &&
                auctionGrid.contains(bidButton)
            ) {

                event.preventDefault();

                event.stopPropagation();

                if (bidButton.disabled) {
                    return;
                }

                const auction = auctions.find(item =>
                    String(item.id) ===
                    String(bidButton.dataset.bid)
                );

                if (!auction) {

                    showToast(
                        "Auction details could not be found. Please refresh."
                    );

                    return;

                }

                openBidModal(auction);

                return;

            }


            // WISHLIST BUTTON

            const favoriteButton =
                event.target.closest("[data-favorite]");

            if (
                favoriteButton &&
                auctionGrid.contains(favoriteButton)
            ) {

                event.preventDefault();

                event.stopPropagation();

                await toggleWishlist(favoriteButton);

            }

        });


        // IMAGE FALLBACK

        auctionGrid.addEventListener("error", event => {

            const image = event.target;

            if (
                image instanceof HTMLImageElement &&
                image.classList.contains("integrated-auction-image") &&
                !image.dataset.fallback
            ) {

                image.dataset.fallback = "true";

                image.src =
                    "/assets/images/gramophone.jpg";

            }

        }, true);

    }


    // ==========================================
    // WISHLIST
    // ==========================================

    async function toggleWishlist(button) {

        if (
            !window.BYI_API ||
            !window.BYI_API.isLoggedIn?.()
        ) {

            showToast(
                "Please log in to use your wishlist."
            );

            window.location.href =
                "/pages/auth/login.html";

            return;

        }

        const id = button.dataset.favorite;

        const saved =
            button.classList.contains("active");

        try {

            await window.BYI_API.request(
                `/api/wishlist/${encodeURIComponent(id)}`,
                {
                    method: saved ? "DELETE" : "POST"
                }
            );

            button.classList.toggle(
                "active",
                !saved
            );

            button.textContent =
                saved ? "♡" : "♥";

            showToast(
                saved
                    ? "Removed from wishlist."
                    : "Added to wishlist."
            );

        } catch (error) {

            console.error(
                "Wishlist error:",
                error
            );

            showToast(
                error.message ||
                "Unable to update wishlist."
            );

        }

    }


    // ==========================================
    // OPEN BID MODAL
    // ==========================================

    function openBidModal(auction) {

        if (!auction || !bidModal) {

            console.error(
                "Bid modal or selected auction is missing."
            );

            showToast(
                "Bid window is unavailable. Please refresh the page."
            );

            return;

        }

        if (!isAuctionLive(auction)) {

            showToast(
                "This auction has ended or is not open for bidding."
            );

            return;

        }


        selectedAuction = auction;

        isSubmittingBid = false;


        if (bidModalItem) {

            bidModalItem.textContent =
                auction.name;

        }


        const modalCurrent = $("#modalCurrent");

        if (modalCurrent) {

            modalCurrent.textContent =
                formatPrice(getCurrentBid(auction));

        }


        if (bidAmountInput) {

            bidAmountInput.value = "";

            bidAmountInput.min = String(
                getCurrentBid(auction) + 1
            );

            bidAmountInput.placeholder =
                `More than ${formatPrice(getCurrentBid(auction))}`;

        }


        if (confirmBidBtn) {

            confirmBidBtn.disabled = false;

            confirmBidBtn.textContent =
                "Confirm Bid";

        }


        showBidError("");


        bidModal.classList.remove("hidden");

        bidModal.classList.add("show");

        bidModal.style.display = "flex";

        bidModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow = "hidden";


        setTimeout(() => {

            bidAmountInput?.focus();

        }, 80);

    }


    // ==========================================
    // CLOSE BID MODAL
    // ==========================================

    function closeBidModal() {

        selectedAuction = null;

        isSubmittingBid = false;


        if (bidModal) {

            bidModal.classList.remove("show");

            bidModal.classList.add("hidden");

            bidModal.style.display = "none";

            bidModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }


        document.body.style.overflow = "";


        showBidError("");


        if (bidAmountInput) {
            bidAmountInput.value = "";
        }


        if (confirmBidBtn) {

            confirmBidBtn.disabled = false;

            confirmBidBtn.textContent =
                "Confirm Bid";

        }

    }


    // ==========================================
    // SUBMIT BID TO BACKEND
    // ==========================================

    async function submitBid() {

        if (isSubmittingBid) {
            return;
        }


        if (!selectedAuction) {

            showBidError(
                "Select an auction before placing a bid."
            );

            return;

        }


        const amount = Number(
            bidAmountInput?.value
        );

        const currentBid =
            getCurrentBid(selectedAuction);


        // VALIDATE AMOUNT

        if (
            !Number.isFinite(amount) ||
            amount <= currentBid
        ) {

            showBidError(
                `Your bid must be higher than ${formatPrice(currentBid)}.`
            );

            bidAmountInput?.focus();

            return;

        }


        // CHECK API

        if (
            !window.BYI_API ||
            typeof window.BYI_API.request !== "function"
        ) {

            showBidError(
                "Backend connection is unavailable. Check that api.js is loaded."
            );

            return;

        }


        // CHECK LOGIN

        if (!window.BYI_API.isLoggedIn?.()) {

            showBidError(
                "Please log in before placing a bid. You will be redirected to the login page."
            );

            setTimeout(() => {

                window.location.href =
                    "/pages/auth/login.html";

            }, 1400);

            return;

        }


        isSubmittingBid = true;


        if (confirmBidBtn) {

            confirmBidBtn.disabled = true;

            confirmBidBtn.textContent =
                "Placing Bid...";

        }


        showBidError("");


        const auctionId =
            selectedAuction.id;


        try {

            // SEND BID TO NODE.JS BACKEND

            const response =
                await window.BYI_API.request(

                    `/api/auctions/${encodeURIComponent(auctionId)}/bids`,

                    {
                        method: "POST",

                        body: {
                            amount: amount
                        }
                    }

                );


            if (response?.success === false) {

                throw new Error(
                    response.message ||
                    "The bid was not accepted."
                );

            }


            // GET UPDATED BID FROM BACKEND

            const newBid = Number(

                response?.currentBid ??
                response?.current_bid ??
                response?.bid?.amount ??
                response?.bid?.currentBid ??
                amount

            );


            // UPDATE LOCAL AUCTION

            const auction = auctions.find(item =>

                String(item.id) ===
                String(auctionId)

            );


            if (auction) {

                auction.currentBid = newBid;

                auction.price = newBid;

                auction.bidCount =
                    Number(auction.bidCount || 0) + 1;

            }


            // CLOSE MODAL

            closeBidModal();


            // REFRESH CARDS

            renderAuctions();


            // NOTIFY OTHER PAGES

            document.dispatchEvent(

                new CustomEvent(
                    "byi:bidUpdated",
                    {
                        detail: {
                            auctionId: auctionId,
                            currentBid: newBid
                        }
                    }
                )

            );


            // SUCCESS MESSAGE

            showToast(

                response?.message ||
                `Bid placed successfully: ${formatPrice(newBid)}`

            );


        } catch (error) {

            console.error(
                "Place bid error:",
                error
            );


            const message =
                error?.message ||
                "Unable to place your bid.";


            if (
                /401|unauthorized|expired token|invalid token/i.test(message)
            ) {

                showBidError(
                    "Your login session has expired. Please log in again, then place your bid."
                );

            } else {

                showBidError(message);

            }

        } finally {

            isSubmittingBid = false;

            if (confirmBidBtn) {

                confirmBidBtn.disabled = false;

                confirmBidBtn.textContent =
                    "Confirm Bid";

            }

        }

    }


    // ==========================================
    // TABS
    // Supports .tab and .auction-tab
    // ==========================================

    function setupTabs() {

        const tabs = $$(
            ".tab[data-tab], .auction-tab[data-tab]"
        );

        tabs.forEach(tab => {

            tab.addEventListener("click", () => {

                tabs.forEach(item => {

                    item.classList.remove("active");

                });

                tab.classList.add("active");

                activeTab =
                    tab.dataset.tab ||
                    "Trending";

                renderAuctions();

            });

        });

    }


    // ==========================================
    // FILTER EVENTS
    // ==========================================

    function setupFilters() {

        document.addEventListener("change", event => {

            if (
                event.target.matches(
                    ".category, .auction-category, .status, .auction-status"
                )
            ) {

                renderAuctions();

            }

        });


        priceRange?.addEventListener(
            "input",
            renderAuctions
        );


        sortSelect?.addEventListener(
            "change",
            renderAuctions
        );


        searchInput?.addEventListener(
            "input",
            renderAuctions
        );


        // CLEAR ALL FILTERS

        clearAll?.addEventListener("click", () => {

            $$(
                ".category, .auction-category, .status, .auction-status"
            ).forEach(input => {

                input.checked = false;

            });


            const liveNow = $(
                '.status[value="Live Now"], .auction-status[value="Live Now"]'
            );

            if (liveNow) {

                liveNow.checked = true;

            }


            if (priceRange) {

                priceRange.value =
                    priceRange.max;

            }


            if (sortSelect) {

                sortSelect.selectedIndex = 0;

            }


            if (searchInput) {

                searchInput.value = "";

            }


            activeTab = "Trending";


            $$(".tab[data-tab], .auction-tab[data-tab]").forEach(tab => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.tab === "Trending"
                );

            });


            renderAuctions();

        });

    }


    // ==========================================
    // MODAL EVENTS
    // ==========================================

    function setupModal() {

        closeBidBtn?.addEventListener("click", event => {

            event.preventDefault();

            closeBidModal();

        });


        confirmBidBtn?.addEventListener("click", event => {

            event.preventDefault();

            submitBid();

        });


        bidAmountInput?.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                submitBid();

            }

        });


        bidModal?.addEventListener("click", event => {

            if (event.target === bidModal) {

                closeBidModal();

            }

        });


        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                bidModal?.classList.contains("show")
            ) {

                closeBidModal();

            }

        });

    }


    // ==========================================
    // CATEGORY PAGE BID EVENT
    // ==========================================

    function setupCategoryBidListener() {

        document.addEventListener(
            "byi:categoryBid",
            event => {

                const item =
                    event.detail?.auction;

                if (!item) {
                    return;
                }

                const normalized =
                    normalizeAuction(item);

                const existing = auctions.find(auction =>

                    String(auction.id) ===
                    String(normalized.id)

                );

                openBidModal(
                    existing || normalized
                );

            }
        );

    }


    // ==========================================
    // BID UPDATE EVENT
    // ==========================================

    function setupBidUpdateListener() {

        document.addEventListener(
            "byi:bidUpdated",
            event => {

                const id =
                    event.detail?.auctionId;

                const amount =
                    Number(event.detail?.currentBid);

                if (
                    id == null ||
                    !Number.isFinite(amount)
                ) {

                    return;

                }


                const auction = auctions.find(item =>

                    String(item.id) ===
                    String(id)

                );


                if (auction) {

                    auction.currentBid = amount;

                    auction.price = amount;

                }


                renderAuctions();

            }
        );

    }


    // ==========================================
    // COUNTDOWN UPDATES
    // ==========================================

    function updateCountdowns() {

        $$(".auction-countdown").forEach(element => {

            const auction = auctions.find(item =>

                String(item.id) ===
                String(element.dataset.auctionId)

            );

            if (!auction) {
                return;
            }


            const seconds =
                getSecondsRemaining(auction);


            element.textContent =
                seconds > 0
                    ? formatTime(seconds)
                    : "Ended";


            if (seconds <= 0) {

                const button =
                    element.closest(
                        ".integrated-auction-card"
                    )?.querySelector("[data-bid]");


                if (button) {

                    button.disabled = true;

                    button.textContent =
                        "Auction Ended";

                }

            }

        });

    }


    // ==========================================
    // INITIALIZE AUCTION PAGE
    // ==========================================

    function init() {

        if (!auctionGrid) {

            console.error(
                "Auction page setup failed: #auctionGrid is missing."
            );

            return;

        }


        setupCardEvents();

        setupTabs();

        setupFilters();

        setupModal();

        setupCategoryBidListener();

        setupBidUpdateListener();


        loadAuctionsFromServer();


        setInterval(
            updateCountdowns,
            1000
        );

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            { once: true }
        );

    } else {

        init();

    }

})();