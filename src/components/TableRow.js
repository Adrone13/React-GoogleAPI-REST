import React from 'react';
import { Button } from 'react-bootstrap';

import { getLatestCoordinate } from '../helpers';

const actions = {
    putMarkers: 'PUT_MARKERS',
    buildRoute: 'BUILD_ROUTE',
};

const TableRow = props => {
    if (!props.data || props.data.length < 1) {
        return null;
    }

    const { id, name, coordinates = [], description } = props.data;
    const { lat, lng, time } = getLatestCoordinate(coordinates);

    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{`Latitude: ${lat}, Longitude: ${lng}`}</td>
            <td>{time}</td>
            <td>
                <button 
                    className="bs4-btn bs4-btn-primary" 
                    style={{margin: 5}}
                    onClick={() => props.setCurrent(props.data, actions.putMarkers)}
                >
                    Show waypoints
                </button>
                <button 
                    className="bs4-btn bs4-btn-success" 
                    style={{margin: 5}}
                >
                    Build route
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
