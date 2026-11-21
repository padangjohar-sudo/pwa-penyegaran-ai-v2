let currentVersion = '01'; // Default versi buku asli

function getMateriFilename(selectedDateStr, version) {
    const startDate = new Date('2026-10-05'); // Hari Senin, 5 Oktober 2026 (Pekan 1)
    const targetDate = new Date(selectedDateStr);
    const diffTime = targetDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || diffDays > 83) {
        return null; // Di luar rentang 84 hari
    }

    const weekNumber = Math.floor(diffDays / 7) + 1;
    const dayOfWeek = diffDays % 7; // 0 = Senin, 1 = Selasa, dst.
    
    const dayNames = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "garis_besar"];
    const dayOrders = ["1", "2", "3", "4", "5", "6", "0"];
    const dayName = dayNames[dayOfWeek] || "senin";
    const dayOrder = dayOrders[dayOfWeek] || "1";

    const paddedWeek = String(weekNumber).padStart(2, '0');

    return `teks/t_${paddedWeek}_${dayOrder}_${dayName}_${version}.html`;
}

async function muatMateriBerdasarkanTanggal(dateStr) {
    const contentBox = document.getElementById('ai-content');
    const filename = getMateriFilename(dateStr, currentVersion);

    if (!filename) {
        contentBox.innerHTML = "<div style='padding:30px; text-align:center; color:#e11d48;'>Materi untuk tanggal ini di luar rentang buku (5 Okt - 26 Des 2026).</div>";
        return;
    }

    // Menggunakan iframe agar file HTML harian tampil utuh beserta seluruh desain CSS cantiknya
    contentBox.innerHTML = `
        <iframe src="${filename}" style="display: block; width: 100%; height: 78vh; border: none; border-radius: 8px;" onerror="this.outerHTML='<p style=\'text-align:center; padding:20px; color:#e11d48;\'>File materi <code>${filename}</code> belum tersedia di folder teks/.</p>'"></iframe>
    `;
}

function switchVersion(version) {
    currentVersion = version;
    
    // Perbarui status aktif tombol tab
    document.getElementById('btn-v1').classList.toggle('active', version === '01');
    document.getElementById('btn-v2').classList.toggle('active', version === '02');
    document.getElementById('btn-v3').classList.toggle('active', version === '03');

    // Muat ulang berdasarkan tanggal yang sedang dipilih
    const selectedDate = document.getElementById('date-selector').value;
    muatMateriBerdasarkanTanggal(selectedDate);
}

document.addEventListener('DOMContentLoaded', () => {
    const dateSelector = document.getElementById('date-selector');
    
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const initialDate = (todayStr >= "2026-10-05" && todayStr <= "2026-12-26") ? todayStr : "2026-10-05";
    
    dateSelector.value = initialDate;
    muatMateriBerdasarkanTanggal(initialDate);

    dateSelector.addEventListener('change', (e) => {
        muatMateriBerdasarkanTanggal(e.target.value);
    });
});
