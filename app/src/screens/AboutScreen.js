import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function AboutScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadAbout(); }, []);

    const loadAbout = async () => {
        try {
            const res = await api.get('/about');
            setAbout(res.data);
        } catch (e) { }
        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>Hakkımızda</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 40 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* App Logo */}
                    <View style={styles.logoSection}>
                        <View style={[styles.logoCircle, { backgroundColor: c.primaryLight }]}>
                            <Icon name="heart-circle" size={64} color={c.primary} />
                        </View>
                        <Text style={[styles.appName, { color: c.primary }]}>PREDIABET</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: c.surface }]}>
                        <Text style={[styles.cardText, { color: c.text }]}>
                            {about?.content || 'İçerik yükleniyor...'}
                        </Text>
                    </View>

                    <View style={[styles.infoCard, { backgroundColor: c.surface }]}>
                        <View style={styles.infoRow}>
                            <Icon name="school-outline" size={20} color={c.primary} />
                            <Text style={[styles.infoText, { color: c.textSecondary }]}>
                                Samsun Sağlık Bilimleri Üniversitesi
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon name="code-slash-outline" size={20} color={c.primary} />
                            <Text style={[styles.infoText, { color: c.textSecondary }]}>
                                Versiyon 1.0.0
                            </Text>
                        </View>
                    </View>
                </ScrollView>
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
    content: { padding: 16, paddingBottom: 30 },
    logoSection: { alignItems: 'center', marginVertical: 24 },
    logoCircle: {
        width: 100, height: 100, borderRadius: 50,
        alignItems: 'center', justifyContent: 'center',
    },
    appName: { fontSize: 24, fontWeight: '800', marginTop: 12, letterSpacing: 2 },
    card: { padding: 20, borderRadius: 20, marginBottom: 16, elevation: 2 },
    cardText: { fontSize: 15, lineHeight: 24 },
    infoCard: { padding: 16, borderRadius: 16, elevation: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
    infoText: { fontSize: 14 },
});
