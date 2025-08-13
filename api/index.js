import express from 'express';
import * as http from "node:http";
import * as https from "node:https";

const app = express();

app.all('/', async (req, res) => {
    const targetParams = parseTargetParameters(req);
    if (!targetParams.url) {
        res.status(400).send("query parameter 'url' is required");
        return;
    }

    const targetReqUrl = targetParams.url;
    const targetReqHandler = (targetRes) => {
        res.status(targetRes.statusCode)

        res.setHeaders(new Map(Object.entries(targetRes.headersDistinct)));
        // set CORS headers
        res.setHeader('origin', '*');
        res.setHeader('access-control-allow-origin', '*');
        res.setHeader('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
        // remove CORP headers
        res.removeHeader('cross-origin-resource-policy');
        res.removeHeader('content-security-policy');
        res.removeHeader('content-security-policy-report-only');
        res.removeHeader('reporting-endpoints');
        res.removeHeader('report-to');

        targetRes.on('data', (chunk) => res.write(chunk));
        targetRes.on('end', () => res.end());
        targetRes.on('error', (err) => res.destroy(err));
    };
    const targetReq = request(targetReqUrl, {method: req.method}, targetReqHandler);
    targetReq.setHeaders(new Map(Object.entries(req.headersDistinct)
        .filter(([name]) => !name.startsWith('x-vercel-'))));
    targetReq.setHeader('host', targetReqUrl.host);
    if (req.body) {
        targetReq.write(req.body);
    }
    targetReq.end();
})

function request(url, options = {}, callback) {
    const httpModule = url.protocol === 'https:' ? https : http;
    return httpModule.request(url, options, callback);
}

function parseTargetParameters(proxyRequest) {
    const params = {}
    // url - treat everything right to url= query parameter as target url value
    const urlMatch = proxyRequest.url.match(/(?<=[?&])url=(?<url>.*)$/);
    if (urlMatch) {
        params.url = new URL(decodeURIComponent(urlMatch.groups.url));
    }

    return params;
}

export default app;