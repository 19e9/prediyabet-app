import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';

const menuItems = [
    { title: 'Profil', icon: 'person-outline', screen: 'Profile', color: '#6366F1' },
    { title: 'Bilgilendirme', icon: 'information-circle-outline', screen: 'HealthInfo', color: '#0EA5E9' },
    { title: 'BKİ Hesaplama', icon: 'calculator-outline', screen: 'Bmi', color: '#10B981' },
    { title: 'Ön Testler', icon: 'clipboard-outline', screen: 'PreTest', color: '#F59E0B' },
    { title: 'Son Testler', icon: 'document-text-outline', screen: 'PostTest', color: '#8B5CF6' },
    { title: 'İletişim', icon: 'call-outline', screen: 'Contact', color: '#14B8A6' },
    { title: 'Hakkımızda', icon: 'help-circle-outline', screen: 'About', color: '#EC4899' },
    { title: 'S.S.S.', icon: 'chatbubble-ellipses-outline', screen: 'Faq', color: '#F97316' },
    { title: 'Besin Ekle', icon: 'nutrition-outline', screen: 'FoodTracking', color: '#22C55E' },
    { title: 'Adımsayar', icon: 'footsteps-outline', screen: 'Pedometer', color: '#EF4444' },
];

export default function HomeScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
    const c = theme.colors;

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={c.primary} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={[styles.greeting, { color: c.headerText }]}>Merhaba,</Text>
                        <Text style={[styles.userName, { color: c.headerText }]}>{user?.name} {user?.surname}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={toggleTheme} style={styles.headerBtn}>
                            <Icon name={isDark ? 'sunny-outline' : 'moon-outline'} size={24} color={c.headerText} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={logout} style={styles.headerBtn}>
                            <Icon name="log-out-outline" size={24} color={c.headerText} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FINDRISK Banner */}
                <TouchableOpacity
                    style={[styles.banner, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
                    onPress={() => navigation.navigate('Findrisk')}
                >
                    <View style={styles.bannerContent}>
                        <Icon name="shield-checkmark-outline" size={32} color="#fff" />
                        <View style={styles.bannerText}>
                            <Text style={styles.bannerTitle}>Diyabet Risk Anketi</Text>
                            <Text style={styles.bannerSubtitle}>FINDRISK testi ile riskinizi öğrenin</Text>
                        </View>
                    </View>
                    <Icon name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Menu Grid */}
            <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuCard, { backgroundColor: c.surface, shadowColor: c.shadow }]}
                            onPress={() => navigation.navigate(item.screen)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                                <Icon name={item.icon} size={28} color={item.color} />
                            </View>
                            <Text style={[styles.menuTitle, { color: c.text }]} numberOfLines={2}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    },
    headerContent: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    greeting: { fontSize: 14, opacity: 0.9 },
    userName: { fontSize: 22, fontWeight: '800' },
    headerActions: { flexDirection: 'row', gap: 12 },
    headerBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    banner: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 16, padding: 16, borderRadius: 16,
    },
    bannerContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    bannerText: { marginLeft: 12 },
    bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    bannerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
    gridContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 30 },
    grid: {
        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    },
    menuCard: {
        width: '47%', paddingVertical: 22, paddingHorizontal: 14,
        borderRadius: 20, marginBottom: 14, alignItems: 'center',
        elevation: 3, shadowOpacity: 0.1, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    iconCircle: {
        width: 56, height: 56, borderRadius: 28,
        alignItems: 'center', justifyContent: 'center', marginBottom: 10,
    },
    menuTitle: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
