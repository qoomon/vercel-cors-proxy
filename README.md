# CORS Proxy Server
Lightweight, CORS-enabled server-less proxy for API requests.

This server is designed to be very simple, light-weight and quick to deploy. "Set it and forget it!"


## How to use
To proxy an API request, simply place the URL of this server *before* the API URL that you wish to proxy, for example:
```
fetch(https://my-proxy-server.app/my-api-url.com?query=this&lookup=that)
```
This proxy server will parse out the trailing URL, including any queries, and then fetch the request for you. When it receives a response, the JSON will be forwarded back to you.

If you have an 'authorization' bearer token set, the proxy server will forward that along as well.

Currently this proxy is only designed to forward 'GET' requests, but it can easy be expanded to forward other methods and headers as well.


## Dependencies
- [cors](https://github.com/expressjs/cors): Handles CORS policy on the headers.
- [express](https://github.com/expressjs/express): Handles the http requests.
- [node-fetch](https://github.com/node-fetch/node-fetch): Node.js implementation of fetch.


## License
This repository is published under the [MIT licesne](LICENSE).
