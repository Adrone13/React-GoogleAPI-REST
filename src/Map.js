import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const Map = withScriptjs(
    withGoogleMap(props => {
        return (
            <GoogleMap
                defaultZoom={4}
                defaultCenter={{ lat: 40.022, lng: -98.132 }}
            >
                {props.isMarkerShown && <Marker position={{ lat: 47.607, lng: -122.319 }} />}
            </GoogleMap>
        );
    }
)
);

export default Map;