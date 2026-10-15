/**
 * Vahana Supply Co - Shipper Central Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  let consignments = [
    { awb: 'VH-IND-99218', origin: 'Bhiwandi (MH)', dest: 'Peenya (KA)', consignee: 'Organica Naturals Hub', service: 'Express Surface (PTL)', pkgs: '14 Boxes', weight: '340 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PAID' },
    { awb: 'VH-SUR-40812', origin: 'Surat (GJ)', dest: 'Okhla (DL)', consignee: 'TrendCraft Retail', service: 'Express Surface (PTL)', pkgs: '22 Boxes', weight: '580 kg', status: 'Delivered', statusClass: 'delivered', paymentStatus: 'PAID' },
    { awb: 'VH-DEL-88102', origin: 'Gurugram (HR)', dest: 'Noida Sec 63 (UP)', consignee: 'SpeedTech Assemblies', service: 'Hyperlocal EV Van', pkgs: '8 Crates', weight: '210 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery', paymentStatus: 'PAID' },
    { awb: 'VH-PUN-77291', origin: 'Pune (MH)', dest: 'Sriperumbudur (TN)', consignee: 'DynoParts Tamil Nadu', service: 'Full Truckload (FTL)', pkgs: '32ft Container', weight: '9,200 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-AMD-33921', origin: 'Ahmedabad (GJ)', dest: 'Bhiwandi (MH)', consignee: 'WestCoast Logistics Park', service: 'Express Surface (PTL)', pkgs: '30 Boxes', weight: '750 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-BLR-66512', origin: 'Peenya (KA)', dest: 'Hyderabad (TG)', consignee: 'Deccan Retailers Pvt Ltd', service: 'Express Surface (PTL)', pkgs: '16 Cartons', weight: '420 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery', paymentStatus: 'PENDING' },
    { awb: 'VH-KOL-11029', origin: 'Dankuni (WB)', dest: 'Patna (BR)', consignee: 'Bihar FastFreight Hub', service: 'Express Surface (PTL)', pkgs: '45 Cartons', weight: '1,100 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-CHE-88219', origin: 'Chennai (TN)', dest: 'Coimbatore (TN)', consignee: 'Kovai Industrial Spares', service: 'Express Surface (PTL)', pkgs: '12 Crates', weight: '310 kg', status: 'Delivered', statusClass: 'delivered', paymentStatus: 'PAID' },
    { awb: 'VH-LUD-90412', origin: 'Ludhiana (PB)', dest: 'Gurugram (HR)', consignee: 'NorthStar Garments', service: 'Express Surface (PTL)', pkgs: '28 Boxes', weight: '640 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-HYD-55102', origin: 'Hyderabad (TG)', dest: 'Vijayawada (AP)', consignee: 'Krishna Valley Dealers', service: 'Hyperlocal Feeder', pkgs: '6 Crates', weight: '180 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery', paymentStatus: 'PENDING' },
    { awb: 'VH-BOM-88741', origin: 'Bhiwandi (MH)', dest: 'Ahmedabad (GJ)', consignee: 'Gujarat Pharma Distrib.', service: 'Cold Chain (2-8°C)', pkgs: '10 Reefers', weight: '290 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-DEL-66291', origin: 'Okhla (DL)', dest: 'Jaipur (RJ)', consignee: 'PinkCity Craft Logistics', service: 'Express Surface (PTL)', pkgs: '18 Cartons', weight: '490 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-SUR-22819', origin: 'Surat (GJ)', dest: 'Indore (MP)', consignee: 'Malwa Textile Syndicate', service: 'Express Surface (PTL)', pkgs: '25 Boxes', weight: '550 kg', status: 'In Transit', statusClass: 'in-transit', paymentStatus: 'PENDING' },
    { awb: 'VH-BLR-44102', origin: 'Peenya (KA)', dest: 'Kochi (KL)', consignee: 'Kerala Spice Traders', service: 'Express Surface (PTL)', pkgs: '15 Bags', weight: '380 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery', paymentStatus: 'PENDING' }
  ];

  let currentFilter = 'all';
  let searchQuery = '';
  let currentRole = 'shipper';

  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('table-search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const roleSelect = document.getElementById('role-select');
  const roleAvatar = document.getElementById('role-avatar');
  const roleBanner = document.getElementById('role-banner');
  const roleBannerIcon = document.getElementById('role-banner-icon');
  const roleBannerTitle = document.getElementById('role-banner-title');
  const roleBannerDesc = document.getElementById('role-banner-desc');
  const roleBadge = document.getElementById('role-badge');
  const btnOpenBooking = document.getElementById('btn-open-booking-modal');

  const updateRoleUi = (role) => {
    currentRole = role;
    if (role === 'shipper') {
      if (roleAvatar) {
        roleAvatar.textContent = 'SA';
        roleAvatar.className = 'w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center font-bold text-orange-400 text-[11px] shrink-0';
      }
      if (roleBanner) roleBanner.className = 'rounded-2xl p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs';
      if (roleBannerIcon) {
        roleBannerIcon.className = 'w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0';
        roleBannerIcon.innerHTML = `<i data-lucide="building-2" class="w-5 h-5"></i>`;
      }
      if (roleBannerTitle) roleBannerTitle.textContent = 'Shipper Admin Console — Apex FabTex Mills';
      if (roleBannerDesc) roleBannerDesc.textContent = 'Full commercial permissions: Book line-haul freight, monitor telematics, export CSV manifests, and view billing.';
      if (roleBadge) {
        roleBadge.textContent = 'Admin Privileges';
        roleBadge.className = 'px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 border border-orange-300 dark:border-orange-500/40';
      }
      if (btnOpenBooking) btnOpenBooking.classList.remove('hidden');
    } else if (role === 'dispatcher') {
      if (roleAvatar) {
        roleAvatar.textContent = 'HD';
        roleAvatar.className = 'w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-[11px] shrink-0';
      }
      if (roleBanner) roleBanner.className = 'rounded-2xl p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs';
      if (roleBannerIcon) {
        roleBannerIcon.className = 'w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0';
        roleBannerIcon.innerHTML = `<i data-lucide="warehouse" class="w-5 h-5"></i>`;
      }
      if (roleBannerTitle) roleBannerTitle.textContent = 'Hub Operations Control — Bhiwandi Central Gateway Hub';
      if (roleBannerDesc) roleBannerDesc.textContent = 'Sortation & staging control: Assign container vehicles, update highway lane statuses, and dispatch line-haul trucks.';
      if (roleBadge) {
        roleBadge.textContent = 'Hub Operations Level 2';
        roleBadge.className = 'px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40';
      }
      if (btnOpenBooking) btnOpenBooking.classList.remove('hidden');
    } else if (role === 'pilot') {
      if (roleAvatar) {
        roleAvatar.textContent = 'LP';
        roleAvatar.className = 'w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-[11px] shrink-0';
      }
      if (roleBanner) roleBanner.className = 'rounded-2xl p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs';
      if (roleBannerIcon) {
        roleBannerIcon.className = 'w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0';
        roleBannerIcon.innerHTML = `<i data-lucide="truck" class="w-5 h-5"></i>`;
      }
      if (roleBannerTitle) roleBannerTitle.textContent = 'Last-Mile Delivery Pilot — Manoj Kumar (DL-1L-AA-3810)';
      if (roleBannerDesc) roleBannerDesc.textContent = 'Sector dispatch run-sheet: Deliver packages, verify recipient WhatsApp/SMS OTP, and seal digital ePOD in real-time.';
      if (roleBadge) {
        roleBadge.textContent = 'Pilot Telematics Active';
        roleBadge.className = 'px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40';
      }
      if (btnOpenBooking) btnOpenBooking.classList.add('hidden');
    }

    renderTable();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      updateRoleUi(e.target.value);
    });
  }

  const getStatusBadge = (status) => {
    if (status === 'Delivered') {
      return `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1 w-max">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Delivered
      </span>`;
    }
    if (status === 'Out for Delivery') {
      return `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30 flex items-center gap-1 w-max">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Out for Delivery
      </span>`;
    }
    return `<span class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 flex items-center gap-1 w-max">
      <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span> In Transit
    </span>`;
  };

  const renderActionButtons = (row) => {
    if (currentRole === 'pilot') {
      if (row.status !== 'Delivered') {
        return `
          <button onclick="window.openPilotModal('${row.awb}', '${row.consignee.replace(/'/g, "\\'")}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm shadow-emerald-600/30 transition-transform active:scale-95">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i><span>Deliver (OTP)</span>
          </button>
          <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
            <span>Track</span>
          </a>
        `;
      }
      return `
        <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-lg inline-flex items-center gap-1">
          <i data-lucide="check-check" class="w-3 h-3"></i> Delivered
        </span>
        <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
          <span>Track</span>
        </a>
      `;
    }

    if (currentRole === 'dispatcher') {
      return `
        <button onclick="window.openDispatcherModal('${row.awb}', '${row.consignee.replace(/'/g, "\\'")}', '${row.status}')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-transform active:scale-95 shadow-sm shadow-blue-600/20">
          <i data-lucide="truck" class="w-3.5 h-3.5"></i><span>Stage Hub</span>
        </button>
        <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
          <span>Track</span>
        </a>
      `;
    }

    // Default: Shipper Admin
    const isPaid = row.paymentStatus === 'PAID';
    const paymentButton = isPaid ? `
      <span class="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700/50 rounded-lg text-xs font-semibold inline-flex items-center gap-1" title="Advance Freight Settled">
        <i data-lucide="check-circle-2" class="w-3 h-3"></i><span>Paid</span>
      </span>
    ` : `
      <button onclick="window.openPaymentModal('${row.awb}', '${row.consignee.replace(/'/g, "\\'")}', '${row.origin.replace(/'/g, "\\'")}', '${row.dest.replace(/'/g, "\\'")}')" class="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-sm transition-transform active:scale-95" title="Pay via UPI or Razorpay">
        <i data-lucide="credit-card" class="w-3.5 h-3.5"></i><span>Pay Freight</span>
      </button>
    `;

    return `
      ${paymentButton}
      <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
        <span>Track</span>
      </a>
      ${row.status === 'Delivered' ? `
        <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
          <i data-lucide="file-check-2" class="w-3 h-3"></i><span>ePOD</span>
        </a>
      ` : ''}
    `;
  };

  const renderTable = () => {
    if (!tableBody) return;

    const filtered = consignments.filter(item => {
      // In pilot mode, optionally prioritize out-for-delivery shipments
      const matchesFilter = currentFilter === 'all' || item.statusClass === currentFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        item.awb.toLowerCase().includes(query) || 
        item.consignee.toLowerCase().includes(query) || 
        item.origin.toLowerCase().includes(query) || 
        item.dest.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-8 text-slate-400">
            No consignments found matching your filter or search query.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(row => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
          <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="hover:text-orange-500 hover:underline flex items-center gap-1">
            <span>${row.awb}</span>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i>
          </a>
        </td>
        <td class="p-3.5 text-slate-700 dark:text-slate-300">
          ${row.origin} &rarr; <strong>${row.dest}</strong>
        </td>
        <td class="p-3.5 font-medium text-slate-900 dark:text-white">
          ${row.consignee}
        </td>
        <td class="p-3.5 text-slate-600 dark:text-slate-400">
          ${row.service}
        </td>
        <td class="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
          ${row.pkgs} &bull; ${row.weight}
        </td>
        <td class="p-3.5">
          ${getStatusBadge(row.status)}
        </td>
        <td class="p-3.5 text-right space-x-1.5">
          ${renderActionButtons(row)}
        </td>
      </tr>
    `).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  const updateDashboardKpis = () => {
    const statActive = document.getElementById('stat-active');
    if (statActive) {
      const activeCount = consignments.filter(c => c.status !== 'Delivered').length;
      statActive.textContent = activeCount;
    }
  };

  const fetchConsignmentsFromApi = () => {
    fetch('/api/consignments')
      .then(res => {
        if (!res.ok) throw new Error('API status: ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.consignments)) {
          consignments = data.consignments;
          updateDashboardKpis();
          renderTable();
        }
      })
      .catch(err => {
        console.warn('Live API fetch unavailable, using default seed:', err);
      });
  };

  // Initial table render & live API fetch
  updateDashboardKpis();
  renderTable();
  fetchConsignmentsFromApi();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderTable();
    });
  }

  // Filter button click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.className = 'filter-btn px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white';
      });
      btn.className = 'filter-btn px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-sm';
      currentFilter = btn.getAttribute('data-filter');
      renderTable();
    });
  });

  // Export Manifest as CSV
  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      let csvContent = 'data:text/csv;charset=utf-8,AWB,Origin,Destination,Consignee,Service,Packages,Weight,Status\n';
      consignments.forEach(c => {
        csvContent += `"${c.awb}","${c.origin}","${c.dest}","${c.consignee}","${c.service}","${c.pkgs}","${c.weight}","${c.status}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `vahana_supply_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Booking Modal handlers
  const openBookingBtn = document.getElementById('btn-open-booking-modal');
  const bookingModal = document.getElementById('booking-modal');
  const closeBookingBtn = document.getElementById('booking-modal-close');
  const bookingForm = document.getElementById('new-booking-form');

  if (openBookingBtn && bookingModal) {
    openBookingBtn.addEventListener('click', () => {
      bookingModal.classList.remove('hidden');
      bookingModal.classList.add('flex');
    });
  }

  if (closeBookingBtn && bookingModal) {
    closeBookingBtn.addEventListener('click', () => {
      bookingModal.classList.add('hidden');
      bookingModal.classList.remove('flex');
    });
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        bookingModal.classList.add('hidden');
        bookingModal.classList.remove('flex');
      }
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const origin = document.getElementById('book-origin').value;
      const dest = document.getElementById('book-destination').value;
      const consignee = document.getElementById('book-consignee').value.trim();
      const service = document.getElementById('book-service').value;
      const pkgs = document.getElementById('book-pkgs').value + ' Cartons';
      const weight = document.getElementById('book-weight').value;

      const newBookingPayload = {
        origin: origin.split('(')[0].trim(),
        dest: dest.split('(')[0].trim(),
        consignee: consignee,
        service: service,
        pkgs: pkgs,
        weight: weight
      };

      fetch('/api/consignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBookingPayload)
      })
      .then(res => {
        if (!res.ok) throw new Error('Booking API response status ' + res.status);
        return res.json();
      })
      .then(data => {
        if (data.success && data.consignment) {
          consignments.unshift(data.consignment);
          updateDashboardKpis();
          renderTable();
          bookingModal.classList.add('hidden');
          bookingModal.classList.remove('flex');
          bookingForm.reset();
          if (confirm(`🎉 Consignment #${data.consignment.awb} booked and registered on Vahana Supply Co Express API!\n\nWould you like to settle the advance freight payment (UPI / Razorpay) now?`)) {
            window.openPaymentModal(data.consignment.awb, data.consignment.consignee, data.consignment.origin, data.consignment.dest);
          }
        } else {
          throw new Error(data.error || 'Booking error');
        }
      })
      .catch(err => {
        console.warn('Booking API offline fallback:', err);
        const newAwb = 'VH-BOM-' + Math.floor(10000 + Math.random() * 90000);
        const newEntry = {
          awb: newAwb,
          origin: newBookingPayload.origin,
          dest: newBookingPayload.dest,
          consignee: consignee,
          service: service,
          pkgs: pkgs,
          weight: weight + ' kg',
          status: 'In Transit',
          statusClass: 'in-transit',
          paymentStatus: 'PENDING'
        };
        consignments.unshift(newEntry);
        updateDashboardKpis();
        renderTable();
        bookingModal.classList.add('hidden');
        bookingModal.classList.remove('flex');
        bookingForm.reset();
        if (confirm(`🎉 Consignment booked successfully!\nAssigned Waybill: ${newAwb}\n\nWould you like to settle advance freight payment now?`)) {
          window.openPaymentModal(newAwb, consignee, newBookingPayload.origin, newBookingPayload.dest);
        }
      });
    });
  }

  // ==================== ROLE ACTION MODAL HANDLERS ====================
  const portalActionModal = document.getElementById('portal-action-modal');
  const portalActionModalClose = document.getElementById('portal-action-modal-close');
  const actionModalAwb = document.getElementById('action-modal-awb');
  const actionModalConsignee = document.getElementById('action-modal-consignee');
  const pilotOtpSection = document.getElementById('pilot-otp-section');
  const dispatcherSection = document.getElementById('dispatcher-action-section');
  const modalRoleTitle = document.getElementById('modal-role-title');
  const modalRoleDesc = document.getElementById('modal-role-desc');
  const btnPortalSendOtp = document.getElementById('btn-portal-send-otp');
  const portalOtpToast = document.getElementById('portal-otp-toast');
  const portalToastCode = document.getElementById('portal-toast-code');
  const portalOtpForm = document.getElementById('portal-otp-form');
  const portalOtpInput = document.getElementById('portal-otp-input');
  const portalSignerInput = document.getElementById('portal-signer-input');
  const portalOtpErr = document.getElementById('portal-otp-err');
  const dispatcherForm = document.getElementById('dispatcher-form');
  const dispStatusSelect = document.getElementById('disp-status-select');

  let currentTargetAwb = '';

  const hideActionModal = () => {
    if (portalActionModal) {
      portalActionModal.classList.add('hidden');
      portalActionModal.classList.remove('flex');
    }
  };

  if (portalActionModalClose) {
    portalActionModalClose.addEventListener('click', hideActionModal);
  }
  if (portalActionModal) {
    portalActionModal.addEventListener('click', (e) => {
      if (e.target === portalActionModal) hideActionModal();
    });
  }

  window.openPilotModal = (awb, consignee) => {
    currentTargetAwb = awb;
    if (actionModalAwb) actionModalAwb.textContent = awb;
    if (actionModalConsignee) actionModalConsignee.textContent = consignee;
    if (modalRoleTitle) modalRoleTitle.textContent = 'Consignee Delivery Handover & OTP';
    if (modalRoleDesc) modalRoleDesc.textContent = 'Last-Mile Pilot door verification with authorized receiver.';
    if (pilotOtpSection) pilotOtpSection.classList.remove('hidden');
    if (dispatcherSection) dispatcherSection.classList.add('hidden');
    if (portalOtpToast) portalOtpToast.classList.add('hidden');
    if (portalOtpErr) {
      portalOtpErr.classList.add('hidden');
      portalOtpErr.textContent = '';
    }
    if (portalOtpInput) portalOtpInput.value = '';
    if (portalSignerInput) portalSignerInput.value = `${consignee} (Dock Manager)`;

    if (portalActionModal) {
      portalActionModal.classList.remove('hidden');
      portalActionModal.classList.add('flex');
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  window.openDispatcherModal = (awb, consignee, currentStatus) => {
    currentTargetAwb = awb;
    if (actionModalAwb) actionModalAwb.textContent = awb;
    if (actionModalConsignee) actionModalConsignee.textContent = consignee;
    if (modalRoleTitle) modalRoleTitle.textContent = 'Hub Gateway Sortation & Release';
    if (modalRoleDesc) modalRoleDesc.textContent = 'Assign line-haul container vehicle and dispatch highway convoy.';
    if (pilotOtpSection) pilotOtpSection.classList.add('hidden');
    if (dispatcherSection) dispatcherSection.classList.remove('hidden');
    if (dispStatusSelect) dispStatusSelect.value = currentStatus || 'In Transit';

    if (portalActionModal) {
      portalActionModal.classList.remove('hidden');
      portalActionModal.classList.add('flex');
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  // Pilot Send OTP in Portal
  if (btnPortalSendOtp) {
    btnPortalSendOtp.addEventListener('click', async () => {
      btnPortalSendOtp.disabled = true;
      btnPortalSendOtp.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>Sending OTP...</span>`;
      if (window.lucide) window.lucide.createIcons();

      try {
        const res = await fetch('/api/otp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ awb: currentTargetAwb, phone: '+91 98112-99218' })
        });
        const data = await res.json();
        if (data.success) {
          if (portalOtpToast) {
            portalOtpToast.classList.remove('hidden');
            if (portalToastCode) portalToastCode.textContent = data.simulatedOtp;
          }
          if (portalOtpInput) {
            portalOtpInput.value = data.simulatedOtp;
            portalOtpInput.focus();
          }
        }
      } catch (err) {
        const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
        if (portalOtpToast) {
          portalOtpToast.classList.remove('hidden');
          if (portalToastCode) portalToastCode.textContent = fallbackCode;
        }
        if (portalOtpInput) {
          portalOtpInput.value = fallbackCode;
          portalOtpInput.focus();
        }
      } finally {
        btnPortalSendOtp.disabled = false;
        btnPortalSendOtp.innerHTML = `<i data-lucide="message-square" class="w-3.5 h-3.5"></i><span>Resend Consignee WhatsApp OTP</span>`;
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // Pilot Verify OTP in Portal
  if (portalOtpForm) {
    portalOtpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const otp = portalOtpInput ? portalOtpInput.value.trim() : '';
      const signedBy = portalSignerInput ? portalSignerInput.value.trim() : 'Consignee Receiver';

      try {
        const res = await fetch('/api/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            awb: currentTargetAwb,
            otp: otp,
            signedBy: signedBy
          })
        });
        const data = await res.json();

        if (data.success) {
          const item = consignments.find(c => c.awb === currentTargetAwb);
          if (item) {
            item.status = 'Delivered';
            item.statusClass = 'delivered';
          }
          updateDashboardKpis();
          renderTable();
          hideActionModal();
          alert(`✅ Consignment #${currentTargetAwb} verified successfully via OTP!\nSigned by: ${signedBy}\nDigital ePOD created.`);
        } else {
          if (portalOtpErr) {
            portalOtpErr.classList.remove('hidden');
            portalOtpErr.textContent = data.error || 'Invalid OTP code.';
          }
        }
      } catch (err) {
        const item = consignments.find(c => c.awb === currentTargetAwb);
        if (item) {
          item.status = 'Delivered';
          item.statusClass = 'delivered';
        }
        updateDashboardKpis();
        renderTable();
        hideActionModal();
        alert(`✅ Consignment #${currentTargetAwb} marked as Delivered!\nSigned by: ${signedBy}`);
      }
    });
  }

  // Dispatcher Status & Vehicle Updater
  if (dispatcherForm) {
    dispatcherForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newStatus = dispStatusSelect ? dispStatusSelect.value : 'In Transit';
      const vehicle = document.getElementById('disp-vehicle-select') ? document.getElementById('disp-vehicle-select').value : 'HR-55-AJ-9014';

      try {
        const res = await fetch('/api/shipments/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            awb: currentTargetAwb,
            status: newStatus,
            role: 'Hub Dispatcher',
            remark: `Assigned vehicle ${vehicle}. Highway line-haul transit authorized.`
          })
        });
        const data = await res.json();

        const item = consignments.find(c => c.awb === currentTargetAwb);
        if (item) {
          item.status = newStatus;
          item.statusClass = newStatus.toLowerCase().replace(/\s+/g, '-');
        }
        updateDashboardKpis();
        renderTable();
        hideActionModal();
        alert(`🚛 Waybill #${currentTargetAwb} dispatched!\nStatus: ${newStatus}\nAssigned Vehicle: ${vehicle}`);
      } catch (err) {
        const item = consignments.find(c => c.awb === currentTargetAwb);
        if (item) {
          item.status = newStatus;
          item.statusClass = newStatus.toLowerCase().replace(/\s+/g, '-');
        }
        updateDashboardKpis();
        renderTable();
        hideActionModal();
        alert(`🚛 Waybill #${currentTargetAwb} dispatched (local mode)!\nStatus: ${newStatus}`);
      }
    });
  }

  // ==================== RAZORPAY & UPI FREIGHT PAYMENT LOGIC ====================
  const paymentModal = document.getElementById('payment-modal');
  const paymentModalClose = document.getElementById('payment-modal-close');
  const payModalAwb = document.getElementById('pay-modal-awb');
  const payModalAmountDisplay = document.getElementById('pay-modal-amount-display');
  const payModalConsignee = document.getElementById('pay-modal-consignee');
  const payModalRoute = document.getElementById('pay-modal-route');
  const tabBtnUpi = document.getElementById('tab-btn-upi');
  const tabBtnRazorpay = document.getElementById('tab-btn-razorpay');
  const sectionUpi = document.getElementById('section-upi');
  const sectionRazorpay = document.getElementById('section-razorpay');
  const sectionPaymentSuccess = document.getElementById('section-payment-success');
  const btnCopyVpa = document.getElementById('btn-copy-vpa');
  const copyVpaText = document.getElementById('copy-vpa-text');
  const btnSimulateUpiSuccess = document.getElementById('btn-simulate-upi-success');
  const razorpayForm = document.getElementById('razorpay-form');
  const btnPrintReceipt = document.getElementById('btn-print-receipt');
  const btnClosePaymentSuccess = document.getElementById('btn-close-payment-success');
  const qrTimer = document.getElementById('qr-timer');

  let currentPayAwb = '';
  let currentPayOrderId = '';
  let currentPayAmount = 3363;
  let qrCountdownTimer = null;

  const hidePaymentModal = () => {
    if (paymentModal) {
      paymentModal.classList.add('hidden');
      paymentModal.classList.remove('flex');
    }
    if (qrCountdownTimer) {
      clearInterval(qrCountdownTimer);
      qrCountdownTimer = null;
    }
  };

  if (paymentModalClose) {
    paymentModalClose.addEventListener('click', hidePaymentModal);
  }
  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) hidePaymentModal();
    });
  }

  // Switch tabs
  if (tabBtnUpi && tabBtnRazorpay && sectionUpi && sectionRazorpay) {
    tabBtnUpi.addEventListener('click', () => {
      tabBtnUpi.className = 'py-2 px-4 font-bold border-b-2 border-orange-500 text-orange-500 transition-colors flex items-center gap-1.5';
      tabBtnRazorpay.className = 'py-2 px-4 font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1.5';
      sectionUpi.classList.remove('hidden');
      sectionRazorpay.classList.add('hidden');
    });

    tabBtnRazorpay.addEventListener('click', () => {
      tabBtnRazorpay.className = 'py-2 px-4 font-bold border-b-2 border-indigo-600 text-indigo-600 transition-colors flex items-center gap-1.5';
      tabBtnUpi.className = 'py-2 px-4 font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1.5';
      sectionRazorpay.classList.remove('hidden');
      sectionUpi.classList.add('hidden');
    });
  }

  // Copy VPA
  if (btnCopyVpa && copyVpaText) {
    btnCopyVpa.addEventListener('click', () => {
      navigator.clipboard.writeText('vahana.express@icici').then(() => {
        copyVpaText.textContent = 'Copied!';
        setTimeout(() => { copyVpaText.textContent = 'Copy'; }, 2000);
      }).catch(() => {
        copyVpaText.textContent = 'Copied!';
        setTimeout(() => { copyVpaText.textContent = 'Copy'; }, 2000);
      });
    });
  }

  const startQrCountdown = () => {
    if (qrCountdownTimer) clearInterval(qrCountdownTimer);
    let secondsLeft = 600;
    const updateDisplay = () => {
      const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
      const secs = (secondsLeft % 60).toString().padStart(2, '0');
      if (qrTimer) qrTimer.textContent = `${mins}:${secs}`;
      if (secondsLeft <= 0) {
        clearInterval(qrCountdownTimer);
        if (qrTimer) qrTimer.textContent = 'Expired';
      }
      secondsLeft--;
    };
    updateDisplay();
    qrCountdownTimer = setInterval(updateDisplay, 1000);
  };

  window.openPaymentModal = async (awb, consignee, origin, dest, amount = 3363) => {
    currentPayAwb = awb;
    currentPayAmount = amount;

    if (payModalAwb) payModalAwb.textContent = awb;
    if (payModalAmountDisplay) payModalAmountDisplay.textContent = `₹${amount.toLocaleString('en-IN')}`;
    if (payModalConsignee) payModalConsignee.textContent = consignee;
    if (payModalRoute) payModalRoute.innerHTML = `${origin} &rarr; <strong>${dest}</strong>`;

    // Reset sections
    if (sectionUpi) sectionUpi.classList.remove('hidden');
    if (sectionRazorpay) sectionRazorpay.classList.add('hidden');
    if (sectionPaymentSuccess) sectionPaymentSuccess.classList.add('hidden');
    if (tabBtnUpi) tabBtnUpi.click();

    // Call create order endpoint
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          awb: awb,
          amount: amount,
          consignee: consignee,
          consignor: 'Apex FabTex Mills (Verified Shipper)'
        })
      });
      const data = await res.json();
      if (data.success && data.order) {
        currentPayOrderId = data.order.orderId;
      }
    } catch (err) {
      currentPayOrderId = 'order_vhn_' + Date.now().toString().slice(-6);
    }

    startQrCountdown();

    if (paymentModal) {
      paymentModal.classList.remove('hidden');
      paymentModal.classList.add('flex');
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  const completePaymentFlow = async (methodName) => {
    const paymentId = 'pay_vhn_' + Math.floor(10000000 + Math.random() * 90000000).toString(16);
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: currentPayOrderId,
          awb: currentPayAwb,
          amount: currentPayAmount,
          method: methodName,
          paymentId: paymentId
        })
      });
      const data = await res.json();
      const p = data.payment || {};

      // Update table item status
      const item = consignments.find(c => c.awb === currentPayAwb);
      if (item) {
        item.paymentStatus = 'PAID';
        item.paymentId = p.paymentId || paymentId;
      }
      renderTable();

      // Show receipt view
      if (sectionUpi) sectionUpi.classList.add('hidden');
      if (sectionRazorpay) sectionRazorpay.classList.add('hidden');
      if (sectionPaymentSuccess) sectionPaymentSuccess.classList.remove('hidden');

      const receiptInv = document.getElementById('receipt-invoice-no');
      const receiptAwb = document.getElementById('receipt-awb');
      const receiptMethod = document.getElementById('receipt-method');
      const receiptUtr = document.getElementById('receipt-utr');
      const receiptPaymentId = document.getElementById('receipt-payment-id');
      const receiptTimestamp = document.getElementById('receipt-timestamp');
      const receiptAmount = document.getElementById('receipt-amount');

      if (receiptInv) receiptInv.textContent = p.taxInvoiceNumber || `INV-2026-${Date.now().toString().slice(-6)}`;
      if (receiptAwb) receiptAwb.textContent = currentPayAwb;
      if (receiptMethod) receiptMethod.textContent = methodName;
      if (receiptUtr) receiptUtr.textContent = p.bankRef || ('UTR' + Math.floor(100000000000 + Math.random() * 900000000000));
      if (receiptPaymentId) receiptPaymentId.textContent = p.paymentId || paymentId;
      if (receiptTimestamp) receiptTimestamp.textContent = p.paidAtFormatted || (new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST');
      if (receiptAmount) receiptAmount.textContent = `₹${currentPayAmount.toLocaleString('en-IN')}`;

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      const item = consignments.find(c => c.awb === currentPayAwb);
      if (item) item.paymentStatus = 'PAID';
      renderTable();
      if (sectionUpi) sectionUpi.classList.add('hidden');
      if (sectionRazorpay) sectionRazorpay.classList.add('hidden');
      if (sectionPaymentSuccess) sectionPaymentSuccess.classList.remove('hidden');
    }
  };

  // Simulate Instant UPI button
  if (btnSimulateUpiSuccess) {
    btnSimulateUpiSuccess.addEventListener('click', () => {
      completePaymentFlow('UPI (Instant QR Scanner)');
    });
  }

  // UPI App click simulation
  window.simulateUpiAppPayment = (appName) => {
    completePaymentFlow(`UPI App Intent (${appName})`);
  };

  // Razorpay form submission
  if (razorpayForm) {
    razorpayForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bank = document.getElementById('rzp-bank') ? document.getElementById('rzp-bank').value : 'Corporate NetBanking';
      completePaymentFlow(`Razorpay Commercial (${bank})`);
    });
  }

  // Print Receipt
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  // Close payment success
  if (btnClosePaymentSuccess) {
    btnClosePaymentSuccess.addEventListener('click', () => {
      hidePaymentModal();
    });
  }
});
