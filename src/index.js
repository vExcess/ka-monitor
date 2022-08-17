var debugging = false;

// Import Dependancies
const Discord = require("discord.js");
const fetch = require("node-fetch");
const keepAlive = require("./server");
const jsdom = require("jsdom");
const babel = require("@babel/core");
const { JSDOM } = jsdom;
const fs = require('fs');
const KA_fetch = require('./KA_fetch');
KA_fetch.nodeFetch = fetch;
global.acorn = require('./acorn/acorn');
const JSInterpreter = require('./acorn/interpreter');
const Processing = require("./ProcessingVC");

var activityCanvas = Processing.createCanvas(500, 224);
var ctx = activityCanvas.getContext("2d");
var activityPJS = new Processing.instance(activityCanvas);

// create client
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
    partials: ["CHANNEL"]
});


var users = false;
var nicks = false;

var membersDatabase = fs.readFileSync("membersData.json", "utf8");
if (membersDatabase.length === 0) {
    membersDatabase = fs.readFileSync("membersDataBackup.txt", "utf8");
}
membersDatabase = JSON.parse(membersDatabase);

var serversDatabase = require('./serversData').SERVER_DATA;

var programHashes = false;

var base92 = {
    codeKey: " !#$%&'()*+-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    encode: function (num) {
        var placeValues = 0;
        while (Math.pow(this.codeKey.length, placeValues) <= num + 1) {
            placeValues++;
        }

        var encoded = "";
        for (var i = placeValues; i > 0; i--) {
            var factor = Math.pow(this.codeKey.length, i - 1);
            encoded += this.codeKey.charAt(Math.floor(num / factor));
            num -= Math.floor(num / factor) * factor;
        }

        return encoded;
    },
    decode: function (num) {
        var decoded = 0;
        for (var i = num.length; i > 0; i--) {
            var value = Math.pow(this.codeKey.length, i - 1).toString();
            var value2 = this.codeKey.indexOf(num.charAt(num.length - i));
            var value3 = value * value2;
            decoded += value3;
        }

        return decoded;
    }
};

function hashCode(str) {
    var h = 0;
    var stop = Math.min(str.length, 125);
    for (var i = 0; i < stop; i++) {
        h += i * str.charCodeAt(i);
    }
    return base92.encode(h);
}

function searchUsers(input) {
    input = input.toLowerCase();
    var tokens = input.split(" ");
    if (!users) {
        users = require('./KAUsersDatabase');
        nicks = users.KA_USERS[0];
    }

    var results = [];
    var numResults = 0;

    var startTimer = Date.now();

    if (input.length > 0) {
        for (var i = 0; i < nicks.length; i++) {
            if (numResults < 5000) {
                for (var j = 0; j < tokens.length; j++) {
                    if (nicks[i].toLowerCase().includes(tokens[j])) {
                        var nick = nicks[i];
                        var kaid = users.KA_USERS[1][i];

                        var included = false;
                        for (var k = 0; k < results.length; k++) {
                            if (results[k][1] === kaid) {
                                included = true;
                                results[k][2]++;
                                break;
                            }
                        }

                        if (!included) {
                            results.push([nick, kaid, 1]);
                        }

                        numResults++;
                    }
                }
            } else {
                break;
            }
        }
    }

    results.sort(function (a, b) {
        return b[2] - a[2];
    });

    return results;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const normFont = "\t\n abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-=_+[]\\{}|;':\",./<>?".split("");
const coolFont_gothic = ["\t", "\n", " ", "𝖆", "𝖇", "𝖈", "𝖉", "𝖊", "𝖋", "𝖌", "𝖍", "𝖎", "𝖏", "𝖐", "𝖑", "𝖒", "𝖓", "𝖔", "𝖕", "𝖖", "𝖗", "𝖘", "𝖙", "𝖚", "𝖛", "𝖜", "𝖝", "𝖞", "𝖟", "𝕬", "𝕭", "𝕮", "𝕯", "𝕰", "𝕱", "𝕲", "𝕳", "𝕴", "𝕵", "𝕶", "𝕷", "𝕸", "𝕹", "𝕺", "𝕻", "𝕼", "𝕽", "𝕾", "𝕿", "𝖀", "𝖁", "𝖂", "𝖃", "𝖄", "𝖅", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "❗", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "❜", ":", "❞", ",", ".", "/", "<", ">", "❓"];
const coolFont_outline = ["\t", "\n", " ", "𝕒", "𝕓", "𝕔", "𝕕", "𝕖", "𝕗", "𝕘", "𝕙", "𝕚", "𝕛", "𝕜", "𝕝", "𝕞", "𝕟", "𝕠", "𝕡", "𝕢", "𝕣", "𝕤", "𝕥", "𝕦", "𝕧", "𝕨", "𝕩", "𝕪", "𝕫", "𝔸", "𝔹", "ℂ", "𝔻", "𝔼", "𝔽", "𝔾", "ℍ", "𝕀", "𝕁", "𝕂", "𝕃", "𝕄", "ℕ", "𝕆", "ℙ", "ℚ", "ℝ", "𝕊", "𝕋", "𝕌", "𝕍", "𝕎", "𝕏", "𝕐", "ℤ", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡", "𝟘", "`", "~", "❕", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", "⨟", "❜", ":", "❞", ",", ".", "/", "<", ">", "❔"];
const coolFont_monospace = ["\t", "\n", " ", "𝚊", "𝚋", "𝚌", "𝚍", "𝚎", "𝚏", "𝚐", "𝚑", "𝚒", "𝚓", "𝚔", "𝚕", "𝚖", "𝚗", "𝚘", "𝚙", "𝚚", "𝚛", "𝚜", "𝚝", "𝚞", "𝚟", "𝚠", "𝚡", "𝚢", "𝚣", "𝙰", "𝙱", "𝙲", "𝙳", "𝙴", "𝙵", "𝙶", "𝙷", "𝙸", "𝙹", "𝙺", "𝙻", "𝙼", "𝙽", "𝙾", "𝙿", "𝚀", "𝚁", "𝚂", "𝚃", "𝚄", "𝚅", "𝚆", "𝚇", "𝚈", "𝚉", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿", "𝟶", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", "\"", ",", ".", "/", "<", ">", "?"];
const coolFont_bubble = ["\t", "\n", " ", "ⓐ", "ⓑ", "ⓒ", "ⓓ", "ⓔ", "ⓕ", "ⓖ", "ⓗ", "ⓘ", "ⓙ", "ⓚ", "ⓛ", "ⓜ", "ⓝ", "ⓞ", "ⓟ", "ⓠ", "ⓡ", "ⓢ", "ⓣ", "ⓤ", "ⓥ", "ⓦ", "ⓧ", "ⓨ", "ⓩ", "Ⓐ", "Ⓑ", "Ⓒ", "Ⓓ", "Ⓔ", "Ⓕ", "Ⓖ", "Ⓗ", "Ⓘ", "Ⓙ", "Ⓚ", "Ⓛ", "Ⓜ", "Ⓝ", "Ⓞ", "Ⓟ", "Ⓠ", "Ⓡ", "Ⓢ", "Ⓣ", "Ⓤ", "Ⓥ", "Ⓦ", "Ⓧ", "Ⓨ", "Ⓩ", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⓪", "`", "~", "❕", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "❜", ":", "❞", ",", ".", "/", "<", ">", "❔"];
const coolFont_cursive = ["\t", "\n", " ", "𝒶", "𝒷", "𝒸", "𝒹", "ℯ", "𝒻", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂", "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋", "𝓌", "𝓍", "𝓎", "𝓏", "𝒜", "ℬ", "𝒞", "𝒟", "ℰ", "ℱ", "𝒢", "ℋ", "ℐ", "𝒥", "𝒦", "ℒ", "ℳ", "𝒩", "𝒪", "𝒫", "𝒬", "ℛ", "𝒮", "𝒯", "𝒰", "𝒱", "𝒲", "𝒳", "𝒴", "𝒵", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", "\"", ",", ".", "/", "<", ">", "?"];

const whiteListedWords = [
    "he'll", "as", "bob", "mad", "ms", "yr", "yrs", "pt", "pts", "px", "kg", "oz", "ml", "tsp", "tb", "dam"
];

const defaultBannedWords = [
    "anal", "anus", "arse", "ass", "ass fuck", "ass hole", "assfucker", "asshole", "assshole", "bastard", "bitch", "black cock", "bloody hell", "boner", "boobies", "boob", "boobs", "boong", "butt hole", "cock", "cockfucker", "cocksuck", "cocksucker", "condom", "coon", "coonnass", "crap", "cum", "cunt", "cyberfuck", "damm", "dammm", "damn", "deez nut", "dick", "douche", "dummy", "erect", "erection", "erotic", "escort", "fag", "faggot", "fuck", "fuck off", "fuck you", "fuckass", "fuckhole", "god damn", "gook", "the hell", "hell no", "hell yeah", "homoerotic", "hore", "jerk off", "jerked off", "jerking off", "mother fucker", "motherfuck", "motherfucker", "negro", "nigga", "nigger", "nudes", "orgasim", "orgasm", "penis", "penisfucker", "pervert", "piss", "piss off", "porn", "porno", "pornography", "pornstar", "pussy", "retard", "sadist", "sex", "sexy", "shit", "shithole", "slut", "son of a bitch", "sperm", "testicle", "tits", "vagina", "viagra", "whore", "lmfao", "stfu", "ong", "🖕", "on god", "go to hell"
];

var commonLinesOfCode = [];


// thank you Stack Overflow :)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function random(aMin, aMax) {
    return Math.random() * (aMax - aMin) + aMin;
}

function replaceAll(str, oldStr, newStr) {
    while (str.includes(oldStr)) {
        str = str.replace(oldStr, newStr);
    }
    return str;
}

String.prototype.replaceAll = function (str1, str2) {
    return this.replace(
        new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), "g"),
        (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2
    );
};

// function shrinkTo2DupChars(s) {
//     var newS = "";
//     var idx = 0;
//     var currChar = s.charAt(idx);
//     var sLen = s.length;

//     while (idx < sLen) {
//         var currRepeats = 0;
//         while (s.charAt(idx + 1) === currChar) {
//             idx++;
//             currRepeats++;
//         }
//         idx -= currRepeats > 0 ? 1 : 0;

//         newS += currChar;
//         idx++;
//         currChar = s.charAt(idx);
//         currRepeats = 0;
//     }
//     return newS;
// }

function removeDupChars (str) {
    var newStr = "";
    var currChar = "";
    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (c !== currChar) {
            newStr += c;
        }
        currChar = c;
    }
    
    return newStr;
}

function swearFilterRegexCheck (str, swear){
  return new RegExp("(^|[^a-z])" + swear.split("").join("[^a-z]*") + "([^a-z]|$)").test(str);
}


function getJSON(url, callback, extras) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (JSON_data) {
            callback(JSON_data, extras);
        }).catch(function (error) {
            console.log(error);
        })
}

function getKAData(url, start, stop, type) {
    return fetch(url)
        .then(res => {
            return res.json();
        })
        .then(data => {
            if (type === "lists") {
                var newData = "";
                var img = "";
                if (!start) {
                    start = 0;
                }
                if (!stop) {
                    stop = data.scratchpads.length;
                }
                for (var i = start; i < stop; i++) {
                    var project = data.scratchpads[i];
                    newData += project.title + "\n";
                    newData += project.authorNickname + "\n";
                    newData += project.authorKaid + "\n";
                    newData += project.sumVotesIncremented + "\n";
                    newData += project.url + "\n";
                }
                return newData;
            } else if (type === "user") {
                var newData = {
                    nickname: "",
                    username: "",
                    bio: "",
                    kaid: "",
                    countVideosCompleted: "",
                    points: "",
                    dateJoined: "",
                    image: "",
                };
                if (data.nickname) {
                    newData.nickname = data.nickname;
                }
                if (data.username) {
                    newData.username = data.username;
                }
                if (data.bio) {
                    newData.bio = data.bio;
                }
                if (data.kaid) {
                    newData.kaid = data.kaid;
                }
                if (data.countVideosCompleted) {
                    newData.countVideosCompleted = numberWithCommas(data.countVideosCompleted);
                }
                if (data.points) {
                    newData.points = numberWithCommas(data.points);
                }
                if (data.dateJoined) {
                    var dataJoined = data.dateJoined.slice(0, 10).split("-");
                    newData.dateJoined = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(dataJoined[1], 10) - 1] + " " + dataJoined[2] + "th " + dataJoined[0] + " (" + (new Date().getFullYear() - parseInt(dataJoined[0])) + " years ago)";
                }
                if (data.avatar.imageSrc) {
                    newData.image = data.avatar.imageSrc.replace("svg/", "").replace(".svg", ".png");
                }

                return newData;
            }

        });
}

function coolifyText(message, font) {
    var data = "";
    for (var i = 0; i < message.length; i++) {
        var c = message[i];
        var idx = normFont.indexOf(c);
        if (idx >= 0) {
            data += font[idx];
        } else {
            data += c;
        }
    }
    return data;
}

function authorIsStaff(msg) {
    if (msg.author.id === "480905025112244234") {
        return true;
    }
    
    var authorizedRoles = ["owner", "staff", "moderator"];
    var authorRoles = msg.member._roles;
    var isStaff = false;

    msg.guild.roles.cache.forEach(function (role) {
        if (authorizedRoles.includes(role.name.toLowerCase()) && authorRoles.includes(role.id)) {
            isStaff = true;
        }
    });

    return isStaff;
}

function filterMessage(msg, wordList, logChannel, p) {
    // get lowercase of message
    var lowMsg = msg.content + " ";
    
    // removes links
    while (lowMsg.includes("http")) {
        var linkStart = lowMsg.indexOf("http");
        var linkStop = lowMsg.slice(linkStart).indexOf(" ");
        lowMsg = lowMsg.slice(0, linkStart) + lowMsg.slice(linkStart + linkStop, lowMsg.length);
    }
    
    lowMsg = lowMsg.toLowerCase();

    // get tokens of message
    var splitMsg = lowMsg.split(" ");

    // check if is a swearfilter command
    if (
        (splitMsg[0] === p + "swearfilter" && (splitMsg[1] === "add" || splitMsg[1] === "remove")) ||
        (msg.content.slice(0, 10) === "The word `" && msg.author.bot)
    ) {
        return false;
    }

    // the message to check
    var msgCheck = " " + lowMsg + " ";

    var isEmbed = false;
    // add embeds content to msgCheck
    if (msg.embeds) {
        for (var i = 0; i < msg.embeds.length; i++) {
            if (msg.embeds[i].description) {
                isEmbed = true;
                msgCheck += msg.embeds[i].description.toLowerCase();
            }
        }
    }
    
    // remove symbols
    msgCheck = " " + msgCheck.replaceAll("\n", " ").replaceAll("  ", " ").replaceAll("'", "").replaceAll("/", " ") + " ";
    
    var symbolsToRemove = "~!#%^&*()-=_+[]\\{};':\",.<>?";
    var newMsgCheck = "";
    for (var i = 0, len = msgCheck.length; i < len; i++) {
        var c = msgCheck.charAt(i);
        if (!symbolsToRemove.includes(c)) {
            newMsgCheck += c;
        } else {
            newMsgCheck += " ";
        }
    }
    msgCheck = newMsgCheck;

    // remove whitelisted words from the check
    for (var i = 0; i < whiteListedWords.length; i++) {
        if (!wordList.includes(whiteListedWords[i])) {
            msgCheck = msgCheck.replaceAll(whiteListedWords[i] + " ", " ");
        }
    }

    // remove a because it causes a lot of problems
    while (msgCheck.includes(" a ")) {
        msgCheck = msgCheck.replaceAll(" a ", " ");
    }

    // removing ing
    msgCheck = msgCheck.replaceAll("ing ", " ");

    // remove numbers
    msgCheck = msgCheck.split(" ");
    for (var i = 0; i < msgCheck.length; i++) {
        var tok = msgCheck[i].toLowerCase();
        var hasLetter = false;

        if (tok.charAt(tok.length - 1) === "s") {
            tok = tok.slice(0, tok.length - 1);
        }
        
        for (var j = 0; j < tok.length; j++) {
            if (alphabet.includes(tok.charAt(j))) {
                hasLetter = true;
                break;
            }
        }
        
        if (!hasLetter) {
            msgCheck[i] = "";
        }
    }
    msgCheck = msgCheck.join(" ");

    // replace common evasions
    msgCheck = msgCheck.replaceAll("@", "a");
    msgCheck = msgCheck.replaceAll("$", "s");
    msgCheck = msgCheck.replaceAll("|", "l");
    msgCheck = msgCheck.replaceAll("/", "l");
    msgCheck = msgCheck.replaceAll("1", "l");
    msgCheck = msgCheck.replaceAll("3", "e");
    msgCheck = msgCheck.replaceAll("4", "a");
    msgCheck = msgCheck.replaceAll("5", "s");
    msgCheck = msgCheck.replaceAll("8", "a");

    // remove duplicate letters
    msgCheck = " " + removeDupChars(msgCheck);

    var deletePost = false;
    var badWord = "";

    // go through all the bad words
    for (var i = 0, len = wordList.length; i < len; i++) {
        // the current bad word
        badWord = wordList[i];

        // create variations
        var variations = [];
        variations.push(removeDupChars(wordList[i]));
        variations.push(removeDupChars(wordList[i]).replaceAll("a", "6"));
        variations.push(removeDupChars(wordList[i]).replaceAll("g", "6"));
        // variations.push(removeDupChars(wordList[i]).split("").reverse().join(""));

        // go through all the variations
        for (var j = 0; j < variations.length; j++) {
            var wrd = variations[j];

            // regex check if message has bad word
            if (swearFilterRegexCheck(msgCheck, wrd)) {
                deletePost = true;
            }

            wrd = " " + wrd;

            // check normal text
            if (msgCheck.includes(wrd)) {
                var endChar = msgCheck.charAt(msgCheck.indexOf(wrd) + wrd.length);
                if (!alphabet.includes(endChar) || endChar === "") {
                    deletePost = true;
                    break;
                }
            }
        }

        if (deletePost) {
            break;
        }
    }

    deletePost = deletePost && msg.channel.type !== 'dm';

    // delete post
    if (deletePost) {
        console.log(msgCheck);
        
        var msgToSend = "Deleted message because it contained: `" + badWord + "`\nMessage Content:\n\n" + (isEmbed ? msg.embeds[0].description : msg.content);

        var channel = msg.channel;
        var username = msg.author.tag;
        var guild = msg.guild;

        if (membersDatabase[msg.author.id]) {
            membersDatabase[msg.author.id].badWordUses++;
            membersDatabase[msg.author.id].susnessCount++;
        }

        msg.delete().then(function () {
            channel.send("Deleted comment from " + username + " for using a dissallowed word.");
        }).catch(function () {});

        if (!msg.author.bot) {
            msg.author.send(msgToSend);
        }

        if (logChannel.length > 0) {
            guild.channels.cache.get(logChannel).send("Rule Breaker: " + username + "\n\n" + msgToSend);
        }

        client.users.fetch("480905025112244234").then(function (user) {
            if (user) {
                user.send("Rule Breaker: " + username + "\n\n" + msgToSend);
            }
        });
    }

    return deletePost;
}

// ---------- COMMANDS ---------- //

function onCommand_ping(msg, client) {
    msg.channel.send("Up and running!\n" + client.ws.ping + " millisecond delay");
}

function onCommand_help(msg) {
    msg.channel.send("```" + `
ping
invite
tictactoe
github (alias for invite)
update
    programs
plagiarism [PROGRAM_ID]
get
    hot [NUMBER]
    recent [NUMBER]
    votes [NUMBER]
    KAuser [KA_USERNAME/KAID]
    profilePic [*@USER*]
    pfp (alis for profilePic)
    discordId [*@USER*]
    guildId [*@USER*]
    roles [*@USER*]
    sus [*@USER*]
    activity [*@USER*]
search
    user [NICKNAME]
    google [SEARCH QUERY]
    images [SEARCH QUERY]
coolify
    normal [WORDS]
    gothic [WORDS]
    outline [WORDS]
    monospace [WORDS]    
    bubble [WORDS]
    cursive [WORDS]
wyr
define [WORD/PHRASE]
set
    prefix [PREFIX]
    logs [CHANNEL_ID]
swearFilter [ON/OFF/RESET/TEST/ADD]
    add [WORD]
    remove[WORD]
delete [NUMBER]
leaderboard
    sus
    activity
    pottymouth
eval [CODE] (code must be in code block)
translate "[WORD/PHRASE]" [ORIGIN_LANG] => [*TARGET_LANG*]
` + "```"
    );
}

function onCommand_github(msg) {
    msg.channel.send("https://github.com/vExcess/ka-monitor");
}

function onCommand_update(msg, splitMsg) {
    if (splitMsg[1] === "programs") {
        if (msg.author.id !== "480905025112244234") {
            msg.channel.send("You do not have permission to use that command.");
        } else {
            var targetRecurves = 1000;
            var recurves = 0;
            if (!programHashes) {
                programHashes = require('./programsDatabase');
                if (programHashes && programHashes.KA_PROGRAMHASHES) {
                    programHashes = programHashes.KA_PROGRAMHASHES;
                } else {
                    programHashes = {};
                }
            }
            msg.channel.send("Updating Program Database...");

            var getPrograms = function (programs, page_) {
                for (let j = 0; j < programs.length; j++) {
                    getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + programs[j]._id, function (data, program_) {
                        if (data && data.revision && data.revision.code) {
                            var splitCode = data.revision.code.split("\n");
                            var hashedCode = new Set();
                            for (var k = 0; k < splitCode.length; k += 2) {
                                hashedCode.add(hashCode(splitCode[k]));
                            }
                            programHashes["_" + program_._id] = [data.title, Array.from(hashedCode).join(',')];

                            if (program_.idx1 === targetRecurves && program_.idx2 === 49) {
                                fs.writeFileSync('programsData.js', "exports.KA_PROGRAMHASHES = " + JSON.stringify(programHashes), 'utf-8');
                                msg.channel.send("Program Database Updated");
                            }
                        }
                    }, {
                        _id: programs[j]._id,
                        idx1: page_.idx1,
                        idx2: j
                    });
                }

                if (recurves < targetRecurves) {
                    recurves++;
                    console.log("page " + recurves);
                    getJSON("https://willard.fun/programs?&start=" + recurves * 50, function (programs2, page_2) {
                        getPrograms(programs2, page_2);
                    }, {
                        idx1: recurves
                    });
                }
            };

            getJSON("https://willard.fun/programs?&start=" + i * 50, function (programs, page_) {
                getPrograms(programs, page_);
            }, {
                idx1: recurves
            });
        }
    }
}

function onCommand_plagiarism(msg, splitMsg, serverData) {
    if (serverData.busy) {
        msg.channel.send("Sorry, the bot is busy at this time");
    } else {
        var title = "";
        var codeHashes = [];
        var authorId = "";
        var spinoffs = [];
        var possibles = [];
        if (!programHashes) {
            programHashes = require('./programsDatabase');
            if (programHashes && programHashes.KA_PROGRAMHASHES) {
                programHashes = programHashes.KA_PROGRAMHASHES;
            } else {
                programHashes = {};
            }
        }

        serverData.busy = true;

        // get program
        getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + splitMsg[1], function (data) {
            title = data.title;
            codeHashes = data.revision.code.split("\n").map(line => line.trim()).filter(line => line.length > 4);
            for (var i = 0; i < codeHashes.length; i++) {
                codeHashes[i] = hashCode(codeHashes[i]);
            }
            msg.channel.send(codeHashes.length + " lines of code to search...");
            authorId = data.kaid;

            // get spin-offs
            getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + splitMsg[1] + "/top-forks?limit=1000", function (data2) {
                for (var i = 0; i < data2.scratchpads.length; i++) {
                    spinoffs.push(data2.scratchpads[i].url.split("/")[5]);
                }

                for (var program in programHashes) {
                    var lineHashes = programHashes[program][1].split(",");
                    var lineSet = new Set(lineHashes);
                    var matches = 0;
                    for (var i = 0; i < codeHashes.length; i++) {
                        if (lineSet.has(codeHashes[i])) {
                            matches += 2;
                        }
                    }
                    if (matches > lineHashes.length * 0.15) {
                        possibles.push([
                            programHashes[program][0],
                            program.slice(1, program.length),
                            matches
                        ]);
                    }
                }

                const exampleEmbed = new Discord.MessageEmbed();

                possibles.sort(function (a, b) {
                    return b[2] - a[2];
                });

                for (var i = 0; i < Math.min(possibles.length, 10); i++) {
                    exampleEmbed.addField(possibles[i][2] + " lines that match", "[" + possibles[i][0] + "](https://www.khanacademy.org/computer-programming/i/" + possibles[i][1] + ")");
                }

                exampleEmbed.setColor("#1fab55");
                exampleEmbed.setTitle("**Results for: " + title + "**");
                exampleEmbed.setURL("https://www.khanacademy.org/computer-programming/i/" + splitMsg[1]);
                msg.channel.send({
                    embeds: [exampleEmbed]
                });
                serverData.busy = false;

            });
        });
    }
}

function onCommand_get(msg, splitMsg, mentionedUser) {
    if (splitMsg[1] === "hot") {
        var num = parseInt(splitMsg[2], 10);
        if (typeof num !== "number") {
            return;
        }
        if (num < 1 || num > 10000) {
            msg.channel.send("Inputted number must be between 1 and 10000 (inclusive)");
        } else {
            msg.channel.send("Fetching...");
            getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=3&limit=" + num, num - 1, num, "lists").then(function (txt) {
                msg.channel.send(txt);
            });
        }
    }
    
    if (splitMsg[1] === "recent") {
        var num = parseInt(splitMsg[2], 10);
        if (typeof num !== "number") {
            return;
        }
        if (num < 1 || num > 10000) {
            msg.channel.send("Inputted number must be between 1 and 10000 (inclusive)");
        } else {
            msg.channel.send("Fetching...");
            getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=2&limit=" + num, num - 1, num, "lists").then(function (txt) {
                msg.channel.send(txt);
            });
        }
    }
    
    if (splitMsg[1] === "votes") {
        var num = parseInt(splitMsg[2], 10);
        if (typeof num !== "number") {
            return;
        }
        if (num < 1 || num > 10000) {
            msg.channel.send("Inputted number must be between 1 and 10000 (inclusive)");
        } else {
            msg.channel.send("Fetching...");
            getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=5&limit=" + num + "&topic_id=xffde7c31", num - 1, num, "lists").then(function (txt) {
                msg.channel.send(txt);
            });
        }
    }
    
    if (splitMsg[1] === "profilepic" || splitMsg[1] === "pfp") {
        if (!mentionedUser) {
            mentionedUser = msg.member.user;
        } else if (!mentionedUser.id) {
            msg.channel.send("Not a valid user.");
            return;
        }

        var imgLink = false;
        imgLink = mentionedUser.displayAvatarURL({
            size: 2048,
            dynamic: true
        });

        if (imgLink) {
            msg.channel.send({
                content: mentionedUser.username + (mentionedUser.username.charAt(mentionedUser.username.length - 1).toLowerCase() === "s" ? "" : "'s") + " Profile Image:",
                files: [new Discord.MessageAttachment(imgLink)]
            });
        } else {
            msg.channel.send("Image not found");
        }

    }
    
    if (splitMsg[1] === "discordid") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            msg.channel.send("Not a valid user.");
            return;
        }

        if (msg.guild && msg.guild.members && msg.guild.members.cache && msg.guild.members.cache.get) {
            var memberTarget = msg.guild.members.cache.get(mentionedUser.id);
            if (memberTarget && memberTarget.user) {
                msg.channel.send(memberTarget.user.id);
            }
        }
    }
    
    if (splitMsg[1] === "guildid") {
        msg.channel.send(msg.guild.id);
    }
    
    if (splitMsg[1] === "channelid") {
        msg.channel.send(msg.channel.id);
    }
    
    if (splitMsg[1] === "roles") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            msg.channel.send("Not a valid user.");
            return;
        }

        var userRoles = msg.guild.members.cache.find(member => member.user.id === mentionedUser.id)._roles;

        var output = "Roles:\n";
        msg.guild.roles.cache.forEach(function (role) {
            if (role.id !== msg.guild.id && userRoles.includes(role.id)) {
                output += "\t" + role.name + " (" + role.id + ")\n";
            }
        });

        msg.channel.send(output);
    }
    
    if (splitMsg[1] === "KAuser") {
        let contentString = "";

        // remove @ if it's included
        if (splitMsg[2].charAt(0) === "@") {
            splitMsg[2] = splitMsg[2].slice(1, splitMsg[2].length);
        }

        // make fetch variables object
        var variablesObj = {};
        if (splitMsg[2].slice(0, 5) === "kaid_") {
            variablesObj.kaid = splitMsg[2];
        } else {
            variablesObj.username = splitMsg[2];
        }

        msg.channel.send("Searching...");
        
        // get main profile data
        KA_fetch.graphQL({
                operationName: "getFullUserProfile",
                variables: variablesObj
            },
            function (data) {
                // notify if user is not found
                if (!data.user) {
                    msg.channel.send("User not found");
                    return;
                }

                // calc date joined
                var dateJoined = "Access Denied";
                if (data.user.joined) {
                    dateJoined = data.user.joined.slice(0, 10).split("-");
                    dateJoined = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(dateJoined[1], 10) - 1] + " " + dateJoined[2] + "th " + dateJoined[0] + " (" + (new Date().getFullYear() - parseInt(dateJoined[0])) + " years ago)";
                }

                // create embed
                const kaUserEmbed = new Discord.MessageEmbed()
                    .setColor("#1fab55")
                    .setTitle("**" + data.user.nickname + "**")
                    .setURL("https://www.khanacademy.org/profile/" + data.user.kaid);

                // store user data
                contentString += "**GENERAL INFO**:" +
                    "\nUsername:  " + data.user.username +
                    "\nKAID:  " + data.user.kaid + 
                    "\nBio:  " + data.user.bio + 
                    "\nDate Joined:  " + dateJoined + 
                    "\nEnergy Points:  " + numberWithCommas(data.user.points);

                // get avatar data
                KA_fetch.graphQL({
                        operationName: "avatarDataForProfile",
                        variables: {
                            kaid: data.user.kaid
                        },
                    },
                    function (data2) {
                        // set embed thumbnail
                        kaUserEmbed.setThumbnail(data2.user.avatar.imageSrc.replace("svg/", "").replace(".svg", ".png"));

                        // get badges and discussion data
                        KA_fetch.graphQL(
                            {
                                operationName: "getProfileWidgets",
                                variables: {
                                    kaid: data.user.kaid
                                },
                            }, 
                            function (data3) {
                                var widgets = data3.user.profileWidgets;
                                var badgeWidget = null;
                                var discussionWidget = null;

                                // get references to widgets I want
                                for (var i = 0; i < widgets.length; i++) {
                                    if (widgets[i].__typename === "BadgeCountWidget") {
                                        badgeWidget = widgets[i];
                                    } else if (widgets[i].__typename === "DiscussionWidget") {
                                        discussionWidget = widgets[i];
                                    }
                                }

                                // calc number of badges
                                var numBadges = 0;
                                if (badgeWidget) {
                                    for (var i = 0; i < badgeWidget.badgeCounts.length; i++) {
                                        numBadges += badgeWidget.badgeCounts[i].count;
                                    }
                                }
                                
                                // add badges data
                                contentString += "\nBadge Count:  " + numBadges;

                                if (discussionWidget) {
                                    var stats = discussionWidget.statistics;
                                    
                                    contentString += "\n\n**DISCUSSION INFO**" +
                                        "\nAnswers:  " + stats.answers + 
                                        "\nTips & Thanks:  " + stats.comments + 
                                        "\nQuestions:  " + stats.questions + 
                                        "\nComments:  " + stats.replies + 
                                        "\nHelp Requests:  " + stats.projectquestions + 
                                        "\nHelp Request Answers:  " + stats.projectanswers + 
                                        "\nVotes Given:  " + stats.votes;
                                }
                                
                                // get program
                                getJSON("https://www.khanacademy.org/api/internal/user/scratchpads?kaid=" + data.user.kaid + "&limit=10000", function (data4) {
                                    var totalPrograms = data4.scratchpads.length;
                                    var totalVotes = 0;
                                    var totalForks = 0;
                                    for (var i = 0; i < totalPrograms; i++) {
                                        var program = data4.scratchpads[i];

                                        totalVotes += program.sumVotesIncremented;
                                        totalForks += program.spinoffCount;
                                    }

                                    // add programs data
                                    contentString += "\n\n**PROGRAM INFO**" + 
                                        "\nProgram Count:  " + totalPrograms + 
                                        "\nVotes Recieved:  " + totalVotes + 
                                        "\nSpinoffs Recieved:  " + totalForks + 
                                        "\nAverage Votes Recieved:  " + Math.round(totalVotes / totalPrograms) + 
                                        "\nAverage Spinoffs Recieved:  " + Math.round(totalForks / totalPrograms);
                                    
                                    // set description and send embed
                                    kaUserEmbed.setDescription(contentString);
                                    msg.channel.send({
                                        embeds: [kaUserEmbed]
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    }

    if (splitMsg[1] === "sus") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            msg.channel.send("Not a valid user.");
            return;
        }
        
        if (!membersDatabase[mentionedUser.id]) {
            msg.channel.send("No data for that user.");
        } else {
            var member = membersDatabase[mentionedUser.id];

            msg.channel.send("```\n" + 
                member.tag + 
                "\nTotal Messages Sent: " + member.messagesSent + 
                "\nBad Words Sent: " + member.badWordUses + 
                "\nSusness Score: " + Math.round(member.susnessCount / member.messagesSent * 1000) + 
                "\n```"
            );
        }
    }

    if (splitMsg[1] === "activity") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            msg.channel.send("Not a valid user.");
            return;
        }
        
        if (!membersDatabase[mentionedUser.id]) {
            msg.channel.send("No data for that user.");
        } else {
            var member = membersDatabase[mentionedUser.id];
            var lastMessageTime = member.lastMessageTime;
            var activityHours = member.hoursActivity;

            var timezoneOffsets = {
                pacific: 8,
                mountain: 7,
                central: 6,
                eastern: 5
            };

            var timezoneNames = {
                pacific: "America/Los_Angeles",
                mountain: "America/Boise",
                central: "America/Chicago",
                eastern: "America/New_York"
            };

            var input2 = splitMsg[2] && splitMsg[2].includes("<@") ? splitMsg[3] : splitMsg[2];
            var offset = timezoneOffsets[splitMsg[2]] || 0;
            var timezone = timezoneNames[splitMsg[2]] || "UTC";

            with (activityPJS) {
                var scl = 460 / 23;
                var graphHeight = scl * 10;
                var maxActivity = 0;
                for (var i = 0; i < activityHours.length; i++) {
                    if (activityHours[i] > maxActivity) {
                        maxActivity = activityHours[i];
                    }
                }
                
                background(0);
                
                stroke(50);
                fill(255);
                for (var x = 0; x < 24; x++) {
                    // vertical lines
                    line(20 + x * scl, 0, 20 + x * scl, graphHeight);
                    
                    // numbers
                    // text((x % 12) + 1, 20 + x * scl, graphHeight + 16);
                }
                for (var y = 0; y <= 10; y++) {
                    // horizontal lines
                    line(20, y * scl, 480, y * scl);
                }
                
                function offsetGIdx (x) {
                    return (x + offset) % 24;
                }
                
                // draw stats
                stroke(255, 0, 0);
                for (var i = 0; i < activityHours.length - 1; i++) {
                    line(
                        20 + i * scl, 
                        graphHeight - activityHours[offsetGIdx(i)] / maxActivity * (graphHeight - 5) - 1,
                        20 + (i + 1) * scl, 
                        graphHeight - activityHours[offsetGIdx(i + 1)] / maxActivity * (graphHeight - 5) - 1
                    );
                }
            }

            const imgBuff = new Buffer.from(activityCanvas.toDataURL('jpeg', 100).split(",")[1], "base64");
            const imgAttach = new Discord.MessageAttachment(imgBuff, "activity.png");
            
            var d = new Date(lastMessageTime).toLocaleDateString("en-US", {
              	timeZone: timezone,
              
                weekday: 'long', 
              	year: 'numeric', 
              	month: 'long', 
              	day: 'numeric',
              	hour: 'numeric',
              	minute: 'numeric',
              	timeZoneName: 'long'
            });

            msg.channel.send({
                content: "```\n" + 
                member.tag +
                "\nLast Activity was on: " + d +
                "\nMessages Sent: " + member.messagesSent +
                "\nGraph of activity at certain hours of the day:" +
                "```",
                files: [imgAttach]
            });
        }
    }
}

function onCommand_search(msg, splitMsg) {
    if (splitMsg[1] === "user") {
        var results = searchUsers(splitMsg[2]);

        msg.channel.send("Searching...");

        const exampleEmbed = new Discord.MessageEmbed();

        for (var i = 0; i < Math.min(results.length, 10); i++) {
            exampleEmbed.addField(results[i][0], "[kaid_" + results[i][1] + "](https://www.khanacademy.org/profile/kaid_" + results[i][1] + ")");
        }

        exampleEmbed.setColor("#1fab55");
        exampleEmbed.setTitle("**Search Results (" + results.length + "):**");
        exampleEmbed.setURL("https://www.khanacademy.org/computer-programming/i/4733975100702720");

        msg.channel.send({
            embeds: [exampleEmbed]
        });
    }
    if (splitMsg[1] === "google" || splitMsg[1] === "bing" || splitMsg[1] === "duckduckgo" || splitMsg[1] === "yahoo") {
        var query = msg.content.slice(15, msg.content.length);

        msg.channel.send("Searching...");

        fetch("https://www.google.com/search?q=" + query)
            .then(res => res.text())
            .then(function (text) {
                const exampleEmbed = new Discord.MessageEmbed();
                
                const dom = new JSDOM(text);
                var newResults = [];

                const results = dom.window.document.getElementsByClassName("Gx5Zad fP1Qef xpd EtOod pkphOe");

                for (var i = 0; i < results.length; i++) {
                    var parts = results[i].getElementsByClassName("kCrYT");
                    var header = parts[0];
                    var body = parts[1];

                    if (header && body) {
                        if (!header.getElementsByTagName("a")[0]) {
                            var temp = header.cloneNode();
                            header = body.cloneNode();
                            body = temp;
                        }

                        // the URL
                        var link = header.getElementsByTagName("a");
                        if (link[0]) {
                            link = decodeURIComponent(link[0].href.slice(7, link[0].href.indexOf("&sa=")));
                        } else {
                            link = false;
                        }

                        // the title
                        var label = header.getElementsByClassName("BNeawe vvjwJb AP7Wnd");
                        if (label[0]) {
                            label = label[0].textContent;
                        } else {
                            label = false;
                        }

                        // the path
                        var path = header.getElementsByClassName("BNeawe UPmit AP7Wnd");
                        if (path[0]) {
                            path = path[0].textContent;
                        } else {
                            path = false;
                        }

                        // the description
                        var description = body.getElementsByClassName("BNeawe s3v9rd AP7Wnd");
                        if (description[0]) {
                            description = description[0].textContent.split("...")[0];
                            description = description.slice(0, description.length - 1) + "...";
                        } else {
                            description = "";
                        }

                        if (label && link && path) {
                            newResults.push([label, path, link, description]);
                        }
                    }
                }

                for (var i = 0; i < newResults.length; i++) {
                    var r = newResults[i];
                    exampleEmbed.addField(r[0], "[" + r[1] + "](" + r[2] + ")\n" + r[3]);
                    if (i < newResults.length - 1) {
                        exampleEmbed.addField("\u200b", "\u200b");
                    }
                }

                exampleEmbed.setColor("#1fab55");
                exampleEmbed.setTitle("**Results for: " + query + "**");

                msg.channel.send({
                    embeds: [exampleEmbed]
                });

            })
    }
    if (splitMsg[1] === "images") {
        var query = msg.content.slice(15, msg.content.length);

        msg.channel.send("Searching...");
        
        fetch("https://www.google.com/search?q=" + query + "&tbm=isch")
            .then(res => res.text())
            .then(function (text) {
                fs.writeFile("google.txt", text, ()=>{});

                var links = [];
                
                const dom = new JSDOM(text);

                const results = dom.window.document.getElementsByClassName("yWs4tf");

                for (var i = 0; i < Math.min(5, results.length); i++) {
                    links.push(new Discord.MessageEmbed().setImage(results[i].src));
                }

                msg.channel.send({
                    content: "Results:",
                    embeds: links,
                }).catch(console.log);
            })
    }
}

function onCommand_coolify(msg, splitMsg, p) {
    if (!splitMsg[1]) {
        msg.channel.send("No input");
    }
    var newData = "";
    var str = msg.content.substring(splitMsg[0].length + splitMsg[1].length + 1, msg.content.length);
    if (splitMsg[1] === "gothic") {
        newData = coolifyText(str, coolFont_gothic);
    }
    if (splitMsg[1] === "outline") {
        newData = coolifyText(str, coolFont_outline);
    }
    if (splitMsg[1] === "monospace") {
        newData = coolifyText(str, coolFont_monospace);
    }
    if (splitMsg[1] === "bubble") {
        newData = coolifyText(str, coolFont_bubble);
    }
    if (splitMsg[1] === "cursive") {
        newData = coolifyText(str, coolFont_cursive);
    }
    if (splitMsg[1] === "normal") {
        newData = str.replaceAll(p + "coolify normal", "");
    }
    msg.channel.send(newData).catch(console.log);
}

function onCommand_wyr(msg) {
    var wyrId = Math.floor(random(3, 500000));

    fetch("https://www.either.io/" + wyrId)
        .then(res => res.text())
        .then(function (text) {
            if (!text.includes("We cannot find the page you are looking for")) {
                var preface = text.split('<h3 class="preface">')[1].split("</h3>")[0];

                var options = text.split('<div class="option">');
                options = [
                    options[3].split('</div>')[0].split('rel="nofollow">')[1].split('</a>')[0].replace("\n", ""),
                    options[4].split('</div>')[0].split('rel="nofollow">')[1].split('</a>')[0].replace("\n", "")
                ];

                msg.channel.send("**" + preface + "**\n\n**EITHER...**\n:regional_indicator_a: " + options[0] + "\n\n**OR...**\n:regional_indicator_b: " + options[1])
                    .then(function (msg) {
                        msg.react("🇦")
                            .then(function () {
                                msg.react("🇧");
                            });
                    });

            } else {
                msg.channel.send("An Error Has Occured. Please Try Again In A Few Seconds.");
            }
        });
}

function onCommand_define(msg, lowMsg) {
    var inputWord = lowMsg.slice(8, lowMsg.length);
    var joinedInputWord = inputWord;
    while (joinedInputWord.includes(" ")) {
        joinedInputWord = joinedInputWord.replace(" ", "-");
    }

    fetch("https://www.dictionary.com/browse/" + joinedInputWord)
        .then(res => res.text())
        .then(text => {
            if (!text.includes("No results found for") && !text.includes("Results for ")) {
                var content = text.split('<div class="css-1avshm7 e16867sm0">')[1];
                var idx = 0;
                var divLevel = 1;
                while (divLevel > 0 && idx < content.length) {
                    if (content.charAt(idx) === "<") {
                        if (content.slice(idx + 1, idx + 4) === "div") {
                            divLevel++;
                        } else if (content.slice(idx + 1, idx + 5) === "/div") {
                            divLevel--;
                        }
                    }
                    idx++;
                }
                content = '<div class="css-1avshm7 e16867sm0">' + content.slice(0, idx) + "/div>";

                const dom = new JSDOM('<!DOCTYPE html>' + content);
                const dict = dom.window.document.getElementsByClassName("css-1avshm7 e16867sm0")[0];
                var word = dict.getElementsByClassName("e1wg9v5m5")[0].textContent;
                var entries = dict.getElementsByClassName("css-109x55k e1hk9ate4");

                if (entries.length === 0) {
                    entries = dict.getElementsByClassName("one-click-content css-0 e1w1pzze4");
                    msg.channel.send({
                        embeds: [{
                            color: 3447003,
                            description: ("**" + word + "**\n\n" + entries[0].textContent).slice(0, 2000)
                        }]
                    })
                    return;
                }

                var definitionOutput = "";
                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];

                    var partOfSpeech = entry.getElementsByClassName("luna-pos")[0];
                    if (partOfSpeech) {
                        partOfSpeech = partOfSpeech.textContent;
                    }
                    if (partOfSpeech) {
                        if (partOfSpeech.charAt(partOfSpeech.length - 1) === ",") {
                            partOfSpeech = partOfSpeech.slice(0, partOfSpeech.length - 1);
                        }
                        definitionOutput += "*`" + partOfSpeech + ":`*\n";
                    }

                    var defs = entry.getElementsByClassName("one-click-content css-nnyc96 e1q3nk1v1");
                    for (var j = 0; j < defs.length && j < 3; j++) {
                        definitionOutput += "*" + (j + 1) + ")*   " + defs[j].textContent + "\n";
                    }

                    definitionOutput += "\n";
                }

                msg.channel.send({
                    embeds: [{
                        color: 3447003,
                        description: ("**" + word + "**\n\n" + definitionOutput).slice(0, 2000)
                    }]
                })

            } else {
                msg.channel.send("No results found for: " + inputWord);
            }

        });
}

function onCommand_swearFilter(msg, splitMsg, lowMsg, serverData) {
    if (!authorIsStaff(msg)) {
        msg.channel.send("You do not have permission to use that command.");
        return;
    }

    if (splitMsg[1] === "on" || splitMsg[1] === "true" || splitMsg[1] === "yes") {
        serverData.swearFilterOn = true;
        msg.channel.send("The swear filter has been turned on in " + msg.guild.name);
        fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else if (splitMsg[1] === "off" || splitMsg[1] === "false" || splitMsg[1] === "no") {
        serverData.swearFilterOn = false;
        msg.channel.send("The swear filter has been turned off in " + msg.guild.name);
        fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else if (splitMsg[1] === "test") {
        msg.channel.send({
            embeds: [{
                color: 3447003,
                description: "what the **hell**"
            }]
        });
    } else if (splitMsg[1] === "reset") {
        serverData.bannedWords = defaultBannedWords.slice(0, defaultBannedWords.length);
        msg.channel.send("The swear filter has been reset in " + msg.guild.name);
        fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else if (splitMsg[1] === "add") {
        var wrd = lowMsg.slice(lowMsg.indexOf(splitMsg[1]) + splitMsg[1].length + 1, lowMsg.length);
        var wordIdx = serverData.bannedWords.indexOf(wrd);
        if (wordIdx < 0) {
            serverData.bannedWords.push(wrd);
            msg.channel.send("The word `" + wrd + "` has been added to the filter.");
            fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
        } else {
            msg.channel.send("The word `" + wrd + "` is already on the filter.");
        }
    } else if (splitMsg[1] === "remove") {
        var wrd = lowMsg.slice(lowMsg.indexOf(splitMsg[1]) + splitMsg[1].length + 1, lowMsg.length);
        var wordIdx = serverData.bannedWords.indexOf(wrd);
        if (wordIdx >= 0) {
            serverData.bannedWords.splice(wordIdx, 1);
            msg.channel.send("The word `" + wrd + "` has been removed from the filter.");
            fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
        } else {
            msg.channel.send("The word `" + wrd + "` is not on the filter.");
        }
    }
}

function onCommand_set(msg, splitMsg, serverData) {
    if (!authorIsStaff(msg)) {
        msg.channel.send("You do not have permission to use that command.");
        return;
    }

    if (splitMsg[1] === "prefix") {
        serverData.prefix = splitMsg[2];
        msg.channel.send("My prefix has been set to `" + serverData.prefix + "`");
        fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    }

    if (splitMsg[1] === "logs") {
        var c = msg.guild.channels.cache.get(splitMsg[2]);

        if (c) {
            serverData.logChannel = splitMsg[2];
            msg.channel.send("Logging to <#" + serverData.logChannel + ">");
        } else {
            serverData.logChannel = "";
            msg.channel.send("Channel not found");
        }

        fs.writeFileSync('serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    }
}

function onCommand_leaderboard (msg, splitMsg) {
    if (splitMsg[1] === "activity") {
        var membersArray = [];
        for (var memberId in membersDatabase) {
            var member = membersDatabase[memberId];
            if (member.guilds.includes(msg.guild.id)) {
                membersArray.push([member.tag, member.messagesSent]);
            }
        }
        
        membersArray.sort(function (a, b) {
            return b[1] - a[1];
        });

        var content = "**ACTIVITY LEADERBOARD:**\n```";
        var leaderboardLength = Math.min(10, membersArray.length);

        for (var i = 0; i < leaderboardLength; i++) {
            var member = membersArray[i];
            content += (i + 1) + ") " + member[0] + " --- " + member[1] + " messages sent\n";
        }

        msg.channel.send(content + "```");
    }

    if (splitMsg[1] === "pottymouth") {
        var membersArray = [];
        for (var memberId in membersDatabase) {
            var member = membersDatabase[memberId];
            if (member.guilds.includes(msg.guild.id)) {
                membersArray.push([member.tag, member.badWordUses]);
            }
        }
        
        membersArray.sort(function (a, b) {
            return b[1] - a[1];
        });

        var content = "**POTTY MOUTH LEADERBOARD:**\n```";
        var leaderboardLength = Math.min(10, membersArray.length);

        for (var i = 0; i < leaderboardLength; i++) {
            var member = membersArray[i];
            content += (i + 1) + ") " + member[0] + " --- " + member[1] + " bad words sent\n";
        }

        msg.channel.send(content + "```");
    }

    if (splitMsg[1] === "sus") {
        var membersArray = [];
        for (var memberId in membersDatabase) {
            var member = membersDatabase[memberId];
            if (member.guilds.includes(msg.guild.id)) {
                membersArray.push([member.tag, Math.round(member.susnessCount / member.messagesSent * 1000)]);
            }
        }
        
        membersArray.sort(function (a, b) {
            return b[1] - a[1];
        });

        var content = "**SUSNESS LEADERBOARD:**\n```";
        var leaderboardLength = Math.min(10, membersArray.length);

        for (var i = 0; i < leaderboardLength; i++) {
            var member = membersArray[i];
            content += (i + 1) + ") " + member[0] + " --- " + member[1] + " susness points\n";
        }

        msg.channel.send(content + "```");
    }

}

function onCommand_translate (msg) {
    var msgContent = msg.content.slice(11);
    
    var lastQuoteIdx = msgContent.length - 1;
    while (lastQuoteIdx > 0) {
        if (msgContent.charAt(lastQuoteIdx) === '"') {
            break;
        }
        lastQuoteIdx--;
    }

    var firstQuoteIdx = msgContent.indexOf('"') + 1;
    
    if (firstQuoteIdx === 0 || lastQuoteIdx === 0) {
        msg.channel.send("Quote to translate not found. Remember to put what you want to translate into quotes.");
    }
    
    var transMsg = msgContent.slice(firstQuoteIdx, lastQuoteIdx);
    var msgLangs = msgContent.slice(lastQuoteIdx + 2).split("=>");
    if (msgLangs[0].includes(">")) {
        msgLangs = msgLangs[0].split(">");
    }
    
    msgLangs[0] = msgLangs[0].toLowerCase().trim();
    if (msgLangs[1]) {
        msgLangs[1] = msgLangs[1].toLowerCase().trim();
    }

    var languages = "auto,detect language|af,afrikaans|sq,albanian|am,amharic|ar,arabic|hy,armenian|as,assamese|ay,aymara|az,azerbaijani|bm,bambara|eu,basque|be,belarusian|bn,bengali|bho,bhojpuri|bs,bosnian|bg,bulgarian|ca,catalan|ceb,cebuano|ny,chichewa|zh-CN,chinese|	zh-CN,chinese (simplified)|zh-TW,chinese (traditional)|co,corsican|hr,croatian|cs,czech|da,danish|dv,dhivehi|doi,dogri|nl,dutch|en,english|eo,esperanto|et,estonian|ee,ewe|tl,filipino|fi,finnish|fr,french|fy,frisian|gl,galician|ka,georgian|de,german|el,greek|gn,guarani|gu,gujarati|ht,haitian creole|ha,hausa|haw,hawaiian|iw,hebrew|hi,hindi|hmn,hmong|hu,hungarian|is,icelandic|ig,igbo|ilo,ilocano|id,indonesian|ga,irish|it,italian|ja,japanese|jw,javanese|kn,kannada|kk,kazakh|km,khmer|rw,kinyarwanda|gom,konkani|ko,korean|kri,krio|ku,kurdish (kurmanji)|ckb,kurdish (sorani)|ky,kyrgyz|lo,lao|la,latin|lv,latvian|ln,lingala|lt,lithuanian|lg,luganda|lb,luxembourgish|mk,macedonian|mai,maithili|mg,malagasy|ms,malay|ml,malayalam|mt,maltese|mi,maori|mr,marathi|mni-Mtei,meiteilon (manipuri)|lus,mizo|mn,mongolian|my,myanmar (burmese)|ne,nepali|no,norwegian|or,odia (oriya)|om,oromo|ps,pashto|fa,persian|pl,polish|pt,portuguese|pa,punjabi|qu,quechua|ro,romanian|ru,russian|sm,samoan|sa,sanskrit|gd,scots gaelic|nso,sepedi|sr,serbian|st,sesotho|sn,shona|sd,sindhi|si,sinhala|sk,slovak|sl,slovenian|so,somali|es,spanish|su,sundanese|sw,swahili|sv,swedish|tg,tajik|ta,tamil|tt,tatar|te,telugu|th,thai|ti,tigrinya|ts,tsonga|tr,turkish|tk,turkmen|ak,twi|uk,ukrainian|ur,urdu|ug,uyghur|uz,uzbek|vi,vietnamese|cy,welsh|xh,xhosa|yi,yiddish|yo,yoruba|zu,zulu".split("|").map(l => l.split(","));

    var knowsLanguage = 0;
    for (var i = 0; i < languages.length; i++) {
        var lang = languages[i];

        for (var j = 0; j < Math.min(msgLangs.length, 2); j++) {
            if (msgLangs[j] === lang[1]) {
                msgLangs[j] = lang[0];
                knowsLanguage++;
            }
        }
    }

    if (!msgLangs[1]) {
        msgLangs[1] = "en";
    }

    if (knowsLanguage === 0) {
        msg.channel.send("That language is not known.");
        return;
    }
    
    fetch("https://translate.google.com/_/TranslateWebserverUi/data/batchexecute", {
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        "body": "f.req=" + encodeURIComponent(JSON.stringify([[[process.env['translateToken'], "[[\"" + transMsg + "\",\"" + msgLangs[0] + "\",\"" + msgLangs[1] + "\"]]"]]]))
    }).then(res => res.text()).then(function (data) {
        data = data.slice(data.indexOf('\\"') + 2, data.length);
        data = data.slice(data.indexOf('\\"') + 2, data.length);
        data = data.slice(data.indexOf('\\"') + 2, data.length);
        data = data.slice(0, data.indexOf('\\"'));
        msg.channel.send(data);
    })
}

function onCommand_eval (msg) {
    var code = msg.content.slice(msg.content.indexOf("```"));
    if (code.slice(0, 5) === "```js") {
        code = code.slice(code.indexOf("\n") + 1);
    } else {
        code = code.slice(code.indexOf("```") + 3);
    }
    var endIdx = code.length - 1;
    while (endIdx > 0) {
        if (code.charAt(endIdx) === "`" && code.charAt(endIdx - 1) === "`" && code.charAt(endIdx - 2) === "`") {
            endIdx -= 2;
            break;
        }
        endIdx--;
    }
    
    try {
        // check that code exists
        if (code.length === 0) {
            msg.channel.send("Code block not found");
            return;
        }

        // transpile all ES6 to ES5
        var transpilerOptions = {"presets": [[
            "@babel/preset-env", {
                "targets": {
                    "chrome": "1"
                }
            }
        ]]};
        code = code.slice(0, code.length - 3);
        
        code = babel.transformSync(code, transpilerOptions).code.slice(15);
    
        var VM_logs = [];

        // create the interpreter for the VM
        const myInterpreter = new JSInterpreter.Interpreter(code, function (interpreter, globalObject) {
            var logToVMLogs = function (data) {
                VM_logs.push(data.toString());
            };
            
            // create a console for the VM
            var VM_console = interpreter.nativeToPseudo({});
            interpreter.setProperty(globalObject, 'console', VM_console);
            
            interpreter.setProperty(VM_console, 'log', interpreter.createNativeFunction(logToVMLogs));
            
            interpreter.setProperty(globalObject, 'println', interpreter.createNativeFunction(logToVMLogs));
        });
        
        var runStartTime = Date.now();
        var running = true;
        var error = false;

        // run the code
        while (running) {
            running = myInterpreter.step();
            
            if (Date.now() - runStartTime > 3000) {
                error = true;
                running = false;
                msg.channel.send("oh no! Program taking too long to run");
            }
        }
    } catch (err) {
        error = true;
        running = false;
        msg.channel.send("**An Error Has Occured:**\n```diff\n- " + err.toString().slice(0, 1950) + "\n```");
    }

    console.log("-----------------------------")

    if (!error) {
        const resultEmbed = new Discord.MessageEmbed();

        resultEmbed.setColor("#1fab55");
        resultEmbed.addField("**Program Output:**", VM_logs.join("\n").slice(0, 1950));
        
        msg.channel.send({
            embeds: [resultEmbed]
        });
    }    
}

function onCommand_dangerEval (msg) {
    if (msg.author.id === "480905025112244234") {
        var code = msg.content.slice(msg.content.indexOf("```"));
        if (code.slice(0, 5) === "```js") {
            code = code.slice(code.indexOf("\n") + 1);
        } else {
            code = code.slice(code.indexOf("```") + 3);
        }
        var endIdx = code.length - 1;
        while (endIdx > 0) {
            if (code.charAt(endIdx) === "`" && code.charAt(endIdx - 1) === "`" && code.charAt(endIdx - 2) === "`") {
                endIdx -= 2;
                break;
            }
            endIdx--;
        }
    
        // check that code exists
        if (code.length === 0) {
            msg.channel.send("Code block not found");
            return;
        }
    
        code = code.slice(0, code.length - 3);

        try {
            code = `
const resultEmbed = new Discord.MessageEmbed();

var evalResults = "";

var println = function (txt) {
    evalResults += txt + "\\n";
};

var done = function () {
    resultEmbed.setColor("#1fab55");
    resultEmbed.addField("**Program Output:**", ">>> " + evalResults.slice(0, 1950));
    msg.channel.send({ embeds: [resultEmbed] });
};

try {
    ${code}
} catch (err) {
    console.log(err);
    msg.channel.send("**An Error Has Occured:**\\n\`\`\`diff\\n- " + err.toString().slice(0, 1950) + "\\n\`\`\`");
}
            `;

            new Function(
                "Discord", "msg", "client", 
                code
            )(Discord, msg, client);
            
        } catch (err) {
            console.log(err);
            msg.channel.send("**An Error Has Occured:**\n```diff\n- " + err.toString().slice(0, 1950) + "\n```");
        }
        
    } else {
        msg.channel.send("You don't have permission to use danger eval");
    }
}

function onCommand_delete (msg, splitMsg) {
    if (!authorIsStaff(msg)) {
        msg.channel.send("You do not have permission to use that command.");
        return;
    }

    if (Number(splitMsg[1])) {
        msg.channel.bulkDelete(Number(splitMsg[1]) + 1);
    }
}

function onCommand_spam (msg) {
    if (msg.author.id === "480905025112244234") {
        for (var i = 0; i < 50; i++) {
            setTimeout(function () {
                msg.channel.send("<@746117782655205426> stop is gay!");
            }, Math.random() * 10 * 1000);
        }
    }
}

function onCommand_tictactoe (msg, mentionedUser) {
    var rows = [];

    console.log(mentionedUser)

    for (var i = 0; i < 3; i++) {
        var actionRow = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId(i + '0')
                .setLabel(' ')
                .setStyle("SECONDARY"),
            new Discord.MessageButton()
                .setCustomId(i + '1')
                .setLabel(' ')
                .setStyle("SECONDARY"),
            new Discord.MessageButton()
                .setCustomId(i + '2')
                .setLabel(' ')
                .setStyle("SECONDARY"),
        );
        
        rows.push(actionRow);
    }

    msg.channel.send({
        content: `**Tic Tac Toe** | ${msg.author.tag} vs AI | ${msg.author.tag}'s turn`,
        components: rows
    });
}

// ---------- ON MESSAGE ---------- //
client.on("messageCreate", function (msg) {
    try {
        if (msg.guild) {
            if (!membersDatabase[msg.author.id] && !msg.author.bot) {
                membersDatabase[msg.author.id] = {
                    tag: msg.author.tag,
                    badWordUses: 0,
                    susnessCount: 0,
                    messagesSent: 0,
                    lastMessageTime: 0,
                    hoursActivity: new Array(24).fill(0),
                    guilds: []
                };
            }
            
            var memberData = membersDatabase[msg.author.id];
            if (memberData) {
                if (memberData.tag !== msg.author.tag) {
                    memberData.tag = msg.author.tag;
                }
                
                memberData.messagesSent++;
    
                memberData.lastMessageTime = Date.now();

                var hour = new Date().getHours();
                memberData.hoursActivity[hour]++;
                
                if (!memberData.guilds.includes(msg.guild.id)) {
                    memberData.guilds.push(msg.guild.id);
                }   
            }
        }
        
        
        // get the message as lowercase
        var lowMsg;
        if (typeof msg.content === "string") {
            lowMsg = msg.content.toLowerCase();
        } else {
            console.log("ERROR: msg.content is not typeof string" + msg.content);
            return;
        }

        // get message tokens
        var splitMsg = lowMsg.split(" ");

        var serverData;

        // set up guild settings
        if (msg.guild) {
            if (!serversDatabase[msg.guild.id]) {
                serversDatabase[msg.guild.id] = {};
            }
            serverData = serversDatabase[msg.guild.id];
            if (!serverData.name) {
                serverData.name = msg.guild.name;
            }
            if (!serverData.prefix) {
                serverData.prefix = "?";
            }
            if (!serverData.bannedWords) {
                serverData.bannedWords = defaultBannedWords.slice(0, defaultBannedWords.length);
            }
            if (!serverData.swearFilterOn) {
                serverData.swearFilterOn = false;
            }
            if (!serverData.logChannel) {
                serverData.logChannel = "";
            }
        }

        // Settings for DMs
        if (!serverData) {
            serverData = {
                "swearFilterOn": false,
                "name": undefined,
                "prefix": "?",
                "bannedWords": []
            }
        }

        // shorthand for prefix
        var p = serverData.prefix;

        // get channel Name
        var channelName = "";
        if (msg.channel && msg.channel.name) {
            channelName = msg.channel.name.toLowerCase();
        }


        
        // filter message
        if (
            serverData.swearFilterOn &&
            !channelName.includes("debate") &&
            !channelName.includes("staff") &&
            msg.channel.id !== serverData.logChannel
        ) {
            var deletedMessage = filterMessage(msg, serverData.bannedWords, serverData.logChannel, p);
            if (deletedMessage) {
                return;
            }
        }

        var mentionedUser = msg.mentions.users.first();
        console.log(JSON.stringify(msg.content));
        // if pinged bot
        if (msg.content.trim() === "<@845426453322530886>" && mentionedUser) {
            var memberTarget = msg.guild.members.cache.get(mentionedUser.id);
            if (memberTarget && memberTarget.user.id === "845426453322530886") {
                msg.channel.send("My prefix is `" + serverData.prefix + "`");
            }
        }

        // check if has prefix
        if (lowMsg.indexOf(p) !== 0) {
            return;
        }

        // commands
        switch (lowMsg.replace("\n", " ").split(" ")[0].replace(p, "")) {
            case "ping":
                onCommand_ping(msg, client);
                break;

            case "help":
                onCommand_help(msg);
                break;

            case "invite": case "github":
                onCommand_github(msg);
                break;

            case "update":
                onCommand_update(msg, splitMsg);
                break;

            case "plagiarism":
                onCommand_plagiarism(msg, splitMsg, serverData);
                break;

            case "get":
                onCommand_get(msg, splitMsg, mentionedUser);
                break;

            case "search":
                onCommand_search(msg, splitMsg);
                break;

            case "coolify":
                onCommand_coolify(msg, splitMsg, p);
                break;

            case "wyr":
                onCommand_wyr(msg);
                break;

            case "define":
                onCommand_define(msg, lowMsg);
                break;

            case "swearfilter":
                onCommand_swearFilter(msg, splitMsg, lowMsg, serverData);
                break;

            case "set":
                onCommand_set(msg, splitMsg, serverData);
                break;

            case "leaderboard":
                onCommand_leaderboard(msg, splitMsg);
                break;

            case "translate":
                onCommand_translate(msg);
                break;

            case "eval":
                onCommand_eval(msg);
                break;

            case "dangereval":
                onCommand_dangerEval(msg);
                break;

            case "spam":
                onCommand_spam(msg);
                break;

            case "delete":
                onCommand_delete(msg, splitMsg);
                break;

            case "tictactoe":
                onCommand_tictactoe(msg, mentionedUser);
                break;
                
            case "temp":
                
                break;
        }
    } catch (err) {
        console.log(err);
    }
});

var tictactoe = {
    isRowWinner: function(rows, whichrow, token) {
        if (rows[whichrow][0] === token && rows[whichrow][1] === token && rows[whichrow][2] === token) {
            return true;
        }
        return false;
    },
    isColumnWinner: function(rows, whichcolumn, token) {
        if (rows[0][whichcolumn] === token && rows[1][whichcolumn] === token && rows[2][whichcolumn] === token) {
            return true;
        }
        return false;
    },
    isWinner: function (rows, token) {
        if (this.isRowWinner(rows, 0, token)) {
            return true;
        }
        if (this.isRowWinner(rows, 1, token)) {
            return true;
        }
        if (this.isRowWinner(rows, 2, token)) {
            return true;
        }
        
        if (this.isColumnWinner(rows, 0, token)) {
            return true;
        }
        if (this.isColumnWinner(rows, 1, token)) {
            return true;
        }
        if (this.isColumnWinner(rows, 2, token)) {
            return true;
        }
        
        if (rows[0][0] === token && rows[1][1] === token && rows[2][2] === token) {
            return true;    
        }
        if (rows[2][0] === token && rows[1][1] === token && rows[0][2] === token) {
            return true;    
        }
        return false;
    },
    isBoardFull: function (rows) {
        for (var i = 0; i < 3; i++) {
            if (rows[0][i] === null) {
                return false;
            }
            if (rows[1][i] === null) {
                return false;
            }
            if (rows[2][i] === null) {
                return false;
            }
        }
        return true;
    },
    moveAI: function (rows) {
        var rplace = Math.floor(random(0, 3));
        var cplace = Math.floor(random(0, 3));
        
        if (rows[1][1] === null && Math.random() < 0.5) {
            rplace = 1;
            cplace = 1;
        }
        
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                var isNull = false;
                if (rows[r][c] === null) {
                    rows[r][c] = "X";
                    isNull = true;
                }
                if (this.isWinner(rows, "X")) {
                    rplace = r;
                    cplace = c;
                }
                if (isNull) {
                    rows[r][c] = null;
                }
            }
        }
        
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
                var isNull = false;
                if (rows[r][c] === null) {
                    rows[r][c] = "O";
                    isNull = true;
                }
                if (this.isWinner(rows, "O")) {
                    rplace = r;
                    cplace = c;
                }
                if (isNull) {
                    rows[r][c] = null;
                }
            }
        }
        
        return [rplace, cplace];
    }
};

// ---------- ON BUTTON CLICKS ---------- //
client.on("interactionCreate", function (interaction) {
    if (interaction.isButton()) {
        let msg = interaction.message;

        let datas = msg.content.split(" | ");

        let players = datas[1].split(" vs ");
        let turn = datas[2].slice(0, datas[2].length - 7);

        if (interaction.user.tag !== players[0] || interaction.user.tag !== turn) {
            return;
        }
        
        let coords = interaction.customId.split("").map(Number);

        let table = [], rows, winner = null;
        for (var i = 0; i < msg.components.length; i++) {
            table.push(msg.components[i].components);
        }

        let btn = table[coords[0]][coords[1]];
        if (btn.label === " ") {
            interaction.deferUpdate();
            
            btn.setLabel("X");
            btn.setStyle("SUCCESS");

            rows = table.map(function (row) {
                return row.map(function (btn) {
                    return btn.label === " " ? null : btn.label;
                });
            });
    
            if (tictactoe.isWinner(rows, "X")) {
                winner = "X Wins!";
            } else {    
                let botCoords = tictactoe.moveAI(rows);
                let botChoice = table[botCoords[0]][botCoords[1]];
                
                botChoice.setLabel("O");
                botChoice.setStyle("DANGER");
    
                rows = table.map(function (row) {
                    return row.map(function (btn) {
                        return btn.label === " " ? null : btn.label;
                    });
                });
    
                if (tictactoe.isWinner(rows, "O")) {
                    winner = "O Wins!";
                }
            }
    
            if (tictactoe.isBoardFull(rows)) {
                winner = "Tie Game!";
            }

            setTimeout(function () {
                msg.edit({
                    content: `**Tic Tac Toe** | ${players[0]} vs ${players[1]} | ${players[0]}'s turn`,
                    components: msg.components
                });
            }, 100);
        }
    }
});

// ---------- ON MESSAGE UPDATE ---------- //
client.on("messageUpdate", function (oldMsg, newMsg) {
    // get the message as lowercase
    var lowMsg;
    if (typeof newMsg.content === "string") {
        lowMsg = newMsg.content.toLowerCase();
    } else {
        console.log("ERROR: newMsg.content is not typeof string" + newMsg.content);
        return;
    }

    // get message tokens
    var splitMsg = lowMsg.split(" ");

    var serverData;

    // set up guild settings
    if (newMsg.guild) {
        serverData = serversDatabase[newMsg.guild.id];
    }

    // Settings for DMs
    if (!serverData) {
        serverData = {
            "swearFilterOn": false,
            "name": undefined,
            "prefix": "?",
            "bannedWords": []
        }
    }

    // shorthand for prefix
    var p = serverData.prefix;

    // get channel Name
    var channelName = "";
    if (newMsg.channel && newMsg.channel.name) {
        channelName = newMsg.channel.name.toLowerCase();
    }

    // filter message
    if (
        serverData.swearFilterOn &&
        !channelName.includes("debate") &&
        !channelName.includes("staff") &&
        newMsg.channel.id !== serverData.logChannel
    ) {
        var deletedMessage = filterMessage(newMsg, serverData.bannedWords, serverData.logChannel, p);
        if (deletedMessage) {
            return;
        }
    }
});


// ---------- ON REACTION ADD ---------- //
client.on('messageReactionAdd', function (reaction, user) {
    let msg = reaction.message, emoji = reaction.emoji;

    if (membersDatabase[msg.author.id] && (
        emoji.name === "🤨" ||
        emoji.name === "🥵" ||
        emoji.name === "sus" ||
        emoji.name === "😩" ||
        emoji.name === "😫"
    )) {
        membersDatabase[msg.author.id].susnessCount++;
    }
});


// ---------- ON READY ---------- //
client.on("ready", function () {
    console.log(`Logged in as ${client.user.tag}!`);
});


// ---------- ON DEBUG ---------- //
client.on('debug', function (e) {
    if (
        !e.includes("token") && 
        !e.includes(process.env['myToken']) && 
        !e.includes("Heartbeat") && 
        !e.toLowerCase().includes("shard")
    ) {
        console.log(e);
    }
});

// init
keepAlive();
var loginInterval;
function attemptLogin () {
    console.log("Requested to login");
    
    var lastLoginAttempt = Number(fs.readFileSync("loginTime.txt", "utf8"));
    
    if (debugging || Date.now() - lastLoginAttempt > 1000 * 60 * 5) {
        lastLoginAttempt = Date.now();
        fs.writeFile("loginTime.txt", lastLoginAttempt.toString(), ()=>{});
        console.log("Attempting to log in...");
        client.login(process.env['myToken']);
        clearInterval(loginInterval);
    } else {
        console.log("Waiting to login...");
    }
}
loginInterval = setInterval(attemptLogin, 1000);

// update members database every minute
setInterval(function () {
    fs.writeFile("membersData.json", JSON.stringify(membersDatabase, null, "  "), ()=>{});
}, 1000 * 60);


// log time
setInterval(function () {
    var d = new Date().toLocaleTimeString();
    console.log(d);
}, 1000 * 60);
