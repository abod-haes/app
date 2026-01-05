// Vercel Serverless Function to proxy API requests
// This avoids mixed-content issues by proxying HTTP requests through HTTPS

export default async function handler(req, res) {
  // Enable CORS - Allow all origins
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept, X-Requested-With"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Get the path from query parameters
  const pathSegments = req.query.path || [];
  const apiPath = Array.isArray(pathSegments)
    ? pathSegments.join("/")
    : pathSegments;

  // Build the target URL
  const targetUrl = `http://wasel2.somee.com/api/${apiPath}`;

  // Extract query parameters (excluding 'path')
  const queryParams = new URLSearchParams();
  Object.keys(req.query).forEach((key) => {
    if (key !== "path") {
      if (Array.isArray(req.query[key])) {
        req.query[key].forEach((val) => queryParams.append(key, val));
      } else {
        queryParams.append(key, req.query[key]);
      }
    }
  });

  const queryString = queryParams.toString();
  const url = queryString ? `${targetUrl}?${queryString}` : targetUrl;

  try {
    // Prepare headers - forward all important headers
    const headers = {};

    // Forward Content-Type
    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    } else {
      headers["Content-Type"] = "application/json";
    }

    // Forward Authorization header if present
    if (req.headers["authorization"]) {
      headers["Authorization"] = req.headers["authorization"];
    }

    // Forward Accept header if present
    if (req.headers["accept"]) {
      headers["Accept"] = req.headers["accept"];
    }

    // Forward any other custom headers
    Object.keys(req.headers).forEach((key) => {
      const lowerKey = key.toLowerCase();
      if (
        ![
          "host",
          "connection",
          "content-length",
          "user-agent",
          "referer",
        ].includes(lowerKey)
      ) {
        if (!headers[key] && req.headers[key]) {
          headers[key] = req.headers[key];
        }
      }
    });

    // Prepare body for non-GET requests
    let body;
    if (req.method !== "GET" && req.method !== "HEAD") {
      if (req.body) {
        body =
          typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      }
    }

    // Forward the request to the API
    const response = await fetch(url, {
      method: req.method,
      headers,
      body,
    });

    // Get response data
    const contentType = response.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }
    } else {
      data = await response.text();
    }

    // Set CORS headers in response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // Forward response headers (excluding problematic ones)
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        ![
          "content-encoding",
          "transfer-encoding",
          "connection",
          "host",
          "access-control-allow-origin",
        ].includes(lowerKey)
      ) {
        res.setHeader(key, value);
      }
    });

    // Send response
    res.status(response.status);

    if (typeof data === "string") {
      res.send(data);
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(500).json({
      error: "Proxy error",
      message: error.message,
    });
  }
}
