import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useRef, useEffect, useState } from 'react';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';

Mapbox.setAccessToken('MAPBOX_TOKEN');

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  //Retrieves location
  useEffect(() => 
  {
    const getLocation = async () => 
    {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') 
      {
        const location = await Location.getCurrentPositionAsync({});
        const { longitude, latitude } = location.coords;
        setUserLocation([longitude, latitude]);
      }
    };

    getLocation();
  }, []);

  //Moves to location upon update
  useEffect(() => 
  {
    if (userLocation && cameraRef.current) 
    {
      cameraRef.current.setCamera(
      {
        centerCoordinate: userLocation,
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [userLocation]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Mapbox.MapView style={{ flex: 1 }}>
        <Mapbox.Camera
          ref={cameraRef}
          followUserLocation={true}
          followZoomLevel={14}
        />

        <Mapbox.UserLocation visible={true} />
      </Mapbox.MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create(
{
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
