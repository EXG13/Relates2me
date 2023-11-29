/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#b-day");
var inputMonthEl = document.querySelector("#b-month");
var inputYearEl = document.querySelector("#b-year");
var inputNameEl = document.querySelector("#name");
var nextBtn = document.querySelector("#next-btn");
var SaveBtnEl = document.querySelector("#submit");
var pictureCardEl = document.querySelector("#picture"); // TO BE REPLACED WITH PICTURE HOLDER

var inputtedName;
var profiles = [];
var profile = {
    name: "",
    birthday: "",
}
var birthday; 
var birthdayDate = new Date(birthday);

// NASA API RELATED VARIABLES
var nasaAPIKey = "yO4gV7LKJVWKPZKFc7GlvBh0f5Ig8XZN2KOgjgRp";
var startDateNasa = new Date(1995, 6, 1);
var today = new Date();




updateProfiles();

nextBtn.addEventListener("click", function(e){
    e.preventDefault();
    inputtedName = inputNameEl.value;
    localStorage.setItem("tempName", inputtedName);
})

SaveBtnEl.addEventListener("click", function(e){
    updateProfiles();
    e.preventDefault();
    var bDay = inputDayEl.value;
    var bMonth = inputMonthEl.value;
    var bYear = inputYearEl.value;
    birthday = bYear + "-" + bMonth + "-" + bDay;

    console.log(birthday);
    console.log(localStorage.getItem("tempName"));

    var newProfile = Object.create(profile);
    var newProfileName = localStorage.getItem("tempName");
    newProfile.name = newProfileName;
    newProfile.birthday = birthday;

    saveToLocalStorage(newProfile);

    if(birthdayDate > startDateNasa){
        
        
        console.log(newProfile);
        fetchNASAPicture(birthday);
    } else {
        var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
        var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
        console.log(randomDateFormatted);
        fetchNASAPicture(randomDateFormatted);
    }

    // localStorage.removeItem("tempName");
})











/* -----------------------------------------------------FUNCTIONS ---------------------------------------------------- */

// SAVE TO LOCAL STORAGE

function saveToLocalStorage(){
    localStorage.setItem("profiles", JSON.stringify(profiles));
}


// UPDATE LOCAL STORAGE & DISPLAYED PROFILES

function updateProfiles(){
    var savedProfiles;
    if(localStorage){
        savedProfiles = JSON.parse(localStorage.getItem("profiles"));

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