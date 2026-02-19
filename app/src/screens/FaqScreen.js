import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator,
    LayoutAnimation, UIManager, Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function FaqScreen({ navigation }) {
    const { theme } = useTheme();
    const c = theme.colors;
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => { loadFaqs(); }, []);

    const loadFaqs = async () => {
        try {
            const res = await api.get('/faq');
            setFaqs(res.data);
        } catch (e) { }
        setLoading(false);
    };

    const toggle = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(expanded === index ? null : index);
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>S.S.S.</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={c.primary} style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={faqs}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={[styles.faqCard, { backgroundColor: c.surface }]}
                            onPress={() => toggle(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.questionRow}>
                                <Text style={[styles.questionNumber, { color: c.primary }]}>{index + 1}-</Text>
                                <Text style={[styles.questionText, { color: c.text }]}>{item.question}</Text>
                                <Icon
                                    name={expanded === index ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color={c.textSecondary}
                                />
                            </View>
                            {expanded === index && (
                                <View style={[styles.answerContainer, { borderTopColor: c.border }]}>
                                    <Text style={[styles.answerLabel, { color: c.primary }]}>Cevap-</Text>
                                    <Text style={[styles.answerText, { color: c.textSecondary }]}>{item.answer}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
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
    headerTitle: { fontSize: 20, fontWeight: '700' },
    list: { padding: 16 },
    faqCard: { borderRadius: 16, marginBottom: 10, padding: 16, elevation: 2 },
    questionRow: { flexDirection: 'row', alignItems: 'flex-start' },
    questionNumber: { fontSize: 15, fontWeight: '700', marginRight: 6 },
    questionText: { flex: 1, fontSize: 15, fontWeight: '600', lineHeight: 22 },
    answerContainer: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
    answerLabel: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
    answerText: { fontSize: 14, lineHeight: 22 },
});
