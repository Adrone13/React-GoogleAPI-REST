import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

const Map = withScriptjs(
    withGoogleMap(props => (
            <GoogleMap
                defaultZoom={6}
                defaultCenter={{ lat: 48.868554, lng: 32.053234 }}
            >
                {props.children}
            </GoogleMap>
        )
    )
);

export default Map;