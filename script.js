/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#day");
var inputMonthEl = document.querySelector("#month"); 
var inputYearEl = document.querySelector("#year");
// var inputNameEl = document.querySelector("#name"); // !! TO UPDATE & ENABLE WHEN READY
var SaveBtnEl = document.querySelector("button"); // UPDATE
// var pictureCardEl = document.querySelector("#picture"); // TO UPDATE WHEN READY

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
    
    var name = ""; // UPDATE WITH: inputNameEl.value; - when ready
    
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
        // pictureCardEl.setAttribute("src", nasaPictureURL);  // ENABLE WHEN READY
})
}


function displayAllProfiles(){
    if (localStorage){
        var selectEl = document.createElement("select");
        selectEl.setAttribute("multiple", "yes");
        selectEl.setAttribute("size", profiles.length);

        for(i=0; i < profiles.length; i++){
            var option = document.createElement("option");
            option.setAttribute("value", profiles[i]);
            option.setAttribute('onClick', 'addToCompare("' + profiles[i] + '")');
            option.textContent = profiles[i];
            selectEl.appendChild(option);
        }
        
        container.appendChild(selectEl); // UPDATE WHEN READY
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

