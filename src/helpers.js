export function isArrayEmpty(array) {
    return !array || array.length < 1;
}

export function formatCoordinates(obj) {
    const lat = obj.lat || obj.latitude;
    const lng = obj.lng || obj.longitude;
    return {lat: parseFloat(lat), lng: parseFloat(lng)};
}

export function formatDirectionsPoints(points) {
    if (!points || isArrayEmpty(points)) {
        return {};
    }

    const origin = formatCoordinates(points[0]);
    const destination = formatCoordinates(points[points.length -1]);
    const waypoints = points.slice(1, points.length -1).map(item => {
        return {
            location: formatCoordinates(item),
        };
    });

    return {
        origin,
        destination,
        waypoints,
    };
}

export function getRouteDetails (route) {
    const { routes: [ directionDetails ] = [] } = route;
    
    if (!directionDetails || !directionDetails.legs) {
        return {};
    }

    const { legs = [] } = directionDetails;

    const start_address = legs[0] && legs[0].start_address;
    const end_address = legs[legs.length - 1] && legs[legs.length - 1].end_address;

    const formatedData = directionDetails.legs.reduce((previousValue, currentValue, index, array) => {
        if (!previousValue.distance && !previousValue.duration) {
            return {
                distance: currentValue.distance.value,
                duration: currentValue.duration.value,
            };
        }
        
        return {
            distance: previousValue.distance + currentValue.distance.value,
            duration: previousValue.duration + currentValue.duration.value,
        };
    }, {});
    
    return {
        ...formatedData,
        start_address,
        end_address,
    };
};

export function metersToKilometers (distance) {
    return `${Math.floor(parseInt(distance, 10) / 1000)} km`;
}

export function secondsToHours (time) {
    const totalSeconds = parseInt(time, 10);
    const hours   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);

    return `${hours < 10 ? '0' : ''}${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;
}

export function getLatestCoordinate(coordinateArray) {
    if (!coordinateArray || isArrayEmpty(coordinateArray)) {
        return {};
    }

    return coordinateArray.reduce((prevValue, currValue, index, array) => {
        if (Date.parse(currValue.time) > Date.parse(prevValue.time)) {
            return currValue;
        }

        return prevValue;
    });
}
