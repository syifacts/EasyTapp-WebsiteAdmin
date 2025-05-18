import { createClient } from '@supabase/supabase-js';
import { DateTime } from 'luxon';

const supabaseUrl = 'https://oteebvgtsvgrkfooinrv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZWVidmd0c3Zncmtmb29pbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDU1NzQsImV4cCI6MjA1ODYyMTU3NH0.IE1UReAZZk-9fbqi8SV3EF86Py703eoJVvpEBbzCBAo';
const supabase = createClient(supabaseUrl, supabaseKey);

const accountPage = {
  async render() {
    return `
      <section class="account">
        <h2>Informasi Akun Admin</h2>
        <form id="form-account">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" disabled>

          <label for="role">Peran</label>
          <input type="text" id="role" name="role" value="Administrator" disabled>

          <label for="last-login">Terakhir Login</label>
          <input type="text" id="last-login" name="last-login" disabled>

        
        </form>
      </section>
    `;
  },

  async afterRender() {
    const isLoggedIn =
      localStorage.getItem('isloggedin') === 'true' ||
      localStorage.getItem('isLoggedIn') === 'true';

    const loggedInUser =
      localStorage.getItem('loggedInUser') ||
      localStorage.getItem('username');

    if (!isLoggedIn || !loggedInUser) {
      alert('Anda belum login! Silakan login terlebih dahulu.');
      window.location.href = '/#/login';
      return;
    }

    // Ambil data admin dari Supabase
    const { data, error } = await supabase
      .from('admin')
      .select('id, username, last_login')
      .eq('username', loggedInUser)
      .single();

    if (error || !data) {
      alert('Gagal mengambil data admin: ' + (error?.message || 'Data tidak ditemukan'));
      return;
    }

    const adminId = data.id;

    // Tampilkan data di form
    document.getElementById('username').value = data.username;
    if (data.last_login) {
      document.getElementById('last-login').value = DateTime
        .fromISO(data.last_login)
        .setZone('Asia/Jakarta')
        .toLocaleString(DateTime.DATETIME_MED);
    } else {
      document.getElementById('last-login').value = '-';
    }

    // Tangani submit form untuk mengubah username
    document.getElementById('form-account').addEventListener('submit', async (e) => {
      e.preventDefault();

      const newUsername = document.getElementById('username').value.trim();

      if (!newUsername) {
        alert('Username tidak boleh kosong.');
        return;
      }

      const { error: updateError } = await supabase
        .from('admin')
        .update({ username: newUsername })
        .eq('id', adminId);

      if (updateError) {
        alert('Gagal menyimpan data: ' + updateError.message);
        return;
      }

      alert('Data berhasil diperbarui.');
      localStorage.setItem('username', newUsername);
      localStorage.setItem('loggedInUser', newUsername);
    });
  }
};

export default accountPage;
