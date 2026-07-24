/* ==========================================
   PRESTO GALLERY
   Part 1
========================================== */

/* ===========================
   GET CATEGORY
=========================== */

const params = new URLSearchParams(window.location.search);

const currentCategory = params.get("cat");


/* ===========================
   PAGE ELEMENTS
=========================== */

const container =
    document.getElementById("productsContainer");

const title =
    document.getElementById("galleryTitle");

const searchBoxes = [

    document.getElementById("searchInput"),

    document.getElementById("navSearchInput")

].filter(Boolean);

searchBoxes.forEach(box=>{

    box.addEventListener("input",function(){

        const keyword=this.value.trim().toLowerCase();

        searchBoxes.forEach(input=>{

            if(input!==this){

                input.value=this.value;

            }

        });

        const result=filteredProducts.filter(product=>

            product.name.toLowerCase().includes(keyword) ||

            product.description.toLowerCase().includes(keyword)

        );

        renderProducts(result);

    });

});


/* ===========================
   CATEGORY TITLES
=========================== */

const categoryNames = {

    presto: "PRESTO Self Inking",

    shiny: "Shiny Stamps",

    flash_i: "Flash Stamps • I-Series",

    flash_e: "Flash Stamps • E-Series",

    flash_nsp: "Flash Stamps • NSP Series",

    flash_machine: "Flash Machines",

    polymer_machine: "Polymer Machines",

    shiny_ink: "Shiny Inks",

    noris_ink: "Noris Inks",

    flash_ink: "Flash Inks",

    gel_stamp: "Gel Stamps",

    foams: "Foams",

    liquid_polymer: "Liquid Polymers",

    sachets: "Sachets",

    backup_sheet: "Backup Sheets",

    stamp_pad: "Stamp Pads",

    others: "Accessories"

};


/* ===========================
   SET PAGE TITLE
=========================== */

if (title) {
    title.textContent =
        categoryNames[currentCategory] ||
        "PRESTO Products";
}


/* ===========================
   FILTER PRODUCTS
=========================== */
let filteredProducts =
    products.filter(product =>
        product.category === currentCategory);


/* ===========================
   COLOUR CIRCLES
=========================== */

function buildColours(product) {

    if (
        !product.colours ||
        product.colours.length === 0
    ) {

        return "";

    }

    let circles = "";

    const colours = product.colours.split(",").map(c=> c.trim())

    colours.forEach(colour => {

        circles +=

            `<span class="colour ${colour}"></span>`;

    });

    return `

    <div class="product-colours">

        <span>

            Colours

        </span>

        <div class="colour-list">

            ${circles}

        </div>

    </div>

    `;

}


function getWhatsAppLink(product) {

    return `https://wa.me/919007571931?text=${encodeURIComponent(
        `Hello PRESTO,

I am interested in:

${product.name}

Please send me complete details.`
    )}`;

}

/* ===========================
   RENDER PRODUCTS
=========================== */

function createProductActions(product) {

    return `

    <div class="product-actions">

        <a
        class="btn primary whatsapp-btn"
        target="_blank"
        href="${getWhatsAppLink(product)}">

            <i class="fab fa-whatsapp"></i>

            WhatsApp

        </a>

        <a
        class="btn secondary enquiry-btn"
        href="contact.html?product=${encodeURIComponent(product.name)}">

            Contact

        </a>

    </div>

    `;

}

function createProductCard(product) {
    const loading = product.loading === true;
    const hideColours = [

        "shiny_ink",

        "noris_ink",

        "flash_ink"

    ].includes(product.category);

    const colourHTML =
        hideColours
            ? '<div class="product-colours empty"></div>'
            : buildColours(product);

    return `

<div class="product-card ${loading ? "skeleton-card" : "animate"}">

    <div class="product-preview">

        ${
            loading
            ? `<div class="skeleton-image"></div>`
            : `<img
                    class="product-image"
                    src="${product.image1}"
                    alt="${product.name}"
                    data-index="${filteredProducts.indexOf(product)}">`
        }

        ${
            loading
            ? `<div class="skeleton-title"></div>`
            : `<h3>${product.name}</h3>`
        }

        ${
            loading
            ? `<div class="skeleton-text"></div>`
            : `<p>${product.description}</p>`
        }

    </div>

    ${
        loading
        ? `
        <div class="product-colours">
            <div class="skeleton-colours"></div>
        </div>

        <div class="product-actions">
            <div class="skeleton-button"></div>
            <div class="skeleton-button"></div>
        </div>
        `
        : `
        ${colourHTML}
        ${createProductActions(product)}
        `
    }

</div>

`;

}

function noProducts() {

    return `

    <div class="product-card">
        <div class="no-product-preview">

            <h3>

            No Products Found

            </h3>

            <p>

            Products for this category
            will be added soon.

            </p>
        </div>

    </div>

    `;

}


function renderProducts(list) {

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = noProducts();

        return;

    }

    list.forEach(product => {

        container.innerHTML += createProductCard(product);
        container.querySelectorAll(".product-image").forEach(img => {

            img.onclick = function(){

                const product = filteredProducts[this.dataset.index];

                openImageViewer(
                    [product.image1, product.image2, product.image3].filter(Boolean),
                    product.name,
                    product.description
                );

            };

        });

    });

    const cards = container.querySelectorAll(".product-card");

    requestAnimationFrame(() => {

        cards.forEach(card => {

            card.classList.add("show");

        });

    });

}


/* ===========================
   INITIAL LOAD
=========================== */
function showSkeletons(){

    const skeletons = [];

    for(let i = 0; i < 8; i++){

        skeletons.push({

            loading:true,

            image1:"",

            name:"",

            description:"",

            category:""

        });

    }

    renderProducts(skeletons);

}
async function loadProducts(){

    showSkeletons();

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .eq("category", currentCategory);
        // .eq("active", true);

    if(error){

        console.error(error);

        return;

    }

    console.log(data);

    filteredProducts = data.map(product => ({

        ...product,

        image1: product.image1
            ? `${SUPABASE_URL}/storage/v1/object/public/products/${product.image1}`
            : "",

        image2: product.image2
            ? `${SUPABASE_URL}/storage/v1/object/public/products/${product.image2}`
            : "",

        image3: product.image3
            ? `${SUPABASE_URL}/storage/v1/object/public/products/${product.image3}`
            : ""

    }));

    renderProducts(filteredProducts);

}

loadProducts();

/* ==========================================
   PRESTO GALLERY
   Part 2
========================================== */


/* ===========================
   LIVE SEARCH
=========================== */

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const keyword =
            this.value
                .trim()
                .toLowerCase();

        const result =

            filteredProducts.filter(product => {

                return (

                    product.name
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    product.description
                        .toLowerCase()
                        .includes(keyword)

                );

            });

        renderProducts(result);

    });

}


/* ===========================
   SCROLL TO TOP
=========================== */

window.scrollTo({

    top: 0,

    behavior: "smooth"

});


/* ===========================
   GSAP PRODUCT REVEAL
=========================== */

if (typeof gsap !== "undefined") {

    gsap.from(".product-card", {

        opacity: 0,

        y: 50,

        duration: .8,

        stagger: .08,

        ease: "power3.out"

    });

}


/* ===========================
   IMAGE FALLBACK
=========================== */

document
    .querySelectorAll(".product-card img")
    .forEach(img => {

        img.onerror = function () {

            this.src =
                "assets/images/no-image.png";

        };

    });


/* ===========================
   CONSOLE
=========================== */

console.log(

    "PRESTO Gallery Loaded"

);

/*=========================
  Product Image Viewer
=========================*/

let currentImages = [];
let currentIndex = 0;

function getProductImages(product){

    return Object.keys(product)
        .filter(key => key.startsWith("image") && product[key])
        .sort()
        .map(key => product[key]);

}

function openImageViewer(images, title = "", description = ""){

    if(!Array.isArray(images)){
        images = [images];
    }

    currentImages = images;

    currentIndex = 0;
    updateViewerCounter();

    const viewer = document.getElementById("imageViewer");
    const viewerImage = document.getElementById("viewerImage");

    document.getElementById("viewerTitle").textContent = title;
    document.getElementById("viewerDescription").textContent = description;

    viewerImage.style.opacity = "0";

    viewerImage.onload = function(){

        viewerImage.style.opacity = "1";
        viewer.classList.add("show");

    };

    viewerImage.src = currentImages[currentIndex];

}

function showNextImage(){

    if(currentImages.length <= 1) return;

    currentIndex++;

    if(currentIndex >= currentImages.length){
        currentIndex = 0;
    }

    changeViewerImage();
    updateViewerCounter();

}

function showPreviousImage(){

    if(currentImages.length <= 1) return;

    currentIndex--;

    if(currentIndex < 0){
        currentIndex = currentImages.length - 1;
    }

    changeViewerImage();
    updateViewerCounter();

}

function changeViewerImage(){

    const img = document.getElementById("viewerImage");

    img.style.opacity = "0";

    img.onload = function(){

        img.style.opacity = "1";

    };

    img.src = currentImages[currentIndex];

}

function closeImageViewer(){

    document
        .getElementById("imageViewer")
        .classList.remove("show");

}

document
.getElementById("imageViewer")
.addEventListener("click", function(e){

    if(e.target === this){

        closeImageViewer();

    }

});

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        closeImageViewer();

    }

});

document
.getElementById("nextImage")
.addEventListener("click", function(e){

    e.stopPropagation();

    showNextImage();

});

document
.getElementById("prevImage")
.addEventListener("click", function(e){

    e.stopPropagation();

    showPreviousImage();

});

function updateViewerCounter(){

    const counter = document.getElementById("viewerCounter");

    const prevBtn = document.getElementById("prevImage");
    const nextBtn = document.getElementById("nextImage");

    if(!counter) return;

        if(currentImages.length <= 1){

            counter.style.display = "none";

            prevBtn.style.display = "none";

            nextBtn.style.display = "none";

        }else{

            counter.style.display = "block";

            prevBtn.style.display = "flex";

            nextBtn.style.display = "flex";

            counter.textContent =
                `${currentIndex + 1} / ${currentImages.length}`;

        }

}

const navSearch = document.querySelector(".nav-search");

window.addEventListener("scroll", function(){

    if(window.scrollY > 200){

        navSearch.classList.add("show");

    }else{

        navSearch.classList.remove("show");

    }

});