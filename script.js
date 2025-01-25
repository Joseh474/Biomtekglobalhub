// Selectors
const header = document.querySelector("header");
const menu = document.querySelector('#menu-icon');
const navlist = document.querySelector('.navlist');
const communityButtons = document.querySelectorAll('.btn');
const reveals = document.querySelectorAll('.reveal');
const dropdownMenu = document.querySelector('.dropdown-menu');
const dropdown = dropdownMenu.querySelector('.dropdown');
const sliderTrack = document.querySelector('.slider-track');


// search bar

function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase().trim();
    if (!searchTerm) {
        // If search is empty, show all products
        showAllProducts();
        return;
    }


    
    // Get all product rows
    const productRows = document.querySelectorAll('.row');
    let foundAny = false;

    productRows.forEach(row => {
        const productName = row.querySelector('h5')?.textContent.toLowerCase() || '';
        const productDescription = row.getAttribute('onclick')?.toLowerCase() || '';
        
        // Check if the product name or description contains the search term
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            row.style.display = "flex"; // Show matching product
            foundAny = true;
        } else {
            row.style.display = "none"; // Hide non-matching product
        }
    });

    // Show or hide sections based on whether they contain visible products
    const productSections = document.querySelectorAll('section[id]');
    productSections.forEach(section => {
        const visibleProducts = section.querySelectorAll('.row[style="display: flex;"]');
        section.style.display = visibleProducts.length > 0 ? "block" : "none";
    });

    // Show a message if no products were found
    const noResultsMsg = document.getElementById('no-results-message');
    if (!noResultsMsg) {
        const msg = document.createElement('div');
        msg.id = 'no-results-message';
        msg.style.cssText = 'text-align: center; padding: 20px; color: #666; font-size: 1.1rem;';
        document.querySelector('.product-content')?.parentNode.appendChild(msg);
    }
    
    noResultsMsg.textContent = foundAny ? '' : 'No products found matching your search.';
}

// Function to show all products
function showAllProducts() {
    const productRows = document.querySelectorAll('.row');
    const productSections = document.querySelectorAll('section[id]');
    const noResultsMsg = document.getElementById('no-results-message');

    productRows.forEach(row => row.style.display = "flex");
    productSections.forEach(section => section.style.display = "block");
    if (noResultsMsg) noResultsMsg.textContent = '';
}

// Add event listener for the search input
document.getElementById("search-bar").addEventListener('input', searchProducts);

// Add event listener for the Enter key
document.getElementById("search-bar").addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Sticky Header
window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 100);
});

// Menu Toggle
menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navlist.classList.toggle('active');
};

// Close menu on scroll
window.onscroll = () => {
    menu.classList.remove('bx-x');
    navlist.classList.remove('active');
};



// Fade-In Reveal Animation
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
});

reveals.forEach(reveal => revealObserver.observe(reveal));

// Dropdown Reveal Animation
dropdownMenu.addEventListener('mouseenter', () => {
    setTimeout(() => {
        dropdown.style.display = 'block';
        const height = dropdown.scrollHeight + 'px';
        dropdown.style.height = height;
        dropdown.style.opacity = 1;
    }, 500);
});

dropdownMenu.addEventListener('mouseleave', () => {
    dropdown.style.opacity = 0;
    dropdown.style.height = '0';
    setTimeout(() => dropdown.style.display = 'none', 500);
});

// Function to show the modal with product details
function showModal(imageSrc, productName, productDescription) {
    const modal = document.getElementById("productModal");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const modalDescription = document.getElementById("modalDescription");

    modal.style.display = "flex"; // Show modal
    modalImage.src = imageSrc; // Set modal image source
    modalCaption.textContent = productName; // Set product name
    modalDescription.textContent = productDescription; // Set product description

    // Add scroll event listener to close modal
    window.addEventListener('scroll', closeModal);
}

// Close modal function
function closeModal() {
    const modal = document.getElementById("productModal");
    modal.style.display = "none"; // Hide the modal

    // Remove scroll event listener to prevent multiple calls
    window.removeEventListener('scroll', closeModal);
}

// Event listener for the close button
const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeModal);

// WhatsApp Functionality
function openWhatsApp(productName) {
    const message = `Hello, I'm interested in the ${productName}. Can you provide more information about its specifications and pricing?`;
    window.open(`https://wa.me/+2547?text=${encodeURIComponent(message)}`, '_blank');
}

// Smooth Scroll
document.querySelectorAll('a[href^="#contact"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Tooltip Functionality
document.querySelectorAll('.contact-social a').forEach(icon => {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.innerText = icon.classList[0].replace('icon-', '');
    icon.appendChild(tooltip);

    icon.addEventListener('mouseover', () => {
        tooltip.style.opacity = 1;
        tooltip.style.visibility = 'visible';
    });

    icon.addEventListener('mouseout', () => {
        tooltip.style.opacity = 0;
        tooltip.style.visibility = 'hidden';
    });
});

// Slider Animation
setInterval(() => {

    sliderTrack.offsetHeight;
    sliderTrack.style.animation = '';
}, 10000); // Restart animation every 10 seconds

// Function to show the modal with product details

function animateBrands() {
    position = -2; // Move left by 2 pixels
    if (position <-brandsContainer.offsetWidth) {
        position = window.innerWidth; // Reset position to start again
    }
    brandsContainer.style.transform = `translateX($100px)`;
    requestAnimationFrame(animateBrands); // Call the function again for the next frame
}

// Start the animation
animateBrands();


function loadPage(url) {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; // Show the loader
    setTimeout(() => {
        window.location.href = url; // Redirect after 7 seconds
    }, 2000);
}





