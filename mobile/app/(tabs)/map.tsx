import { ThemedView } from '@/components/themed-view';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/Button';
import { MapLoadingOverlay } from '@/components/ui/MapLoadingOverlay';
import { useThemeColor } from '@/hooks/use-theme-color';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const insets = useSafeAreaInsets();
  const errorBg = useThemeColor({ light: '#FEF2F2', dark: '#3B1C1C' }, 'background');
  const errorText = useThemeColor({ light: '#991B1B', dark: '#FCA5A5' }, 'text');

  const centerOnUser = useCallback(async () => {
    if (isLocating) return;

    setIsLocating(true);
    setLocationError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. Enable it in settings to see your position.');
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords: [number, number] = [location.coords.longitude, location.coords.latitude];
      setUserLocation(coords);

      // Use coords directly instead of stale userLocation state
      if (cameraRef.current) {
        cameraRef.current.setCamera({
          centerCoordinate: coords,
          zoomLevel: 15,
          animationDuration: 1000,
        });
      }
    } catch (err) {
      setLocationError('Unable to get your location. Please try again.');
    }

    setIsLocating(false);
  }, [isLocating]);

  useEffect(() => {
    centerOnUser();
  }, []);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true);
    // Simulate search — will be connected to Mapbox geocoding later by Josh
    setTimeout(() => {
      setIsSearching(false);
      // TODO: Implement actual search via Mapbox Search API
    }, 1500);
  }, []);

  const handleSearchClear = useCallback(() => {
    setIsSearching(false);
  }, []);

  const showLoading = !isMapReady || (isLocating && !userLocation);

  return (
    <ThemedView style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        onDidFinishLoadingMap={handleMapReady}
      >
        <Mapbox.Camera
          ref={cameraRef}
          followZoomLevel={15}
        />
        <Mapbox.LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />
      </Mapbox.MapView>

      {/* Search bar at top */}
      <View style={[styles.searchContainer, { top: insets.top + 12 }]}>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleSearchClear}
          isSearching={isSearching}
          placeholder="Search places…"
        />
      </View>

      {/* Location error banner */}
      {locationError && (
        <View style={[styles.errorBanner, { backgroundColor: errorBg, top: insets.top + 68 }]}>
          <Text style={[styles.errorText, { color: errorText }]}>{locationError}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          title="Recenter"
          onPress={centerOnUser}
          loading={isLocating}
          variant="primary"
        />
      </View>

      {/* Loading overlay */}
      <MapLoadingOverlay visible={showLoading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 5,
  },
  errorBanner: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 8,
    padding: 12,
    zIndex: 5,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    gap: 12,
  },
});
