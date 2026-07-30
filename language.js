const switcher = document.querySelector(".language-switcher");
const button = document.querySelector(".language-btn");
const currentLanguage = document.getElementById("currentLanguage");
const currentFlag = document.getElementById("currentFlag");

// Language names
const languages = {
    en: { name: "English", flag: "fi-us" },
    hi: { name: "हिन्दी", flag: "fi-in" },
    es: { name: "Español", flag: "fi-es" },
    ru: { name: "Русский", flag: "fi-ru" },
    fr: { name: "Français", flag: "fi-fr" },
    ar: { name: "العربية", flag: "fi-sa" },
    de: { name: "Deutsch", flag: "fi-de" }
};

// Detect language from URL
const path = window.location.pathname.toLowerCase();

let currentLang = "en";

if (path.includes("/hi/")) currentLang = "hi";
else if (path.includes("/fr/")) currentLang = "fr";
else if (path.includes("/de/")) currentLang = "de";
else if (path.includes("/es/")) currentLang = "es";
else if (path.includes("/ru/")) currentLang = "ru";
else if (path.includes("/ar/")) currentLang = "ar";

// Fallback to saved language only for English pages
currentLanguage.textContent = languages[currentLang].name;
currentFlag.className = "fi " + languages[currentLang].flag;

currentLanguage.textContent = languages[currentLang].name;
currentFlag.className = "fi " + languages[currentLang].flag;


requestAnimationFrame(() => {
    button.classList.add("loaded")
});

// Open / Close dropdown
button.addEventListener("click", function (e) {

    e.stopPropagation();

    switcher.classList.toggle("open");

});

// Close when clicking outside
document.addEventListener("click", function () {

    switcher.classList.remove("open");

});

// Language selection
document.querySelectorAll(".language-menu a").forEach(function (item) {

    item.addEventListener("click", function (e) {

        e.preventDefault();

        const lang = item.dataset.lang;

        localStorage.setItem("selectedLanguage", lang);

        const file = window.location.pathname.split("/").pop() || "index.html";
        const query = window.location.search;

        let target;

        if (lang === "en") {
            target = "../" + file + query;

            // If already on English website
            if (!window.location.pathname.includes("/hi/")
                && !window.location.pathname.includes("/fr/")
                && !window.location.pathname.includes("/de/")
                && !window.location.pathname.includes("/es/")
                && !window.location.pathname.includes("/ru/")
                && !window.location.pathname.includes("/ar/")) {

                target = file + query;
            }

        } else {

            target = "../" + lang + "/" + file + query;

            // If currently on English site
            if (!window.location.pathname.includes("/hi/")
                && !window.location.pathname.includes("/fr/")
                && !window.location.pathname.includes("/de/")
                && !window.location.pathname.includes("/es/")
                && !window.location.pathname.includes("/ru/")
                && !window.location.pathname.includes("/ar/")) {

                target = lang + "/" + file + query;
            }

        }

        window.location.href = target;

    });

});