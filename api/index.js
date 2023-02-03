import express from 'express';
import cors    from 'cors';
import request from 'request'

function parseProxyParameters(proxyRequest){
  const params = {}
  // url - treat everything right to url= query parameter as target url value
  const urlMatch = proxyRequest.url.match(/(?<=[?&])url=(?<url>.*)$/)
  if(urlMatch) {
    params.url =  decodeURIComponent(urlMatch.groups.url)
  }
  
  return params
}

const app = express();
app.use(cors());
app.set('json spaces', 2)
app.all('/*', async (req, res) => {
  try {
    const proxyParams = parseProxyParameters(req)
    if(!proxyParams.url) {
      return res.status(400).json({
        "title": "CORS Proxy Error - Required parameter is missing",
        "detail": "The parameter: url was not provided",
      }) 
    }
    
    // proxy request to target url
res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern; but there might not be origin (for instance call from browser)
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
    
  } catch(err) { 
    console.error(err)
    return res.status(500).json({
      "title": "CORS Proxy Error - Internal server error",
      "detail": err.message,
    }) 
  }
})

export default app;
