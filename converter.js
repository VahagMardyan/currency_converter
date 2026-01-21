export async function convertMoney(sourceData, btnElement) {
    const source = document.getElementById('source').value;
    const target = document.getElementById('target').value;
    const value = document.getElementById('value').value;
    const statusSpan = document.querySelector('span');

    if(!source || !target || !value) {
        alert("Please fill all fields");
        return;
    }

    if(isNaN(value)) {
        alert(`Invalid character "${value}": Input Number`);
        return;
    }

    if(btnElement) {
        btnElement.disabled = true;
        statusSpan.innerText = "Loading...";
    }

    try {
        let data;
        if(typeof sourceData === "string") {
            if(btnElement) {
                btnElement.disabled = true;
                document.querySelector("span").innerText = "Loading...";
            }
            const response = await fetch(sourceData);
            if(!response.ok) {
                throw new Error("Network problem or API limit is over.");
            }
            data = await response.json();
        } else {
            data = sourceData;
        }
        if(!data) {
            throw new Error("No data available");
        }
        const result = document.getElementById('result');

        const sourceRate = data.data[source].value;
        const targetRate = data.data[target].value;
        const converted = (value * targetRate / sourceRate).toFixed(5);
        statusSpan.innerText = `As of "${data.meta['last_updated_at']}"`;

        result.value = `${value} ${source} is ${converted} ${target}`;
    } catch(error) {
        alert(error.message);
    } finally {
        if(btnElement) {
            btnElement.disabled = false;
        }
    }
}