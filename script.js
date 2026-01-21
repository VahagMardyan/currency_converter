import { convertMoney } from './converter.js';
import { loadOptions } from './options.js';
// import API_KEY from "./ApiKey.js";

const API_KEY = "YOUR_API_KEY";
const LOCAL_JSON = "./json_files/data.json";
const API_URL = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}`;

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

let cachedLocalData = null;
fetch(LOCAL_JSON)
.then(response => response.json())
.then(data => {
    cachedLocalData = data;
    btn_convert.title = `Convert as of ${data.meta['last_updated_at']}`;
})
.catch(err=>{
    console.error(`Local JSON failed to load: ${err}`);
});

let sourceOptions = [];
let targetOptions = [];

function initializeSearch() {
    sourceOptions = Array.from(select_source.options);
    targetOptions = Array.from(select_target.options);
}

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

function updateFlag(selectElement, flagElement) {
    const countryCode = selectElement.value.slice(0,2);
    const global_flag = "./logo/global_flag.png";
    flagElement.alt = countryCode;

    if(selectElement.value === "EUR") {
        flagElement.src = "./logo/eu_flag.png";
    } else {
        flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
    
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

function renderOptions(search_el, select_el, el_options, el_flag) {
    const searchTerm = search_el.value.toLowerCase();
    select_el.innerHTML = '';

    if(searchTerm === "") {
        el_options.map(option => select_el.append(option));
        select_el.selectedIndex = 0;
        updateFlag(select_el, el_flag);
        return;
    }
    el_options.map((option) => {
        const optionText = option.innerText.toLowerCase();
        if(optionText.includes(searchTerm) || searchTerm === '') {
            select_el.append(option);
        }
    });
    if(select_el.options.length > 0) {
        updateFlag(select_el, el_flag);
    }
}

search_source.addEventListener('input', ()=> {
    renderOptions(search_source, select_source, sourceOptions, source_flag);
});

search_target.addEventListener('input', ()=>{
    renderOptions(search_target, select_target, targetOptions, target_flag);
});

btn_convert.addEventListener('click', (event)=>{
    if(cachedLocalData) {
        convertMoney(cachedLocalData, event.target);
    } else {
        convertMoney(LOCAL_JSON, event.target);
    }
});

btn_convert_by_real_time.addEventListener('click', (event) => {
    convertMoney(API_URL, event.target);
});

btn_reset.addEventListener('click', () => {
    location.reload();
});

function swapCurrencies() {
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
}

btn_swap.addEventListener('click', swapCurrencies);

document.addEventListener('keyup', (event) => {
    event.key === 'Enter' ? convertMoney(API_URL, btn_convert_by_real_time) : null;

    if(event.key === "Escape") {
        const activeElem = document.activeElement;
        if(activeElem.tagName === "INPUT") {
            activeElem.value = "";
        }
    }
});