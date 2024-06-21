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
        case 'email':
            inputFields.innerHTML = `
                Email: <input type="email" id="email" class="form-control mb-2" placeholder="Email">
                Subject: <input type="text" id="subject" class="form-control mb-2" placeholder="Subject">
                Body: <textarea id="body" class="form-control mb-3" placeholder="Body"></textarea>
            `;
            return; // Email fields are
        case 'phone':
            inputFields.innerHTML = `<input type="text" id="phone" class="form-control mb-3" placeholder="Phone number">`;
            return; // Phone fields are already set
        case 'sms':
            inputFields.innerHTML = `
                Phone number: <input type="text" id="phoneNumber" class="form-control mb-2" placeholder="Phone number">
                Message: <textarea id="message" class="form-control mb-3" placeholder="Message"></textarea>
            `;
            return; // SMS fields
        case 'contact':
            inputFields.innerHTML = `
                Name: <input type="text" id="contactName" class="form-control mb-2" placeholder="Name">
                Phone: <input type="text" id="contactPhone" class="form-control mb-2" placeholder="Phone">
                Email: <input type="email" id="contactEmail" class="form-control mb-2" placeholder="Email">
                Address: <textarea id="contactAddress" class="form-control mb-3" placeholder="Address"></textarea>
            `;
            return; // Contact fields
        case 'event':
            inputFields.innerHTML = `
                Event Name: <input type="text" id="eventName" class="form-control mb-2" placeholder="Event Name">
                Location: <input type="text" id="eventLocation" class="form-control mb-2" placeholder="Location">
                Date: <input type="date" id="eventDate" class="form-control mb-2" placeholder="Date">
                Time: <input type="time" id="eventTime" class="form-control mb-3" placeholder="Time">
            `;
            return; // Event fields
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
        case 'email':
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const body = document.getElementById('body').value;
            val = `mailto:${email}?subject=${subject}&body=${body}`;
            break;
        case 'phone':
            const phone = document.getElementById('phone').value;
            val = `tel:${phone}`;
            break;
        case 'sms':
            const phoneNumber = document.getElementById('phoneNumber').value;
            const message = document.getElementById('message').value;
            val = `SMSTO:${phoneNumber}:${message}`;
            break;
        case 'contact':
            const contactName = document.getElementById('contactName').value;
            const contactPhone = document.getElementById('contactPhone').value;
            const contactEmail = document.getElementById('contactEmail').value;
            const contactAddress = document.getElementById('contactAddress').value;
            val = `MECARD:N:${contactName};TEL:${contactPhone};EMAIL:${contactEmail};ADR:${contactAddress};;`;
            break;
        case 'event':
            const eventName = document.getElementById('eventName').value;
            const eventLocation = document.getElementById('eventLocation').value;
            const eventDate = document.getElementById('eventDate').value;
            const eventTime = document.getElementById('eventTime').value;
            val = `BEGIN:VEVENT\nSUMMARY:${eventName}\nLOCATION:${eventLocation}\nDTSTART:${eventDate}T${eventTime}\nEND:VEVENT`;
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
