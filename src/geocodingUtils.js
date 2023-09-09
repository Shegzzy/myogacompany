
export async function reverseGeocode(latitude, longitude) {
  const apiKey= process.env.REACT_APP_MAP_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to retrieve location data');
    }

    const data = await response.json();
    if (data.status === 'OK') {
      const result = data.results[0];
      const address = result.formatted_address;
      return address;
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}
