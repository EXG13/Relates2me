/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#day");
var inputMonthEl = document.querySelector("#month"); 
var inputYearEl = document.querySelector("#year");
// var inputNameEl = document.querySelector("#name"); // !! TO UPDATE
var SaveBtnEl = document.querySelector("button"); // UPDATE
var pictureCardEl = document.querySelector("#picture"); // TO BE REPLACED WITH PICTURE HOLDER

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

// 'NEXT' BUTTON THAT SAVES THE NAME TO LOCAL STORAGE
// nextBtn.addEventListener("click", function(e){
//     inputtedName = inputNameEl.value;
//     localStorage.setItem("tempName", inputtedName); // it stores the name temporary to link it to birthday on the second button
// })


// 'SAVE' BUTTON THAT SAVES NAME & BIRTHDAY IN LOCAL STORAGE 
// SaveBtnEl.addEventListener("click", function(e){
//     console.log("working");
//     updateProfiles();

//     var bDay = inputDayEl.value;
//     var bMonth = inputMonthEl.value;
//     var bYear = inputYearEl.value;
//     birthday = bYear + "-" + bMonth + "-" + bDay;

//     if(birthdayDate > startDateNasa){ // If birthday is in the range of NASA pic of the day (from 1995)
//         fetchNASAPicture(birthday);
//     } else {    // otherwise create a random date and choose a random pic
//         var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
//         var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
//         fetchNASAPicture(randomDateFormatted);
//     }

//     // Create a new profile object and store it in the localStorage
//     var newProfile = Object.create(profile);
//     var newProfileName = localStorage.getItem("tempName");
//     newProfile.name = newProfileName;
//     newProfile.birthday = birthday;
//     saveToLocalStorage(newProfile);
//     localStorage.removeItem("tempName"); // remove temporarily store name, to make a space for a new one

// });



/*------------------------------------------------------------ TEST ------------------------------------------------- */


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


/*------------------------------------------------------------ END TEST ------------------------------------------------- */





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
        pictureCardEl.setAttribute("src", nasaPictureURL);  
})
}