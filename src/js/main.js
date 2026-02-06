document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. Global Navigation & UI
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });
    }

    // Dynamic Copyright Year
    const copyrightYear = document.querySelector('.footer-bottom p');
    if (copyrightYear) {
        copyrightYear.innerHTML = `&copy; ${new Date().getFullYear()} GT Auto Sales. All rights reserved.`;
    }

    /* =========================================
       2. Data Source (Mock Database)
       ========================================= */
    const mockCars = [
        // Sports
        { id: 1, make: 'BMW', model: 'M4 Competition', year: 2022, price: 85000, mileage: 12000, color: 'Frozen Black', type: 'Sports', engine: '3.0L I6 Twin-Turbo', transmission: 'Automatic', image: 'assets/car1.jpg', description: 'Experience the ultimate driving machine.' },
        { id: 2, make: 'Mercedes', model: 'AMG GT', year: 2021, price: 92000, mileage: 8500, color: 'Selenite Grey', type: 'Sports', engine: '4.0L V8 Biturbo', transmission: 'Automatic', image: 'assets/car2.jpg', description: 'Pure performance and luxury combined.' },
        { id: 3, make: 'Porsche', model: '911 Carrera', year: 2020, price: 105000, mileage: 15000, color: 'Guards Red', type: 'Sports', engine: '3.0L H6 Twin-Turbo', transmission: 'PDK', image: 'assets/car3.jpg', description: 'The icon of sports cars.' },
        { id: 4, make: 'Audi', model: 'R8 V10', year: 2020, price: 145000, mileage: 9000, color: 'Ara Blue', type: 'Sports', engine: '5.2L V10', transmission: 'Automatic', image: 'assets/car1.jpg', description: 'Everyday supercar performance.' },
        { id: 5, make: 'Chevrolet', model: 'Corvette C8', year: 2023, price: 75000, mileage: 2500, color: 'Torch Red', type: 'Sports', engine: '6.2L V8', transmission: 'Automatic', image: 'assets/car2.jpg', description: 'Mid-engine masterpiece.' },

        // SUVs
        { id: 6, make: 'Range Rover', model: 'Autobiography', year: 2023, price: 120000, mileage: 5000, color: 'Santorini Black', type: 'SUV', engine: '4.4L V8', transmission: 'Automatic', image: 'assets/suv1.jpg', description: 'The pinnacle of refined capability.' },
        { id: 7, make: 'BMW', model: 'X5 M', year: 2021, price: 95000, mileage: 18000, color: 'Marina Bay Blue', type: 'SUV', engine: '4.4L V8 Twin-Turbo', transmission: 'Automatic', image: 'assets/suv1.jpg', description: 'Sports activity vehicle with M power.' },
        { id: 8, make: 'Mercedes', model: 'G63 AMG', year: 2020, price: 180000, mileage: 22000, color: 'Matte Black', type: 'SUV', engine: '4.0L V8 Biturbo', transmission: 'Automatic', image: 'assets/suv1.jpg', description: 'The legendary off-roader.' },
        { id: 9, make: 'Audi', model: 'RS Q8', year: 2022, price: 115000, mileage: 11000, color: 'Dragon Orange', type: 'SUV', engine: '4.0L V8 Twin-Turbo', transmission: 'Automatic', image: 'assets/suv1.jpg', description: 'Performance SUV with coupe styling.' },
        { id: 10, make: 'Cadillac', model: 'Escalade V', year: 2023, price: 155000, mileage: 3000, color: 'White', type: 'SUV', engine: '6.2L Supercharged V8', transmission: 'Automatic', image: 'assets/suv1.jpg', description: 'American luxury with immense power.' },

        // Sedans
        { id: 11, make: 'BMW', model: 'M5 CS', year: 2022, price: 135000, mileage: 6000, color: 'Frozen Deep Green', type: 'Sedan', engine: '4.4L V8 Twin-Turbo', transmission: 'Automatic', image: 'assets/sedan1.jpg', description: 'The quickest production BMW ever.' },
        { id: 12, make: 'Mercedes', model: 'E63 S AMG', year: 2021, price: 108000, mileage: 14000, color: 'Graphite Grey', type: 'Sedan', engine: '4.0L V8 Biturbo', transmission: 'Automatic', image: 'assets/sedan1.jpg', description: 'Executive sedan with supercar DNA.' },
        { id: 13, make: 'Audi', model: 'RS7', year: 2022, price: 118000, mileage: 9500, color: 'Nardo Grey', type: 'Sedan', engine: '4.0L V8 Twin-Turbo', transmission: 'Automatic', image: 'assets/sedan1.jpg', description: 'Stunning sportback design.' },
        { id: 14, make: 'Tesla', model: 'Model S Plaid', year: 2022, price: 98000, mileage: 8000, color: 'Red Multi-Coat', type: 'Sedan', engine: 'Tri-Motor Electric', transmission: 'Automatic', image: 'assets/sedan1.jpg', description: 'Beyond ludicrous.' },
        { id: 15, make: 'Lexus', model: 'IS 500', year: 2023, price: 65000, mileage: 4000, color: 'Ultrasonic Blue', type: 'Sedan', engine: '5.0L V8', transmission: 'Automatic', image: 'assets/sedan1.jpg', description: 'Old school V8 charm.' }
    ];

    /* =========================================
       3. Helper Functions
       ========================================= */
    function createCarCard(car) {
        return `
            <div class="car-card">
                <div class="car-image-container">
                    <img src="${car.image}" alt="${car.make} ${car.model}" class="car-img">
                </div>
                <div class="car-details">
                    <h3>${car.year} ${car.make} ${car.model}</h3>
                    <p class="price">$${car.price.toLocaleString()}</p>
                    <p class="specs">
                        <span>${car.mileage.toLocaleString()} mi</span> • <span>${car.transmission}</span>
                    </p>
                    <a href="vehicle.html?id=${car.id}" class="btn btn-primary btn-block">View Details</a>
                </div>
            </div>
        `;
    }

    function renderInventory(cars, container) {
        if (!container) return;
        if (cars.length === 0) {
            container.innerHTML = `<div class="no-results"><p>No vehicles found matching your criteria.</p></div>`;
            return;
        }
        container.innerHTML = cars.map(createCarCard).join('');
    }

    /* =========================================
       4. Page Specific Logic
       ========================================= */

    // Homepage: Featured Vehicles
    const featuredContainer = document.querySelector('.featured-grid');
    if (featuredContainer) {
        const featuredCars = [...mockCars].sort(() => 0.5 - Math.random()).slice(0, 3);
        renderInventory(featuredCars, featuredContainer);
    }

    // Homepage: Upcoming Vehicles
    const upcomingContainer = document.getElementById('upcoming-cars');
    if (upcomingContainer) {
        const upcomingCars = [
            { id: 101, make: 'Ferrari', model: 'F8 Tributo', year: 2023, price: 320000, mileage: 0, color: 'Rosso Corsa', type: 'Exotic', engine: '3.9L V8 Twin-Turbo', transmission: 'Automatic', image: 'assets/car1.jpg', description: 'Coming soon.' },
            { id: 102, make: 'Lamborghini', model: 'Huracan Evo', year: 2022, price: 280000, mileage: 1200, color: 'Verde Mantis', type: 'Exotic', engine: '5.2L V10', transmission: 'Automatic', image: 'assets/car2.jpg', description: 'Arriving next week.' },
            { id: 103, make: 'McLaren', model: '765LT', year: 2022, price: 380000, mileage: 500, color: 'McLaren Orange', type: 'Exotic', engine: '4.0L V8 Twin-Turbo', transmission: 'Automatic', image: 'assets/car3.jpg', description: 'Track weapon.' }
        ];
        // Reuse createCarCard but maybe we should flag them as "Coming Soon"?
        // For simplicity, reusing standard card.
        renderInventory(upcomingCars, upcomingContainer);
    }

    // Inventory Page: Full List & Filtering
    const inventoryGrid = document.querySelector('.inventory-grid');
    const filterForm = document.getElementById('inventory-filters');

    if (inventoryGrid) {
        // Initial Render
        renderInventory(mockCars, inventoryGrid);

        // Filter Logic
        if (filterForm) {
            filterForm.addEventListener('input', () => {
                const formData = new FormData(filterForm);
                const criteria = {
                    make: formData.get('make'),
                    priceMax: Number(formData.get('price')),
                    type: formData.get('type'),
                    yearMin: Number(formData.get('year-min')),
                    yearMax: Number(formData.get('year-max'))
                };

                const filteredCars = mockCars.filter(car => {
                    if (criteria.make && criteria.make !== 'all' && car.make !== criteria.make) return false;
                    if (criteria.type && criteria.type !== 'all' && car.type !== criteria.type) return false;
                    if (criteria.priceMax && car.price > criteria.priceMax) return false;
                    if (criteria.yearMin && car.year < criteria.yearMin) return false;
                    if (criteria.yearMax && car.year > criteria.yearMax) return false;
                    return true;
                });

                renderInventory(filteredCars, inventoryGrid);
            });
        }
    }

    // Vehicle Detail Page Logic
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    const vehicleDetailContainer = document.getElementById('vehicle-detail-container');

    if (vehicleId && vehicleDetailContainer) {
        const car = mockCars.find(c => c.id == vehicleId);

        if (car) {
            document.title = `${car.year} ${car.make} ${car.model} | GT Auto Sales`;
            vehicleDetailContainer.innerHTML = `
                <div class="vehicle-header">
                    <h1>${car.year} ${car.make} ${car.model}</h1>
                    <p class="price">$${car.price.toLocaleString()}</p>
                </div>
                <div class="vehicle-grid">
                    <div class="vehicle-gallery">
                        <img src="${car.image}" alt="${car.make} ${car.model}">
                    </div>
                    <div class="vehicle-info">
                        <h3>Specifications</h3>
                        <ul class="specs-list">
                            <li><strong>Mileage:</strong> ${car.mileage.toLocaleString()} mi</li>
                            <li><strong>Type:</strong> ${car.type}</li>
                            <li><strong>Engine:</strong> ${car.engine}</li>
                            <li><strong>Transmission:</strong> ${car.transmission}</li>
                            <li><strong>Color:</strong> ${car.color}</li>
                            <li><strong>VIN:</strong> VIN${Math.random().toString(36).substr(2, 9).toUpperCase()}</li>
                        </ul>
                        <h3>Description</h3>
                        <p>${car.description}</p>
                        <div class="action-buttons">
                            <a href="contact.html?vehicle=${car.id}" class="btn btn-primary">Request Info</a>
                            <a href="financing.html?vehicle=${car.id}" class="btn btn-secondary">Apply for Financing</a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            vehicleDetailContainer.innerHTML = '<p>Vehicle not found.</p>';
        }
    }

    // Contact & Financing Page Pre-fill Logic
    const messageInput = document.getElementById('message');
    const vehicleInterestInput = document.getElementById('vehicle-interest');
    const vehicleSection = document.getElementById('vehicle-section');

    // Check URL params for vehicle ID (reusing urlParams from above)
    const targetVehicleId = urlParams.get('vehicle');
    const targetService = urlParams.get('service');

    if (targetVehicleId) {
        const car = mockCars.find(c => c.id == targetVehicleId);
        if (car) {
            // Contact Page
            if (messageInput) {
                messageInput.value = `I am interested in the ${car.year} ${car.make} ${car.model} listed for $${car.price.toLocaleString()}. Is it still available?`;
            }
            // Financing Page
            if (vehicleInterestInput) {
                vehicleInterestInput.value = `${car.year} ${car.make} ${car.model} ($${car.price.toLocaleString()})`;
                if (vehicleSection) vehicleSection.style.display = 'block';
            }
        }
    }

    if (targetService && messageInput) {
        const services = {
            'detail': 'Detailing & Car Wash',
            'body': 'Body Shop & Collision',
            'tuning': 'Performance Tuning'
        };
        const serviceName = services[targetService] || 'Service';
        messageInput.value = `I would like to book an appointment for: ${serviceName}.`;
    }

    /* =========================================
       6. Global Components (Cookie Consent)
       ========================================= */
    if (!localStorage.getItem('cookieConsent')) {
        const consentBanner = document.createElement('div');
        consentBanner.id = 'cookie-consent';
        consentBanner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to improve your experience. <a href="privacy.html">Privacy Policy</a>.</p>
                <button id="accept-cookies" class="btn btn-primary">Accept</button>
            </div>
        `;
        document.body.appendChild(consentBanner);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            consentBanner.remove();
        });
    }
});
