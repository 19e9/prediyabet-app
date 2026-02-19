'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiFileText, FiHelpCircle, FiShoppingBag, FiClipboard, FiPhone, FiInfo, FiLogOut, FiSun, FiMoon, FiList } from 'react-icons/fi';

const navItems = [
    { label: 'Dashboard', icon: FiHome, href: '/dashboard' },
    { label: 'Kullanıcılar', icon: FiUsers, href: '/dashboard/users' },
    { label: 'Sağlık Bilgileri', icon: FiFileText, href: '/dashboard/health-info' },
    { label: 'S.S.S.', icon: FiHelpCircle, href: '/dashboard/faq' },
    { label: 'Besinler', icon: FiShoppingBag, href: '/dashboard/food-items' },
    { label: 'Anket Soruları', icon: FiClipboard, href: '/dashboard/survey-questions' },
    { label: 'İletişim', icon: FiPhone, href: '/dashboard/contact' },
    { label: 'Hakkımızda', icon: FiInfo, href: '/dashboard/about' },
];

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [theme, setTheme] = useState('light');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const userData = localStorage.getItem('admin_user');
        if (!token) { router.replace('/login'); return; }
        if (userData) setUser(JSON.parse(userData));
        const saved = localStorage.getItem('panel_theme') || 'light';
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
    }, []);

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('panel_theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        router.replace('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">P</div>
                    <span className="sidebar-title">PREDIABET</span>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                            onClick={(e) => { e.preventDefault(); router.push(item.href); }}
                        >
                            <item.icon />
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.name}</span>
                        <button onClick={handleLogout} className="btn-icon danger" title="Çıkış Yap"><FiLogOut /></button>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div className="top-bar-title">
                        {navItems.find(n => n.href === pathname)?.label || 'PREDIABET Panel'}
                    </div>
                    <div className="top-bar-actions">
                        <button className="theme-toggle" onClick={toggleTheme} title="Tema Değiştir">
                            {theme === 'light' ? <FiMoon /> : <FiSun />}
                        </button>
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
