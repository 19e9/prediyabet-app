import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function ContactScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadContact(); }, []);

    const loadContact = async () => {
        try {
            const res = await api.get('/contact');
            setContact(res.data);
        } catch (e) { }
        setLoading(false);
    };

    const openLink = (type) => {
        if (!contact) return;
        switch (type) {
            case 'phone': Linking.openURL(`tel:${contact.phone}`); break;
            case 'email': Linking.openURL(`mailto:${contact.email}`); break;
            case 'website': Linking.openURL(`https://${contact.website}`); break;
            case 'whatsapp': Linking.openURL(`https://wa.me/${contact.whatsapp?.replace(/\+/g, '')}`); break;
        }
    };

    const contactItems = contact ? [
        { icon: 'call-outline', label: `Telefon: ${contact.phone}`, type: 'phone', color: '#22C55E' },
        { icon: 'mail-outline', label: `E-Posta: ${contact.email}`, type: 'email', color: '#3B82F6' },
        { icon: 'globe-outline', label: `Website: ${contact.website}`, type: 'website', color: '#8B5CF6' },
        { icon: 'logo-whatsapp', label: 'WhatsApp ile yaz', type: 'whatsapp', color: '#25D366' },
    ] : [];

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>İletişim</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 40 }} />
            ) : (
                <View style={styles.content}>
                    {contactItems.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.contactCard, { backgroundColor: c.surface }]}
                            onPress={() => openLink(item.type)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                                <Icon name={item.icon} size={24} color={item.color} />
                            </View>
                            <Text style={[styles.contactText, { color: c.text }]}>{item.label}</Text>
                            <Icon name="chevron-forward" size={18} color={c.textLight} />
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={[styles.askExpert, { backgroundColor: c.primary }]}>
                        <Icon name="chatbubble-ellipses-outline" size={24} color="#fff" />
                        <Text style={styles.askExpertText}>Uzmana Sor</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    content: { padding: 16 },
    contactCard: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        borderRadius: 16, marginBottom: 12, elevation: 2,
    },
    iconCircle: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    contactText: { flex: 1, fontSize: 14, fontWeight: '500' },
    askExpert: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        padding: 18, borderRadius: 16, marginTop: 8, gap: 10,
    },
    askExpertText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
