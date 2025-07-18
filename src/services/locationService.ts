export const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error(`Location error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

export async function getDrivingDistance(
  userLat: number,
  userLng: number,
  masjidLat: number,
  masjidLng: number
): Promise<number | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${masjidLng},${masjidLat}?overview=false`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes && data.routes[0]) {
      // distance is in meters
      return +(data.routes[0].distance / 1000).toFixed(1); // return in km
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.address) {
      // Filter out unwanted area names like 'Ward'
      let area = data.address.suburb || data.address.neighbourhood || '';
      if (area && area.toLowerCase().startsWith('ward')) {
        area = '';
      }
      const city = data.address.city || data.address.town || data.address.village || '';
      return [area, city].filter(Boolean).join(', ');
    }
    return null;
  } catch {
    return null;
  }
}