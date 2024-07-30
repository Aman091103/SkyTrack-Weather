const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const grantAccess = document.querySelector("[data-grantLocation]");
const userInfo = document.querySelector(".user-info-container");
const loadingScreen = document.querySelector(".loading-container");
const grantAccessBtn = document.querySelector("[data-grantAccessBtn]");

// initially needed variables
let currentTab = userTab;
const API_KEY = "cd1684ab46d0d8bdefe17e0e4cef6b1f";

getFromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            userInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfo.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})


function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}

async function fetchWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");
 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);

    } 
    catch (error) {
        loadingScreen.classList.remove("active");
    }
}


function renderWeatherInfo(data){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-cityFlag]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloud]");
     
    cityName.textContent = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.textContent = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}.png` ;
    temp.textContent = data?.main?.temp +"°C";
    windspeed.textContent = data?.wind?.speed.toFixed(2)+"m/s";
    humidity.textContent = data?.main?.humidity.toFixed(2) +"%";
    cloudiness.textContent = data?.clouds?.all.toFixed(2) +"%";
}


grantAccessBtn.addEventListener("click",getLocation);

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        grantAccessButton.style.display = 'none';
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    if (searchInput.value === "") {
        return;
    }
    // console.log(searchInput.value);
    fetchSearchWeatherInfo(searchInput.value);
    searchInput.value = "";
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfo.classList.remove("active");
    grantAccess.classList.remove("active")
    try {
        const response1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data1 = await response1.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");

        renderWeatherInfo(data1);

    } 
    catch (error) {
        console.log(error);
    }
}
