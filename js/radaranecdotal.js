const anecdotalContainer = document.getElementById('anecdotal-buttons');
const displayCharts = [];
const recentJobs = [];

// Initialize radar charts
for (let i = 1; i <= 4; i++) {
    const ctx = document.getElementById(`display${i}`).getContext('2d');
    const chart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Salary',
                'Work Life Balance',
                'Creativity',
                'Autonomy',
                'Travel/Remote',
                'Education'
            ],
            datasets: []
        },
        options: {
            elements: {
                line: { borderWidth: 3 }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start'
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        backdropColor: 'rgba(255,255,255,0.9)'
                    },
                    angleLines: { color: '#ddd' },
                    grid: { color: '#eee' },
                    pointLabels: { font: { size: 12 } }
                }
            }
        }
    });
    displayCharts.push(chart);
}

// Fetch jobs.json and create buttons
fetch('jobs.json')
    .then(response => response.json())
    .then(jobs => {
        jobs.forEach(job => {
            const button = document.createElement('button');
            button.className = 'job-button';
            button.textContent = job.name;
            button.onclick = () => updateCharts(job);
            anecdotalContainer.appendChild(button);
        console.log("Jobs loaded:", jobs); // Debugging line
        });

        // Show first 4 jobs by default
        jobs.slice(0, 4).forEach(updateCharts);

        // Fill remaining charts if fewer than 4 clicks
        displayCharts.forEach((chart, index) => {
            if (chart.data.datasets.length === 0) {
                updateCharts(jobs[index + 4] || jobs[0]);
            }
        });
    })
    .catch(err => console.error('Error loading jobs.json', err));

// Updates radar chart queue
function updateCharts(job) {
    console.log("Updating chart with job:", job.name);// Debugging line
    const index = recentJobs.findIndex(j => j.id === job.id);
    if (index > -1) recentJobs.splice(index, 1);
    recentJobs.unshift(job);
    if (recentJobs.length > 4) recentJobs.pop();

    recentJobs.forEach((job, i) => {
        const chart = displayCharts[i];
        const color = `hsl(${job.id * 20}, 70%, 50%)`;
        chart.data = {
            labels: [
                'Salary',
                'Work Life Balance',
                'Creativity',
                'Autonomy',
                'Travel/Remote',
                'Education'
            ],
            datasets: [{
                label: job.name,
                data: job.data,
                fill: true,
                backgroundColor: `hsla(${job.id * 20}, 70%, 50%, 0.2)`,
                borderColor: color,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: color
            }]
        };
        chart.update();
    });
}
