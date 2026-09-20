const auctions = [
    {
        id: 1,
        name: "Luxury Wrist Watch",
        cat: "Fashion",
        current: 42000,
        your: 40000,
        time: "02:15:30",
        status: "leading",
        img: "../../assets/images/watch.jpg",
        desc: "Premium luxury wrist watch with a classic stainless-steel finish."
    },
    {
        id: 2,
        name: "Vintage Camera",
        cat: "Electronics",
        current: 21000,
        your: 20000,
        time: "01:40:12",
        status: "outbid",
        img: "../../assets/images/camera.jpg",
        desc: "Classic vintage camera in excellent collectible condition."
    },
    {
        id: 3,
        name: "Antique Wooden Chair",
        cat: "Furniture",
        current: 12800,
        your: 12800,
        time: "03:20:45",
        status: "leading",
        img: "../../assets/images/chair.jpg",
        desc: "Beautiful handcrafted antique wooden chair with timeless detailing."
    },
    {
        id: 4,
        name: "Diamond Necklace",
        cat: "Jewellery",
        current: 73000,
        your: 70000,
        time: "00:50:10",
        status: "outbid",
        img: "../../assets/images/necklace.jpg",
        desc: "Elegant diamond necklace presented in a premium jewellery case."
    },
    {
        id: 5,
        name: "Classic Painting",
        cat: "Art & Collectibles",
        current: 60000,
        your: 60000,
        time: "2h left",
        status: "leading",
        img: "../../assets/images/painting.jpg",
        desc: "A decorative classic painting suitable for collectors and art lovers."
    },
    {
        id: 6,
        name: "Vintage Car Model",
        cat: "Collectibles",
        current: 28500,
        your: 25000,
        time: "5h left",
        status: "outbid",
        img: "../../assets/images/car.jpg",
        desc: "Detailed vintage automobile collectible model."
    },
    {
        id: 7,
        name: "Leather Handbag",
        cat: "Fashion",
        current: 18000,
        your: 15000,
        time: "1h left",
        status: "leading",
        img: "../../assets/images/handbag.jpg",
        desc: "Premium leather handbag with a timeless everyday design."
    },
    {
        id: 8,
        name: "Gramophone",
        cat: "Electronics",
        current: 32000,
        your: 28000,
        time: "4h left",
        status: "leading",
        img: "../../assets/images/gramophone.jpg",
        desc: "Classic gramophone collectible with vintage character."
    }
];

let wishlist = new Set([5, 6, 7, 8]);
let currentFilter = "all";

let profile = {
    name: "Rohak",
    email: "rohak@example.com",
    phone: "+91 98765 43210",
    location: "Hyderabad, India",
    address: "Madhapur, Hyderabad"
};

const $ = selector => document.querySelector(selector);

const $$ = selector => [...document.querySelectorAll(selector)];

const money = value => "₹" + Number(value).toLocaleString("en-IN");

function toast(message) {
    const toastBox = $("#toast");
    const toastMessage = $("#toastMessage");

    if (!toastBox) {
        return;
    }

    if (toastMessage) {
        toastMessage.textContent = message;
    } else {
        toastBox.textContent = message;
    }

    toastBox.classList.add("show");

    clearTimeout(window.dashboardToastTimer);

    window.dashboardToastTimer = setTimeout(() => {
        toastBox.classList.remove("show");
    }, 2500);
}

function openModal(content) {
    const backdrop = $("#modalBackdrop");
    const modal = backdrop?.querySelector(".custom-modal");
    const modalContent = $("#modalContent");

    if (!backdrop || !modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = content;

    backdrop.style.display = "flex";
    backdrop.style.opacity = "1";
    backdrop.style.visibility = "visible";
    backdrop.style.background = "rgba(8, 4, 2, 0.92)";
    backdrop.style.filter = "none";
    backdrop.style.backdropFilter = "none";
    backdrop.style.webkitBackdropFilter = "none";

    modal.style.display = "block";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
    modal.style.background = "#211008";
    modal.style.backgroundColor = "#211008";
    modal.style.filter = "none";
    modal.style.backdropFilter = "none";
    modal.style.webkitBackdropFilter = "none";

    modalContent.style.display = "block";
    modalContent.style.opacity = "1";
    modalContent.style.visibility = "visible";
    modalContent.style.background = "#211008";
    modalContent.style.backgroundColor = "#211008";
    modalContent.style.filter = "none";

    modalContent.querySelectorAll("*").forEach(element => {
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.filter = "none";
    });

    backdrop.classList.add("show");
    document.body.classList.add("modal-open");
}

function closeModal() {
    const backdrop = $("#modalBackdrop");

    if (!backdrop) {
        return;
    }

    backdrop.classList.remove("show");
    backdrop.style.display = "none";

    document.body.classList.remove("modal-open");
}

function navigateTop(target) {
    if (target === "home") {
        window.location.href = "../../index.html";
        return;
    }

    if (target === "auctions") {
        window.location.href = "../../index.html#trending-auctions";
        return;
    }

    if (target === "categories") {
        window.location.href = "../../index.html#categories";
        return;
    }

    if (target === "help") {
        window.location.href = "../help/help-support.html";
    }
}

function showSection(id) {
    const section = document.getElementById(id);

    if (!section) {
        return;
    }

    $$(".dashboard-section").forEach(item => {
        item.classList.remove("active-section");
    });

    section.classList.add("active-section");

    $$(".side-link[data-section]").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.section === id
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updateProfileUI() {
    const values = {
        "#profileName": profile.name,
        "#profileEmail": profile.email,
        "#profilePhone": profile.phone,
        "#profileLocation": profile.location,
        "#profileAddress": profile.address
    };

    Object.entries(values).forEach(([selector, value]) => {
        const element = $(selector);

        if (element) {
            element.textContent = value;
        }
    });

    $$(".user-mini-info strong").forEach(element => {
        element.textContent = profile.name;
    });

    const sidebarName = $(".sidebar-profile strong");

    if (sidebarName) {
        sidebarName.textContent = profile.name;
    }

    const rightName = $(".right-user-card h3");

    if (rightName) {
        rightName.textContent = profile.name;
    }
}

function updateCounts() {
    const savedStat = $("#savedStat");
    const overviewWish = $("#overviewWish");

    if (savedStat) {
        savedStat.textContent = wishlist.size;
    }

    if (overviewWish) {
        overviewWish.textContent = wishlist.size;
    }

    const wishlistBadge = document.querySelector(
        '[data-section="wishlist"] .side-badge'
    );

    if (wishlistBadge) {
        wishlistBadge.textContent = wishlist.size;
    }
}

function imageError(image) {
    if (!image) {
        return;
    }

    image.onerror = null;
    image.src = "../../assets/images/watch.jpg";
}

function statusText(status) {
    if (status === "leading") {
        return "Leading";
    }

    if (status === "outbid") {
        return "Outbid";
    }

    return "Ended";
}

function toggleWishlist(id) {
    if (wishlist.has(id)) {
        wishlist.delete(id);
        toast("Removed from Watching");
    } else {
        wishlist.add(id);
        toast("Added to Watching");
    }

    renderAll();
    bindDynamicButtons();
}

function createMiniCard(auction) {
    const saved = wishlist.has(auction.id);

    return `
        <article class="auction-mini-card">
            <div class="auction-mini-image">
                <img
                    src="${auction.img}"
                    alt="${auction.name}"
                    onerror="imageError(this)"
                >
                <span class="live-badge">Live Now</span>
            </div>

            <div class="auction-mini-content">
                <span class="category-label">${auction.cat}</span>

                <h4>${auction.name}</h4>

                <div class="auction-mini-price">
                    <div>
                        <span>Current bid</span>
                        <strong>${money(auction.current)}</strong>
                    </div>

                    <button
                        class="mini-btn"
                        data-bid="${auction.id}">
                        Bid Now
                    </button>
                </div>

                <button
                    class="mini-btn wishlist-mini-btn"
                    data-heart="${auction.id}">
                    ${saved ? "♥ Watching" : "♡ Watch"}
                </button>
            </div>
        </article>
    `;
}

function renderDashboard() {
    const container = $("#dashboardRows");

    if (!container) {
        return;
    }

    container.innerHTML = auctions
        .slice(0, 4)
        .map(auction => `
            <tr>
                <td>
                    <div class="table-item">
                        <img
                            src="${auction.img}"
                            alt="${auction.name}"
                            onerror="imageError(this)"
                        >

                        <div>
                            <strong>${auction.name}</strong>
                            <small>${auction.cat}</small>
                        </div>
                    </div>
                </td>

                <td>${money(auction.current)}</td>

                <td>${money(auction.your)}</td>

                <td>${auction.time}</td>

                <td>
                    <span class="status-badge ${auction.status === "leading" ? "active" : "warning"}">
                        ${statusText(auction.status)}
                    </span>
                </td>

                <td>
                    <button
                        class="mini-btn"
                        data-details="${auction.id}">
                        View
                    </button>
                </td>
            </tr>
        `)
        .join("");
}

function renderRecommendations() {
    const container = $("#recommendGrid");

    if (!container) {
        return;
    }

    container.innerHTML = auctions
        .slice(4, 7)
        .map(createMiniCard)
        .join("");
}

function renderMyBids() {
    const container = $("#myBidsGrid");

    if (!container) {
        return;
    }

    let list = auctions;

    if (currentFilter !== "all") {
        list = auctions.filter(
            auction => auction.status === currentFilter
        );
    }

    if (!list.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fa-solid fa-gavel"></i>
                </div>

                <h3>No bids found</h3>

                <p>Try another filter.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>ITEM</th>
                        <th>CURRENT BID</th>
                        <th>YOUR BID</th>
                        <th>TIME LEFT</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                    </tr>
                </thead>

                <tbody>
                    ${list.map(auction => `
                        <tr>
                            <td>
                                <div class="table-item">
                                    <img
                                        src="${auction.img}"
                                        alt="${auction.name}"
                                        onerror="imageError(this)"
                                    >

                                    <div>
                                        <strong>${auction.name}</strong>
                                        <small>${auction.cat}</small>
                                    </div>
                                </div>
                            </td>

                            <td>${money(auction.current)}</td>

                            <td>${money(auction.your)}</td>

                            <td>${auction.time}</td>

                            <td>
                                <span class="status-badge ${auction.status === "leading" ? "active" : "warning"}">
                                    ${statusText(auction.status)}
                                </span>
                            </td>

                            <td>
                                <button
                                    class="mini-btn"
                                    data-editbid="${auction.id}">
                                    Edit
                                </button>

                                <button
                                    class="mini-btn"
                                    data-details="${auction.id}">
                                    Details
                                </button>

                                <button
                                    class="mini-btn"
                                    data-removebid="${auction.id}">
                                    Remove
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function renderWishlist() {
    const container = $("#wishlistGrid");

    if (!container) {
        return;
    }

    const list = auctions.filter(
        auction => wishlist.has(auction.id)
    );

    if (!list.length) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fa-regular fa-heart"></i>
                </div>

                <h3>Nothing in your wishlist</h3>

                <p>
                    Tap the heart or Watch button on an auction
                    to save it here.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = list
        .map(createMiniCard)
        .join("");
}

function renderNotifications() {
    const container = $("#notificationList");

    if (!container) {
        return;
    }

    const notifications = [
        {
            icon: "fa-solid fa-gavel",
            title: "You have been outbid",
            text: "Someone placed a higher bid on Vintage Camera.",
            time: "2 minutes ago",
            unread: true
        },
        {
            icon: "fa-solid fa-trophy",
            title: "Congratulations!",
            text: "You won the Antique Wooden Chair auction.",
            time: "1 hour ago",
            unread: true
        },
        {
            icon: "fa-regular fa-clock",
            title: "Auction ending soon",
            text: "Diamond Necklace ends in less than an hour.",
            time: "3 hours ago",
            unread: true
        },
        {
            icon: "fa-regular fa-heart",
            title: "Watching update",
            text: "A saved item has received a new bid.",
            time: "Yesterday",
            unread: false
        }
    ];

    container.innerHTML = notifications
        .map(notification => `
            <div class="notification-item ${notification.unread ? "unread" : ""}">
                <div class="notification-icon">
                    <i class="${notification.icon}"></i>
                </div>

                <div>
                    <strong>${notification.title}</strong>
                    <p>${notification.text}</p>
                    <small>${notification.time}</small>
                </div>
            </div>
        `)
        .join("");
}

function renderAll() {
    renderDashboard();
    renderRecommendations();
    renderMyBids();
    renderWishlist();
    renderNotifications();
    updateCounts();
    updateProfileUI();
}

function showAuctionDetails(id) {
    const auction = auctions.find(
        item => item.id === id
    );

    if (!auction) {
        return;
    }

    const saved = wishlist.has(id);

    openModal(`
        <div class="auction-modal-content">
            <div class="modal-item-header">
                <span class="category-label">${auction.cat}</span>

                <h2>${auction.name}</h2>
            </div>

            <img
                class="modal-auction-image"
                src="${auction.img}"
                alt="${auction.name}"
                onerror="imageError(this)"
            >

            <div class="modal-item-info">
                <p>${auction.desc}</p>

                <div class="modal-price-box">
                    <span>Current bid</span>
                    <strong>${money(auction.current)}</strong>
                </div>

                <div class="modal-time-box">
                    <span>Time left</span>
                    <strong>${auction.time}</strong>
                </div>
            </div>

            <div class="modal-actions">
                <button
                    class="secondary-btn"
                    id="modalWish">
                    ${saved ? "♥ Watching" : "♡ Add to Watching"}
                </button>

                <button
                    class="primary-btn"
                    id="modalBid">
                    <i class="fa-solid fa-gavel"></i>
                    Place Bid
                </button>
            </div>
        </div>
    `);

    $("#modalWish")?.addEventListener("click", () => {
        toggleWishlist(id);
        closeModal();
    });

    $("#modalBid")?.addEventListener("click", () => {
        closeModal();
        placeBid(id);
    });
}

function placeBid(id) {
    const auction = auctions.find(
        item => item.id === id
    );

    if (!auction) {
        return;
    }

    const minimum = auction.current + 100;

    openModal(`
        <div class="modal-form-content">
            <h2>Place Bid</h2>

            <p>${auction.name}</p>

            <div class="modal-price-box">
                <span>Current bid</span>
                <strong>${money(auction.current)}</strong>
            </div>

            <div class="form-group">
                <label for="newBid">Your bid amount</label>

                <input
                    id="newBid"
                    type="number"
                    min="${minimum}"
                    value="${minimum}"
                >
            </div>

            <div class="modal-actions">
                <button
                    class="secondary-btn"
                    id="cancelBid">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    id="confirmBid">
                    Confirm Bid
                </button>
            </div>
        </div>
    `);

    $("#cancelBid")?.addEventListener(
        "click",
        closeModal
    );

    $("#confirmBid")?.addEventListener(
        "click",
        () => {
            const value = Number(
                $("#newBid")?.value
            );

            if (!Number.isFinite(value) || value < minimum) {
                toast(
                    `Your bid must be at least ${money(minimum)}`
                );
                return;
            }

            auction.your = value;
            auction.current = value;
            auction.status = "leading";

            closeModal();
            renderAll();
            bindDynamicButtons();

            toast("Bid placed successfully");
        }
    );
}

function editBid(id) {
    const auction = auctions.find(
        item => item.id === id
    );

    if (!auction) {
        return;
    }

    const minimum =
        auction.status === "outbid"
            ? auction.current + 100
            : auction.your;

    openModal(`
        <div class="modal-form-content">
            <h2>Edit Your Bid</h2>

            <p>${auction.name}</p>

            <div class="form-group">
                <label for="editBidValue">
                    Bid amount
                </label>

                <input
                    id="editBidValue"
                    type="number"
                    min="${minimum}"
                    value="${auction.your}"
                >
            </div>

            <div class="modal-actions">
                <button
                    class="secondary-btn"
                    id="cancelEdit">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    id="saveBid">
                    Save Bid
                </button>
            </div>
        </div>
    `);

    $("#cancelEdit")?.addEventListener(
        "click",
        closeModal
    );

    $("#saveBid")?.addEventListener(
        "click",
        () => {
            const value = Number(
                $("#editBidValue")?.value
            );

            if (!Number.isFinite(value) || value <= 0) {
                toast("Enter a valid bid amount");
                return;
            }

            if (
                auction.status === "outbid" &&
                value <= auction.current
            ) {
                toast(
                    `Your bid must be above ${money(auction.current)}`
                );
                return;
            }

            auction.your = value;

            if (value >= auction.current) {
                auction.current = value;
                auction.status = "leading";
            }

            closeModal();
            renderAll();
            bindDynamicButtons();

            toast("Bid updated successfully");
        }
    );
}

function removeBid(id) {
    const auction = auctions.find(
        item => item.id === id
    );

    if (!auction) {
        return;
    }

    const confirmed = window.confirm(
        `Remove "${auction.name}" from My Bids?`
    );

    if (!confirmed) {
        return;
    }

    auction.status = "ended";

    renderAll();
    bindDynamicButtons();

    toast("Bid removed");
}

function editProfile() {
    openModal(`
        <div class="modal-form-content">
            <h2>Edit Profile</h2>

            <div class="form-grid">
                <div class="form-group">
                    <label>Full name</label>
                    <input
                        id="fName"
                        value="${profile.name}"
                    >
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input
                        id="fEmail"
                        value="${profile.email}"
                    >
                </div>

                <div class="form-group">
                    <label>Phone</label>
                    <input
                        id="fPhone"
                        value="${profile.phone}"
                    >
                </div>

                <div class="form-group">
                    <label>Location</label>
                    <input
                        id="fLocation"
                        value="${profile.location}"
                    >
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <textarea id="fAddress">${profile.address}</textarea>
                </div>
            </div>

            <div class="modal-actions">
                <button
                    class="secondary-btn"
                    id="cancelProfile">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    id="saveProfile">
                    Save Changes
                </button>
            </div>
        </div>
    `);

    $("#cancelProfile")?.addEventListener(
        "click",
        closeModal
    );

    $("#saveProfile")?.addEventListener(
        "click",
        () => {
            profile.name =
                $("#fName")?.value.trim() || "Rohak";

            profile.email =
                $("#fEmail")?.value.trim() ||
                profile.email;

            profile.phone =
                $("#fPhone")?.value.trim() ||
                profile.phone;

            profile.location =
                $("#fLocation")?.value.trim() ||
                profile.location;

            profile.address =
                $("#fAddress")?.value.trim() ||
                profile.address;

            updateProfileUI();
            closeModal();

            toast("Profile updated successfully");
        }
    );
}

function showInfo(title, message) {
    openModal(`
        <div class="modal-form-content">
            <h2>${title}</h2>

            <p class="modal-info-text">
                ${message}
            </p>

            <div class="modal-actions">
                <button
                    class="primary-btn"
                    id="infoOk">
                    OK
                </button>
            </div>
        </div>
    `);

    $("#infoOk")?.addEventListener(
        "click",
        closeModal
    );
}

function renderSearch(query) {
    const results = $("#searchResults");

    if (!results) {
        return;
    }

    const search = query.trim().toLowerCase();

    if (!search) {
        results.classList.remove("show");
        results.innerHTML = "";
        return;
    }

    const matches = auctions.filter(
        auction =>
            `${auction.name} ${auction.cat}`
                .toLowerCase()
                .includes(search)
    );

    if (!matches.length) {
        results.innerHTML = `
            <div class="search-empty">
                No auctions found for "${query}"
            </div>
        `;
    } else {
        results.innerHTML = matches
            .slice(0, 6)
            .map(auction => `
                <button
                    class="search-result"
                    data-search-id="${auction.id}">

                    <img
                        src="${auction.img}"
                        alt="${auction.name}"
                        onerror="imageError(this)"
                    >

                    <div>
                        <b>${auction.name}</b>
                        <small>
                            ${auction.cat} · ${auction.time}
                        </small>
                    </div>

                    <strong>
                        ${money(auction.current)}
                    </strong>
                </button>
            `)
            .join("");
    }

    results.classList.add("show");

    $$("[data-search-id]").forEach(button => {
        button.addEventListener("click", () => {
            results.classList.remove("show");

            showAuctionDetails(
                Number(button.dataset.searchId)
            );
        });
    });
}

function performSearch() {
    const input = $("#searchInput");

    if (!input) {
        return;
    }

    const query = input.value.trim();

    if (!query) {
        toast("Type an auction name or category");
        input.focus();
        return;
    }

    const matches = auctions.filter(
        auction =>
            `${auction.name} ${auction.cat}`
                .toLowerCase()
                .includes(query.toLowerCase())
    );

    $("#searchResults")?.classList.remove("show");

    if (matches.length === 1) {
        showAuctionDetails(matches[0].id);
        return;
    }

    openModal(`
        <div class="modal-form-content">
            <h2>Search Results</h2>

            <p>
                ${matches.length}
                auction${matches.length === 1 ? "" : "s"}
                found for "${query}".
            </p>

            <div class="search-modal-list">
                ${
                    matches.length
                        ? matches.map(auction => `
                            <button
                                class="search-result modal-result"
                                data-modal-search="${auction.id}">

                                <img
                                    src="${auction.img}"
                                    alt="${auction.name}"
                                    onerror="imageError(this)"
                                >

                                <div>
                                    <b>${auction.name}</b>
                                    <small>${auction.cat}</small>
                                </div>

                                <strong>
                                    ${money(auction.current)}
                                </strong>
                            </button>
                        `).join("")
                        : `
                            <div class="search-empty">
                                No matching auctions found.
                            </div>
                        `
                }
            </div>
        </div>
    `);

    $$("[data-modal-search]").forEach(button => {
        button.addEventListener("click", () => {
            showAuctionDetails(
                Number(button.dataset.modalSearch)
            );
        });
    });
}

function bindDynamicButtons() {
    $$("[data-heart]").forEach(button => {
        button.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            toggleWishlist(
                Number(button.dataset.heart)
            );
        };
    });

    $$("[data-details]").forEach(button => {
        button.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            showAuctionDetails(
                Number(button.dataset.details)
            );
        };
    });

    $$("[data-bid]").forEach(button => {
        button.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            placeBid(
                Number(button.dataset.bid)
            );
        };
    });

    $$("[data-editbid]").forEach(button => {
        button.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            editBid(
                Number(button.dataset.editbid)
            );
        };
    });

    $$("[data-removebid]").forEach(button => {
        button.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            removeBid(
                Number(button.dataset.removebid)
            );
        };
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = $("#menuToggle");
    const sidebar = $(".sidebar");

    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", event => {
            event.stopPropagation();
            sidebar.classList.toggle("open");
        });
    }

    $$(".side-link[data-section]").forEach(button => {
        button.addEventListener("click", () => {
            showSection(button.dataset.section);

            if (window.innerWidth <= 800) {
                sidebar?.classList.remove("open");
            }
        });
    });

    $$("[data-top]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            navigateTop(button.dataset.top);
        });
    });

    $("#notificationBtn")?.addEventListener(
        "click",
        () => showSection("notifications")
    );

    $("#editProfileBtn")?.addEventListener(
        "click",
        editProfile
    );

    $("#createAuctionBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "Create Auction",
                "The auction creation form is ready to be connected to your Node.js backend."
            );
        }
    );

    $("#addFundsBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "Add Funds",
                "This is a frontend demo. No real payment is processed."
            );
        }
    );

    $("#transactionsBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "Transactions",
                "Your wallet transaction history will appear here after backend integration."
            );
        }
    );

    $("#transactionBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "Transactions",
                "Transaction history will be connected to the backend."
            );
        }
    );

    $("#withdrawBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "Withdraw",
                "Withdrawal functionality will be connected to the backend."
            );
        }
    );

    $("#manageListingsBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "My Auctions",
                "Your active and completed auction listings will appear here."
            );
        }
    );

    $("#sellItemBtn")?.addEventListener(
        "click",
        () => {
            showInfo(
                "Sell an Item",
                "The seller form can be connected to your Node.js backend."
            );
        }
    );

    $("#changePasswordBtn")?.addEventListener(
        "click",
        () => {
            openModal(`
                <div class="modal-form-content">
                    <h2>Change Password</h2>

                    <div class="form-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                        >
                    </div>

                    <div class="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                        >
                    </div>

                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                        >
                    </div>

                    <div class="modal-actions">
                        <button
                            class="secondary-btn"
                            id="cancelPassword">
                            Cancel
                        </button>

                        <button
                            class="primary-btn"
                            id="updatePassword">
                            Update Password
                        </button>
                    </div>
                </div>
            `);

            $("#cancelPassword")?.addEventListener(
                "click",
                closeModal
            );

            $("#updatePassword")?.addEventListener(
                "click",
                () => {
                    const newPassword =
                        $("#newPassword")?.value;

                    const confirmPassword =
                        $("#confirmPassword")?.value;

                    if (!newPassword) {
                        toast("Enter a new password");
                        return;
                    }

                    if (newPassword !== confirmPassword) {
                        toast("Passwords do not match");
                        return;
                    }

                    closeModal();
                    toast("Password updated successfully");
                }
            );
        }
    );

    $("#deleteAccountBtn")?.addEventListener(
        "click",
        () => {
            const confirmed = window.confirm(
                "Are you sure you want to delete this demo account?"
            );

            if (confirmed) {
                toast("Account deletion request submitted");
            }
        }
    );

    $("#saveSettingsBtn")?.addEventListener(
        "click",
        () => {
            const settings = {
                bidAlerts: $("#bidAlert")?.checked ?? true,
                auctionAlerts: $("#auctionAlert")?.checked ?? true,
                publicProfile: $("#publicProfile")?.checked ?? true,
                darkMode: $("#darkToggle")?.checked ?? true
            };

            localStorage.setItem(
                "bidYourItemSettings",
                JSON.stringify(settings)
            );

            toast("Settings saved successfully");
        }
    );

    $("#darkToggle")?.addEventListener(
        "change",
        () => {
            if ($("#darkToggle").checked) {
                document.body.classList.remove("light-mode");
            } else {
                document.body.classList.add("light-mode");
            }
        }
    );

    $$("[data-message]").forEach(button => {
        button.addEventListener("click", () => {
            showInfo(
                "Message",
                "This is a demo message. Connect your Node.js backend to enable real-time messaging."
            );
        });
    });

    $$(".quick-action").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.dataset.action;

            if (target === "sell") {
                showInfo(
                    "Sell an Item",
                    "Your seller form can be connected here."
                );
            } else if (target === "wallet") {
                showSection("wallet");
            } else if (target === "wishlist") {
                showSection("wishlist");
            } else if (target === "messages") {
                showSection("messages");
            } else if (target === "bids") {
                showSection("mybids");
            } else {
                toast("Action selected");
            }
        });
    });

    $$(".quick-card").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.id;

            if (id === "addFundsBtn") {
                showInfo(
                    "Add Funds",
                    "This is a frontend demo. No real payment is processed."
                );
            }

            if (
                id === "transactionsBtn" ||
                id === "transactionBtn"
            ) {
                showInfo(
                    "Transactions",
                    "Transaction history will be connected to the backend."
                );
            }
        });
    });

    $$(".filter").forEach(button => {
        button.addEventListener("click", () => {
            $$(".filter").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter || "all";

            renderMyBids();
            bindDynamicButtons();
        });
    });

    $("#searchInput")?.addEventListener(
        "input",
        event => {
            renderSearch(event.target.value);
        }
    );

    $("#searchInput")?.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch();
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
            if (event.target === $("#modalBackdrop")) {
                closeModal();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeModal();
                sidebar?.classList.remove("open");
            }
        }
    );

    document.addEventListener(
        "click",
        event => {
            if (
                !event.target.closest(".search-box") &&
                !event.target.closest(".search-results")
            ) {
                $("#searchResults")?.classList.remove("show");
            }

            if (
                window.innerWidth <= 800 &&
                sidebar &&
                !event.target.closest(".sidebar") &&
                !event.target.closest("#menuToggle")
            ) {
                sidebar.classList.remove("open");
            }
        }
    );

    const savedSettings =
        localStorage.getItem("bidYourItemSettings");

    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);

            if ($("#bidAlert")) {
                $("#bidAlert").checked =
                    settings.bidAlerts !== false;
            }

            if ($("#auctionAlert")) {
                $("#auctionAlert").checked =
                    settings.auctionAlerts !== false;
            }

            if ($("#publicProfile")) {
                $("#publicProfile").checked =
                    settings.publicProfile !== false;
            }

            if ($("#darkToggle")) {
                $("#darkToggle").checked =
                    settings.darkMode !== false;
            }
        } catch (error) {
            localStorage.removeItem(
                "bidYourItemSettings"
            );
        }
    }

    renderAll();
    bindDynamicButtons();
    showSection("dashboard");
});