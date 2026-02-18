import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
    textStyle
}: ButtonProps) {
    const backgroundColor = useThemeColor({ light: variant === 'outline' ? 'transparent' : '#0a7ea4', dark: variant === 'outline' ? 'transparent' : '#fff' }, 'background');
    const textColor = useThemeColor({ light: variant === 'outline' ? '#0a7ea4' : '#fff', dark: variant === 'outline' ? '#fff' : '#000' }, 'text');

    const buttonStyles = [
        styles.button,
        variant === 'primary' && { backgroundColor: '#0a7ea4' }, // Fixed primary color for consistency
        variant === 'secondary' && { backgroundColor: '#6c757d' },
        variant === 'outline' && { backgroundColor: 'transparent', borderWidth: 1, borderColor: textColor },
        disabled && styles.disabled,
        style,
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
