import nodeMocksHttp from 'node-mocks-http';
import sinon from 'sinon';

import expressJsonData from './index.js';

describe('expressJsonData()', () => {
    let data;

    beforeEach(() => {
        data = { testItem: { testItemKey: 'Test Item Value' } };
    });

    context('on GET /', () => {
        it('should respond with the data', () => {
            // Given
            let req = nodeMocksHttp.createRequest({ method: 'GET', url: '/' });
            let res = nodeMocksHttp.createResponse();

            sinon.spy(res, 'json');

            // When
            expressJsonData({ data })(req, res);

            // Then
            expect(res.json).to.have.been.calledWith({ testItem: { testItemKey: 'Test Item Value' } });
        });
    });

    context('on GET /*', () => {
        context('when the data item exists', () => {
            it('should respond with the data item', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'GET', url: '/testItem' });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'json');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(res.json).to.have.been.calledWith({ testItemKey: 'Test Item Value' });
            });
        });

        context('when the data item does not exist', () => {
            it('should respond with HTTP 404 Not Found', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'GET', url: '/notTestItem' });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'status');
                sinon.spy(res, 'end');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(res.status).to.have.been.calledWith(404);
                expect(res.end).to.have.been.called;
            });
        });
    });

    context('on DELETE /', () => {
        it('should remove the data', () => {
            // Given
            let req = nodeMocksHttp.createRequest({ method: 'DELETE', url: '/' });
            let res = nodeMocksHttp.createResponse();

            sinon.spy(res, 'status');
            sinon.spy(res, 'end');

            // When
            expressJsonData({ data })(req, res);

            // Then
            expect(data).to.eql({});

            expect(res.status).to.have.been.calledWith(204);
            expect(res.end).to.have.been.called;
        });
    });

    context('on DELETE /*', () => {
        context('when the data item exists', () => {
            it('should remove the data item', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'DELETE', url: '/testItem' });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'status');
                sinon.spy(res, 'end');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(data).to.eql({});

                expect(res.status).to.have.been.calledWith(204);
                expect(res.end).to.have.been.called;
            });
        });

        context('when the data item does not exist', () => {
            it('should respond with HTTP 404 Not Found', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'DELETE', url: '/notTestItem' });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'status');
                sinon.spy(res, 'end');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(res.status).to.have.been.calledWith(404);
                expect(res.end).to.have.been.called;
            });
        });
    });

    context('on PUT /', () => {
        it('should replace the data with the request data', () => {
            // Given
            let req = nodeMocksHttp.createRequest({ method: 'PUT', url: '/', body: { newTestItem: { newTestItemKey: 'New Test Item Value' } } });
            let res = nodeMocksHttp.createResponse();

            sinon.spy(res, 'status');
            sinon.spy(res, 'json');

            // When
            expressJsonData({ data })(req, res);

            // Then
            expect(data).to.eql({ newTestItem: { newTestItemKey: 'New Test Item Value' } });

            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({ newTestItem: { newTestItemKey: 'New Test Item Value' } });
        });
    });

    context('on PUT /*', () => {
        it('should replace the data item with the request data', () => {
            // Given
            let req = nodeMocksHttp.createRequest({ method: 'PUT', url: '/testItem', body: { newTestItemKey: 'New Test Item Value' } });
            let res = nodeMocksHttp.createResponse();

            sinon.spy(res, 'status');
            sinon.spy(res, 'json');

            // When
            expressJsonData({ data })(req, res);

            // Then
            expect(data).to.eql({ testItem: { newTestItemKey: 'New Test Item Value' } });

            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({ newTestItemKey: 'New Test Item Value' });
        });
    });

    context('on POST /', () => {
        it('should merge the request data into the data', () => {
            // Given
            let req = nodeMocksHttp.createRequest({ method: 'POST', url: '/', body: { newTestItem: { newTestItemKey: 'New Test Item Value' } } });
            let res = nodeMocksHttp.createResponse();

            sinon.spy(res, 'status');
            sinon.spy(res, 'json');

            // When
            expressJsonData({ data })(req, res);

            // Then
            expect(data).to.eql({ testItem: { testItemKey: 'Test Item Value' }, newTestItem: { newTestItemKey: 'New Test Item Value' } });

            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({ testItem: { testItemKey: 'Test Item Value' }, newTestItem: { newTestItemKey: 'New Test Item Value' } });
        });
    });

    context('on POST /*', () => {
        it('should merge the request data into the data item', () => {
            // Given
            let req = nodeMocksHttp.createRequest({ method: 'POST', url: '/testItem', body: { newTestItemKey: 'New Test Item Value' } });
            let res = nodeMocksHttp.createResponse();

            sinon.spy(res, 'status');
            sinon.spy(res, 'json');

            // When
            expressJsonData({ data })(req, res);

            // Then
            expect(data).to.eql({ testItem: { testItemKey: 'Test Item Value', newTestItemKey: 'New Test Item Value' } });

            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith({ testItemKey: 'Test Item Value', newTestItemKey: 'New Test Item Value' });
        });
    });
    
    context('on PATCH /', () => {
        context('when the request body is an object', () => {
            it('should apply the request body to the data as a JSON Patch', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'PATCH', url: '/', body: { op: 'replace', path: '/testItem', value: { newTestItemKey: 'New Test Item Value' } } });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'status');
                sinon.spy(res, 'json');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(data).to.eql({ testItem: { newTestItemKey: 'New Test Item Value' } });

                expect(res.status).to.have.been.calledWith(201);
                expect(res.json).to.have.been.calledWith({ testItem: { newTestItemKey: 'New Test Item Value' } });
            });
        });

        context('when the request body is an array', () => {
            it('should apply the request body to the data as a JSON Patch', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'PATCH', url: '/', body: [{ op: 'replace', path: '/testItem', value: { newTestItemKey: 'New Test Item Value' } }] });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'status');
                sinon.spy(res, 'json');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(data).to.eql({ testItem: { newTestItemKey: 'New Test Item Value' } });

                expect(res.status).to.have.been.calledWith(201);
                expect(res.json).to.have.been.calledWith({ testItem: { newTestItemKey: 'New Test Item Value' } });
            });
        });
    });

    context('on PATCH /*', () => {
        context('when the data item exists', () => {
            context('when the request body is an object', () => {
                it('should apply the request body to the data item as a JSON Patch', () => {
                    // Given
                    let req = nodeMocksHttp.createRequest({ method: 'PATCH', url: '/testItem', body: { op: 'replace', path: '/testItemKey', value: 'New Test Item Value' } });
                    let res = nodeMocksHttp.createResponse();

                    sinon.spy(res, 'status');
                    sinon.spy(res, 'json');

                    // When
                    expressJsonData({ data })(req, res);

                    // Then
                    expect(data).to.eql({ testItem: { testItemKey: 'New Test Item Value' } });

                    expect(res.status).to.have.been.calledWith(201);
                    expect(res.json).to.have.been.calledWith({ testItemKey: 'New Test Item Value' });
                });
            });

            context('when the request body is an array', () => {
                it('should apply the request body to the data item as a JSON Patch', () => {
                    // Given
                    let req = nodeMocksHttp.createRequest({ method: 'PATCH', url: '/testItem', body: [{ op: 'replace', path: '/testItemKey', value: 'New Test Item Value' }] });
                    let res = nodeMocksHttp.createResponse();

                    sinon.spy(res, 'status');
                    sinon.spy(res, 'json');

                    // When
                    expressJsonData({ data })(req, res);

                    // Then
                    expect(data).to.eql({ testItem: { testItemKey: 'New Test Item Value' } });

                    expect(res.status).to.have.been.calledWith(201);
                    expect(res.json).to.have.been.calledWith({ testItemKey: 'New Test Item Value' });
                });
            });
        });

        context('when the data item does not exist', () => {
            it('should respond with HTTP 404 Not Found', () => {
                // Given
                let req = nodeMocksHttp.createRequest({ method: 'PATCH', url: '/notTestItem' });
                let res = nodeMocksHttp.createResponse();

                sinon.spy(res, 'status');
                sinon.spy(res, 'end');

                // When
                expressJsonData({ data })(req, res);

                // Then
                expect(res.status).to.have.been.calledWith(404);
                expect(res.end).to.have.been.called;
            });
        });
    });
});