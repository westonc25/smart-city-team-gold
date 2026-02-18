import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    style?: ViewStyle;
}

export function LoadingSpinner({ size = 'large', color, style }: LoadingSpinnerProps) {
    const defaultColor = useThemeColor({ light: '#0a7ea4', dark: '#fff' }, 'text');

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color || defaultColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
});
