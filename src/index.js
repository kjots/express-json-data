import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import fastJsonPatch from 'fast-json-patch';

export default function expressJsonData({ data = {}, limit, type = [ 'application/json', 'application/json-patch+json' ] } = {}) {
    function clearData() {
        Object.keys(data).forEach(key => delete data[key]);
    }

    function path2pointer(path) {
        return path
            .split('/')
            .map(component => fastJsonPatch.escapePathComponent(decodeURIComponent(component)))
            .join('/');
    }

    function jsonPointerDecoder(req, res, next) {
        req.pointer = path2pointer(req.path);
        next();
    }

    return express.Router()
        .use(jsonPointerDecoder)
        .get('/', (req, res) => {
            return res.json(data);
        })
        .get('/*', (req, res) => {
            let value = fastJsonPatch.getValueByPointer(data, req.pointer);
            if (value === undefined) {
                return res.status(404).end();
            }

            return res.json(value);
        })
        .delete('/', (req, res) => {
            clearData();

            return res.status(204).end();
        })
        .delete('/*', (req, res) => {
            if (fastJsonPatch.getValueByPointer(data, req.pointer) === undefined) {
                return res.status(404).end();
            }

            fastJsonPatch.applyOperation(data, { op: 'remove', path: req.pointer });

            return res.status(204).end();
        })
        .use(bodyParser.json({ limit, type }))
        .put('/', (req, res) => {
            clearData();

            _.merge(data, req.body);

            return res.status(201).json(data);
        })
        .put('/*', (req, res) => {
            fastJsonPatch.applyOperation(data, { op: 'replace', path: req.pointer, value: req.body });

            return res.status(201).json(req.body);
        })
        .post('/', (req, res) => {
            _.merge(data, req.body);

            return res.status(201).json(data);
        })
        .post('/*', (req, res) => {
            let value = _.merge({}, fastJsonPatch.getValueByPointer(data, req.pointer), req.body);

            fastJsonPatch.applyOperation(data, { op: 'replace', path: req.pointer, value });

            return res.status(201).json(value);
        })
        .patch('/', (req, res) => {
            if (Array.isArray(req.body)) {
                fastJsonPatch.applyPatch(data, req.body);
            }
            else {
                fastJsonPatch.applyOperation(data, req.body);
            }

            return res.status(201).json(data);
        })
        .patch('/*', (req, res) => {
            let value = fastJsonPatch.getValueByPointer(data, req.pointer);
            if (value === undefined) {
                return res.status(404).end();
            }

            if (Array.isArray(req.body)) {
                fastJsonPatch.applyPatch(value, req.body);
            }
            else {
                fastJsonPatch.applyOperation(value, req.body);
            }

            return res.status(201).json(value);
        });
}