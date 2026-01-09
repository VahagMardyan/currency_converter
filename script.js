import { convertMoney } from './converter.js';
import { loadOptions } from './options.js';

const select_source = document.querySelector('#source');
const search_source = document.getElementById("search-source");

const select_target = document.querySelector('#target');
const search_target = document.getElementById('search-target');

const btn_convert = document.querySelector('#convert');
const btn_convert_by_real_time = document.querySelector('#convertByRealTime');
const btn_reset = document.querySelector('#reset');

const btn_swap = document.getElementById('swap-btn');
const source_flag = document.getElementById('source-flag');
const target_flag = document.getElementById('target-flag');

function updateFlag(selectElement, flagElement) {
    let countryCode = selectElement.value.slice(0,2);
    if(selectElement.value === "EUR") {
        flagElement.src = "./logo/eu_flag.png";
    } else {
        flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
    flagElement.alt = countryCode;
    const global_flag = "./logo/global_flag.png";
    flagElement.onerror = () => {
        flagElement.src = global_flag;
        flagElement.onerror = null;
    }
}

select_source.addEventListener('change', () => {
    updateFlag(select_source, source_flag); 
});

select_target.addEventListener('change', () => {
    updateFlag(select_target, target_flag);
});

const LOCAL_JSON = "./json_files/data.json";
const API_URL = "https://api.currencyapi.com/v3/latest?apikey=KL7RHTiYo19Y1yaIozLDbXLfdL3VdjvtxbOXL6SV";

let sourceOptions = [];
let targetOptions = [];

function initializeSearch() {
    sourceOptions = Array.from(select_source.options);
    targetOptions = Array.from(select_target.options);
}

function renderSourceOptions() {
    const searchTerm = search_source.value.toLowerCase();
    select_source.innerHTML = '';

    if(searchTerm === "") {
        sourceOptions.forEach(option => select_source.append(option));
        select_source.selectedIndex = 0;
        updateFlag(select_source, source_flag);
        return;
    }

    sourceOptions.forEach((option) => {
        const optionText = option.innerText.toLowerCase();
        if (optionText.includes(searchTerm) || searchTerm === '') {
            select_source.append(option);
        }
    });
    if(select_source.options.length > 0) {
        updateFlag(select_source, source_flag);
    }
}

function renderTargetOptions() {
    const searchTerm = search_target.value.toLowerCase();
    select_target.innerHTML = '';

    if(searchTerm === "") {
        targetOptions.forEach(option => select_target.append(option));
        select_target.selectedIndex = 0;
        updateFlag(select_target, target_flag);
        return;
    }

    targetOptions.forEach((option) => {
        const optionText = option.innerText.toLowerCase();
        if (optionText.includes(searchTerm) || searchTerm === '') {
            select_target.append(option);
        }
    });
    if(select_target.options.length > 0) {
        updateFlag(select_target, target_flag);
    }
}

search_source.addEventListener('input', renderSourceOptions);
search_target.addEventListener('input', renderTargetOptions);

// IIFE function
(async function() {
    try {
        await loadOptions();
        initializeSearch();
        console.log("System is ready: Options are loaded and search is initialized.");
    } catch(err) {
        console.error(`Setup failed: ${err}`);
    }
}) ();

btn_convert.addEventListener('click', (event)=>{
    convertMoney(LOCAL_JSON, event.target);
});

btn_convert_by_real_time.addEventListener('click', (event) => {
    convertMoney(API_URL, event.target);
});

btn_reset.addEventListener('click', () => {
    location.reload();
});

btn_swap.addEventListener('click', ()=> {
    const currentSource = select_source.value;
    const currentTarget = select_target.value;
    
    search_source.value = "";
    search_target.value = "";

    select_source.innerHTML = "";
    sourceOptions.forEach(option => select_source.append(option));

    select_target.innerHTML = "";
    targetOptions.forEach(option => select_target.append(option));

    select_source.value = currentTarget;
    select_target.value = currentSource;

    updateFlag(select_source, source_flag);
    updateFlag(select_target, target_flag);
});

document.addEventListener('keypress', (event) => {
    event.key === 'Enter' ? 
    convertMoney(API_URL,btn_convert_by_real_time) : 
    event.altKey && event.key === "Enter" ? convertMoney(LOCAL_JSON, btn_convert) : null;
});

search_target.addEventListener('keyup', renderTargetOptions);
search_source.addEventListener('keyup', renderSourceOptions);
