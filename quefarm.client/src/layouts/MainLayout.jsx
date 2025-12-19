// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingActionButton from '../components/FloatingActionButton';
import Breadcrumb from '../components/Breadcrumb';
import { useLocation } from 'react-router-dom';

const MainLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/' || location.pathname === '/homepage';

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                {!isHomePage && <Breadcrumb />}
                <Outlet />
            </main>
            <Footer />
            <FloatingActionButton />
        </div>
    );
};

export default MainLayout;
