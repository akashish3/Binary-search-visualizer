async function startSearch() {
    let arrayInput = document.getElementById("arrayInput").value.trim();
    let targetInput = document.getElementById("targetInput").value.trim();
    let visualizer = document.getElementById("visualizer");
    let resultDiv = document.getElementById("result");

    // Validate input
    if (!arrayInput || isNaN(targetInput)) {
        alert("⚠️ Please enter a valid array and target number.");
        return;
    }

    let array = arrayInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    let target = parseInt(targetInput);

    visualizer.innerHTML = '';
    resultDiv.innerHTML = '';

    // Sort array
    array.sort((a, b) => a - b);

    // Render bars
    array.forEach(num => {
        let div = document.createElement("div");
        div.className = "bar";
        div.innerText = num;
        div.style.transition = "all 0.5s ease"; // smooth color/size transitions
        visualizer.appendChild(div);
    });

    let left = 0, right = array.length - 1, steps = 0;

    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        let bars = document.querySelectorAll(".bar");

        // Highlight current bar
        bars[mid].style.backgroundColor = "orange";
        bars[mid].style.transform = "scale(1.2)";
        await new Promise(r => setTimeout(r, 1000));

        steps++;

        if (array[mid] === target) {
            bars[mid].style.backgroundColor = "limegreen";
            bars[mid].style.transform = "scale(1.4)";
            resultDiv.innerHTML = `✅ Found <b>${target}</b> in <b>${steps}</b> steps!`;
            saveSearch(array, target, steps, true);
            return;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        // Reset bar style after check
        bars[mid].style.backgroundColor = "#99afd9";
        bars[mid].style.transform = "scale(1)";
    }

    resultDiv.innerHTML = `❌ Number not found after <b>${steps}</b> steps.`;
    saveSearch(array, target, steps, false);
}

// Send search result to backend
async function saveSearch(array, target, steps, found) {
    try {
        let response = await fetch('/save-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array, target, steps, found })
        });

        if (!response.ok) {
            throw new Error("Failed to save search result.");
        }
        console.log("Search result saved successfully!");
    } catch (error) {
        console.error("Error saving search:", error);
    }
}
