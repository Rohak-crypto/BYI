
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

});