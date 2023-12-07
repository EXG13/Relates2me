/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */
var inputDayEl = document.querySelector("#day");
var inputMonthEl = document.querySelector("#month"); 
var inputYearEl = document.querySelector("#year");
var inputNameEl = document.querySelector("#name-input");
var SaveBtnEl = document.querySelector("button");
var profileBtnContainerEl = document.querySelector("#buttonName");
var buttonCompare = document.querySelector("#checkBtn");
var startAgainBtn = document.querySelector('#startAgain');
var navBarEl = document.querySelector("#navbarNav");
var pictureCardEl = document.querySelector("#cardPicture"); 

// VARIABLES RELATED TO PROFILES
var profiles = [];
var profile = {
    name: "",
    birthday: "",
}
var originalBirthday;
var birthday; 
var birthdayDate = new Date(birthday);

// NASA API RELATED VARIABLES
var nasaAPIKey = "yO4gV7LKJVWKPZKFc7GlvBh0f5Ig8XZN2KOgjgRp";
var startDateNasa = new Date(1995, 6, 1);
var today = new Date();
var nasaQueryURL;
var nasaPictureURL = "./assets/pexels-alex-andrews-3805983.jpg";
var nasaPictureTitle = "Milky Way";

// VARIABLES FOR COMPARISON
var CardOnePic = document.querySelector("#comparison-picture");
var CardTwoPic = document.querySelector("#second-comparison-picture");
var CardOneName = document.querySelector("#comperison-name");
var CardTwoName = document.querySelector("#second-comperison-name");
var CardOneDate = document.querySelector("#birth-date");
var CardTwoDate = document.querySelector("#second-birth-date");
var selected = []; // store two selected buttons



/* ------------------------------------------------- ACTION! ------------------------------------------------------------ */

updateProfiles();  // store profiles in Local Storage and array

displayAllProfiles(); // display profiles as buttons in navbar

profileBtnContainerEl.addEventListener("click", compareTwoProfiles);  // select two profiles to compare (profiles buttons)

buttonCompare.addEventListener("click", displayComparison);  // display comparison (compare button)



/* ----------------------------------------------------------FUNCTIONS ---------------------------------------------------- */

// HANDLE BUTTONS (ON-CLICK) --------------------------------------------------------------------------------------------------------

// Submit (Reveal) Button

function submitForm(){
    
    updateProfiles();

    var cardNameEl = document.querySelector("#cardName");
    var cardDateEl = document.querySelector("#cardDate");
    
    var name = inputNameEl.value; 
    
    var bDay = inputDayEl.value;
    var bMonth = inputMonthEl.value;
    var bYear = inputYearEl.value;

    originalBirthday = bYear + "-" + bMonth + "-" + bDay;

    if(new Date(originalBirthday) != "Invalid Date"){
        cardDateEl.textContent = dayjs(originalBirthday).format("DD MMM YYYY");
        birthday = returnBirthday(originalBirthday);
    } else {
        cardDateEl.textContent = "Input a correct date!";
        pictureCardEl.setAttribute("src", "./assets/pexels-alex-andrews-3805983.jpg"); 
        pictureCardEl.setAttribute("alt", "Milky Way");
        return;
    }

    if(!name){
        name = "Anonymous";
    }

    cardNameEl.textContent = name;

    if(!birthday){
        cardDateEl.textContent = "Input a correct date!";
        pictureCardEl.setAttribute("src", "./assets/pexels-alex-andrews-3805983.jpg"); 
        pictureCardEl.setAttribute("alt", "Milky Way");
        return;
    }



    // Fetch Data from NASA API

    // birthday = returnBirthday(originalBirthday);

    // birthday = dayjs(originalBirthday).format("YYYY-MM-DD");

    nasaQueryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date=" + birthday;

    try {
        fetch(nasaQueryURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            pictureCardEl.setAttribute("src", data.url); 
            pictureCardEl.setAttribute("alt", data.title);
            })
    } catch (error) {
        pictureCardEl.setAttribute("src", "./assets/pexels-alex-andrews-3805983.jpg"); 
        pictureCardEl.setAttribute("alt", "Milky Way");
        console.log("sorry, API struggles to fetch your data");
    }
    

    createProfile(name, originalBirthday);
    inputNameEl.value = '';
    inputDayEl.value = '';
    inputMonthEl.value = '';
    inputYearEl.value = '';

}

// Toggle Navbar (Start Again button)
function toggleNavbar(){

    if(navBarEl.classList.contains('show')){
        navBarEl.classList.remove('show');
    } else {
        navBarEl.classList.add('show');
    }
}


// LOCAL STORAGE -----------------------------------------------------------------------------------------------------------

// Save max 8 profiles to Local Storage and remove the first one to add a new one if more than 8 searches

function saveToLocalStorage(object){

    if (profiles.length < 8){
        if(!avoidDuplicates(profiles, object)){
            profiles.push(object);
        }
        
    } else {
        if(!avoidDuplicates(profiles, object)){
            profiles.shift(profiles[0]);
            profiles.push(object);
        }
        
    } 
    localStorage.setItem("profiles", JSON.stringify(profiles));
}

// Avoid duplicated profiles in Local Storage and in PROFILES Array

function avoidDuplicates(array, object){
    for (i=0; i<array.length; i++){
        if(array[i].name == object.name && array[i].birthday == object.birthday){
            return true;
        }
    }
}


// Update Local Storage and update PROFILES array

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

// Create profiles (as objects) and display them in navbar
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
    if (localStorage){
        
        while(profileBtnContainerEl.lastChild){
            profileBtnContainerEl.removeChild(profileBtnContainerEl.lastChild);
        }

        for(i=0; i < profiles.length; i++){
            var profileBtn = document.createElement("button");

            profileBtn.setAttribute("class", "customBtn off");
            profileBtn.setAttribute("id", profiles[i].birthday);
            profileBtn.textContent = profiles[i].name;

            profileBtnContainerEl.appendChild(profileBtn);
        }

        // append start again and compare buttons again
        profileBtnContainerEl.appendChild(buttonCompare);
        profileBtnContainerEl.appendChild(startAgainBtn);
    }
}


// SELECTION OF 2 TO COMPARE -------------------------------------------------------------------------------------------

// Select profiles when clicked -- only allow 2 selections
function compareTwoProfiles(e){
    selectedProfile = e.target;
    var listOfChildren = selectedProfile.parentNode.children;
    var tempClasses = [];

    for(i=0; i<listOfChildren.length; i++){
        if(listOfChildren[i].className === "customBtn on"){
            tempClasses.push(listOfChildren[i]);
            }
        }

    var tempNoOn = tempClasses.length; // store temporarily number of items with class ON

    if(selectedProfile.id === "checkBtn"){
        displayComparison();
    } else {
        if(selectedProfile.classList[1] === "off" && tempNoOn < 2){
            selectedProfile.setAttribute("class", "customBtn on");
            addToCompare(selectedProfile.innerHTML, selectedProfile.id);
        } else if(selectedProfile.classList[1] === "on" && tempNoOn >= 2){
            removeFromComparison(selectedProfile.innerHTML);
            console.log(selectedProfile.innerHTML)
            selectedProfile.setAttribute("class", "customBtn off");
        } else         
        {
            selectedProfile.setAttribute("class", "customBtn off");
        }
    }
    
    tempNoOn = tempClasses.length; // update the number

}

// display comparison on the cards and close the navbar
function displayComparison(){

    if(selected.length === 2){
        var profileOneName = selected[0].name;
        var profileTwoName = selected[1].name;
        var profileOneBirthday = selected[0].birthday;
        var profileTwoBirthday = selected[1].birthday;

        // fetch pics from Nasa

        nasaQueryURLOne = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date=" + returnBirthday(profileOneBirthday);
        nasaQueryURLTwo = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date=" + returnBirthday(profileTwoBirthday);

        try {
            fetch(nasaQueryURLOne)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                CardOnePic.setAttribute("src", data.url);
                CardOnePic.setAttribute("alt", data.title);
                })
        } catch (error) {
            console.log("sorry, API struggles to fetch your data");
            CardOnePic.setAttribute("src", "./assets/pexels-alex-andrews-3805983.jpg");
            CardOnePic.setAttribute("alt", "Milky Way");
        }

        try {
            fetch(nasaQueryURLTwo)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                CardTwoPic.setAttribute("src", data.url);
                CardTwoPic.setAttribute("alt", data.title);
                })
        } catch (error) {
            console.log("sorry, API struggles to fetch your data");
            CardTwoPic.setAttribute("src", "./assets/pexels-alex-andrews-3805983.jpg");
            CardTwoPic.setAttribute("alt", "Milky Way");
        }
        
        // display info
        CardOneName.textContent = profileOneName.toString();
        CardOneDate.textContent = profileOneBirthday.toString();
        CardTwoName.textContent = profileTwoName.toString();
        CardTwoDate.textContent = profileTwoBirthday.toString();

        // close navbar
        if(navBarEl.classList.contains('show')){
            console.log('hide!');
            navBarEl.classList.remove('show');
        }
        window.location.href = "#card-comparison-back"; // link to the section with two cards

    } else {
        var comparisonDivEl = document.querySelector("#comparison");
        var messageEl =comparisonDivEl.children[2];
        messageEl.textContent = "Select two profiles to compare!"; // display message on the page
        return;
    }


}

// remove from comparison when profile unclicked
function removeFromComparison(val){
    for (i=0; i<selected.length; i++){
        if(selected[i].name == val){
            selected.shift(selected[i]);
        } 
    }
} 


//  select two (and only 2) elements
function addToCompare(name, birthday){
    var selectedProfile = Object.create(profile);
    selectedProfile.name = name;
    selectedProfile.birthday = birthday;

    if(!contains(selected, selectedProfile.name)){
    
        if(selected.length <= 1){
            selected.push(selectedProfile);
        } else if(selected.length > 1){
            selected.shift(selected[0]);
            selected.push(selectedProfile);
        }
    }
}

// Check if array contains obj, to avoid 2 the same objects in comparison
function contains(array, obj) {
    var len = array.length;
    for(i=0; i<len; i++){
        if(array[i] == obj){
            return true;
        }
    }
    return false;
}



function disableSelection(){
    // console.log(profileBtnContainerEl);
    // profileBtnContainerEl
}


// Return Birthday date (real or random) within the range of NASA API
function returnBirthday(date){
    birthday = new Date(date);
    if(birthday > startDateNasa){ // If birthday is in the range of NASA pic of the day (from 1995)
        birthday = dayjs(birthday).format("YYYY-MM-DD");
    } else {    // otherwise create a random date and choose a random pic
        birthday = dayjs(randomiseDate()).format("YYYY-MM-DD");
    }
    return birthday;
}

function randomiseDate(){
    var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
    var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
    return randomDateFormatted;
}


