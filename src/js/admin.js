import { vehicleService } from './services/vehicleService.js';

let inventory = [];

document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
    setupModal();
    setupForm();
});

async function initAdmin() {
    inventory = await vehicleService.getAll();
    renderTable(inventory);
}

function renderTable(data) {
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;

    tbody.innerHTML = data.map(car => `
        <tr>
            <td>${car.id}</td>
            <td><img src="${car.image}" alt="car" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
            <td>${car.year} ${car.make} ${car.model}</td>
            <td>$${car.price.toLocaleString()}</td>
            <td>${car.type}</td>
            <td>
                <button class="action-btn btn-edit" onclick="window.editVehicle(${car.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="window.deleteVehicle(${car.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Global functions for inline onclick handlers
window.editVehicle = function (id) {
    const car = inventory.find(v => v.id === id);
    if (car) {
        document.getElementById('vehicleId').value = car.id;
        document.getElementById('make').value = car.make;
        document.getElementById('model').value = car.model;
        document.getElementById('year').value = car.year;
        document.getElementById('price').value = car.price;
        document.getElementById('type').value = car.type;

        document.getElementById('modalTitle').textContent = 'Edit Vehicle';
        openModal();
    }
};

window.deleteVehicle = async function (id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        // Mock Delete
        inventory = inventory.filter(v => v.id !== id);
        renderTable(inventory);
        alert('Vehicle deleted (Mock Action)');
        // TODO: vehicleService.delete(id);
    }
};

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
    document.getElementById('modalTitle').textContent = 'Add New Vehicle';
};

function setupModal() {
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function setupForm() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('vehicleId').value;
        const newCar = {
            id: id ? parseInt(id) : Math.max(...inventory.map(v => v.id)) + 1,
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            price: parseInt(document.getElementById('price').value),
            type: document.getElementById('type').value,
            image: 'assets/car1.jpg', // Placeholder for new
            specs: { // Defaults
                engine: "N/A",
                transmission: "Auto",
                drivetrain: "RWD",
                color: "Black"
            }
        };

        if (id) {
            // Update
            const index = inventory.findIndex(v => v.id === parseInt(id));
            if (index !== -1) inventory[index] = { ...inventory[index], ...newCar };
            alert('Vehicle Updated (Mock Action)');
        } else {
            // Create
            inventory.push(newCar);
            alert('Vehicle Created (Mock Action)');
        }

        renderTable(inventory);
        closeModal();
    });
}
