import React, { PureComponent, Fragment } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const testData = [
    {
        "lat": 53.817680,
        "lng": -1.537657
    },
    {
        "lat": 53.790123,
        "lng": -1.53243
    },
    {
        "lat": 53.756745,
        "lng": -1.5309087
    },
    {
        "lat": 53.6474675,
        "lng": -1.49564554
    },
    {
        "lat": 53.69123456,
        "lng": -1.6545466
    }
];

const Map = withScriptjs(
    withGoogleMap(props => {
        const { locationData } = props;

        console.log(locationData);
        console.log(locationData.length > 0);
        // debugger;

        return (
            <GoogleMap
                defaultZoom={4}
                defaultCenter={{ lat: 40.022, lng: -98.132 }}
            >
                {locationData.length > 0 && locationData.map(item => 
                    <Marker key={item.lat} position={item} />
                )}
                {/* {props.isMarkerShown && <Marker position={{ lat: 47.607, lng: -122.319 }} />} */}
            </GoogleMap>
        );
    })
);

class WrappedMap extends PureComponent {
    constructor(props) {
        super(props);
        
        this.state = {
            locationData: [],
        };
    }

    setLocationData = () => {
        // Asynchronous call to api goes here
        this.setState({
            locationData: testData,
        });
    }

    render() {
        return (
            <Fragment>
                <button onClick={this.setLocationData}>Put Markers</button>
                <Map
                    // isMarkerShown
                    locationData={this.state.locationData}

                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_nHJXh-xRpNrLlkVXhPZHOH3gHyjQ5OA&v=3.exp&libraries=geometry,drawing,places"
                    
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `500px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </Fragment>
        );
    }
}

export default WrappedMap;