import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Icon from '../components/Icon';

export default function ProfileScreen({ navigation }) {
    const { user, updateProfile } = useAuth();
    const { theme } = useTheme();
    const c = theme.colors;
    const [name, setName] = useState(user?.name || '');
    const [surname, setSurname] = useState(user?.surname || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const data = { name, surname, phone };
            if (password) data.password = password;
            await updateProfile(data);
            Alert.alert('Başarılı', 'Profil güncellendi');
            setPassword('');
        } catch (e) {
            Alert.alert('Hata', e.response?.data?.message || 'Güncelleme yapılamadı');
        }
        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
            <View style={[styles.header, { backgroundColor: c.headerBg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color={c.headerText} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: c.headerText }]}>Profil</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatar, { backgroundColor: c.primaryLight }]}>
                        <Icon name="person" size={48} color={c.primary} />
                    </View>
                    <Text style={[styles.avatarName, { color: c.text }]}>{user?.name} {user?.surname}</Text>
                    <Text style={[styles.avatarEmail, { color: c.textSecondary }]}>{user?.email}</Text>
                </View>

                <View style={[styles.form, { backgroundColor: c.surface }]}>
                    <View style={[styles.inputRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="person-outline" size={20} color={c.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Adı Soyadı"
                            placeholderTextColor={c.textLight}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View style={[styles.inputRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="person-outline" size={20} color={c.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Soyadı"
                            placeholderTextColor={c.textLight}
                            value={surname}
                            onChangeText={setSurname}
                        />
                    </View>
                    <View style={[styles.inputRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="call-outline" size={20} color={c.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Telefon"
                            placeholderTextColor={c.textLight}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={[styles.inputRow, { backgroundColor: c.inputBg, borderColor: c.border }]}>
                        <Icon name="lock-closed-outline" size={20} color={c.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: c.text }]}
                            placeholder="Yeni Şifre (boş bırakın değişmesin)"
                            placeholderTextColor={c.textLight}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.updateBtn, { backgroundColor: c.primary }]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.updateBtnText}>Profili Güncelle</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    scroll: { paddingBottom: 30 },
    avatarContainer: { alignItems: 'center', marginTop: 24, marginBottom: 20 },
    avatar: {
        width: 96, height: 96, borderRadius: 48,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarName: { fontSize: 20, fontWeight: '700', marginTop: 12 },
    avatarEmail: { fontSize: 14, marginTop: 4 },
    form: { marginHorizontal: 16, padding: 20, borderRadius: 20, elevation: 3 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 14,
        paddingHorizontal: 14, height: 52, marginBottom: 14, borderWidth: 1,
    },
    input: { flex: 1, marginLeft: 10, fontSize: 15 },
    updateBtn: {
        paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 4,
    },
    updateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
