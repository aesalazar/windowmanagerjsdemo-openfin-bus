import * as Enumerable from "linq-es2015";

// default ColDef, gets applied to every column
const defaultColDef = {
    width: 100,
    editable: true,
    filter: 'agTextColumnFilter'
};

// define specific column types
const columnTypes = {
    numberColumn: {
        width: 80,
        filter: 'agNumberColumnFilter',
        
    },
    nonEditableColumn: {
        editable: false
    },
    dateColumn: {
        // specify we want to use the date filter
        filter: 'agDateColumnFilter',

        // add extra parameters for the date filter
        filterParams: {
            comparator: function (filterLocalDateAtMidnight, cellValue) {
                // In the example application, dates are stored as dd/mm/yyyy
                // We create a Date object for comparison against the filter date
                var dateParts = cellValue.split('/');
                var day = Number(dateParts[2]);
                var month = Number(dateParts[1]) - 1;
                var year = Number(dateParts[0]);
                var cellDate = new Date(day, month, year);

                // Now that both parameters are Date objects, we can compare
                if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                } else if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }
    }
};

/**
 * Adds column definitions properties to the passed gridOptions object.
 * @param {*} fieldNames collection of string column names from the backend
 * @param {*} types object containing column types as properties (e.g. {<colName>:<colType>}) 
 * @param {*} indexedNames names of columns that are indexable
 * @param {*} gridOptions gridOptions object to add properties; any existing properties will be overwritten
 */
const buildGridOptions = (fieldNames, types, indexedNames, gridOptions) => {
    const columnDefs = Enumerable
        .asEnumerable(fieldNames)
        .Select(name => {
            const def = {
                headerName: name,
                field: name,
            };

            const type = types[name];
            if (type == 'Int32' || type == 'Decimal') {
                 def.type = 'numericColumn';
            }
            else if (name.includes('Time')) {
                def.type = 'dateColumn';
                def.width = 200;
            }
            return def;
        })
        .ToArray();

    gridOptions.defaultColDef = defaultColDef;
    gridOptions.columnTypes = columnTypes;
    gridOptions.columnDefs = columnDefs;
};

export default {
    buildGridOptions
};