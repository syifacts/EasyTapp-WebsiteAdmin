import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oteebvgtsvgrkfooinrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWVidmd0c3Zncmtmb29pbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDU1NzQsImV4cCI6MjA1ODYyMTU3NH0.IE1UReAZZk-9fbqi8SV3EF86Py703eoJVvpEBbzCBAo';
const supabase = createClient(supabaseUrl, supabaseKey);

const rfidPage = {
  async render() {
    return `
      <section class="rfid-page">
        <h2>Manajemen RFID Tag</h2>
        <div class="tabs">
          <a class="active">Daftar RFID Tag</a>
        </div>
        <div class="actions" style="display: flex; gap: 10px; align-items: center;">
          <button id="btn-tambah" class="btn btn-success">Tambah Data RFID</button>
          <select id="search-status" class="status-filter">
            <option value="">All Status</option>
            <option value="assigned">Assigned</option>
            <option value="available">Available</option>
          </select>
        </div>

        <!-- Modal Tambah -->
        <div id="modal-tambah" class="modal hidden">
          <div class="modal-content">
            <h3>Tambah RFID</h3>
            <form id="form-tambah">
              <label for="tambah-rfid-id">ID</label>
              <input type="number" id="tambah-rfid-id" min="1" placeholder="(Kosongkan untuk otomatis)" />
              
              <label for="tambah-rfid-tag">RFID Tag</label>
              <input type="text" id="tambah-rfid-tag" required />
              
              <label for="tambah-rfid-status">Status</label>
                <input type="text" id="tambah-rfid-status" value="available" readonly />
              </select>

              <div class="form-actions2">
                <button type="submit" class="btn-rfid-save" id="btn-save-tambah">Simpan</button>
                <button type="button" class="btn-rfid-cancel" id="btn-cancel-tambah">Batal</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Modal Edit -->
        <div id="modal-edit" class="modal hidden">
          <div class="modal-content">
            <h3>Edit RFID</h3>
            <form id="form-edit">
              <label for="edit-rfid-id">ID</label>
              <input type="number" id="edit-rfid-id" readonly />
              
              <label for="edit-rfid-tag">RFID Tag</label>
              <input type="text" id="edit-rfid-tag" required />
              
              <label for="edit-rfid-status">Status</label>
              <select id="edit-rfid-status" required>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
              </select>

              <div class="form-actions2">
                <button type="submit" class="btn-rfid-save" id="btn-save-edit">Simpan</button>
                <button type="button" class="btn-rfid-cancel" id="btn-cancel-edit">Batal</button>
              </div>
            </form>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>RFID Tag</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="rfid-table-body"></tbody>
        </table>

        <div class="pagination">
          <button id="btn-prev">Sebelumnya</button>
          <button id="btn-next">Berikutnya</button>
        </div>
        <div id="popup-notif" class="popup-notif">
  <span id="popup-message"></span>
</div>
      </section>
    `;
  },


async afterRender() {
  const isLoggedIn = localStorage.getItem('isloggedin') === 'true' || localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    alert('Anda belum login!');
    window.location.href = '/#/login';
    return;
  }

  let currentPage = 1;
  const itemsPerPage = 10;
  let totalPages = 1;
  const searchStatusInput = document.getElementById('search-status');

  const modalTambah = document.getElementById('modal-tambah');
  const modalEdit = document.getElementById('modal-edit');

  const showModalTambah = () => modalTambah.classList.remove('hidden');
  const hideModalTambah = () => {
    modalTambah.classList.add('hidden');
    document.getElementById('form-tambah').reset();
  };

  const showModalEdit = () => modalEdit.classList.remove('hidden');
  const hideModalEdit = () => {
    modalEdit.classList.add('hidden');
    document.getElementById('form-edit').reset();
  };
  const showPopup = (message, isError = false) => {
  const popup = document.getElementById('popup-notif');
  const messageSpan = document.getElementById('popup-message');
  popup.classList.remove('error');
  popup.classList.add('show');
  if (isError) popup.classList.add('error');
  messageSpan.textContent = message;

  setTimeout(() => {
    popup.classList.remove('show');
  }, 3000); // tampil 3 detik
};


  const loadRFID = async (page = 1) => {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    const filterStatus = searchStatusInput.value;

    let query = supabase
      .from('rfid_tag')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('id', { ascending: true });

    if (filterStatus) {
      query = query.eq('status', filterStatus);
    }

    const { data, error, count } = await query;
    if (error) {
      alert('Gagal memuat data: ' + error.message);
      return;
    }

    totalPages = Math.ceil((count || 0) / itemsPerPage);

    const tbody = document.getElementById('rfid-table-body');
tbody.innerHTML = '';
data.forEach(item => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${item.id}</td>
    <td>${item.rfid_tag}</td>
    <td>${item.status}</td>
    <td>
      <button class="action-btn edit-btn" data-id="${item.id}">
        <i class="fa fa-edit"></i>
      </button>
      <button class="action-btn delete-btn" data-id="${item.id}">
        <i class="fa fa-trash"></i>
      </button>
    </td>
  `;
  tbody.appendChild(tr);
});


    document.getElementById('btn-prev').disabled = currentPage === 1;
    document.getElementById('btn-next').disabled = currentPage >= totalPages || totalPages === 0;

    attachActionListeners();
  };

  const attachActionListeners = () => {
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const { data: item, error } = await supabase
          .from('rfid_tag')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          alert('Gagal mengambil data: ' + error.message);
          return;
        }

        document.getElementById('edit-rfid-id').value = item.id;
        document.getElementById('edit-rfid-tag').value = item.rfid_tag;
        document.getElementById('edit-rfid-status').value = item.status;

        showModalEdit();
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        //if (!confirm('Yakin ingin menghapus?')) return;

        const { error } = await supabase.from('rfid_tag').delete().eq('id', id);
       if (error) {
  showPopup('Gagal menghapus data!', true);
} else {
  showPopup('RFID berhasil dihapus!');
  await loadRFID(currentPage);
}

      });
    });
  };

  document.getElementById('btn-tambah').addEventListener('click', () => {
    document.getElementById('form-tambah').reset();
    showModalTambah();
  });

  document.getElementById('btn-cancel-tambah').addEventListener('click', () => {
    hideModalTambah();
  });

  document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    hideModalEdit();
  });

  document.getElementById('form-tambah').addEventListener('submit', async (e) => {
    e.preventDefault();

    const idValue = document.getElementById('tambah-rfid-id').value.trim();
    const rfidTag = document.getElementById('tambah-rfid-tag').value.trim();
    const status = document.getElementById('tambah-rfid-status').value;

    const { data: existingByTag, error: errorByTag } = await supabase
      .from('rfid_tag')
      .select('*')
      .eq('rfid_tag', rfidTag)
      .limit(1);

    if (errorByTag) {
      alert('Error validasi RFID Tag: ' + errorByTag.message);
      return;
    }

    if (existingByTag && existingByTag.length > 0) {
      alert(`RFID Tag "${rfidTag}" sudah ada, gunakan tag lain.`);
      return;
    }

    const insertData = {
      rfid_tag: rfidTag,
      status: status
    };

    if (idValue !== '') {
      const id = parseInt(idValue, 10);
      const { data: existingById, error: errorById } = await supabase
        .from('rfid_tag')
        .select('*')
        .eq('id', id)
        .limit(1);

      if (errorById) {
        alert('Error validasi ID: ' + errorById.message);
        return;
      }

      if (existingById && existingById.length > 0) {
        alert(`ID "${id}" sudah ada, gunakan ID lain atau kosongkan.`);
        return;
      }

      insertData.id = id;
    } else {
      // Cari ID terkecil yang belum dipakai
      const { data: allIDs, error: fetchErr } = await supabase
        .from('rfid_tag')
        .select('id')
        .order('id', { ascending: true });

      if (fetchErr) {
        alert('Gagal mencari ID unik: ' + fetchErr.message);
        return;
      }

      const usedIds = new Set(allIDs.map(item => item.id));
      let newId = 1;
      while (usedIds.has(newId)) newId++;
      insertData.id = newId;
    }

    const { error: insertError } = await supabase
      .from('rfid_tag')
      .insert([insertData]);

    if (insertError) {
      alert('Gagal menambahkan data: ' + insertError.message);
      return;
    }
hideModalTambah();
showPopup('RFID berhasil ditambahkan!');
await loadRFID(currentPage);

  });

  document.getElementById('form-edit').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = parseInt(document.getElementById('edit-rfid-id').value, 10);
    const rfidTag = document.getElementById('edit-rfid-tag').value.trim();
    const status = document.getElementById('edit-rfid-status').value;

    const { data: existing, error: err } = await supabase
      .from('rfid_tag')
      .select('*')
      .eq('rfid_tag', rfidTag);

    if (err) {
      alert('Error validasi RFID Tag: ' + err.message);
      return;
    }

    if (existing.some(item => item.id !== id)) {
      alert(`RFID Tag "${rfidTag}" sudah dipakai oleh ID lain.`);
      return;
    }

    const { error } = await supabase
      .from('rfid_tag')
      .update({ rfid_tag: rfidTag, status })
      .eq('id', id);

    if (error) {
      alert('Gagal update data: ' + error.message);
      return;
    }
hideModalEdit();
showPopup('RFID berhasil diperbarui!');
await loadRFID(currentPage);

  });

  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadRFID(currentPage);
    }
  });

  document.getElementById('btn-next').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadRFID(currentPage);
    }
  });

  searchStatusInput.addEventListener('change', () => {
    currentPage = 1;
    loadRFID(currentPage);
  });

  window.addEventListener('click', (e) => {
    if (e.target === modalTambah) hideModalTambah();
    if (e.target === modalEdit) hideModalEdit();
  });

  loadRFID(currentPage);
  
}

};

export default rfidPage;
