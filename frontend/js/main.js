import { renderRideInfo } from './rideInfo.js';
import { renderSelectVehicle } from './selectVehicle.js';
import { renderFinalDetails } from './finalDetails.js';

let currentStep = 1;
let bookingData = {};

export function navigateToStep(step) {
    currentStep = step;
    renderCurrentStep();
}

function renderCurrentStep() {
    const app = document.getElementById('app');
    
    switch(currentStep) {
        case 1:
            app.innerHTML = renderRideInfo();
            setupRideInfoEvents();
            break;
        case 2:
            app.innerHTML = renderSelectVehicle();
            setupVehicleEvents();
            break;
        case 3:
            app.innerHTML = renderFinalDetails();
            setupFinalDetailsEvents();
            break;
    }
}

function setupRideInfoEvents() {
    document.getElementById('rideInfoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        bookingData = {
            serviceType: document.getElementById('serviceType').value,
            pickupDate: document.getElementById('pickupDate').value,
            pickupTime: document.getElementById('pickupTime').value,
            pickupLocation: document.getElementById('pickupLocation').value,
            passengers: document.getElementById('passengers').value,
            luggage: document.getElementById('luggage').value
        };
        
        navigateToStep(2);
    });
}

function setupVehicleEvents() {
    document.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', () => {
            bookingData.vehicle = card.dataset.id;
            navigateToStep(3);
        });
    });
}

function setupFinalDetailsEvents() {
    document.getElementById('confirmBooking').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            
            const result = await response.json();
            alert('Booking confirmed!');
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Initialize the app
renderCurrentStep();