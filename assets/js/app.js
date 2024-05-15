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

const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    image: "",
    dotsOptions: {
        color: "#000000",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    }
});
qrCode.append(document.getElementById("qrcode"));

function updateQRCode() {
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

    qrCode.update({
        data: val,
        dotsOptions: { color: document.getElementById('qrColor').value },
        backgroundOptions: { color: document.getElementById('bgColor').value }
    });

    const qrLogo = document.getElementById('qrLogo').files[0];
    if (qrLogo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            qrCode.update({
                image: e.target.result
            });
        };
        reader.readAsDataURL(qrLogo);
    }

    document.getElementById('qrcode').style.display = "block";
    downloadQR();
}

function resetQRCode() {
    document.getElementById('qrcode').style.display = "none";
    document.getElementById('download').innerHTML = '';
    document.getElementById('qrColor').value = '#000000';
    document.getElementById('bgColor').value = '#ffffff';
    
    qrCode.update({
        data: "",
        dotsOptions: { color: "#000000" },
        backgroundOptions: { color: "#ffffff" },
        image: ""
    });
}

function downloadQR() {
    setTimeout(() => {
        const canvas = document.querySelector("#qrcode canvas");
        const url = canvas.toDataURL("image/png");
        document.querySelector('#download').innerHTML = `<a class="btn btn-success" href="${url}" download="qrcode.png" style="margin-top: 50px;">Download QR Code</a>`;
    }, 500);
}

window.makeCode = updateQRCode; // Make it globally available for the HTML to access
