export function formatCoordinates(obj) {
    const lat = obj.lat || obj.latitude;
    const lng = obj.lng || obj.longitude;
    return {lat: parseFloat(lat), lng: parseFloat(lng)};
}