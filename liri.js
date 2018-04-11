require('dotenv').config()

var keys  = require('./keys.js')
var request = require('request');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');

function getMyTwitter (){
    
    var client = new Twitter(keys.twitter)
    var params = {screen_name: 'Wakanda_Panda'}
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        // console.log(tweets)
        if (!error) {
            if(tweets.length<20){
                for(i=0; i<tweets.length; i++){
                    console.log('tweet '+(i+1))
                    console.log(tweets[i].text)
                    console.log("Created at: "+tweets[i].created_at)
                    console.log('----------------------------------------------------')
                }
            }
            else{
                for(i=0; tweets<20; i++){
                    console.log('tweet '+(i+1))
                    console.log("Created at: "+tweets[i].created_at)
                    console.log(tweets[i].text)
                    console.log('----------------------------------------------------')
                }
            }
        }
        else if(error){
            console.log(error)
        }
    });
}

function spotiFind(song){ 
    
    var spotify = new Spotify(keys.spotify)
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        var resultArr = data.tracks.items
        
        for(i=0; i<20; i++){
            var resultNum = i+1
            console.log(resultNum+') Song name: '+resultArr[i].name)
            if(resultArr[i].preview_url!==null){
                console.log('    Song url: '+resultArr[i].preview_url)
            }
            else{
                console.log('    Song url: (No url)')
            }
            console.log('    Artist name: '+resultArr[i].artists[0].name)
            console.log('    Album: ' + resultArr[i].album.name)
        }
    })
} 

// spotiFind(process.argv[3])

function find_rt_rating (movie) {
    var ratingsArr = movie.Ratings
    // console.log(ratingsArr)
    for(i=0; i<ratingsArr.length; i++){
        if(ratingsArr[i].Source ==='Rotten Tomatoes'){
            return ratingsArr[i].Value
        }
    }
}

function omdb(name){
    var userMovie = name
    var omdb_key = keys.omdb.id
    var requestURL = 'http://www.omdbapi.com/?apikey='+omdb_key+'&t='+userMovie
    
    request(requestURL, function (error, response, body) {
        if(error){
            console.log('error:', error); // Print the error if one occurred
        }
        var movie = JSON.parse(body) 

        var title = movie.Title
        var year = movie.Year
        var rating = movie.Rated
        var rt_rating = find_rt_rating(movie)
        var country = movie.Country
        var language = movie.Language
        var plot = movie.Plot
        var actors = movie.Actors
        
        console.log('Movie Title: '+ title)
        console.log('Year Released: '+ year)
        console.log('Rating: ' + rating)
        console.log('Rotten Tomatoes: '+ rt_rating)
        console.log('Country: ' + movie.Country)
        console.log('Language: '+ language)
        console.log('Plot: ' + plot)
        console.log('Actors: ' + actors)
    });
}

function random(){
    fs.readFile('random.txt', 'utf8', function(err, data){
        if (err){
            console.log(err)
        }
        var command = ''
        var search = ''
        var afterComma = false
        for(i=0;i<data.length; i++){
            if(data[i]!=',' && afterComma === false){
                command+=data[i]
            }
            else if(data[i]===','){
                afterComma = true;
            }
            else{
                search += data[i]
            }
        }
        startLiriBot(command, search)
    })
}

//handles the user prompts from comand line
function startLiriBot(command, search){
    switch (command){
        case 'my-tweets':
            getMyTwitter()
            break;
        case 'spotify-this-song':
            spotiFind(search)
            break;
        case 'movie-this':
            omdb(search)
            break;
        case 'do-what-it-says':
            random()
            break;
    }
}

startLiriBot(process.argv[2], process.argv[3])