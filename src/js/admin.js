import { vehicleService } from './services/vehicleService.js';

let inventory = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
    setupModal();
    setupForm();
    setupSearch();
});

/* =========================================
   Initialization
   ========================================= */
async function initAdmin() {
    inventory = await vehicleService.getAll();
    renderTable(inventory);
    updateStats();
}

/* =========================================
   Stats Dashboard
   ========================================= */
function updateStats() {
    const total = inventory.length;
    const featured = inventory.filter(v => v.featured).length;
    const totalValue = inventory.reduce((sum, v) => sum + v.price, 0);
    const avgPrice = total > 0 ? Math.round(totalValue / total) : 0;

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statFeatured').textContent = featured;
    document.getElementById('statValue').textContent = '$' + totalValue.toLocaleString();
    document.getElementById('statAvg').textContent = '$' + avgPrice.toLocaleString();
}

/* =========================================
   Search, Filter & Sort
   ========================================= */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterSort = document.getElementById('filterSort');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (filterType) filterType.addEventListener('change', applyFilters);
    if (filterSort) filterSort.addEventListener('change', applyFilters);
}

function applyFilters() {
    const query = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const type = document.getElementById('filterType')?.value || '';
    const sort = document.getElementById('filterSort')?.value || 'newest';

    let filtered = [...inventory];

    // Search
    if (query) {
        filtered = filtered.filter(v =>
            `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(query) ||
            v.type.toLowerCase().includes(query)
        );
    }

    // Filter by type
    if (type) {
        filtered = filtered.filter(v => v.type === type);
    }

    // Sort
    switch (sort) {
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'mileage':
            filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
            break;
        case 'newest':
        default:
            filtered.sort((a, b) => b.year - a.year || b.id - a.id);
            break;
    }

    renderTable(filtered);

    // Show/hide empty state
    const emptyState = document.getElementById('tableEmpty');
    const table = document.querySelector('.admin-table');
    if (emptyState && table) {
        if (filtered.length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            table.style.display = '';
            emptyState.style.display = 'none';
        }
    }
}

/* =========================================
   Table Rendering
   ========================================= */
function renderTable(data) {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = data.map(car => `
        <tr>
            <td data-label="Vehicle">
                <div class="vehicle-cell">
                    <img src="${car.image}" alt="${car.make} ${car.model}" class="vehicle-thumb"
                         onerror="this.src='https://placehold.co/64x44?text=No+Image'">
                    <span class="vehicle-name">${car.make} ${car.model}</span>
                </div>
            </td>
            <td data-label="Year">${car.year}</td>
            <td data-label="Price">$${car.price.toLocaleString()}</td>
            <td data-label="Mileage">${(car.mileage || 0).toLocaleString()} mi</td>
            <td data-label="Type"><span class="type-pill">${car.type}</span></td>
            <td data-label="Status">
                ${car.featured
            ? '<span class="badge badge-featured">⭐ Featured</span>'
            : '<span class="badge badge-active">Active</span>'}
            </td>
            <td data-label="Actions">
                <button class="action-btn btn-edit" onclick="window.editVehicle(${car.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="window.promptDelete(${car.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

/* =========================================
   Edit Vehicle
   ========================================= */
window.editVehicle = function (id) {
    const car = inventory.find(v => v.id === id);
    if (!car) return;

    document.getElementById('vehicleId').value = car.id;
    document.getElementById('make').value = car.make;
    document.getElementById('model').value = car.model;
    document.getElementById('year').value = car.year;
    document.getElementById('price').value = car.price;
    document.getElementById('mileage').value = car.mileage || 0;
    document.getElementById('type').value = car.type;
    document.getElementById('imageUrl').value = car.image || '';
    document.getElementById('engine').value = car.specs?.engine || '';
    document.getElementById('transmission').value = car.specs?.transmission || '';
    document.getElementById('drivetrain').value = car.specs?.drivetrain || 'RWD';
    document.getElementById('color').value = car.specs?.color || '';
    document.getElementById('description').value = car.description || '';
    document.getElementById('featured').checked = car.featured || false;

    document.getElementById('modalTitle').textContent = 'Edit Vehicle';
    openModal();
};

/* =========================================
   Delete Vehicle (with confirmation)
   ========================================= */
window.promptDelete = function (id) {
    const car = inventory.find(v => v.id === id);
    if (!car) return;

    deleteTargetId = id;
    document.getElementById('deleteMessage').textContent =
        `Are you sure you want to delete the ${car.year} ${car.make} ${car.model}? This action cannot be undone.`;

    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.add('active');

    // Wire up confirm button
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = () => confirmDelete();
};

window.cancelDelete = function () {
    deleteTargetId = null;
    document.getElementById('deleteModal').classList.remove('active');
};

async function confirmDelete() {
    if (deleteTargetId === null) return;

    const car = inventory.find(v => v.id === deleteTargetId);

    // Persist to Supabase
    const success = await vehicleService.deleteVehicle(deleteTargetId);
    if (!success) {
        showToast('Failed to delete vehicle. Please try again.', 'error');
        deleteTargetId = null;
        document.getElementById('deleteModal').classList.remove('active');
        return;
    }

    inventory = inventory.filter(v => v.id !== deleteTargetId);

    renderTable(inventory);
    updateStats();
    applyFilters();

    document.getElementById('deleteModal').classList.remove('active');
    showToast(`${car?.year} ${car?.make} ${car?.model} deleted`, 'success');

    deleteTargetId = null;
}

/* =========================================
   Modal & Form Logic
   ========================================= */
const modal = document.getElementById('vehicleModal');
const form = document.getElementById('vehicleForm');

window.openModal = function () {
    modal.classList.add('active');
};

window.closeModal = function () {
    modal.classList.remove('active');
    form.reset();
    document.getElementById('vehicleId').value = '';
    document.getElementById('modalTitle').textContent = 'Add Vehicle';
};

function setupModal() {
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    const deleteModal = document.getElementById('deleteModal');
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) cancelDelete();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) closeModal();
            if (deleteModal.classList.contains('active')) cancelDelete();
        }
    });
}

function setupForm() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('vehicleId').value;
        const carData = {
            make: document.getElementById('make').value.trim(),
            model: document.getElementById('model').value.trim(),
            year: parseInt(document.getElementById('year').value),
            price: parseInt(document.getElementById('price').value),
            mileage: parseInt(document.getElementById('mileage').value) || 0,
            type: document.getElementById('type').value,
            image: document.getElementById('imageUrl').value.trim() || 'assets/car1.jpg',
            featured: document.getElementById('featured').checked,
            description: document.getElementById('description').value.trim(),
            specs: {
                engine: document.getElementById('engine').value.trim() || 'N/A',
                transmission: document.getElementById('transmission').value.trim() || 'Auto',
                drivetrain: document.getElementById('drivetrain').value || 'RWD',
                color: document.getElementById('color').value.trim() || 'Black'
            }
        };

        if (id) {
            // Update existing — persist to Supabase
            const updated = await vehicleService.updateVehicle(parseInt(id), carData);
            if (updated) {
                const index = inventory.findIndex(v => v.id === parseInt(id));
                if (index !== -1) inventory[index] = updated;
                showToast(`${carData.year} ${carData.make} ${carData.model} updated`, 'success');
            } else {
                showToast('Failed to update vehicle. Please try again.', 'error');
            }
        } else {
            // Create new — persist to Supabase
            const created = await vehicleService.addVehicle(carData);
            if (created) {
                inventory.push(created);
                showToast(`${carData.year} ${carData.make} ${carData.model} added`, 'success');
            } else {
                showToast('Failed to add vehicle. Please try again.', 'error');
            }
        }

        renderTable(inventory);
        updateStats();
        applyFilters();
        closeModal();
    });
}

/* =========================================
   Toast Notifications
   ========================================= */
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;

    container.appendChild(toast);

    // Auto-dismiss after 3.5s
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
