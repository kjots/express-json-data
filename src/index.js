import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import fastJsonPatch from 'fast-json-patch';

export default function expressJsonData({ data = {}, limit, type = [ 'application/json', 'application/json-patch+json' ] } = {}) {
    function getData(path) {
        // See https://github.com/Starcounter-Jack/JSON-Patch/issues/66
        let pointer = { op: '_get', path };

        fastJsonPatch.apply(data, [ pointer ]);

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
            fastJsonPatch.apply(data, [{ op: 'remove', path: req.path }]);

            return res.status(204).end();
        })
        .use(bodyParser.json({ limit, type }))
        .put('/', (req, res) => {
            clearData();

            _.merge(data, req.body);

            return res.status(201).json(data);
        })
        .put('/*', (req, res) => {
            fastJsonPatch.apply(data, [{ op: 'replace', path: req.path, value: req.body }]);

            return res.status(201).json(req.body);
        })
        .post('/', (req, res) => {
            _.merge(data, req.body);

            return res.status(201).json(data);
        })
        .post('/*', (req, res) => {
            let value = _.merge({}, getData(req.path), req.body);

            fastJsonPatch.apply(data, [{ op: 'replace', path: req.path, value }]);

            return res.status(201).json(value);
        })
        .patch('/', (req, res) => {
            fastJsonPatch.apply(data, Array.isArray(req.body) ? req.body : [ req.body ]);

            return res.status(201).json(data);
        })
        .patch('/*', (req, res) => {
            let value = getData(req.path);
            if (value === undefined) {
                return res.status(404).end();
            }

            fastJsonPatch.apply(value, Array.isArray(req.body) ? req.body : [ req.body ]);

            return res.status(201).json(value);
        });
}