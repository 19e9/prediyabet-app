import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function WeeklyStepsScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalSteps, setTotalSteps] = useState(0);

    useEffect(() => {
        loadWeeklySteps();
    }, []);

    const loadWeeklySteps = async () => {
        try {
            const res = await api.get('/steps');
            const allSteps = res.data;

            const today = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 6);
            weekAgo.setHours(0, 0, 0, 0);

            const weeklySteps = allSteps.filter(item => new Date(item.date) >= weekAgo);
            setData(weeklySteps);
            const total = weeklySteps.reduce((sum, item) => sum + item.stepCount, 0);
            setTotalSteps(total);
        } catch (e) { }
        setLoading(false);
    };

    const formatDate = (d) => {
        const date = new Date(d);
        const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`;
    };

    const maxSteps = data.length > 0 ? Math.max(...data.map(i => i.stepCount)) : 1;
    const dailyGoal = 10000;

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={c.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>Haftalık Adımlarım</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Toplam özet kartı */}
            <View style={[styles.summaryCard, { backgroundColor: c.surface }]}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Icon name="footsteps" size={28} color={c.primary} />
                        <Text style={[styles.summaryValue, { color: c.text }]}>{totalSteps.toLocaleString()}</Text>
                        <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Toplam Adım</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: c.border }]} />
                    <View style={styles.summaryItem}>
                        <Icon name="calendar-outline" size={28} color={c.primary} />
                        <Text style={[styles.summaryValue, { color: c.text }]}>{data.length}</Text>
                        <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Aktif Gün</Text>
                    </View>
                    <View style={[styles.divider, { backgroundColor: c.border }]} />
                    <View style={styles.summaryItem}>
                        <Icon name="trending-up" size={28} color={c.primary} />
                        <Text style={[styles.summaryValue, { color: c.text }]}>
                            {data.length > 0 ? Math.round(totalSteps / data.length).toLocaleString() : '0'}
                        </Text>
                        <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Günlük Ort.</Text>
                    </View>
                </View>
            </View>

            {/* Grafik */}
            <Text style={[styles.sectionTitle, { color: c.text }]}>Son 7 Gün</Text>

            {data.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="footsteps-outline" size={56} color={c.textLight} />
                    <Text style={[styles.emptyText, { color: c.textLight }]}>Bu hafta kayıt yok</Text>
                </View>
            ) : (
                <FlatList
                    data={[...data].reverse()}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const pct = Math.min((item.stepCount / maxSteps) * 100, 100);
                        const goalPct = Math.min((item.stepCount / dailyGoal) * 100, 100);
                        const reachedGoal = item.stepCount >= dailyGoal;
                        return (
                            <View style={[styles.barCard, { backgroundColor: c.surface }]}>
                                <View style={styles.barHeader}>
                                    <Text style={[styles.barDate, { color: c.text }]}>{formatDate(item.date)}</Text>
                                    <View style={styles.barRight}>
                                        <Text style={[styles.barSteps, { color: reachedGoal ? c.success : c.text }]}>
                                            {item.stepCount.toLocaleString()}
                                        </Text>
                                        {reachedGoal && (
                                            <Icon name="checkmark-circle" size={16} color={c.success} style={{ marginLeft: 4 }} />
                                        )}
                                    </View>
                                </View>
                                <View style={[styles.barBg, { backgroundColor: c.border }]}>
                                    <View style={[
                                        styles.barFill,
                                        {
                                            width: `${pct}%`,
                                            backgroundColor: reachedGoal ? c.success : c.primary,
                                        }
                                    ]} />
                                </View>
                                <Text style={[styles.barGoal, { color: c.textSecondary }]}>
                                    Hedef: %{Math.round(goalPct)} ({dailyGoal.toLocaleString()} adım)
                                </Text>
                            </View>
                        );
                    }}
                />
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
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    summaryCard: {
        margin: 16, padding: 20, borderRadius: 20, elevation: 3,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    summaryItem: { alignItems: 'center', flex: 1 },
    summaryValue: { fontSize: 22, fontWeight: '800', marginTop: 6 },
    summaryLabel: { fontSize: 12, marginTop: 2 },
    divider: { width: 1, height: 50 },
    sectionTitle: { fontSize: 17, fontWeight: '700', paddingHorizontal: 20, marginBottom: 8 },
    list: { paddingHorizontal: 16, paddingBottom: 24 },
    barCard: { padding: 14, borderRadius: 14, marginBottom: 10, elevation: 2 },
    barHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    barDate: { fontSize: 14, fontWeight: '600' },
    barRight: { flexDirection: 'row', alignItems: 'center' },
    barSteps: { fontSize: 14, fontWeight: '700' },
    barBg: { height: 10, borderRadius: 5, overflow: 'hidden' },
    barFill: { height: 10, borderRadius: 5 },
    barGoal: { fontSize: 11, marginTop: 4 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    emptyText: { fontSize: 15 },
});
