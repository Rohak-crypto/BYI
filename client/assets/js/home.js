"use strict";

const auctions = [

    {
        name: "Luxury Wrist Watch",
        category: "Fashion",
        price: 45000,
        time: 2 * 3600 + 15 * 60 + 30,
        image: "../../assets/images/watch.jpg",
        tags: ["Trending", "Live Now"]
    },

    {
        name: "Vintage Camera",
        category: "Electronics",
        price: 22500,
        time: 1 * 3600 + 40 * 60 + 12,
        image: "../../assets/images/camera.jpg",
        tags: ["Trending", "Live Now", "Most Bids"]
    },

    {
        name: "Antique Wooden Chair",
        category: "Furniture",
        price: 12800,
        time: 3 * 3600 + 20 * 60 + 45,
        image: "../../assets/images/chair.jpg",
        tags: ["Trending", "Live Now"]
    },

    {
        name: "Diamond Necklace",
        category: "Jewellery",
        price: 75000,
        time: 50 * 60 + 10,
        image: "../../assets/images/necklace.jpg",
        tags: ["Trending", "Live Now", "Ending Soon"]
    },

    {
        name: "Classic Painting",
        category: "Art & Collectibles",
        price: 60000,
        time: 4 * 3600 + 12 * 60 + 22,
        image: "../../assets/images/painting.jpg",
        tags: ["Trending", "Live Now", "Newly Listed"]
    },

    {
        name: "Vintage Car Model",
        category: "Vehicles",
        price: 280000,
        time: 1 * 3600 + 10 * 60 + 5,
        image: "../../assets/images/car.jpg",
        tags: ["Trending", "Live Now", "Ending Soon"]
    },

    {
        name: "Leather Handbag",
        category: "Fashion",
        price: 18000,
        time: 2 * 3600 + 45 * 60 + 18,
        image: "../../assets/images/handbag.jpg",
        tags: ["Trending", "Live Now"]
    },

    {
        name: "Latest Smartphone",
        category: "Electronics",
        price: 38000,
        time: 1 * 3600 + 5 * 60 + 18,
        image: "../../assets/images/phone.jpg",
        tags: ["Trending", "Live Now", "Most Bids"]
    },

    {
        name: "Gramophone",
        category: "Collectibles",
        price: 32000,
        time: 3 * 3600 + 15 * 60 + 40,
        image: "../../assets/images/gramophone.jpg",
        tags: ["Trending", "Live Now", "Newly Listed"]
    },

    {
        name: "Designer Sofa",
        category: "Furniture",
        price: 55000,
        time: 5 * 3600 + 20 * 60 + 15,
        image: "../../assets/images/sofa.jpg",
        tags: ["Trending", "Live Now"]
    }

];


let activeAuctionTab = "Trending";

const auctionGrid =
    document.getElementById("auctionGrid");

const emptyState =
    document.getElementById("emptyState");

function formatMoney(number) {

    return "₹ " + number.toLocaleString("en-IN");

}

function formatTime(seconds) {

    seconds = Math.max(0, seconds);

    const hours =
        String(Math.floor(seconds / 3600))
            .padStart(2, "0");

    const minutes =
        String(Math.floor((seconds % 3600) / 60))
            .padStart(2, "0");

    const secs =
        String(seconds % 60)
            .padStart(2, "0");

    return `${hours}:${minutes}:${secs}`;

}

function renderAuctions() {

    if (!auctionGrid) {
        return;
    }


    const searchElement =
        document.getElementById("globalSearch");

    const searchText =
        searchElement
            ? searchElement.value.trim().toLowerCase()
            : "";


    const selectedCategories = [

        ...document.querySelectorAll(
            ".auction-category:checked"
        )

    ].map(
        checkbox => checkbox.value
    );


    const selectedStatuses = [

        ...document.querySelectorAll(
            ".auction-status:checked"
        )

    ].map(
        checkbox => checkbox.value
    );


    const priceRange =
        document.getElementById("priceRange");


    const maximumPrice =
        priceRange
            ? Number(priceRange.value)
            : 500000;


    const sortSelect =
        document.getElementById("sortSelect");


    const sortType =
        sortSelect
            ? sortSelect.value
            : "Trending";


    let filteredAuctions =
        auctions.filter(auction => {

            const matchesSearch =

                !searchText ||

                (
                    auction.name +
                    " " +
                    auction.category
                )
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                selectedCategories.length === 0 ||

                selectedCategories.includes(
                    auction.category
                );


            const matchesPrice =
                auction.price <= maximumPrice;


            const matchesStatus =

                selectedStatuses.length === 0 ||

                selectedStatuses.some(
                    status =>
                        auction.tags.includes(status)
                );


            const matchesTab =
                auction.tags.includes(
                    activeAuctionTab
                );


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesStatus &&
                matchesTab
            );

        });


    /* SORT */

    if (sortType === "Price: Low to High") {

        filteredAuctions.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sortType === "Price: High to Low") {

        filteredAuctions.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sortType === "Time Left") {

        filteredAuctions.sort(
            (a, b) => a.time - b.time
        );

    }

    auctionGrid.innerHTML =
        filteredAuctions.map(
            auction => `

            <article class="integrated-auction-card">

                <div class="integrated-auction-image">

                    <img
                        src="${auction.image}"
                        alt="${auction.name}"
                    >

                    <span class="integrated-live-badge">
                        LIVE
                    </span>

                    <button
                        class="integrated-heart"
                        onclick="toggleFavorite(this)"
                        aria-label="Favorite"
                    >
                        ♡
                    </button>

                </div>


                <div class="integrated-auction-body">

                    <h3>
                        ${auction.name}
                    </h3>

                    <div class="integrated-auction-category">
                        ${auction.category}
                    </div>


                    <div class="integrated-auction-meta">

                        <div>

                            <span class="integrated-meta-label">
                                Current Bid
                            </span>

                            <span class="integrated-bid-price">
                                ${formatMoney(auction.price)}
                            </span>

                        </div>


                        <div>

                            <span class="integrated-meta-label">
                                Time Left
                            </span>

                            <span
                                class="integrated-time"
                                data-auction-time="${auction.time}"
                            >
                                ${formatTime(auction.time)}
                            </span>

                        </div>

                    </div>


                    <button
                        class="integrated-bid-button"
                        onclick="placeAuctionBid('${auction.name}')"
                    >
                        Place Bid
                    </button>

                </div>

            </article>

        `
        )
        .join("");


    if (emptyState) {

        emptyState.hidden =
            filteredAuctions.length !== 0;

    }

}

function toggleFavorite(button) {

    button.classList.toggle("saved");


    if (button.classList.contains("saved")) {

        button.textContent = "♥";

    } else {

        button.textContent = "♡";

    }

}


function placeAuctionBid(itemName) {

    alert(
        `Bid window opened for ${itemName}`
    );

}


document
    .querySelectorAll(".auction-tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".auction-tab")
                    .forEach(item =>
                        item.classList.remove("active")
                    );


                tab.classList.add("active");


                activeAuctionTab =
                    tab.dataset.tab;


                renderAuctions();

            }
        );

    });

document
    .querySelectorAll(".auction-category")
    .forEach(
        checkbox =>
            checkbox.addEventListener(
                "change",
                renderAuctions
            )
    );


document
    .querySelectorAll(".auction-status")
    .forEach(
        checkbox =>
            checkbox.addEventListener(
                "change",
                renderAuctions
            )
    );

const auctionPriceRange =
    document.getElementById("priceRange");


if (auctionPriceRange) {

    auctionPriceRange.addEventListener(
        "input",
        renderAuctions
    );

}


const auctionSortSelect =
    document.getElementById("sortSelect");


if (auctionSortSelect) {

    auctionSortSelect.addEventListener(
        "change",
        renderAuctions
    );

}



const clearAll =
    document.getElementById("clearAll");


if (clearAll) {

    clearAll.addEventListener(
        "click",
        () => {

            document
                .querySelectorAll(".auction-category")
                .forEach(
                    checkbox =>
                        checkbox.checked = false
                );


            document
                .querySelectorAll(".auction-status")
                .forEach(
                    checkbox =>
                        checkbox.checked = false
                );


            const liveNow =
                document.querySelector(
                    ".auction-status[value='Live Now']"
                );


            if (liveNow) {

                liveNow.checked = true;

            }


            if (auctionPriceRange) {

                auctionPriceRange.value = 500000;

            }


            renderAuctions();

        }
    );

}

setInterval(
    () => {

        document
            .querySelectorAll(
                "[data-auction-time]"
            )
            .forEach(timer => {

                const currentTime =
                    Number(
                        timer.dataset.auctionTime
                    );


                const nextTime =
                    Math.max(
                        0,
                        currentTime - 1
                    );


                timer.dataset.auctionTime =
                    nextTime;


                timer.textContent =
                    formatTime(nextTime);

            });

    },
    1000
);

const categories = [

    {
        name: "Electronics",
        count: "1,250+",
        icon: "▣",

        image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Premium Laptop",
                "₹45,000",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 35 * 60
            ],

            [
                "Premium Smartphone",
                "₹28,500",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
                4 * 3600 + 10 * 60
            ],

            [
                "Mirrorless Camera",
                "₹52,000",
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
                1 * 3600 + 50 * 60
            ]

        ]

    },


    {
        name: "Furniture",
        count: "980+",
        icon: "▤",

        image:
            "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Luxury Green Sofa",
                "₹18,000",
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
                1 * 3600 + 45 * 60
            ],

            [
                "Modern Dining Set",
                "₹24,500",
                "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",
                3 * 3600 + 20 * 60
            ],

            [
                "Classic Wooden Chair",
                "₹8,500",
                "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 12 * 60
            ],

            [
                "King Size Bed",
                "₹32,000",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
                5 * 3600 + 5 * 60
            ]

        ]

    },


    {
        name: "Jewellery",
        count: "760+",
        icon: "♢",

        image:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Diamond Necklace",
                "₹85,000",
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 15 * 60
            ],

            [
                "Gold Ring",
                "₹42,000",
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
                1 * 3600 + 25 * 60
            ],

            [
                "Pearl Bracelet",
                "₹22,500",
                "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",
                4 * 3600 + 30 * 60
            ]

        ]

    },


    {
        name: "Art & Collectibles",
        count: "540+",
        icon: "▣",

        image:
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Antique Landscape Painting",
                "₹65,000",
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85",
                3 * 3600 + 10 * 60
            ],

            [
                "Vintage Sculpture",
                "₹38,000",
                "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 40 * 60
            ],

            [
                "Rare Collectible Coin",
                "₹18,500",
                "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=85",
                6 * 3600 + 15 * 60
            ]

        ]

    },


    {
        name: "Vehicles",
        count: "320+",
        icon: "▱",

        image:
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Classic Vintage Car",
                "₹8,50,000",
                "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=85",
                8 * 3600 + 10 * 60
            ],

            [
                "Premium Sports Car",
                "₹22,00,000",
                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
                4 * 3600 + 50 * 60
            ]

        ]

    },


    {
        name: "Fashion",
        count: "1,100+",
        icon: "♧",

        image:
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Designer Handbag",
                "₹32,000",
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 35 * 60
            ],

            [
                "Luxury Sunglasses",
                "₹14,500",
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85",
                1 * 3600 + 5 * 60
            ],

            [
                "Designer Dress",
                "₹28,000",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",
                5 * 3600 + 40 * 60
            ]

        ]

    },


    {
        name: "Home & Living",
        count: "890+",
        icon: "⌂",

        image:
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Modern Lounge Set",
                "₹42,000",
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 50 * 60
            ],

            [
                "Designer Table Lamp",
                "₹9,500",
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
                3 * 3600 + 15 * 60
            ]

        ]

    },


    {
        name: "Sports & Hobbies",
        count: "460+",
        icon: "◉",

        image:
            "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=85",

        items: [

            [
                "Professional Tennis Racket",
                "₹12,000",
                "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=900&q=85",
                1 * 3600 + 55 * 60
            ],

            [
                "Premium Basketball",
                "₹7,500",
                "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85",
                2 * 3600 + 25 * 60
            ]

        ]

    }

];

const categoryList =
    document.getElementById("categoryList");

const categoryCards =
    document.getElementById("categoryCards");

const itemsSection =
    document.getElementById("itemsSection");

const itemsGrid =
    document.getElementById("itemsGrid");

const sectionTitle =
    document.getElementById("sectionTitle");

const itemsTitle =
    document.getElementById("itemsTitle");

const categorySearch =
    document.getElementById("categorySearch");


let selectedCategory = null;

const timers = new Map();


function renderSidebar(filter = "") {

    if (!categoryList) {
        return;
    }


    categoryList.innerHTML = "";


    const all =
        document.createElement("div");


    all.className =
        "category-item " +
        (!selectedCategory ? "active" : "");


    all.innerHTML = `
        <span class="icon">▦</span>
        All Categories
    `;


    all.onclick =
        () => showAll();


    categoryList.appendChild(all);


    categories

        .filter(
            c =>
                c.name
                    .toLowerCase()
                    .includes(
                        filter.toLowerCase()
                    )
        )

        .forEach(c => {

            const el =
                document.createElement("div");


            el.className =
                "category-item " +
                (
                    selectedCategory === c.name
                        ? "active"
                        : ""
                );


            el.innerHTML = `
                <span class="icon">
                    ${c.icon}
                </span>
                ${c.name}
            `;


            el.onclick =
                () => showCategory(c.name);


            categoryList.appendChild(el);

        });

}


function renderCategories() {

    if (!categoryCards) {
        return;
    }


    categoryCards.innerHTML =
        categories.map(
            c => `

            <article
                class="integrated-category-card"
                data-category="${c.name}"
            >

                <img
                    src="${c.image}"
                    alt="${c.name}"
                >

                <div class="integrated-category-card-info">

                    <h3>
                        ${c.name}
                    </h3>

                    <p>
                        ${c.count} items
                    </p>

                    <button
                        class="integrated-category-arrow"
                        aria-label="Open ${c.name}"
                    >
                        →
                    </button>

                </div>

            </article>

        `
        ).join("");


    document
        .querySelectorAll(
            ".integrated-category-card"
        )
        .forEach(card => {

            card.onclick =
                () =>
                    showCategory(
                        card.dataset.category
                    );

        });

}


function showAll() {

    selectedCategory = null;


    if (sectionTitle) {

        sectionTitle.textContent =
            "All Categories";

    }


    if (categoryCards) {

        categoryCards.classList.remove(
            "hidden"
        );

    }


    if (itemsSection) {

        itemsSection.classList.add(
            "hidden"
        );

    }


    renderSidebar(
        categorySearch
            ? categorySearch.value
            : ""
    );


    const categoriesSection =
        document.getElementById(
            "categories"
        );


    if (categoriesSection) {

        categoriesSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


function showCategory(name) {

    const category =
        categories.find(
            c => c.name === name
        );


    if (!category) {
        return;
    }


    selectedCategory = name;


    if (sectionTitle) {

        sectionTitle.textContent =
            name;

    }


    if (categoryCards) {

        categoryCards.classList.add(
            "hidden"
        );

    }


    if (itemsSection) {

        itemsSection.classList.remove(
            "hidden"
        );

    }


    if (itemsTitle) {

        itemsTitle.textContent =
            `${name} Items`;

    }


    renderSidebar(
        categorySearch
            ? categorySearch.value
            : ""
    );


    renderItems(category);


    setTimeout(
        () => {

            if (itemsSection) {

                itemsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        },
        50
    );

}


function renderItems(category) {

    if (!itemsGrid) {
        return;
    }


    itemsGrid.innerHTML =
        category.items.map(
            (item, index) => `

            <article
                class="integrated-item-card"
            >

                <img
                    src="${item[2]}"
                    alt="${item[0]}"
                >

                <div class="integrated-item-body">

                    <h3>
                        ${item[0]}
                    </h3>

                    <span class="integrated-price-label">
                        Current Auction Price
                    </span>

                    <div
                        class="integrated-price"
                        id="price-${category.name}-${index}"
                    >
                        ${item[1]}
                    </div>

                    <div
                        class="integrated-timer"
                        id="timer-${category.name}-${index}"
                    >
                        Loading...
                    </div>

                    <button
                        class="integrated-item-bid-btn"
                        data-category="${category.name}"
                        data-index="${index}"
                    >
                        Bid Now
                    </button>

                </div>

            </article>

        `
        ).join("");


    category.items.forEach(
        (item, index) => {

            const key =
                `${category.name}-${index}`;


            if (!timers.has(key)) {

                timers.set(
                    key,
                    {
                        end:
                            Date.now() +
                            item[3] * 1000
                    }
                );

            }


            updateTimer(
                category,
                index
            );

        }
    );


    document
        .querySelectorAll(
            ".integrated-item-bid-btn"
        )
        .forEach(btn => {

            btn.onclick =
                () =>
                    openBid(
                        category,
                        Number(
                            btn.dataset.index
                        )
                    );

        });

}


function updateTimer(
    category,
    index
) {

    const key =
        `${category.name}-${index}`;


    const state =
        timers.get(key);


    const el =
        document.getElementById(
            `timer-${category.name}-${index}`
        );


    if (!el || !state) {
        return;
    }


    const left =
        Math.max(
            0,
            state.end - Date.now()
        );


    const buttons =
        document.querySelectorAll(
            ".integrated-item-bid-btn"
        );


    let btn = null;


    buttons.forEach(button => {

        if (
            button.dataset.category ===
                category.name &&
            Number(button.dataset.index) ===
                index
        ) {

            btn = button;

        }

    });


    if (left <= 0) {

        el.textContent =
            "Auction Closed";


        if (btn) {

            btn.disabled = true;

            btn.textContent =
                "Auction Closed";

        }


        return;

    }


    const total =
        Math.floor(
            left / 1000
        );


    const h =
        Math.floor(
            total / 3600
        );


    const m =
        Math.floor(
            (total % 3600) / 60
        );


    const s =
        total % 60;


    el.textContent =
        `⏱ ${String(h).padStart(2, "0")}:` +
        `${String(m).padStart(2, "0")}:` +
        `${String(s).padStart(2, "0")} remaining`;

}


setInterval(
    () => {

        if (!selectedCategory) {
            return;
        }


        const category =
            categories.find(
                x =>
                    x.name ===
                    selectedCategory
            );


        if (!category) {
            return;
        }


        category.items.forEach(
            (_, index) =>
                updateTimer(
                    category,
                    index
                )
        );

    },
    1000
);


const modal =
    document.getElementById(
        "bidModal"
    );

const modalItem =
    document.getElementById(
        "modalItem"
    );

const modalCurrent =
    document.getElementById(
        "modalCurrent"
    );

const bidAmount =
    document.getElementById(
        "bidAmount"
    );

const bidMessage =
    document.getElementById(
        "bidMessage"
    );


let currentBidTarget = null;



function openBid(
    category,
    index
) {

    const item =
        category.items[index];


    currentBidTarget = {
        category,
        index
    };


    if (modalItem) {

        modalItem.textContent =
            item[0];

    }


    if (modalCurrent) {

        modalCurrent.textContent =
            item[1];

    }


    if (bidAmount) {

        bidAmount.value = "";

        bidAmount.placeholder =
            `Enter more than ${item[1]}`;

    }


    if (bidMessage) {

        bidMessage.textContent = "";

    }


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


function closeBid() {

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


const closeModal =
    document.getElementById(
        "closeModal"
    );


if (closeModal) {

    closeModal.onclick =
        closeBid;

}


if (modal) {

    modal.onclick =
        event => {

            if (
                event.target ===
                modal
            ) {

                closeBid();

            }

        };

}


const confirmBid =
    document.getElementById(
        "confirmBid"
    );


if (confirmBid) {

    confirmBid.onclick =
        () => {

            if (!currentBidTarget) {
                return;
            }


            const {
                category,
                index
            } =
                currentBidTarget;


            const item =
                category.items[index];


            const current =
                parseInt(
                    item[1].replace(
                        /[₹,]/g,
                        ""
                    ),
                    10
                );


            const amount =
                parseInt(
                    bidAmount
                        ? bidAmount.value
                        : "",
                    10
                );


            if (
                !amount ||
                amount <= current
            ) {

                if (bidMessage) {

                    bidMessage.textContent =
                        `Please enter a bid higher than ${item[1]}.`;

                }

                return;

            }


            item[1] =
                `₹${amount.toLocaleString("en-IN")}`;


            renderItems(category);


            if (bidMessage) {

                bidMessage.textContent =
                    "Bid placed successfully!";

            }


            setTimeout(
                closeBid,
                700
            );

        };

}

if (categorySearch) {

    categorySearch.addEventListener(
        "input",
        event =>
            renderSidebar(
                event.target.value
            )
    );

}

const globalSearch =
    document.getElementById(
        "globalSearch"
    );


if (globalSearch) {

    globalSearch.addEventListener(
        "input",
        () => {

            const q =
                globalSearch.value
                    .toLowerCase()
                    .trim();


            if (!q) {

                renderAuctions();

                return;

            }


            const auctionMatch =
                auctions.some(
                    auction =>
                        (
                            auction.name +
                            " " +
                            auction.category
                        )
                            .toLowerCase()
                            .includes(q)
                );


            if (auctionMatch) {

                activeAuctionTab =
                    "Trending";


                document
                    .querySelectorAll(
                        ".auction-tab"
                    )
                    .forEach(
                        tab =>
                            tab.classList.remove(
                                "active"
                            )
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


                const trendingSection =
                    document.getElementById(
                        "trending-auctions"
                    );


                if (trendingSection) {

                    trendingSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }

        }
    );

}


const exploreAll =
    document.getElementById(
        "exploreAll"
    );


if (exploreAll) {

    exploreAll.onclick =
        showAll;

}


const backCategories =
    document.getElementById(
        "backCategories"
    );


if (backCategories) {

    backCategories.onclick =
        showAll;

}


const navLinks =
    document.querySelectorAll(
        ".custom-navbar .nav-link"
    );


window.addEventListener(
    "scroll",
    () => {

        const trendingSection =
            document.getElementById(
                "trending-auctions"
            );

        const categoriesSection =
            document.getElementById(
                "categories"
            );


        if (
            !trendingSection ||
            !categoriesSection
        ) {

            return;

        }


        const scrollPosition =
            window.scrollY + 150;


        navLinks.forEach(
            link =>
                link.classList.remove(
                    "active"
                )
        );


        if (
            scrollPosition <
            trendingSection.offsetTop
        ) {

            const homeLink =
                document.querySelector(
                    ".custom-navbar a[href='#home']"
                );


            if (homeLink) {

                homeLink.classList.add(
                    "active"
                );

            }

        }

        else if (
            scrollPosition <
            categoriesSection.offsetTop
        ) {

            const auctionLink =
                document.querySelector(
                    ".custom-navbar a[href='#trending-auctions']"
                );


            if (auctionLink) {

                auctionLink.classList.add(
                    "active"
                );

            }

        }

        else {

            const categoryLink =
                document.querySelector(
                    ".custom-navbar a[href='#categories']"
                );


            if (categoryLink) {

                categoryLink.classList.add(
                    "active"
                );

            }

        }

    }
);


renderAuctions();

renderSidebar();

renderCategories();


console.log("Home JS Loaded Successfully");
