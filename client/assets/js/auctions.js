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

let activeTab = "Trending";


const auctionGrid =
    document.getElementById("auctionGrid");

const emptyState =
    document.getElementById("emptyState");

const toast =
    document.getElementById("toast");


function formatMoney(number) {

    return "₹ " +
        number.toLocaleString("en-IN");

}

function formatTime(seconds) {

    seconds = Math.max(0, seconds);


    const hours =
        String(Math.floor(seconds / 3600))
        .padStart(2, "0");


    const minutes =
        String(
            Math.floor(
                (seconds % 3600) / 60
            )
        ).padStart(2, "0");


    const secs =
        String(seconds % 60)
        .padStart(2, "0");


    return `${hours}:${minutes}:${secs}`;

}

function renderAuctions() {


    const searchText =
        document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    const selectedCategories =
        [
            ...document.querySelectorAll(
                ".category:checked"
            )
        ].map(
            checkbox => checkbox.value
        );


    const selectedStatuses =
        [
            ...document.querySelectorAll(
                ".status:checked"
            )
        ].map(
            checkbox => checkbox.value
        );


    const maximumPrice =
        Number(
            document
                .getElementById("priceRange")
                .value
        );


    const sortType =
        document
            .getElementById("sortSelect")
            .value;


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
                auction.tags.includes(activeTab);


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesStatus &&
                matchesTab
            );

        });


    if (
        sortType ===
        "Price: Low to High"
    ) {

        filteredAuctions.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (
        sortType ===
        "Price: High to Low"
    ) {

        filteredAuctions.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (
        sortType ===
        "Time Left"
    ) {

        filteredAuctions.sort(
            (a, b) =>
                a.time - b.time
        );

    }

    auctionGrid.innerHTML =
        filteredAuctions.map(
            auction => `

        <article class="card">

            <div class="card-image">

                <img
                    src="${auction.image}"
                    alt="${auction.name}"
                >

                <span class="live-badge">
                    LIVE
                </span>


                <button
                    class="heart"
                    onclick="toggleFavorite(this)"
                    aria-label="Favorite"
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
                            data-time="${auction.time}"
                        >
                            ${formatTime(
                                auction.time
                            )}
                        </span>

                    </div>

                </div>


                <button
                    class="bid-button"
                    onclick="placeBid('${auction.name}')"
                >
                    Place Bid
                </button>

            </div>

        </article>

    `
        ).join("");


    emptyState.hidden =
        filteredAuctions.length !== 0;

}

function toggleFavorite(button) {

    button.classList.toggle("saved");


    if (
        button.classList.contains("saved")
    ) {

        button.textContent = "♥";

    } else {

        button.textContent = "♡";

    }

}

function placeBid(itemName) {

    toast.textContent =
        `Bid window opened for ${itemName}`;


    toast.classList.add("show");


    setTimeout(
        () => {

            toast.classList.remove("show");

        },
        1800
    );

}


document
    .querySelectorAll(".tab")
    .forEach(tab => {


        tab.addEventListener(
            "click",
            () => {


                document
                    .querySelectorAll(".tab")
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                tab.classList.add("active");


                activeTab =
                    tab.dataset.tab;


                renderAuctions();

            }
        );

    });


document
    .querySelectorAll(".category")
    .forEach(
        checkbox =>
            checkbox.addEventListener(
                "change",
                renderAuctions
            )
    );


document
    .querySelectorAll(".status")
    .forEach(
        checkbox =>
            checkbox.addEventListener(
                "change",
                renderAuctions
            )
    );


document
    .getElementById("priceRange")
    .addEventListener(
        "input",
        renderAuctions
    );


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderAuctions
    );


document
    .getElementById("sortSelect")
    .addEventListener(
        "change",
        renderAuctions
    );


document
    .getElementById("clearAll")
    .addEventListener(
        "click",
        () => {


            document
                .querySelectorAll(
                    ".category"
                )
                .forEach(
                    checkbox =>
                        checkbox.checked = false
                );


            document
                .querySelectorAll(
                    ".status"
                )
                .forEach(
                    checkbox =>
                        checkbox.checked = false
                );


            document
                .querySelector(
                    ".status[value='Live Now']"
                )
                .checked = true;


            document
                .getElementById(
                    "priceRange"
                )
                .value = 500000;


            renderAuctions();

        }
    );


setInterval(
    () => {


        document
            .querySelectorAll(
                "[data-time]"
            )
            .forEach(
                timer => {


                    const currentTime =
                        Number(
                            timer.dataset.time
                        );


                    const nextTime =
                        Math.max(
                            0,
                            currentTime - 1
                        );


                    timer.dataset.time =
                        nextTime;


                    timer.textContent =
                        formatTime(nextTime);

                }
            );

    },
    1000
);

renderAuctions();


  

    

       
      
