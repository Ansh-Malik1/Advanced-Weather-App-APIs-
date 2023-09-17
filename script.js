//Accessing elements on which we will perform DOM//

const yourWeatherTab=document.querySelector(".yourWeatherTab")
const searchWeatherTab = document.querySelector(".searchWeatherTab")
const weatherContainer= document.querySelector(".weatherContainer")
const accessContainer = document.querySelector(".access")
const accessButton = document.querySelector(".btnAccess")
const searchFormContainer= document.querySelector(".searchForm")
const searchBar= document.querySelector("[searchBar]")
const searchBtn = document.querySelector("[searchBtn]")
const loadingScreen =  document.querySelector(".loadingScreen")
const display = document.querySelector(".displayContainer")
const cityName = document.querySelector("[cityName]")
const cityFlag = document.querySelector("[countryFlag]")
const desc = document.querySelector("[desc]")
const weatherIcon = document.querySelector("[weatherIcon]")
const temp = document.querySelector("[temp]")
const windSpeed= document.querySelector("[windSpeed]")
const humidity = document.querySelector("[humidity]")
const cloudiness= document.querySelector("[haze]")

/*  Our approach for this project will be very simple. We will style the containers as we have done before.
After that we will show them selectively based on the input by the user.
how??
The answer to that is quite easy, we will be performing DOM manipulation
The container/s which we need to show on UI, will be having an 'active class' this class will have a property like display,
visibility,opacity or even height depending on our requirement.
However I am using only 'display' property for this project.
active class will have 'display: flex/grid/block etc' while normal CSS styling of containers will have 'display:hidden'.
*/


//Defining Variables, API key//

let currentTab=yourWeatherTab 
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"
currentTab.classList.add("active") 
/*current tab is made equal to yourWeatherTab therefore by adding 'active class to the current tab, we
are displaying it on UI( this will be the tab which will display when user visits the website*/

getCoordinates()  // Calling a function

function getCoordinates(){
    /*  This function will fetch co-ordinates from the session storage for calling API*/
    const coordinates= sessionStorage.getItem("userCoordinates")  // *****We have stored the co-ordinates as 'userCoordinates'//
    if(! coordinates){
        accessContainer.classList.add("activeC")
        /*The above lines of code will check if the co-ordiantes are present in the storage or not.
        If not, they will show 'Access Location' container on UI
        */
    }
    else{
        const currentCoordinates=JSON.parse(coordinates)
        fetchUserWeather(currentCoordinates)  // Function for API call
        /*If coordinates are present, then call api using that co-ordiantes */
    }
}


// API calling function//
async function fetchUserWeather(coordinates){
    /* Function is async because we want to run it in the background without breaking flow of execution
    It will create a promise.
    A promise has 3 states : pending,fulfilled,rejected
    */
    const {lat,long}=coordinates;  // Extracting Values of latitude and longitude from passed value
    accessContainer.classList.remove("activeC")  // Since we have recieved co-ordinatres, we no longer need acces container on UI//
    loadingScreen.classList.add("activeC")  // Displaying Loading Screen//
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
          // Await is used because new need that value will be stoed in response after the promise is fulfilled//
        );
        const  data = await response.json();
        loadingScreen.classList.remove("activeC");  // API called, data fetched therefore removing loadin screen
        display.classList.add("activeC");  // displaying weather data UI
        renderWeatherInfo(data);  // function to display values from data on UI
    }
    catch(err) {
        alert("An error occured, Please try again")
    }

}

function renderWeatherInfo(data){
    /* Call API on browser, see the output. Now search json to object coverter, paste the output.
    now we cann see the fields in an easier format(object) and can use it to extract required data */
    cityName.innerText=data?.name
    cityFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`
    // Question mark is used because if the value if not present, then it will not throw any error, it is called as optimal chaining operator//
    desc.innerText=data?.weather?.[0]?.description
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`
    temp.innerText = data?.main?.temp+" °C"
    windSpeed.innerText = data?.wind?.speed+" m/s"
    humidity.innerText = data?.main?.humidity+"%"
    cloudiness.innerText = data?.clouds?.all+"%"
}

// Function to store co-ordinates//
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        long:position.coords.longitude
    }
    sessionStorage.setItem("userCoordinates",JSON.stringify(userCoordinates))  // *****Synatx to store data on session storage//
    fetchUserWeather(userCoordinates) // Calling function which will call Api

}

/* In below code we have added an event listner to search tab(to show search UI when it is clicked*/
searchWeatherTab.addEventListener("click",()=>{
    switchTab(searchWeatherTab) // Function to switch tabs
})

yourWeatherTab.addEventListener("click",()=>{
    switchTab(yourWeatherTab)
})



function switchTab(value){
    // Tab will change only if we have clicked on the other tab present//
    if(value!=currentTab){
        currentTab.classList.remove("active")
        currentTab=value
        currentTab.classList.add("active")
        if(!searchFormContainer.classList.contains("activeC")){
            /* If searchContainer doesnt have an active class, it means we were on 'your weather tab'*/
            display.classList.remove("activeC")
            accessContainer.classList.remove("activeC")
            searchFormContainer.classList.add("activeC")
        }
        else{
            display.classList.remove("activeC")
            accessContainer.classList.remove("activeC")
            searchFormContainer.classList.remove("activeC")
            getCoordinates()
        }
    }
    
}

function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        alert("Location Access required to show weather at your place")
    }
}

async function fetchUserWeatherByCity(cityname){
    loadingScreen.classList.add("activeC");
    display.classList.remove("activeC");
    accessContainer.classList.remove("activeC");
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=d1845658f92b31c64bd94f06f7188c9c&units=metric`
          );
        const data = await response.json()
        console.log(data)
        if(data.cod==404){
            function loadDelay(){setTimeout(loadingScreen.classList.remove("activeC"),3000)}
            loadDelay()
            alert("Sorry City not found")
        }
        else{
            loadingScreen.classList.remove("activeC")
            display.classList.add("activeC")
            renderWeatherInfo(data);
        }
    }
    catch(err) {
        alert("Unexpected error occured pls try again")
    }
}



accessButton.addEventListener("click",getLocation)

searchBtn.addEventListener("click",(event)=>{
    event.preventDefault()
    let cityname = searchBar.value
    if(cityname === "")
        return;
    else 
        fetchUserWeatherByCity(cityname)
})