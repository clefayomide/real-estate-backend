"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateError = void 0;
const populateError = (error) => {
    const errorArray = [];
    error.forEach((error) => {
        errorArray.push(error.msg);
    });
    return errorArray;
};
exports.populateError = populateError;
