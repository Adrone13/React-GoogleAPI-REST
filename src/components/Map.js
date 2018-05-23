import React, { PureComponent, Fragment } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const Map = withScriptjs(
    withGoogleMap(props => {
        const { locationData } = props;

        return (
            <GoogleMap
                defaultZoom={6}
                defaultCenter={{ lat: 48.868554, lng: 32.053234 }}
            >
                {props.children}
            </GoogleMap>
        );
    })
);

export default Map;