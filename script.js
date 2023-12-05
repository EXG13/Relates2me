/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#day");
var inputMonthEl = document.querySelector("#month"); 
var inputYearEl = document.querySelector("#year");
var inputNameEl = document.querySelector("#name-input");
var SaveBtnEl = document.querySelector("button");

var pictureCardEl = document.querySelector("#cardPicture"); // TO UPDATE WHEN READY

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

// VARIABLES FOR COMPARISON
var selected = []; // store two selected buttons



updateProfiles();

if(profiles){
    displayAllProfiles();
}



/* -----------------------------------------------------FUNCTIONS ---------------------------------------------------- */

// SAVE TO LOCAL STORAGE

function saveToLocalStorage(object){
    profiles.push(object);
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


function submitForm(){

    updateProfiles();
    
    var name = inputNameEl.value; 
    
    var bDay = inputDayEl.value;
    var bMonth = inputMonthEl.value;
    var bYear = inputYearEl.value;
    birthday = bYear + "-" + bMonth + "-" + bDay;
    
    if(birthdayDate > startDateNasa){ // If birthday is in the range of NASA pic of the day (from 1995)
        fetchNASAPicture(birthday);
    } else {    // otherwise create a random date and choose a random pic
        var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
        var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
        fetchNASAPicture(randomDateFormatted);
    }
    
    // Create a new profile object and store it in the localStorage
    if (name && birthday){
        createProfile(name, birthday);
    } else if (!name){
        name = "Anonymous";
        createProfile(name, birthday);
        console.log(name);
    } else if (!birthday){
        birthday = "2000-01-01";
        createProfile(name, birthday);
    }
}

function createProfile(name, birthday){
    var newProfile = Object.create(profile);
    var newProfileName = name;
    newProfile.name = newProfileName;
    newProfile.birthday = birthday;
    saveToLocalStorage(newProfile);

    displayAllProfiles();
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
        pictureCardEl.setAttribute("src", nasaPictureURL);  // ENABLE WHEN READY
})
}

// Display all the profiles as buttons in the NAV bar
function displayAllProfiles(){
    var profileBtnContainerEl = document.querySelector("#buttonName"); 

    if (localStorage){
        while(profileBtnContainerEl.lastChild){
            profileBtnContainerEl.removeChild(profileBtnContainerEl.lastChild);
        }

        console.log("profiles: " + JSON.stringify(profiles));

        for(i=0; i < profiles.length; i++){
            var profileBtn = document.createElement("button");
            var buttonCompare = document.querySelector(".customBtn-check");
            profileBtn.setAttribute("class", "customBtn");

            profileBtn.textContent = profiles[i].name;

            profileBtnContainerEl.insertBefore(profileBtn, buttonCompare);
        }

    }
}


//  select two (and only 2) elements
function addToCompare(val){
    if(!contains(selected, val)){
        if(selected.length <= 1){
            selected.push(val);
            console.log(selected);
        } else if(selected.length > 1){
            selected.shift(selected[0]);
            selected.push(val);
            console.log(selected);
        }
    }
}

// Check if array contains obj, to avoid 2 the same objects in comparison
function contains(array, obj) {
    var len = array.length;
    for(i=0; i<len; i++){
        if(array[i] === obj){
            return true;
        }
    }
    return false;
}

