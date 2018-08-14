import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import fastJsonPatch from 'fast-json-patch';

export default function expressJsonData({ data = {}, limit, type = [ 'application/json', 'application/json-patch+json' ] } = {}) {
    function getData(path) {
        // See https://github.com/Starcounter-Jack/JSON-Patch/issues/66
        let pointer = { op: '_get', path };

        fastJsonPatch.applyOperation(data, pointer);

        return pointer.value;
    }

    function clearData() {
        Object.keys(data).forEach(key => delete data[key]);
    }

    return express.Router()
        .get('/', (req, res) => {
            return res.json(data);
        })
        .get('/*', (req, res) => {
            let value = getData(req.path);
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
            if (getData(req.path) === undefined) {
                return res.status(404).end();
            }

            fastJsonPatch.applyOperation(data, { op: 'remove', path: req.path });

            return res.status(204).end();
        })
        .use(bodyParser.json({ limit, type }))
        .put('/', (req, res) => {
            clearData();

            _.merge(data, req.body);

            return res.status(201).json(data);
        })
        .put('/*', (req, res) => {
            fastJsonPatch.applyOperation(data, { op: 'replace', path: req.path, value: req.body });

            return res.status(201).json(req.body);
        })
        .post('/', (req, res) => {
            _.merge(data, req.body);

            return res.status(201).json(data);
        })
        .post('/*', (req, res) => {
            let value = _.merge({}, getData(req.path), req.body);

            fastJsonPatch.applyOperation(data, { op: 'replace', path: req.path, value });

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
            let value = getData(req.path);
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