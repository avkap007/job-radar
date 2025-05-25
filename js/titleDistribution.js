const ctxTitle = document.getElementById('titleDistributionChart').getContext('2d');

const labels = [
  'Cybersecurity',
  'Data Science',
  'IT',
  'Product Management',
  'Software Engineering'
];

const shortLabels = [
  'CS', 'DS', 'IT', 'PM', 'SWE'
];

const values = [
  15551,  // Cybersecurity
  8934,   // Data Science
  21960,  // IT
  13725,  // Product Management
  34354   // Software Engineering
];

const backgroundColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF'
];

new Chart(ctxTitle, {
  type: 'polarArea',
  data: {
    labels: labels,
    datasets: [{
      label: 'Job Count by Domain',
      data: values,
      backgroundColor: backgroundColors
    }]
  },
  options: {
    responsive: true,
    layout: {
      padding: 20
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: function(chart) {
            const original = Chart.defaults.plugins.legend.labels.generateLabels;
            const labelsArr = original(chart);
            return labelsArr.map((item, i) => ({
              ...item,
              text: shortLabels[i] || item.text
            }));
          },
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: 18
        },
        align: 'center'
      }
    },
    scale: {
      ticks: {
        font: {
          size: 16
        }
      }
    }
  }
});
