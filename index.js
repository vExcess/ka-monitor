const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const keepAlive = require("./server");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const normFont = "\t\n abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-=_+[]\\{}|;':\",./<>?".split("");
const coolFont_gothic = ["\t", "\n", " ", "𝖆", "𝖇", "𝖈", "𝖉", "𝖊", "𝖋", "𝖌", "𝖍", "𝖎", "𝖏", "𝖐", "𝖑", "𝖒", "𝖓", "𝖔", "𝖕", "𝖖", "𝖗", "𝖘", "𝖙", "𝖚", "𝖛", "𝖜", "𝖝", "𝖞", "𝖟", "𝕬", "𝕭", "𝕮", "𝕯", "𝕰", "𝕱", "𝕲", "𝕳", "𝕴", "𝕵", "𝕶", "𝕷", "𝕸", "𝕹", "𝕺", "𝕻", "𝕼", "𝕽", "𝕾", "𝕿", "𝖀", "𝖁", "𝖂", "𝖃", "𝖄", "𝖅", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "❗", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "❜", ":", "❞", ",", ".", "/", "<", ">", "❓"];
const coolFont_outline = ["\t", "\n", " ", "𝕒", "𝕓", "𝕔", "𝕕", "𝕖", "𝕗", "𝕘", "𝕙", "𝕚", "𝕛", "𝕜", "𝕝", "𝕞", "𝕟", "𝕠", "𝕡", "𝕢", "𝕣", "𝕤", "𝕥", "𝕦", "𝕧", "𝕨", "𝕩", "𝕪", "𝕫", "𝔸", "𝔹", "ℂ", "𝔻", "𝔼", "𝔽", "𝔾", "ℍ", "𝕀", "𝕁", "𝕂", "𝕃", "𝕄", "ℕ", "𝕆", "ℙ", "ℚ", "ℝ", "𝕊", "𝕋", "𝕌", "𝕍", "𝕎", "𝕏", "𝕐", "ℤ", "𝟙", "𝟚", "𝟛", "𝟜", "𝟝", "𝟞", "𝟟", "𝟠", "𝟡", "𝟘", "`", "~", "❕", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", "⨟", "❜", ":", "❞", ",", ".", "/", "<", ">", "❔"];
const coolFont_monospace = ["\t", "\n", " ", "𝚊", "𝚋", "𝚌", "𝚍", "𝚎", "𝚏", "𝚐", "𝚑", "𝚒", "𝚓", "𝚔", "𝚕", "𝚖", "𝚗", "𝚘", "𝚙", "𝚚", "𝚛", "𝚜", "𝚝", "𝚞", "𝚟", "𝚠", "𝚡", "𝚢", "𝚣", "𝙰", "𝙱", "𝙲", "𝙳", "𝙴", "𝙵", "𝙶", "𝙷", "𝙸", "𝙹", "𝙺", "𝙻", "𝙼", "𝙽", "𝙾", "𝙿", "𝚀", "𝚁", "𝚂", "𝚃", "𝚄", "𝚅", "𝚆", "𝚇", "𝚈", "𝚉", "𝟷", "𝟸", "𝟹", "𝟺", "𝟻", "𝟼", "𝟽", "𝟾", "𝟿", "𝟶", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", "\"", ",", ".", "/", "<", ">", "?"];
const coolFont_bubble = ["\t", "\n", " ", "ⓐ", "ⓑ", "ⓒ", "ⓓ", "ⓔ", "ⓕ", "ⓖ", "ⓗ", "ⓘ", "ⓙ", "ⓚ", "ⓛ", "ⓜ", "ⓝ", "ⓞ", "ⓟ", "ⓠ", "ⓡ", "ⓢ", "ⓣ", "ⓤ", "ⓥ", "ⓦ", "ⓧ", "ⓨ", "ⓩ", "Ⓐ", "Ⓑ", "Ⓒ", "Ⓓ", "Ⓔ", "Ⓕ", "Ⓖ", "Ⓗ", "Ⓘ", "Ⓙ", "Ⓚ", "Ⓛ", "Ⓜ", "Ⓝ", "Ⓞ", "Ⓟ", "Ⓠ", "Ⓡ", "Ⓢ", "Ⓣ", "Ⓤ", "Ⓥ", "Ⓦ", "Ⓧ", "Ⓨ", "Ⓩ", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⓪", "`", "~", "❕", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "❜", ":", "❞", ",", ".", "/", "<", ">", "❔"];
const coolFont_cursive = ["\t", "\n", " ", "𝒶", "𝒷", "𝒸", "𝒹", "ℯ", "𝒻", "ℊ", "𝒽", "𝒾", "𝒿", "𝓀", "𝓁", "𝓂", "𝓃", "ℴ", "𝓅", "𝓆", "𝓇", "𝓈", "𝓉", "𝓊", "𝓋", "𝓌", "𝓍", "𝓎", "𝓏", "𝒜", "ℬ", "𝒞", "𝒟", "ℰ", "ℱ", "𝒢", "ℋ", "ℐ", "𝒥", "𝒦", "ℒ", "ℳ", "𝒩", "𝒪", "𝒫", "𝒬", "ℛ", "𝒮", "𝒯", "𝒰", "𝒱", "𝒲", "𝒳", "𝒴", "𝒵", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "_", "+", "[", "]", "\\", "{", "}", "|", ";", "'", ":", "\"", ",", ".", "/", "<", ">", "?"];

const nonoWords = {
  provided_by: "Free Web Headers",
  URL: "https://www.freewebheaders.com/full-list-of-bad-words-banned-by-google/",
  words: [
    "anal", "anus", "arse", "ass", "ass fuck", "ass hole", "assfucker", "asshole", "assshole", "bastard", "bitch", "black cock", "bloody hell", "boobies", "boob", "boobs", "boong", "butt hole", "cock", "cockfucker", "cocksuck", "cocksucker", "coon", "coonnass", "crap", "cum", "cunt", "cyberfuck", "damm", "dammm", "damn", "darn", "deez nut", "dick", "douche", "dummy", "erect", "erection", "erotic", "escort", "fag", "faggot", "fuck", "fuck off", "fuck you", "fuckass", "fuckhole", "god damn", "gook", "hard core", "hardcore", "the hell", "helll", "hell no", "homoerotic", "hore", "jerk off", "jerked off", "jerking off", "lesbian", "lesbians", "mother fucker", "motherfuck", "motherfucker", "negro", "nigga", "nigger", "nudes", "orgasim", "orgasm", "penis", "penisfucker", "pervert", "piss", "piss off", "porn", "porno", "pornography", "pussy", "retard", "sadist", "sex", "sexy", "shit", "slut", "son of a bitch", "sperm", "suck", "tits", "vagina", "viagra", "whore"
  ],
};


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

client.on("ready", function() {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", function(msg) {
  var lowMsg = msg.content;
  if (typeof lowMsg === "string") {
    lowMsg = lowMsg.toLowerCase();
  } else {
    console.log("ERROR: lowMsg is not typeof string" + lowMsg);
    return;
  }
  var splitMsg = lowMsg.split(" ");

  var msgCheck = "" + lowMsg;
  msgCheck = replaceAll(msgCheck, "@", "a");
  msgCheck = replaceAll(msgCheck, "$", "s");
  msgCheck = replaceAll(msgCheck, "|", "l");
  msgCheck = replaceAll(msgCheck, "/", "l");
  msgCheck = replaceAll(msgCheck, "3", "e");
  var deletePost = false;
  var badWord = "";
  for (var i = 0; i < nonoWords.words.length; i++) {
    badWord = "" + nonoWords.words[i];
    var variations = [];
    variations.push(" " + nonoWords.words[i]);

    if (msgCheck === badWord) {
      deletePost = true;
    }

    for (var j = 0; j < variations.length; j++) {
      var wrd = variations[j];
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
    
    // else {
    //   for (var j = 0; j < msg.embeds.length; j++) {
    //     var contentLC = msg.embeds[j].description;
    //     if (typeof contentLC === "string") {
    //       contentLC = contentLC.toLowerCase();
    //     } else {
    //       console.log("ERROR: contentLC is not typeof string" + contentLC);
    //       return;
    //     }

    //     if (contentLC.includes(badWord)) {
    //       var endChar = contentLC.charAt(contentLC.indexOf(badWord) + badWord.length);
    //       if (!alphabet.includes(endChar) || endChar === "") {
    //         deletePost = true;
    //         break;
    //       }
    //     }
    //   }
    // }
  }

  if (deletePost && msg.channel.type !== 'dm') {
    msg.delete().catch(function() {
      msg.channel.send("Please give me permission to delete messages");
    });
    msg.channel.send("Comment Deleted - Reason: that word is not allowed here.");
    msg.author.send("The word `" + badWord + "` is not allowed here");
    return;
  }

  if (msg.mentions.has(client.user)) {
    msg.reply("My prefix is ?\nYou can open a list of commands using\n```?help```");
  }

  if (splitMsg[0] === "?online") {
    msg.channel.send("All systems are up and running!");
  }
  else if (splitMsg[0] === "?help") {
    msg.channel.send(
      "```\n" +
      "get\n\thot [NUMBER]\n\trecent [NUMBER]\n\tvotes [NUMBER]\n\n" +
      "search\n\tuser [USERNAME]\n\n" +
      "coolify\n\tgothic [WORDS]\n\toutline [WORDS]\n\tmonospace [WORDS]\n\tbubble [WORDS]\n\tcursive [WORDS]\n\n" +
      "wyr\n\n" +
      "define [WORD/PHRASE]" +
      "```"
    );
  }
  else if (splitMsg[0] === "?get") {
    var num = parseInt(splitMsg[2], 10);
    if (typeof num !== "number") {
      return;
    }
    if (splitMsg[1] === "hot") {
      msg.reply("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=3&limit=" + num, num - 1, num, "lists").then(function(txt) {
        msg.channel.send(txt);
      });
    }
    if (splitMsg[1] === "recent") {
      msg.reply("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=2&limit=" + num, num - 1, num, "lists").then(function(txt) {
        msg.channel.send(txt);
      });
    }
    if (splitMsg[1] === "votes") {
      msg.reply("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=5&limit=" + num + "&topic_id=xffde7c31", num - 1, num, "lists").then(function(txt) {
        msg.channel.send(txt);
      });
    }
  }
  else if (splitMsg[0] === "?search") {
    if (splitMsg[1] === "user") {
      if (splitMsg[2].charAt(0) === "@") {
        splitMsg[2] = splitMsg[2].slice(1, splitMsg[2].length);
      }

      msg.reply("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/user/profile?username=" + splitMsg[2], 0, 0, "user")
        .then(function(data) {
          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#14bf96")
            .setTitle("**" + data.nickname + "**")
            .setURL("https://www.khanacademy.org/profile/" + data.kaid)
            .setDescription("@" + data.username + " - " + data.bio + "\n\n**Date Joined:** " + data.dateJoined + "\n**Energy Points:** " + data.points + "\n**Videos Completed:** " + data.countVideosCompleted + "\n**KAID:** " + data.kaid)
            .setThumbnail(data.image)

          msg.channel.send({
            embed: exampleEmbed
          });
        });
    }
  }
  else if (splitMsg[0] === "?coolify") {
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
    msg.channel.send(newData);
  }
  else if (splitMsg[0] === "?wyr") {
    var wyrId = Math.floor(random(3, 500000));

    fetch("https://www.either.io/" + wyrId)
      .then(res => res.text())
      .then(text => {
        if (!text.includes("We cannot find the page you are looking for")) {
          var preface = text.split('<h3 class="preface">')[1].split("</h3>")[0];

          var options = text.split('<div class="option">');
          options = [
            options[3].split('</div>')[0].split('rel="nofollow">')[1].split('</a>')[0].replace("\n", ""),
            options[4].split('</div>')[0].split('rel="nofollow">')[1].split('</a>')[0].replace("\n", "")
          ];

          msg.channel.send({
            embed: {
              color: 3447003,
              description: "**" + preface + "**\n\n**EITHER...**\n:regional_indicator_a: " + options[0] + "\n\n**OR...**\n:regional_indicator_b: " + options[1]
            }
          })
          .then(function(msg) {
            msg.react("🇦")
              .then(function() {
                msg.react("🇧");
              });
          });

        } else {
          msg.channel.send("An Error Has Occured. Please Try Again In A Few Seconds.");
        }

      })
  }
  else if (splitMsg[0] === "?define") {
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

      })
  }

});

keepAlive();
client.login(process.env['myToken']);

setInterval(function() {
  var d = new Date().toLocaleTimeString();
  console.log(d);
}, 1000 * 60);
