/** @type {HTMLCanvasElement} */

//Load settings
const defaults = {
    dotCount: 1000,
    maxSpeed: 3.0,
    minSpeed: 0.01,
    speedFactor: 250,
    defaultRadius: 2,
    radiusScaling: 200,
    darkeningAmount: 0.99,
    color: chroma.random()
};

const urlSearchParams = new URLSearchParams(window.location.search);

function getParam(paramName) {
    const paramValue = urlSearchParams.get(paramName);
    return paramValue !== null ? paramValue : defaults[paramName];
}

const dotCount = getParam('dotCount');
const maxSpeed = getParam('maxSpeed');
const minSpeed = getParam('minSpeed');
const speedFactor = getParam('speedFactor');
const defaultRadius = getParam('defaultRadius');
const radiusScaling = getParam('radiusScaling');
const darkeningAmount = getParam('darkeningAmount');
const colorParam = getParam('color');

//Setup color
const correctedColor = chroma(chroma.random()).saturate(2).hex();;

const darkenedColor = chroma.mix(correctedColor, 'black', darkeningAmount);
document.querySelector(':root').style.setProperty('--color', darkenedColor);

function randomNum(min, max) {
    return Math.random() * (max - min + 1) + min;
}

//Init canvas
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Create dots
const maxRadius = (canvas.width / minSpeed) / 100;
const dots = [];

for (let i = 0; i < dotCount; i++) {
    const dot = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        color: chroma(darkenedColor).saturate(randomNum(1, 10))
    };
    dots.push(dot);
}

function updateDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        const dx = 2 + (centerX - dot.x);
        const dy = 2 + (centerY - dot.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        dot.x -= (dot.speed / speedFactor) * dx;
        dot.y -= (dot.speed / speedFactor) * dy;

        dot.radius = (distance / dot.speed) / radiusScaling;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.closePath();

        if (dot.x < -maxRadius || dot.x > canvas.width + maxRadius || dot.y < -maxRadius || dot.y > canvas.height + maxRadius) {
            dot.x = centerX + randomNum(-10, 10);
            dot.y = centerY + randomNum(-10, 10);
        }
    }

    requestAnimationFrame(updateDots);
}

updateDots();