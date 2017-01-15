# express-json-data

### DEPRECATED

**This package has been deprecated.**

**Use [@kjots/express-json-data](https://www.npmjs.com/package/@kjots/express-json-data) instead.**

[![Build Status](https://travis-ci.org/kjots/express-json-data.svg?branch=master)](https://travis-ci.org/kjots/express-json-data)
[![npm version](https://badge.fury.io/js/express-json-data.svg)](https://www.npmjs.com/package/express-json-data)

> A JSON data object Express router with PATCH support.

## Installation

```shell
npm install --save express-json-data
```

## Usage

### As an ES6 module

```js
import express from 'express';
import expressJsonData from 'express-json-data';

let data = {};

let app = express()
    .use('/data', expressJsonData({ data }));
```

### As an ES5 module

```js
require('babel-polyfill');

var express = require('express');
var expressJsonData = require('express-json-data').default;

var data = {};

var app = express()
    .use('/data', expressJsonData({ data: data }));
```

## API

### expressJsonData(options)

Create an Express JSON Data router with the provided options.

#### Options

##### data
Type: `Object`

Default: `{}`

The data object upon which the Express JSON Data router will operate.

##### limit
Type: `Number` or `String`

The maximum body size for `PUT`, `POST` and `PATCH` requests.
 
The limit value is passed directly to [bodyParser.json()](https://www.npmjs.com/package/body-parser#limit) without
modification.

##### type
Type: `String` or `Array<String>` or `Function<String, Boolean>`

Default: `[ 'application/json', 'application/json-patch+json' ]`

The supported media types for `PUT`, `POST` and `PATCH` requests.

The type value is passed directly to [bodyParser.json()](https://www.npmjs.com/package/body-parser#type) without
modification.

## HTTP Methods

All of the following HTTP methods may be used with the base URI (e.g. `/data`) or with any path beneath the base URI 
(e.g. `/data/path/to/value`).

If the base URI is used, the HTTP request will operate on the entire data object.
 
If a path beneath the base URI is used, the request path will be treated as a [JSON Pointer](https://tools.ietf.org/html/rfc6901)
to a value within the data object, and the HTTP request will operate on that value only.

### GET

Return the current value of the data object or request path value.

### PUT

Replace the contents of the data object or request path value with the request body.

This method will return the updated value of the data object or request path value.

### POST

Merge the request body into contents of the data object or request path value.

This method uses the [`_.merge`](https://lodash.com/docs#merge) method from [lodash](https://lodash.com/) to merge the 
data, with the request body as the source object. 

This method will return the updated value of the data object or request path value.

### PATCH

Apply the request body as a [JSON Patch](https://tools.ietf.org/html/rfc6902) to the data object or request path value.

This method will accept either an `Array` of JSON patch operations or an `Object` containing a single JSON patch
operation.

This method will return the updated value of the data object or request path value.

### DELETE

Clear the contents of the data object, or remove the request path value from the data object.
