
"use strict";

(() => {
    let auctions = [];
    let activeTab = "Trending";
    let selectedAuction = null;
    let toastTimer = null;

    const auctionGrid = document.getElementById("auctionGrid");
    const emptyState = document.getElementById("emptyState");
    const clearAll = document.getElementById("clearAll");
    const priceRange = document.getElementById("priceRange");
    const sortSelect = document.getElementById("sortSelect");

    const searchInput =
        document.getElementById("searchInput") ||
        document.getElementById("globalSearch");

    const bidModal = document.getElementById("bidModal");

    const closeBidBtn =
        document.getElementById("closeBidBtn") ||
        document.getElementById("closeModal");

    const bidModalItem =
        document.getElementById("bidModalItem") ||
        document.getElementById("modalItem");

    const bidAmountInput =
        document.getElementById("bidAmountInput") ||
        document.getElementById("bidAmount");

    const confirmBidBtn =
        document.getElementById("confirmBidBtn") ||
        document.getElementById("confirmBid");

    const bidError =
        document.getElementById("bidError") ||
        document.getElementById("bidMessage");

    const toast = document.getElementById("toast");

    const demoAuctions = [
        {
            id: 1,
            name: "Luxury Wrist Watch",
            category: "Fashion",
            startingPrice: 45000,
            currentBid: 45000,
            bidCount: 18,
            image: "/assets/images/watch.jpg",
            status: "live",
            startAt: new Date(Date.now() - 86400000).toISOString(),
            endAt: new Date(
                Date.now() + 2 * 3600000 + 15 * 60000 + 30000
            ).toISOString()
        },
        {
            id: 2,
            name: "Vintage Camera",
            category: "Electronics",
            startingPrice: 22500,
            currentBid: 22500,
            bidCount: 25,
            image: "/assets/images/camera.jpg",
            status: "live",
            startAt: new Date(Date.now() - 86400000).toISOString(),
            endAt: new Date(
                Date.now() + 1 * 3600000 + 45 * 60000
            ).toISOString()
        },
        {
            id: 3,
            name: "Antique Wooden Chair",
            category: "Furniture",
            startingPrice: 12500,
            currentBid: 12500,
            bidCount: 9,
            image: "/assets/images/chair.jpg",
            status: "live",
            startAt: new Date(Date.now() - 172800000).toISOString(),
            endAt: new Date(
                Date.now() + 4 * 3600000 + 20 * 60000
            ).toISOString()
        },
        {
            id: 4,
            name: "Diamond Necklace",
            category: "Jewellery",
            startingPrice: 85000,
            currentBid: 85000,
            bidCount: 31,
            image: "/assets/images/necklace.jpg",
            status: "live",
            startAt: new Date(Date.now() - 43200000).toISOString(),
            endAt: new Date(
                Date.now() + 3 * 3600000 + 10 * 60000
            ).toISOString()
        },
        {
            id: 5,
            name: "Modern Art Painting",
            category: "Art & Collectibles",
            startingPrice: 35000,
            currentBid: 35000,
            bidCount: 14,
            image: "/assets/images/painting.jpg",
            status: "live",
            startAt: new Date(Date.now() - 86400000).toISOString(),
            endAt: new Date(
                Date.now() + 5 * 3600000 + 30 * 60000
            ).toISOString()
        },
        {
            id: 6,
            name: "BMW X5",
            category: "Vehicles",
            startingPrice: 1850000,
            currentBid: 1850000,
            bidCount: 12,
            image: "/assets/images/car.jpg",
            status: "live",
            startAt: new Date(Date.now() - 259200000).toISOString(),
            endAt: new Date(
                Date.now() + 6 * 3600000 + 15 * 60000
            ).toISOString()
        },
        {
            id: 7,
            name: "Designer Handbag",
            category: "Fashion",
            startingPrice: 28000,
            currentBid: 28000,
            bidCount: 22,
            image: "/assets/images/handbag.jpg",
            status: "live",
            startAt: new Date(Date.now() - 43200000).toISOString(),
            endAt: new Date(
                Date.now() + 2 * 3600000 + 50 * 60000
            ).toISOString()
        },
        {
            id: 8,
            name: "iPhone 15 Pro",
            category: "Electronics",
            startingPrice: 63500,
            currentBid: 63500,
            bidCount: 37,
            image: "/assets/images/phone.jpg",
            status: "live",
            startAt: new Date(Date.now() - 21600000).toISOString(),
            endAt: new Date(
                Date.now() + 1 * 3600000 + 30 * 60000
            ).toISOString()
        },
        {
            id: 9,
            name: "Vintage Gramophone",
            category: "Antiques",
            startingPrice: 18500,
            currentBid: 18500,
            bidCount: 8,
            image: "/assets/images/gramophone.jpg",
            status: "live",
            startAt: new Date(Date.now() - 345600000).toISOString(),
            endAt: new Date(
                Date.now() + 7 * 3600000 + 20 * 60000
            ).toISOString()
        },
        {
            id: 10,
            name: "Luxury Sofa Set",
            category: "Home & Living",
            startingPrice: 72000,
            currentBid: 72000,
            bidCount: 16,
            image: "/assets/images/sofa.jpg",
            status: "live",
            startAt: new Date(Date.now() - 86400000).toISOString(),
            endAt: new Date(
                Date.now() + 3 * 3600000 + 45 * 60000
            ).toISOString()
        }
    ];

    function formatPrice(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN");
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

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

    function getEndTime(auction) {
        if (!auction.endAt) {
            return null;
        }

        const timestamp = new Date(auction.endAt).getTime();

        return Number.isNaN(timestamp) ? null : timestamp;
    }

    function getSecondsRemaining(auction) {
        const endTime = getEndTime(auction);

        if (endTime === null) {
            return 0;
        }

        return Math.max(
            0,
            Math.floor((endTime - Date.now()) / 1000)
        );
    }

    function formatTime(seconds) {
        seconds = Math.max(
            0,
            Math.floor(Number(seconds) || 0)
        );

        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
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

    function isEndingSoon(auction) {
        const seconds = getSecondsRemaining(auction);

        return seconds > 0 && seconds <= 24 * 60 * 60;
    }

    function isNewlyListed(auction) {
        if (!auction.startAt) {
            return false;
        }

        const startTime = new Date(auction.startAt).getTime();

        if (Number.isNaN(startTime)) {
            return false;
        }

        return Date.now() - startTime <= 24 * 60 * 60 * 1000;
    }

    function showBidError(message) {
        if (!bidError) {
            return;
        }

        bidError.textContent = message || "";

        if (message) {
            bidError.style.display = "block";
        } else {
            bidError.style.display = "none";
        }
    }

    function showToast(message) {
        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    function normalizeAuction(item, index) {
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
            "";

        if (
            image &&
            !image.startsWith("/") &&
            !image.startsWith("http://") &&
            !image.startsWith("https://") &&
            !image.startsWith("data:")
        ) {
            image = "/" + image.replace(/^\.?\//, "");
        }

        return {
            id: item.id ?? index + 1,
            name:
                item.name ??
                item.title ??
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
                item.startAt ??
                item.start_at ??
                null,
            endAt:
                item.endAt ??
                item.end_at ??
                null,
            status:
                String(
                    item.status ??
                    "live"
                ).toLowerCase(),
            tags:
                Array.isArray(item.tags)
                    ? item.tags
                    : []
        };
    }

    async function loadAuctionsFromServer() {
        try {
            if (
                !window.BYI_API ||
                typeof window.BYI_API.request !== "function"
            ) {
                auctions = demoAuctions.map(normalizeAuction);
                renderAuctions();
                return;
            }

            const response = await window.BYI_API.request(
                "/api/auctions"
            );

            const serverData =
                Array.isArray(response)
                    ? response
                    : Array.isArray(response?.auctions)
                        ? response.auctions
                        : Array.isArray(response?.data)
                            ? response.data
                            : [];

            if (serverData.length > 0) {
                auctions = serverData.map(normalizeAuction);
            } else {
                auctions = demoAuctions.map(normalizeAuction);
            }

            renderAuctions();
        } catch (error) {
            console.error("Auction loading error:", error);

            auctions = demoAuctions.map(normalizeAuction);

            renderAuctions();
        }
    }

    function getFilteredAuctions() {
        let result = [...auctions];

        const search =
            searchInput?.value?.trim().toLowerCase() || "";

        if (search) {
            result = result.filter((auction) => {
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

        const selectedCategories = [
            ...document.querySelectorAll(
                ".auction-category:checked"
            )
        ].map((checkbox) =>
            checkbox.value.trim().toLowerCase()
        );

        if (selectedCategories.length > 0) {
            result = result.filter((auction) => {
                const category = String(
                    auction.category || ""
                )
                    .trim()
                    .toLowerCase();

                return selectedCategories.some((selected) => {
                    if (selected === "art & collectibles") {
                        return (
                            category === "art" ||
                            category === "art & collectibles"
                        );
                    }

                    if (selected === "home & living") {
                        return (
                            category === "home & living" ||
                            category === "furniture"
                        );
                    }

                    if (selected === "sports & hobbies") {
                        return (
                            category === "sports" ||
                            category === "sports & hobbies"
                        );
                    }

                    return category === selected;
                });
            });
        }

        const maxPrice = Number(
            priceRange?.value || 500000
        );

        if (maxPrice < 500000) {
            result = result.filter(
                (auction) =>
                    getCurrentBid(auction) <= maxPrice
            );
        }

        const selectedStatuses = [
            ...document.querySelectorAll(
                ".auction-status:checked"
            )
        ].map((checkbox) =>
            checkbox.value.trim().toLowerCase()
        );

        if (selectedStatuses.length > 0) {
            result = result.filter((auction) => {
                return selectedStatuses.some((status) => {
                    if (status === "live now") {
                        return (
                            getSecondsRemaining(auction) > 0 &&
                            auction.status !== "ended"
                        );
                    }

                    if (status === "ending soon") {
                        return isEndingSoon(auction);
                    }

                    if (status === "most bids") {
                        return Number(
                            auction.bidCount || 0
                        ) > 0;
                    }

                    if (status === "newly listed") {
                        return isNewlyListed(auction);
                    }

                    return false;
                });
            });
        }

        if (activeTab === "Ending Soon") {
            result = result.filter(isEndingSoon);
        }

        if (activeTab === "Most Bids") {
            result.sort(
                (a, b) =>
                    Number(b.bidCount || 0) -
                    Number(a.bidCount || 0)
            );
        }

        if (activeTab === "Newly Listed") {
            result = result.filter(isNewlyListed);
        }

        const sort = sortSelect?.value || "Trending";

        if (sort === "Price: Low to High") {
            result.sort(
                (a, b) =>
                    getCurrentBid(a) -
                    getCurrentBid(b)
            );
        }

        if (sort === "Price: High to Low") {
            result.sort(
                (a, b) =>
                    getCurrentBid(b) -
                    getCurrentBid(a)
            );
        }

        if (sort === "Time Left") {
            result.sort(
                (a, b) =>
                    getSecondsRemaining(a) -
                    getSecondsRemaining(b)
            );
        }

        if (sort === "Trending") {
            result.sort(
                (a, b) =>
                    Number(b.bidCount || 0) -
                    Number(a.bidCount || 0)
            );
        }

        return result;
    }

    function renderAuctions() {
        if (!auctionGrid) {
            console.error("#auctionGrid was not found.");
            return;
        }

        const filtered = getFilteredAuctions();

        if (filtered.length === 0) {
            auctionGrid.innerHTML = "";

            if (emptyState) {
                emptyState.hidden = false;
            }

            return;
        }

        if (emptyState) {
            emptyState.hidden = true;
        }

        auctionGrid.innerHTML = filtered
            .map((auction) => {
                const currentBid = getCurrentBid(auction);
                const secondsRemaining =
                    getSecondsRemaining(auction);

                const isLive =
                    auction.status !== "ended" &&
                    secondsRemaining > 0;

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

                            <span class="live-badge ${isLive ? "" : "ended-badge"}">
                                ${isLive ? "LIVE" : "ENDED"}
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
                                        ${isLive
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
                                ${isLive ? "" : "disabled"}
                            >
                                ${isLive ? "Place Bid" : "Auction Ended"}
                            </button>

                        </div>
                    </article>
                `;
            })
            .join("");

        attachCardEvents();
    }

    function attachCardEvents() {
        document.querySelectorAll("[data-bid]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                const auctionId = Number(
                    button.dataset.bid
                );

                const auction = auctions.find(
                    (item) =>
                        Number(item.id) === auctionId
                );

                if (auction) {
                    openBidModal(auction);
                }
            });
        });

        document.querySelectorAll("[data-favorite]").forEach((button) => {
            button.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const auctionId = Number(
                    button.dataset.favorite
                );

                if (
                    !window.BYI_API ||
                    !window.BYI_API.isLoggedIn()
                ) {
                    window.location.href =
                        "/pages/auth/login.html";
                    return;
                }

                const isSaved =
                    button.classList.contains("active");

                try {
                    if (isSaved) {
                        await window.BYI_API.request(
                            `/api/wishlist/${auctionId}`,
                            {
                                method: "DELETE"
                            }
                        );

                        button.classList.remove("active");
                        button.textContent = "♡";

                        showToast(
                            "Removed from wishlist."
                        );
                    } else {
                        await window.BYI_API.request(
                            `/api/wishlist/${auctionId}`,
                            {
                                method: "POST"
                            }
                        );

                        button.classList.add("active");
                        button.textContent = "♥";

                        showToast(
                            "Added to wishlist."
                        );
                    }
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
            });
        });

        document
            .querySelectorAll(".integrated-auction-image")
            .forEach((image) => {
                image.addEventListener("error", () => {
                    if (image.dataset.fallback) {
                        return;
                    }

                    image.dataset.fallback = "true";
                    image.src =
                        "/assets/images/gramophone.jpg";
                });
            });
    }

    function openBidModal(auction) {
        if (!auction || !bidModal) {
            return;
        }

        if (
            !window.BYI_API ||
            !window.BYI_API.isLoggedIn()
        ) {
            window.location.href =
                "/pages/auth/login.html";
            return;
        }

        if (
            getSecondsRemaining(auction) <= 0 ||
            auction.status === "ended"
        ) {
            showToast("This auction has ended.");
            return;
        }

        selectedAuction = auction;

        const currentBid = getCurrentBid(auction);

        if (bidModalItem) {
            bidModalItem.textContent =
                auction.name;
        }

        const modalCurrent =
            document.getElementById("modalCurrent");

        if (modalCurrent) {
            modalCurrent.textContent =
                formatPrice(currentBid);
        }

        if (bidAmountInput) {
            bidAmountInput.value = "";
            bidAmountInput.min = currentBid + 1;
        }

        showBidError("");

        bidModal.classList.remove("hidden");
        bidModal.classList.add("show");

        bidModal.setAttribute(
            "aria-hidden",
            "false"
        );

        setTimeout(() => {
            bidAmountInput?.focus();
        }, 100);
    }

    function closeBidModal() {
        selectedAuction = null;

        if (bidModal) {
            bidModal.classList.remove("show");
            bidModal.classList.add("hidden");

            bidModal.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        showBidError("");

        if (bidAmountInput) {
            bidAmountInput.value = "";
        }
    }

    async function submitBid() {
        if (!selectedAuction) {
            showBidError(
                "Please select an auction."
            );
            return;
        }

        const amount = Number(
            bidAmountInput?.value
        );

        const currentBid =
            getCurrentBid(selectedAuction);

        if (
            !Number.isFinite(amount) ||
            amount <= currentBid
        ) {
            showBidError(
                `Your bid must be higher than ${formatPrice(currentBid)}.`
            );
            return;
        }

        if (
            !window.BYI_API ||
            typeof window.BYI_API.request !== "function"
        ) {
            showBidError(
                "Backend connection is unavailable."
            );
            return;
        }

        if (confirmBidBtn) {
            confirmBidBtn.disabled = true;
            confirmBidBtn.textContent =
                "Placing Bid...";
        }

        try {
            const auctionId =
                selectedAuction.id;

            const response =
                await window.BYI_API.request(
                    `/api/auctions/${auctionId}/bids`,
                    {
                        method: "POST",
                        body: {
                            amount
                        }
                    }
                );

            const newBid = Number(
                response?.bid?.amount ??
                response?.bid?.currentBid ??
                response?.currentBid ??
                response?.current_bid ??
                response?.auction?.currentBid ??
                response?.auction?.current_bid ??
                amount
            );

            const auction = auctions.find(
                (item) =>
                    Number(item.id) ===
                    Number(auctionId)
            );

            if (auction) {
                auction.currentBid = newBid;
                auction.price = newBid;

                auction.bidCount =
                    Number(auction.bidCount || 0) + 1;
            }

            closeBidModal();

            renderAuctions();

            document.dispatchEvent(
                new CustomEvent(
                    "byi:bidUpdated",
                    {
                        detail: {
                            auctionId,
                            currentBid: newBid
                        }
                    }
                )
            );

            showToast(
                `Bid placed successfully: ${formatPrice(newBid)}`
            );
        } catch (error) {
            console.error(
                "Place bid error:",
                error
            );

            showBidError(
                error?.message ||
                "Unable to place bid."
            );
        } finally {
            if (confirmBidBtn) {
                confirmBidBtn.disabled = false;
                confirmBidBtn.textContent =
                    "Place Bid";
            }
        }
    }

    function setupTabs() {
        const tabs =
            document.querySelectorAll(
                ".auction-tab"
            );

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((item) => {
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

    function setupFilters() {
        document
            .querySelectorAll(".auction-category")
            .forEach((checkbox) => {
                checkbox.addEventListener(
                    "change",
                    renderAuctions
                );
            });

        document
            .querySelectorAll(".auction-status")
            .forEach((checkbox) => {
                checkbox.addEventListener(
                    "change",
                    renderAuctions
                );
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

        clearAll?.addEventListener(
            "click",
            () => {
                document
                    .querySelectorAll(
                        ".auction-category"
                    )
                    .forEach((checkbox) => {
                        checkbox.checked = false;
                    });

                document
                    .querySelectorAll(
                        ".auction-status"
                    )
                    .forEach((checkbox) => {
                        checkbox.checked = false;
                    });

                const liveNow =
                    document.querySelector(
                        '.auction-status[value="Live Now"]'
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

                document
                    .querySelectorAll(
                        ".auction-tab"
                    )
                    .forEach((tab) => {
                        tab.classList.remove(
                            "active"
                        );

                        if (
                            tab.dataset.tab ===
                            "Trending"
                        ) {
                            tab.classList.add(
                                "active"
                            );
                        }
                    });

                renderAuctions();
            }
        );
    }

    function updateCountdowns() {
        document
            .querySelectorAll(
                ".auction-countdown"
            )
            .forEach((element) => {
                const auctionId =
                    Number(
                        element.dataset.auctionId
                    );

                const auction =
                    auctions.find(
                        (item) =>
                            Number(item.id) ===
                            auctionId
                    );

                if (!auction) {
                    return;
                }

                const seconds =
                    getSecondsRemaining(
                        auction
                    );

                element.textContent =
                    seconds > 0
                        ? formatTime(seconds)
                        : "Ended";

                const card =
                    element.closest(
                        ".integrated-auction-card"
                    );

                const bidButton =
                    card?.querySelector(
                        "[data-bid]"
                    );

                if (
                    seconds <= 0 &&
                    bidButton
                ) {
                    bidButton.disabled = true;
                    bidButton.textContent =
                        "Auction Ended";
                }
            });
    }

    function setupModal() {
        closeBidBtn?.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                closeBidModal();
            }
        );

        confirmBidBtn?.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                submitBid();
            }
        );

        bidAmountInput?.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    submitBid();
                }
            }
        );

        bidModal?.addEventListener(
            "click",
            (event) => {
                if (event.target === bidModal) {
                    closeBidModal();
                }
            }
        );

        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Escape") {
                    closeBidModal();
                }
            }
        );
    }

    function setupCategoryBidListener() {
        document.addEventListener(
            "byi:categoryBid",
            (event) => {
                const auction =
                    event.detail?.auction;

                if (!auction) {
                    return;
                }

                const normalized =
                    normalizeAuction(
                        auction,
                        0
                    );

                const existing =
                    auctions.find(
                        (item) =>
                            Number(item.id) ===
                            Number(normalized.id)
                    );

                openBidModal(
                    existing || normalized
                );
            }
        );
    }

    function setupBidUpdateListener() {
        document.addEventListener(
            "byi:bidUpdated",
            (event) => {
                const auctionId =
                    event.detail?.auctionId;

                const currentBid =
                    Number(
                        event.detail?.currentBid
                    );

                if (
                    auctionId === undefined ||
                    !Number.isFinite(currentBid)
                ) {
                    return;
                }

                const auction =
                    auctions.find(
                        (item) =>
                            Number(item.id) ===
                            Number(auctionId)
                    );

                if (auction) {
                    auction.currentBid =
                        currentBid;

                    auction.price =
                        currentBid;
                }

                renderAuctions();
            }
        );
    }

    function init() {
        if (!auctionGrid) {
            console.error(
                "Auction system: #auctionGrid not found."
            );
            return;
        }

        setupTabs();
        setupFilters();
        setupModal();
        setupCategoryBidListener();
        setupBidUpdateListener();

        auctions =
            demoAuctions.map(
                normalizeAuction
            );

        renderAuctions();

        loadAuctionsFromServer();

        setInterval(
            updateCountdowns,
            1000
        );
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }
})();