/**
 * Vahana Supply Co - Interactive Rate & Transit Estimator
 */

document.addEventListener('DOMContentLoaded', () => {
  const calcForm = document.getElementById('rate-calculator-form');
  const resultCard = document.getElementById('rate-result-card');
  if (!calcForm || !resultCard) return;

  const originSelect = document.getElementById('calc-origin');
  const destSelect = document.getElementById('calc-destination');
  const weightInput = document.getElementById('calc-weight');
  const speedRadios = document.getElementsByName('calc-speed');

  const estPrice = document.getElementById('est-price-display');
  const estTime = document.getElementById('est-time-display');
  const estDistance = document.getElementById('est-distance-display');

  // Approximate distance matrix (km) between major hubs
  const distances = {
    'DEL-BOM': 1420, 'DEL-BLR': 2170, 'DEL-CCU': 1530, 'DEL-AMD': 930, 'DEL-MAA': 2200,
    'BOM-BLR': 980, 'BOM-CCU': 1960, 'BOM-AMD': 530, 'BOM-MAA': 1330,
    'BLR-CCU': 1880, 'BLR-AMD': 1490, 'BLR-MAA': 350,
    'CCU-AMD': 2070, 'CCU-MAA': 1660,
    'AMD-MAA': 1820
  };

  const getDistance = (cityA, cityB) => {
    if (cityA === cityB) return 60; // intra-city
    const key1 = `${cityA}-${cityB}`;
    const key2 = `${cityB}-${cityA}`;
    return distances[key1] || distances[key2] || 1200;
  };

  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const origin = originSelect.value;
    const dest = destSelect.value;
    const weight = parseFloat(weightInput.value) || 25;
    
    let isExpress = true;
    for (const r of speedRadios) {
      if (r.checked && r.value === 'standard') {
        isExpress = false;
        break;
      }
    }

    const originText = originSelect.options[originSelect.selectedIndex].text.split('(')[0].trim();
    const destText = destSelect.options[destSelect.selectedIndex].text.split('(')[0].trim();
    const tier = isExpress ? 'express' : 'standard';

    // Query live backend API for accurate tariff & SLA matrix
    fetch('/api/estimate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: originText,
        destination: destText,
        weight: weight,
        tier: tier
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('API estimate failed');
      return res.json();
    })
    .then(data => {
      if (data.success && data.calculation) {
        const calc = data.calculation;
        if (estPrice) estPrice.textContent = '₹' + calc.costs.totalEstimatedInr.toLocaleString('en-IN');
        if (estTime) estTime.textContent = calc.slaText + ` (~${calc.estimatedTransitHours} hrs)`;
        if (estDistance) estDistance.textContent = calc.distanceKm + ' km mapped road corridor';
        resultCard.classList.remove('hidden');
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Malformed calculation data');
      }
    })
    .catch(err => {
      console.warn('API estimate fallback:', err);
      const dist = getDistance(origin, dest);
      let baseRatePerKg = isExpress ? 14 : 9.5;
      let totalCost = Math.round((weight * baseRatePerKg) + (dist * 1.8) + 350);
      if (totalCost < 450) totalCost = 450;

      let hours;
      if (dist <= 100) {
        hours = isExpress ? 'Same Day (4-6 Hours)' : 'Within 24 Hours';
      } else if (dist <= 600) {
        hours = isExpress ? '24 - 36 Hours' : '36 - 48 Hours';
      } else if (dist <= 1500) {
        hours = isExpress ? '48 - 60 Hours' : '60 - 72 Hours';
      } else {
        hours = isExpress ? '72 - 84 Hours' : '4 - 5 Days';
      }

      if (estPrice) estPrice.textContent = '₹' + totalCost.toLocaleString('en-IN');
      if (estTime) estTime.textContent = hours;
      if (estDistance) estDistance.textContent = dist + ' km approx. road transit';

      resultCard.classList.remove('hidden');
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
});
