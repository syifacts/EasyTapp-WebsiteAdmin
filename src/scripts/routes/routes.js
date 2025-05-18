import LoginPage from "../views/pages/loginPage";
import DashboardPage from "../views/pages/dashboard";
import karyawanPage from "../views/pages/karyawanPage";
import absensiPage from "../views/pages/absensiPage";
import accountPage from "../views/pages/accountPage";
import rfidPage from  "../views/pages/rfidPage";

const routes = {
    '/': LoginPage,
    '/login': LoginPage,
    '/dashboard': DashboardPage,
    '/karyawan': karyawanPage,
    '/absensi': absensiPage,
    '/account' : accountPage,
    '/rfid' : rfidPage,
};

export default routes;