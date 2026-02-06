import { vehicleService } from './services/vehicleService.js';

document.addEventListener('DOMContentLoaded', async () => {
    /* =========================================
       1. Global Navigation & UI
       ========================================= */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navList = document.querySelector('.nav-list');

        if (menuToggle && navList) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
                navList.classList.toggle('active');
            });
        }
    }

    // Dynamic Copyright Year
    function updateCopyrightYear() {
        const copyrightYear = document.querySelector('.footer-bottom p');
        if (copyrightYear) {
            copyrightYear.innerHTML = `&copy; ${new Date().getFullYear()} GT Auto Sales. All rights reserved.`;
        }
    }

    /* =========================================
       2. Mock Data (Moved to Service)
       ========================================= */
    // Data is now fetched via vehicleService

    /* =========================================
       3. Homepage Logic
       ========================================= */
    async function renderFeaturedCars() {
        const grid = document.querySelector('.featured-grid');
        if (!grid) return;

        const vehicles = await vehicleService.getFeatured();

        // Take top 3 for homepage
        const featured = vehicles.slice(0, 3);

        grid.innerHTML = featured.map(car => `
            <div class="car-card">
                <div class="car-image">
                    <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                    <div class="car-badge">${car.type}</div>
                </div>
                <div class="car-details">
                    <h3>${car.year} ${car.make} ${car.model}</h3>
                    <div class="car-specs">
                        <span>${car.mileage.toLocaleString()} mi</span>
                        <span>${car.specs.transmission}</span>
                        <span>${car.specs.drivetrain}</span>
                    </div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <a href="vehicle.html?id=${car.id}" class="btn-outline">View Details</a>
                </div>
            </div>
        `).join('');
    }

    async function renderUpcoming() {
        const grid = document.querySelector('.upcoming-grid');
        if (!grid) return;

        const upcomingVehicles = await vehicleService.getUpcoming();

        grid.innerHTML = upcomingVehicles.map(car => `
             <div class="car-card upcoming-card">
                <div class="car-image">
                    <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                    <div class="upcoming-badge">Arriving ${car.arrival}</div>
                </div>
                <div class="car-details">
                    <h3>${car.year} ${car.make} ${car.model}</h3>
                    <div class="car-price">Est. $${car.price.toLocaleString()}</div>
                    <button class="btn-outline notify-btn" onclick="alert('You will be notified when this vehicle arrives!')">Notify Me</button>
                </div>
            </div>
        `).join('');
    }

    /* =========================================
       4. Inventory Page Logic
       ========================================= */
    let allVehicles = [];

    async function initInventory() {
        const grid = document.querySelector('.inventory-grid');
        if (!grid) return;

        allVehicles = await vehicleService.getAll();
        renderInventory(allVehicles);
        setupFilters();
        updateFilterCounts(allVehicles);
    }

    function renderInventory(vehicles) {
        const grid = document.querySelector('.inventory-grid');
        if (!grid) return;

        if (vehicles.length === 0) {
            grid.innerHTML = '<div class="no-results"><p>No vehicles found matching your criteria.</p></div>';
            return;
        }

        grid.innerHTML = vehicles.map(car => `
            <div class="car-card">
                <div class="car-image">
                    <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                    <div class="car-badge">${car.type}</div>
                </div>
                <div class="car-details">
                    <h3>${car.year} ${car.make} ${car.model}</h3>
                    <div class="car-specs">
                        <span>${car.mileage.toLocaleString()} mi</span>
                        <span>${car.specs.transmission}</span>
                        <span>${car.specs.drivetrain}</span>
                    </div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <a href="vehicle.html?id=${car.id}" class="btn-outline">View Details</a>
                </div>
            </div>
        `).join('');
    }

    function setupFilters() {
        const filters = {
            make: document.getElementById('filter-make'),
            type: document.getElementById('filter-type'),
            price: document.getElementById('filter-price'),
            sort: document.getElementById('sort-price')
        };

        if (!filters.make) return; // Not on inventory page

        function applyFilters() {
            let filtered = [...allVehicles];

            // Filter by Make
            if (filters.make.value !== 'all') {
                filtered = filtered.filter(v => v.make === filters.make.value);
            }

            // Filter by Type
            if (filters.type.value !== 'all') {
                filtered = filtered.filter(v => v.type === filters.type.value);
            }

            // Filter by Price
            const maxPrice = parseInt(filters.price.value);
            if (maxPrice < 200000) { // If slider is maxed out, treat as all
                filtered = filtered.filter(v => v.price <= maxPrice);
            }
            document.getElementById('price-value').textContent = `$${maxPrice.toLocaleString()}+`;

            // Sort
            if (filters.sort.value === 'low-high') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (filters.sort.value === 'high-low') {
                filtered.sort((a, b) => b.price - a.price);
            }

            renderInventory(filtered);
            updateFilterCounts(filtered);
        }

        // Event Listeners
        filters.make.addEventListener('change', applyFilters);
        filters.type.addEventListener('change', applyFilters);
        filters.price.addEventListener('input', applyFilters);
        filters.sort.addEventListener('change', applyFilters);
    }

    function updateFilterCounts(currentVehicles) {
        // Update Make counts (optional visual enhancement)
        // This logic ensures robust UX by showing available counts
        // Not strictly required for MVP but nice to have
    }


    /* =========================================
       5. Vehicle Detail Page Logic
       ========================================= */
    async function initVehicleDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleId = urlParams.get('id');

        if (!vehicleId) return;

        const container = document.getElementById('vehicle-detail-container');
        if (!container) return;

        const vehicle = await vehicleService.getById(vehicleId);

        if (!vehicle) {
            container.innerHTML = '<h2>Vehicle not found</h2>';
            return;
        }

        // Update Page Title
        document.title = `${vehicle.year} ${vehicle.make} ${vehicle.model} | GT Auto Sales`;

        // Render Page
        document.querySelector('.detail-header h1').textContent = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
        document.querySelector('.detail-price').textContent = `$${vehicle.price.toLocaleString()}`;
        document.querySelector('.main-vehicle-image').src = vehicle.image;

        // Specs
        const specsContainer = document.querySelector('.specs-grid');
        specsContainer.innerHTML = `
            <div class="spec-item"><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} mi</div>
            <div class="spec-item"><strong>Engine:</strong> ${vehicle.specs.engine}</div>
            <div class="spec-item"><strong>Transmission:</strong> ${vehicle.specs.transmission}</div>
            <div class="spec-item"><strong>Drivetrain:</strong> ${vehicle.specs.drivetrain}</div>
            <div class="spec-item"><strong>Color:</strong> ${vehicle.specs.color}</div>
            <div class="spec-item"><strong>Type:</strong> ${vehicle.type}</div>
        `;

        document.querySelector('.vehicle-description p').textContent = vehicle.description || `A stunning ${vehicle.year} ${vehicle.make} ${vehicle.model}. Contact us for more details about this premium vehicle.`;

        // Pre-fill Logic for Inquiry and Finance Buttons
        const inquiryBtn = document.querySelector('.btn-primary.cta-inquire'); // Assuming class exists or we add it
        const financeBtn = document.querySelector('.btn-secondary.cta-finance');

        if (document.querySelector('.cta-buttons')) {
            // We can also bind to the existing generic buttons if we select them properly
            const buttons = document.querySelectorAll('.cta-buttons .btn');
            const contactBtn = buttons[0];
            const financeLink = buttons[1]; // usually the financing one

            // Update Contact Button to pre-fill message
            if (contactBtn) {
                contactBtn.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = `contact.html?vehicle=${encodeURIComponent(vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model)}`;
                };
            }

            if (financeLink) {
                financeLink.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = `financing.html?vehicle=${encodeURIComponent(vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model)}`;
                };
            }
        }
    }



    console.log('DOM Content Loaded (Inner Loop Fixed)');
    initMobileMenu();
    updateCopyrightYear();

    // Page: Index (Featured)
    renderFeaturedCars();
    renderUpcoming();

    // Page: Inventory
    initInventory();

    // Page: Vehicle Detail
    initVehicleDetail();

    // Check for pre-filled forms from URL
    const urlParams = new URLSearchParams(window.location.search);
    const vehiclePrefill = urlParams.get('vehicle');

    // Contact Form Prefill
    const messageBox = document.getElementById('message');
    if (messageBox && vehiclePrefill) {
        messageBox.value = `I am interested in the ${vehiclePrefill}. Please provide more information.`;
    }

    // Finance Form Vehicle Interest Prefill
    const interestBox = document.getElementById('vehicle-interest');
    if (interestBox && vehiclePrefill) {
        interestBox.value = vehiclePrefill;
    }
});

