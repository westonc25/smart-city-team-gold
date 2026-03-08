import { useState, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Platform,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onClear?: () => void;
    placeholder?: string;
    isSearching?: boolean;
}

export function SearchBar({
    onSearch,
    onClear,
    placeholder = 'Search places…',
    isSearching = false,
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<TextInput>(null);

    const bgColor = useThemeColor({ light: 'rgba(255,255,255,0.92)', dark: 'rgba(30,30,30,0.92)' }, 'background');
    const textColor = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');
    const placeholderColor = useThemeColor({ light: '#687076', dark: '#9BA1A6' }, 'icon');
    const iconColor = useThemeColor({ light: '#687076', dark: '#9BA1A6' }, 'icon');
    const accentColor = useThemeColor({ light: '#0a7ea4', dark: '#4FC3F7' }, 'tint');

    const handleSubmit = () => {
        const trimmed = query.trim();
        if (trimmed.length > 0) {
            onSearch(trimmed);
        }
    };

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
        onClear?.();
    };

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <IconSymbol name="magnifyingglass" size={20} color={iconColor} style={styles.searchIcon} />
            <TextInput
                ref={inputRef}
                style={[styles.input, { color: textColor }]}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSubmit}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
            />
            {isSearching ? (
                <ActivityIndicator size="small" color={accentColor} style={styles.trailing} />
            ) : query.length > 0 ? (
                <TouchableOpacity onPress={handleClear} style={styles.trailing}>
                    <IconSymbol name="xmark.circle.fill" size={20} color={iconColor} />
                </TouchableOpacity>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
    },
    trailing: {
        marginLeft: 8,
    },
});
