(() => {
    "use strict";

    const dashboardData = {
        user: null,
        stats: {},
        bids: [],
        wishlist: [],
        myAuctions: [],
        notifications: [],
        messages: [],
        transactions: [],
        orders: [],
        auctions: []
    };

    let selectedAuction = null;

    const $ = selector => document.querySelector(selector);
    const $$ = selector => [...document.querySelectorAll(selector)];

    function money(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function formatDate(date) {
        if (!date) return "-";

        const d = new Date(date);

        if (Number.isNaN(d.getTime())) return "-";

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function timeRemaining(endAt) {
        if (!endAt) return "-";

        const difference = new Date(endAt).getTime() - Date.now();

        if (Number.isNaN(difference)) return "-";
        if (difference <= 0) return "Ended";

        const minutes = Math.floor(difference / 60000);
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;

        return `${minutes}m`;
    }

    function imagePath(image, category) {
        const fallbackImages = {
            Electronics: "/assets/images/laptop.png",
            Furniture: "/assets/images/chair.jpg",
            Jewellery: "/assets/images/necklace.jpg",
            "Art & Collectibles": "/assets/images/painting.jpg",
            Vehicles: "/assets/images/car.jpg",
            Fashion: "/assets/images/watch.jpg",
            Antiques: "/assets/images/gramophone.jpg"
        };

        if (!image) {
            return fallbackImages[category] ||
                "/assets/images/gramophone.jpg";
        }

        image = String(image).trim();

        if (/^(https?:|data:)/i.test(image) || image.startsWith("/")) {
            return image;
        }

        return "/" + image.replace(/^(?:\.\.\/)+/, "").replace(/^\/+/, "");
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(BYI_API.userKey));
        } catch {
            return null;
        }
    }


    function checkAuthentication() {
        if (!BYI_API || !BYI_API.isLoggedIn()) {
            window.location.href = "../auth/login.html";
            return false;
        }

        return true;
    }


    function toast(message, type = "success") {
        const element = $("#toast");
        const messageElement = $("#toastMessage");

        if (!element || !messageElement) {
            console.log(message);
            return;
        }

        messageElement.textContent = message;

        const icon = element.querySelector("i");

        if (icon) {
            icon.className = type === "error"
                ? "fa-solid fa-circle-exclamation"
                : "fa-solid fa-circle-check";
        }

        element.classList.add("show");

        clearTimeout(element.toastTimer);

        element.toastTimer = setTimeout(() => {
            element.classList.remove("show");
        }, 3000);
    }

    function openModal(content) {
        const backdrop = $("#modalBackdrop");
        const modalContent = $("#modalContent");

        if (!backdrop || !modalContent) return;

        modalContent.innerHTML = content;

        backdrop.classList.add("show");
        backdrop.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        const backdrop = $("#modalBackdrop");

        if (!backdrop) return;

        backdrop.classList.remove("show");
        backdrop.setAttribute("aria-hidden", "true");

        selectedAuction = null;
    }


    function showSection(sectionId) {
        $$(".dashboard-section").forEach(section => {
            section.classList.remove("active-section");
        });

        const target = document.getElementById(sectionId);

        if (target) {
            target.classList.add("active-section");
        }

        $$(".side-link[data-section]").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === sectionId
            );
        });

        document.body.classList.remove("sidebar-open");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function navigateTop(page) {
        const routes = {
            home: "../../index.html",
            auctions: "../auctions/auctions.html",
            categories: "../categories/categories.html",
            help: "../help/help.html"
        };

        if (routes[page]) {
            window.location.href = routes[page];
        }
    }


    async function loadDashboard() {
        if (!checkAuthentication()) return;

        try {
            const [dashboardResponse, ordersResponse] =
                await Promise.all([
                    BYI_API.request("/api/dashboard"),
                    BYI_API.request("/api/orders/won")
                ]);

            if (!dashboardResponse.success) {
                throw new Error(
                    dashboardResponse.message ||
                    "Failed to load dashboard."
                );
            }

            dashboardData.user =
                dashboardResponse.user || getUser();

            dashboardData.stats =
                dashboardResponse.stats || {};

            dashboardData.bids =
                dashboardResponse.bids || [];

            dashboardData.wishlist =
                dashboardResponse.wishlist || [];

            dashboardData.myAuctions =
                dashboardResponse.myAuctions || [];

            dashboardData.notifications =
                dashboardResponse.notifications || [];

            dashboardData.messages =
                dashboardResponse.messages || [];

            dashboardData.transactions =
                dashboardResponse.transactions || [];

            dashboardData.orders =
                ordersResponse.orders || [];

            // Render all dashboard sections

            renderUser();
            renderStats();
            renderDashboardBids();
            renderMyBids();
            renderWishlist();
            renderMyAuctions();
            renderMessages();
            renderNotifications();
            renderWallet();
            renderTransactions();
            updateBadges();

            await renderRecommendations();

        } catch (error) {
            console.error("Dashboard loading error:", error);
            toast(error.message || "Unable to load dashboard.", "error");
        }
    }


    function renderUser() {
        const user = dashboardData.user;

        if (!user) return;

        const name = user.name || "User";
        const role = user.role || "buyer";

        const values = {
            "#topUserName": name,
            "#topUserRole": role.charAt(0).toUpperCase() + role.slice(1),
            "#sidebarUserName": name,
            "#welcomeUserName": name
        };

        Object.entries(values).forEach(([selector, value]) => {
            const element = $(selector);
            if (element) element.textContent = value;
        });

        const profile = $("#profileContent");

        if (profile) {
            profile.innerHTML = `
                <div class="profile-header p-4">
                    <div class="sidebar-avatar mb-3">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <h2>${escapeHTML(name)}</h2>
                    <p>${escapeHTML(role)}</p>

                    <button class="secondary-btn" id="editProfileBtn">
                        <i class="fa-solid fa-pen"></i>
                        Edit Profile
                    </button>
                </div>

                <div class="p-4">
                    <p><strong>Full Name:</strong>
                        ${escapeHTML(user.name || "-")}</p>

                    <p><strong>Email:</strong>
                        ${escapeHTML(user.email || "-")}</p>

                    <p><strong>Phone:</strong>
                        ${escapeHTML(user.phone || "-")}</p>

                    <p><strong>Account Type:</strong>
                        ${escapeHTML(role)}</p>

                    <p><strong>Member Since:</strong>
                        ${formatDate(user.created_at)}</p>
                </div>
            `;
        }
    }

    function renderStats() {
        const stats = dashboardData.stats;

        const activeBids = dashboardData.bids.filter(bid =>
            !["ended", "cancelled", "lost", "won"].includes(
                String(bid.status || "").toLowerCase()
            )
        ).length;

        const values = {
            "#activeBidsStat":
                stats.active_bids ?? activeBids,

            "#wonAuctionsStat":
                stats.won_auctions ?? dashboardData.orders.length,

            "#watchingStat":
                stats.watching ?? dashboardData.wishlist.length,

            "#savedStat":
                stats.saved_items ?? dashboardData.wishlist.length
        };

        Object.entries(values).forEach(([selector, value]) => {
            const element = $(selector);
            if (element) element.textContent = value;
        });
    }

    // ==========================================
    // 11. CREATE BID ROW
    // ==========================================

    function createBidRow(bid) {
        const auction = bid.auction || bid;
        const itemName =
            auction.title || auction.name || "Auction Item";

        const yourBid =
            bid.amount ?? bid.bid_amount ?? bid.your_bid ?? 0;

        const currentBid =
            auction.current_bid ?? auction.currentBid ?? 0;

        const endDate =
            auction.end_time || auction.end_date || auction.ends_at;

        const status = bid.status || auction.status || "Active";

        return `
            <tr>
                <td>
                    <strong>${escapeHTML(itemName)}</strong>
                </td>

                <td>${money(yourBid)}</td>

                <td>${money(currentBid)}</td>

                <td>${timeRemaining(endDate)}</td>

                <td>
                    <span class="status-badge active">
                        ${escapeHTML(status)}
                    </span>
                </td>
            </tr>
        `;
    }

    // ==========================================
    // 12. RENDER ACTIVE BIDS
    // ==========================================

    function renderDashboardBids() {
        const container = $("#activeBidRows");

        if (!container) return;

        const bids = dashboardData.bids.slice(0, 5);

        if (!bids.length) {
            container.innerHTML = `
                <tr>
                    <td colspan="5">
                        You have no active bids yet.
                    </td>
                </tr>
            `;
            return;
        }

        container.innerHTML = bids.map(createBidRow).join("");
    }

    function renderMyBids() {
        const container = $("#myBidRows");

        if (!container) return;

        if (!dashboardData.bids.length) {
            container.innerHTML = `
                <tr>
                    <td colspan="5">No bids found.</td>
                </tr>
            `;
            return;
        }

        container.innerHTML =
            dashboardData.bids.map(createBidRow).join("");
    }

    // ==========================================
    // 13. AUCTION CARD
    // ==========================================

    function createAuctionCard(auction) {
        const id = auction.id;

        const title = auction.title || auction.name || "Auction Item";

        const image = imagePath(
            auction.image_url || auction.image,
            auction.category
        );

        const currentBid =
            auction.current_bid || auction.starting_price || 0;

        const endDate =
            auction.end_time || auction.end_date || auction.ends_at;

        return `
            <div class="auction-mini-card">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(title)}"
                    onerror="this.onerror=null;this.src='/assets/images/gramophone.jpg'"
                >

                <div class="p-3">

                    <h5>${escapeHTML(title)}</h5>

                    <p class="text-muted mb-2">
                        ${escapeHTML(auction.category || "General")}
                    </p>

                    <div class="auction-mini-price mb-2">
                        Current Bid:
                        <strong>${money(currentBid)}</strong>
                    </div>

                    <p class="small">
                        <i class="fa-regular fa-clock"></i>
                        ${timeRemaining(endDate)}
                    </p>

                    <button
                        class="mini-btn w-100"
                        data-action="bid"
                        data-id="${escapeHTML(id)}"
                        type="button">
                        Place Bid
                    </button>

                </div>
            </div>
        `;
    }

    // ==========================================
    // 14. RECOMMENDED AUCTIONS API
    // ==========================================

    async function renderRecommendations() {
        const container = $("#recommendedGrid");

        if (!container) return;

        try {
            const response = await BYI_API.request("/api/auctions");

            dashboardData.auctions =
                response.auctions || response.data || [];

            const liveAuctions = dashboardData.auctions
                .filter(auction =>
                    String(auction.status).toLowerCase() === "live"
                )
                .slice(0, 4);

            if (!liveAuctions.length) {
                container.innerHTML = `
                    <p>No live auctions available currently.</p>
                `;
                return;
            }

            container.innerHTML =
                liveAuctions.map(createAuctionCard).join("");

        } catch (error) {
            console.error("Recommendation error:", error);

            container.innerHTML = `
                <p>Unable to load recommended auctions.</p>
            `;
        }
    }

    // ==========================================
    // 15. WISHLIST
    // ==========================================

    function renderWishlist() {
        const container = $("#wishlistGrid");

        if (!container) return;

        if (!dashboardData.wishlist.length) {
            container.innerHTML = `
                <p>Your wishlist is empty.</p>
            `;
            return;
        }

        container.innerHTML = dashboardData.wishlist.map(item => {
            const auction = item.auction || item;

            return `
                <div class="auction-mini-card">

                    <img
                        src="${escapeHTML(imagePath(
                            auction.image_url || auction.image,
                            auction.category
                        ))}"
                        alt="${escapeHTML(auction.title || "Saved item")}"
                    >

                    <div class="p-3">
                        <h5>${escapeHTML(auction.title || "Auction Item")}</h5>

                        <p>
                            Current Bid:
                            <strong>${money(auction.current_bid)}</strong>
                        </p>

                        <button
                            class="mini-btn"
                            data-action="remove-wishlist"
                            data-id="${escapeHTML(auction.id)}"
                            type="button">
                            Remove
                        </button>
                    </div>

                </div>
            `;
        }).join("");
    }

    async function removeFromWishlist(auctionId) {
        try {
            await BYI_API.request(
                `/api/wishlist/${encodeURIComponent(auctionId)}`,
                { method: "DELETE" }
            );

            toast("Removed from wishlist.");

            await loadDashboard();

        } catch (error) {
            toast(error.message || "Unable to remove item.", "error");
        }
    }

    // ==========================================
    // 16. MY AUCTIONS
    // ==========================================

    function renderMyAuctions() {
        const container = $("#myAuctionsGrid");
        const empty = $("#myAuctionsEmpty");

        if (!container) return;

        if (!dashboardData.myAuctions.length) {
            container.innerHTML = "";

            if (empty) empty.style.display = "block";

            return;
        }

        if (empty) empty.style.display = "none";

        container.innerHTML =
            dashboardData.myAuctions.map(createAuctionCard).join("");
    }

    // ==========================================
    // 17. MESSAGES
    // ==========================================

    function renderMessages() {
        const container = $("#messageList");

        if (!container) return;

        if (!dashboardData.messages.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-comments"></i>
                    <h3>No Messages</h3>
                    <p>Your conversations will appear here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = dashboardData.messages.map(message => `
            <div class="p-3 border-bottom">
                <strong>
                    ${escapeHTML(
                        message.sender_name ||
                        message.name ||
                        "User"
                    )}
                </strong>

                <p class="mb-1">
                    ${escapeHTML(message.message || message.content || "")}
                </p>

                <small>${formatDate(message.created_at)}</small>
            </div>
        `).join("");
    }

    // ==========================================
    // 18. NOTIFICATIONS
    // ==========================================

    function renderNotifications() {
        const container = $("#notificationList");

        if (!container) return;

        if (!dashboardData.notifications.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-bell"></i>
                    <h3>No Notifications</h3>
                    <p>You are all caught up!</p>
                </div>
            `;
            return;
        }

        container.innerHTML =
            dashboardData.notifications.map(notification => `
                <div class="p-3 border-bottom d-flex justify-content-between gap-3">

                    <div>
                        <strong>
                            ${escapeHTML(notification.title || "Notification")}
                        </strong>

                        <p class="mb-1">
                            ${escapeHTML(notification.message || "")}
                        </p>

                        <small>
                            ${formatDate(notification.created_at)}
                        </small>
                    </div>

                    ${notification.is_read ? "" : `
                        <button
                            class="secondary-btn"
                            data-action="read-notification"
                            data-id="${escapeHTML(notification.id)}"
                            type="button">
                            Mark Read
                        </button>
                    `}

                </div>
            `).join("");
    }

    async function markNotificationRead(id) {
        try {
            await BYI_API.request(
                `/api/notifications/${encodeURIComponent(id)}/read`,
                { method: "PATCH" }
            );

            toast("Notification marked as read.");

            await loadDashboard();

        } catch (error) {
            toast(error.message || "Unable to update notification.", "error");
        }
    }

    // ==========================================
    // 19. WALLET
    // ==========================================

    function renderWallet() {
        const balance = $("#walletBalance");

        if (!balance) return;

        balance.textContent = money(
            dashboardData.stats.wallet_balance
        );
    }

    // ==========================================
    // 20. TRANSACTIONS
    // ==========================================

    function renderTransactions() {
        const container = $("#transactionRows");

        if (!container) return;

        if (!dashboardData.transactions.length) {
            container.innerHTML = `
                <tr>
                    <td colspan="5">No transactions found.</td>
                </tr>
            `;
            return;
        }

        container.innerHTML =
            dashboardData.transactions.map(transaction => `
                <tr>
                    <td>${formatDate(transaction.created_at)}</td>

                    <td>
                        ${escapeHTML(transaction.description || "-")}
                    </td>

                    <td>
                        ${escapeHTML(transaction.type || "-")}
                    </td>

                    <td>${money(transaction.amount)}</td>

                    <td>
                        ${escapeHTML(transaction.status || "-")}
                    </td>
                </tr>
            `).join("");
    }

    // ==========================================
    // 21. SIDEBAR BADGES
    // ==========================================

    function updateBadges() {
        const unreadNotifications =
            dashboardData.notifications.filter(item =>
                !item.is_read
            ).length;

        const unreadMessages =
            dashboardData.messages.filter(item =>
                !item.is_read
            ).length;

        const values = {
            "#wishlistBadge": dashboardData.wishlist.length,
            "#messageBadge": unreadMessages,
            "#notificationBadge": unreadNotifications
        };

        Object.entries(values).forEach(([selector, value]) => {
            const element = $(selector);

            if (element) {
                element.textContent = value;
            }
        });

        const dot = $("#notificationDot");

        if (dot) {
            dot.style.display =
                unreadNotifications > 0 ? "block" : "none";
        }
    }

    // ==========================================
    // 22. PLACE BID MODAL
    // ==========================================

    function openBidModal(auctionId) {
        const auction = dashboardData.auctions.find(
            item => String(item.id) === String(auctionId)
        );

        if (!auction) {
            toast("Auction not found.", "error");
            return;
        }

        selectedAuction = auction;

        const currentBid = Number(
            auction.current_bid || auction.starting_price || 0
        );

        openModal(`
            <span class="eyebrow">LIVE AUCTION</span>

            <h2>${escapeHTML(auction.title || auction.name)}</h2>

            <p>Current Bid:
                <strong>${money(currentBid)}</strong>
            </p>

            <label for="dashboardBidAmount" class="form-label">
                Enter Your Bid Amount
            </label>

            <input
                type="number"
                id="dashboardBidAmount"
                class="form-control"
                min="${currentBid + 1}"
                placeholder="Enter higher bid"
                required
            >

            <p id="dashboardBidMessage"
               class="text-danger mt-2"></p>

            <button
                id="dashboardConfirmBid"
                class="primary-btn w-100 mt-3"
                type="button">
                Place Bid
            </button>
        `);
    }

    // ==========================================
    // 23. CONFIRM BID
    // ==========================================

    async function placeBid() {
        if (!selectedAuction) return;

        const input = $("#dashboardBidAmount");
        const message = $("#dashboardBidMessage");
        const button = $("#dashboardConfirmBid");

        const amount = Number(input?.value);

        const currentBid = Number(
            selectedAuction.current_bid ||
            selectedAuction.starting_price ||
            0
        );

        if (!amount || amount <= currentBid) {
            if (message) {
                message.textContent =
                    "Your bid must be higher than the current bid.";
            }

            return;
        }

        button.disabled = true;
        button.textContent = "Placing...";

        try {
            const response = await BYI_API.request(
                `/api/auctions/${selectedAuction.id}/bids`,
                {
                    method: "POST",
                    body: { amount }
                }
            );

            toast(response.message || "Bid placed successfully.");

            closeModal();

            await loadDashboard();

        } catch (error) {
            console.error("Bid error:", error);

            if (message) {
                message.textContent = error.message;
            }

            button.disabled = false;
            button.textContent = "Place Bid";
        }
    }

    // ==========================================
    // 24. EVENT LISTENERS
    // ==========================================

    function bindEvents() {

        // Sidebar navigation

        $$(".side-link[data-section]").forEach(button => {
            button.addEventListener("click", () => {
                showSection(button.dataset.section);
            });
        });

        // Top navigation

        $$("[data-top]").forEach(button => {
            button.addEventListener("click", () => {
                navigateTop(button.dataset.top);
            });
        });

        // Menu toggle

        $("#menuToggle")?.addEventListener("click", () => {
            $("#menuToggle").closest(".topbar")
                ?.nextElementSibling
                ?.querySelector(".sidebar")
                ?.classList.toggle("open");
        });

        // Logout

        $("#logoutBtn")?.addEventListener("click", () => {
            if (confirm("Are you sure you want to logout?")) {
                BYI_API.clearSession();
                window.location.href = "../auth/login.html";
            }
        });

        // Notifications

        $("#notificationBtn")?.addEventListener("click", () => {
            showSection("notifications");
        });

        // Search auctions

        $("#searchInput")?.addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            const query = event.target.value.trim();

            if (!query) return;

            window.location.href =
                `../auctions/auctions.html?search=${encodeURIComponent(query)}`;
        });

        // Close modal

        $("#modalClose")?.addEventListener("click", closeModal);

        $("#modalBackdrop")?.addEventListener("click", event => {
            if (event.target === $("#modalBackdrop")) {
                closeModal();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closeModal();
        });

        // Dynamic buttons

        document.addEventListener("click", event => {
            const actionButton = event.target.closest("[data-action]");

            if (!actionButton) return;

            const action = actionButton.dataset.action;
            const id = actionButton.dataset.id;

            if (action === "bid") {
                openBidModal(id);
            }

            if (action === "remove-wishlist") {
                removeFromWishlist(id);
            }

            if (action === "read-notification") {
                markNotificationRead(id);
            }
        });

        // Confirm bid

        document.addEventListener("click", event => {
            if (event.target.id === "dashboardConfirmBid") {
                placeBid();
            }
        });

        // View transactions

        $("#transactionsBtn")?.addEventListener("click", () => {
            const card = $("#transactionCard");

            if (card) {
                card.style.display =
                    card.style.display === "none" ? "block" : "none";
            }
        });

        // Add funds

        $("#addFundsBtn")?.addEventListener("click", () => {
            openModal(`
                <span class="eyebrow">WALLET</span>
                <h2>Add Funds</h2>

                <p>
                    Your current balance is
                    <strong>${money(dashboardData.stats.wallet_balance)}</strong>.
                </p>

                <p>
                    Payment gateway integration is not configured yet.
                </p>
            `);
        });

        // Create auction

        $("#createAuctionBtn")?.addEventListener("click", () => {
            window.location.href =
                "../auctions/create-auction.html";
        });

        // Dark mode preference

        const darkMode = $("#darkModeToggle");

        if (darkMode) {
            darkMode.checked =
                localStorage.getItem("byi_dark_mode") === "true";

            darkMode.addEventListener("change", () => {
                localStorage.setItem(
                    "byi_dark_mode",
                    String(darkMode.checked)
                );

                document.body.classList.toggle(
                    "dark-dashboard",
                    darkMode.checked
                );

                toast("Appearance preference updated.");
            });
        }

        // Notification preferences

        ["bidAlertsToggle", "auctionReminderToggle",
         "publicProfileToggle"].forEach(id => {

            const element = document.getElementById(id);

            if (!element) return;

            const saved = localStorage.getItem("byi_" + id);

            if (saved !== null) {
                element.checked = saved === "true";
            }

            element.addEventListener("change", () => {
                localStorage.setItem(
                    "byi_" + id,
                    String(element.checked)
                );

                toast("Preference updated.");
            });
        });

        // Password

        $("#changePasswordBtn")?.addEventListener("click", () => {
            openModal(`
                <span class="eyebrow">SECURITY</span>
                <h2>Change Password</h2>
                <p>
                    Password change API is not available
                    in the current backend.
                </p>
            `);
        });

        // Delete account

        $("#deleteAccountBtn")?.addEventListener("click", () => {
            openModal(`
                <span class="eyebrow">ACCOUNT</span>
                <h2>Delete Account</h2>
                <p>
                    Account deletion requires a dedicated
                    backend endpoint.
                </p>
            `);
        });

        // Edit profile

        document.addEventListener("click", event => {
            if (event.target.closest("#editProfileBtn")) {
                openModal(`
                    <span class="eyebrow">PROFILE</span>
                    <h2>Edit Profile</h2>
                    <p>
                        Profile update API is not available
                        in the current backend.
                    </p>
                `);
            }
        });
    }

    // ==========================================
    // 25. INITIALIZE DASHBOARD
    // ==========================================

    document.addEventListener("DOMContentLoaded", () => {

        if (!checkAuthentication()) return;

        bindEvents();

        loadDashboard();

    });

})();