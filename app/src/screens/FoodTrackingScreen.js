import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function FoodTrackingScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => { loadItems(); }, []);

    const loadItems = async () => {
        try {
            const res = await api.get('/food/items');
            setItems(res.data);
        } catch (e) { }
    };

    const toggleItem = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const saveEntry = async () => {
        if (selected.length === 0) { Alert.alert('Hata', 'En az bir besin seçin'); return; }
        try {
            await api.post('/food', { items: selected });
            Alert.alert('Başarılı', 'Besin bilgisi kaydedildi');
            setSelected([]);
        } catch (e) {
            Alert.alert('Hata', 'Kayıt yapılamadı');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>Besin Ekle</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={items}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.foodItem,
                            { backgroundColor: c.surface, borderColor: selected.includes(item._id) ? c.primary : c.border },
                            selected.includes(item._id) && { backgroundColor: c.primaryLight },
                        ]}
                        onPress={() => toggleItem(item._id)}
                    >
                        <View style={styles.checkboxContainer}>
                            <View style={[
                                styles.checkbox,
                                { borderColor: selected.includes(item._id) ? c.primary : c.textLight },
                                selected.includes(item._id) && { backgroundColor: c.primary },
                            ]}>
                                {selected.includes(item._id) && <Icon name="checkmark" size={16} color="#fff" />}
                            </View>
                            <Text style={[styles.foodName, { color: c.text }]} numberOfLines={2}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: c.textLight }]}>Besin listesi yükleniyor...</Text>
                }
            />

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: c.primary }]} onPress={saveEntry}>
                <Text style={styles.saveBtnText}>Kaydet ({selected.length})</Text>
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
    headerTitle: { fontSize: 20, fontWeight: '700' },
    list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
    foodItem: {
        padding: 16, borderRadius: 14, marginBottom: 10, borderWidth: 1.5,
    },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
    checkbox: {
        width: 24, height: 24, borderRadius: 6, borderWidth: 2,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    foodName: { fontSize: 14, flex: 1 },
    saveBtn: {
        position: 'absolute', bottom: 20, left: 16, right: 16,
        paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 5,
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 14 },
});
