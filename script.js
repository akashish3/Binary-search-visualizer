let array = [];
let target;
let left, right, steps;
let bars;
let mid;
let autoRunning = false;
let paused = false;

// Initialize search
function initSearch() {
    let arrayInput = document.getElementById("arrayInput").value.trim();
    let targetInput = document.getElementById("targetInput").value.trim();
    let visualizer = document.getElementById("visualizer");
    let resultDiv = document.getElementById("result");

    if (!arrayInput || isNaN(targetInput)) {
        alert("⚠️ Please enter a valid array and target number.");
        return;
    }

    array = arrayInput.split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));
    target = parseInt(targetInput);

    visualizer.innerHTML = '';
    resultDiv.innerHTML = '';

    array.sort((a, b) => a - b);

    array.forEach(num => {
        let div = document.createElement("div");
        div.className = "bar";
        div.innerText = num;
        visualizer.appendChild(div);
    });

    bars = document.querySelectorAll(".bar");
    left = 0;
    right = array.length - 1;
    steps = 0;
    mid = null;
    autoRunning = false;
    paused = false;
}

// Auto Mode with Play/Pause
async function startSearch() {
    autoRunning = true;
    paused = false;
    let resultDiv = document.getElementById("result");

    while (left <= right && autoRunning) {
        if (paused) {
            await new Promise(r => setTimeout(r, 200)); // wait while paused
            continue;
        }

        mid = Math.floor(left + (right - left) / 2);
        bars.forEach(bar => bar.classList.remove("active", "found"));

        bars[mid].classList.add("active");
        await new Promise(r => setTimeout(r, 1000));

        steps++;

        if (array[mid] === target) {
            bars[mid].classList.remove("active");
            bars[mid].classList.add("found");
            resultDiv.innerHTML = `✅ Found <b>${target}</b> in <b>${steps}</b> steps!`;
            saveSearch(array, target, steps, true);
            autoRunning = false;
            return;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (autoRunning) {
        resultDiv.innerHTML = `❌ Number not found after <b>${steps}</b> steps.`;
        saveSearch(array, target, steps, false);
    }
}

// Toggle Play/Pause
function togglePause() {
    paused = !paused;
    document.getElementById("pauseBtn").innerText = paused ? "Resume" : "Pause";
}

// Step Mode
function nextStep() {
    let resultDiv = document.getElementById("result");

    if (left > right) {
        resultDiv.innerHTML = `❌ Number not found after <b>${steps}</b> steps.`;
        saveSearch(array, target, steps, false);
        return;
    }

    mid = Math.floor(left + (right - left) / 2);
    steps++;

    bars.forEach(bar => bar.classList.remove("active", "found"));
    bars[mid].classList.add("active");

    if (array[mid] === target) {
        bars[mid].classList.remove("active");
        bars[mid].classList.add("found");
        resultDiv.innerHTML = `✅ Found <b>${target}</b> in <b>${steps}</b> steps!`;
        saveSearch(array, target, steps, true);
    } else if (array[mid] < target) {
        left = mid + 1;
    } else {
        right = mid - 1;
    }
}

// Reset
function resetSearch() {
    document.getElementById("visualizer").innerHTML = '';
    document.getElementById("result").innerHTML = '';
    array = [];
    target = null;
    left = right = steps = 0;
    bars = null;
    mid = null;
    autoRunning = false;
    paused = false;
    document.getElementById("pauseBtn").innerText = "Pause";
}

// Backend logging
async function saveSearch(array, target, steps, found) {
    try {
        let response = await fetch('/save-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array, target, steps, found })
        });

        if (!response.ok) throw new Error("Failed to save search result.");
        console.log("Search result saved successfully!");
    } catch (error) {
        console.error("Error saving search:", error);
    }
}

// Event listeners
document.getElementById("nextBtn").addEventListener("click", nextStep);
document.getElementById("resetBtn").addEventListener("click", resetSearch);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
