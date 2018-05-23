import React, { PureComponent, Fragment } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import * as requests from './requests';
import { formatCoordinates } from './helpers';


const testData = [
    {
        "lat": 50.303279,
        "lng": 29.177015,
    },
    {
        "lat": 50.625160,
        "lng": 31.258765,
    },
    {
        "lat": 50.890463,
        "lng": 33.016186,
    },
    {
        "lat": 46.967140,
        "lng": 31.968177,
    },
    {
        "lat": 46.481235,
        "lng": 30.582511,
    },
    {
        "lat": 47.847250,
        "lng": 35.303733,
    },
    {
        "lat": 51.064592,
        "lng": 32.256909,
    },
    {
        "lat": 49.776881,
        "lng": 23.960680,
    },
    {
        "lat": 50.663408,
        "lng": 25.764981,
    },
    {
        "lat": 51.452022,
        "lng": 24.838470,
    },
    {
        "lat": 51.552539,
        "lng": 25.852206,
    },
    {
        "lat": 50.663408,
        "lng": 25.764981,
    },
    {
        "lat": 49.312515,
        "lng": 30.707931,
    },
    {
        "lat": 50.538415,
        "lng": 29.478510,
    }
];

const Map = withScriptjs(
    withGoogleMap(props => {
        const { locationData } = props;

        // const current = locationData.length > 0 && formatCoordinates(locationData[0]);
        // console.log(locationData);
        // console.log(locationData.length > 0);
        // console.log(current);
        // debugger;

        return (
            <GoogleMap
                defaultZoom={6}
                defaultCenter={{ lat: 48.868554, lng: 32.053234 }}
            >
                {locationData.length > 0 && locationData.map(item => 
                    <Marker key={item.id} position={formatCoordinates(item)} />
                )}
                {/* {props.isMarkerShown && <Marker position={{ lat: 47.607, lng: -122.319 }} />} */}
            </GoogleMap>
        );
    })
);

class WrappedMap extends PureComponent {
    constructor(props) {
        super(props);
        
        this.googleMapURL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD_nHJXh-xRpNrLlkVXhPZHOH3gHyjQ5OA&v=3.exp&libraries=geometry,drawing,places';

        this.state = {
            locationData: [],
        };
    }

    componentDidMount() {
        requests.getCoordinates().then(result => {
            console.log(result);
            this.setState({
                locationData: result,
            });
        });
    }

    // setLocationData = () => {
    //     // Asynchronous call to api goes here
    //     requests.getCoordinates().then(result => {
    //         console.log(result);
    //         this.setState({
    //             locationData: result,
    //         });
    //     });
    // }

    render() {
        return (
            <Fragment>
                {/* <button onClick={this.setLocationData}>Put Markers</button> */}
                <Map
                    // isMarkerShown
                    locationData={this.state.locationData}

                    //googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_nHJXh-xRpNrLlkVXhPZHOH3gHyjQ5OA&v=3.exp&libraries=geometry,drawing,places"
                    googleMapURL={this.googleMapURL}


                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `520px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </Fragment>
        );
    }
}

export default WrappedMap;