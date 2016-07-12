import sinon from 'sinon';

beforeEach(() => {
    global.sinon = sinon.sandbox.create();
});

afterEach(() => {
    global.sinon.restore();

    delete global.sinon;
});