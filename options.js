export async function loadOptions() {
    try {
        const response = await fetch('./json_files/codes.json');
        const codes = await response.json();
        
        const sourceSelect = document.getElementById('source');
        const targetSelect = document.getElementById('target');

        const currencyNames = new Intl.DisplayNames(['en'], {type: 'currency'});
        codes.sort();

        let optionsHtml = "";
        codes.forEach(code => {
            let fullName;
            try {
                const displayName = currencyNames.of(code);
                if(displayName.toUpperCase() === code.toUpperCase()) {
                    fullName = code;
                } else {
                    fullName = `${displayName} (${code})`;
                }
            } catch(e) {
                fullName = code;
            }
            optionsHtml += `<option value="${code}">${fullName}</option>`;
        });
        sourceSelect.innerHTML += optionsHtml;
        targetSelect.innerHTML += optionsHtml;

    } catch(error) {
        console.error(`Error: ${error}`);   
    }
}