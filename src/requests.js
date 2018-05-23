export function getCoordinates() {
    return fetch('react-rest/coordinates', {method: 'GET'})
        .then(response => {
            var contentType = response.headers.get("content-type");
            
            console.log(contentType);
    
            if(contentType && contentType.includes("application/json")) {
                return response.json();
            }
            
            throw new TypeError("Oops, we haven't got JSON!");
        })
        .then(json => json)
        .catch(err => { console.log(err); });
}

const getGeoCode = (options) => new Promise(resolve => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(options.params, (results, status) => {
        if (status === 'OK') {
            let city = 'unknown city';
            let state = 'unknown state';
            let zipCode = 'unknown zipCode';
            let country = 'unknown country';

            for (let i = 0; i < results[0].address_components.length; i++) {
                const component = results[0].address_components[i];
                switch (component.types[0]) {
                    case 'locality':
                        city = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        state = component.short_name;
                        break;
                    case 'postal_code':
                        zipCode = component.short_name;
                        break;
                    case 'country':
                        country = component.short_name;
                        break;
                    default:
                        break;
                }
            }

            resolve({
                ...options.payload,
                formatted_address: `${city}, ${state} ${zipCode}, ${country}`,
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
            });
        } else if (status === 'OVER_QUERY_LIMIT') {
            console.error("GOOGLE API ERROR -> OVER QUERY LIMIT");
        } else {
            console.warn(`Geocode was not successful for the following reason: ${status}`);
            resolve([]);
        }
    });
});

export function getGeoCodeData(params) {
    const processRequests = async () => {
        const result = [];
        // eslint-disable-next-line
        for (const geoDataParams of params) {
            // eslint-disable-next-line
            await delay(1000);
            // eslint-disable-next-line
            const geoData = await getGeoCode(geoDataParams);
            result.push(geoData);
        }
        return result;
    };
    return processRequests();
}

export function requestDirections(points) {
    let tryAgain = true;

    const fetchData = (directionsService, resolve) => {
        directionsService.route({
            origin: points.origin,
            destination: points.destination,
            waypoints: points.waypoints,
            optimizeWaypoints: false,
            travelMode: 'DRIVING',
        }, (response, status) => {
            if (status === 'OVER_QUERY_LIMIT' && tryAgain) {
                setTimeout(() => {
                    fetchData(directionsService, resolve);
                    tryAgain = false;
                }, 500);
            } else if (status === 'OVER_QUERY_LIMIT') {
                console.error("GOOGLE API ERROR -> OVER QUERY LIMIT");
            } else {
                resolve({data: response, status});
            }
        });
    };

    return new Promise((resolve) => {
        const directionsService = new window.google.maps.DirectionsService();
        fetchData(directionsService, resolve);
    });
}
