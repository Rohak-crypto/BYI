const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("open");
    const symbol = item.querySelector("span:nth-child(2)");
    symbol.textContent = item.classList.contains("open") ? "−" : "＋";
  });
});

const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const topic = document.getElementById("topic").value;

  formNote.textContent =
    `Thank you, ${name}! Your demo request about "${topic}" has been recorded on this page.`;

  contactForm.reset();
});

const siteSearch = document.getElementById("siteSearch");

siteSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = siteSearch.value.trim();

    if (query) {
      alert(`Demo search: ${query}`);
    }
  }
});

document.getElementById("year").textContent = new Date().getFullYear();
