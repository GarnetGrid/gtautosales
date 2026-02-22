import { vehicleService } from './services/vehicleService.js';

document.addEventListener('DOMContentLoaded', async () => {
    /* =========================================
       1. Global Navigation & UI
       ========================================= */
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.getElementById('mainNav');
        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', () => {
            const open = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', open);
            menuToggle.textContent = open ? '✕' : '☰';
            document.body.style.overflow = open ? 'hidden' : '';
        });

        // Close on nav link click
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
                document.body.style.overflow = '';
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.textContent = '☰';
                document.body.style.overflow = '';
                menuToggle.focus();
            }
        });
    }

    /* =========================================
       2. Homepage Logic
       ========================================= */
    async function renderFeaturedCars() {
        const grid = document.getElementById('featured-grid');
        if (!grid) return;

        try {
            const vehicles = await vehicleService.getFeatured();
            const featured = vehicles.slice(0, 3);

            grid.innerHTML = featured.map(car => `
                <div class="car-card fade-in">
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
        } catch (err) {
            console.warn('Could not load featured vehicles:', err);
            grid.innerHTML = '<p style="text-align:center; color: var(--color-text-light); grid-column: 1/-1;">Unable to load featured vehicles.</p>';
        }
    }

    async function renderUpcoming() {
        const grid = document.getElementById('upcoming-grid');
        if (!grid) return;

        try {
            const upcomingVehicles = await vehicleService.getUpcoming();

            grid.innerHTML = upcomingVehicles.map(car => `
                <div class="upcoming-card fade-in">
                    <div class="car-image">
                        <img src="${car.image}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
                        <div class="upcoming-badge">Arriving ${car.arrival}</div>
                    </div>
                    <div class="car-details">
                        <h3>${car.year} ${car.make} ${car.model}</h3>
                        <div class="car-price">Est. $${car.price.toLocaleString()}</div>
                        <button class="btn-outline" onclick="alert('You will be notified when this vehicle arrives!')">Notify Me</button>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            console.warn('Could not load upcoming vehicles:', err);
        }
    }

    function renderTestimonials() {
        const grid = document.getElementById('testimonial-grid');
        if (!grid) return;

        const testimonials = [
            { name: 'Marcus J.', text: 'GT Auto Sales made the entire process smooth and stress-free. Found my dream Mustang in under a week!', rating: 5 },
            { name: 'Samantha R.', text: 'Transparent pricing and no hidden fees. The team was honest and helpful from start to finish.', rating: 5 },
            { name: 'David P.', text: 'Got pre-approved for financing in minutes. Drove off the lot the same day. Highly recommend!', rating: 5 },
        ];

        grid.innerHTML = testimonials.map(t => `
            <div class="testimonial-card fade-in">
                <div class="testimonial-quote">"</div>
                <p class="testimonial-text">${t.text}</p>
                <div class="testimonial-author">
                    <div class="author-avatar">${t.name[0]}</div>
                    <div>
                        <strong>${t.name}</strong>
                        <div class="stars">${'★'.repeat(t.rating)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /* =========================================
       3. Inventory Page Logic
       ========================================= */
    let allVehicles = [];

    async function initInventory() {
        if (!window.location.pathname.includes('inventory')) return;
        const grid = document.getElementById('inventory-grid');
        if (!grid) return;

        try {
            allVehicles = await vehicleService.getAll();
            renderInventory(allVehicles);
            setupFilters();
        } catch (err) {
            console.warn('Could not load inventory:', err);
            grid.innerHTML = '<p style="text-align:center; color:var(--color-text-light); grid-column:1/-1;">Unable to load inventory.</p>';
        }
    }

    function renderInventory(vehicles) {
        const grid = document.getElementById('inventory-grid');
        const noResults = document.getElementById('no-results');
        if (!grid) return;

        if (vehicles.length === 0) {
            grid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

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
        const typeFilter = document.getElementById('filter-type');
        const priceFilter = document.getElementById('filter-price');
        const searchFilter = document.getElementById('filter-search');

        if (!typeFilter) return;

        function applyFilters() {
            let filtered = [...allVehicles];

            // Type filter
            const type = typeFilter.value;
            if (type) {
                filtered = filtered.filter(v => v.type.toLowerCase() === type.toLowerCase());
            }

            // Price filter
            const priceRange = priceFilter.value;
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(Number);
                filtered = filtered.filter(v => v.price >= min && v.price <= max);
            }

            // Search filter
            const query = searchFilter.value.trim().toLowerCase();
            if (query) {
                filtered = filtered.filter(v =>
                    v.make.toLowerCase().includes(query) ||
                    v.model.toLowerCase().includes(query) ||
                    `${v.year}`.includes(query)
                );
            }

            renderInventory(filtered);
        }

        typeFilter.addEventListener('change', applyFilters);
        priceFilter.addEventListener('change', applyFilters);
        searchFilter.addEventListener('input', applyFilters);
    }

    /* =========================================
       4. Vehicle Detail Page Logic
       ========================================= */
    async function initVehicleDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleId = urlParams.get('id');
        if (!vehicleId) return;

        const container = document.getElementById('vehicle-detail-container');
        if (!container) return;

        try {
            const vehicle = await vehicleService.getById(vehicleId);

            if (!vehicle) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <h2>Vehicle Not Found</h2>
                        <p style="color: var(--color-text-light); margin: 1rem 0;">This vehicle may have been sold or removed.</p>
                        <a href="inventory.html" class="btn btn-primary">← Back to Inventory</a>
                    </div>`;
                return;
            }

            document.title = `${vehicle.year} ${vehicle.make} ${vehicle.model} | GT Auto Sales`;

            container.innerHTML = `
                <a href="inventory.html" style="color: var(--color-accent); text-decoration: none; display: inline-block; margin-bottom: 1.5rem;">← Back to Inventory</a>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                    <div>
                        <img src="${vehicle.image}" alt="${vehicle.year} ${vehicle.make} ${vehicle.model}"
                             style="width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);" loading="lazy">
                    </div>
                    <div>
                        <h1 style="font-family: var(--font-heading); margin-bottom: 0.5rem;">${vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
                        <div class="car-price" style="font-size: 1.8rem; margin-bottom: 1.5rem;">$${vehicle.price.toLocaleString()}</div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 2rem;">
                            <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm);"><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} mi</div>
                            <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm);"><strong>Engine:</strong> ${vehicle.specs.engine}</div>
                            <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm);"><strong>Transmission:</strong> ${vehicle.specs.transmission}</div>
                            <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm);"><strong>Drivetrain:</strong> ${vehicle.specs.drivetrain}</div>
                            <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm);"><strong>Color:</strong> ${vehicle.specs.color}</div>
                            <div style="padding: 0.75rem; background: var(--color-light); border-radius: var(--radius-sm);"><strong>Type:</strong> ${vehicle.type}</div>
                        </div>

                        <p style="color: var(--color-text-light); line-height: 1.7; margin-bottom: 2rem;">
                            ${vehicle.description || `A stunning ${vehicle.year} ${vehicle.make} ${vehicle.model}. Contact us for more details about this premium vehicle.`}
                        </p>

                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <a href="contact.html?vehicle=${encodeURIComponent(vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model)}" class="btn btn-primary">Inquire About This Vehicle</a>
                            <a href="financing.html?vehicle=${encodeURIComponent(vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model)}" class="btn btn-warm">Apply for Financing</a>
                        </div>
                    </div>
                </div>
            `;
        } catch (err) {
            console.warn('Could not load vehicle details:', err);
            container.innerHTML = '<p style="text-align:center; color:var(--color-text-light);">Unable to load vehicle details.</p>';
        }
    }

    /* =========================================
       5. Cookie Consent
       ========================================= */
    function initCookieConsent() {
        const banner = document.getElementById('cookieBanner');
        const acceptBtn = document.getElementById('cookieAccept');
        const declineBtn = document.getElementById('cookieDecline');
        if (!banner) return;

        if (localStorage.getItem('cookieConsent')) {
            banner.style.display = 'none';
            return;
        }

        banner.classList.add('visible');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.classList.remove('visible');
                setTimeout(() => banner.style.display = 'none', 400);
            });
        }
        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                banner.classList.remove('visible');
                setTimeout(() => banner.style.display = 'none', 400);
            });
        }
    }

    /* =========================================
       6. Scroll Animations
       ========================================= */
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }

    /* =========================================
       7. Init Everything
       ========================================= */
    console.log('GT Auto Sales — Main JS Loaded');

    initMobileMenu();
    initCookieConsent();

    // Await async renders, then set up scroll animations
    (async () => {
        await Promise.all([
            renderFeaturedCars(),
            renderUpcoming(),
            renderTestimonials()
        ]);
        initScrollAnimations();
    })();

    initInventory();
    initVehicleDetail();

    // Contact/Finance form prefill from URL
    const urlParams = new URLSearchParams(window.location.search);
    const vehiclePrefill = urlParams.get('vehicle');

    const messageBox = document.getElementById('leadMessage');
    if (messageBox && vehiclePrefill) {
        messageBox.value = `I am interested in the ${decodeURIComponent(vehiclePrefill)}. Please provide more information.`;
    }

    const interestBox = document.getElementById('vehicle-interest');
    const interestSection = document.getElementById('vehicle-section');
    if (interestBox && vehiclePrefill) {
        interestBox.value = decodeURIComponent(vehiclePrefill);
        if (interestSection) interestSection.style.display = 'block';
    }
});
