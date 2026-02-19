'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const categories = ['Meyve', 'Sebze', 'Protein', 'Tahıl', 'Süt Ürünleri', 'Atıştırmalık', 'İçecek', 'Diğer'];

export default function FoodItemsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ name: '', category: 'Diğer', calories: 0 });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await api.get('/admin/food-items'); setItems(r.data); } catch (e) { }
        setLoading(false);
    };

    const openNew = () => { setForm({ name: '', category: 'Diğer', calories: 0 }); setModal('new'); };
    const openEdit = (i) => { setForm({ ...i }); setModal('edit'); };

    const save = async () => {
        try {
            if (modal === 'new') await api.post('/admin/food-items', form);
            else await api.put(`/admin/food-items/${form._id}`, form);
            setModal(null); load();
        } catch (e) { alert('Hata oluştu'); }
    };

    const remove = async (id) => {
        if (!confirm('Bu besini silmek istediğinizden emin misiniz?')) return;
        try { await api.delete(`/admin/food-items/${id}`); load(); } catch (e) { alert('Silinemedi'); }
    };

    return (
        <div>
            <div className="data-card">
                <div className="data-card-header">
                    <span className="data-card-title">Besin Listesi ({items.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={openNew}><FiPlus /> Yeni</button>
                </div>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon">🥗</div><div className="empty-state-text">Henüz besin eklenmemiş</div></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Besin Adı</th><th>Kategori</th><th>Kalori</th><th>İşlem</th></tr></thead>
                        <tbody>
                            {items.map((i) => (
                                <tr key={i._id}>
                                    <td>{i.name}</td>
                                    <td><span className="badge badge-success">{i.category}</span></td>
                                    <td>{i.calories} kcal</td>
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
                            <span className="modal-title">{modal === 'new' ? 'Yeni Besin Ekle' : 'Besin Düzenle'}</span>
                            <button className="modal-close" onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label className="form-label">Besin Adı</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Kategori</label><select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                            <div className="form-group"><label className="form-label">Kalori (kcal)</label><input className="form-input" type="number" value={form.calories} onChange={e => setForm({ ...form, calories: parseInt(e.target.value) || 0 })} /></div>
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
