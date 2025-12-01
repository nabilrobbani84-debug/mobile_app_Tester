// src/utils/transformers/chartTransformers.js
// Transform data for chart components
import { 
  getMonthName, 
  getShortDayName, 
  formatShortDate,
  getWeekDates,
  addDays,
} from '../helpers/dateHelpers';
/**
 * Transform HB data for line chart
 * @param {array} hbRecords - Array of HB records
 * @param {object} options - Chart options
 * @returns {object} Chart-ready data
 */
export const transformHbDataForLineChart = (hbRecords, options = {}) => {
  const {
    limit = 7,
    sortOrder = 'asc',
    includeLabels = true,
    normalRange = { min: 12.0, max: 15.5 },
  } = options;
  if (!Array.isArray(hbRecords) || hbRecords.length === 0) {
    return {
      labels: [],
      data: [],
      datasets: [],
      hasData: false,
    };
  }
  // Sort and limit records
  const sortedRecords = [...hbRecords]
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    })
    .slice(0, limit);
  // Extract labels and values
  const labels = sortedRecords.map(record => {
    const date = new Date(record.date || record.createdAt);
    if (includeLabels) {
      return formatShortDate(date).slice(0, 5); // DD/MM format
    }
    return '';
  });
  const data = sortedRecords.map(record => 
    parseFloat(record.value || record.hbValue || 0)
  );
  // Calculate statistics
  const values = data.filter(v => v > 0);
  const average = values.length > 0 
    ? values.reduce((a, b) => a + b, 0) / values.length 
    : 0;
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  const latest = values.length > 0 ? values[values.length - 1] : 0;
  // Determine trend
  let trend = 'stable';
  if (values.length >= 2) {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 0.2) trend = 'up';
    else if (secondAvg < firstAvg - 0.2) trend = 'down';
  }
  // Check if values are in normal range
  const isNormal = latest >= normalRange.min && latest <= normalRange.max;
  return {
    labels,
    data,
    datasets: [{
      data,
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
      strokeWidth: 2,
    }],
    hasData: values.length > 0,
    statistics: {
      average: Math.round(average * 10) / 10,
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      latest: Math.round(latest * 10) / 10,
      trend,
      isNormal,
      normalRange,
    },
  };
};
/**
 * Transform consumption data for bar chart (monthly)
 * @param {array} consumptionRecords - Array of consumption records
 * @param {object} options - Chart options
 * @returns {object} Chart-ready data
 */
export const transformConsumptionForBarChart = (consumptionRecords, options = {}) => {
  const {
    months = 6,
    targetPerMonth = 8,
  } = options;
  // Initialize months data
  const today = new Date();
  const monthsData = [];
  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    monthsData.push({
      month: monthDate.getMonth(),
      year: monthDate.getFullYear(),
      label: getMonthName(monthDate.getMonth()).slice(0, 3),
      count: 0,
      target: targetPerMonth,
    });
  }
  // Count consumption per month
  if (Array.isArray(consumptionRecords)) {
    consumptionRecords.forEach(record => {
      const recordDate = new Date(record.consumptionDate || record.date || record.createdAt);
      const monthData = monthsData.find(
        m => m.month === recordDate.getMonth() && m.year === recordDate.getFullYear()
      );
      if (monthData) {
        monthData.count++;
      }
    });
  }
  // Calculate percentages
  const labels = monthsData.map(m => m.label);
  const data = monthsData.map(m => m.count);
  const percentages = monthsData.map(m => 
    Math.min(Math.round((m.count / m.target) * 100), 100)
  );
  // Calculate overall statistics
  const totalConsumed = data.reduce((a, b) => a + b, 0);
  const totalTarget = monthsData.length * targetPerMonth;
  const overallPercentage = Math.round((totalConsumed / totalTarget) * 100);
  return {
    labels,
    data,
    percentages,
    datasets: [{
      data,
    }],
    hasData: totalConsumed > 0,
    statistics: {
      totalConsumed,
      totalTarget,
      overallPercentage,
      monthlyAverage: Math.round(totalConsumed / months * 10) / 10,
      bestMonth: monthsData.reduce((best, m) => 
        m.count > best.count ? m : best, monthsData[0]
      ).label,
    },
    rawData: monthsData,
  };
};
/**
 * Transform weekly consumption data for progress display
 * @param {array} consumptionRecords - Array of consumption records
 * @param {Date} weekStart - Start of the week
 * @returns {object} Weekly progress data
 */
export const transformWeeklyConsumption = (consumptionRecords, weekStart = null) => {
  const weekDates = getWeekDates(weekStart);
  
  const weekData = weekDates.map((date, index) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const consumed = Array.isArray(consumptionRecords) && consumptionRecords.some(record => {
      const recordDate = new Date(record.consumptionDate || record.date || record.createdAt);
      return recordDate >= dayStart && recordDate <= dayEnd;
    });
    return {
      date,
      dayName: getShortDayName(date.getDay()),
      dayNumber: date.getDate(),
      consumed,
      isToday: new Date().toDateString() === date.toDateString(),
      isPast: date < new Date() && !consumed,
      isFuture: date > new Date(),
    };
  });
  const consumedCount = weekData.filter(d => d.consumed).length;
  return {
    days: weekData,
    consumedCount,
    totalDays: 7,
    percentage: Math.round((consumedCount / 7) * 100),
    isComplete: consumedCount === 7,
    missedDays: weekData.filter(d => d.isPast).length,
  };
};
/**
 * Transform HB data for progress ring/circle
 * @param {number} currentHb - Current HB value
 * @param {object} options - Options
 * @returns {object} Progress ring data
 */
export const transformHbForProgressRing = (currentHb, options = {}) => {
  const {
    normalMin = 12.0,
    normalMax = 15.5,
    dangerThreshold = 10.0,
    warningThreshold = 11.0,
  } = options;
  if (!currentHb || currentHb <= 0) {
    return {
      value: 0,
      percentage: 0,
      color: 'gray',
      status: 'unknown',
      statusText: 'Belum ada data',
      formattedValue: '-',
    };
  }
  // Calculate percentage based on normal range
  const midPoint = (normalMin + normalMax) / 2;
  let percentage = (currentHb / midPoint) * 100;
  percentage = Math.min(Math.max(percentage, 0), 120); // Cap at 120%
  // Determine status and color
  let color, status, statusText;
  if (currentHb < dangerThreshold) {
    color = 'danger';
    status = 'danger';
    statusText = 'Anemia Berat';
  } else if (currentHb < warningThreshold) {
    color = 'warning';
    status = 'warning';
    statusText = 'Anemia Ringan';
  } else if (currentHb < normalMin) {
    color = 'warning';
    status = 'low';
    statusText = 'Di Bawah Normal';
  } else if (currentHb <= normalMax) {
    color = 'success';
    status = 'normal';
    statusText = 'Normal';
  } else {
    color = 'warning';
    status = 'high';
    statusText = 'Di Atas Normal';
  }
  return {
    value: currentHb,
    percentage: Math.round(percentage),
    color,
    status,
    statusText,
    formattedValue: `${currentHb.toFixed(1)} g/dL`,
    normalRange: { min: normalMin, max: normalMax },
  };
};
/**
 * Transform consumption data for donut/pie chart
 * @param {number} consumed - Number of vitamins consumed
 * @param {number} target - Target number
 * @returns {object} Donut chart data
 */
export const transformConsumptionForDonut = (consumed, target) => {
  const remaining = Math.max(target - consumed, 0);
  const percentage = Math.min(Math.round((consumed / target) * 100), 100);
  // Determine status
  let status, color, statusText;
  if (percentage >= 100) {
    status = 'complete';
    color = 'success';
    statusText = 'Target Tercapai!';
  } else if (percentage >= 75) {
    status = 'good';
    color = 'primary';
    statusText = 'Hampir Tercapai';
  } else if (percentage >= 50) {
    status = 'moderate';
    color = 'warning';
    statusText = 'Terus Semangat!';
  } else {
    status = 'low';
    color = 'danger';
    statusText = 'Perlu Ditingkatkan';
  }
  return {
    consumed,
    remaining,
    target,
    percentage,
    status,
    color,
    statusText,
    data: [
      { value: consumed, color: color },
      { value: remaining, color: 'lightGray' },
    ],
    formattedText: `${consumed}/${target}`,
  };
};
/**
 * Transform history data for list display
 * @param {array} records - History records
 * @param {object} options - Options
 * @returns {array} Formatted history items
 */
export const transformHistoryForList = (records, options = {}) => {
  const {
    groupByDate = true,
    limit = 50,
  } = options;
  if (!Array.isArray(records) || records.length === 0) {
    return [];
  }
  const sortedRecords = [...records]
    .sort((a, b) => {
      const dateA = new Date(a.consumptionDate || a.date || a.createdAt);
      const dateB = new Date(b.consumptionDate || b.date || b.createdAt);
      return dateB - dateA; // Most recent first
    })
    .slice(0, limit);
  if (!groupByDate) {
    return sortedRecords.map(transformHistoryItem);
  }
  // Group by date
  const grouped = {};
  sortedRecords.forEach(record => {
    const date = new Date(record.consumptionDate || record.date || record.createdAt);
    const dateKey = date.toDateString();
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date,
        dateLabel: formatShortDate(date),
        items: [],
      };
    }
    grouped[dateKey].items.push(transformHistoryItem(record));
  });
  return Object.values(grouped);
};
/**
 * Transform single history item
 * @param {object} record - History record
 * @returns {object} Formatted history item
 */
const transformHistoryItem = (record) => {
  const date = new Date(record.consumptionDate || record.date || record.createdAt);
  
  // Determine status
  let statusIcon, statusColor, statusText;
  switch (record.status) {
    case 'verified':
      statusIcon = 'checkmark-circle';
      statusColor = 'success';
      statusText = 'Terverifikasi';
      break;
    case 'pending':
      statusIcon = 'time';
      statusColor = 'warning';
      statusText = 'Menunggu';
      break;
    case 'rejected':
      statusIcon = 'close-circle';
      statusColor = 'danger';
      statusText = 'Ditolak';
      break;
    default:
      statusIcon = 'ellipse';
      statusColor = 'gray';
      statusText = 'Selesai';
  }
  return {
    id: record.id,
    date,
    dateLabel: formatShortDate(date),
    hbValue: record.hbValue ? `${record.hbValue.toFixed(1)} g/dL` : null,
    vitaminType: record.vitaminType || 'TTD',
    imageUrl: record.imageUrl,
    notes: record.notes,
    status: record.status,
    statusIcon,
    statusColor,
    statusText,
  };
};
/**
 * Generate mock chart data for development/demo
 * @param {string} type - Type of chart data
 * @param {object} options - Generation options
 * @returns {object} Mock chart data
 */
export const generateMockChartData = (type, options = {}) => {
  switch (type) {
    case 'hb-trend': {
      const { days = 7 } = options;
      const records = [];
      const baseHb = 12.5;
      
      for (let i = days - 1; i >= 0; i--) {
        records.push({
          date: addDays(new Date(), -i),
          value: baseHb + (Math.random() - 0.5) * 2,
        });
      }
      return transformHbDataForLineChart(records);
    }
    case 'consumption-monthly': {
      const { months = 6 } = options;
      const records = [];
      
      for (let i = months - 1; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const count = Math.floor(Math.random() * 8) + 4; // 4-12 per month
        
        for (let j = 0; j < count; j++) {
          records.push({
            consumptionDate: new Date(monthDate.getFullYear(), monthDate.getMonth(), j + 1),
          });
        }
      }
      return transformConsumptionForBarChart(records);
    }
    case 'weekly-progress': {
      const records = [];
      const weekDates = getWeekDates();
      
      weekDates.forEach((date, index) => {
        if (Math.random() > 0.3 && date <= new Date()) { // 70% chance of consumption
          records.push({ consumptionDate: date });
        }
      });
      return transformWeeklyConsumption(records);
    }
    default:
      return null;
  }
};
export default {
  transformHbDataForLineChart,
  transformConsumptionForBarChart,
  transformWeeklyConsumption,
  transformHbForProgressRing,
  transformConsumptionForDonut,
  transformHistoryForList,
  generateMockChartData,
};
