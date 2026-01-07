import { convertMoneyByRealTime, convertMoney } from './converter.js';
import { loadOptions } from './options.js';

const select_source = document.querySelectorAll('select')[0];
const search_source = document.getElementById("search-source");

const select_target = document.querySelectorAll('select')[1];
const search_target = document.getElementById('search-target');

const convert = document.querySelector('#convert');
const convertByRealTime = document.querySelector('#convertByRealTime');
const reset = document.querySelector('#reset');

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

async function setup() {
    try {
        await loadOptions();
        initializeSearch();
        // console.log("System is ready: Options loaded and search initialized.");
        convert.disabled = false;
    } catch(err) {
        console.error(`Setup failed: ${err}`);
    }
}
setup();

convert.addEventListener('click', convertMoney);
convertByRealTime.addEventListener('click', convertMoneyByRealTime);
reset.addEventListener('click', () => location.reload());
document.addEventListener('keypress', (event) => event.key === 'Enter' ? convertMoneyByRealTime() : 
    event.altKey && event.key === "Enter" ? convertMoney() : null);
search_target.addEventListener('keyup', renderTargetOptions);
search_source.addEventListener('keyup', renderSourceOptions);
