import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export default function PublicLayout() {

    const location = useLocation();
    const isAuthPage = location.pathname.startsWith('/auth');

    return (
        <div>
            <div>
                <Navbar className={isAuthPage
                    ? "relative bg-emerald-700 w-full z-50 shadow-lg"
                    : "absolute inset-x-0 top-0 z-50"} />
            </div>

            <main>
                <Outlet />
            </main>

            {!isAuthPage && <Footer />}

        </div>
    )
}
