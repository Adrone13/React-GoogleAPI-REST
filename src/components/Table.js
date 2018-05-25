import React from 'react';
import { Table } from 'react-bootstrap';

const MainTable = props => (
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
            {props.children}
        </tbody>
    </Table>
);

export default MainTable;