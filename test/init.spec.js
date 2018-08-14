import sinon from 'sinon';

beforeEach(() => {
    global.sinon = sinon.createSandbox();
});

afterEach(() => {
    global.sinon.restore();

    delete global.sinon;
});