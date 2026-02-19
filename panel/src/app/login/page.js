'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.role !== 'admin') {
                setError('Admin yetkisine sahip değilsiniz');
                setLoading(false);
                return;
            }
            localStorage.setItem('admin_token', res.data.token);
            localStorage.setItem('admin_user', JSON.stringify(res.data));
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Giriş yapılamadı');
        }
        setLoading(false);
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleLogin}>
                <div className="login-logo">
                    <div className="login-logo-icon">P</div>
                    <div className="login-title">PREDIABET</div>
                    <div className="login-subtitle">Yönetim Paneli</div>
                </div>

                {error && <div className="login-error">{error}</div>}

                <div className="form-group">
                    <label className="form-label">E-posta</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@prediabet.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Şifre</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>
        </div>
    );
}
