import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';

export default function RegisterScreen({ navigation }) {
    const { register } = useAuth();
    const { theme } = useTheme();
    const c = theme.colors;
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Hata', 'İsim, e-posta ve şifre gerekli');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Hata', 'Şifre en az 6 karakter olmalı');
            return;
        }
        setLoading(true);
        try {
            await register({ name, surname, email: email.toLowerCase().trim(), phone, password });
        } catch (err) {
            Alert.alert('Kayıt Hatası', err.response?.data?.message || 'Kayıt yapılamadı');
        }
        setLoading(false);
    };

    const fields = [
        { icon: 'person-outline', placeholder: 'Ad', value: name, setter: setName },
        { icon: 'person-outline', placeholder: 'Soyad', value: surname, setter: setSurname },
        { icon: 'mail-outline', placeholder: 'E-posta', value: email, setter: setEmail, keyboard: 'email-address' },
        { icon: 'call-outline', placeholder: 'Telefon', value: phone, setter: setPhone, keyboard: 'phone-pad' },
        { icon: 'lock-closed-outline', placeholder: 'Şifre (min 6 karakter)', value: password, setter: setPassword, secure: true },
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: c.background }]}
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={[styles.headerDecor, { backgroundColor: c.primary }]}>
                    <View style={styles.circle1} />
                </View>

                <View style={styles.logoContainer}>
                    <View style={[styles.logoCircle, { backgroundColor: c.surface }]}>
                        <Icon name="person-add" size={40} color={c.primary} />
                    </View>
                    <Text style={[styles.title, { color: c.primary }]}>Kayıt Ol</Text>
                    <Text style={[styles.subtitle, { color: c.textSecondary }]}>Yeni hesap oluşturun</Text>
                </View>

                <View style={styles.form}>
                    {fields.map((f, i) => (
                        <View key={i} style={[styles.inputContainer, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                            <Icon name={f.icon} size={20} color={c.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: c.text }]}
                                placeholder={f.placeholder}
                                placeholderTextColor={c.textLight}
                                value={f.value}
                                onChangeText={f.setter}
                                keyboardType={f.keyboard || 'default'}
                                secureTextEntry={f.secure}
                                autoCapitalize={f.keyboard === 'email-address' ? 'none' : 'words'}
                            />
                        </View>
                    ))}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: c.primary }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Kayıt Ol</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkContainer}>
                        <Text style={[styles.linkText, { color: c.textSecondary }]}>
                            Zaten hesabınız var mı?{' '}
                            <Text style={{ color: c.primary, fontWeight: '700' }}>Giriş Yap</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flexGrow: 1, paddingBottom: 30 },
    headerDecor: {
        height: 180, borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
        overflow: 'hidden',
    },
    circle1: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)', top: -60, right: -40,
    },
    logoContainer: { alignItems: 'center', marginTop: -36 },
    logoCircle: {
        width: 74, height: 74, borderRadius: 37, alignItems: 'center',
        justifyContent: 'center', elevation: 8, shadowOpacity: 0.15,
        shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    },
    title: { fontSize: 26, fontWeight: '800', marginTop: 10, letterSpacing: 1 },
    subtitle: { fontSize: 14, marginTop: 4 },
    form: { paddingHorizontal: 28, marginTop: 24 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 16,
        paddingHorizontal: 16, marginBottom: 14, height: 54, borderWidth: 1,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 15 },
    button: {
        height: 54, borderRadius: 16, alignItems: 'center',
        justifyContent: 'center', marginTop: 6,
        elevation: 4, shadowOpacity: 0.2, shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
    linkContainer: { alignItems: 'center', marginTop: 18 },
    linkText: { fontSize: 15 },
});
