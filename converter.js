export function convertMoney(path, btnElement) {
    const source = document.getElementById('source').value;
    const target = document.getElementById('target').value;
    
    const value = document.getElementById('value').value;
    const result = document.getElementById('result');

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

    fetch(path)
        .then(response => {
            if(!response.ok) {
                throw new Error("Network problem or API limit is over.");
            }
            return response.json();
        })
        .then(data => {
                const sourceRate = data.data[source].value;
                const targetRate = data.data[target].value;
                const converted = (value * targetRate / sourceRate).toFixed(5);

                statusSpan.innerText = `As of "${data.meta['last_updated_at']}"`;
                result.style.color = "#dFF6FF";
                return result.value = `${value} ${source} is ${converted} ${target}`;
        })
        .catch(error => {
            console.error(`Error: ${error}`);
            alert(`Some error happened: ${error.message}`);
        })
        .finally(()=>{
            if(btnElement) {
                btnElement.disabled = false;
            }
        });
}