import React, { Fragment } from 'react';
import { Button } from 'react-bootstrap';

const TableRow = props => {
    if (!props.data || props.data.length < 1) {
        return null;
    }

    const { id, lat, lng, time } = props.data;

    return (
        <tr>
            <td>{id}</td>
            <td>{lat}</td>
            <td>{lng}</td>
            <td>{time}</td>
            <td>
                {/* <Button bsStyle="primary">Show waypoints</Button>
                <Button bsStyle="primary">Build route</Button> */}

                <button 
                    className="bs4-btn bs4-btn-primary" 
                    style={{margin: 5}}
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
