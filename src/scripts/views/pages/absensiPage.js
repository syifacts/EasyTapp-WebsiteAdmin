import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oteebvgtsvgrkfooinrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWVidmd0c3Zncmtmb29pbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDU1NzQsImV4cCI6MjA1ODYyMTU3NH0.IE1UReAZZk-9fbqi8SV3EF86Py703eoJVvpEBbzCBAo';
const supabase = createClient(supabaseUrl, supabaseKey);

const absensiPage = {
  async render() {
    return `
      <section class="absensi">
        <h2>Data Absensi</h2>
        <div class="tabs">
          <a  class="active">Absensi Karyawan</a>
        </div>
        <div class="actions">
          <button id="btn-tambah-absensi" class="btn btn-success">Tambah Absensi</button>
         <div class="filter-group">
  <label for="filter-date">Filter Tanggal:</label>
  <input type="date" id="filter-date" name="filter-date">
</div>

        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="absensi-body">
            <tr><td colspan="6">Memuat data...</td></tr>
          </tbody>
        </table>
        <div class="pagination">
          <button class="btn btn-prev" id="btn-prev-absensi">Prev</button>
          <button class="btn btn-next" id="btn-next-absensi">Next</button>
        </div>
      </section>

      <div class="form-overlay" id="form-overlay-absensi">
        <div class="form-container">
          <h3>Tambah Absensi</h3>
          <form id="form-tambah-absensi">
            <label for="employee_id">Employee ID</label>
            <input type="number" id="employee_id" name="employee_id" min="1" required>
            <label for="date">Tanggal</label>
            <input type="date" id="date" name="date" required>
            <label for="check_in">Check In</label>
            <input type="time" id="check_in" name="check_in" step="1">
            <label for="check_out">Check Out</label>
            <input type="time" id="check_out" name="check_out" step="1">
            <label for="status">Status</label>
      <select id="status" name="status" required>
              <option value="">-- Pilih Status --</option>
              <option value="Hadir">Hadir</option>
              <option value="Tidak Hadir">Tidak Hadir</option>
              <option value="Terlambat">Terlambat</option>
            </select>
            <div class="form-actions">
              <button type="submit" class="btn btn-success">Simpan</button>
              <button type="button" class="btn btn-cancel" id="btn-cancel-absensi">Batal</button>
            </div>
          </form>
        </div>
      </div>

      <div class="modal-overlay" id="modal-detail">
        <div class="modal-container">
          <h3>Detail Absensi</h3>
          <p><strong>Employee ID:</strong> <span id="modal-employee-id"></span></p>
          <p><strong>Name:</strong> <span id="modal-name"></span></p>
          <p><strong>Date:</strong> <span id="modal-date"></span></p>
          <p><strong>Check In:</strong> <span id="modal-check-in"></span></p>
          <p><strong>Check Out:</strong> <span id="modal-check-out"></span></p>
          <p><strong>Status:</strong> <span id="modal-status"></span></p>
          <button class="btn btn-cancel" id="btn-close-modal">Tutup</button>
        </div>
      </div>

     <div id="overlay-edit-checkout" class="overlay">
  <div class="overlay-content">
    <h3>Edit Data Absensi</h3>
    <form id="form-edit-checkout">
      <input type="hidden" id="edit-id">

      <div class="form-group">
        <label><strong>Employee ID:</strong></label>
        <span id="display-employee-id"></span>
      </div>
      
      <div class="form-group">
        <label><strong>Name:</strong></label>
        <span id="display-employee-name"></span>
      </div>
      
      <div class="form-group">
        <label><strong>Date:</strong></label>
        <span id="display-date"></span>
      </div>

      <div class="form-group">
        <label for="edit-checkin-time">Check In:</label>
        <input type="time" id="edit-checkin-time" step="1" required>
      </div>

      <div class="form-group">
        <label for="edit-checkout-time">Check Out:</label>
        <input type="time" id="edit-checkout-time" step="1" required>
      </div>

      <div class="form-group">
        <label for="edit-status">Status:</label>
        <select id="edit-status" required>
          <option value="Hadir">Hadir</option>
          <option value="Tidak Hadir">Tidak Hadir</option>
          <option value="Terlambat">Terlambat</option>
        </select>
      </div>

      <div class="btn-group">
        <button type="submit" class="btn btn-success">Simpan</button>
        <button type="button" id="btn-cancel-edit" class="btn btn-cancel">Batal</button>
      </div>
    </form>
  </div>
</div>

      <!-- Popup Notification -->
      <div class="popup-overlay" id="popup-absensi">
        <div class="popup-container">
          <p id="popup-message"></p>
          <button class="btn btn-close-popup" id="btn-close-popup">Tutup</button>
        </div>
      </div>

      <!-- Popup Konfirmasi Hapus -->
<div class="popup-overlay" id="popup-confirm-delete">
  <div class="popup-container">
    <p>Apakah kamu yakin ingin menghapus data absensi ini?</p>
    <div class="popup-actions">
      <button class="btn btn-danger" id="btn-confirm-delete">Ya, Hapus</button>
      <button class="btn btn-cancel" id="btn-cancel-delete">Batal</button>
    </div>
  </div>
</div>
<!-- Modal Overlay -->
<div id="image-modal" class="modal-overlay" style="display:none;">
  <span class="close-modal" id="close-modal">&times;</span>
  <img class="modal-content" id="modal-image" />
</div>

    `;
  },

  async afterRender() {
    const pageSize = 10;
    let currentPage = 1;
    let deleteId = null;

    const loadData = async (page = 1, filterDate = null) => {
      let query = supabase
        .from('attendance_with_image')
        .select('*')
        .order('date', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (filterDate) {
        query = query.eq('date', filterDate);
      }

      const { data, error } = await query;

      const tbody = document.getElementById('absensi-body');
      tbody.innerHTML = '';

      if (error) {
        tbody.innerHTML = `<tr><td colspan="6">Gagal mengambil data: ${error.message}</td></tr>`;
        return;
      }

      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Tidak ada data absensi.</td></tr>`;
        return;
      }

      data.forEach(abs => {
        const imageUrl = abs.image || null;
    const imageTag = imageUrl 
      ? `<img src="${imageUrl}" alt="Foto Absensi" style="width:100px; height:auto; border-radius:4px;" />`
      : '-';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${abs.employee_id}</td>
          <td>${abs.date}</td>
          <td>${abs.check_in ? abs.check_in.slice(11, 19) : '-'}</td>
          <td>${abs.check_out ? abs.check_out.slice(11, 19) : '-'}</td>
          <td>${abs.status}</td>
           <td>${imageTag}</td>
          <td>
            <button class="action-btn detail-btn" data-id="${abs.id}"><i class="fa fa-eye"></i></button>
            <button class="action-btn edit-btn" data-id="${abs.id}"><i class="fa fa-edit"></i></button>
            <button class="action-btn delete-btn" data-id="${abs.id}"><i class="fa fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(row);
      });

      // Disable Prev button if on first page
      document.getElementById('btn-prev-absensi').disabled = currentPage === 1;

      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact' });

      document.getElementById('btn-next-absensi').disabled = currentPage * pageSize >= count;
      tbody.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    modalImg.src = img.src;
    modal.style.display = 'flex';
  });
});
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('image-modal').style.display = 'none';
});

// Optional: klik luar modal juga bisa nutup
document.getElementById('image-modal').addEventListener('click', (e) => {
  if (e.target.id === 'image-modal') {
    document.getElementById('image-modal').style.display = 'none';
  }
});

    };

    // Function to show edit form
    const showEditForm = async (id) => {
      // Ambil data lengkap untuk form edit
      const { data, error } = await supabase
        .from('attendance')
        .select('id, date, check_in, check_out, status, employee_id')
        .eq('id', id)
        .single();

      if (error || !data) {
        absensiPage.showPopup('Gagal mengambil data absensi.', 'error');
        return;
      }
      
      // Ambil data karyawan
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('name')
        .eq('id', data.employee_id)
        .single();
        
      if (employeeError) {
        absensiPage.showPopup('Gagal mengambil data karyawan.', 'error');
        // Continue anyway, we'll just display the ID without the name
      }

      document.getElementById('edit-id').value = data.id;
      document.getElementById('display-employee-id').textContent = data.employee_id;
      document.getElementById('display-employee-name').textContent = employee?.name || 'Tidak ditemukan';
      document.getElementById('display-date').textContent = data.date;

      // Ambil waktu saja dari datetime
      const checkInTime = data.check_in ? data.check_in.split('T')[1].slice(0, 8) : '';
      const checkOutTime = data.check_out ? data.check_out.split('T')[1].slice(0, 8) : '';

      document.getElementById('edit-checkin-time').value = checkInTime;
      document.getElementById('edit-checkout-time').value = checkOutTime;
      document.getElementById('edit-status').value = data.status;

      document.getElementById('overlay-edit-checkout').classList.add('show');
    };

    await loadData(currentPage);
    const now = new Date();
async function autoFillAbsensiTidakHadir() {
  const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

  // Ambil semua ID karyawan
  const { data: allEmployees, error: empError } = await supabase
    .from('employees')
    .select('id');

  if (empError) {
    absensiPage.showPopup('Gagal mengambil data karyawan.', 'error');
    return;
  }

  // Ambil data absensi hari ini
  const { data: todayAbsensi, error: absensiError } = await supabase
    .from('attendance')
    .select('employee_id, status')
    .eq('date', today);

  if (absensiError) {
    absensiPage.showPopup('Gagal mengambil data absensi.', 'error');
    return;
  }

  const sudahAbsenIds = todayAbsensi.map(a => a.employee_id);
  const belumAbsen = allEmployees.filter(e => !sudahAbsenIds.includes(e.id));

  if (belumAbsen.length === 0) return; // Semua sudah absen

  const newRecords = belumAbsen.map(e => ({
    employee_id: e.id,
    date: today,
    check_in: null,
    check_out: null,
    status: 'Tidak Hadir'
  }));

  const { error: insertError } = await supabase
    .from('attendance')
    .upsert(newRecords, { onConflict: ['employee_id', 'date'] });

  if (insertError) {
    absensiPage.showPopup('Gagal mengisi absensi otomatis: ' + insertError.message, 'error');
  } else {
    absensiPage.showPopup('Absensi otomatis "Tidak Hadir" berhasil diisi.', 'success');
    await loadData(currentPage); // Refresh tampilan
  }
}

function isAlreadyAutoFilledToday() {
  const lastRun = localStorage.getItem('autoFillAbsensiLastRun');
  const today = new Date().toISOString().slice(0, 10);
  return lastRun === today;
}

async function runAutoFillIfNeeded() {
  const now = new Date();

  if (isAlreadyAutoFilledToday()) {
    // Sudah pernah isi hari ini, langsung return tanpa notifikasi
    return;
  }

  const targetHour = 23;
  const targetMinute = 0;
  const targetSecond = 0;

  // Jika sekarang sudah lewat jam 09:48:00
  if (
    now.getHours() > targetHour ||
    (now.getHours() === targetHour && now.getMinutes() >= targetMinute)
  ) {
    await autoFillAbsensiTidakHadir();
    localStorage.setItem('autoFillAbsensiLastRun', now.toISOString().slice(0, 10));
  } else {
    // Atur timer sampai jam 09:48:00 hari ini
    const target = new Date();
    target.setHours(targetHour, targetMinute, targetSecond, 0);
    const msUntilTarget = target.getTime() - now.getTime();

    setTimeout(async () => {
      if (!isAlreadyAutoFilledToday()) {
        await autoFillAbsensiTidakHadir();
        localStorage.setItem('autoFillAbsensiLastRun', new Date().toISOString().slice(0, 10));
      }
    }, msUntilTarget);
  }
}

// Jalankan saat halaman dimuat
runAutoFillIfNeeded();


    // Add event listener for form edit submission
    document.getElementById('form-edit-checkout').addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('edit-id').value;
      const checkInTime = document.getElementById('edit-checkin-time').value;
      const checkOutTime = document.getElementById('edit-checkout-time').value;
      const status = document.getElementById('edit-status').value;
      const date = document.getElementById('display-date').textContent; // Ambil tanggal dari display

      const newCheckIn = checkInTime ? `${date}T${checkInTime}` : null;
      const newCheckOut = checkOutTime ? `${date}T${checkOutTime}` : null;

      const { error: updateError } = await supabase
        .from('attendance')
        .update({
          check_in: newCheckIn,
          check_out: newCheckOut,
          status: status
        })
        .eq('id', id);

      if (updateError) {
        absensiPage.showPopup('Gagal mengupdate data: ' + updateError.message, 'error');
      } else {
        absensiPage.showPopup('Data berhasil diupdate.', 'success');
        document.getElementById('overlay-edit-checkout').classList.remove('show');
        await loadData(currentPage);
      }
    });

    document.getElementById('btn-tambah-absensi').addEventListener('click', () => {
      document.getElementById('form-overlay-absensi').classList.add('show');
    });

    document.getElementById('btn-cancel-absensi').addEventListener('click', () => {
      document.getElementById('form-overlay-absensi').classList.remove('show');
      document.getElementById('form-tambah-absensi').reset();
    });

    document.getElementById('btn-cancel-edit').addEventListener('click', () => {
      document.getElementById('overlay-edit-checkout').classList.remove('show');
    });

    document.getElementById('form-tambah-absensi').addEventListener('submit', async (e) => {
      e.preventDefault();
      const employee_id = Number(document.getElementById('employee_id').value);
      const date = document.getElementById('date').value;
      const checkInTime = document.getElementById('check_in').value;
      const checkOutTime = document.getElementById('check_out').value;
      const status = document.getElementById('status').value;

      if (!employee_id || !date || !status) {
        return absensiPage.showPopup('Harap isi Employee ID, Tanggal, dan Status.', 'error');
      }

      if (employee_id < 1) {
        return absensiPage.showPopup('Employee ID tidak boleh kurang dari 1.', 'error');
      }

      if (status === 'Hadir' && !checkInTime) {
        return absensiPage.showPopup('Check In wajib diisi untuk status Hadir.', 'error');
      }

      // Validasi apakah employee_id ada di tabel employees
      const { data: employee, error: empErr } = await supabase
        .from('employees')
        .select('id')
        .eq('id', employee_id)
        .single();

      if (empErr || !employee) {
        return absensiPage.showPopup('ID karyawan tidak ditemukan. Mohon periksa kembali.', 'error');
      }
let check_in = checkInTime ? `${date}T${checkInTime}` : null;
let check_out = checkOutTime ? `${date}T${checkOutTime}` : null;


      if (status === 'Tidak Hadir') {
        check_in = null;
        check_out = null;
      }
// Cek apakah absensi sudah ada sebelumnya
const { data: existingAbsensi, error: absensiCheckError } = await supabase
  .from('attendance')
  .select('id')
  .eq('employee_id', employee_id)
  .eq('date', date)
  .maybeSingle(); // karena 1 hari seharusnya 1 record

if (absensiCheckError) {
  return absensiPage.showPopup('Gagal memeriksa absensi sebelumnya.', 'error');
}

if (existingAbsensi) {
  return absensiPage.showPopup('Karyawan ini sudah mengisi absensi di tanggal tersebut.', 'error');
}

      const { error } = await supabase.from('attendance').upsert([{
        employee_id, date, check_in, check_out, status
      }], { onConflict: ['employee_id', 'date'] });

      if (error) {
        absensiPage.showPopup('Gagal menambahkan absensi: ' + error.message, 'error');
      } else {
        absensiPage.showPopup('Absensi berhasil ditambahkan.', 'success');
        document.getElementById('form-overlay-absensi').classList.remove('show');
        document.getElementById('form-tambah-absensi').reset();
        await loadData(currentPage);
      }
    });

    document.getElementById('btn-next-absensi').addEventListener('click', () => {
      currentPage++;
      loadData(currentPage);
    });

    document.getElementById('btn-prev-absensi').addEventListener('click', () => {
      currentPage--;
      loadData(currentPage);
    });

    document.getElementById('filter-date').addEventListener('change', async (e) => {
      const filterDate = e.target.value;
      currentPage = 1; 
      await loadData(currentPage, filterDate);
    });

    // Event delegation for all button events
    document.addEventListener('click', async (e) => {
      // Detail button
      if (e.target.closest('.detail-btn')) {
        const id = e.target.closest('button').dataset.id;
        const { data: attendance, error: attendanceError } = await supabase
          .from('attendance')
          .select('*')
          .eq('id', id)
          .single();

        if (attendanceError) {
          absensiPage.showPopup('Gagal mengambil data detail: ' + attendanceError.message, 'error');
          return;
        }

        const { data: employee, error: employeeError } = await supabase
          .from('employees')
          .select('name')
          .eq('id', attendance.employee_id)
          .single();

        if (employeeError) {
          absensiPage.showPopup('Gagal mengambil nama karyawan: ' + employeeError.message, 'error');
          return;
        }

        document.getElementById('modal-employee-id').textContent = attendance.employee_id;
        document.getElementById('modal-name').textContent = employee.name || 'Tidak ditemukan';
        document.getElementById('modal-date').textContent = attendance.date;
        document.getElementById('modal-check-in').textContent = attendance.check_in ? attendance.check_in.slice(11, 19) : '-';
        document.getElementById('modal-check-out').textContent = attendance.check_out ? attendance.check_out.slice(11, 19) : '-';
        document.getElementById('modal-status').textContent = attendance.status;

        document.getElementById('modal-detail').classList.add('show');
      }
      
      // Edit button
      if (e.target.closest('.edit-btn')) {
        const id = e.target.closest('button').dataset.id;
        await showEditForm(id);
      }

      // Delete button
      if (e.target.closest('.delete-btn')) {
        deleteId = e.target.closest('button').dataset.id;
        document.getElementById('popup-confirm-delete').classList.add('show');
      }

      // Close modal button
      if (e.target.closest('#btn-close-modal')) {
        document.getElementById('modal-detail').classList.remove('show');
      }

      // Delete confirmation
      if (e.target.closest('#btn-confirm-delete')) {
        if (deleteId) {
          const { error } = await supabase
            .from('attendance')
            .delete()
            .eq('id', deleteId);

          if (error) {
            absensiPage.showPopup('Gagal menghapus data: ' + error.message, 'error');
          } else {
            absensiPage.showPopup('Data absensi berhasil dihapus.', 'success');
            await loadData(currentPage);
          }
          
          // Reset deleteId and close popup
          deleteId = null;
          document.getElementById('popup-confirm-delete').classList.remove('show');
        }
      }

      // Cancel delete
      if (e.target.closest('#btn-cancel-delete')) {
        deleteId = null;
        document.getElementById('popup-confirm-delete').classList.remove('show');
      }
    });
    const alreadyFilledKey = `auto-fill-${now.toISOString().slice(0, 10)}`;
if (!localStorage.getItem(alreadyFilledKey)) {
  await autoFillAbsensiTidakHadir();
  localStorage.setItem(alreadyFilledKey, 'true');
}

  },

  showPopup(message, type = 'success') {
    const popup = document.getElementById('popup-absensi');
    const popupMessage = document.getElementById('popup-message');
    const btnClosePopup = document.getElementById('btn-close-popup');

    popup.classList.add('show');
    popupMessage.textContent = message;
    
    // Reset classes and add the correct one
    popup.classList.remove('success', 'error');
    popup.classList.add(type === 'error' ? 'error' : 'success');

    btnClosePopup.addEventListener('click', () => {
      popup.classList.remove('show');
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000);
  }
  
};

export default absensiPage;