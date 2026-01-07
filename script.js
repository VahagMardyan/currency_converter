import { convertMoney } from './converter.js';
import { loadOptions } from './options.js';

const select_source = document.querySelector('#source');
const search_source = document.getElementById("search-source");

const select_target = document.querySelector('#target');
const search_target = document.getElementById('search-target');

const btn_convert = document.querySelector('#convert');
const btn_convert_by_real_time = document.querySelector('#convertByRealTime');
const btn_reset = document.querySelector('#reset');

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

    sourceOptions.forEach((option) => {
        const optionText = option.innerText.toLowerCase();
        if (optionText.includes(searchTerm) || searchTerm === '') {
            select_source.append(option);
        }
    });
}

function renderTargetOptions() {
    const searchTerm = search_target.value.toLowerCase();
    select_target.innerHTML = '';

    targetOptions.forEach((option) => {
        const optionText = option.innerText.toLowerCase();
        if (optionText.includes(searchTerm) || searchTerm === '') {
            select_target.append(option);
        }
    });
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

btn_convert.addEventListener('click', (event)=>{
    convertMoney(LOCAL_JSON, event.target);
});

btn_convert_by_real_time.addEventListener('click', (event) => {
    convertMoney(API_URL, event.target);
});

btn_reset.addEventListener('click', () => {
    location.reload();
});

document.addEventListener('keypress', (event) => {
    event.key === 'Enter' ? 
    convertMoney(API_URL,btn_convert_by_real_time) : 
    event.altKey && event.key === "Enter" ? convertMoney(LOCAL_JSON, btn_convert) : null;
});

search_target.addEventListener('keyup', renderTargetOptions);
search_source.addEventListener('keyup', renderSourceOptions);
