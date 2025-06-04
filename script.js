const pages = [
    {
        title: "Velkommen",
        text: "Dette er forsiden av spillboken.",
        img: "",
        link: "",
    },
    {
        title: "Minesweeper",
        text: "Spill det klassiske Minesweeper-spillet!",
        img: "https://via.placeholder.com/300x150",
        link: "minesweeper/index.html",
    },
    {
        title: "Dino Game",
        text: "Utfordre deg selv!",
        img: "https://via.placeholder.com/300x150",
        link: "dinogame/index.html",
    },
    {
        title: "",
        text: "Ha det gøy med vårt nyeste spill!",
        img: "bilder/minesweeperTest.png",
        link: "https://example.com/game3",
    },
    {
        title: "Ulniversal Paperclip",
        text: "det ultimate nettspillet!",
        img: "",
        link: "ultimatepaperclip/index2.html",
    },
];

const pagesContainer = document.getElementById("pages-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// currentIndex refererer til første side som vises i dobbeltvisning (untatt når index=0)
let currentIndex = 0;

function createPageElement(page, pageNumber) {
    const div = document.createElement("div");
    div.className = "page";
    div.innerHTML = `
<h2>${page.title}</h2>
${page.img ? `<img src="${page.img}" alt="${page.title}">` : ""}
<p>${page.text}</p>
${page.link
            ? `<a href="${page.link}" target="_blank">Start spillet</a>`
            : ""
        }
<div class="page-number">Side ${pageNumber}</div>
`;
    return div;
}

function renderPages() {
    pagesContainer.innerHTML = "";
    if (currentIndex === 0) {
        // Bare én side (forsiden)
        pagesContainer.appendChild(createPageElement(pages[0], 1));
    } else {
        // Vis to sider side om side
        pagesContainer.appendChild(
            createPageElement(pages[currentIndex], currentIndex + 1)
        );
        if (currentIndex + 1 < pages.length) {
            pagesContainer.appendChild(
                createPageElement(pages[currentIndex + 1], currentIndex + 2)
            );
        }
    }
    // Disable knapper når vi er i start eller slutt
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= pages.length - 2;
}

prevBtn.addEventListener("click", () => {
    if (currentIndex === 1) {
        // Gå til forsiden (kun én side)
        currentIndex = 0;
    } else if (currentIndex > 1) {
        currentIndex -= 2;
    }
    renderPages();
});

nextBtn.addEventListener("click", () => {
    if (currentIndex === 0) {
        currentIndex = 1;
    } else if (currentIndex < pages.length - 2) {
        currentIndex += 2;
    }
    renderPages();
});

renderPages();