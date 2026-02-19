'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export default function FaqPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ question: '', answer: '', order: 0 });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await api.get('/admin/faq'); setItems(r.data); } catch (e) { }
        setLoading(false);
    };

    const openNew = () => { setForm({ question: '', answer: '', order: items.length }); setModal('new'); };
    const openEdit = (i) => { setForm({ ...i }); setModal('edit'); };

    const save = async () => {
        try {
            if (modal === 'new') await api.post('/admin/faq', form);
            else await api.put(`/admin/faq/${form._id}`, form);
            setModal(null); load();
        } catch (e) { alert('Hata oluştu'); }
    };

    const remove = async (id) => {
        if (!confirm('Silmek istediğinizden emin misiniz?')) return;
        try { await api.delete(`/admin/faq/${id}`); load(); } catch (e) { alert('Silinemedi'); }
    };

    return (
        <div>
            <div className="data-card">
                <div className="data-card-header">
                    <span className="data-card-title">S.S.S. ({items.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={openNew}><FiPlus /> Yeni</button>
                </div>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon">❓</div><div className="empty-state-text">Henüz soru eklenmemiş</div></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>#</th><th>Soru</th><th>Cevap</th><th>İşlem</th></tr></thead>
                        <tbody>
                            {items.map((i, idx) => (
                                <tr key={i._id}>
                                    <td>{idx + 1}</td>
                                    <td style={{ maxWidth: 300 }}>{i.question}</td>
                                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.answer}</td>
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
                            <span className="modal-title">{modal === 'new' ? 'Yeni Soru Ekle' : 'Soru Düzenle'}</span>
                            <button className="modal-close" onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label className="form-label">Soru</label><textarea className="form-textarea" style={{ minHeight: 80 }} value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Cevap</label><textarea className="form-textarea" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Sıralama</label><input className="form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
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
