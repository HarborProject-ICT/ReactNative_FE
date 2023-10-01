import { StyleSheet, Text, View, } from 'react-native';
import React, { Component, useState, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, MAP_TYPES } from "react-native-maps";
import * as Location from 'expo-location';
import axios from 'axios';

const MapScreen = ({navigation}) => {const [initialRegion, setInitialRegion] = useState({
  latitude: 35.91395373474155,
  longitude: 127.73829440215488,
  latitudeDelta: 5,
  longitudeDelta: 5,
})

const [mapWidth, setMapWidth] = useState('99%');
const [location, setLocation] = useState(null);
const [destination, setDestination] = useState({ latitude: 35.5186, longitude: 129.3738 });
const [duration, setDuration] = useState(null);
const [arrival, setArrival] = useState(null);
const [origin, setOrigin] = useState('현재 위치');
const [errorMsg, setErrorMsg] = useState(null);


// Update map style to force a re-render to make sure the geolocation button appears
const updateMapStyle = () => {
  setMapWidth('100%')
}

function calculateArrivalTime(duration) {
  const currentTime = new Date();
  const arrivalTime = new Date(currentTime.getTime() + duration * 1000);
  const arrivalHours = arrivalTime.getHours();
  const arrivalMinutes = arrivalTime.getMinutes();
  return `${arrivalHours}시 ${arrivalMinutes}분`;
}

// Get current location information 
useEffect(() => {(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    const latitude = currentLocation.coords.latitude;
    const longitude = currentLocation.coords.longitude;
      // Google Maps Distance Matrix API를 사용하여 예상 소요 시간 가져오기
    //fetchDistanceMatrix(currentLocation.coords.latitude, currentLocation.coords.longitude);
    try {
      console.log('fetchDistanceMatrix ' + latitude + ', ' + longitude);
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins=${latitude},${longitude}&destinations=35.5186,129.3738&region=KR&key=AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE`
      );
      console.log(response);
      const elements = response.data.rows[0].elements[0];

      if (elements && elements.duration && elements.duration.text) {
        const durationTime = elements.duration.value; //초/분
        const durationText = elements.duration.text; //6시간 5분
        const originAddresses = response.data.origin_addresses;
        const formattedArrivalTime = calculateArrivalTime(durationTime);

        setDuration(durationTime);
        setOrigin(originAddresses[0]);
        setArrival(formattedArrivalTime);

        console.log('도착 시간:', formattedArrivalTime);
      } else {
        console.error('Distance matrix response is missing duration information.');
      }
    } catch (error) {
      console.error('Error fetching distance matrix:', error);
    }
     
  })();
}, []);



let text = 'Waiting..';

if (errorMsg) {
  text = errorMsg;
} else if (location) {
  const currentLatitude = location.coords.latitude;
  const currentLongitude = location.coords.longitude;
}



return (
  <View style={{flex:1}}>
    <MapView
      initialRegion={initialRegion}
      style={[styles.map, { width: mapWidth }]}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={true}
      onMapReady={() => {
        updateMapStyle()
      }}
    >
    <Marker
          coordinate={{
            latitude: 35.5186,
            longitude: 129.3738,
          }}
          title="울산본항"
        />
    </MapView>
    <View style={styles.overlayView}>
        <Text style={styles.overlayText}>출발지 : {origin}</Text>
        <Text style={styles.overlayText}>도착지 : 울산본항</Text>
        <Text style={styles.overlayText}>예상 도착 시간 : {arrival}</Text>
      </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayView: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 350,
    height: 150,
    backgroundColor: 'white',
    opacity: 0.9,
    padding: 10,
    borderRadius: 5,
  },
  overlayText: {
    fontSize : 20,
    margin: 7
  }
});

export default MapScreen;