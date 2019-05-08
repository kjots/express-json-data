import { Router } from 'express-serve-static-core';
import { IncomingMessage } from 'http';

interface Opts {
    data?: any;
    limit?: number | string;
    type?: string | Array<string> | ((req: IncomingMessage) => any);
}

export default function expressJsonData(opts?: Opts): Router;
