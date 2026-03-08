import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface MapLoadingOverlayProps {
    visible: boolean;
    message?: string;
}

export function MapLoadingOverlay({ visible, message = 'Loading map…' }: MapLoadingOverlayProps) {
    const opacity = useRef(new Animated.Value(1)).current;
    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#151718' }, 'background');
    const textColor = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');
    const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');

    useEffect(() => {
        if (!visible) {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        } else {
            opacity.setValue(1);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.overlay, { backgroundColor, opacity }]} pointerEvents="none">
            <View style={styles.content}>
                <ActivityIndicator size="large" color={accentColor} />
                <Animated.Text style={[styles.text, { color: textColor }]}>
                    {message}
                </Animated.Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        gap: 16,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
    },
});
