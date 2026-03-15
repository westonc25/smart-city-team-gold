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

  
  const sampleForumPosts = [
    { id: "post-1", coordinate: [-122.4194, 37.7749], title: "Post about local events" },
    { id: "post-2", coordinate: [-73.935242, 40.73061], title: "Meetup discussion" },
    { id: "post-3", coordinate: [-118.2437, 34.0522], title: "Art gallery thread" }
  ];
  const [forumPostsState, setForumPostsState] = useState(sampleForumPosts);

  const [searchResults, setSearchResults] = useState<
    { id: string; coordinate: [number, number]; placeName: string }[]
  >([]);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any | null>(null);
  const [isRouting, setIsRouting] = useState(false);

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

  useEffect(() => {
  if (!userLocation || !destination) return;

  fetchRoute();
}, [destination]);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleSearch = useCallback((query: string) => {
    console.log("SEARCH QUERY:", query);
    setIsSearching(true);

    
    const fetchMapboxSearch = async () => {
      if (!query) return;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?proximity=${userLocation?.[0]},${userLocation?.[1]}&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`
        );
        const data = await response.json();
        console.log("MAPBOX RESPONSE:", data);

        if (data.features && data.features.length > 0) {
          const results = data.features.map((feature: any, index: number) => ({
            id: `${feature.id}-${index}`,
            coordinate: [feature.center[0], feature.center[1]],
            placeName: feature.place_name,
          }));
          setSearchResults(results);

          // center on first result
          const [longitude, latitude] = results[0].coordinate;
          cameraRef.current?.setCamera({
            centerCoordinate: [longitude, latitude],
            zoomLevel: 14,
            animationDuration: 1000,
          });
        }
      } catch (error) {
        console.error("Search failed:", error);
      }

      setIsSearching(false);
    };

    fetchMapboxSearch();
  }, []);

  const handleSearchClear = useCallback(() => {
    setIsSearching(false);
    setSearchResults([]);
  }, []);

  const showLoading = !isMapReady || (isLocating && !userLocation) || isRouting;

  const fetchRoute = async () => {
  if (!userLocation || !destination) return;

  setIsRouting(true);

  try {
    const userLongitude = parseFloat(userLocation[0].toString()); // Force parse as number
    const userLatitude = parseFloat(userLocation[1].toString()); // Force parse as number
    const destLongitude = parseFloat(destination[0].toString()); // Force parse as number
    const destLatitude = parseFloat(destination[1].toString()); // Force parse as number

    // Validate the parsed values
    if (
      isNaN(userLongitude) || 
      isNaN(userLatitude) || 
      isNaN(destLongitude) || 
      isNaN(destLatitude)
    ) {
      throw new Error("Coordinates must be valid numbers");
    }

    if (
      userLongitude < -180 || userLongitude > 180 || 
      destLongitude < -180 || destLongitude > 180
    ) {
      throw new Error("Longitude must be between -180 and 180");
    }

    if (
      userLatitude < -90 || userLatitude > 90 || 
      destLatitude < -90 || destLatitude > 90
    ) {
      throw new Error("Latitude must be between -90 and 90");
    }

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${userLongitude},${userLatitude};${destLongitude},${destLatitude}` +
      `?geometries=geojson&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      setRouteGeometry(data.routes[0].geometry);
    } else {
      throw new Error("No route data found");
    }
  } catch (error) {
    console.error("Route fetch failed:", error);
  }

  setIsRouting(false);
};

  return (
    <ThemedView style={styles.container}>
      <Mapbox.MapView style={styles.map} onDidFinishLoadingMap={handleMapReady}>
        <Mapbox.Camera ref={cameraRef} followZoomLevel={15} />

        <Mapbox.LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        {/* Your markers: forum posts */}
        {forumPostsState.map((post) => (
          <Mapbox.PointAnnotation key={post.id} id={post.id} coordinate={post.coordinate}>
            <View style={{ backgroundColor: 'green', padding: 4, borderRadius: 4 }}>
              <Text style={{ color: 'white' }}>{post.title}</Text>
            </View>
          </Mapbox.PointAnnotation>
        ))}

        {/* Your markers: search results */}
        {searchResults.map((result) => (
          <Mapbox.PointAnnotation
            key={result.id}
            id={result.id}
            coordinate={result.coordinate}
            onSelected={() => setDestination(result.coordinate)}
          >
            <View style={{ backgroundColor: 'blue', padding: 4, borderRadius: 4 }}>
              <Text style={{ color: 'white' }}>{result.placeName}</Text>
            </View>
          </Mapbox.PointAnnotation>
        ))}

        {routeGeometry && (
          <Mapbox.ShapeSource
            id="routeSource"
            shape={{
              type: "Feature",
              properties: {},
              geometry: routeGeometry,
            }}
          >
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: "#3b9ddd",
                lineWidth: 5,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </Mapbox.ShapeSource>
        )}

      </Mapbox.MapView>

      {/* Search bar */}
      <View style={[styles.searchContainer, { top: insets.top + 12 }]}>
        <SearchBar onSearch={handleSearch} onClear={handleSearchClear} isSearching={isSearching} placeholder="Search places…" />
      </View>

      {/* Location error banner */}
      {locationError && (
        <View style={[styles.errorBanner, { backgroundColor: errorBg, top: insets.top + 68 }]}>
          <Text style={[styles.errorText, { color: errorText }]}>{locationError}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="Recenter" onPress={centerOnUser} loading={isLocating} variant="primary" />
      </View>

      {/* Loading overlay */}
      <MapLoadingOverlay visible={showLoading} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: { position: 'absolute', left: 16, right: 16, zIndex: 5 },
  errorBanner: { position: 'absolute', left: 16, right: 16, borderRadius: 8, padding: 12, zIndex: 5 },
  errorText: { fontSize: 14, textAlign: 'center' },
  controls: { position: 'absolute', bottom: 40, right: 20, gap: 12 },
});