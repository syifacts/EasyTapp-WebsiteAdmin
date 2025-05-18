import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://oteebvgtsvgrkfooinrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWVidmd0c3Zncmtmb29pbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDU1NzQsImV4cCI6MjA1ODYyMTU3NH0.IE1UReAZZk-9fbqi8SV3EF86Py703eoJVvpEBbzCBAo';
const supabase = createClient(supabaseUrl, supabaseKey);

// Fungsi untuk menghasilkan password acak
function generateRandomPassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

const karyawanPage = {
  async render() {
    return `
    <section class="karyawan">
  <h2>Data Karyawan</h2>
  <div class="tabs">
    <a class="active">Karyawan Aktif</a>
  </div>
  <div class="actions">
    <button id="btn-tambah" class="btn btn-success">Tambah Data Karyawan</button>
    <input type="text" id="search-karyawan" placeholder="Pencarian data karyawan" />
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>RFID Tag</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="karyawan-body">
      <tr><td colspan="4">Memuat data...</td></tr>
    </tbody>
  </table>
  <div class="pagination">
    <button class="btn btn-prev" id="btn-prev">Prev</button>
    <button class="btn btn-next" id="btn-next">Next</button>
  </div>
</section>

<!-- Form Tambah Data Karyawan -->
<div class="form-overlay" id="form-overlay">
  <div class="form-container">
    <h3>Tambah Data Karyawan</h3>
    <form id="form-tambah-karyawan">
      <label for="id">ID</label>
      <input type="number" id="id" name="id" placeholder="Biarkan kosong untuk otomatis" min="1">
  
      <label for="nama">Nama</label>
      <input type="text" id="nama" name="nama" required>
  
      <label for="rfid">RFID Tag</label>
      <input type="text" id="rfid" name="rfid" readonly required>
  
      <div class="input-group">
      <label for="rfid">Password</label>
        <input type="text" id="password" readonly>
        <button type="button" id="togglePassword">
          <i class="fa fa-eye"></i>
        </button>
      </div>
  
      <div class="form-actions">
        <button type="submit" class="btn btn-success">Simpan</button>
        <button type="button" class="btn btn-cancel" id="btn-cancel">Batal</button>
      </div>
    </form>
  </div>
</div>

<!-- Modal Pop-Up Sukses -->
<div class="form-overlay" id="form-success" style="display: none;">
  <div class="form-container">
    <h3>Berhasil</h3>
    <p id="success-message">Data berhasil diproses.</p>
    <div class="form-actions">
      <button class="btn btn-success" id="btn-close-success">Tutup</button>
    </div>
  </div>
</div>

<!-- Form Detail Karyawan -->
<div class="form-overlay" id="form-detail">
  <div class="form-container">
    <h3>Detail Karyawan</h3>
    <p><strong>ID:</strong> <span id="detail-id"></span></p>
    <p><strong>Nama:</strong> <span id="detail-nama"></span></p>
    <p><strong>RFID Tag:</strong> <span id="detail-rfid"></span></p>
    <p><strong>Password:</strong> <span id="detail-password"></span></p>
    <div class="form-actions">
      <button class="btn btn-cancel" id="btn-close-detail">Tutup</button>
    </div>
  </div>
</div>

  <!-- Popup Konfirmasi Hapus -->
<div class="popup-overlay" id="popup-confirm-delete">
  <div class="popup-container">
    <p>Apakah kamu yakin ingin menghapus data karyawan ini?</p>
    <div class="popup-actions">
      <button class="btn btn-danger" id="btn-confirm-delete">Ya, Hapus</button>
      <button class="btn btn-cancel" id="btn-cancel-delete">Batal</button>
    </div>
  </div>
</div>

<!-- Popup Status -->
<div id="popup-status" class="popup-overlay">
  <div class="popup-container">
    <p id="popup-message">Pesan Status</p>
    <button id="btn-close-popup" class="btn-cancel">Tutup</button>
  </div>
</div>


    `;
  },

  async afterRender() {
    const pageSize = 10;
    let currentPage = 1;
    let allEmployees = []; // Menyimpan semua data untuk pencarian global
  
    const generateRandomPassword = (length = 8) => {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
      return result;
    };
  
    const loadAllData = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('id', { ascending: true });
  
      if (error) {
        console.error('Gagal mengambil semua data:', error.message);
        return [];
      }
  
      return data;
    };
  
    const renderTable = (data) => {
      const tbody = document.querySelector('#karyawan-body');
      tbody.innerHTML = '';
  
      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">Tidak ada data karyawan.</td></tr>`;
        return;
      }
  
      data.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td>${emp.rfid_tag}</td>
          <td>
            <button class="action-btn detail-btn" data-id="${emp.id}"><i class="fa fa-eye"></i></button>
            <button class="action-btn delete-btn" data-id="${emp.id}"><i class="fa fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(row);
      });
    };
  
    const loadData = async (page = 1) => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('id', { ascending: true })
        .range((page - 1) * pageSize, page * pageSize - 1);
  
      if (error) {
        renderTable([]);
        document.querySelector('#karyawan-body').innerHTML = `<tr><td colspan="4">Gagal mengambil data: ${error.message}</td></tr>`;
        return;
      }
  
      renderTable(data);
  
      document.getElementById('btn-prev').disabled = currentPage === 1;
      const { count } = await supabase.from('employees').select('*', { count: 'exact', head: true });
      document.getElementById('btn-next').disabled = currentPage * pageSize >= count;
    };
  
    allEmployees = await loadAllData();
    await loadData(currentPage);
  
    document.getElementById('search-karyawan').addEventListener('input', async (e) => {
      const query = e.target.value.toLowerCase();
  
      if (query.trim() === '') {
        await loadData(currentPage); 
        return;
      }
  
      const filtered = allEmployees.filter(emp =>
        emp.name.toLowerCase().includes(query)
      );
  
      renderTable(filtered);
    });
  
    let currentPlainPassword = '';
    let isPasswordShown = false;
  
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
  
    toggleBtn.addEventListener('click', () => {
      if (!isPasswordShown) {
        if (!currentPlainPassword) {
          currentPlainPassword = generateRandomPassword(8);
        }
        passwordInput.value = currentPlainPassword;
        toggleBtn.innerHTML = '<i class="fa fa-eye-slash"></i>';
      } else {
        passwordInput.value = '';
        toggleBtn.innerHTML = '<i class="fa fa-eye"></i>';
      }
      isPasswordShown = !isPasswordShown;
    });
  
    const checkIfIdExists = async (id) => {
      const { data, error } = await supabase.from('employees').select('id').eq('id', id);
      if (error) {
        console.error('Error checking ID existence: ', error.message);
        return false;
      }
      return data.length > 0;
    };
  
    let currentHashedPassword = '';
  
  document.getElementById('btn-tambah').addEventListener('click', async () => {
  currentPlainPassword = generateRandomPassword(8);
  currentHashedPassword = bcrypt.hashSync(currentPlainPassword, 10);
  passwordInput.value = currentPlainPassword;

   const { data: availableRFID, error } = await supabase
    .from('rfid_tag')
    .select('rfid_tag')
    .eq('status', 'available')
     .order('id', { ascending: true }) 
    .limit(1) 
    .single();  

  if (error) {
    showPopup('Tidak ada RFID yang available. Tambahkan RFID Tag terlebih dahulu');
    return;
  }

  document.getElementById('rfid').value = availableRFID.rfid_tag;

  currentPlainPassword = generateRandomPassword(8);
  currentHashedPassword = bcrypt.hashSync(currentPlainPassword, 10);

  passwordInput.value = currentPlainPassword;

  
  document.getElementById('form-overlay').classList.add('show');
});

    document.getElementById('btn-cancel').addEventListener('click', () => {
      document.getElementById('form-overlay').classList.remove('show');
      document.getElementById('form-tambah-karyawan').reset();
    });
 const showPopup = (message, isSuccess = true) => {
  const popup = document.getElementById('popup-status');
  const messageElement = document.getElementById('popup-message');
  messageElement.textContent = message;

  // Menetapkan warna popup berdasarkan sukses/gagal
  if (isSuccess) {
    popup.classList.add('success');
    popup.classList.remove('error');
  } else {
    popup.classList.add('error');
    popup.classList.remove('success');
  }

  popup.classList.add('show');
};

// Menutup popup
document.getElementById('btn-close-popup').addEventListener('click', () => {
  document.getElementById('popup-status').classList.remove('show');
});



document.getElementById('form-tambah-karyawan').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('id').value.trim();
  const name = document.getElementById('nama').value.trim();
  const rfid_tag = document.getElementById('rfid').value.trim();
  
  if (!name || !rfid_tag) return alert('Semua field wajib diisi.');
  
  // Mengecek apakah ID sudah ada, jika ada, jangan melakukan insert
  if (id) {
    const isIdExists = await checkIfIdExists(id);
    if (isIdExists) {
      showPopup('ID sudah ada, silakan pilih ID lain');
      return;
    }
  }

  const insertData = {
    name,
    rfid_tag,
    password: currentHashedPassword
  };
  
  if (id) insertData.id = parseInt(id);
  
  // Melakukan insert data
  const { data, error } = await supabase.from('employees').insert([insertData]);
  
  if (error) {
    // Hanya menangani error yang bukan duplikat
    if (error.code === '23505') {
      console.log('ID sudah ada, namun data berhasil dimasukkan.');
      return;
    }
    showPopup('Gagal menambahkan data karyawan: ' + error.message, false);
  } else {
      await supabase
    .from('rfid_tag')
    .update({ status: 'assigned' })
    .eq('rfid_tag', rfid_tag);
    
    showPopup('Data berhasil ditambahkan.', true);
    document.getElementById('form-overlay').classList.remove('show');
    document.getElementById('form-tambah-karyawan').reset();
    allEmployees = await loadAllData();
    await loadData(currentPage);
  }
});
    
  
    document.getElementById('btn-next').addEventListener('click', async () => {
      currentPage++;
      await loadData(currentPage);
    });
  
    document.getElementById('btn-prev').addEventListener('click', async () => {
      currentPage--;
      await loadData(currentPage);
    });
  
    document.getElementById('karyawan-body').addEventListener('click', async (e) => {
      if (e.target.closest('.detail-btn')) {
        const id = e.target.closest('.detail-btn').dataset.id;
  
        const { data: detail, error } = await supabase
          .from('employees')
          .select('id, name, rfid_tag, password')
          .eq('id', id)
          .single();
  
        if (error) {
          alert('Gagal mengambil detail: ' + error.message);
          return;
        }
  
        document.getElementById('detail-id').textContent = detail.id;
        document.getElementById('detail-nama').textContent = detail.name;
        document.getElementById('detail-rfid').textContent = detail.rfid_tag;
        document.getElementById('detail-password').textContent = detail.password || '(tidak tersedia)';
        document.getElementById('form-detail').classList.add('show');
      }
  
document.getElementById('karyawan-body').addEventListener('click', async (e) => {
  if (e.target.closest('.delete-btn')) {
    const id = e.target.closest('.delete-btn').dataset.id;
    
    // Menampilkan popup konfirmasi penghapusan
    const popupDelete = document.getElementById('popup-confirm-delete');
    popupDelete.classList.add('show');
    
    // Konfirmasi penghapusan
    document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) {
        alert('Gagal menghapus data karyawan: ' + error.message);
        popupDelete.classList.remove('show');
        return;
      }

      // Menampilkan popup status sukses
      showPopup('Data berhasil dihapus.', true);
      popupDelete.classList.remove('show');
      allEmployees = await loadAllData();
      await loadData(currentPage);
    });

    // Menutup popup jika cancel
    document.getElementById('btn-cancel-delete').addEventListener('click', () => {
      popupDelete.classList.remove('show');
    });
  }
});

document.getElementById('btn-close-detail').addEventListener('click', () => {
  document.getElementById('form-detail').classList.remove('show');
});
    });
  }
  
};


export default karyawanPage;
