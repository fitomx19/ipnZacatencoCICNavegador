// utils/distance.js

// Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distancia en kilómetros
    return d;
  };
  
  const toRad = (value) => {
    return value * Math.PI / 180;
  };
  
  // Función para encontrar la dirección más cercana
  export const findClosestAddress = (latitude, longitude, places) => {
    if (!places || places.length === 0) return null;
  
    let closestPlace = places[0];
    let minDistance = calculateDistance(
      latitude,
      longitude,
      places[0].latitude,
      places[0].longitude
    );
  
    places.forEach(place => {
      const distance = calculateDistance(
        latitude,
        longitude,
        place.latitude,
        place.longitude
      );
  
      if (distance < minDistance) {
        minDistance = distance;
        closestPlace = place;
      }
    });
  
    return {
      name: closestPlace.name,
      distance: minDistance,
      coordinates: {
        latitude: closestPlace.latitude,
        longitude: closestPlace.longitude
      }
    };
  };