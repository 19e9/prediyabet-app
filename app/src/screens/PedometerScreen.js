import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function PedometerScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [currentSteps, setCurrentSteps] = useState(0);
    const [history, setHistory] = useState([]);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        loadHistory();
        startPedometer();
    }, []);

    const startPedometer = async () => {
        try {
            const { Pedometer } = await import('expo-sensors');
            const isAvailable = await Pedometer.isAvailableAsync();
            if (isAvailable) {
                const end = new Date();
                const start = new Date();
                start.setHours(0, 0, 0, 0);
                const result = await Pedometer.getStepCountAsync(start, end);
                setCurrentSteps(result.steps);

                const sub = Pedometer.watchStepCount(result => {
                    setCurrentSteps(prev => prev + result.steps);
                });
                setIsTracking(true);
                return () => sub?.remove();
            }
        } catch (e) {
            console.log('Pedometer not available:', e.message);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await api.get('/steps');
            setHistory(res.data);
        } catch (e) { }
    };

    const saveSteps = async () => {
        try {
            await api.post('/steps', { date: new Date().toISOString(), stepCount: currentSteps });
            Alert.alert('Başarılı', 'Adım bilgisi kaydedildi');
            loadHistory();
        } catch (e) {
            Alert.alert('Hata', 'Kayıt yapılamadı');
        }
    };

    const formatDate = (d) => {
        const date = new Date(d);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>Adımsayar</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Current Steps */}
            <View style={[styles.stepsCard, { backgroundColor: c.surface }]}>
                <View style={[styles.stepsCircle, { borderColor: c.primary }]}>
                    <Icon name="footsteps" size={36} color={c.primary} />
                    <Text style={[styles.stepsNumber, { color: c.text }]}>{currentSteps.toLocaleString()}</Text>
                    <Text style={[styles.stepsLabel, { color: c.textSecondary }]}>Adım</Text>
                </View>
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.primary }]} onPress={saveSteps}>
                    <Icon name="save-outline" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Kaydet</Text>
                </TouchableOpacity>
            </View>

            {/* History */}
            <Text style={[styles.sectionTitle, { color: c.text }]}>Geçmiş Adımlarım</Text>
            <FlatList
                data={history}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={[styles.historyItem, { backgroundColor: c.surface, borderColor: c.border }]}>
                        <View>
                            <Text style={[styles.histSteps, { color: c.text }]}>Adım Sayısı: {item.stepCount}</Text>
                        </View>
                        <Text style={[styles.histDate, { color: c.textSecondary }]}>Tarih: {formatDate(item.date)}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: c.textLight }]}>Henüz kayıt yok</Text>
                }
            />

            {/* Weekly Report */}
            <TouchableOpacity
                style={[styles.weeklyBtn, { backgroundColor: c.primary }]}
                onPress={() => navigation.navigate('WeeklySteps')}
            >
                <Text style={styles.weeklyBtnText}>Haftalık Adımlarım</Text>
            </TouchableOpacity>
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
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    stepsCard: { margin: 16, padding: 24, borderRadius: 20, alignItems: 'center', elevation: 3 },
    stepsCircle: {
        width: 160, height: 160, borderRadius: 80, borderWidth: 4,
        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    stepsNumber: { fontSize: 32, fontWeight: '800', marginTop: 4 },
    stepsLabel: { fontSize: 14 },
    saveBtn: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24,
        paddingVertical: 12, borderRadius: 12, gap: 8,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 8 },
    list: { paddingHorizontal: 16 },
    historyItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1,
    },
    histSteps: { fontSize: 15, fontWeight: '600' },
    histDate: { fontSize: 13 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
    weeklyBtn: {
        margin: 16, paddingVertical: 16, borderRadius: 16,
        alignItems: 'center', elevation: 3,
    },
    weeklyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
