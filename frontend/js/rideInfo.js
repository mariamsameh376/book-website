export function renderRideInfo() {
    return `
        <div class="step-container">
            <h2 class="text-center mb-4">Step 1: Ride Information</h2>
            <div class="progress-steps">
                <span class="step active">1. Ride Info</span>
                <span class="step">2. Select Vehicle</span>
                <span class="step">3. Final Details</span>
            </div>
            
            <form id="rideInfoForm">
                <div class="form-group">
                    <label for="serviceType">Service Type</label>
                    <select class="form-control" id="serviceType" required>
                        <option value="">Select a service</option>
                        <option value="hourly">Hourly/As Directed</option>
                        <option value="point">Point-To-Point</option>
                        <option value="airport">Airport Transfer</option>
                    </select>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pickupDate">Pick-Up Date</label>
                            <input type="date" class="form-control" id="pickupDate" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="pickupTime">Pick-Up Time</label>
                            <input type="time" class="form-control" id="pickupTime" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="pickupLocation">Pick-Up Location</label>
                    <input type="text" class="form-control" id="pickupLocation" required>
                </div>
                
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="passengers">Number of Passengers</label>
                            <input type="number" class="form-control" id="passengers" min="1" value="1" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="luggage">Luggage Count</label>
                            <input type="number" class="form-control" id="luggage" min="0" value="0" required>
                        </div>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary mt-3">Next: Select Vehicle</button>
            </form>
        </div>
    `;
}