import React from 'react';
import { Text } from 'react-native';

const iconMap = {
    // Navigation
    'chevron-back': '‹',
    'chevron-forward': '›',
    'chevron-up': '▲',
    'chevron-down': '▼',
    'close-circle': '✕',

    // Auth & User
    'heart-circle': '❤',
    'mail-outline': '✉',
    'lock-closed-outline': '🔒',
    'eye-outline': '👁',
    'eye-off-outline': '🙈',
    'person-add': '➕',
    'person-outline': '👤',
    'person': '👤',
    'call-outline': '📞',

    // Home menu
    'sunny-outline': '☀',
    'moon-outline': '🌙',
    'log-out-outline': '↪',
    'shield-checkmark-outline': '🛡',
    'information-circle-outline': 'ℹ',
    'calculator-outline': '🧮',
    'clipboard-outline': '📋',
    'document-text-outline': '📄',
    'help-circle-outline': '❓',
    'chatbubble-ellipses-outline': '💬',
    'nutrition-outline': '🍎',
    'footsteps-outline': '👣',
    'footsteps': '👣',

    // BMI
    'barbell-outline': '🏋',
    'resize-outline': '📏',
    'trash-outline': '🗑',

    // Food
    'checkmark': '✓',

    // Pedometer
    'save-outline': '💾',

    // Findrisk
    'checkmark-circle': '✅',
    'alert-circle': '⚠',
    'warning-outline': '⚠',
    'happy-outline': '😊',
    'sad-outline': '😟',

    // About
    'school-outline': '🎓',
    'code-slash-outline': '💻',

    // Contact
    'globe-outline': '🌐',
    'logo-whatsapp': '💬',

    // Profile
    'settings-outline': '⚙',
};

export default function Icon({ name, size = 20, color = '#000', style }) {
    const icon = iconMap[name] || '•';
    return (
        <Text
            style={[
                {
                    fontSize: size * 0.85,
                    color,
                    textAlign: 'center',
                    width: size,
                    lineHeight: size * 1.1,
                },
                style,
            ]}
        >
            {icon}
        </Text>
    );
}
