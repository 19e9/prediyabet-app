import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function BmiScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => { loadHistory(); }, []);

    const loadHistory = async () => {
        try {
            const res = await api.get('/bmi');
            setHistory(res.data);
        } catch (e) { }
    };

    const calculateBmi = async () => {
        const w = parseFloat(weight);
        const h = parseFloat(height);
        if (!w || !h) { Alert.alert('Hata', 'Kilo ve boy değeri girin'); return; }
        try {
            const res = await api.post('/bmi', { weight: w, height: h });
            setBmiResult(res.data.bmiValue);
            setWeight(''); setHeight('');
            loadHistory();
        } catch (e) {
            Alert.alert('Hata', 'Hesaplama yapılamadı');
        }
    };

    const deleteBmi = async (id) => {
        Alert.alert('Sil', 'Bu kaydı silmek istediğinize emin misiniz?', [
            { text: 'İptal' },
            {
                text: 'Sil', style: 'destructive', onPress: async () => {
                    try { await api.delete(`/bmi/${id}`); loadHistory(); }
                    catch (e) { Alert.alert('Hata', 'Silinemedi'); }
                }
            },
        ]);
    };

    const formatDate = (d) => {
        const date = new Date(d);
        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>BKİ Hesaplama</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <View style={[styles.card, { backgroundColor: c.surface }]}>
                    <View style={[styles.inputRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="barbell-outline" size={20} color={c.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Kilonuzu Giriniz (kg)"
                            placeholderTextColor={c.textLight}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={[styles.inputRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="resize-outline" size={20} color={c.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Boyunuzu Giriniz (cm)"
                            placeholderTextColor={c.textLight}
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                        />
                    </View>

                    {bmiResult && (
                        <Text style={[styles.resultText, { color: c.primary }]}>
                            BKİ Değeri: {bmiResult}
                        </Text>
                    )}

                    <TouchableOpacity style={[styles.calcBtn, { backgroundColor: c.primary }]} onPress={calculateBmi}>
                        <Text style={styles.calcBtnText}>Hesapla</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={history}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={[styles.histItem, { backgroundColor: c.surface, borderColor: c.border }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.histValue, { color: c.text }]}>BKİ Değeri: {item.bmiValue}</Text>
                            </View>
                            <Text style={[styles.histDate, { color: c.textSecondary }]}>{formatDate(item.date)}</Text>
                            <TouchableOpacity onPress={() => deleteBmi(item._id)} style={styles.deleteBtn}>
                                <Icon name="trash-outline" size={20} color={c.error} />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: c.textLight }]}>Henüz kayıt yok</Text>
                    }
                />
            </View>
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
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
    card: { padding: 20, borderRadius: 20, marginBottom: 16, elevation: 3 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 14,
        paddingHorizontal: 14, height: 52, marginBottom: 12, borderWidth: 1,
    },
    input: { flex: 1, marginLeft: 10, fontSize: 15 },
    resultText: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginVertical: 8 },
    calcBtn: {
        paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 4,
    },
    calcBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    list: { paddingBottom: 20 },
    histItem: {
        flexDirection: 'row', alignItems: 'center', padding: 14,
        borderRadius: 12, marginBottom: 8, borderWidth: 1,
    },
    histValue: { fontSize: 15, fontWeight: '600' },
    histDate: { fontSize: 13, marginRight: 10 },
    deleteBtn: { padding: 4 },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
});
