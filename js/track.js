/**
 * NexaRoute Logistics - Dedicated Tracking & ePOD Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const shipmentsData = {
    'NX-IND-99218': {
      awb: 'NX-IND-99218',
      status: 'In Transit',
      headline: 'Scheduled for Delivery: Tomorrow by 11:30 AM',
      subhead: 'Last Checkpoint: Pune Expressway Sortation Hub &bull; 45 mins ago',
      origin: 'Bhiwandi Hub, Mumbai (MH)',
      destination: 'Peenya Hub, Bengaluru (KA)',
      consignor: 'Apex FabTex Mills (Surat)',
      consignee: 'Organica Naturals Hub (Bengaluru)',
      cargo: '14 Cartons &bull; 340 kg Textile Cargo',
      vehicle: 'Ashok Leyland 32ft MXL (HR-55-AJ-9014)',
      ewb: '8819-2041-9921',
      progress: 72,
      deliveredTime: 'Pending Delivery',
      isDelivered: false,
      milestones: [
        { title: 'Consignment Picked Up', location: 'Surat Cluster Dock', time: 'Oct 05, 14:20', done: true, note: 'Weight & volumetric scan certified' },
        { title: 'Arrived at Mumbai Central Gateway', location: 'Bhiwandi Sorting Complex', time: 'Oct 06, 02:15', done: true, note: 'Container sealed & scanned' },
        { title: 'Departed on South Line-Haul', location: 'Pune Expressway Checkpoint', time: 'Oct 06, 08:45', done: true, note: 'Telemetry active @ 62 km/h' },
        { title: 'Inward at Destination Sortation', location: 'Bengaluru Peenya Gateway', time: 'Expected Tonight, 23:00', done: false, note: 'Hub preparation in progress' },
        { title: 'Out for Consignee Delivery', location: 'Peenya Delivery Van Unit', time: 'Expected Tomorrow, 09:00', done: false, note: 'Delivery route optimization' },
        { title: 'Delivered &amp; Signed ePOD', location: 'Organica Naturals Receiving Dock', time: 'Target Oct 07, 11:30', done: false, note: 'Digital signature required' }
      ]
    },
    'NX-SUR-40812': {
      awb: 'NX-SUR-40812',
      status: 'Delivered',
      headline: 'Consignment Delivered Successfully',
      subhead: 'Signed by Receiver: Ramesh Mehra (Dock Supervisor) &bull; Oct 06, 16:45',
      origin: 'Surat Gateway Hub (GJ)',
      destination: 'Okhla Hub, Delhi NCR (DL)',
      consignor: 'Surat Weaves & Garments',
      consignee: 'TrendCraft Retail Distribution',
      cargo: '22 Boxes &bull; 580 kg Garments',
      vehicle: 'Tata 24ft Container (GJ-05-BX-4112)',
      ewb: '4410-9928-1120',
      progress: 100,
      deliveredTime: 'Oct 06, 2026 at 16:45 IST',
      isDelivered: true,
      milestones: [
        { title: 'Consignment Picked Up', location: 'Surat Manufacturing Unit', time: 'Oct 04, 11:00', done: true, note: 'Verified by dispatch agent' },
        { title: 'Departed on Western Corridor', location: 'Vadodara Checkpoint', time: 'Oct 04, 18:30', done: true, note: 'Line-haul transit' },
        { title: 'Passed Jaipur Gateway', location: 'Rajasthan Express Corridor', time: 'Oct 05, 09:15', done: true, note: 'GPS checkpoint verified' },
        { title: 'Arrived at Delhi NCR Gateway', location: 'Gurugram Primary Hub', time: 'Oct 06, 03:00', done: true, note: 'Sortation complete' },
        { title: 'Out for Final Delivery', location: 'Okhla Industrial Feeder Van', time: 'Oct 06, 10:15', done: true, note: 'Assigned to Pilot Vikram K.' },
        { title: 'Delivered &amp; Signed ePOD', location: 'TrendCraft Warehouse, Okhla', time: 'Oct 06, 16:45', done: true, note: 'Received in intact sound condition' }
      ]
    },
    'NX-DEL-88102': {
      awb: 'NX-DEL-88102',
      status: 'Out for Delivery',
      headline: 'Out for Delivery Today by 05:00 PM',
      subhead: 'Pilot: Manoj Kumar (EV Delivery Van DL-1L-AA-3810) &bull; Call: +91 98112 00192',
      origin: 'Gurugram Cyber Hub (HR)',
      destination: 'Noida Sector 63 Logistics Hub (UP)',
      consignor: 'DynoAuto Industrial Components',
      consignee: 'SpeedTech Assemblies Pvt Ltd',
      cargo: '8 Wooden Crates &bull; 210 kg Machine Spares',
      vehicle: 'Electric Commercial Van (DL-1L-AA-3810)',
      ewb: '9901-3829-5512',
      progress: 90,
      deliveredTime: 'Pending Today',
      isDelivered: false,
      milestones: [
        { title: 'Picked up from Factory Gate', location: 'Manesar Auto Industrial Zone', time: 'Yesterday, 16:00', done: true, note: 'Quality packaging check passed' },
        { title: 'Crossed Delhi NCR Arterial Route', location: 'DND Expressway Flyover', time: 'Today, 06:30', done: true, note: 'Intra-NCR feeder transit' },
        { title: 'Loaded on Last-Mile EV Van', location: 'Noida Distribution Center', time: 'Today, 11:00', done: true, note: 'Out for delivery' },
        { title: 'Destination Delivery', location: 'SpeedTech Assembly Dock, Sector 63', time: 'Expected Today by 17:00', done: false, note: 'Pilot approaching location' }
      ]
    }
  };

  const getQueryAwb = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const awb = urlParams.get('awb');
    return awb ? awb.trim().toUpperCase() : 'NX-IND-99218';
  };

  const applyShipmentData = (data) => {
    // Update Overview Card
    const displayAwb = document.getElementById('display-awb');
    const displayHeadline = document.getElementById('display-headline');
    const displaySubhead = document.getElementById('display-subhead');
    const badgeStatus = document.getElementById('badge-status');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const displayOrigin = document.getElementById('display-origin-hub');
    const displayDest = document.getElementById('display-dest-hub');
    const displayConsignor = document.getElementById('display-consignor');
    const displayConsignee = document.getElementById('display-consignee');
    const displayCargo = document.getElementById('display-cargo-type');
    const displayVehicle = document.getElementById('display-vehicle');

    if (displayAwb) displayAwb.textContent = 'AWB #' + data.awb;
    if (displayHeadline) displayHeadline.textContent = data.headline;
    if (displaySubhead) displaySubhead.innerHTML = data.subhead;
    
    if (badgeStatus) {
      badgeStatus.textContent = data.status;
      if (data.status === 'Delivered') {
        badgeStatus.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30';
      } else if (data.status === 'Out for Delivery') {
        badgeStatus.className = 'px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30';
      } else {
        badgeStatus.className = 'px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30';
      }
    }

    if (progressBarFill) {
      progressBarFill.style.width = data.progress + '%';
      if (data.isDelivered) {
        progressBarFill.className = 'bg-emerald-500 h-3 rounded-full transition-all duration-500';
      } else {
        progressBarFill.className = 'bg-gradient-to-r from-orange-500 to-amber-400 h-3 rounded-full transition-all duration-500';
      }
    }

    if (displayOrigin) displayOrigin.innerHTML = `<i data-lucide="map-pin" class="w-4 h-4 text-orange-500"></i> ${data.origin}`;
    if (displayDest) displayDest.innerHTML = `<i data-lucide="flag" class="w-4 h-4 text-emerald-500"></i> ${data.destination}`;
    if (displayConsignor) displayConsignor.textContent = data.consignor;
    if (displayConsignee) displayConsignee.textContent = data.consignee;
    if (displayCargo) displayCargo.textContent = data.cargo;
    if (displayVehicle) displayVehicle.textContent = data.vehicle;

    // Render Milestone Timeline
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
      timelineContainer.innerHTML = data.milestones.map((m, idx) => `
        <div class="flex items-start gap-4 relative pl-8">
          <span class="absolute left-1.5 top-1 w-4 h-4 rounded-full border-2 ${m.done ? 'bg-orange-500 border-orange-500 dark:bg-orange-400 dark:border-orange-400' : 'bg-slate-200 dark:bg-slate-800 border-slate-400 dark:border-slate-600'}"></span>
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 class="text-xs sm:text-sm font-bold ${m.done ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}">${m.title}</h4>
              <span class="text-[11px] font-mono ${m.done ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-600'}">${m.time}</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">${m.location}</p>
            <p class="text-[11px] text-slate-400 dark:text-slate-500 italic mt-0.5">${m.note}</p>
          </div>
        </div>
      `).join('');
    }

    // Populate ePOD Modal Fields
    const epodAwb = document.getElementById('epod-awb');
    const epodDeliveredTime = document.getElementById('epod-delivered-time');
    const epodStatusTag = document.getElementById('epod-status-tag');
    const epodConsignor = document.getElementById('epod-consignor');
    const epodConsignee = document.getElementById('epod-consignee');

    if (epodAwb) epodAwb.textContent = data.awb;
    if (epodDeliveredTime) epodDeliveredTime.textContent = data.deliveredTime;
    if (epodConsignor) epodConsignor.textContent = data.consignor;
    if (epodConsignee) epodConsignee.textContent = data.consignee;
    if (epodStatusTag) {
      epodStatusTag.textContent = data.status;
      epodStatusTag.className = data.isDelivered
        ? 'px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300'
        : 'px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300';
    }

    // Reinitialize icons in dynamic markup
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  const renderShipment = (awbKey) => {
    fetch('/api/track?awb=' + encodeURIComponent(awbKey))
      .then(res => {
        if (!res.ok) throw new Error('API status: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.success && data.shipment) {
          applyShipmentData(data.shipment);
        } else {
          fallbackRender(awbKey);
        }
      })
      .catch(err => {
        console.warn('Live tracking API fetch failed, falling back to local dataset:', err);
        fallbackRender(awbKey);
      });
  };

  const fallbackRender = (awbKey) => {
    const data = shipmentsData[awbKey] || {
      awb: awbKey,
      status: 'In Transit',
      headline: `Consignment Waybill #${awbKey} Active in Transit`,
      subhead: 'Regular express transit in progress. Next scan update expected within 2 hours.',
      origin: 'Regional Origin Gateway Hub',
      destination: 'Destination Distribution Center',
      consignor: 'Registered Commercial Shipper',
      consignee: 'Authorized Consignee Facility',
      cargo: 'Standard Commercial B2B Freight',
      vehicle: 'NexaRoute Container Fleet',
      ewb: 'EWB-' + Math.floor(1000000000 + Math.random() * 9000000000),
      progress: 55,
      deliveredTime: 'Pending Delivery',
      isDelivered: false,
      milestones: [
        { title: 'Consignment Picked Up', location: 'Origin Industrial Cluster', time: 'Earlier Today', done: true, note: 'Dock manifest generated' },
        { title: 'Line-Haul In Transit', location: 'National Highway Corridor', time: 'Today In Transit', done: true, note: 'GPS telemetry active' },
        { title: 'Destination Sortation', location: 'Regional Hub', time: 'Expected Tomorrow', done: false, note: 'Scheduled transit' },
        { title: 'Delivered', location: 'Consignee Address', time: 'Pending', done: false, note: 'Digital signature required' }
      ]
    };
    applyShipmentData(data);
  };

  // Initial load from URL query
  const initialAwb = getQueryAwb();
  const trackInput = document.getElementById('track-page-input');
  if (trackInput) trackInput.value = initialAwb;
  renderShipment(initialAwb);

  // Form submit handler
  const trackPageForm = document.getElementById('track-page-form');
  if (trackPageForm) {
    trackPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = trackInput.value.trim().toUpperCase();
      if (val) {
        history.pushState(null, '', `track.html?awb=${encodeURIComponent(val)}`);
        renderShipment(val);
      }
    });
  }

  // Sample AWB pill clicks
  document.querySelectorAll('.sample-awb-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAwb = btn.getAttribute('data-awb');
      if (targetAwb) {
        if (trackInput) trackInput.value = targetAwb;
        history.pushState(null, '', `track.html?awb=${encodeURIComponent(targetAwb)}`);
        renderShipment(targetAwb);
      }
    });
  });

  // ePOD Modal Toggle
  const openEpodBtn = document.getElementById('btn-open-epod');
  const epodModal = document.getElementById('epod-modal');
  const epodCloseBtn = document.getElementById('epod-modal-close');

  if (openEpodBtn && epodModal) {
    openEpodBtn.addEventListener('click', () => {
      epodModal.classList.remove('hidden');
      epodModal.classList.add('flex');
    });
  }

  if (epodCloseBtn && epodModal) {
    epodCloseBtn.addEventListener('click', () => {
      epodModal.classList.add('hidden');
      epodModal.classList.remove('flex');
    });
  }

  if (epodModal) {
    epodModal.addEventListener('click', (e) => {
      if (e.target === epodModal) {
        epodModal.classList.add('hidden');
        epodModal.classList.remove('flex');
      }
    });
  }
});
