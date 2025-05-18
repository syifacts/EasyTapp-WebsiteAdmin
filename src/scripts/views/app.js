import UrlParser from "../routes/url-parser";
import routes from "../routes/routes";

class App {
  constructor({ content }) {
    this._content = content;
    this._initialAppShell();
    this._setupSessionTimeout();
  }

  async _initialAppShell() {
    window.addEventListener('hashchange', () => this.renderPage());
    window.addEventListener('load', () => this.renderPage());
    
    // Track user activity to refresh session
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(eventType => {
      document.addEventListener(eventType, () => this._refreshSession(), { passive: true });
    });
  }
  
  _setupSessionTimeout() {
    // Check session status every minute
    setInterval(() => this._checkSessionTimeout(), 60000); // 60 detik
  }
  
  _checkSessionTimeout() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const sessionExpiry = parseInt(localStorage.getItem('sessionExpiry'));
    const currentTime = new Date().getTime();
    
    if (isLoggedIn && sessionExpiry && currentTime >= sessionExpiry) {
      // Session sudah expired, logout user
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('sessionExpiry');
      
      // Redirect ke halaman login jika user masih di halaman yang memerlukan auth
      const url = UrlParser.parseActiveUrlWithCombiner();
      if (url !== '/login') {
        window.location.hash = '/login';
      }
    }
  }
  
  _refreshSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const currentTime = new Date().getTime();
      const sessionTimeout = 15 * 60 * 1000; // 15 menit dalam milidetik
      localStorage.setItem('sessionExpiry', currentTime + sessionTimeout);
    }
  }

  _updateNavigation(currentUrl = '') {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navigationDrawer = document.querySelector('#navigationDrawer');

    if (!navigationDrawer) return;

    if (currentUrl === '/login') {
      navigationDrawer.innerHTML = '';
      return;
    }

    if (isLoggedIn) {
      navigationDrawer.innerHTML = `
        <div class="d-flex align-items-center mb-4" style="margin-top: 12px;">
          <img src="/icons/logo.png" alt="EasyTapp Logo"
              style="width: 48px; height: 48px; margin-right: 12px;" />
          <h4 class="mb-0" style="font-weight: 800; user-select: none;">EasyTapp</h4>
        </div>
        <hr style="border-top: 1px solid white; opacity: 1; margin-bottom: 1rem;" />
        <ul class="nav flex-column">
          <li class="nav-item">
            <a href="#/dashboard" class="nav-link">
              <i class="bi bi-grid-fill"></i> Dashboard
            </a>
          </li>
          <hr style="border-top: 1px solid white; opacity: 1; margin-bottom: 1rem;" />
          <p class="nav-section">DATA ABSENSI</p>
          <li class="nav-item">
            <a href="#/karyawan" class="nav-link">
              <i class="bi bi-person-badge"></i> Karyawan
            </a>
          </li>
          <li class="nav-item">
            <a href="#/absensi" class="nav-link">
              <i class="bi bi-calendar-event"></i> Absensi
            </a>
          </li>
          <li class="nav-item">
            <a href="#/rfid" class="nav-link">
              <i class="bi bi-credit-card"></i> RFID
            </a>
          </li>
          <hr style="border-top: 1px solid white; opacity: 1; margin-bottom: 1rem;" />
          <p class="nav-section">PENGATURAN</p>
          <li class="nav-item">
            <a href="#/account" class="nav-link">
              <i class="bi bi-person-gear"></i> Akun
            </a>
          </li>
          <li class="nav-item">
            <a href="#/" id="logout-link" class="nav-link">
              <i class="bi bi-box-arrow-right"></i> Logout
            </a>
          </li>
        </ul>

        <div id="sidebar-clock" class="sidebar-clock">
          <span id="clock">00:00:00</span>
        </div>
      `;

      const setActiveNavLink = () => {
        const navLinks = navigationDrawer.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          const linkUrl = link.getAttribute('href')?.replace('#', '');
          if (linkUrl === currentUrl) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      };

      setTimeout(() => {
        setActiveNavLink();
        const logoutLink = document.querySelector('#logout-link');
        logoutLink?.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.clear();
          window.location.hash = '/login';
        });
      }, 0);

      this._startWIBClock();
      this._startSessionTimer();
    }
  }
  
  _startSessionTimer() {
    const timerElement = document.getElementById('session-timer');
    if (!timerElement) return;

    const updateTimer = () => {
      const sessionExpiry = parseInt(localStorage.getItem('sessionExpiry'));
      if (!sessionExpiry) return;
      
      const currentTime = new Date().getTime();
      const remainingTime = Math.max(0, sessionExpiry - currentTime);
      
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      
      timerElement.textContent = `Session: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    updateTimer(); // first call
    clearInterval(this._timerInterval); // avoid duplication
    this._timerInterval = setInterval(updateTimer, 1000);
  }

  _startWIBClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const updateClock = () => {
      const now = new Date();
      const wibOffset = 7 * 60; // UTC+7
      const localOffset = now.getTimezoneOffset();
      const wibTime = new Date(now.getTime() + (wibOffset + localOffset) * 60000);

      const hours = String(wibTime.getHours()).padStart(2, '0');
      const minutes = String(wibTime.getMinutes()).padStart(2, '0');
      const seconds = String(wibTime.getSeconds()).padStart(2, '0');

      clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    };

    updateClock(); // first call
    clearInterval(this._clockInterval); // avoid duplication
    this._clockInterval = setInterval(updateClock, 1000);
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const sessionExpiry = parseInt(localStorage.getItem('sessionExpiry'));
    const currentTime = new Date().getTime();
    const isSessionValid = isLoggedIn && sessionExpiry && currentTime < sessionExpiry;
    
    const sidebar = document.getElementById('navigationDrawer');
    const appWrapper = document.getElementById('appWrapper');

    // Check session validity for protected routes
    if (!isSessionValid && url !== '/login') {
      window.location.hash = '/login';
      return;
    }

    if (isSessionValid && url === '/login') {
      window.location.hash = '/dashboard';
      return;
    }

    const page = routes[url] || routes['/404'];
    this._content.innerHTML = await page.render();
    await page.afterRender();

    if (sidebar && appWrapper) {
      if (url === '/login') {
        sidebar.style.display = 'none';
        appWrapper.classList.remove('d-flex');
      } else {
        sidebar.style.display = 'block';
        appWrapper.classList.add('d-flex');
      }
    }

    this._updateNavigation(url);
    
    // Refresh session on page navigation if logged in
    if (isSessionValid) {
      this._refreshSession();
    }
  }
}

export default App;