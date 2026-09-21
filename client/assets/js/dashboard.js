
(() => {
    "use strict";

    let dashboardData = {
        user: null,
        stats: {},
        bids: [],
        wishlist: [],
        myAuctions: [],
        notifications: [],
        messages: [],
        transactions: [],
        orders: []
    };

    let selectedAuction = null;

    const $ = (selector) => document.querySelector(selector);

    const $$ = (selector) => [...document.querySelectorAll(selector)];


    function money(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function formatDate(date) {
        if (!date) return "-";

        const d = new Date(date);

        if (Number.isNaN(d.getTime())) {
            return "-";
        }

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function timeRemaining(endAt) {
        if (!endAt) return "-";

        const end = new Date(endAt).getTime();
        const now = Date.now();

        const difference = end - now;

        if (difference <= 0) {
            return "Ended";
        }

        const totalMinutes = Math.floor(difference / 60000);

        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        if (days > 0) {
            return `${days}d ${hours}h`;
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }

        return `${minutes}m`;
    }


    function imagePath(image) {
        if (!image) {
            return "../../assets/images/watch.jpg";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("/")
        ) {
            return image;
        }

        return image.startsWith("../../")
            ? image
            : `../../${image.replace(/^\/+/, "")}`;
    }


    function getUser() {
        try {
            return JSON.parse(
                localStorage.getItem(BYI_API.userKey)
            );
        } catch {
            return null;
        }
    }

    function toast(message, type = "success") {

        const element = $("#toast");
        const messageElement = $("#toastMessage");

        if (!element || !messageElement) return;

        messageElement.textContent = message;

        element.classList.remove("show", "error");

        if (type === "error") {
            element.classList.add("error");
        }

        requestAnimationFrame(() => {
            element.classList.add("show");
        });

        setTimeout(() => {
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

    function checkAuthentication() {

        if (!BYI_API.isLoggedIn()) {
            window.location.href = "../auth/login.html";
            return false;
        }

        return true;
    }

    function showSection(sectionId) {

        const sections = $$(".dashboard-section");

        sections.forEach(section => {
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

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    document.querySelectorAll(".top-nav-link[data-top]").forEach(button => {
    button.addEventListener("click", () => {
        const page = button.dataset.top;

        switch (page) {
            case "home":
                window.location.href = "../../index.html";
                break;

            case "auctions":
                window.location.href = "../auctions/auctions.html";
                break;

            case "categories":
                window.location.href = "../categories/categories.html";
                break;
        }
    });
});

    async function loadDashboard() {

        if (!checkAuthentication()) {
            return;
        }

        try {

            const [
                dashboardResponse,
                ordersResponse
            ] = await Promise.all([
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

            renderRecommendations();

            renderActivity();

            updateBadges();


        } catch (error) {

            console.error("Dashboard loading error:", error);

            toast(
                error.message ||
                "Unable to load dashboard.",
                "error"
            );
        }
    }

    function renderUser() {

        const user = dashboardData.user;

        if (!user) return;

        const name = user.name || "User";

        const role = user.role || "buyer";

        const roleText =
            role.charAt(0).toUpperCase() +
            role.slice(1);


        const elements = {

            "#topUserName": name,

            "#topUserRole": roleText,

            "#sidebarUserName": name,

            "#welcomeUserName": name,

            "#rightUserName": name,

            "#rightUserRole":
                `${roleText} Account`,

            "#profileDisplayName": name,

            "#profileRole": roleText,

            "#profileFullName": name,

            "#profileEmail":
                user.email || "-",

            "#profilePhone":
                user.phone || "-",

            "#profileMemberSince":
                formatDate(user.created_at)

        };


        Object.entries(elements).forEach(
            ([selector, value]) => {

                const element = $(selector);

                if (element) {
                    element.textContent = value;
                }
            }
        );
    }


    function renderStats() {

        const stats = dashboardData.stats;

        const values = {

            "#activeBidsStat":
                stats.active_bids || 0,

            "#wonAuctionsStat":
                stats.won_auctions || 0,

            "#watchingStat":
                stats.watching || 0,

            "#savedStat":
                stats.saved_items || 0

        };


        Object.entries(values).forEach(
            ([selector, value]) => {

                const element = $(selector);

                if (element) {
                    element.textContent = value;
                }
            }
        );
    }


    function createBidRow(bid) {

        const status =
            bid.bid_status ||
            bid.status ||
            "outbid";


        const statusClass =
            status === "leading"
                ? "active"
                : status === "ended"
                    ? "ended"
                    : "warning";


        return `
            <tr>

                <td>

                    <div class="table-item">

                        <img
                            src="${escapeHTML(imagePath(bid.img))}"
                            alt="${escapeHTML(bid.name)}">

                        <div>

                            <strong>
                                ${escapeHTML(bid.name)}
                            </strong>

                            <small>
                                ${escapeHTML(bid.category || "Auction")}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${money(bid.your)}
                </td>


                <td>
                    ${money(bid.current)}
                </td>


                <td>
                    ${timeRemaining(bid.end_at)}
                </td>


                <td>

                    <span
                        class="status-badge ${statusClass}">

                        ${
                            status === "leading"
                                ? "Leading"
                                : status === "ended"
                                    ? "Ended"
                                    : "Outbid"
                        }

                    </span>

                </td>

            </tr>
        `;
    }



    function renderDashboardBids() {

        const container = $("#dashboardRows");

        if (!container) return;


        const activeBids =
            dashboardData.bids
                .filter(bid => {

                    return (
                        bid.auction_status === "live" &&
                        new Date(bid.end_at).getTime() > Date.now()
                    );
                })
                .slice(0, 5);


        if (!activeBids.length) {

            container.innerHTML = `
                <tr>
                    <td colspan="5">
                        You don't have any active bids.
                    </td>
                </tr>
            `;

            return;
        }


        container.innerHTML =
            activeBids.map(createBidRow).join("");
    }



    function renderMyBids() {

        const container = $("#myBidsGrid");

        if (!container) return;


        if (!dashboardData.bids.length) {

            container.innerHTML = `
                <tr>
                    <td colspan="5">
                        You haven't placed any bids yet.
                    </td>
                </tr>
            `;

            return;
        }


        container.innerHTML =
            dashboardData.bids
                .map(createBidRow)
                .join("");
    }



    async function renderRecommendations() {

        const container = $("#recommendGrid");

        if (!container) return;


        try {

            const response =
                await BYI_API.request(
                    "/api/auctions"
                );


            const auctions =
                response.auctions ||
                response.data ||
                [];


            const liveAuctions =
                auctions
                    .filter(auction =>
                        auction.status === "live"
                    )
                    .slice(0, 3);


            if (!liveAuctions.length) {

                container.innerHTML = `
                    <p>No live auctions available.</p>
                `;

                return;
            }


            container.innerHTML =
                liveAuctions
                    .map(createAuctionCard)
                    .join("");


        } catch (error) {

            console.error(
                "Recommendation error:",
                error
            );

            container.innerHTML = `
                <p>Unable to load recommendations.</p>
            `;
        }
    }


    function createAuctionCard(auction) {

        return `
            <article
                class="auction-mini-card"
                data-auction-id="${auction.id}">

                <div class="auction-mini-image">

                    <img
                        src="${escapeHTML(imagePath(auction.image_url || auction.img))}"
                        alt="${escapeHTML(auction.title || auction.name)}">

                    <span class="live-badge">
                        Live
                    </span>

                </div>


                <div class="auction-mini-content">

                    <span class="category-label">
                        ${escapeHTML(auction.category || "Auction")}
                    </span>

                    <h3>
                        ${escapeHTML(auction.title || auction.name)}
                    </h3>


                    <div class="auction-mini-price">

                        <span>
                            Current Bid
                        </span>

                        <strong>
                            ${money(
                                auction.current_bid ||
                                auction.current
                            )}
                        </strong>

                    </div>


                    <button
                        type="button"
                        class="mini-btn"
                        data-bid-auction="${auction.id}">

                        Place Bid

                    </button>

                </div>

            </article>
        `;
    }



    function renderWishlist() {

        const container = $("#wishlistGrid");

        if (!container) return;


        if (!dashboardData.wishlist.length) {

            container.innerHTML = `
                <div class="content-card">
                    <div class="empty-state">

                        <div class="empty-icon">
                            <i class="fa-regular fa-heart"></i>
                        </div>

                        <h2>Your Wishlist Is Empty</h2>

                        <p>
                            Save auctions you want to watch later.
                        </p>

                    </div>
                </div>
            `;

            return;
        }


        container.innerHTML =
            dashboardData.wishlist
                .map(item => `

                    <article
                        class="auction-mini-card"
                        data-auction-id="${item.id}">

                        <div class="auction-mini-image">

                            <img
                                src="${escapeHTML(imagePath(item.img))}"
                                alt="${escapeHTML(item.name)}">

                        </div>


                        <div class="auction-mini-content">

                            <span class="category-label">
                                ${escapeHTML(item.category || "Auction")}
                            </span>

                            <h3>
                                ${escapeHTML(item.name)}
                            </h3>


                            <div class="auction-mini-price">

                                <span>
                                    Current Bid
                                </span>

                                <strong>
                                    ${money(item.current)}
                                </strong>

                            </div>


                            <button
                                type="button"
                                class="mini-btn"
                                data-view-auction="${item.id}">

                                View Auction

                            </button>


                            <button
                                type="button"
                                class="secondary-btn"
                                data-remove-wishlist="${item.id}">

                                Remove

                            </button>

                        </div>

                    </article>

                `)
                .join("");
    }



    function renderMyAuctions() {

        const container = $("#myAuctionsGrid");

        const empty = $("#myAuctionsEmpty");

        if (!container) return;


        if (!dashboardData.myAuctions.length) {

            container.innerHTML = "";

            if (empty) {
                empty.style.display = "";
            }

            return;
        }


        if (empty) {
            empty.style.display = "none";
        }


        container.innerHTML =
            dashboardData.myAuctions
                .map(auction => `

                    <article
                        class="auction-mini-card">

                        <div class="auction-mini-image">

                            <img
                                src="${escapeHTML(imagePath(auction.image_url))}"
                                alt="${escapeHTML(auction.title)}">

                        </div>


                        <div class="auction-mini-content">

                            <span class="category-label">
                                ${escapeHTML(auction.category)}
                            </span>

                            <h3>
                                ${escapeHTML(auction.title)}
                            </h3>


                            <div class="auction-mini-price">

                                <span>
                                    Current Bid
                                </span>

                                <strong>
                                    ${money(auction.current_bid)}
                                </strong>

                            </div>


                            <small>
                                ${Number(auction.bid_count || 0)}
                                bid(s)
                            </small>

                        </div>

                    </article>

                `)
                .join("");
    }


    function renderMessages() {

        const container = $("#messageList");

        if (!container) return;


        if (!dashboardData.messages.length) {

            container.innerHTML = `
                <p>No messages yet.</p>
            `;

            return;
        }


        container.innerHTML =
            dashboardData.messages
                .map(message => `

                    <div class="message-item">

                        <div class="message-avatar">

                            <i class="fa-solid fa-user"></i>

                        </div>


                        <div class="message-content">

                            <strong>
                                ${escapeHTML(
                                    message.sender_name ||
                                    "User"
                                )}
                            </strong>

                            <p>
                                ${escapeHTML(
                                    message.body
                                )}
                            </p>

                            <small>
                                ${formatDate(message.created_at)}
                            </small>

                        </div>


                        ${
                            Number(message.is_read) === 0
                                ? `<span class="unread-dot"></span>`
                                : ""
                        }

                    </div>

                `)
                .join("");
    }



    function renderNotifications() {

        const container = $("#notificationList");

        if (!container) return;


        if (!dashboardData.notifications.length) {

            container.innerHTML = `
                <p>No notifications yet.</p>
            `;

            return;
        }


        container.innerHTML =
            dashboardData.notifications
                .map(notification => `

                    <div
                        class="notification-item ${
                            Number(notification.is_read) === 0
                                ? "unread"
                                : ""
                        }"
                        data-notification-id="${notification.id}">

                        <div class="notification-icon">

                            <i class="fa-solid fa-bell"></i>

                        </div>


                        <div>

                            <strong>
                                ${escapeHTML(notification.title)}
                            </strong>

                            <p>
                                ${escapeHTML(notification.message)}
                            </p>

                            <small>
                                ${formatDate(notification.created_at)}
                            </small>

                        </div>

                    </div>

                `)
                .join("");
    }



    function renderWallet() {

        const balance =
            dashboardData.stats.wallet_balance || 0;

        const element = $("#walletBalance");

        if (element) {
            element.textContent = money(balance);
        }
    }



    function renderTransactions() {

        const container = $("#transactionRows");

        if (!container) return;


        if (!dashboardData.transactions.length) {

            container.innerHTML = `
                <tr>
                    <td colspan="5">
                        No transactions found.
                    </td>
                </tr>
            `;

            return;
        }


        container.innerHTML =
            dashboardData.transactions
                .map(transaction => {

                    const credit =
                        transaction.type === "credit";


                    return `
                        <tr>

                            <td>
                                ${formatDate(
                                    transaction.created_at
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    transaction.description ||
                                    "Wallet transaction"
                                )}
                            </td>

                            <td>
                                ${credit
                                    ? "Credit"
                                    : "Debit"}
                            </td>

                            <td>
                                ${credit ? "+" : "-"}
                                ${money(transaction.amount)}
                            </td>

                            <td>
                                ${escapeHTML(
                                    transaction.status
                                )}
                            </td>

                        </tr>
                    `;
                })
                .join("");
    }



    function renderActivity() {

        const container = $("#activityList");

        if (!container) return;


        const activity = [];


        dashboardData.bids.slice(0, 3)
            .forEach(bid => {

                activity.push({
                    icon: "fa-gavel",
                    title: "Placed a bid",
                    item: bid.name,
                    date: bid.created_at || bid.end_at
                });

            });


        dashboardData.wishlist.slice(0, 2)
            .forEach(item => {

                activity.push({
                    icon: "fa-heart",
                    title: "Added to wishlist",
                    item: item.name,
                    date: item.created_at
                });

            });


        if (!activity.length) {

            container.innerHTML =
                "<p>No recent activity.</p>";

            return;
        }


        container.innerHTML =
            activity.slice(0, 5)
                .map(item => `

                    <div class="activity-item">

                        <div class="activity-icon">

                            <i class="fa-solid ${item.icon}"></i>

                        </div>

                        <div>

                            <strong>
                                ${escapeHTML(item.title)}
                            </strong>

                            <p>
                                ${escapeHTML(item.item)}
                            </p>

                            <small>
                                ${formatDate(item.date)}
                            </small>

                        </div>

                    </div>

                `)
                .join("");
    }



    function updateBadges() {

        const unreadNotifications =
            dashboardData.notifications
                .filter(item =>
                    Number(item.is_read) === 0
                ).length;


        const unreadMessages =
            dashboardData.messages
                .filter(item =>
                    Number(item.is_read) === 0
                ).length;


        const wishlistCount =
            dashboardData.wishlist.length;


        const notificationBadge =
            $("#notificationBadge");

        const messageBadge =
            $("#messageBadge");

        const wishlistBadge =
            $("#wishlistBadge");


        if (notificationBadge) {
            notificationBadge.textContent =
                unreadNotifications;
        }


        if (messageBadge) {
            messageBadge.textContent =
                unreadMessages;
        }


        if (wishlistBadge) {
            wishlistBadge.textContent =
                wishlistCount;
        }


        const notificationDot =
            $("#notificationDot");

        if (notificationDot) {

            notificationDot.style.display =
                unreadNotifications > 0
                    ? ""
                    : "none";
        }


        const quickMessage =
            $("#quickMessageText");

        if (quickMessage) {

            quickMessage.textContent =
                unreadMessages > 0
                    ? `${unreadMessages} unread message${unreadMessages > 1 ? "s" : ""}`
                    : "No unread messages";
        }
    }



    function openBidModal(auctionId) {

        const auction =
            dashboardData.bids.find(
                item => Number(item.id) === Number(auctionId)
            ) ||
            dashboardData.wishlist.find(
                item => Number(item.id) === Number(auctionId)
            );


        selectedAuction = auction || {
            id: auctionId
        };


        openModal(`

            <div class="bid-modal-content">

                <span class="eyebrow">
                    PLACE YOUR BID
                </span>

                <h2>
                    ${escapeHTML(
                        auction?.name ||
                        "Place Bid"
                    )}
                </h2>

                <p>
                    Current bid:
                    <strong>
                        ${money(auction?.current || 0)}
                    </strong>
                </p>

                <input
                    type="number"
                    id="dashboardBidAmount"
                    min="1"
                    step="1"
                    placeholder="Enter your bid">

                <button
                    type="button"
                    class="primary-btn"
                    id="dashboardConfirmBid">

                    Place Bid

                </button>

                <p id="dashboardBidMessage"></p>

            </div>

        `);
    }


    async function submitBid() {

        if (!selectedAuction) {
            return;
        }


        const input =
            $("#dashboardBidAmount");

        const message =
            $("#dashboardBidMessage");


        const amount =
            Number(input?.value);


        const current =
            Number(
                selectedAuction.current ||
                0
            );


        if (!amount || amount <= current) {

            if (message) {
                message.textContent =
                    `Bid must be higher than ${money(current)}.`;
            }

            return;
        }


        const confirmButton =
            $("#dashboardConfirmBid");


        if (confirmButton) {
            confirmButton.disabled = true;
            confirmButton.textContent = "Placing...";
        }


        try {

            const response =
                await BYI_API.request(
                    `/api/auctions/${selectedAuction.id}/bids`,
                    {
                        method: "POST",
                        body: {
                            amount
                        }
                    }
                );


            toast(
                response.message ||
                "Bid placed successfully."
            );


            closeModal();

            await loadDashboard();


        } catch (error) {

            console.error(
                "Bid error:",
                error
            );


            if (message) {
                message.textContent =
                    error.message;
            }


            if (confirmButton) {

                confirmButton.disabled = false;

                confirmButton.textContent =
                    "Place Bid";
            }
        }
    }


    async function removeFromWishlist(auctionId) {

        try {

            await BYI_API.request(
                `/api/wishlist/${auctionId}`,
                {
                    method: "DELETE"
                }
            );


            toast(
                "Removed from wishlist."
            );


            await loadDashboard();


        } catch (error) {

            toast(
                error.message ||
                "Unable to remove item.",
                "error"
            );
        }
    }



    async function markNotificationRead(id) {

        try {

            await BYI_API.request(
                `/api/notifications/${id}/read`,
                {
                    method: "PATCH"
                }
            );


            const notification =
                dashboardData.notifications.find(
                    item =>
                        Number(item.id) === Number(id)
                );


            if (notification) {
                notification.is_read = 1;
            }


            renderNotifications();

            updateBadges();


        } catch (error) {

            console.error(
                "Notification error:",
                error
            );
        }
    }



    function bindEvents() {

        
        document.addEventListener(
            "click",
            event => {

                const sectionButton =
                    event.target.closest(
                        "[data-section]"
                    );


                if (sectionButton) {

                    const section =
                        sectionButton.dataset.section;

                    if (section) {
                        showSection(section);
                    }

                    return;
                }


                const topButton =
                    event.target.closest(
                        "[data-top]"
                    );


                if (topButton) {

                    navigateTop(
                        topButton.dataset.top
                    );

                    return;
                }


                const bidButton =
                    event.target.closest(
                        "[data-bid-auction]"
                    );


                if (bidButton) {

                    openBidModal(
                        bidButton.dataset.bidAuction
                    );

                    return;
                }


                const removeButton =
                    event.target.closest(
                        "[data-remove-wishlist]"
                    );


                if (removeButton) {

                    removeFromWishlist(
                        removeButton.dataset.removeWishlist
                    );

                    return;
                }


                const notification =
                    event.target.closest(
                        "[data-notification-id]"
                    );


                if (notification) {

                    markNotificationRead(
                        notification.dataset.notificationId
                    );

                    return;
                }


                const viewButton =
                    event.target.closest(
                        "[data-view-auction]"
                    );


                if (viewButton) {

                    window.location.href =
                        `../auctions/auction-details.html?id=${encodeURIComponent(
                            viewButton.dataset.viewAuction
                        )}`;
                }

            }
        );


       
        document.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "#dashboardConfirmBid"
                    )
                ) {

                    submitBid();
                }

            }
        );


    
        $("#modalClose")?.addEventListener(
            "click",
            closeModal
        );


        $("#modalBackdrop")?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#modalBackdrop")
                ) {
                    closeModal();
                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {
                    closeModal();
                }

            }
        );


        
        $("#logoutBtn")?.addEventListener(
            "click",
            () => {

                BYI_API.clearSession();

                window.location.href =
                    "../auth/login.html";
            }
        );


       
        $("#notificationBtn")?.addEventListener(
            "click",
            () => {

                showSection(
                    "notifications"
                );

            }
        );


       
        $("#transactionsBtn")?.addEventListener(
            "click",
            () => {

                const card =
                    $("#transactionCard");

                if (!card) return;

                card.style.display =
                    card.style.display === "none"
                        ? ""
                        : "none";
            }
        );


       
        $("#addFundsBtn")?.addEventListener(
            "click",
            () => {

                openModal(`

                    <div>

                        <span class="eyebrow">
                            WALLET
                        </span>

                        <h2>
                            Add Funds
                        </h2>

                        <p>
                            Payment gateway integration
                            is not configured yet.
                        </p>

                        <p>
                            Your current wallet balance is
                            <strong>
                                ${money(
                                    dashboardData.stats.wallet_balance
                                )}
                            </strong>.
                        </p>

                    </div>

                `);

            }
        );


       
        $("#createAuctionBtn")?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../auctions/create-auction.html";

            }
        );


      
        $("#menuToggle")?.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "sidebar-open"
                );

            }
        );


      
        $("#searchInput")?.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter"
                ) {
                    return;
                }


                const query =
                    event.target.value.trim();


                if (!query) {
                    return;
                }


                window.location.href =
                    `../auctions/auctions.html?search=${encodeURIComponent(
                        query
                    )}`;
            }
        );


       
        const darkMode =
            $("#darkModeToggle");


        if (darkMode) {

            const saved =
                localStorage.getItem(
                    "byi_dark_mode"
                );

            darkMode.checked =
                saved === "true";


            darkMode.addEventListener(
                "change",
                () => {

                    localStorage.setItem(
                        "byi_dark_mode",
                        String(darkMode.checked)
                    );

                    toast(
                        darkMode.checked
                            ? "Dark mode enabled."
                            : "Dark mode preference updated."
                    );

                }
            );
        }


        $("#changePasswordBtn")?.addEventListener(
            "click",
            () => {

                openModal(`

                    <div>

                        <span class="eyebrow">
                            SECURITY
                        </span>

                        <h2>
                            Change Password
                        </h2>

                        <p>
                            Password change API is not
                            available in the current backend.
                        </p>

                    </div>

                `);

            }
        );


        $("#deleteAccountBtn")?.addEventListener(
            "click",
            () => {

                openModal(`

                    <div>

                        <span class="eyebrow">
                            ACCOUNT
                        </span>

                        <h2>
                            Delete Account
                        </h2>

                        <p>
                            Account deletion is disabled
                            until a dedicated backend
                            endpoint is implemented.
                        </p>

                    </div>

                `);

            }
        );


        $("#editProfileBtn")?.addEventListener(
            "click",
            () => {

                openModal(`

                    <div>

                        <span class="eyebrow">
                            PROFILE
                        </span>

                        <h2>
                            Profile Editing
                        </h2>

                        <p>
                            Your profile information is
                            currently loaded from the database.
                            A profile update endpoint is not
                            available in the current backend.
                        </p>

                    </div>

                `);

            }
        );
    }


    document.addEventListener(
        "DOMContentLoaded",
        () => {

            if (!checkAuthentication()) {
                return;
            }

            bindEvents();

            loadDashboard();

        }
    );

})();
function navigateTop(page) {
    switch (page) {
        case "home":
            window.location.href = "/";
            break;

        case "auctions":
            window.location.href = "/pages/auctions/auctions.html";
            break;

        case "categories":
            window.location.href = "/pages/categories/categories.html";
            break;
    }
}
document.querySelectorAll(".top-nav-link[data-top]").forEach(button => {
    button.addEventListener("click", () => {
        navigateTop(button.dataset.top);
    });
});