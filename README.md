# Vahana Supply Co - Modern Marketing Website & Logistics Platform

A high-performance, fully responsive, modern multi-page marketing website and supply chain portal built for **Vahana Supply Co**, a B2B express freight and supply chain company serving MSMEs and enterprise businesses across India.

---

## 🚀 How to Run the Website Locally

You can launch the included lightweight Node.js server immediately:

```bash
# In PowerShell / Command Prompt inside the project directory:
agy-node server.js
```

Or if you have Node.js / npx installed:
```bash
node server.js
# Or using any static server:
npx serve .
# Or Python:
python -m http.server 3000
```

Then open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 📁 Project Architecture & Clean Folder Structure

```
vahana-supply-co/
├── index.html              # Home: Hero, stats, live tracking bar, services overview, why us, testimonials, CTA
├── about.html              # About: Our story, mission/vision, core values, leadership team, infrastructure stats
├── services.html           # Services: 6 service cards, fleet specs, interactive rate & transit estimator
├── contact.html            # Contact: Validated quote & inquiry form, hub directory, styled map, FAQ accordion
├── track.html              # Live Tracking: AWB search, milestone timeline, telematics, printable digital ePOD
├── portal.html             # Shipper Central: KPI metric cards, consignments table, CSV export, booking modal
├── api-docs.html           # Developer API Explorer: Interactive REST & GraphQL query console
├── server.js               # Zero-dependency local HTTP static server + REST/GraphQL engine
├── vercel.json             # Vercel deployment configuration with serverless route rewrites
├── netlify.toml            # Netlify deployment configuration with clean URL redirects
├── Dockerfile              # Production-grade Node.js Alpine container specification
├── docker-compose.yml      # 1-command Docker service orchestration with data volume persistence
├── package.json            # npm metadata, startup scripts, and engine specifications
├── DEPLOYMENT.md           # Step-by-step production hosting guide (Vercel, Netlify, GH Pages, Docker)
├── .github/workflows/      # Automated CI/CD workflow for GitHub Pages deployment
├── data/
│   ├── seed-data.json      # Initial seed dataset for shipments, consignments, and inquiries
│   └── database.json       # Live persistent JSON database store
├── css/
│   └── custom.css          # Design system styling, dark mode rules, glassmorphism nav, print styles
├── js/
│   ├── main.js             # Shared sticky header, dark/light theme switcher, drawer, tracking/quote modals
│   ├── services.js         # Interactive freight rate and transit ETA calculator
│   ├── contact.js          # Real-time contact form validation (+91 phone check, reference ticket generation)
│   ├── track.js            # Consignment lookup engine, milestone progress bar, ePOD generator
│   └── portal.js           # Shipper Central dashboard state, filters, booking simulator, CSV export
└── README.md               # Architecture documentation, asset replacement guide, and run instructions
```

---

## 🎨 Design System & Palette

- **Primary Colors:** Deep Navy / Slate (`#0F172A`, `#1E3A8A`) — represents corporate stability and trust.
- **Accent / Energy:** Vivid Logistics Orange (`#F97316`, `#EA580C`) — represents speed, dispatch, and motion.
- **Neutral Light:** Clean Slate 50 (`#F8FAFC`), Pure White (`#FFFFFF`), Soft Borders (`#E2E8F0`).
- **Dark Mode Support:** Full dark mode with persistent user preference (`localStorage`), Sun/Moon toggle in navbar and drawer.
- **Typography:**
  - **Headings:** `Poppins` (Bold 700 / SemiBold 600) via Google Fonts.
  - **Body / UI:** `Inter` (Regular 400 / Medium 500) via Google Fonts.
- **Responsiveness Tested:**
  - Mobile: `375px` (Full-width cards, touch targets >= 48px, off-canvas drawer).
  - Tablet: `768px` (Balanced 2-column grids).
  - Desktop: `1440px` (Max width 1280px container, sticky glassmorphic navigation).

---

## 📄 Pages Included

1. **Home (`index.html`)**:
   - Hero section with high-impact value proposition
   - Interactive Consignment Tracking input (AWB simulator with real-time waypoint modal)
   - Trust metrics: 19,000+ pin codes, 99.4% on-time SLA, 5,000+ MSME clients
   - 4-card Services Overview
   - Why Choose Us (4 pillars: Pan-India network, zero hidden fees, live ePOD, dedicated account manager)
   - Real testimonials from Indian manufacturers and D2C brands
   - Final high-converting CTA banner
2. **About Us (`about.html`)**:
   - Founding story & milestone timeline (2021 to 2026)
   - Mission and Vision statements
   - 4 Core Values: Reliability, Transparent Invoicing, Driver Dignity, Tech for Human Ease
   - Leadership & Operations Team profiles with bios and LinkedIn links
   - Physical infrastructure stats (45 hubs, 1,200+ fleet, 150k sq.ft warehousing)
3. **Services (`services.html`)**:
   - 6 detailed logistics services:
     1. Express B2B Surface (PTL)
     2. Full Truckload (FTL) Pan-India
     3. Warehousing & 3PL Fulfillment
     4. Cold Chain & Pharma Freight
     5. Hyperlocal Urban B2B Dispatch
     6. Reverse Logistics & Returns
   - **Interactive Rate & Transit Estimator**: Select origin hub, destination hub, cargo weight, and speed tier to calculate instant indicative pricing and delivery SLA.
   - Fleet specifications (14ft, 24ft, 32ft MXL containers) and safety standards.
4. **Contact Us (`contact.html`)**:
   - Interactive Inquiry Form with client-side validation (Name, Email, 10-digit Indian phone format check, Service, Volume, Message)
   - Ticket reference generator upon submission
   - Direct helpline channels: 1800-266-9900 (Toll-Free), WhatsApp desk, Email
   - Regional operating hub directory (Gurugram HQ, Mumbai Bhiwandi, Bengaluru Peenya, Kolkata Dankuni)
   - Interactive styled GIS map visualization with radar pulses
   - 4 expandable FAQ accordion items
5. **Live Tracking & Digital ePOD (`track.html`)**:
   - Search by Waybill / Consignment Note / Order Ref
   - Quick-load sample AWBs (`NX-IND-99218`, `NX-SUR-40812`, `NX-DEL-88102`)
   - Complete milestone audit trail from pickup to delivery
   - Live IoT Telematics box (ambient temperature, GPS location, speed, battery)
   - View & Print official Electronic Proof of Delivery (ePOD) receipt with digital consignee signature
6. **Shipper Central Portal (`portal.html`)**:
   - 4 live KPI metric cards (Active Shipments, Delivered This Month, In-Transit Value, Exceptions)
   - Searchable and filterable consignments data table (All, In-Transit, Out for Delivery, Delivered)
   - Instant "Export Manifest (CSV)" download button
   - Modal to book new express consignments with validation and immediate table insertion

---

## 🔌 Live REST & GraphQL API Reference

The Node.js server (`server.js`) includes a zero-dependency REST & GraphQL API layer with persistent JSON storage:

### 1. Health Check
- **Endpoint:** `GET /api/health`
- **Response:**
  ```json
  {
    "status": "healthy",
    "service": "Vahana Supply Co Express API",
    "version": "2.5.0",
    "uptimeSeconds": 142
  }
  ```

### 2. Live Consignment Tracking
- **Endpoint:** `GET /api/track?awb=NX-IND-99218`
- **Response:**
  ```json
  {
    "success": true,
    "awb": "NX-IND-99218",
    "shipment": {
      "status": "In Transit",
      "origin": "Bhiwandi Hub, Mumbai (MH)",
      "destination": "Peenya Hub, Bengaluru (KA)",
      "progress": 72,
      "telematics": { "speedKmh": 62, "temperature": "Ambient (26.4°C)", "gpsLat": "18.5204° N" },
      "milestones": [ ... ]
    }
  }
  ```

### 3. Shipper Consignments Manifest
- **Endpoint:** `GET /api/consignments?status=in-transit&q=Mumbai`
- **Response:**
  ```json
  {
    "success": true,
    "totalCount": 15,
    "filteredCount": 4,
    "consignments": [ ... ]
  }
  ```

### 4. Book New Consignment
- **Endpoint:** `POST /api/consignments`
- **Payload:**
  ```json
  {
    "origin": "Peenya (KA)",
    "dest": "Bhiwandi (MH)",
    "consignee": "Apex FabTex Mills",
    "service": "Full Truckload (FTL)",
    "pkgs": "32ft Container",
    "weight": "9200"
  }
  ```
- **Response:** `201 Created` with generated AWB and trackable record in `data/database.json`.

### 5. Freight Rate & Transit Time Estimator
- **Endpoint:** `POST /api/estimate`
- **Payload:**
  ```json
  {
    "origin": "Mumbai",
    "destination": "Delhi",
    "weight": 250,
    "tier": "express"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "calculation": {
      "distanceKm": 1420,
      "slaText": "24 - 48 Hours",
      "estimatedTransitHours": 30,
      "costs": {
        "baseFreightInr": 4225,
        "docketFeeInr": 250,
        "fuelSurchargeInr": 507,
        "gst18Inr": 897,
        "totalEstimatedInr": 5879
      }
    }
  }
  ```

### 6. Contact & Quote Inquiries
- **Endpoint:** `POST /api/contact`
- **Payload:**
  ```json
  {
    "name": "Rajesh Verma",
    "email": "rajesh@vermatex.com",
    "phone": "9820011223",
    "service": "Express Surface (PTL)",
    "volume": "2000 kg / month",
    "message": "We require weekly bulk dispatches from Bhiwandi to Peenya Bengaluru."
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "ticketId": "NX-821570",
    "message": "Inquiry received. A dedicated Key Account Manager will contact you within 15 minutes."
  }
  ```

### 7. Zero-Dependency GraphQL Query Endpoint
- **Endpoint:** `POST /api/graphql`
- **Payload:**
  ```json
  {
    "query": "query { tracking(awb: \"NX-IND-99218\") { awb status origin destination progress } stats { activeCount deliveredCount } }"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "tracking": {
        "awb": "NX-IND-99218",
        "status": "In Transit",
        "origin": "Bhiwandi Hub, Mumbai (MH)",
        "destination": "Peenya Hub, Bengaluru (KA)",
        "progress": 72
      },
      "stats": {
        "activeCount": 13,
        "deliveredCount": 2
      }
    }
  }
  ```

---

## 🏷️ Asset Customization Guide (Replacing Placeholders)

Every placeholder has been labeled with `.img-placeholder-tag` or standard semantic markup:

1. **Brand Logo:** Replace `<div class="w-10 h-10 rounded-xl bg-gradient-to-tr ...">` in the header of each HTML page with your SVG or PNG company logo.
2. **Team Member Photos:** Replace the initials avatar in `about.html` (`<div class="relative w-28 h-28 mx-auto ...">`) with `<img src="assets/images/team-member.jpg" alt="Member Name" class="w-28 h-28 rounded-2xl object-cover">`.
3. **Database & Storage:** The server automatically creates and maintains `data/database.json`. You can inspect or clear it at any time to reset to seed data.
4. **Map:** In `contact.html`, you can replace the stylized SVG container with an embedded Google Maps / Mapbox `<iframe>` using your verified Google Business profile.
