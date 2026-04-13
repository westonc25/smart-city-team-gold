/*
  Themed, scrollable search result dropdown for the Map screen.
  Replaces the previous raw inline View + Text list.

  Polished per Tony's task:
  - Theme-aware background (dark mode compatible)
  - ScrollView so overflow results beyond maxHeight are reachable
  - Pressable rows with a search icon + truncated place name + chevron
  - Shadow + borderRadius matching the SearchBar pill aesthetic
*/

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ScrollView, StyleSheet, Pressable, View, Text, StyleProp, ViewStyle } from 'react-native';

export type SearchResult = {
  id: string;
  coordinate: [number, number];
  placeName: string;
};

type SearchResultsListProps = {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
  style?: StyleProp<ViewStyle>;
};

export function SearchResultsList({ results, onSelect, style }: SearchResultsListProps) {
  const containerBg = useThemeColor(
    { light: 'rgba(255,255,255,0.97)', dark: 'rgba(24,24,27,0.97)' },
    'background'
  );
  const itemBorderColor = useThemeColor(
    { light: '#f0f0f2', dark: '#2a2a32' },
    'text'
  );
  const primaryText = useThemeColor({ light: '#11181C', dark: '#ECEDEE' }, 'text');
  const iconColor = useThemeColor({ light: '#9BA1A6', dark: '#687076' }, 'icon');
  const chevronColor = useThemeColor({ light: '#c7c7cc', dark: '#48484a' }, 'icon');
  const pressedBg = useThemeColor(
    { light: 'rgba(0,0,0,0.04)', dark: 'rgba(255,255,255,0.06)' },
    'background'
  );

  if (results.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: containerBg },
        style,
      ]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={styles.scroll}
      >
        {results.map((result, index) => (
          <Pressable
            key={result.id}
            onPress={() => onSelect(result)}
            style={({ pressed }) => [
              styles.row,
              index < results.length - 1 && { borderBottomWidth: 1, borderBottomColor: itemBorderColor },
              pressed && { backgroundColor: pressedBg },
            ]}
            android_ripple={{ color: pressedBg as string }}
          >
            {/* Search icon */}
            <View style={styles.iconWrapper}>
              <IconSymbol name="magnifyingglass" size={15} color={iconColor as string} />
            </View>

            {/* Place name */}
            <Text
              style={[styles.placeName, { color: primaryText as string }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {result.placeName}
            </Text>

            {/* Chevron */}
            <IconSymbol name="chevron.right" size={14} color={chevronColor as string} style={styles.chevron} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    maxHeight: 220,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  scroll: {
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  iconWrapper: {
    width: 22,
    alignItems: 'center',
  },
  placeName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  chevron: {
    flexShrink: 0,
  },
});
