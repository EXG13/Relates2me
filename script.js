/* --------------------------------------------------- VARIABLES ---------------------------------------------------- */


var birthday = "1994-04-24"; // TO BE REPLACED WITH INPUT
var birthdayDate = new Date(birthday);

// NASA API RELATED VARIABLES
var nasaAPIKey = "yO4gV7LKJVWKPZKFc7GlvBh0f5Ig8XZN2KOgjgRp";
var startDateNasa = new Date(1995, 6, 1);
var today = new Date();

var pictureCard = document.querySelector("#picture"); // TO BE REPLACED WITH PICTURE HOLDER



if(birthdayDate > startDateNasa){
    fetchNASAPicture(birthday);
} else {
    var randomDate = new Date(startDateNasa.getTime() + Math.random() * (today.getTime() - startDateNasa.getTime()));
    var randomDateFormatted = dayjs(randomDate).format("YYYY-MM-DD");
    console.log(randomDateFormatted);
    fetchNASAPicture(randomDateFormatted);
}



/* -----------------------------------------------------FUNCTIONS ---------------------------------------------------- */

function fetchNASAPicture(date){
    var nasaQueryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date="+ date;
    
    fetch(nasaQueryURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var nasaPictureURL = data.url
        pictureCard.setAttribute("src", nasaPictureURL);    
    
})
}