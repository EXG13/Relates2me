/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#day");
var inputMonthEl = document.querySelector("#month"); 
var inputYearEl = document.querySelector("#year");
var inputNameEl = document.querySelector("#name-input");
var SaveBtnEl = document.querySelector("button");
var profileBtnContainerEl = document.querySelector("#buttonName");

var originalBirthday;

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
var nasaQueryURL;

// VARIABLES FOR COMPARISON
var selected = []; // store two selected buttons

/* --------------------------------------------- ACTION! ------------------------------------------------------------ */

updateProfiles();

displayAllProfiles();

profileBtnContainerEl.addEventListener("click", compareTwoProfiles);



/* -----------------------------------------------------FUNCTIONS ---------------------------------------------------- */

// ON-CLICK FUNCTION FOR SUBMIT BUTTON

function submitForm(){
    

    updateProfiles();

    var cardNameEl = document.querySelector("#cardName");
    var cardDateEl = document.querySelector("#cardDate");
    
    var name = inputNameEl.value; 
    
    var bDay = inputDayEl.value;
    var bMonth = inputMonthEl.value;
    var bYear = inputYearEl.value;
    originalBirthday = bYear + "-" + bMonth + "-" + bDay;
    console.log(new Date(originalBirthday));

    cardNameEl.textContent = name;
    if(new Date(originalBirthday) != "Invalid Date"){
        cardDateEl.textContent = dayjs(originalBirthday).format("DD MMM YYYY");
    } else {
        cardDateEl.textContent = "Input a correct date!";
    }
    

    
    // Create a new profile object and store it in the localStorage
    if (name && birthday){
        birthday = dayjs(originalBirthday).format("YYYY-MM-DD");
        nasaQueryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date=" + birthday;
        fetchNASAPicture();
        createProfile(name, originalBirthday);

    } else if (!name){
        birthday = returnBirthday(originalBirthday);
        nasaQueryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date=" + birthday;
        name = "Anonymous";
        fetchNASAPicture();
        createProfile(name, originalBirthday);

    } else if (birthday === undefined || birthday === null){
        console.log("undefined!");
        console.log("n only " + birthday);
        birthday = randomiseDate();
        fetchNASAPicture();
        createProfile(name, originalBirthday);
    }
}


// LOCAL STORAGE ----------------------------------------------------------------------------------------------------

// SAVE TO LOCAL STORAGE 

function saveToLocalStorage(object){

    if (profiles.length < 9){
        if(!avoidDuplicates(profiles, object)){
            profiles.push(object);
        }
        
    } else if (profiles.length >= 9) {
        if(!avoidDuplicates(profiles, object)){
            profiles.shift(profiles[0]);
            profiles.push(object);
        }
        
    } 
    localStorage.setItem("profiles", JSON.stringify(profiles));
}


// Avoid duplicates

function avoidDuplicates(array, object){
    for (i=0; i<array.length; i++){
        if(array[i].name == object.name && array[i].birthday == object.birthday){
            return true;
        }
    }
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

// Create profiles
function createProfile(name, birthday){
    var newProfile = Object.create(profile);
    var newProfileName = name;
    newProfile.name = newProfileName;
    newProfile.birthday = birthday;
    saveToLocalStorage(newProfile);

    displayAllProfiles();
}


// Display all the profiles as buttons in the NAV bar
function displayAllProfiles(){
    var buttonCompare = document.querySelector("#checkBtn");
    var startAgainBtn = document.querySelector('#startAgain');

    if (localStorage){
        
        while(profileBtnContainerEl.lastChild){
            profileBtnContainerEl.removeChild(profileBtnContainerEl.lastChild);
        }

        for(i=0; i < profiles.length; i++){
            var profileBtn = document.createElement("button");

            profileBtn.setAttribute("class", "customBtn off");
            profileBtn.textContent = profiles[i].name;

            profileBtnContainerEl.appendChild(profileBtn);
        }

        profileBtnContainerEl.appendChild(buttonCompare);
        profileBtnContainerEl.appendChild(startAgainBtn);
    }
}



// SELECTION OF 2 TO COMPARE -------------------------------------------------------------------------------------------

function compareTwoProfiles(e){
    selectedProfile = e.target;
    var listOfChildren = selectedProfile.parentNode.children;
    var tempClasses = [];

    for(i=0; i<listOfChildren.length; i++){
        if(listOfChildren[i].className === "customBtn on"){
            tempClasses.push(listOfChildren[i]);
            console.log(tempClasses);
            }
        }

    var tempNoOn = tempClasses.length;
    
    if(selectedProfile.classList[1] === "off" && tempNoOn < 2){
            selectedProfile.setAttribute("class", "customBtn on");
    } else {
        selectedProfile.setAttribute("class", "customBtn off");
    }

    tempNoOn = tempClasses.length;
    addToCompare(selectedProfile.innerHTML);

}

//  select two (and only 2) elements
function addToCompare(val){
    if(!contains(selected, val)){
        if(selected.length <= 1){
            selected.push(val);
        } else if(selected.length > 1){
            selected.shift(selected[0]);
            selected.push(val);
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





function disableSelection(){
    // console.log(profileBtnContainerEl);
    // profileBtnContainerEl
}



// NASA API -------------------------------------------------------------------------------------------------------------

// FETCH NASA PICTURE OF THE DAY AND DISPLAY

function fetchNASAPicture(){
    try {
        fetch(nasaQueryURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var nasaPictureURL = data.url;
            var nasaPictureTitle = data.title;
            pictureCardEl.setAttribute("src", nasaPictureURL); 
            pictureCardEl.setAttribute("alt", nasaPictureTitle);
        })
    } catch (error) {
        console.log("sorry, API struggles to fetch your data");
        pictureCardEl.setAttribute("src", "./assets/pexels-alex-andrews-3805983.jpg"); 
        pictureCardEl.setAttribute("alt", "Milky Way");
    }
    
}


// Return Birthday date (real or random) within the range of NASA API
function returnBirthday(date){
    birthday = new Date(date);
    if(birthday > startDateNasa){ // If birthday is in the range of NASA pic of the day (from 1995)
        birthday = dayjs(birthday).format("YYYY-MM-DD");
        return birthday;
    } else {    // otherwise create a random date and choose a random pic
        birthday = dayjs(randomiseDate()).format("YYYY-MM-DD");
        return birthday;
    }
}

function randomiseDate(){
    var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
    var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
    return randomDateFormatted;
}