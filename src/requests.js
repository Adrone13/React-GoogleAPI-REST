
export function fetchData(endPoint) {
    return fetch(`react-rest/${endPoint}`, {method: 'GET'})
        .then(response => {
            var contentType = response.headers.get("content-type");
            
            console.log(contentType);
        
            if(contentType && contentType.includes("application/json")) {
                return response.json();
            }
            
            throw new TypeError("Oops, we haven't got JSON!");
        })
        .then(json => json)
        .catch(err => { console.error(err); })
}

export function requestDirections(points) {
    return new Promise((resolve) => {
        const directionsService = new window.google.maps.DirectionsService();
        
        directionsService.route({
            origin: points.origin,
            destination: points.destination,
            waypoints: points.waypoints,
            optimizeWaypoints: false,
            travelMode: window.google.maps.TravelMode.DRIVING,
        }, (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                resolve(response);
            } else {
                console.error(`error fetching directions ${status}`);
            }
        });
    });
}
