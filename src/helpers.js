export function isArrayEmpty(array) {
    return !array || array.length < 1;
}

export function formatCoordinates(obj) {
    const lat = obj.lat || obj.latitude;
    const lng = obj.lng || obj.longitude;
    return {lat: parseFloat(lat), lng: parseFloat(lng)};
}



export function getLatestCoordinate(coordinateArray) {
    if (!coordinateArray || isArrayEmpty(coordinateArray)) {
        return {};
    }

    return coordinateArray.reduce((prevValue, currValue, index, array) => {
        // console.log(prevValue, currValue);

        if (Date.parse(currValue.time) > Date.parse(prevValue.time)) {
            return currValue;
        }

        return prevValue;
    });
}