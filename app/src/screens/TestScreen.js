import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';
import api from '../services/api';

export default function TestScreen({ navigation, route }) {
    const testType = route.params?.type || 'pre';
    const { theme } = useTheme();
    const c = theme.colors;
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadQuestions(); }, []);

    const loadQuestions = async () => {
        try {
            const res = await api.get(`/tests/questions/${testType}`);
            setQuestions(res.data);
        } catch (e) { }
        setLoading(false);
    };

    const selectOption = (qi, option) => {
        setAnswers(prev => ({ ...prev, [qi]: option }));
    };

    const submitTest = async () => {
        if (Object.keys(answers).length < questions.length) {
            Alert.alert('Hata', 'Lütfen tüm soruları cevaplayın');
            return;
        }
        try {
            const formattedAnswers = questions.map((q, i) => ({
                questionId: q._id,
                questionText: q.questionText,
                selectedOption: answers[i].text,
                score: answers[i].score,
            }));
            const res = await api.post('/tests', { type: testType, answers: formattedAnswers });
            setResult(res.data);
        } catch (e) {
            Alert.alert('Hata', 'Test gönderilemedi');
        }
    };

    const title = testType === 'pre' ? 'Ön Testler' : 'Son Testler';

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: c.background, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={c.primary} />
            </View>
        );
    }

    if (result) {
        return (
            <View style={[styles.container, { backgroundColor: c.background }]}>
                <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-back" size={24} color={c.headerText} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: c.headerText }]}>Sonuç</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.resultContainer}>
                    <View style={[styles.resultCard, { backgroundColor: c.surface }]}>
                        <Icon name="checkmark-circle" size={64} color={c.success} />
                        <Text style={[styles.resultScore, { color: c.text }]}>Puan: {result.totalScore}</Text>
                        <Text style={[styles.resultInfo, { color: c.textSecondary }]}>
                            Testiniz başarıyla kaydedildi. Sonuçlarınız profil geçmişinizde görüntülenebilir.
                        </Text>
                    </View>
                    <TouchableOpacity style={[styles.doneBtn, { backgroundColor: c.primary }]} onPress={() => navigation.goBack()}>
                        <Text style={styles.doneBtnText}>Tamam</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (questions.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: c.background }]}>
                <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-back" size={24} color={c.headerText} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: c.headerText }]}>{title}</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Icon name="document-text-outline" size={64} color={c.textLight} />
                    <Text style={[styles.emptyText, { color: c.textSecondary }]}>Henüz test sorusu eklenmemiş</Text>
                    <Text style={[styles.emptySubtext, { color: c.textLight }]}>Admin panelden test soruları eklenebilir</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>{title}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {questions.map((q, qi) => (
                    <View key={qi} style={[styles.questionCard, { backgroundColor: c.surface }]}>
                        <Text style={[styles.questionText, { color: c.text }]}>{q.questionText}</Text>
                        {q.options.map((opt, oi) => (
                            <TouchableOpacity
                                key={oi}
                                style={[
                                    styles.optionItem,
                                    { borderColor: answers[qi]?.text === opt.text ? c.primary : c.border },
                                    answers[qi]?.text === opt.text && { backgroundColor: c.primaryLight },
                                ]}
                                onPress={() => selectOption(qi, opt)}
                            >
                                <Text style={[styles.optionText, { color: c.text }]}>{opt.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={[styles.submitBtn, { backgroundColor: c.primary }]} onPress={submitTest}>
                <Text style={styles.submitBtnText}>Kaydet</Text>
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
    scrollContent: { padding: 16, paddingBottom: 100 },
    questionCard: { padding: 16, borderRadius: 16, marginBottom: 16, elevation: 2 },
    questionText: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    optionItem: {
        padding: 14, borderRadius: 12, borderWidth: 1.5, marginBottom: 8,
    },
    optionText: { fontSize: 14 },
    submitBtn: {
        position: 'absolute', bottom: 20, left: 16, right: 16,
        paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 5,
    },
    submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    resultContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    resultCard: { padding: 32, borderRadius: 24, alignItems: 'center', elevation: 4 },
    resultScore: { fontSize: 32, fontWeight: '800', marginTop: 16 },
    resultInfo: { fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
    doneBtn: { marginTop: 24, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 8 },
});
