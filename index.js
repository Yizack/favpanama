const Twit = require('twit');

// Environment variables
const config = {
    "consumer_key": process.env.consumer_key,
    "consumer_secret": process.env.consumer_secret,
    "access_token": process.env.access_token,
    "access_token_secret": process.env.access_token_secret
}

var Twitter = new Twit(config);

// Lista de cuentas que no deseo leer
var ban = [
    "ExpoNoticia",
    "SOS_PTY",
    "tedyblood",
    "ckan",
    "cazatormentaspa",
    "VOSTpanama",
    "ventaszonalibre",
    "gruporgh",
    "suseguroaqui",
    "ptycodelca",
    "towncenter_cde",
    "aereobarato"
];

for(let i = 0; i < ban.length; i++){
    ban[i] = "-from:" + ban[i]
}

const minuto = 0;
var datetime = new Date();
console.log(datetime.getHours() + ":" + (datetime.getMinutes() < 10 ? "0" : "") + datetime.getMinutes() + ":" + datetime.getMilliseconds());
var timer = new intervalo(60000, tweet);
timer.run();

function tweet() {
    var datetime = new Date();
    if(minuto == datetime.getMinutes()){
        busqueda();
        console.log(datetime.getHours() + ":" + (datetime.getMinutes() < 10 ? "0" : "") + datetime.getMinutes() + ":" + datetime.getMilliseconds());
    }
}

function busqueda(){
    var parametros = {
        q: '#Panama' + " " + ban.join(" "),
        result_type: 'recent',
        lang: 'es'
    }

    Twitter.get('search/tweets', parametros, function(err, data) {
        if (!err) {
            var tweetID = data.statuses[0].id_str;
            // RT
            retweet(tweetID);
            // FAV
            fav(tweetID);
        }
        else 
            console.error(err.message);
    });
}

function retweet(tweetID){
    Twitter.post('statuses/retweet/:id', {id: tweetID}, function(err, response){
        if (response)
            console.log('Retweeted!');
        if (err)
            console.error(err.message);
    });
}

function fav(tweetID){
    Twitter.post('favorites/create', {id: tweetID}, function(err, response){
        if(err)
            console.error(err.message);
        else
            console.log('Favorited!');
    });
}

// Accurate Javascript setInterval replacement
// Función por manast en https://gist.github.com/manast/1185904
function intervalo(duration, fn){
    this.baseline = undefined

    this.run = function(){
        if(this.baseline === undefined){
            this.baseline = new Date().getTime()
        }
        fn()
        var end = new Date().getTime()
        this.baseline += duration
        var nextTick = duration - (end - this.baseline)
        if(nextTick<0){
            nextTick = 0
        }
        (function(i){
            i.timer = setTimeout(function(){
                i.run(end)
            }, nextTick)
        }(this))
    }
    this.stop = function(){
        clearTimeout(this.timer)
    }
}
