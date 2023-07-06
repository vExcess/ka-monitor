var debugging = false;

process.env = require("./secrets");

// Import Dependancies
const Discord = require("discord.js");
const fetch = require("node-fetch");
const httpServer = require("./server");
const jsdom = require("jsdom");
const babel = require("@babel/core");
const { JSDOM } = jsdom;
const fs = require('fs');
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

var membersDatabase = fs.readFileSync("./membersData.json", "utf8");
if (membersDatabase.length === 0) {
    membersDatabase = fs.readFileSync("./membersDataBackup.txt", "utf8");
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

function swearFilter(msg, wordList) {
    lowMsg = msg;
    
    // removes links
    while (lowMsg.includes("http")) {
        var linkStart = lowMsg.indexOf("http");
        var linkStop = lowMsg.slice(linkStart).indexOf(" ");
        lowMsg = lowMsg.slice(0, linkStart) + lowMsg.slice(linkStart + linkStop, lowMsg.length);
    }
    
    lowMsg = lowMsg.toLowerCase();

    // the message to check
    var msgCheck = " " + lowMsg + " ";
    
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

    return {
        isBad: deletePost,
        badWord: badWord
    };
}

function filterMessage(msg, wordList, logChannel, p) {
    // get lowercase of message
    var msgCheck = msg.content;

    // get tokens of message
    var splitMsg = msgCheck.toLowerCase().split(" ");

    // check if is a swearfilter command
    if (
        (splitMsg[0] === p + "swearfilter" && (splitMsg[1] === "add" || splitMsg[1] === "remove")) ||
        (msg.content.slice(0, 10) === "The word `" && msg.author.bot)
    ) {
        return false;
    }

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
    
    var filterRes = swearFilter(msgCheck, wordList);
    var deletePost = filterRes.isBad && msg.channel.type !== 'dm';

    // delete post
    if (deletePost) {
        console.log("DELETED: " + msgCheck);
        
        var msgToSend = "Deleted message because it contained: `" + filterRes.badWord + "`\nMessage Content:\n\n" + (isEmbed ? msg.embeds[0].description : msg.content);

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

function sendMessage(channel, msg) {
    if ((typeof msg === "string" && msg.length > 0) || typeof msg !== "string") {
        channel.send(msg).catch(console.log);
    } 
}

// ---------- COMMANDS ---------- //

function onCommand_ping(msg, client) {
    sendMessage(msg.channel, "Up and running!\n" + client.ws.ping + " millisecond delay");
}

function onCommand_help(msg) {
    var helpEmbed = {
        "type": "rich",
        "title": "Commands",
        "description": "Note: \\*SOMETHING\\* means that the argument is optional.\nNot all commands are listed here at the moment.",
        "color": "#1fab55",
        "fields": [
            {
                "name": "ping",
                "value": "check latency",
                "inline": true
            },
            {
                "name": "github",
                "value": "sends bot's github repo",
                "inline": true
            },
            {
                "name": "get profilePic [\\*@USER\\*]",
                "value": "gets profile image of pinged user",
                "inline": true
            },
            {
                "name": "get pfp [\\*@USER\\*]",
                "value": "alias for get profilePic",
                "inline": true
            },
            {
                "name": "get discordId [\\*@USER\\*]",
                "value": "gets discord id of pinged user",
                "inline": true
            },
            {
                "name": "get guildId",
                "value": "gets id of current guild",
                "inline": true
            },
            {
                "name": "get channelId",
                "value": "gets id of current channel",
                "inline": true
            },
            {
                "name": "get roles [\\*@USER\\*]",
                "value": "gets roles of pinged user",
                "inline": true
            },
            {
                "name": "get sus [\\*@USER\\*]",
                "value": "gets moderation data about pinged user",
                "inline": true
            },
            {
                "name": "get activity [\\*@USER\\*]",
                "value": "gets activity data of pinged user",
                "inline": true
            },
            {
                "name": "search google [SEARCH QUERY]",
                "value": "performs a google search",
                "inline": true
            },
            {
                "name": "search images [SEARCH QUERY]",
                "value": "performs a google images search",
                "inline": true
            },
            {
                "name": "coolify normal [FONT] [TEXT_TO_COOLIFY]",
                "value": "coolifies text. availible fonts are: normal, gothic, outline, monospace, bubble, cursive",
                "inline": true
            },
            {
                "name": "set prefix [PREFIX]",
                "value": "changes the bot's prefix for this server",
                "inline": true
            },
            {
                "name": "set logs [CHANNEL_ID]",
                "value": "sets what channel to log moderation activity to",
                "inline": true
            },
            {
                "name": "swearFilter [ON/OFF/RESET/TEST]",
                "value": "turns the swearfilter on or off or resets it or tests it",
                "inline": true
            },
            {
                "name": "swearFilter add [WORD]",
                "value": "add a word to the swear filter",
                "inline": true
            },
            {
                "name": "swearFilter remove [WORD]",
                "value": "remove a word from the swear filter",
                "inline": true
            },
            {
                "name": "delete [NUMBER]",
                "value": "deletes the past n messages",
                "inline": true
            },
            {
                "name": "leaderboard [SUS/ACTIVITY]",
                "value": "creates a leaderboard of a specified category",
                "inline": true
            },
            {
                "name": "eval [CODE_BLOCK]",
                "value": "runs a block of JavaScript code in a strict sandbox",
                "inline": true
            },
        ],
        "footer": {
            "text": "The bot gets rate limited a lot, sorry about that"
        }
    };
    
    sendMessage(msg.channel, {
        content: "Vexcess Bot Info:",
        embeds: [helpEmbed]
    });
}

function onCommand_github(msg) {
    sendMessage(msg.channel, "https://github.com/vExcess/ka-monitor");
}

function onCommand_get(msg, splitMsg, mentionedUser) {    
    if (splitMsg[1] === "profilepic" || splitMsg[1] === "pfp") {
        if (!mentionedUser) {
            mentionedUser = msg.member.user;
        } else if (!mentionedUser.id) {
            sendMessage(msg.channel, "Not a valid user.");
            return;
        }

        var imgLink = false;
        imgLink = mentionedUser.displayAvatarURL({
            size: 2048,
            dynamic: true
        });

        if (imgLink) {
            sendMessage(msg.channel, {
                content: mentionedUser.username + (mentionedUser.username.charAt(mentionedUser.username.length - 1).toLowerCase() === "s" ? "" : "'s") + " Profile Image:",
                files: [new Discord.MessageAttachment(imgLink)]
            });
        } else {
            sendMessage(msg.channel, "Image not found");
        }

    }
    
    if (splitMsg[1] === "discordid") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            sendMessage(msg.channel, "Not a valid user.");
            return;
        }

        if (msg.guild && msg.guild.members && msg.guild.members.cache && msg.guild.members.cache.get) {
            var memberTarget = msg.guild.members.cache.get(mentionedUser.id);
            if (memberTarget && memberTarget.user) {
                sendMessage(msg.channel, memberTarget.user.id);
            }
        }
    }
    
    if (splitMsg[1] === "guildid") {
        sendMessage(msg.channel, msg.guild.id);
    }
    
    if (splitMsg[1] === "channelid") {
        sendMessage(msg.channel, msg.channel.id);
    }
    
    if (splitMsg[1] === "roles") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            sendMessage(msg.channel, "Not a valid user.");
            return;
        }

        var userRoles = msg.guild.members.cache.find(member => member.user.id === mentionedUser.id)._roles;

        var output = "Roles:\n";
        msg.guild.roles.cache.forEach(function (role) {
            if (role.id !== msg.guild.id && userRoles.includes(role.id)) {
                output += "\t" + role.name + " (" + role.id + ")\n";
            }
        });

        sendMessage(msg.channel, output);
    }

    if (splitMsg[1] === "sus") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            sendMessage(msg.channel, "Not a valid user.");
            return;
        }
        
        if (!membersDatabase[mentionedUser.id]) {
            sendMessage(msg.channel, "No data for that user.");
        } else {
            var member = membersDatabase[mentionedUser.id];

            sendMessage(msg.channel, "```\n" + 
            member.tag + 
            "\nTotal Messages Sent: " + member.messagesSent + 
            "\nBad Words Sent: " + member.badWordUses + 
            "\nSusness Score: " + Math.round(member.susnessCount / member.messagesSent * 1000) + 
            "\n```");
        }
    }

    if (splitMsg[1] === "activity") {
        if (!mentionedUser) {
            mentionedUser = msg.member;
        } else if (!mentionedUser.id) {
            sendMessage(msg.channel, "Not a valid user.");
            return;
        }
        
        if (!membersDatabase[mentionedUser.id]) {
            sendMessage(msg.channel, "No data for that user.");
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

            sendMessage(msg.channel, {
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
    if (splitMsg[1] === "google" || splitMsg[1] === "bing" || splitMsg[1] === "duckduckgo" || splitMsg[1] === "yahoo") {
        var query = msg.content.slice(15, msg.content.length);

        sendMessage(msg.channel, "Searching...");

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

                sendMessage(msg.channel, {
                    embeds: [exampleEmbed]
                });
            })
    }
    if (splitMsg[1] === "images") {
        var query = msg.content.slice(15, msg.content.length);

        sendMessage(msg.channel, "Searching...");
        
        fetch("https://www.google.com/search?q=" + query + "&tbm=isch")
            .then(res => res.text())
            .then(function (text) {
                var links = [];
                
                const dom = new JSDOM(text);

                const results = dom.window.document.getElementsByClassName("yWs4tf");

                for (var i = 0; i < Math.min(5, results.length); i++) {
                    links.push(new Discord.MessageEmbed().setImage(results[i].src));
                }

                sendMessage(msg.channel, {
                    content: "Results:",
                    embeds: links,
                });
            })
    }
}

function onCommand_coolify(msg, splitMsg, p) {
    if (!splitMsg[1]) {
        sendMessage(msg.channel, "No input");
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
    if (newData.length > 0) {
        sendMessage(msg.channel, newData);
    }
}

function onCommand_swearFilter(msg, splitMsg, lowMsg, serverData) {
    if (!authorIsStaff(msg)) {
        sendMessage(msg.channel, "You do not have permission to use that command.");
        return;
    }

    if (splitMsg[1] === "on" || splitMsg[1] === "true" || splitMsg[1] === "yes") {
        serverData.swearFilterOn = true;
        sendMessage(msg.channel, "The swear filter has been turned on in " + msg.guild.name);
        fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else if (splitMsg[1] === "off" || splitMsg[1] === "false" || splitMsg[1] === "no") {
        serverData.swearFilterOn = false;
        sendMessage(msg.channel, "The swear filter has been turned off in " + msg.guild.name);
        fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else if (splitMsg[1] === "test") {
        sendMessage(msg.channel, {
            embeds: [{
                color: 3447003,
                description: "what the **hell**"
            }]
        });
    } else if (splitMsg[1] === "reset") {
        serverData.bannedWords = defaultBannedWords.slice(0, defaultBannedWords.length);
        sendMessage(msg.channel, "The swear filter has been reset in " + msg.guild.name);
        fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else if (splitMsg[1] === "add") {
        var wrd = lowMsg.slice(lowMsg.indexOf(splitMsg[1]) + splitMsg[1].length + 1, lowMsg.length);
        var wordIdx = serverData.bannedWords.indexOf(wrd);
        if (wordIdx < 0) {
            serverData.bannedWords.push(wrd);
            sendMessage(msg.channel, "The word `" + wrd + "` has been added to the filter.");
            fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
        } else {
            sendMessage(msg.channel, "The word `" + wrd + "` is already on the filter.");
        }
    } else if (splitMsg[1] === "remove") {
        var wrd = lowMsg.slice(lowMsg.indexOf(splitMsg[1]) + splitMsg[1].length + 1, lowMsg.length);
        var wordIdx = serverData.bannedWords.indexOf(wrd);
        if (wordIdx >= 0) {
            serverData.bannedWords.splice(wordIdx, 1);
            sendMessage(msg.channel, "The word `" + wrd + "` has been removed from the filter.");
            fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
        } else {
            sendMessage(msg.channel, "The word `" + wrd + "` is not on the filter.");
        }
    }
}

function onCommand_set(msg, splitMsg, serverData) {
    if (!authorIsStaff(msg)) {
        sendMessage(msg.channel, "You do not have permission to use that command.");
        return;
    }

    if (splitMsg[1] === "prefix") {
        serverData.prefix = splitMsg[2];
        sendMessage(msg.channel, "My prefix has been set to `" + serverData.prefix + "`");
        fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    }

    if (splitMsg[1] === "logs") {
        var c = msg.guild.channels.cache.get(splitMsg[2]);

        if (c) {
            serverData.logChannel = splitMsg[2];
            sendMessage(msg.channel, "Logging to <#" + serverData.logChannel + ">");
        } else {
            serverData.logChannel = "";
            sendMessage(msg.channel, "Channel not found");
        }

        fs.writeFileSync('./serversData.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
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

        sendMessage(msg.channel, content + "```");
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

        sendMessage(msg.channel, content + "```");
    }

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
            sendMessage(msg.channel, "Code block not found");
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
                sendMessage(msg.channel, "oh no! Program taking too long to run");
            }
        }
    } catch (err) {
        error = true;
        running = false;
        sendMessage(msg.channel, "**An Error Has Occured:**\n```diff\n- " + err.toString().slice(0, 1950) + "\n```");
    }

    console.log("-----------------------------")

    if (!error) {
        const resultEmbed = new Discord.MessageEmbed();

        let logTxt = VM_logs.join("\n").slice(0, 1024);
        if (logTxt.length === 0) {
            logTxt = "Program exited with EXIT_SUCCESS";
        }

        resultEmbed.setColor("#1fab55");
        resultEmbed.addField("**Program Output:**", logTxt);
        
        sendMessage(msg.channel, {
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
            sendMessage(msg.channel, "Code block not found");
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
    sendMessage(msg.channel, { embeds: [resultEmbed] });
};

try {
    ${code}
} catch (err) {
    console.log(err);
    sendMessage(msg.channel, "**An Error Has Occured:**\\n\`\`\`diff\\n- " + err.toString().slice(0, 1950) + "\\n\`\`\`");
}
            `;

            new Function(
                "Discord", "msg", "client", 
                code
            )(Discord, msg, client);
            
        } catch (err) {
            console.log(err);
            sendMessage(msg.channel, "**An Error Has Occured:**\n```diff\n- " + err.toString().slice(0, 1950) + "\n```");
        }
        
    } else {
        sendMessage(msg.channel, "You don't have permission to use danger eval");
    }
}

function onCommand_delete (msg, splitMsg) {
    if (!authorIsStaff(msg)) {
        sendMessage(msg.channel, "You do not have permission to use that command.");
        return;
    }

    if (Number(splitMsg[1])) {
        msg.channel.bulkDelete(Number(splitMsg[1]) + 1);
    }
}

function onCommand_spam (msg) {
    if (msg.author.id === "480905025112244234") {
        let content = msg.content.split(" ");
        let amt = Number(content[1]);
        content = content.slice(2, content.length).join(" ");
        for (var i = 0; i < amt; i++) {
            setTimeout(function () {
                sendMessage(msg.channel, content);
            }, Math.random() * amt * 1000);
        }
    }
}

function onCommand_say (msg, p) {
    sendMessage(msg.channel, msg.content.slice(msg.content.indexOf(" ") + 1).replaceAll("@", "\\@").replaceAll(p+"say", ""));
}

const io = require("socket.io-client");
let GPT2Tunnel = null;
let GPT2Connected = false;
let GPT2Channel = null;
let answer = null;


function onCommand_gpt (msg, p) {
    // connect
    if (GPT2Tunnel === null) {
        GPT2Tunnel = io("https://GPT2.vexcess.repl.co");
        GPT2Tunnel.on('connect', function () {
            console.log("Tunnel Connected");
            GPT2Connected = true;
        
            GPT2Tunnel.on("answer", e => {
                console.log(e)
                if (GPT2Channel) {
                    answer = e.data;
                    GPT2Channel.send(answer);
                }
            })
        });
        GPT2Tunnel.on('disconnect', function () {
            GPT2Connected = false;
        });
        
        GPT2Tunnel.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    // handle
    GPT2Channel = msg.channel;
    answer = null;

    if (!GPT2Connected) {
        sendMessage(msg.channel, "GPT2 is not available at the moment. Contact @vExcess#1616 so that he can restart the AI.");
    } else {
        let content = msg.content.slice(p.length + 3);

        GPT2Tunnel.emit("request", {
            name: msg.author.username,
            prompt: content
        });
    
        function check () {
            if (answer === null) {
                GPT2Channel.sendTyping();
                setTimeout(check, 10000);
            }
        }
        check();
    }
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

        // chat logs for "debugging purposes"
        console.log(msg.author.tag + " - " + JSON.stringify(msg.content));
        for (let a of msg.attachments) {
            console.log("attachment: " + a[1].url);
        }
        console.log("");

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
        
        // if pinged bot
        if (msg.content.trim() === "<@845426453322530886>" && mentionedUser) {
            var memberTarget = msg.guild.members.cache.get(mentionedUser.id);
            if (memberTarget && memberTarget.user.id === "845426453322530886") {
                sendMessage(msg.channel, "My prefix is `" + serverData.prefix + "`");
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

            case "get":
                onCommand_get(msg, splitMsg, mentionedUser);
                break;

            case "search":
                onCommand_search(msg, splitMsg);
                break;

            case "coolify":
                onCommand_coolify(msg, splitMsg, p);
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

            case "eval":
                onCommand_eval(msg);
                break;

            case "dangereval":
                onCommand_dangerEval(msg);
                break;

            case "spam":
                onCommand_spam(msg);
                break;

            case "delete": case "clear":
                onCommand_delete(msg, splitMsg);
                break;
                
            case "say":
                onCommand_say(msg, p);
                break;

            case "gpt":
                    onCommand_gpt(msg, p);
                    break;
        }
    } catch (err) {
        console.log(err);
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

client.once('ready',()=>{
  console.log("Online!");
});

client.on('shardDisconnect', function (evt, id) {
	console.log('Lost connection: ' + evt + ' (' + id + ')');
});

client.on('shardError', function (error, shardid) {
	console.log('Connection Error: ' + error + ' (' + shardid + ')');
});

client.on('shardReady', function (error, unavail) {
	console.log('Connection Ready: ' + error + ' (' + unavail + ')');
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
// var loginInterval;
// function attemptLogin () {
//     console.log("Requested to login");
    
//     var lastLoginAttempt = Number(fs.readFileSync("./loginTime.txt", "utf8"));
    
//     if (debugging || Date.now() - lastLoginAttempt > 1000 * 60 * 5) {
//         lastLoginAttempt = Date.now();
//         fs.writeFile("./loginTime.txt", lastLoginAttempt.toString(), ()=>{});
//         console.log("Attempting to log in...");
//         client.login(process.env['myToken']);
//         clearInterval(loginInterval);
//     } else {
//         console.log("Waiting to login...");
//     }
// }
// loginInterval = setInterval(attemptLogin, 1000);
client.login(process.env['myToken']);

// update members database every 5 minutes
setInterval(function () {
    fs.writeFile("./membersData.json", JSON.stringify(membersDatabase, null, "  "), ()=>{});
}, 1000 * 60 * 5);


// log time every 5 minutes
setInterval(function () {
    var d = new Date().toLocaleTimeString();
    console.log(d);
}, 1000 * 60 * 5);
