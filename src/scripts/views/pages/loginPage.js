import supabase from '../../config/supabaseClient';
import { DateTime } from 'luxon';

const LoginPage = {
  async render() {
    return `
      <link rel="stylesheet" href="style.css">
      <div class="login-container">
        <h2>Login</h2>
        <form id="login-form">
          <div class="form-group">
            <label for="username">USERNAME</label>
            <div class="input-icon2">
              <input type="text" id="username" placeholder="ENTER USERNAME" required>
            </div>
          </div>
          <div class="form-group">
            <label for="password">PASSWORD</label>
            <div class="input-icon">
              <input type="password" id="password" placeholder="ENTER PASSWORD" required>
            </div>
          </div>
          <button type="submit" class="login-btn">LOGIN</button>
        </form>

        <div class="popup popup-success" id="popup-success">
          <p id="popup-message"></p>
          <button id="close-success-popup">Tutup</button>
        </div>

        <div class="popup popup-error" id="popup-error">
          <p id="popup-message-error"></p>
          <button id="close-error-popup">Tutup</button>
        </div>
      </div>
    `;
  },

  async afterRender() {
    document.body.classList.add('login-page');
    const form = document.getElementById('login-form');
    
    // Check if there's an active session
    this.checkExistingSession();
    
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username')?.value.trim();
        const password = document.getElementById('password')?.value;

        if (!username || !password) {
          this.showPopup('error', 'Harap isi semua kolom!');
          return;
        }

        // Langkah 1: Cek kredensial user
        const { data: user, error } = await supabase
          .from('admin')
          .select('id, username')
          .match({ username, password })
          .single();

        if (error || !user) {
          this.showPopup('error', 'Login gagal: Username atau password salah.');
          return;
        }

        // Langkah 2: Ambil current_login dan last_login terakhir dari database
        const { data: currentData, error: fetchError } = await supabase
          .from('admin')
          .select('current_login, last_login') // Ambil current_login dan last_login
          .eq('id', user.id)
          .single();

        if (fetchError || !currentData) {
          this.showPopup('error', 'Gagal mengambil data login sebelumnya.');
          return;
        }

        // Waktu sekarang
        const now = DateTime.now().setZone('Asia/Jakarta').toISO();

        // Langkah 3: Update last_login dan current_login
        await supabase
          .from('admin')
          .update({
            last_login: currentData.current_login || currentData.last_login || now, // jika tidak ada current_login sebelumnya, gunakan last_login
            current_login: now // update dengan waktu sekarang
          })
          .eq('id', user.id);

        // Setup session dengan timeout 15 menit
        this.setupSession(user.username.toLowerCase());

        this.showPopup('success', `Login sukses! Selamat datang, ${user.username}`);

        setTimeout(() => {
          window.location.hash = '/dashboard';
        }, 2000);
      });
    }

    document.getElementById('close-success-popup')?.addEventListener('click', () => this.closePopup());
    document.getElementById('close-error-popup')?.addEventListener('click', () => this.closePopup());
  },

  setupSession(username) {
    const currentTime = new Date().getTime();
    const sessionTimeout = 15 * 60 * 1000; // 15 menit dalam milidetik
    
    // Save session info
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('sessionExpiry', currentTime + sessionTimeout);
  },
  
  checkExistingSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const sessionExpiry = parseInt(localStorage.getItem('sessionExpiry'));
    const currentTime = new Date().getTime();
    
    // Jika session masih aktif (belum expired), langsung redirect ke dashboard
    if (isLoggedIn && sessionExpiry && currentTime < sessionExpiry) {
      // Update session expiry time since user is active
      this.refreshSession();
      window.location.hash = '/dashboard';
    } else if (isLoggedIn && sessionExpiry && currentTime >= sessionExpiry) {
      // Session expired, clear storage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('sessionExpiry');
    }
  },
  
  refreshSession() {
    const currentTime = new Date().getTime();
    const sessionTimeout = 15 * 60 * 1000; // 15 menit dalam milidetik
    localStorage.setItem('sessionExpiry', currentTime + sessionTimeout);
  },

  showPopup(type, message) {
    const popupId = type === 'error' ? 'popup-error' : 'popup-success';
    const messageId = type === 'error' ? 'popup-message-error' : 'popup-message';

    const messageElement = document.getElementById(messageId);
    const popupElement = document.getElementById(popupId);

    if (messageElement && popupElement) {
      messageElement.textContent = message;
      popupElement.classList.add('show');
    }
  },

  closePopup() {
    document.getElementById('popup-success')?.classList.remove('show');
    document.getElementById('popup-error')?.classList.remove('show');
  }
};

export default LoginPage;