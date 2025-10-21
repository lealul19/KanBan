
export async function detectUserCountry() {
  if (!navigator.geolocation) {
    return "Geolocation not supported";
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          const data = await response.json();
          resolve(data.countryName || "Unknown location");
        } catch (error) {
          console.error("Geocoding error:", error);
          resolve("Location unavailable");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          resolve("Location permission denied");
        } else {
          resolve("Location unavailable");
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // Cache for 5 minutes
      }
    );
  });
}

/**
 * Gets approximate location without high accuracy (faster, less battery)
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export async function getApproximateLocation() {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 3000,
        maximumAge: 600000
      }
    );
  });
}

