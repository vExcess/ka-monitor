const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const keepAlive = require("./server");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const KA_fetch = require('./KA_fetch').KA_fetch;

var users = false;
var nicks = false;

var serversDatabase = require('./serversDatabase').SERVER_DATA;

var programHashes = false;

var base92 = {
  codeKey: " !#$%&'()*+-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~",
  encode: function(num) {
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
  decode: function(num) {
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

function hashCode (str) {
  var h = 0;
  var stop = Math.min(str.length, 125);
  for (var i = 0; i < stop; i++) {
    h += i * str.charCodeAt(i);
  }
  return base92.encode(h);
}

function searchUsers (input) {
  input = input.toLowerCase();
  var tokens = input.split(" ");
  if (!users) {
    users = require('./users');
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

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const normFont = "\t\n abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-=_+[]\\{}|;':\",./<>?".split("");
const coolFont_gothic = ["\t", "\n", " ", "𝖆", "𝖇", "𝖈", "𝖉", "𝖊", "𝖋", "𝖌", "𝖍", "𝖎", "𝖏", "𝖐", "𝖑", "𝖒", "𝖓", "𝖔", "𝖕", "𝖖", "𝖗", "𝖘", "𝖙", "𝖚", "𝖛", "𝖜", "𝖝", "𝖞", "𝖟", "𝕬", "𝕭", "𝕮", "𝕯", "𝕰", "𝕱", "𝕲", "𝕳", "𝕴", "𝕵", "𝕶", "𝕷", "𝕸", "𝕹", "𝕺", "𝕻", "𝕼", "𝕽", "𝕾", "𝕿", "𝖀", "𝖁", "𝖂", "𝖃", "𝖄", "𝖅", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "❗", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "❜", ":", "❞", ",", ".", "/", "<", ">", "❓"];
const coolFont_outline = ["\t", "\n", " ", "𝕒", "𝕓", "𝕔", "𝕕", "𝕖", "𝕗", "𝕘", "𝕙", "𝕚", "𝕛", "𝕜", "𝕝", "𝕞", "𝕟", "𝕠", "𝕡", "𝕢", "𝕣", "𝕤", "𝕥", "𝕦", "𝕧", "𝕨", "𝕩", "𝕪", "𝕫", "𝔸", "𝔹", "ℂ", "𝔻", "𝔼", "𝔽", "𝔾", "ℍ", "𝕀", "𝕁", "𝕂", "𝕃", "𝕄", "ℕ", "𝕆", "ℙ", "ℚ", "ℝ", "𝕊", "𝕋", "𝕌", "𝕍", "𝕎", "𝕏", "𝕐", "ℤ", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡", "𝟘", "`", "~", "❕", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", "⨟", "❜", ":", "❞", ",", ".", "/", "<", ">", "❔"];
const coolFont_monospace = ["\t", "\n", " ", "𝚊", "𝚋", "𝚌", "𝚍", "𝚎", "𝚏", "𝚐", "𝚑", "𝚒", "𝚓", "𝚔", "𝚕", "𝚖", "𝚗", "𝚘", "𝚙", "𝚚", "𝚛", "𝚜", "𝚝", "𝚞", "𝚟", "𝚠", "𝚡", "𝚢", "𝚣", "𝙰", "𝙱", "𝙲", "𝙳", "𝙴", "𝙵", "𝙶", "𝙷", "𝙸", "𝙹", "𝙺", "𝙻", "𝙼", "𝙽", "𝙾", "𝙿", "𝚀", "𝚁", "𝚂", "𝚃", "𝚄", "𝚅", "𝚆", "𝚇", "𝚈", "𝚉", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿", "𝟶", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", "\"", ",", ".", "/", "<", ">", "?"];
const coolFont_bubble = ["\t", "\n", " ", "ⓐ", "ⓑ", "ⓒ", "ⓓ", "ⓔ", "ⓕ", "ⓖ", "ⓗ", "ⓘ", "ⓙ", "ⓚ", "ⓛ", "ⓜ", "ⓝ", "ⓞ", "ⓟ", "ⓠ", "ⓡ", "ⓢ", "ⓣ", "ⓤ", "ⓥ", "ⓦ", "ⓧ", "ⓨ", "ⓩ", "Ⓐ", "Ⓑ", "Ⓒ", "Ⓓ", "Ⓔ", "Ⓕ", "Ⓖ", "Ⓗ", "Ⓘ", "Ⓙ", "Ⓚ", "Ⓛ", "Ⓜ", "Ⓝ", "Ⓞ", "Ⓟ", "Ⓠ", "Ⓡ", "Ⓢ", "Ⓣ", "Ⓤ", "Ⓥ", "Ⓦ", "Ⓧ", "Ⓨ", "Ⓩ", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⓪", "`", "~", "❕", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "❜", ":", "❞", ",", ".", "/", "<", ">", "❔"];
const coolFont_cursive = ["\t", "\n", " ", "𝒶", "𝒷", "𝒸", "𝒹", "ℯ", "𝒻", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂", "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋", "𝓌", "𝓍", "𝓎", "𝓏", "𝒜", "ℬ", "𝒞", "𝒟", "ℰ", "ℱ", "𝒢", "ℋ", "ℐ", "𝒥", "𝒦", "ℒ", "ℳ", "𝒩", "𝒪", "𝒫", "𝒬", "ℛ", "𝒮", "𝒯", "𝒰", "𝒱", "𝒲", "𝒳", "𝒴", "𝒵", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", "\"", ",", ".", "/", "<", ">", "?"];

const defaultBannedWords = [
  "anal", "anus", "arse", "ass", "ass fuck", "ass hole", "assfucker", "asshole", "assshole", "bastard", "bitch", "black cock", "bloody hell", "boner", "boobies", "boob", "boobs", "boong", "butt hole", "cock", "cockfucker", "cocksuck", "cocksucker", "condom", "coon", "coonnass", "crap", "cum", "cunt", "cyberfuck", "damm", "dammm", "damn", "deez nut", "dick", "douche", "dummy", "erect", "erection", "erotic", "escort", "fag", "faggot", "fuck", "fuck off", "fuck you", "fuckass", "fuckhole", "god damn", "gook", "the hell", "helll", "hell no", "homoerotic", "hore", "jerk off", "jerked off", "jerking off",  "mother fucker", "motherfuck", "motherfucker", "negro", "nigga", "nigger", "nudes", "orgasim", "orgasm", "penis", "penisfucker", "pervert", "piss", "piss off", "porn", "porno", "pornography", "pornstar", "pussy", "retard", "sadist", "sex", "sexy", "shit", "shithole", "slut", "son of a bitch", "sperm", "testicle", "tits", "vagina", "viagra", "whore", "lmfao", "stfu", "ong", "🖕", "on god", "go to hell"
];

var commonLinesOfCode = [];


// thank you Stack Overflow :)
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function random(aMin, aMax) {
  return Math.random() * (aMax - aMin) + aMin;
}

function replaceAll(str, oldStr, newStr){
  while (str.includes(oldStr)) {
    str = str.replace(oldStr, newStr);
  }
  return str;
}

String.prototype.replaceAll = function(str1, str2) {
  return this.replace(
    new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), "g"),
    (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2
  );
};

function shrinkTo2DupChars (s) {
  var newS = "";
  var idx = 0;
  var currChar = s.charAt(idx);
  var sLen = s.length;
  
  while (idx < sLen) {
    var currRepeats = 0;
    while (s.charAt(idx + 1) === currChar) {
      idx++;
      currRepeats++;
    }
    idx -= currRepeats > 0 ? 1 : 0;
    
    newS += currChar;
    idx++;
    currChar = s.charAt(idx);
    currRepeats = 0;
  }
  return newS;
}

function getJSON (url, callback, extras) {
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
      }
      else if (type === "user") {
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

function authorIsStaff (msg) {
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

function filterMessage (msg, wordList, logChannel, p) {  
  // get lowercase of message
  var lowMsg = msg.content;
  if (typeof lowMsg === "string") {
    lowMsg = lowMsg.toLowerCase();
  } else {
    console.log("ERROR: lowMsg is not typeof string" + lowMsg);
    return;
  }

  // get tokens of message
  var splitMsg = lowMsg.split(" ");
  
  if (
    (splitMsg[0] === p+"swearfilter" && (splitMsg[1] === "add" || splitMsg[1] === "remove")) || 
    (msg.content.slice(0, 10) === "The word `" && msg.author.bot)
  ) {
    return false;
  }
    
  var isEmbed = false;

  // the message to check
  var msgCheck = "" + lowMsg;

  // add embeds content to msgCheck
  if (msg.embeds[0] && msg.embeds[0].description) {
    isEmbed = true;
    msgCheck += msg.embeds[0].description.toLowerCase();
  }

  // replace common evasions
  msgCheck = replaceAll(msgCheck, "@", "a");
  msgCheck = replaceAll(msgCheck, "$", "s");
  msgCheck = replaceAll(msgCheck, "|", "l");
  msgCheck = replaceAll(msgCheck, "/", "l");
  msgCheck = replaceAll(msgCheck, "3", "e");
  msgCheck = replaceAll(msgCheck, "4", "a");

  // remove symbols
  var symbolsToRemove = "`~!@#$%^&*()-=_+[]\\{}|;':\",./<>?";
  var newMsgCheck = "";
  for (var i = 0, len = msgCheck.length; i < len; i++) {
    var c = msgCheck.charAt(i);
    if (!symbolsToRemove.includes(c)) {
      newMsgCheck += c;
    }
  }
  msgCheck = newMsgCheck;

  // remove duplicate letters
  msgCheck = shrinkTo2DupChars(msgCheck);

  var deletePost = false;
  var badWord = "";

  // go through all the bad words
  for (var i = 0, len = wordList.length; i < len; i++) {
    // the current bad word
    badWord = wordList[i];

    // create variations
    var variations = [];
    variations.push(" " + shrinkTo2DupChars(wordList[i]));

    // check if the message is the bad word
    if (msgCheck === shrinkTo2DupChars(badWord)) {
      deletePost = true;
    }

    // go through all the variations
    for (var j = 0; j < variations.length; j++) {
      var wrd = variations[j];

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

  if (deletePost) {
    var msgToSend = "Deleted message because it contained: `" + badWord + "`\nMessage Content:\n\n" + (isEmbed ? msg.embeds[0].description : msg.content);

    var channel = msg.channel;
    var username = msg.author.username;
    var guild = msg.guild;

    msg.delete().then(function () {
      channel.send("Comment Deleted - Reason: that word is not allowed here.");
    }).catch(function() {
      channel.send("An error has occured while attempting to delete the message.");
    });

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

function onCommand_ping (msg, client) {
  msg.channel.send("Up and running!\n" + client.ws.ping + " millisecond delay");
}

function onCommand_help (msg) {
  msg.channel.send(
    "```\n" +
    "online\n\n" +
    "ping\n\n" +
    "invite\n\n" +
    "github\n\n" +
    "update\n\tprograms\n\n" +
    "plagiarism [PROGRAM_ID]\n\n" +
    "get\n\thot [NUMBER]\n\trecent [NUMBER]\n\tvotes [NUMBER]\n\tuser [KA_USERNAME/KAID]\n\tprofilepic [@USER]\n\tdiscordId [@USER]\n\tguildId [@USER]\n\troles [@USER]\n\n" +
    "search\n\tuser [NICKNAME]\n\tgoogle [SEARCH QUERY]\n\n" +
    "coolify\n\tnormal [WORDS]\n\tgothic [WORDS]\n\toutline [WORDS]\n\tmonospace [WORDS]\n\tbubble [WORDS]\n\tcursive [WORDS]\n\n" +
    "wyr\n\n" +
    "define [WORD/PHRASE]\n\n" +
    "set prefix [PREFIX]\n\n" +
    "swearFilter [ON/OFF/RESET/TEST/ADD]\n\tadd [WORD]\n\tremove[WORD]" +
    "```"
  );
}

function onCommand_github (msg) {
  msg.channel.send("https://github.com/vExcess/ka-monitor");
}

function onCommand_update (msg, splitMsg) {
  if (splitMsg[1] === "programs") {
    if (msg.author.id !== "480905025112244234") {
      msg.channel.send("You do not have permission to use that command.");
    } else {
      var targetRecurves = 1000;
      var recurves = 0;
      if (!programHashes) {
        programHashes = require('./programs');
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
                fs.writeFileSync('programs.js', "exports.KA_PROGRAMHASHES = " + JSON.stringify(programHashes), 'utf-8');
                msg.channel.send("Program Database Updated");
              }
            }
          }, {_id: programs[j]._id, idx1: page_.idx1, idx2: j});
        }

        if (recurves < targetRecurves) {
          recurves++;
          console.log("page " + recurves);
          getJSON("https://willard.fun/programs?&start=" + recurves * 50, function (programs2, page_2) {
            getPrograms(programs2, page_2);
          }, {idx1: recurves});
        }
      };

      getJSON("https://willard.fun/programs?&start=" + i * 50, function(programs, page_) {
        getPrograms(programs, page_);
      }, {idx1: recurves});
    }
  }
}

function onCommand_plagiarism (msg, splitMsg, serverData) {
  if (serverData.busy) {
    msg.channel.send("Sorry, the bot is busy at this time");
  } else {
    var title = "";
    var codeHashes = [];
    var authorId = "";
    var spinoffs = [];
    var possibles = [];
    if (!programHashes) {
      programHashes = require('./programs');
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

        exampleEmbed.setColor("#14bf96");
        exampleEmbed.setTitle("**Results for: " + title + "**");
        exampleEmbed.setURL("https://www.khanacademy.org/computer-programming/i/" + splitMsg[1]);
        msg.channel.send({
          embed: exampleEmbed
        });
        serverData.busy = false;

      });
    });
  }
}

function onCommand_get (msg, splitMsg, mentionedUser) {
  if (splitMsg[1] === "hot") {
    var num = parseInt(splitMsg[2], 10);
    if (typeof num !== "number") {
      return;
    }
    if (num < 1 || num > 10000) {
      msg.channel.send("Inputted number must be between 1 and 10000 (inclusive)");
    } else {
      msg.channel.send("Fetching...");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=3&limit=" + num, num - 1, num, "lists").then(function(txt) {
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
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=2&limit=" + num, num - 1, num, "lists").then(function(txt) {
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
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=5&limit=" + num + "&topic_id=xffde7c31", num - 1, num, "lists").then(function(txt) {
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
      msg.channel.send(mentionedUser.username + (mentionedUser.username.charAt(mentionedUser.username.length - 1).toLowerCase() === "s" ? "" : "'s") +" Profile Image:", {
        files: [imgLink]
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
  if (splitMsg[1] === "user") {
    if (splitMsg[2].charAt(0) === "@") {
      splitMsg[2] = splitMsg[2].slice(1, splitMsg[2].length);
    }

    var variablesObj = {};
    if (splitMsg[2].slice(0, 5) === "kaid_") {
      variablesObj.kaid = splitMsg[2];
    } else {
      variablesObj.username = splitMsg[2];
    }

    msg.channel.send("Searching...");
    KA_fetch.getJSON(fetch,
      {
        operationName: "getFullUserProfile",
        variables: variablesObj
      }, 
      function (data) {
        if (!data.user) {
          msg.channel.send("User not found");
          return;
        }

        var dateJoined = "Access Denied";
        if (data.user.joined) {
          dateJoined = data.user.joined.slice(0, 10).split("-");
          dateJoined = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(dateJoined[1], 10) - 1] + " " + dateJoined[2] + "th " + dateJoined[0] + " (" + (new Date().getFullYear() - parseInt(dateJoined[0])) + " years ago)";
        }

        const exampleEmbed = new Discord.MessageEmbed()
          .setColor("#14bf96")
          .setTitle("**" + data.user.nickname + "**")
          .setURL("https://www.khanacademy.org/profile/" + data.user.kaid)
          .setDescription("@" + data.user.username + " - " + data.user.bio + "\n\n**Date Joined:** " + dateJoined + "\n**Energy Points:** " + numberWithCommas(data.user.points) + "\n**KAID:** " + data.user.kaid)

        KA_fetch.getJSON(fetch,
          {
            operationName: "avatarDataForProfile",
            variables: {
              kaid: data.user.kaid
            },
          }, 
          function (data2) {
            exampleEmbed.setThumbnail(data2.user.avatar.imageSrc.replace("svg/", "").replace(".svg", ".png"));
            msg.channel.send({
              embed: exampleEmbed
            });
          }
        );          
      }
    );
  }
}

function onCommand_search (msg, splitMsg) {
  if (splitMsg[1] === "user") {
    var results = searchUsers(splitMsg[2]);

    msg.channel.send("Searching...");

    const exampleEmbed = new Discord.MessageEmbed();

    for (var i = 0; i < Math.min(results.length, 10); i++) {
      exampleEmbed.addField(results[i][0], "[kaid_" + results[i][1] + "](https://www.khanacademy.org/profile/kaid_" + results[i][1] + ")");
    }

    exampleEmbed.setColor("#14bf96");
    exampleEmbed.setTitle("**Search Results (" + results.length + "):**");
    exampleEmbed.setURL("https://www.khanacademy.org/computer-programming/i/4733975100702720");

    msg.channel.send({
      embed: exampleEmbed
    });
  }
  if (splitMsg[1] === "google" || splitMsg[1] === "bing" || splitMsg[1] === "duckduckgo" || splitMsg[1] === "yahoo") {
    var query = msg.content.slice(15, msg.content.length);

    msg.channel.send("Searching...");

    fetch("https://www.google.com/search?q=" + query)
    .then(res => res.text())
    .then(function (text) {
      const dom = new JSDOM(text);
      var results = dom.window.document.getElementsByClassName("ZINbbc xpd O9g5cc uUPGi");
      var newResults = [];

      const exampleEmbed = new Discord.MessageEmbed();

      for (var i = 0; i < results.length; i++) {
        var parts = results[i].getElementsByClassName("kCrYT");

        if (parts[0] && parts[1]) {
          if (!parts[0].getElementsByTagName("a")[0]) {
            var temp = parts[0].cloneNode();
            parts[0] = parts[1].cloneNode();
            parts[1] = temp;
          }
          
          var url = parts[0].getElementsByTagName("a");
          if (url[0]) {
            url = decodeURIComponent(url[0].href.slice(7, url[0].href.indexOf("&sa=")));
          } else {
            url = false;
          }

          var label = parts[0].getElementsByClassName("BNeawe vvjwJb AP7Wnd");
          if (label[0]) {
            label = label[0].textContent;
          } else {
            label = false;
          }

          var path = parts[0].getElementsByClassName("BNeawe UPmit AP7Wnd");
          if (path[0]) {
            path = path[0].textContent;
          } else {
            path = false;
          }

          var description = parts[1].getElementsByClassName("BNeawe s3v9rd AP7Wnd");
          if (description[0]) {
            description = description[0].textContent.split("...")[0];
            description = description.slice(0, description.length - 1) + "...";
          } else {
            description = "";
          }

          if (label && url && path) {
            newResults.push([label, path, url, description]);
          }
        }
      }

      for (var i = 0; i < newResults.length; i++) {
        var r = newResults[i];
        exampleEmbed.addField(r[0], "[" + r[1] + "](" + r[2] +  ")\n" + r[3]);
        if (i < newResults.length - 1) {
          exampleEmbed.addField("\u200b", "\u200b");
        }
      }

      exampleEmbed.setColor("#14bf96");
      exampleEmbed.setTitle("**Results for: " + query + "**");

      msg.channel.send({
        embed: exampleEmbed
      });

    })
  }
}

function onCommand_coolify (msg, splitMsg, p) {
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

function onCommand_wyr (msg) {
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
      .then(function(msg) {
        msg.react("🇦")
          .then(function() {
            msg.react("🇧");
          });
      });

    } else {
      msg.channel.send("An Error Has Occured. Please Try Again In A Few Seconds.");
    }
  });
}

function onCommand_define (msg, lowMsg) {
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
        while(divLevel > 0 && idx < content.length){
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
            embed: {
              color: 3447003,
              description: ("**" + word + "**\n\n" + entries[0].textContent).slice(0, 2000)
            }
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
          embed: {
            color: 3447003,
            description: ("**" + word + "**\n\n" + definitionOutput).slice(0, 2000)
          }
        })

      } else {
        msg.channel.send("No results found for: " + inputWord);
      }

    });
}

function onCommand_swearFilter (msg, splitMsg, lowMsg, serverData) {
  if (!authorIsStaff(msg)) {
    msg.channel.send("You do not have permission to use that command.");
    return;
  }

  if (splitMsg[1] === "on" || splitMsg[1] === "true" || splitMsg[1] === "yes") {
    serverData.swearFilterOn = true;
    msg.channel.send("The swear filter has been turned on in " + msg.guild.name);
    fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
  }
  else if (splitMsg[1] === "off" || splitMsg[1] === "false" || splitMsg[1] === "no") {
    serverData.swearFilterOn = false;
    msg.channel.send("The swear filter has been turned off in " + msg.guild.name);
    fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
  }
  else if (splitMsg[1] === "test") {
    msg.channel.send({
      embed: {
        color: 3447003,
        description: "what the **hell**"
      }
    });
  }
  else if (splitMsg[1] === "reset") {
    serverData.bannedWords = defaultBannedWords.slice(0, defaultBannedWords.length);
    msg.channel.send("The swear filter has been reset in " + msg.guild.name);
    fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
  }
  else if (splitMsg[1] === "add") {
    var wrd = lowMsg.slice(lowMsg.indexOf(splitMsg[1]) + splitMsg[1].length + 1, lowMsg.length);
    var wordIdx = serverData.bannedWords.indexOf(wrd);
    if (wordIdx < 0) {
      serverData.bannedWords.push(wrd);
      msg.channel.send("The word `" + wrd + "` has been added to the filter.");
      fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else {
      msg.channel.send("The word `" + wrd + "` is already on the filter.");
    }
  }
  else if (splitMsg[1] === "remove") {
    var wrd = lowMsg.slice(lowMsg.indexOf(splitMsg[1]) + splitMsg[1].length + 1, lowMsg.length);
    var wordIdx = serverData.bannedWords.indexOf(wrd);
    if (wordIdx >= 0) {
      serverData.bannedWords.splice(wordIdx, 1);
      msg.channel.send("The word `" + wrd + "` has been removed from the filter.");
      fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    } else {
      msg.channel.send("The word `" + wrd + "` is not on the filter.");
    }
  }
}

function onCommand_set (msg, splitMsg, serverData) {
  if (!authorIsStaff(msg)) {
    msg.channel.send("You do not have permission to use that command.");
    return;
  }

  if (splitMsg[1] === "prefix") {
    serverData.prefix = splitMsg[2];
    msg.channel.send("My prefix has been set to `" + serverData.prefix + "`");
    fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
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
    
    fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
  }
}

client.on("message", function(msg) {
  try {
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

    // if pinged bot
    if (msg.content === "<@!845426453322530886>" && mentionedUser) {
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
    switch (splitMsg[0].replace(p, "")) {
      case "online": case "ping":
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
  
      case "temp":
        console.log(msg.channel.id);
        console.log(msg.guild.channels.cache.get(msg.channel.id));
      break;
    }
  } catch (err) {
    msg.channel.send("oh no, an error has occurred:\n```" + err.toString().slice(0, 1000) + "```");
    console.log(err);
  }
});


client.on("messageUpdate", function(oldMsg, newMsg) {
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


client.on("ready", function() {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('debug', function (e) {
  // if (!e.includes("token") && !e.includes(process.env['myToken'])) {
  //   console.log(e);
  // }
});


keepAlive();
client.login(process.env['myToken']);


setInterval(function() {
  var d = new Date().toLocaleTimeString();
  console.log(d);
}, 1000 * 60);
