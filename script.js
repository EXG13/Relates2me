var nasaAPIKey = "yO4gV7LKJVWKPZKFc7GlvBh0f5Ig8XZN2KOgjgRp";
var birthday = "1996-04-24";
console.log(birthday);
var nasaQueryURL = "https://api.nasa.gov/planetary/apod?api_key=" + nasaAPIKey + "&date="+ birthday;
var pictureCard = document.querySelector("#picture");


fetch(nasaQueryURL)
.then(function(response){
    return response.json();
})
.then(function(data){
    var startDateNasa = new Date("1995-06-16");
    var birthdayDate = new Date(birthday);
    var nasaPictureURL = data.url
    if(birthdayDate > startDateNasa){
        pictureCard.setAttribute("src", nasaPictureURL);
        console.log(data);
    } else{
        console.log("You too old to get a pic")
        // console.log(data);
    }
    
    
})