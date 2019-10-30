"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
function schemaType(x) {
    if (lodash_1.default.isInteger(x)) {
        return 'number';
    }
    if (lodash_1.default.isNumber(x)) {
        return 'double';
    }
    if (lodash_1.default.isArray(x)) {
        return 'array';
    }
    if (lodash_1.default.isObject(x)) {
        return 'struct';
    }
    if (lodash_1.default.isString(x)) {
        return 'string';
    }
}
const json = {
    audits: {
        items: [
            {
                name: "tti",
                value: "200",
                numericValue: 200,
                rawValue: 200.20
            }
        ]
    },
    url: 'test',
};
const indent = (count) => Array(count).fill('  ').join('');
const createLogger = lodash_1.default.curry((key, type, value) => key ? `${key} ${type}<${value}>` : value);
function parseList(data, key) {
    const value = lodash_1.default.head(data);
    const type = schemaType(value);
    const log = createLogger(key, type);
    if (type === 'struct') {
        return log(parseStruct(value, key));
    }
    if (type === 'array') {
        return log(parseList(value, key));
    }
    return `${key} ${type}, \n`;
}
function parseStruct(data, key = '') {
    const keys = Object.keys(data);
    if (keys.length === 0) {
        return '';
    }
    return keys.map((x) => {
        const value = data[x];
        const type = schemaType(value);
        const log = createLogger(key, type);
        if (type === 'struct') {
            return log(parseStruct(value, x));
        }
        if (type === 'array') {
            return log(parseList(value, x));
        }
        return `${x} ${type}`;
    }).join(', ');
}
function parseJSON(data) {
    return Object.keys(data).map((key) => {
        const value = data[key];
        const type = schemaType(value);
        const log = createLogger(key, type);
        if (type === 'struct') {
            return log(parseStruct(value));
        }
        if (type === 'array') {
            return log(parseList(value, key));
        }
        return `${key} ${type}`;
    }).join(',\n');
}
console.log(parseJSON(json));
//# sourceMappingURL=index.js.map