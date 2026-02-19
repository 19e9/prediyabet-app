import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator,
    Modal, ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function HealthInfoScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => { loadArticles(); }, []);

    const loadArticles = async () => {
        try {
            const res = await api.get('/health-info');
            setArticles(res.data);
        } catch (e) { }
        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>Bilgilendirme</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.articleCard, { backgroundColor: c.surface, borderColor: c.border }]}
                            onPress={() => setSelectedArticle(item)}
                        >
                            <Text style={[styles.articleTitle, { color: c.text }]}>{item.title}</Text>
                            <Icon name="chevron-forward" size={20} color={c.textSecondary} />
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Article Detail Modal */}
            <Modal visible={!!selectedArticle} animationType="slide" transparent>
                <View style={[styles.modalOverlay, { backgroundColor: c.overlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: c.surface }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: c.text }]}>{selectedArticle?.title}</Text>
                            <TouchableOpacity onPress={() => setSelectedArticle(null)}>
                                <Icon name="close-circle" size={28} color={c.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalBody}>
                            <Text style={[styles.modalText, { color: c.textSecondary }]}>
                                {selectedArticle?.content}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
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
    list: { padding: 16 },
    articleCard: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 18, borderRadius: 16, marginBottom: 10, borderWidth: 1,
        elevation: 2,
    },
    articleTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '700', flex: 1, marginRight: 12 },
    modalBody: { paddingBottom: 20 },
    modalText: { fontSize: 15, lineHeight: 24 },
});
