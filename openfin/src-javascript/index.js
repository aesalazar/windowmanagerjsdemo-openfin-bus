import { Grid } from 'ag-grid';
import * as Enumerable from "linq-es2015";

import connection from './connection';
import columnDefinitions from './columnDefinitions';

import '../node_modules/ag-grid/dist/styles/ag-grid.css';
import '../node_modules/ag-grid/dist/styles/ag-theme-dark.css';
import '../node_modules/ag-grid/dist/styles/theme-dark.css';

//Prep the connection
const hostname = location.hostname;
const port = location.port.length > 0 ? ":" + location.port : "";

//Open the connection to the server
const endpoint = "ws://" + hostname + port + "/";
const ws = new WebSocket(endpoint);

connection.initialize(ws, sessionStorage);
ws.onopen = () => {
    connection.connectPromise();
};

//Wire for metadata being received
const gridOptions = {
    enableFilter: true,
    enableSorting: true,
};

let gridDiv;
let fieldNames;

const metadataHandler = (names, types, indexedNames) => {
    fieldNames = names;
    columnDefinitions.buildGridOptions(
        fieldNames,
        types,
        indexedNames,
        gridOptions
    );

    // lookup the container we want the Grid to use
    gridDiv = document.querySelector('#divMainGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new Grid(gridDiv, gridOptions);
};

//Wire for data received
connection.addMetadataHandler(metadataHandler);

const dataHandler = (data) => {
    var rows = Enumerable
        .asEnumerable(data)
        .Select(rowString => {
            const parts = rowString.split(",");
            const order = {};

            parts.forEach((v, i) => order[fieldNames[i]] = v);
            return order;
        })
        .ToArray();
    
    gridOptions.api.setRowData(rows);
};

connection.addDataHandler(dataHandler);