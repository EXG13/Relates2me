/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#b-day");
var inputMonthEl = document.querySelector("#b-month");
var inputYearEl = document.querySelector("#b-year");
var SaveButtonEl = document.querySelector("#submit");
var pictureCardEl = document.querySelector("#picture"); // TO BE REPLACED WITH PICTURE HOLDER

var birthday; // TO BE REPLACED WITH INPUT
var birthdayDate = new Date(birthday);

// NASA API RELATED VARIABLES
var nasaAPIKey = "yO4gV7LKJVWKPZKFc7GlvBh0f5Ig8XZN2KOgjgRp";
var startDateNasa = new Date(1995, 6, 1);
var today = new Date();

var profiles = [];
var profile = {
    name: "",
    birthday: "",
}


updateProfiles();

SaveButtonEl.addEventListener("click", function(e){
    e.preventDefault();
    var bDay = inputDayEl.value;
    var bMonth = inputMonthEl.value;
    var bYear = inputYearEl.value;
    birthday = bYear + "-" + bMonth + "-" + bDay;
    console.log(birthday);

    if(birthdayDate > startDateNasa){ 
        fetchNASAPicture(birthday);
    } else {
        var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
        var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
        console.log(randomDateFormatted);
        fetchNASAPicture(randomDateFormatted);
    }
})











/* -----------------------------------------------------FUNCTIONS ---------------------------------------------------- */

// SAVE TO LOCAL STORAGE

function saveToLocalStorage(profile){
    localStorage.setItem("profiles", JSON.stringify(profiles));
}


// UPDATE LOCAL STORAGE & DISPLAYED PROFILES

function updateProfiles(){
    var savedProfiles;
    if(localStorage){
        savedProfiles = JSON.parse(localStorage.getItem("profiles"));
    } else {
        if(savedProfiles){
            profiles = savedProfiles;
        } else {
            profiles = [];
        }
    }
}


// FETCH NASA PICTURE OF THE DAY AND DISPLAY

function fetchNASAPicture(date){
    var nasaQueryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date="+ date;
    
    fetch(nasaQueryURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var nasaPictureURL = data.url
        pictureCardEl.setAttribute("src", nasaPictureURL);  
})
}