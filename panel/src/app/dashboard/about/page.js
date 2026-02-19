'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';

export default function AboutPage() {
    const [form, setForm] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const r = await api.get('/admin/about');
            if (r.data) setForm(r.data);
        } catch (e) { }
        setLoading(false);
    };

    const save = async () => {
        setSaving(true);
        try {
            await api.put('/admin/about', form);
            alert('Hakkımızda bilgileri güncellendi');
        } catch (e) { alert('Hata oluştu'); }
        setSaving(false);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Yükleniyor...</div>;

    return (
        <div className="data-card" style={{ maxWidth: 600 }}>
            <div className="data-card-header">
                <span className="data-card-title">Hakkımızda İçeriği</span>
            </div>
            <div style={{ padding: 24 }}>
                <div className="form-group"><label className="form-label">Başlık</label><input className="form-input" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">İçerik</label><textarea className="form-textarea" style={{ minHeight: 200 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
                <button className="btn btn-primary" onClick={save} disabled={saving} style={{ marginTop: 8 }}>
                    {saving ? 'Kaydediliyor...' : 'Güncelle'}
                </button>
            </div>
        </div>
    );
}
