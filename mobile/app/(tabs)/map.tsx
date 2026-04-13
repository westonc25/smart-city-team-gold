import { ThemedView } from '@/components/themed-view';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/SearchBar';
import { SearchResultsList, SearchResult } from '@/components/map/SearchResultsList';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
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
  const [notifPanelVisible, setNotifPanelVisible] = useState(false);

  const insets = useSafeAreaInsets();
  const errorBg = useThemeColor({ light: '#FEF2F2', dark: '#3B1C1C' }, 'background');
  const errorText = useThemeColor({ light: '#991B1B', dark: '#FCA5A5' }, 'text');

  
  const sampleForumPosts = [
    { id: "post-1", coordinate: [-122.4194, 37.7749], title: "Post about local events" },
    { id: "post-2", coordinate: [-73.935242, 40.73061], title: "Meetup discussion" },
    { id: "post-3", coordinate: [-118.2437, 34.0522], title: "Art gallery thread" }
  ];
  const forumPostsState = sampleForumPosts;

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<any | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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
    } catch {
      setLocationError('Unable to get your location. Please try again.');
    }

    setIsLocating(false);
  }, [isLocating]);

  useEffect(() => {
    void centerOnUser();
    // Run once on mount; centerOnUser changes when isLocating toggles and must not retrigger here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const handleSearch = useCallback((query: string) => {
  console.log("SEARCH QUERY:", query);
  setIsSearching(true);

  const fetchMapboxSearch = async () => {
    if (!query || !userLocation) return;

    const [userLongitude, userLatitude] = userLocation;

    if (isNaN(userLongitude) || isNaN(userLatitude)) {
      console.error("Invalid user location");
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent(query)}` +
        `&proximity=${userLongitude},${userLatitude}` +
        `&limit=5` +
        `&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`
      );

      const data = await response.json();
      console.log("MAPBOX RESPONSE:", data);

      if (data.features && data.features.length > 0) {
        const results = data.features.map((feature: any, index: number) => ({
          id: `${feature.id}-${index}`,
          coordinate: feature.geometry.coordinates,
          placeName: feature.properties.name + ", " + feature.properties.place_formatted,
        }));

        setSearchResults(results);
 
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
    }

    setIsSearching(false);
  };

  fetchMapboxSearch();
}, [userLocation]);

  const handleSearchClear = useCallback(() => {
    setIsSearching(false);
    setSearchResults([]);
  }, []);

  const clearRoute = useCallback(() => {
    setDestination(null);
    setRouteGeometry(null);
    setRouteInfo(null);
    setSearchResults([]);
    setIsSearching(false);
    setSteps([]);
  }, []);

  const showLoading = !isMapReady || (isLocating && !userLocation) || isRouting;

  const formatDistance = (meters: number) =>
  (meters / 1609.34).toFixed(1) + " mi";

  const formatDuration = (seconds: number) =>
    Math.round(seconds / 60) + " min";

  const fetchRoute = useCallback(async () => {
    if (!userLocation || !destination) return;

    setIsRouting(true);

    try {
      const userLongitude = userLocation[0];
      const userLatitude = userLocation[1];
      const destLongitude = destination[0];
      const destLatitude = destination[1];

      if (
        isNaN(userLongitude) ||
        isNaN(userLatitude) ||
        isNaN(destLongitude) ||
        isNaN(destLatitude)
      ) {
        throw new Error('Coordinates must be valid numbers');
      }

      if (
        userLongitude < -180 || userLongitude > 180 ||
        destLongitude < -180 || destLongitude > 180
      ) {
        throw new Error('Longitude must be between -180 and 180');
      }

      if (
        userLatitude < -90 || userLatitude > 90 ||
        destLatitude < -90 || destLatitude > 90
      ) {
        throw new Error('Latitude must be between -90 and 90');
      }

      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/` +
        `${userLongitude},${userLatitude};${destLongitude},${destLatitude}` +
        `?geometries=geojson&overview=full&steps=true&access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) 
      {
        const route = data.routes[0];

        setRouteGeometry(route.geometry);

        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
        });

        const routeSteps = route.legs[0].steps;
        setSteps(routeSteps);
        setCurrentStepIndex(0);

      } 
      else 
      {
        setRouteGeometry(null);
        setRouteInfo(null);
        setSteps([]);
        throw new Error('No route data found');
      }
    } 
    catch (error) 
    {
      console.error('Route fetch failed:', error);
    }

    setIsRouting(false);
  }, [userLocation, destination]);

  useEffect(() => {
    if (!userLocation || !destination) return;
    void fetchRoute();
  }, [userLocation, destination, fetchRoute]);

  useEffect(() => {
    if (!userLocation || steps.length === 0) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const [stepLng, stepLat] = currentStep.maneuver.location;

    const toRadians = (deg: number) => deg * (Math.PI / 180);

    const R = 6371000; // meters
    const dLat = toRadians(stepLat - userLocation[1]);
    const dLng = toRadians(stepLng - userLocation[0]);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(userLocation[1])) *
        Math.cos(toRadians(stepLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 30) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }, [userLocation, steps, currentStepIndex]);

  return (
    <ThemedView style={styles.container}>
      <Mapbox.MapView style={styles.map} onDidFinishLoadingMap={handleMapReady}>
        <Mapbox.Camera ref={cameraRef} followZoomLevel={15} />

        <Mapbox.UserLocation
          visible={false}
          onUpdate={(location: any) => {
            const coords: [number, number] = [
              location.coords.longitude,
              location.coords.latitude,
            ];
            setUserLocation(coords);
          }}
        />

        <Mapbox.LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />

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
            onSelected={() => {
              setDestination(result.coordinate);
              setSearchResults([]);
              setIsSearching(false);
            }}
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
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar onSearch={handleSearch} onClear={handleSearchClear} isSearching={isSearching} placeholder="Search places…" />
          </View>
          {/* Notification bell — sits flush right of the search bar */}
          <NotificationBell
            onPress={() => setNotifPanelVisible(true)}
            color="#0a7ea4"
            size={22}
          />
        </View>
      </View>

      {/* Polished scrollable search results dropdown */}
      {searchResults.length > 0 && (
        <SearchResultsList
          results={searchResults}
          onSelect={(result) => {
            setDestination(result.coordinate);
            setSearchResults([]);
            setIsSearching(false);
          }}
          style={[
            styles.resultsDropdown,
            { top: insets.top + 64 },
          ]}
        />
      )}

      {/* Location error banner */}
      {locationError && (
        <View style={[styles.errorBanner, { backgroundColor: errorBg, top: insets.top + 80 }]}>
          <Text style={[styles.errorText, { color: errorText }]}>{locationError}</Text>
        </View>
      )}

      {routeInfo && (
        <View style={styles.routeInfoBox}>
          <Text style={styles.routeText}>
            {formatDuration(routeInfo.duration)} • {formatDistance(routeInfo.distance)}
          </Text>
        </View>
      )}

      {steps.length > 0 && (
        <View style={styles.stepBox}>
          <Text style={styles.stepText}>
            {steps[currentStepIndex]?.maneuver.instruction}
          </Text>
        </View>
      )}


      {/* Controls */}
      <View style={styles.controls}>
        {routeGeometry && (
          <Button title="Clear Route" onPress={clearRoute} variant="secondary" />
        )}
        <Button title="Recenter" onPress={centerOnUser} loading={isLocating} variant="primary" />
      </View>

      {/* Loading overlay */}
      <MapLoadingOverlay visible={showLoading} />

      {/* Notification panel (slide-in inbox) */}
      <NotificationPanel
        visible={notifPanelVisible}
        onClose={() => setNotifPanelVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: { position: 'absolute', left: 16, right: 16, zIndex: 5 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBarWrapper: {
    flex: 1,
  },
  resultsDropdown: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 10,
  },
  errorBanner: { position: 'absolute', left: 16, right: 16, borderRadius: 8, padding: 12, zIndex: 5 },
  errorText: { fontSize: 14, textAlign: 'center' },
  controls: { position: 'absolute', bottom: 40, right: 20, gap: 12 },
  routeInfoBox: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  routeText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  stepBox: {
    position: 'absolute',
    top: 180,
    left: 16,
    right: 16,
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 10,
    zIndex: 10,
  },

  stepText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});