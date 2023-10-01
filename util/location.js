import * as Location from 'expo-location';
import axios from 'axios';

export async function getLocationDuration() {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const latitude = currentLocation.coords.latitude;
    const longitude = currentLocation.coords.longitude;

    console.log('fetchDistanceMatrix ' + latitude + ', ' + longitude);
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins=${latitude},${longitude}&destinations=35.5186,129.3738&region=KR&key=AIzaSyCV3eoZkgU501PcXVxJ4Jv2OJdBR5AXOPE`
    );
    
    const elements = response.data.rows[0].elements[0];
    if (elements && elements.duration && elements.duration.text) {
      const durationText = elements.duration.text;
      return durationText;
    } else {
      throw new Error('Distance matrix response is missing duration information.');
    }
  } catch (error) {
    console.error('Error fetching distance matrix:', error);
    throw error;
  }
}
