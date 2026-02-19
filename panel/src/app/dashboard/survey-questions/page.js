'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

export default function SurveyQuestionsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState({ questionText: '', options: [{ text: '', score: 0 }], order: 0 });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const r = await api.get('/admin/survey-questions'); setItems(r.data); } catch (e) { }
        setLoading(false);
    };

    const openNew = () => { setForm({ questionText: '', options: [{ text: '', score: 0 }], order: items.length }); setModal('new'); };
    const openEdit = (i) => { setForm({ ...i }); setModal('edit'); };

    const addOption = () => setForm({ ...form, options: [...form.options, { text: '', score: 0 }] });
    const removeOption = (idx) => setForm({ ...form, options: form.options.filter((_, i) => i !== idx) });
    const updateOption = (idx, field, val) => {
        const opts = [...form.options];
        opts[idx] = { ...opts[idx], [field]: field === 'score' ? parseInt(val) || 0 : val };
        setForm({ ...form, options: opts });
    };

    const save = async () => {
        try {
            if (modal === 'new') await api.post('/admin/survey-questions', form);
            else await api.put(`/admin/survey-questions/${form._id}`, form);
            setModal(null); load();
        } catch (e) { alert('Hata oluştu'); }
    };

    const remove = async (id) => {
        if (!confirm('Bu soruyu silmek istediğinizden emin misiniz?')) return;
        try { await api.delete(`/admin/survey-questions/${id}`); load(); } catch (e) { alert('Silinemedi'); }
    };

    return (
        <div>
            <div className="data-card">
                <div className="data-card-header">
                    <span className="data-card-title">Anket Soruları ({items.length})</span>
                    <button className="btn btn-primary btn-sm" onClick={openNew}><FiPlus /> Yeni</button>
                </div>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</div>
                ) : items.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-icon">📋</div><div className="empty-state-text">Henüz soru eklenmemiş</div></div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>#</th><th>Soru</th><th>Seçenek Sayısı</th><th>İşlem</th></tr></thead>
                        <tbody>
                            {items.map((i, idx) => (
                                <tr key={i._id}>
                                    <td>{idx + 1}</td>
                                    <td style={{ maxWidth: 400 }}>{i.questionText}</td>
                                    <td><span className="badge badge-info">{i.options?.length || 0} seçenek</span></td>
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
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
                        <div className="modal-header">
                            <span className="modal-title">{modal === 'new' ? 'Yeni Soru Ekle' : 'Soru Düzenle'}</span>
                            <button className="modal-close" onClick={() => setModal(null)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label className="form-label">Soru Metni</label><textarea className="form-textarea" style={{ minHeight: 80 }} value={form.questionText} onChange={e => setForm({ ...form, questionText: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Sıralama</label><input className="form-input" type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} /></div>
                            <div className="form-group">
                                <label className="form-label">Seçenekler</label>
                                {form.options.map((opt, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                        <input className="form-input" style={{ flex: 1 }} placeholder="Seçenek metni" value={opt.text} onChange={e => updateOption(idx, 'text', e.target.value)} />
                                        <input className="form-input" style={{ width: 80 }} type="number" placeholder="Puan" value={opt.score} onChange={e => updateOption(idx, 'score', e.target.value)} />
                                        <button className="btn-icon danger" onClick={() => removeOption(idx)}><FiTrash2 size={14} /></button>
                                    </div>
                                ))}
                                <button className="btn btn-outline btn-sm" onClick={addOption} style={{ marginTop: 4 }}><FiPlus /> Seçenek Ekle</button>
                            </div>
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
