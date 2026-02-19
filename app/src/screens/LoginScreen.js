import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';

export default function LoginScreen({ navigation }) {
    const { login } = useAuth();
    const { theme } = useTheme();
    const c = theme.colors;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'E-posta ve şifre gerekli');
            return;
        }
        setLoading(true);
        try {
            await login(email.toLowerCase().trim(), password);
        } catch (err) {
            Alert.alert('Giriş Hatası', err.response?.data?.message || 'Giriş yapılamadı');
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: c.background }]}
        >
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Header Decoration */}
                <View style={[styles.headerDecor, { backgroundColor: c.primary }]}>
                    <View style={styles.circle1} />
                    <View style={styles.circle2} />
                </View>

                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={[styles.logoCircle, { backgroundColor: c.surface, shadowColor: c.shadow }]}>
                        <Icon name="heart-circle" size={52} color={c.primary} />
                    </View>
                    <Text style={[styles.title, { color: c.primary }]}>PREDIABET</Text>
                    <Text style={[styles.subtitle, { color: c.textSecondary }]}>Sağlıklı yaşam için ilk adım</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={[styles.inputContainer, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="mail-outline" size={20} color={c.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="E-posta"
                            placeholderTextColor={c.textLight}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={[styles.inputContainer, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="lock-closed-outline" size={20} color={c.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Şifre"
                            placeholderTextColor={c.textLight}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={c.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: c.primary }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Giriş Yap</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                        <Text style={[styles.linkText, { color: c.textSecondary }]}>
                            Hesabınız yok mu?{' '}
                            <Text style={{ color: c.primary, fontWeight: '700' }}>Kayıt Ol</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { flexGrow: 1 },
    headerDecor: {
        height: 220,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        position: 'relative',
        overflow: 'hidden',
    },
    circle1: {
        position: 'absolute', width: 200, height: 200, borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)', top: -60, right: -40,
    },
    circle2: {
        position: 'absolute', width: 150, height: 150, borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.08)', bottom: -30, left: -20,
    },
    logoContainer: { alignItems: 'center', marginTop: -40 },
    logoCircle: {
        width: 84, height: 84, borderRadius: 42, alignItems: 'center',
        justifyContent: 'center', elevation: 8, shadowOpacity: 0.15,
        shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    },
    title: { fontSize: 28, fontWeight: '800', marginTop: 12, letterSpacing: 2 },
    subtitle: { fontSize: 14, marginTop: 4 },
    form: { paddingHorizontal: 28, marginTop: 32 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 16,
        paddingHorizontal: 16, marginBottom: 16, height: 56, borderWidth: 1,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16 },
    button: {
        height: 56, borderRadius: 16, alignItems: 'center',
        justifyContent: 'center', marginTop: 8,
        elevation: 4, shadowOpacity: 0.2, shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    linkContainer: { alignItems: 'center', marginTop: 20 },
    linkText: { fontSize: 15 },
});
