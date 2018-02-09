import { Grid } from 'ag-grid';

import '../node_modules/ag-grid/dist/styles/ag-grid.css';
import '../node_modules/ag-grid/dist/styles/ag-theme-dark.css';
import '../node_modules/ag-grid/dist/styles/theme-dark.css';

// column definitions
const columnDefs = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Price", field: "price" }
];

//row data    
const rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
];

const gridOptions = {
    columnDefs,
    rowData
};

// wait for the document to be loaded, otherwise, ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#divMainGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new Grid(eGridDiv, gridOptions);

    //Create the url for the WebSocket
    const hostname = location.hostname;
    const port = location.port.length > 0 ? ":" + location.port : "";

    //Open the connection to the server
    const endpoint = "ws://" + hostname + port + "/";
    ws = new WebSocket(endpoint);
});