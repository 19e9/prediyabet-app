'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSearch } from 'react-icons/fi';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '', role: 'user' });
    const [search, setSearch] = useState('');

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await api.get('/admin/users'); setUsers(r.data); } catch (e) { }
        setLoading(false);
    };

    const openNew = () => { setForm({ name: '', surname: '', email: '', phone: '', password: '', role: 'user' }); setModal('new'); };
    const openEdit = (u) => { setForm({ ...u, password: '' }); setModal('edit'); };

    const save = async () => {
        try {
            if (modal === 'new') {
                await api.post('/auth/register', form);
            } else {
                const data = { ...form };
                if (!data.password) delete data.password;
                await api.put(`/admin/users/${form._id}`, data);
            }
            setModal(null); load();
        } catch (e) { alert(e.response?.data?.message || 'Hata oluştu'); }
    };

    const remove = async (id) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
        try { await api.delete(`/admin/users/${id}`); load(); } catch (e) { alert('Silinemedi'); }
    };

    const filtered = users.filter(u =>
        `${u.name} ${u.surname} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="data-card">
                <div className="data-card-header">
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span className="data-card-title">Kullanıcılar ({users.length})</span>
                        <div className="search-bar">
                            <FiSearch size={16} style={{ color: 'var(--text-light)' }} />
                            <input className="search-input" placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={openNew}><FiPlus /> Yeni</button>
                </div>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Rol</th><th>Tarih</th><th>İşlem</th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.name} {u.surname}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone || '-'}</td>
                                    <td><span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{u.role}</span></td>
                                    <td>{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn-icon" onClick={() => openEdit(u)}><FiEdit2 size={14} /></button>
                                            <button className="btn-icon danger" onClick={() => remove(u._id)}><FiTrash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">{modal === 'new' ? 'Yeni Kullanıcı' : 'Kullanıcı Düzenle'}</span>
                            <button className="modal-close" onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label className="form-label">Ad</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Soyad</label><input className="form-input" value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">E-posta</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Şifre {modal === 'edit' && '(boş bırakın değişmesin)'}</label><input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Rol</label><select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="user">Kullanıcı</option><option value="admin">Admin</option></select></div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setModal(null)}>İptal</button>
                            <button className="btn btn-primary" onClick={save}>Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
