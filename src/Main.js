import React, { PureComponent, Fragment } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

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
            console.log(item, formatCoordinates(item));
            

            return <Marker key={item.id} position={formatCoordinates(item)} />;
        })
    };

    render() {
        const { loadsData, currentLoad } = this.state;

        return (
            <Fragment>
                <Grid bsClass="container">
                    <div className="main-wrap">
                        <div className="row">
                            <div className="col-sm-12">
                                <Map
                                    googleMapURL={this.googleMapURL}

                                    loadingElement={<div style={{ height: `100%` }} />}
                                    containerElement={<div style={{ height: `520px` }} />}
                                    mapElement={<div style={{ height: `100%` }} />}
                                >
                                    {currentLoad.action === 'PUT_MARKERS' && currentLoad.data && (
                                        this.putMarkers(currentLoad.data.coordinates)
                                    )}
                                    {/* {currentLoad.action === 'BUILD_ROUTE' && this.putMarkers(currentLoad.data)} */}
                                </Map>
                            </div>
                        </div>

                        <br />

                        <Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    <th style={{width: '1%', minWidth: 80}}>Record ID</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Last Update</th>
                                    <th style={{width: '1%', minWidth: 260}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadsData && loadsData.map(item => (
                                    <TableRow
                                        key={item.id}
                                        data={item}
                                        setCurrent={this.setCurrent}
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