import React, { PureComponent, Fragment } from 'react';
import { Marker, DirectionsRenderer } from 'react-google-maps';
import { Grid } from 'react-bootstrap';
import Map from './components/Map';
import Table from './components/Table';
import TableRow from './components/TableRow';

import * as requests from './requests';
import {
    formatCoordinates,
    formatDirectionsPoints,
    getRouteDetails,
    metersToKilometers,
    secondsToHours,
    isArrayEmpty,
} from './helpers';


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
            this.setState({
                ...this.state,
                loadsData: result,
            });
        }).catch(error => { console.error(error); });
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
            return <Marker key={item.id} position={formatCoordinates(item)} />;
        })
    };

    buildRoute = (points) => {
        requests.requestDirections(formatDirectionsPoints(points))
            .then((response) => {
                this.setState({
                    ...this.state,
                    currentLoad: {
                        ...this.state.currentLoad,
                        direction: response,
                        action: 'BUILD_ROUTE',
                    },
                });
            })
            .catch(error => { console.error(error); });
    };

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
        
        const routeDetails = direction && getRouteDetails(direction);
    
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
                                        <p>
                                            <strong>Start Address: </strong>{routeDetails && routeDetails.start_address}
                                            <span style={{fontSize: '18px', color: '#28a745'}}>  ⮞</span>
                                        </p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p><strong>Total Distance: </strong>{routeDetails && metersToKilometers(routeDetails.distance)}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <p><strong>End Address: </strong>{routeDetails && routeDetails.end_address}
                                        <span style={{fontSize: '18px', color: '#0069d9'}}>  ⚑</span>
                                    </p>
                                    </div>
                                    <div className="col-sm-6">
                                        <p><strong>Total Travel Time: </strong>{routeDetails && secondsToHours(routeDetails.duration)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <br />

                        <Table>
                            {loadsData && loadsData.map(item => (
                                <TableRow
                                    key={item.id}
                                    data={item}
                                    setCurrent={this.setCurrent}                                        
                                    buildRoute={this.buildRoute}
                                />
                            ))}
                        </Table>
                    </div> 
                </Grid>
            </Fragment>
        );
    }
}

export default MainContainer;