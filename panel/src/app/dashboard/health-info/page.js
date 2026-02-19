'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export default function HealthInfoPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', category: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await api.get('/admin/health-info'); setItems(r.data); } catch (e) { }
        setLoading(false);
    };

    const openNew = () => { setForm({ title: '', content: '', category: '' }); setModal('new'); };
    const openEdit = (i) => { setForm({ ...i }); setModal('edit'); };

    const save = async () => {
        try {
            if (modal === 'new') await api.post('/admin/health-info', form);
            else await api.put(`/admin/health-info/${form._id}`, form);
            setModal(null); load();
        } catch (e) { alert('Hata oluştu'); }
    };

    const remove = async (id) => {
        if (!confirm('Silmek istediğinizden emin misiniz?')) return;
        try { await api.delete(`/admin/health-info/${id}`); load(); } catch (e) { alert('Silinemedi'); }
    };

    return (
        <div>
            <div className="data-card">
                <div className="data-card-header">
                    <span className="data-card-title">Sağlık Bilgileri ({items.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={openNew}><FiPlus /> Yeni</button>
                </div>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon">📄</div><div className="empty-state-text">Henüz içerik eklenmemiş</div></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Başlık</th><th>Kategori</th><th>Tarih</th><th>İşlem</th></tr></thead>
                        <tbody>
                            {items.map((i) => (
                                <tr key={i._id}>
                                    <td>{i.title}</td>
                                    <td><span className="badge badge-info">{i.category || 'Genel'}</span></td>
                                    <td>{new Date(i.createdAt).toLocaleDateString('tr-TR')}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn-icon" onClick={() => openEdit(i)}><FiEdit2 size={14} /></button>
                                            <button className="btn-icon danger" onClick={() => remove(i._id)}><FiTrash2 size={14} /></button>
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
                            <span className="modal-title">{modal === 'new' ? 'Yeni Bilgi Ekle' : 'Bilgi Düzenle'}</span>
                            <button className="modal-close" onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label className="form-label">Başlık</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Kategori</label><input className="form-input" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">İçerik</label><textarea className="form-textarea" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
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
