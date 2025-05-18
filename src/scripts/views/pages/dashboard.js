import supabase from '../../config/supabaseClient';

const DashboardPage = {
  async render() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      window.location.hash = '/login';
      return;
    }

    // Ambil total karyawan
    const { data: employees, error } = await supabase.from('employees').select('*');
    const totalKaryawan = employees ? employees.length : 0;

    return `
      <link rel="stylesheet" href="../public/styles/style.css">
      <div class="d-flex">

        <!-- Main Content -->
        <main id="mainContent" class="content flex-grow-1 p-4" style="font-family: 'Nunito', sans-serif;">
          <h2>Dashboard</h2>

          <div class="dashboard-cards">
            <div class="card total-karyawan">
              <p class="card-title">TOTAL KARYAWAN</p>
              <div class="card-content">
                <span class="card-number">${totalKaryawan}</span>
                <i class="bi bi-person fs-2"></i>
              </div>
            </div>

            <div class="card absensi-hari-ini">
              <p class="card-title">ABSENSI HARI INI</p>
              <div class="card-content">
                <span class="card-number">0</span>
                <i class="bi bi-calendar-event fs-2"></i>
              </div>
            </div>
          </div>

          <h5>Manajemen Jadwal</h5>
          <div class="card jadwal-masuk">
            <div class="card-content">
              <div>
                <div class="card-title">Jadwal Masuk</div>
                <input type="time" id="jamMasuk" />
                <p id="jamMasukDisplay">Jam Masuk: ${localStorage.getItem('jamMasuk') || '08:00'}</p>
              </div>
            </div>
          </div>

          <div class="card jadwal-pulang">
            <div class="card-content">
              <div>
                <div class="card-title">Jadwal Pulang</div>
                <input type="time" id="jamPulang" />
                <p id="jamPulangDisplay">Jam Pulang: ${localStorage.getItem('jamPulang') || '17:00'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    document.body.classList.remove('login-page');

    const jamMasuk = document.getElementById('jamMasuk');
    const jamPulang = document.getElementById('jamPulang');
    const jamMasukDisplay = document.getElementById('jamMasukDisplay');
    const jamPulangDisplay = document.getElementById('jamPulangDisplay');

    jamMasuk.value = localStorage.getItem('jamMasuk') || '08:00';
    jamPulang.value = localStorage.getItem('jamPulang') || '17:00';

    jamMasukDisplay.textContent = `Jam Masuk: ${jamMasuk.value}`;
    jamPulangDisplay.textContent = `Jam Pulang: ${jamPulang.value}`;

    jamMasuk.addEventListener('change', () => {
      localStorage.setItem('jamMasuk', jamMasuk.value);
      jamMasukDisplay.textContent = `Jam Masuk: ${jamMasuk.value}`;
    });

    jamPulang.addEventListener('change', () => {
      localStorage.setItem('jamPulang', jamPulang.value);
      jamPulangDisplay.textContent = `Jam Pulang: ${jamPulang.value}`;
    });

    // Ambil dan tampilkan jumlah absensi hari ini
    const tampilkanAbsensiHariIni = async () => {
      const today = new Date().toISOString().split('T')[0];

      const { data: absensiHariIni, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', today);

      if (error) {
        console.error('Gagal mengambil absensi hari ini:', error.message);
        return;
      }

      const jumlah = absensiHariIni.length;

      const absensiCard = document.querySelector('.absensi-hari-ini .card-number');
      if (absensiCard) {
        absensiCard.textContent = jumlah;
      }
    };

    await tampilkanAbsensiHariIni();
  }
};

// Render konten ke DOM
document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('main'); // Pastikan div#main ada di HTML
  if (root) {
    root.innerHTML = await DashboardPage.render();
    await DashboardPage.afterRender();
  }
});

export default DashboardPage;
