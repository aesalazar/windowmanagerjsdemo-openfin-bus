const fs = require('fs');
const path = require('path');
const messageData = require('./orderMessagesData');

//Parse the header row to get name and types
const fieldsNames = [];
const fieldTypes = {};

messageData.header
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

//Build the order objects
const orders = [];
messageData.orders
    .forEach(field => {
        const parts = field.split(",");
        const order = {};
        
        parts.forEach((v, i) => order[fieldsNames[i]] = v);
        orders.push(order);
    });

module.exports = {
    /** Message Field Names */
    fieldsNames,

    /** Message Field Types mapped by Field Name */
    fieldTypes,

    /** Indexable (non-string) fields */
    indexFields,

    /** Order objects */
    orders,

    /** Raw order messages as strings */
    messages: messageData.orders,
};