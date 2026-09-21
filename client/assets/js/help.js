"use strict";

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    document.querySelectorAll(".main-nav a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });
}

document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
        item.classList.toggle("open");

        const symbol = item.querySelector("span:nth-child(2)");

        if (symbol) {
            symbol.textContent =
                item.classList.contains("open") ? "−" : "＋";
        }
    });
});

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const topic = document.getElementById("topic").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !topic || !message) {
            formNote.textContent =
                "Please fill in all the required fields.";
            return;
        }

        formNote.textContent = "Submitting...";

        try {
            const data = await BYI_API.request("/api/support", {
                method: "POST",
                body: {
                    name: name,
                    email: email,
                    topic: topic,
                    message: message
                }
            });

            console.log("Support response:", data);

            formNote.textContent =
                data.message || "Support request submitted successfully.";

            contactForm.reset();

        } catch (error) {
            console.error("Support submission error:", error);

            formNote.textContent =
                error.message || "Unable to submit your request.";
        }
    });
}

const siteSearch = document.getElementById("siteSearch");

if (siteSearch) {
    siteSearch.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const query = siteSearch.value.trim();

            if (query) {
                alert(`Demo search: ${query}`);
            }
        }
    });
}

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}