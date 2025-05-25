const jobFileMap = {
  "Product Management": "https://pub-996255c4a0d54b46a78714bf4395d8be.r2.dev/pm_jobs_clean.json",
  "Cybersecurity": "https://pub-996255c4a0d54b46a78714bf4395d8be.r2.dev/cs_jobs_clean.json",
  "Software Engineering": "https://pub-996255c4a0d54b46a78714bf4395d8be.r2.dev/swe_jobs_clean.json",
  "Data Science": "https://pub-996255c4a0d54b46a78714bf4395d8be.r2.dev/ds_jobs_clean.json",
  "IT": "https://pub-996255c4a0d54b46a78714bf4395d8be.r2.dev/it_jobs_clean.json"
};

document.getElementById("jobTypeSelector").addEventListener("change", e => {
  const url = jobFileMap[e.target.value];
  loadJobDashboard(url);
});

function loadJobDashboard(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.getElementById("visualizationContainer").innerHTML = `
        <div class="dashboard-grid">
          <div class="dashboard-left">
            <div class="chart-box"><canvas id="salaryChart"></canvas></div>
            <div id="skillBlobArea"></div>
          </div>
          <div class="dashboard-right">
            <div class="remote-no-card"><canvas id="remoteChart"></canvas></div>
            <div class="education-no-card" id="educationChartArea"></div>
          </div>
        </div>
      `;

      drawSalaryChart(data);
      drawRemoteChart(data);
      drawSkillBlob(data);
      drawEducationChart(data);
    });
}

function drawSalaryChart(data) {
  const bucketSize = 20000;
  const minSalary = 60000;
  const maxSalary = 420000;

  const bucketLabels = [];
  const bucketMap = {};

  for (let start = minSalary; start <= maxSalary; start += bucketSize) {
    const label = `$${(start / 1000).toFixed(0)}k–$${((start + bucketSize) / 1000).toFixed(0)}k`;
    bucketLabels.push(label);
    bucketMap[label] = { count: 0 };
  }

  data.forEach(job => {
    const salary = job.mean_salary;
    if (!salary || salary < minSalary || salary > maxSalary) return;
    const index = Math.floor((salary - minSalary) / bucketSize);
    const label = bucketLabels[index];
    if (label) bucketMap[label].count += 1;
  });

  const maxCount = Math.max(...Object.values(bucketMap).map(b => b.count));

  const dataset = bucketLabels.map((label, i) => ({
    x: i + 1,
    y: bucketMap[label].count,
    r: 8 + (bucketMap[label].count / maxCount) * 20,
    label
  }));

  new Chart(document.getElementById("salaryChart"), {
    type: "bubble",
    data: {
      datasets: [{
        label: "Jobs per Salary Bucket",
        data: dataset,
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        borderColor: "#1c78c0"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.raw.label}: ${ctx.raw.y} jobs`
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: "Salary Range" },
          ticks: {
            callback: (val) => bucketLabels[val - 1] || ''
          },
          grid: { color: "rgba(0,0,0,0.05)" }
        },
        y: {
          title: { display: true, text: "Number of Jobs" },
          beginAtZero: true,
          grid: { color: "rgba(0,0,0,0.05)" }
        }
      }
    }
  });
}

function drawRemoteChart(data) {
  const remote = data.filter(j => j.is_remote).length;
  const onsite = data.length - remote;
  new Chart(document.getElementById("remoteChart"), {
    type: "pie",
    data: {
      labels: ["Remote", "On-site"],
      datasets: [{
        data: [remote, onsite],
        backgroundColor: ["#36A2EB", "#FF6384"]
      }]
    }
  });
}

function drawSkillBlob(data) {
  const commonSkills = [
    "python", "aws", "gcp", "leadership", "security", "compliance", "sql",
    "javascript", "agile", "kubernetes", "linux", "docker", "excel",
    "tableau", "react", "machine learning", "communication", "teamwork"
  ];

  const freq = Object.fromEntries(commonSkills.map(skill => [skill, 0]));

  data.forEach(job => {
    const desc = (job.cleaned_description || "").toLowerCase();
    commonSkills.forEach(skill => {
      if (desc.includes(skill)) freq[skill]++;
    });
  });

  const top = Object.entries(freq)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const minFont = 14;
  const maxFont = 28;
  const counts = top.map(([_, c]) => c);
  const min = Math.min(...counts), max = Math.max(...counts);

  const blobContainer = document.createElement("div");
  blobContainer.className = "skill-blob-container";

  top.forEach(([word, count]) => {
    const span = document.createElement("span");
    span.textContent = word;
    span.className = "skill-blob";
    const size = minFont + (count - min) / (max - min || 1) * (maxFont - minFont);
    const rand = Math.random();
    span.style.fontSize = `${size}px`;
    span.style.setProperty('--rand', rand);
    blobContainer.appendChild(span);
  });

  document.getElementById("skillBlobArea").appendChild(blobContainer);
}

function drawEducationChart(data) {
  const eduCounts = {
    "Bachelors": 0,
    "Masters": 0,
    "PhD": 0,
    "Certifications": 0,
    "No Explicit Requirement": 0
  };

  const patterns = {
    "Bachelors": /\b(bachelor|undergraduate|b\.sc|bsc|bs)\b/i,
    "Masters": /\b(master|m\.sc|msc|ms)\b/i,
    "PhD": /\b(ph\.?d|doctoral|doctorate)\b/i,
    "Certifications": /\b(certification|certified|certificate)\b/i,
    "No Explicit Requirement": /\b(no degree required|no education requirement|not required)\b/i
  };

  data.forEach(job => {
    const text = (job.cleaned_description || "").toLowerCase();
    let matched = false;
    for (const [label, regex] of Object.entries(patterns)) {
      if (regex.test(text)) {
        eduCounts[label]++;
        matched = true;
      }
    }
    if (!matched) {
      eduCounts["No Explicit Requirement"]++;
    }
  });

  const ctx = document.createElement("canvas");
  ctx.id = "educationChart";
  document.getElementById("educationChartArea").appendChild(ctx);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(eduCounts),
      datasets: [{
        label: "Mentions of Education Level",
        data: Object.values(eduCounts),
        backgroundColor: "#fcb900"
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}