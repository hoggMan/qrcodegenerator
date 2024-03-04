document.addEventListener('DOMContentLoaded', showInputFields); // Initialize fields

function showInputFields() {
    const qrType = document.getElementById('qrType').value;
    const inputFields = document.getElementById('inputFields');
    inputFields.innerHTML = ''; // Clear previous fields

    let placeholder = '';
    switch (qrType) {
        case 'text':
            placeholder = 'Enter text';
            break;
        case 'url':
            placeholder = 'Enter URL';
            break;
        case 'wifi':
            inputFields.innerHTML = `
                SSID: <input type="text" id="ssid" class="form-control mb-2" placeholder="SSID">
                Password: <input type="password" id="wifiPassword" class="form-control mb-2" placeholder="Password">
                Encryption: <select class="form-select mb-3" id="encryption">
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="" selected>No encryption</option>
                            </select>
            `;
            return; // WiFi fields are already set
        case 'geo':
            inputFields.innerHTML = `
                Latitude: <input type="text" id="latitude" class="form-control mb-2" placeholder="Latitude">
                Longitude: <input type="text" id="longitude" class="form-control mb-2" placeholder="Longitude">
            `;
            return; // Geo fields are already set
    }

    // For text and URL, use a single input field
    inputFields.innerHTML = `<input type="text" id="text" class="form-control mb-3" placeholder="${placeholder}">`;
}

const qrcode = new QRCode("qrcode", { width: 200, height: 200 });

function makeCode() {
    const qrType = document.getElementById('qrType').value;
    let val = '';

    switch (qrType) {
        case 'text':
        case 'url':
            val = document.getElementById('text').value;
            break;
        case 'wifi':
            const ssid = document.getElementById('ssid').value;
            const password = document.getElementById('wifiPassword').value;
            const encryption = document.getElementById('encryption').value;
            val = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
            break;
        case 'geo':
            const latitude = document.getElementById('latitude').value;
            const longitude = document.getElementById('longitude').value;
            val = `GEO:${latitude},${longitude}`;
            break;
    }

    if (!val) {
        alert("Please fill in the required fields.");
        return;
    }

    qrcode.makeCode(val);
    document.getElementById('qrcode').style.display = "block";
    downloadQR();
}

function downloadQR() {
    setTimeout(() => {
        const image = document.querySelector("#qrcode img");
        const source = image ? image.getAttribute("src") : '';
        document.querySelector('#download').innerHTML = source ? `<a class="btn btn-primary" href="${source}" download="qrcode.png" style="margin-top: 2%;">Download QR Code</a>` : '';
    }, 500);
}
