'use client';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { FiUsers, FiActivity, FiTrendingUp, FiShoppingCart, FiClipboard, FiFileText } from 'react-icons/fi';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadStats(); }, []);

    const loadStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (e) { }
        setLoading(false);
    };

    const statCards = stats ? [
        { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: <FiUsers />, color: '#6366F1', bg: '#EEF2FF' },
        { label: 'Adım Kayıtları', value: stats.totalSteps, icon: <FiActivity />, color: '#EF4444', bg: '#FEE2E2' },
        { label: 'BKİ Kayıtları', value: stats.totalBmi, icon: <FiTrendingUp />, color: '#10B981', bg: '#D1FAE5' },
        { label: 'Besin Kayıtları', value: stats.totalFood, icon: <FiShoppingCart />, color: '#F59E0B', bg: '#FEF3C7' },
        { label: 'Anket Sonuçları', value: stats.totalSurveys, icon: <FiClipboard />, color: '#8B5CF6', bg: '#EDE9FE' },
        { label: 'Test Sonuçları', value: stats.totalTests, icon: <FiFileText />, color: '#EC4899', bg: '#FCE7F3' },
    ] : [];

    if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Yükleniyor...</div>;

    return (
        <div>
            <div className="stats-grid">
                {statCards.map((card, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-card-icon" style={{ background: card.bg, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="stat-card-value">{card.value}</div>
                        <div className="stat-card-label">{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Users Table */}
            <div className="data-card">
                <div className="data-card-header">
                    <span className="data-card-title">Son Kayıt Olan Kullanıcılar</span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Ad</th>
                            <th>E-posta</th>
                            <th>Rol</th>
                            <th>Kayıt Tarihi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats?.recentUsers?.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name} {u.surname}</td>
                                <td>{u.email}</td>
                                <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span></td>
                                <td>{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
