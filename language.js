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

// Load saved language
const savedLang = localStorage.getItem("selectedLanguage") || "en";
currentLanguage.textContent = languages[savedLang].name;
currentFlag.className = "fi " + languages[savedLang].flag;
applyTranslations(savedLang);

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

    item.addEventListener("click", function () {

        const lang = item.dataset.lang;

        currentLanguage.textContent = languages[lang].name;
        currentFlag.className = "fi " + languages[lang].flag;
        applyTranslations(lang);

        localStorage.setItem("selectedLanguage", lang);

        switcher.classList.remove("open");

    });

});

function applyTranslations(lang){

    document.querySelectorAll("[data-i18n]").forEach(function(element){

        const key = element.dataset.i18n;

        if(translations[lang] && translations[lang][key]){

            element.textContent = translations[lang][key];

        }

    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function(element){

        const key = element.dataset.i18nPlaceholder;

        if(translations[lang] && translations[lang][key]){

            element.placeholder = translations[lang][key];

        }

    });

    document.body.classList.remove("translations-loading");
    document.body.classList.add("translations-ready");

}