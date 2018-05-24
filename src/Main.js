import React, { PureComponent, Fragment } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from 'react-google-maps';

import Map from './components/Map';
import { Table, Grid } from 'react-bootstrap';
import TableRow from './components/TableRow';

import * as requests from './requests';
import { formatCoordinates, isArrayEmpty } from './helpers';


class MainContainer extends PureComponent {
    constructor(props) {
        super(props);
        
        this.googleMapURL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD_nHJXh-xRpNrLlkVXhPZHOH3gHyjQ5OA&v=3.exp&libraries=geometry,drawing,places';

        this.state = {
            loadsData: [],
            currentLoad: {
                data: {},
                direction: {},
                action: null,
            },
        };
    }

    componentDidMount() {
        requests.fetchData('loads').then(result => {
            // console.log(result);
            this.setState({
                ...this.state,
                loadsData: result,
            });
        }).catch(err => { console.error(err); });
    }

    setCurrent = (data, action) => {
        this.setState({
            ...this.state, 
            currentLoad: {
                data,
                action,
            },
        });
    }

    putMarkers = (locationData) => {
        if (!locationData || isArrayEmpty(locationData)) {
            return null;
        }

        return locationData.map(item => {
            // console.log(item, formatCoordinates(item));
            return <Marker key={item.id} position={formatCoordinates(item)} />;
        })
    };

    buildRoute = (coordinates) => {
        if (!window.google || !coordinates || coordinates.length < 2) {
            return null;
        }

        const google = window.google;

        // const origin = new google.maps.LatLng(coordinates[0].lat, coordinates[0].lng);
        const origin = formatCoordinates(coordinates[0]);
        const destination = formatCoordinates(coordinates[coordinates.length -1]);

        const waypoints = coordinates.slice(1, coordinates.length -1).map(item => {
            return {
                location: new google.maps.LatLng(item.lat, item.lng),
            };
        });

        // console.log(coordinates);
        // console.log(origin, destination, waypoints);
        // debugger;
        
        const DirectionsService = new google.maps.DirectionsService();
        
        DirectionsService.route({
            origin: origin,
            destination: destination,
            // origin: new google.maps.LatLng(41.8507300, -87.6512600),
            // destination: new google.maps.LatLng(41.8525800, -87.6514100),
            travelMode: google.maps.TravelMode.DRIVING,

            waypoints: waypoints,

        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                // console.log(result, status);
                // // debugger;

                this.setState({
                    ...this.state,
                    currentLoad: {
                        ...this.state.currentLoad,
                        direction: result,
                        action: 'BUILD_ROUTE',
                    },
                });
            } else {
                console.error(`error fetching directions ${status}`);
            }
        });
    };

    getRouteDetails = (route) => {
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

            const result = {
                distance: previousValue.distance + currentValue.distance.value,
                duration: previousValue.duration + currentValue.duration.value,
            };
            
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

    metersToKilometers = (distance) => `${Math.floor(parseInt(distance, 10) / 1000)} km`;

    secondsToHours = (time) =>  {
        const totalSeconds = parseInt(time, 10);
        const hours   = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    
        return `${hours < 10 ? '0' : ''}${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;
    }

    render() {
        const {
            loadsData,
            currentLoad: {
                data,
                direction,
                action,
            },
        } = this.state;

        console.log(this.state.currentLoad);
        
        const routeDetails = direction && this.getRouteDetails(direction);
    
        return (
            <Fragment>
                <Grid bsClass="container">
                    <div className="main-wrap">
                        <h1>Location Tracking</h1>

                        <br />

                        <div className="row">
                            <div className="col-sm-12">
                                <Map
                                    googleMapURL={this.googleMapURL}
                                    loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<div style={{ height: `520px` }} />}
                                    mapElement={<div style={{ height: `100%` }} />}
                                >
                                    {action === 'PUT_MARKERS' && data && (
                                       this.putMarkers(data.coordinates)
                                    )}
                                    {action === 'BUILD_ROUTE' && direction && (
                                        <DirectionsRenderer directions={direction} />
                                    )}
                                </Map>
                            </div>
                        </div>

                        <br />

                        {action === 'BUILD_ROUTE' && direction && (
                            <div className="styled-block">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <h2>Route Details:</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div>
                                            <p><strong>Start Address: </strong>{routeDetails && routeDetails.start_address}</p>
                                        </div>
                                        <div>
                                            <p><strong>End Address: </strong>{routeDetails && routeDetails.end_address}</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div>
                                            <p><strong>Total Distance: </strong>{routeDetails && this.metersToKilometers(routeDetails.distance)}</p>
                                        </div>
                                        <div>
                                            <p><strong>Total Travel Time: </strong>{routeDetails && this.secondsToHours(routeDetails.duration)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                            
                        <br />

                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th style={{width: '1%', minWidth: 50}}>ID</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Last Update</th>
                                    <th style={{width: '1%', minWidth: 280}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadsData && loadsData.map(item => (
                                    <TableRow
                                        key={item.id}
                                        data={item}
                                        setCurrent={this.setCurrent}                                        
                                        buildRoute={this.buildRoute}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </div> 
                </Grid>
            </Fragment>
        );
    }
}

export default MainContainer;