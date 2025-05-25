const ctxTitle = document.getElementById('titleDistributionChart').getContext('2d');

const labels = [
  'Cybersecurity',
  'Data Science',
  'IT',
  'Product Management',
  'Software Engineering'
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
          font: {
            size: 10,
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
