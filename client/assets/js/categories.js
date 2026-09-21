"use strict";

const categories = [
    {
        name: "Electronics",
        count: "1,250+",
        icon: "▣",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Premium Laptop", "₹45,000", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 35 * 60],
            ["Premium Smartphone", "₹28,500", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85", 4 * 3600 + 10 * 60],
            ["Mirrorless Camera", "₹52,000", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85", 1 * 3600 + 50 * 60]
        ]
    },
    {
        name: "Furniture",
        count: "980+",
        icon: "▤",
        image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Luxury Green Sofa", "₹18,000", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85", 1 * 3600 + 45 * 60],
            ["Modern Dining Set", "₹24,500", "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85", 3 * 3600 + 20 * 60],
            ["Classic Wooden Chair", "₹8,500", "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 12 * 60],
            ["King Size Bed", "₹32,000", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85", 5 * 3600 + 5 * 60]
        ]
    },
    {
        name: "Jewellery",
        count: "760+",
        icon: "♢",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Diamond Necklace", "₹85,000", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 15 * 60],
            ["Gold Ring", "₹42,000", "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85", 1 * 3600 + 25 * 60],
            ["Pearl Bracelet", "₹22,500", "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85", 4 * 3600 + 30 * 60]
        ]
    },
    {
        name: "Art & Collectibles",
        count: "540+",
        icon: "▣",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Antique Landscape Painting", "₹65,000", "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85", 3 * 3600 + 10 * 60],
            ["Vintage Sculpture", "₹38,000", "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 40 * 60],
            ["Rare Collectible Coin", "₹18,500", "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=85", 6 * 3600 + 15 * 60],
            ["Gramophone", "₹32,000", "/assets/images/gramophone.jpg", 3 * 3600 + 15 * 60]
        ]
    },
    {
        name: "Vehicles",
        count: "320+",
        icon: "▱",
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Classic Vintage Car", "₹8,50,000", "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=85", 8 * 3600 + 10 * 60],
            ["Premium Sports Car", "₹22,00,000", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85", 4 * 3600 + 50 * 60]
        ]
    },
    {
        name: "Fashion",
        count: "1,100+",
        icon: "♧",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Designer Handbag", "₹32,000", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 35 * 60],
            ["Luxury Sunglasses", "₹14,500", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85", 1 * 3600 + 5 * 60],
            ["Designer Dress", "₹28,000", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85", 5 * 3600 + 40 * 60]
        ]
    },
    {
        name: "Home & Living",
        count: "890+",
        icon: "⌂",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Modern Lounge Set", "₹42,000", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 50 * 60],
            ["Designer Table Lamp", "₹9,500", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", 3 * 3600 + 15 * 60]
        ]
    },
    {
        name: "Sports & Hobbies",
        count: "460+",
        icon: "◉",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",
        items: [
            ["Professional Tennis Racket", "₹12,000", "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=85", 1 * 3600 + 55 * 60],
            ["Premium Basketball", "₹7,500", "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85", 2 * 3600 + 25 * 60]
        ]
    }
];

const categoryList = document.getElementById("categoryList");
const categoryCards = document.getElementById("categoryCards");
const itemsSection = document.getElementById("itemsSection");
const itemsGrid = document.getElementById("itemsGrid");
const sectionTitle = document.getElementById("sectionTitle");
const itemsTitle = document.getElementById("itemsTitle");
const categorySearch = document.getElementById("categorySearch");
const modal = document.getElementById("bidModal");
const modalItem = document.getElementById("modalItem");
const modalCurrent = document.getElementById("modalCurrent");
const bidAmount = document.getElementById("bidAmount");
const bidMessage = document.getElementById("bidMessage");
const closeModal = document.getElementById("closeModal");
const confirmBid = document.getElementById("confirmBid");
const exploreAll = document.getElementById("exploreAll");
const backCategories = document.getElementById("backCategories");
const startExploringBtn = document.getElementById("startExploringBtn");

let selectedCategory = null;
let currentBidTarget = null;

const timers = new Map();

function renderSidebar(filter = "") {
    if (!categoryList) return;

    categoryList.innerHTML = "";

    const all = document.createElement("button");
    all.type = "button";
    all.className = `category-item ${!selectedCategory ? "active" : ""}`;
    all.innerHTML = `<span class="icon">▦</span><span>All Categories</span>`;
    all.addEventListener("click", showAll);
    categoryList.appendChild(all);

    categories
        .filter(category =>
            category.name.toLowerCase().includes(filter.toLowerCase())
        )
        .forEach(category => {
            const element = document.createElement("button");

            element.type = "button";
            element.className = `category-item ${selectedCategory === category.name ? "active" : ""}`;

            element.innerHTML = `
                <span class="icon">${category.icon}</span>
                <span>${category.name}</span>
                <small>${category.count}</small>
            `;

            element.addEventListener("click", () => {
                showCategory(category.name);
            });

            categoryList.appendChild(element);
        });
}

function renderCategories() {
    if (!categoryCards) return;

    categoryCards.innerHTML = categories.map(category => `
        <article class="integrated-category-card" data-category="${category.name}">
            <img src="${category.image}" alt="${category.name}">
            <div class="integrated-category-card-info">
                <h3>${category.name}</h3>
                <p>${category.count} items</p>
                <button class="integrated-category-arrow" type="button">→</button>
            </div>
        </article>
    `).join("");

    categoryCards.querySelectorAll(".integrated-category-card").forEach(card => {
        card.addEventListener("click", () => {
            showCategory(card.dataset.category);
        });
    });
}

function showAll() {
    selectedCategory = null;

    if (sectionTitle) {
        sectionTitle.textContent = "All Categories";
    }

    if (categoryCards) {
        categoryCards.classList.remove("hidden");
    }

    if (itemsSection) {
        itemsSection.classList.add("hidden");
    }

    renderSidebar(categorySearch ? categorySearch.value : "");
}

function showCategory(name) {
    const category = categories.find(item => item.name === name);

    if (!category) return;

    selectedCategory = name;

    if (sectionTitle) {
        sectionTitle.textContent = name;
    }

    if (categoryCards) {
        categoryCards.classList.add("hidden");
    }

    if (itemsSection) {
        itemsSection.classList.remove("hidden");
    }

    if (itemsTitle) {
        itemsTitle.textContent = `${name} Items`;
    }

    renderSidebar(categorySearch ? categorySearch.value : "");
    renderItems(category);

    setTimeout(() => {
        itemsSection?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 50);
}

function renderItems(category) {
    if (!itemsGrid) return;

    itemsGrid.innerHTML = category.items.map((item, index) => `
        <article class="integrated-item-card">
            <img src="${item[2]}" alt="${item[0]}">
            <div class="integrated-item-body">
                <h3>${item[0]}</h3>
                <span class="integrated-price-label">Current Auction Price</span>
                <div class="integrated-price" id="price-${category.name}-${index}">
                    ${item[1]}
                </div>
                <div class="integrated-timer" id="timer-${category.name}-${index}">
                    Loading...
                </div>
                <button
                    class="integrated-item-bid-btn"
                    type="button"
                    data-category="${category.name}"
                    data-index="${index}">
                    Bid Now
                </button>
            </div>
        </article>
    `).join("");

    category.items.forEach((item, index) => {
        const key = `${category.name}-${index}`;

        if (!timers.has(key)) {
            timers.set(key, {
                end: Date.now() + item[3] * 1000
            });
        }

        updateTimer(category, index);
    });

    itemsGrid.querySelectorAll(".integrated-item-bid-btn").forEach(button => {
        button.addEventListener("click", () => {
            openBid(category, Number(button.dataset.index));
        });
    });
}

function updateTimer(category, index) {
    const key = `${category.name}-${index}`;
    const state = timers.get(key);
    const element = document.getElementById(`timer-${category.name}-${index}`);

    if (!element || !state) return;

    const left = Math.max(0, state.end - Date.now());

    const button = itemsGrid?.querySelector(
        `.integrated-item-bid-btn[data-category="${CSS.escape(category.name)}"][data-index="${index}"]`
    );

    if (left <= 0) {
        element.textContent = "Auction Closed";

        if (button) {
            button.disabled = true;
            button.textContent = "Auction Closed";
        }

        return;
    }

    if (button) {
        button.disabled = false;
        button.textContent = "Bid Now";
    }

    const total = Math.floor(left / 1000);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    element.textContent =
        `⏱ ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} remaining`;
}

setInterval(() => {
    if (!selectedCategory) return;

    const category = categories.find(
        item => item.name === selectedCategory
    );

    if (!category) return;

    category.items.forEach((_, index) => {
        updateTimer(category, index);
    });
}, 1000);

function openBid(category, index) {
    const item = category.items[index];

    if (!item) return;

    currentBidTarget = {
        category,
        index
    };

    if (modalItem) {
        modalItem.textContent = item[0];
    }

    if (modalCurrent) {
        modalCurrent.textContent = item[1];
    }

    if (bidAmount) {
        const current = parseInt(
            item[1].replace(/[₹,\s]/g, ""),
            10
        );

        bidAmount.value = "";
        bidAmount.min = current + 1;
        bidAmount.placeholder = `Enter more than ${item[1]}`;
    }

    if (bidMessage) {
        bidMessage.textContent = "";
        bidMessage.className = "bid-message";
    }

    if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("show");
    }
}

function closeBid() {
    if (modal) {
        modal.classList.remove("show");
        modal.classList.add("hidden");
    }

    currentBidTarget = null;
}

function handleCategoryBid() {
    if (!currentBidTarget) return;

    const amount = parseInt(
        bidAmount?.value || "",
        10
    );

    const category = currentBidTarget.category;
    const index = currentBidTarget.index;
    const item = category.items[index];

    if (!item) return;

    const current = parseInt(
        item[1].replace(/[₹,\s]/g, ""),
        10
    );

    if (!amount || amount <= current) {
        if (bidMessage) {
            bidMessage.textContent =
                `Please enter a bid higher than ${item[1]}.`;
            bidMessage.className = "bid-message error";
        }
        return;
    }

    item[1] = `₹${amount.toLocaleString("en-IN")}`;

    renderItems(category);

    if (bidMessage) {
        bidMessage.textContent = "Bid placed successfully!";
        bidMessage.className = "bid-message success";
    }

    setTimeout(closeBid, 700);
}

closeModal?.addEventListener("click", closeBid);

modal?.addEventListener("click", event => {
    if (event.target === modal) {
        closeBid();
    }
});

confirmBid?.addEventListener("click", handleCategoryBid);

bidAmount?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        handleCategoryBid();
    }

    if (event.key === "Escape") {
        closeBid();
    }
});

categorySearch?.addEventListener("input", event => {
    renderSidebar(event.target.value);
});

exploreAll?.addEventListener("click", showAll);

backCategories?.addEventListener("click", showAll);

globalThis.document?.getElementById("globalSearch")?.addEventListener("input", event => {
    const query = event.target.value.toLowerCase().trim();

    if (!query) return;

    const categoryMatch = categories.find(category =>
        category.name.toLowerCase().includes(query) ||
        category.items.some(item =>
            item[0].toLowerCase().includes(query)
        )
    );

    if (categoryMatch) {
        showCategory(categoryMatch.name);
    }
});

startExploringBtn?.addEventListener("click", () => {
    document.getElementById("trending-auctions")?.scrollIntoView({
        behavior: "smooth"
    });
});

const navLinks = document.querySelectorAll(
    ".custom-navbar .nav-link"
);

window.addEventListener("scroll", () => {
    const trendingSection = document.getElementById("trending-auctions");
    const categoriesSection = document.getElementById("categories");

    if (!trendingSection || !categoriesSection) return;

    const scrollPosition = window.scrollY + 150;

    navLinks.forEach(link => {
        link.classList.remove("active");
    });

    if (scrollPosition < trendingSection.offsetTop) {
        document.querySelector(
            ".custom-navbar a[href='#home']"
        )?.classList.add("active");
    } else if (scrollPosition < categoriesSection.offsetTop) {
        document.querySelector(
            ".custom-navbar a[href='#trending-auctions']"
        )?.classList.add("active");
    } else {
        document.querySelector(
            ".custom-navbar a[href='#categories']"
        )?.classList.add("active");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    renderSidebar();
    renderCategories();
});