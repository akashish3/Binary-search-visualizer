async function startSearch() {
    let array = document.getElementById("arrayInput").value.split(',').map(Number);
    let target = parseInt(document.getElementById("targetInput").value);
    let visualizer = document.getElementById("visualizer");
    let resultDiv = document.getElementById("result");

    if (!array.length || isNaN(target)) {
        alert("Please enter a valid array and target number.");
        return;
    }

    visualizer.innerHTML = '';
    resultDiv.innerHTML = '';

    array.sort((a, b) => a - b);
    array.forEach(num => {
        let div = document.createElement("div");
        div.className = "bar";
        div.innerText = num;
        visualizer.appendChild(div);
    });

    let left = 0, right = array.length - 1, steps = 0;
    while (left <= right) {
        let mid = Math.floor(left + (right-left)/ 2);
        let bars = document.querySelectorAll(".bar");
        
        bars[mid].style.backgroundColor = "orange";
        await new Promise(r => setTimeout(r, 1000));

        steps++;
        if (array[mid] === target) {
            bars[mid].style.backgroundColor = "green";
            resultDiv.innerHTML = 'Found ${target} in ${steps} steps!';
            saveSearch(array, target, steps, true);
            return;
        } else if (array[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
        bars[mid].style.backgroundColor = "lightblue";
    }

    resultDiv.innerHTML = 'Number not found after ${steps} steps.';
    saveSearch(array, target, steps, false);
}

// Send search result to backend
function saveSearch(array, target, steps, found) {
    fetch('/save-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ array, target, steps, found })
    });
}
