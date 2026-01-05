// Vercel Serverless Function to proxy API requests
// This avoids mixed-content issues by proxying HTTP requests through HTTPS

export default async function handler(req, res) {
  // Get the path from query parameters
  const pathSegments = req.query.path || [];
  const apiPath = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
  
  // Build the target URL
  const targetUrl = `http://wasel2.somee.com/api/${apiPath}`;
  
  // Extract query parameters (excluding 'path')
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach(key => {
    if (key !== 'path') {
      if (Array.isArray(req.query[key])) {
        req.query[key].forEach(val => queryParams.append(key, val));
      } else {
        queryParams.append(key, req.query[key]);
      }
    }
  });
  
  const queryString = queryParams.toString();
  const url = queryString ? `${targetUrl}?${queryString}` : targetUrl;

  try {
    // Prepare headers
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json',
    };
    
    // Forward Authorization header if present
    if (req.headers['authorization']) {
      headers['Authorization'] = req.headers['authorization'];
    }
    
    // Forward Accept header if present
    if (req.headers['accept']) {
      headers['Accept'] = req.headers['accept'];
    }

    // Prepare body for non-GET requests
    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    }

    // Forward the request to the API
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
    });

    // Get response data
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    
    // Forward response headers (excluding problematic ones)
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['content-encoding', 'transfer-encoding', 'connection', 'host'].includes(lowerKey)) {
        responseHeaders[key] = value;
      }
    });

    // Send response
    res.status(response.status);
    Object.keys(responseHeaders).forEach(key => {
      res.setHeader(key, responseHeaders[key]);
    });
    
    if (typeof data === 'string') {
      res.send(data);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
}

