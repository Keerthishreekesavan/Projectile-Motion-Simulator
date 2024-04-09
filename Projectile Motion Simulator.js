const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const simulateButton = document.getElementById('simulate');
const chartCanvas = document.getElementById('chart');
const chartContext = chartCanvas.getContext('2d');

const chartData = {
    labels: [],
    datasets: [
        {
            label: 'Projectile Height (m)',
            borderColor: 'blue',
            borderWidth: 2,
            data: [],
        },
    ],
};

const chartConfig = {
    type: 'line',
    data: chartData,
    options: {
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    },
};

const heightChart = new Chart(chartContext, chartConfig);

simulateButton.addEventListener('click', () => {
    const initialVelocity = parseFloat(document.getElementById('velocity').value);
    const launchAngle = parseFloat(document.getElementById('angle').value);
    simulateProjectile(initialVelocity, launchAngle);
});

function simulateProjectile(initialVelocity, launchAngle) {
    const g = 9.81; // Acceleration due to gravity (m/s^2)
    const angleInRadians = (launchAngle * Math.PI) / 180;

    const timeOfFlight = (2 * initialVelocity * Math.sin(angleInRadians)) / g;
    const range = (initialVelocity ** 2 * Math.sin(2 * angleInRadians)) / g;

    const timeInterval = timeOfFlight / 100;
    const xCoordinates = [];
    const yCoordinates = [];

    for (let t = 0; t <= timeOfFlight; t += timeInterval) {
        const x = initialVelocity * Math.cos(angleInRadians) * t;
        const y = initialVelocity * Math.sin(angleInRadians) * t - (0.5 * g * t * t);
        xCoordinates.push(x);
        yCoordinates.push(y);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i < xCoordinates.length; i++) {
        ctx.lineTo(xCoordinates[i], canvas.height - yCoordinates[i]);
    }
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    chartData.labels = xCoordinates.map((_, i) => i * timeInterval);
    chartData.datasets[0].data = yCoordinates;

    heightChart.update();
}