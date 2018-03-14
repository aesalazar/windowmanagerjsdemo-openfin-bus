const assert = require('chai').assert;
const Enumerable = require('linq-es2015');
const columnDefinitions = require('./columnDefinitions');

describe('***** columnDefinitions.js *****', () => {
    const gridOptions = {};
    let names;
    let types;
    let indexable;

    beforeEach(() => {
        names = [
            'field1Str',
            'field2Int',
            'field3Dec',
            'field4DateTime',
        ];

        types = {
            'field1Str': 'String',
            'field2Int': 'Int32',
            'field3Dec': 'Decimal',
            'field4DateTime': '2016-08-09T17:35:42.777Z',
        };

        indexable = [
            'field2Int',
            'field3Dec'
        ];
        
        columnDefinitions
            .default
            .buildGridOptions(
                names,
                types,
                indexable,
                gridOptions
            );
    });

    it('default column definition is present', () => {
        assert.isNotNull(gridOptions.defaultColDef);
        assert.isObject(gridOptions.defaultColDef);
    });

    it('column types is present', () => {
        assert.isNotNull(gridOptions.columnTypes);
        assert.isObject(gridOptions.columnTypes);
    });

    it('column definitions is present', () => {
        assert.isNotNull(gridOptions.columnDefs);
        assert.isArray(gridOptions.columnDefs);
    });

    it('column definitions for strings is present', () => {
        const def = Enumerable
            .from(gridOptions.columnDefs)
            .FirstOrDefault(d => d.field === names[0]);
        
        assert.isNotNull(def);
        assert.isUndefined(def.type);
    });

    it('column definitions for Int32 is present', () => {
        const def = Enumerable
            .from(gridOptions.columnDefs)
            .FirstOrDefault(d => d.field === names[1]);

        assert.isNotNull(def);
        assert.equal(def.type, 'numberColumn');
    });

    it('column definitions for Decimal is present', () => {
        const def = Enumerable
            .from(gridOptions.columnDefs)
            .FirstOrDefault(d => d.field === names[2]);

        assert.isNotNull(def);
        assert.equal(def.type, 'numberColumn');
    });

    it('column definitions for Time is present', () => {
        const def = Enumerable
            .from(gridOptions.columnDefs)
            .FirstOrDefault(d => d.field === names[3]);

        assert.isNotNull(def);
        assert.equal(def.type, 'dateColumn');
    });
});