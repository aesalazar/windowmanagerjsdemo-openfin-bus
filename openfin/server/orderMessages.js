const fs = require('fs');
const path = require('path');

//Load from csv
const messages = fs.readFileSync(
    path.join(__dirname, "order_messages_demo.csv"),
    { encoding: "utf-8" }
).split(/[\r\n]+/g);

//Pop the header row and parse
const fieldsNames = [];
const fieldTypes = {};
messages
    .shift()
    .split(",")
    .forEach(field => {
        const parts = field.split(":");
        fieldsNames.push(parts[0]);
        fieldTypes[parts[0]] = parts[1];
    });

//Determine indexable fields
const indexFields = Object
    .keys(fieldTypes)
    .filter((field) => {
        return fieldTypes[field] !== "String";
    });

module.exports = {
    /** Message Field Names */
    fieldsNames,
    
    /** Message Field Types mapped by Field Name */
    fieldTypes,
    
    /** Indexable (non-string) fields */
    indexFields,
    
    /** Order Messages */
    messages
}