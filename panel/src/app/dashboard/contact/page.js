'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export default function ContactPage() {
    const [form, setForm] = useState({ phone: '', email: '', website: '', whatsapp: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const r = await api.get('/admin/contact');
            if (r.data) setForm(r.data);
        } catch (e) { }
        setLoading(false);
    };

    const save = async () => {
        setSaving(true);
        try {
            await api.put('/admin/contact', form);
            alert('İletişim bilgileri güncellendi');
        } catch (e) { alert('Hata oluştu'); }
        setSaving(false);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Yükleniyor...</div>;

    return (
        <div className="data-card" style={{ maxWidth: 600 }}>
            <div className="data-card-header">
                <span className="data-card-title">İletişim Bilgileri</span>
            </div>
            <div style={{ padding: 24 }}>
                <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">E-posta</label><input className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">WhatsApp</label><input className="form-input" value={form.whatsapp || ''} onChange={e => setForm({ ...form, whatsapp: e.target.value })} /></div>
                <button className="btn btn-primary" onClick={save} disabled={saving} style={{ marginTop: 8 }}>
                    {saving ? 'Kaydediliyor...' : 'Güncelle'}
                </button>
            </div>
        </div>
    );
}
