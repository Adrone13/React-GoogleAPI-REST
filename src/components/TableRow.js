import React from 'react';
import { getLatestCoordinate } from '../helpers';

const actions = {
    putMarkers: 'PUT_MARKERS',
    buildRoute: 'BUILD_ROUTE',
};

const TableRow = props => {
    if (!props.data || props.data.length < 1) {
        return null;
    }

    const { id, name, coordinates = [] } = props.data;
    const { lat, lng, time } = getLatestCoordinate(coordinates);

    return (
        <tr>
            <td style={{verticalAlign: 'middle', padding: 10}}>{id}</td>
            <td style={{verticalAlign: 'middle', padding: 10}}>{name}</td>
            <td style={{verticalAlign: 'middle', padding: 10}}>{`Latitude: ${lat}, Longitude: ${lng}`}</td>
            <td style={{verticalAlign: 'middle', padding: 10}}>{time}</td>
            <td style={{verticalAlign: 'middle', padding: 10, textAlign: 'center'}}>
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
                    onClick={() => props.buildRoute(coordinates)}
                >
                    Build route
                </button>
            </td>
        </tr>
    );
};

export default TableRow;
