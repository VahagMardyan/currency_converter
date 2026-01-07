// // data 2026-01-06T23:59:59Z
export function convertMoney() {
    const source = document.getElementById('source').value;
    const target = document.getElementById('target').value;
    
    const value = document.getElementById('value').value;
    const result = document.getElementById('result');

    if (!source) {
        alert("Choose source currency!");
        return;
    }

    if (!target) {
        alert("Choose target currency!");
        return;
    }

    if (!value) {
        alert("Input money!");
        return;
    }

    fetch('./json_files/data.json')
        .then(response => response.json())
        .then(data => {
            if (isNaN(value)) {
                alert(`Invalid character "${value}": Input Number`);
                return;
            } else {
                const sourceRate = data.data[source].value;
                const targetRate = data.data[target].value;
                const converted = (value * targetRate / sourceRate).toFixed(5);
                document.querySelector('span').innerText = `As of "${data.meta['last_updated_at']}"`;
                result.style.color = "#dFF6FF";
                return result.value = `${value} ${source} is ${converted} ${target}`;
            }
        });
}

// // Real API REQUEST
export function convertMoneyByRealTime() {
    const source = document.getElementById('source').value;
    const target = document.getElementById('target').value;

    const value = document.getElementById('value').value;
    const result = document.getElementById('result');

    if (!source) {
        alert("Choose source currency!");
        return;
    }

    if (!target) {
        alert("Choose target currency!");
        return;
    }

    if (!value) {
        alert("Input money!");
        return;
    }

    fetch('https://api.currencyapi.com/v3/latest?apikey=KL7RHTiYo19Y1yaIozLDbXLfdL3VdjvtxbOXL6SV')
        .then(response => response.json())
        .then(data => {
            if (isNaN(value)) {
                alert(`Invalid character "${value}": Input Number`);
                return;
            }
            const sourceRate = data.data[source].value;
            const targetRate = data.data[target].value;
            const converted = (value * targetRate / sourceRate).toFixed(5);
            document.querySelector('span').innerText = `As of "${data.meta['last_updated_at']}"`;
            result.style.color = "#dFF6FF";
            result.value = `${value} ${source} is ${converted} ${target}`;
        });
}

