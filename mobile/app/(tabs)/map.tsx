import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useRef, useEffect, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';

import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const centerOnUser = async () => {
    if (!userLocation && !isLocating) {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation([location.coords.longitude, location.coords.latitude]);
      }
      setIsLocating(false);
    }

    if (userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: userLocation,
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
  };

  useEffect(() => {
    centerOnUser();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Mapbox.MapView style={styles.map}>
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

      <View style={styles.controls}>
        <Button
          title="Recenter"
          onPress={centerOnUser}
          loading={isLocating}
          variant="primary"
        />
      </View>
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
  controls: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    gap: 12,
  },
});
