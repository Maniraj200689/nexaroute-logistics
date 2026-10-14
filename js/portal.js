/**
 * NexaRoute Logistics - Shipper Central Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  let consignments = [
    { awb: 'NX-IND-99218', origin: 'Bhiwandi (MH)', dest: 'Peenya (KA)', consignee: 'Organica Naturals Hub', service: 'Express Surface (PTL)', pkgs: '14 Boxes', weight: '340 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-SUR-40812', origin: 'Surat (GJ)', dest: 'Okhla (DL)', consignee: 'TrendCraft Retail', service: 'Express Surface (PTL)', pkgs: '22 Boxes', weight: '580 kg', status: 'Delivered', statusClass: 'delivered' },
    { awb: 'NX-DEL-88102', origin: 'Gurugram (HR)', dest: 'Noida Sec 63 (UP)', consignee: 'SpeedTech Assemblies', service: 'Hyperlocal EV Van', pkgs: '8 Crates', weight: '210 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery' },
    { awb: 'NX-PUN-77291', origin: 'Pune (MH)', dest: 'Sriperumbudur (TN)', consignee: 'DynoParts Tamil Nadu', service: 'Full Truckload (FTL)', pkgs: '32ft Container', weight: '9,200 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-AMD-33921', origin: 'Ahmedabad (GJ)', dest: 'Bhiwandi (MH)', consignee: 'WestCoast Logistics Park', service: 'Express Surface (PTL)', pkgs: '30 Boxes', weight: '750 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-BLR-66512', origin: 'Peenya (KA)', dest: 'Hyderabad (TG)', consignee: 'Deccan Retailers Pvt Ltd', service: 'Express Surface (PTL)', pkgs: '16 Cartons', weight: '420 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery' },
    { awb: 'NX-KOL-11029', origin: 'Dankuni (WB)', dest: 'Patna (BR)', consignee: 'Bihar FastFreight Hub', service: 'Express Surface (PTL)', pkgs: '45 Cartons', weight: '1,100 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-CHE-88219', origin: 'Chennai (TN)', dest: 'Coimbatore (TN)', consignee: 'Kovai Industrial Spares', service: 'Express Surface (PTL)', pkgs: '12 Crates', weight: '310 kg', status: 'Delivered', statusClass: 'delivered' },
    { awb: 'NX-LUD-90412', origin: 'Ludhiana (PB)', dest: 'Gurugram (HR)', consignee: 'NorthStar Garments', service: 'Express Surface (PTL)', pkgs: '28 Boxes', weight: '640 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-HYD-55102', origin: 'Hyderabad (TG)', dest: 'Vijayawada (AP)', consignee: 'Krishna Valley Dealers', service: 'Hyperlocal Feeder', pkgs: '6 Crates', weight: '180 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery' },
    { awb: 'NX-BOM-88741', origin: 'Bhiwandi (MH)', dest: 'Ahmedabad (GJ)', consignee: 'Gujarat Pharma Distrib.', service: 'Cold Chain (2-8°C)', pkgs: '10 Reefers', weight: '290 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-DEL-66291', origin: 'Okhla (DL)', dest: 'Jaipur (RJ)', consignee: 'PinkCity Craft Logistics', service: 'Express Surface (PTL)', pkgs: '18 Cartons', weight: '490 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-SUR-22819', origin: 'Surat (GJ)', dest: 'Indore (MP)', consignee: 'Malwa Textile Syndicate', service: 'Express Surface (PTL)', pkgs: '25 Boxes', weight: '550 kg', status: 'In Transit', statusClass: 'in-transit' },
    { awb: 'NX-BLR-44102', origin: 'Peenya (KA)', dest: 'Kochi (KL)', consignee: 'Kerala Spice Traders', service: 'Express Surface (PTL)', pkgs: '15 Bags', weight: '380 kg', status: 'Out for Delivery', statusClass: 'out-for-delivery' }
  ];

  let currentFilter = 'all';
  let searchQuery = '';

  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('table-search-input');
  const filterButtons = document.querySelectorAll('.filter-btn');

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

  const renderTable = () => {
    if (!tableBody) return;

    const filtered = consignments.filter(item => {
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
        <td class="p-3.5 text-right space-x-2">
          <a href="track.html?awb=${encodeURIComponent(row.awb)}" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
            <span>Track</span>
          </a>
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
      link.setAttribute('download', `nexaroute_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
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
          alert(`Consignment booked and registered on NexaRoute Express API!\nAssigned Waybill: ${data.consignment.awb}\nStatus: In Line-Haul Transit`);
        } else {
          throw new Error(data.error || 'Booking error');
        }
      })
      .catch(err => {
        console.warn('Booking API offline fallback:', err);
        const newAwb = 'NX-BOM-' + Math.floor(10000 + Math.random() * 90000);
        const newEntry = {
          awb: newAwb,
          origin: newBookingPayload.origin,
          dest: newBookingPayload.dest,
          consignee: consignee,
          service: service,
          pkgs: pkgs,
          weight: weight + ' kg',
          status: 'In Transit',
          statusClass: 'in-transit'
        };
        consignments.unshift(newEntry);
        updateDashboardKpis();
        renderTable();
        bookingModal.classList.add('hidden');
        bookingModal.classList.remove('flex');
        bookingForm.reset();
        alert(`Consignment booked successfully (local mode)!\nAssigned Waybill: ${newAwb}\nLine-haul departure scheduled for today.`);
      });
    });
  }
});
