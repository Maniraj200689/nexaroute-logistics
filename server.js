const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'data', 'database.json');
const SEED_FILE = path.join(__dirname, 'data', 'seed-data.json');

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Hub distance matrix (approx road km between major nodes)
const DISTANCES = {
  'Mumbai': { 'Delhi': 1420, 'Bengaluru': 980, 'Kolkata': 1950, 'Chennai': 1330, 'Hyderabad': 710, 'Ahmedabad': 530, 'Pune': 150 },
  'Delhi': { 'Mumbai': 1420, 'Bengaluru': 2180, 'Kolkata': 1530, 'Chennai': 2210, 'Hyderabad': 1580, 'Ahmedabad': 940, 'Pune': 1480 },
  'Bengaluru': { 'Mumbai': 980, 'Delhi': 2180, 'Kolkata': 1870, 'Chennai': 350, 'Hyderabad': 570, 'Ahmedabad': 1500, 'Pune': 840 },
  'Kolkata': { 'Mumbai': 1950, 'Delhi': 1530, 'Bengaluru': 1870, 'Chennai': 1660, 'Hyderabad': 1490, 'Ahmedabad': 2080, 'Pune': 1920 }
};

// In-Memory Database initialized from file
let db = {
  consignments: [],
  shipments: {},
  inquiries: []
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(raw);
    } else if (fs.existsSync(SEED_FILE)) {
      const raw = fs.readFileSync(SEED_FILE, 'utf-8');
      db = JSON.parse(raw);
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
  } catch (err) {
    console.error('Error loading database:', err.message);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving database:', err.message);
  }
}

loadDatabase();

// Helper: send JSON response with CORS
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(payload, null, 2));
}

// Helper: read and parse request JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Malformed JSON'));
      }
    });
    req.on('error', reject);
  });
}

// ==================== API ROUTER ====================
async function handleApiRequest(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // 1. Health check: GET /api/health
  if (pathname === '/api/health' && method === 'GET') {
    return sendJson(res, 200, {
      status: 'healthy',
      service: 'NexaRoute Logistics Express API',
      version: '2.5.0',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  // 2. Tracking: GET /api/track?awb=... or /api/track/:awb
  if (pathname.startsWith('/api/track') && method === 'GET') {
    let awb = parsedUrl.query.awb;
    if (!awb) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 2) awb = parts[2];
    }
    if (!awb) {
      return sendJson(res, 400, { success: false, error: 'Query parameter "awb" is required.' });
    }

    const cleanAwb = decodeURIComponent(awb).trim().toUpperCase();
    const shipment = db.shipments[cleanAwb];

    if (shipment) {
      return sendJson(res, 200, { success: true, awb: cleanAwb, shipment });
    }

    // Dynamic fallback for any valid formatted NexaRoute waybill
    const dynamicShipment = {
      awb: cleanAwb,
      status: 'In Transit',
      headline: `Consignment #${cleanAwb} In Line-Haul Transit`,
      subhead: 'Automated telematics active. Next checkpoint scan expected in ~45 mins.',
      origin: 'Regional Distribution Gateway',
      destination: 'Destination Sorting Center',
      consignor: 'Registered Commercial Shipper',
      consignee: 'Authorized Business Consignee',
      cargo: 'Standard Commercial Line-Haul Freight',
      vehicle: 'NexaRoute Container Fleet (GPS Monitored)',
      ewb: '8810-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
      progress: 60,
      deliveredTime: 'Pending Delivery',
      isDelivered: false,
      telematics: {
        speedKmh: 54,
        temperature: 'Ambient (25.0°C)',
        gpsLat: '19.0760° N',
        gpsLng: '72.8777° E',
        battery: '94%',
        eSealStatus: 'Tamper-Proof Locked'
      },
      milestones: [
        { title: 'Consignment Inwarded', location: 'Origin Gateway Dock', time: 'Yesterday, 18:00', done: true, note: 'Scanned & barcoded' },
        { title: 'Loaded on Container Line-Haul', location: 'Express Corridor Hub', time: 'Today, 04:30', done: true, note: 'Seal intact' },
        { title: 'Passed En-route Highway Toll', location: 'Golden Quadrilateral Inter-state Checkpost', time: 'Today, 11:15', done: true, note: 'Telematics active' },
        { title: 'Expected Destination Hub Inward', location: 'Destination Sortation Center', time: 'Expected Tonight, 22:00', done: false, note: 'Scheduled transit' }
      ]
    };

    return sendJson(res, 200, { success: true, awb: cleanAwb, shipment: dynamicShipment, note: 'Generated dynamic telemetry record.' });
  }

  // 3. Consignments List: GET /api/consignments
  if (pathname === '/api/consignments' && method === 'GET') {
    const statusFilter = (parsedUrl.query.status || 'all').toLowerCase();
    const query = (parsedUrl.query.q || '').toLowerCase();

    let list = db.consignments || [];
    if (statusFilter !== 'all') {
      list = list.filter(item => item.statusClass === statusFilter);
    }
    if (query) {
      list = list.filter(item =>
        item.awb.toLowerCase().includes(query) ||
        item.consignee.toLowerCase().includes(query) ||
        item.origin.toLowerCase().includes(query) ||
        item.dest.toLowerCase().includes(query)
      );
    }

    return sendJson(res, 200, {
      success: true,
      totalCount: db.consignments.length,
      filteredCount: list.length,
      filter: { status: statusFilter, q: query },
      consignments: list
    });
  }

  // 4. Book Consignment: POST /api/consignments
  if (pathname === '/api/consignments' && method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      if (!data.origin || !data.dest || !data.consignee || !data.service) {
        return sendJson(res, 400, {
          success: false,
          error: 'Missing required fields: origin, dest, consignee, and service are required.'
        });
      }

      // Generate realistic AWB prefix based on destination or random letters
      const prefix = data.dest.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'DEL');
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const newAwb = `NX-${prefix}-${randomNum}`;

      const newConsignment = {
        awb: newAwb,
        origin: data.origin,
        dest: data.dest,
        consignee: data.consignee,
        service: data.service,
        pkgs: data.pkgs || '1 Box',
        weight: data.weight ? `${data.weight} kg` : '50 kg',
        status: 'In Transit',
        statusClass: 'in-transit',
        createdAt: new Date().toISOString()
      };

      // Also create matching trackable shipment record
      db.shipments[newAwb] = {
        awb: newAwb,
        status: 'In Transit',
        headline: `Consignment Booked & Dispatched for ${data.dest}`,
        subhead: `Consignee: ${data.consignee} • Weight: ${newConsignment.weight}`,
        origin: data.origin,
        destination: data.dest,
        consignor: 'Apex FabTex Mills (Verified Shipper)',
        consignee: data.consignee,
        cargo: `${newConsignment.pkgs} • ${newConsignment.weight}`,
        vehicle: 'NexaRoute Express Line-Haul',
        ewb: '8820-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
        progress: 15,
        deliveredTime: 'Scheduled',
        isDelivered: false,
        telematics: {
          speedKmh: 45,
          temperature: 'Ambient (25.5°C)',
          gpsLat: '19.0760° N',
          gpsLng: '72.8777° E',
          battery: '100%',
          eSealStatus: 'Tamper-Proof Locked'
        },
        milestones: [
          { title: 'Manifest Created & Docket Assigned', location: data.origin, time: 'Just Now', done: true, note: 'Electronic booking confirmed' },
          { title: 'Inwarded at Origin Sortation Dock', location: `${data.origin} Gateway`, time: 'Scheduled +2 hrs', done: false, note: 'Line-haul staging' },
          { title: 'Line-haul Transit to Destination', location: 'Express Corridor', time: 'Scheduled +12 hrs', done: false, note: 'Interstate transport' },
          { title: 'Out for Final Delivery', location: data.dest, time: 'Target Tomorrow', done: false, note: 'Assigned to delivery pilot' }
        ]
      };

      db.consignments.unshift(newConsignment);
      saveDatabase();

      return sendJson(res, 201, {
        success: true,
        message: 'Consignment successfully booked and manifest generated.',
        consignment: newConsignment
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 5. Contact / Quote Inquiry: POST /api/contact
  if (pathname === '/api/contact' && method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      const errors = [];

      if (!data.name || data.name.trim().length < 2) {
        errors.push('Full name is required (minimum 2 characters).');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email.trim())) {
        errors.push('A valid business email address is required.');
      }
      const cleanPhone = (data.phone || '').replace(/[\s\-\(\)\+]/g, '');
      const isIndianPhone = /^(91)?[6-9]\d{9}$/.test(cleanPhone);
      if (!isIndianPhone && cleanPhone.length < 10) {
        errors.push('A valid 10-digit Indian phone number is required.');
      }
      if (!data.service) {
        errors.push('Service category selection is required.');
      }
      if (!data.message || data.message.trim().length < 10) {
        errors.push('Shipment description must contain at least 10 characters.');
      }

      if (errors.length > 0) {
        return sendJson(res, 422, { success: false, errors });
      }

      const ticketId = 'NX-' + Math.floor(100000 + Math.random() * 900000);
      const inquiryRecord = {
        ticketId,
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        service: data.service,
        volume: data.volume || 'Not specified',
        message: data.message.trim(),
        createdAt: new Date().toISOString(),
        status: 'Open - Assigned to KAM'
      };

      if (!Array.isArray(db.inquiries)) db.inquiries = [];
      db.inquiries.unshift(inquiryRecord);
      saveDatabase();

      return sendJson(res, 200, {
        success: true,
        ticketId,
        message: 'Inquiry received. A dedicated Key Account Manager will contact you within 15 minutes.',
        inquiry: inquiryRecord
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 6. Contact Inquiries List: GET /api/inquiries
  if (pathname === '/api/inquiries' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      count: (db.inquiries || []).length,
      inquiries: db.inquiries || []
    });
  }

  // 7. Tariff & Transit Estimator: POST /api/estimate
  if (pathname === '/api/estimate' && method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      const origin = data.origin || 'Mumbai';
      const destination = data.destination || 'Delhi';
      const weight = parseFloat(data.weight) || 100;
      const tier = data.tier || 'standard'; // standard | express | critical

      let dist = 1200;
      if (DISTANCES[origin] && DISTANCES[origin][destination]) {
        dist = DISTANCES[origin][destination];
      } else if (DISTANCES[destination] && DISTANCES[destination][origin]) {
        dist = DISTANCES[destination][origin];
      }

      // Base rates per kg/km
      const basePerKgPer100Km = 0.85;
      let multiplier = 1.0;
      let transitHours = Math.round((dist / 40) + 8);
      let slaText = '3 - 4 Days';

      if (tier === 'express') {
        multiplier = 1.4;
        transitHours = Math.round((dist / 55) + 4);
        slaText = '24 - 48 Hours';
      } else if (tier === 'critical') {
        multiplier = 2.1;
        transitHours = Math.min(24, Math.round(dist / 65));
        slaText = 'Guaranteed 24 Hours';
      }

      const freightBase = Math.round(weight * (dist / 100) * basePerKgPer100Km * multiplier);
      const docketFee = 250;
      const fuelSurcharge = Math.round(freightBase * 0.12);
      const subtotal = freightBase + docketFee + fuelSurcharge;
      const gst = Math.round(subtotal * 0.18);
      const total = subtotal + gst;

      return sendJson(res, 200, {
        success: true,
        calculation: {
          origin,
          destination,
          distanceKm: dist,
          cargoWeightKg: weight,
          speedTier: tier,
          slaText,
          estimatedTransitHours: transitHours,
          costs: {
            baseFreightInr: freightBase,
            docketFeeInr: docketFee,
            fuelSurchargeInr: fuelSurcharge,
            gst18Inr: gst,
            totalEstimatedInr: total
          }
        }
      });
    } catch (err) {
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // 8. Zero-dependency GraphQL Endpoint: POST /api/graphql
  if (pathname === '/api/graphql' && method === 'POST') {
    try {
      const data = await parseJsonBody(req);
      const query = (data.query || '').trim();

      const responseData = {};

      // Match tracking query
      if (query.includes('tracking')) {
        const awbMatch = query.match(/awb\s*:\s*["']([^"']+)["']/);
        const targetAwb = awbMatch ? awbMatch[1] : 'NX-IND-99218';
        responseData.tracking = db.shipments[targetAwb] || null;
      }

      // Match consignments query
      if (query.includes('consignments')) {
        responseData.consignments = db.consignments;
      }

      // Match dashboard stats query
      if (query.includes('stats')) {
        const active = db.consignments.filter(c => c.status !== 'Delivered').length;
        const delivered = db.consignments.filter(c => c.status === 'Delivered').length;
        responseData.stats = {
          activeCount: active,
          deliveredCount: delivered,
          totalCount: db.consignments.length
        };
      }

      return sendJson(res, 200, {
        data: responseData
      });
    } catch (err) {
      return sendJson(res, 400, { errors: [{ message: err.message }] });
    }
  }

  // 404 for unmatched API routes
  return sendJson(res, 404, {
    success: false,
    error: `API route ${pathname} not found.`
  });
}

// ==================== STATIC HTTP SERVER ====================
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Intercept all API calls
  if (pathname.startsWith('/api/')) {
    return handleApiRequest(req, res, parsedUrl);
  }

  // Handle root URL
  let reqPath = decodeURI(pathname);
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  // Sanitize path to prevent directory traversal
  let safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  // If request has no extension and matches a file or dir, handle smoothly
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>404 Not Found - NexaRoute Logistics</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .box { text-align: center; max-width: 480px; padding: 2rem; background: #1e293b; border-radius: 12px; }
    h1 { color: #f97316; font-size: 3rem; margin: 0 0 1rem; }
    p { color: #94a3b8; line-height: 1.6; }
    a { display: inline-block; margin-top: 1.5rem; background: #f97316; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="box">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page <code>${reqPath}</code> could not be found. Please check the URL or return to home.</p>
    <a href="/index.html">Return to NexaRoute Home</a>
  </div>
</body>
</html>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`NexaRoute Logistics Express API & Server running at http://localhost:${PORT}`);
  });
}

module.exports = server;
