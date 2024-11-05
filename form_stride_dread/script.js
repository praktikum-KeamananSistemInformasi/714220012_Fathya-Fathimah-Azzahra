// Data ancaman yang lebih lengkap berdasarkan aset, ancaman, dan kategori STRIDE
const threatData = {
    "Server Utama": [
        { description: "Modifikasi Data", category: "Tampering" },
        { description: "Penambahan Data", category: "Tampering" },
        { description: "Penghapusan Data", category: "Tampering" },
        { description: "Kelebihan Beban", category: "DoS" },
        { description: "Mengkonsumsi Sumber Daya", category: "DoS" },
        { description: "Memblokir Koneksi", category: "DoS" }
    ],
    "Database": [
        { description: "Kebocoran Data Pelanggan", category: "Information Disclosure" },
        { description: "Pencurian Informasi", category: "Information Disclosure" },
        { description: "Menghapus Data Pelanggan", category: "Tampering" },
        { description: "Mengubah Isi Database", category: "Tampering" },
        { description: "Mendapatkan Hak Admin Secara Ilegal", category: "Elevation of Privilege" },
        { description: "Modifikasi Data oleh Bukan Admin", category: "Elevation of Privilege" }
    ],
    "Aplikasi Web": [
        { description: "Phishing", category: "Spoofing" },
        { description: "Man-in-the-Middle", category: "Spoofing" },
        { description: "Penolakan Pesanan", category: "Repudiation" },
        { description: "Penolakan Pengiriman Email", category: "Repudiation" },
        { description: "SQL Injection", category: "Tampering" },
        { description: "Cross-Site Scripting (XSS)", category: "Tampering" },
        { description: "Penyerangan Server Flood", category: "DoS" },
        { description: "Konsumsi Sumber Daya Server", category: "DoS" }
    ]
};

// Fungsi untuk mengisi dropdown ancaman sesuai pilihan aset
function classifyThreat() {
    const assetName = document.getElementById("assetName").value;
    const threatSelect = document.getElementById("threatType");
    const threatDiv = document.getElementById("threatClassification");
    const threatCategory = document.getElementById("threatCategory");

    threatSelect.innerHTML = '<option value="">-- Pilih Ancaman --</option>';
    threatCategory.textContent = ""; // Kosongkan kategori sebelumnya
    if (threatData[assetName]) {
        threatData[assetName].forEach(threat => {
            let option = document.createElement("option");
            option.value = threat.category; // Simpan kategori untuk referensi
            option.textContent = threat.description; // Hanya deskripsi
            option.setAttribute("data-category", threat.category);
            threatSelect.appendChild(option);
        });
        threatDiv.style.display = "block";
    } else {
        alert("Nama aset tidak dikenali.");
    }
}

// Fungsi untuk menampilkan kategori ancaman yang dipilih
function showThreatCategory() {
    const threatSelect = document.getElementById("threatType");
    const selectedOption = threatSelect.options[threatSelect.selectedIndex];
    const threatCategory = document.getElementById("threatCategory");

    if (selectedOption.value) {
        threatCategory.textContent = `Kategori Ancaman STRIDE: ${selectedOption.getAttribute("data-category")}`;
    } else {
        threatCategory.textContent = ""; // Kosongkan jika tidak ada ancaman yang dipilih
    }
}

// Fungsi untuk menampilkan input DREAD
function showDreadInputs() {
    const dreadInputs = document.getElementById("dreadInputs");
    dreadInputs.style.display = document.getElementById("threatType").value ? "block" : "none";
}

// Fungsi untuk menghitung risiko berdasarkan skor DREAD
function calculateRisk() {
    const damage = parseInt(document.getElementById("damage").value);
    const reproducibility = parseInt(document.getElementById("reproducibility").value);
    const exploitability = parseInt(document.getElementById("exploitability").value);
    const affectedUsers = parseInt(document.getElementById("affectedUsers").value);
    const discoverability = parseInt(document.getElementById("discoverability").value);

    const totalScore = damage + reproducibility + exploitability + affectedUsers + discoverability;

    let riskLevel, mitigationSuggestion;
    if (totalScore < 20) {
        riskLevel = "Rendah";
        mitigationSuggestion = "Pantau risiko ini secara berkala.";
    } else if (totalScore < 30) {
        riskLevel = "Sedang";
        mitigationSuggestion = "Periksa mitigasi dan lakukan pemantauan rutin.";
    } else if (totalScore < 40) {
        riskLevel = "Tinggi";
        mitigationSuggestion = "Segera terapkan mitigasi yang sesuai untuk menurunkan risiko.";
    } else {
        riskLevel = "Kritis";
        mitigationSuggestion = "Ambil tindakan mendesak untuk mitigasi risiko.";
    }

    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";
    document.getElementById("riskOutput").innerHTML = `
        <strong>Total Score:</strong> ${totalScore}<br>
        <strong>Tingkat Risiko:</strong> ${riskLevel}<br>
        <strong>Mitigasi:</strong> ${mitigationSuggestion}
    `;

    const ctx = document.getElementById("riskChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Damage", "Reproducibility", "Exploitability", "Affected Users", "Discoverability"],
            datasets: [{
                label: 'DREAD Score',
                data: [damage, reproducibility, exploitability, affectedUsers, discoverability],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9F40']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}
