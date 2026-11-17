document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('current-date');
    const contentContainer = document.getElementById('content-container');

    // Mendapatkan tanggal hari ini (Format: YYYY-MM-DD, contoh: 2026-11-18)
    const today = new Date().toISOString().split('T')[0];
    dateElement.textContent = `Tanggal: ${today}`;

    // Memuat file materi harian dari folder raw-data secara dinamis
    const targetFile = `./raw-data/${today}.html`;

    fetch(targetFile)
        .then(response => {
            if (!response.ok) {
                throw new Error("Materi untuk hari ini belum tersedia.");
            }
            return response.text();
        })
        .then(htmlContent => {
            contentContainer.innerHTML = htmlContent;
        })
        .catch(error => {
            console.warn(error);
            contentContainer.innerHTML = `
                <article>
                    <h2>Belum Ada Materi Hari Ini</h2>
                    <p>Silakan buat materi tanggal <strong>${today}</strong> menggunakan ChatGPT + AIPRM, lalu simpan ke folder <code>raw-data/${today}.html</code>.</p>
                </article>
            `;
        });

    // Registrasi Service Worker untuk PWA Offline Cache
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker berhasil didaftarkan!'))
            .catch(err => console.error('Gagal mendaftarkan Service Worker:', err));
    }
});
