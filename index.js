const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const keepAlive = require("./server");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const KA_fetch = {
    queryStrings: {
        getFullUserProfile: `getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      unverifiedAuthEmailToken\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n`,
        avatarDataForProfile: `avatarDataForProfile($kaid: String!) {\\n  user(kaid: $kaid) {\\n    id\\n    avatar {\\n      name\\n      imageSrc\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`,
        getPublicBadgesForProfiles: `getPublicBadgesForProfiles($kaid: String) {\\n  user(kaid: $kaid) {\\n    id\\n    publicBadges {\\n      badgeCategory\\n      description\\n      isOwned\\n      isRetired\\n      name\\n      points\\n      absoluteUrl\\n      hideContext\\n      icons {\\n        smallUrl\\n        compactUrl\\n        emailUrl\\n        largeUrl\\n        __typename\\n      }\\n      relativeUrl\\n      safeExtendedDescription\\n      slug\\n      translatedDescription\\n      translatedSafeExtendedDescription\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`,
        discussionAvatar: `discussionAvatar {\\n  user {\\n    id\\n    avatar {\\n      name\\n      imageSrc\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`,
        isHellbanned: `isHellbanned($kaid: String!) {\\n  user(kaid: $kaid) {\\n    id\\n    discussionBanned\\n    __typename\\n  }\\n}\\n`,
        getProfileWidgets: `getProfileWidgets($kaid: String) {\\n  user(kaid: $kaid) {\\n    id\\n    profileWidgets {\\n      widgetId\\n      translatedTitle\\n      viewAllPath\\n      readAccessLevel\\n      readLevelOptions\\n      editSettings\\n      isEditable\\n      isEmpty\\n      ... on BadgeCountWidget {\\n        badgeCounts {\\n          count\\n          category\\n          compactIconSrc\\n          __typename\\n        }\\n        __typename\\n      }\\n      ... on DiscussionWidget {\\n        statistics {\\n          answers\\n          flags\\n          projectanswers\\n          projectquestions\\n          votes\\n          comments\\n          questions\\n          replies\\n          __typename\\n        }\\n        __typename\\n      }\\n      ... on ProgramsWidget {\\n        programs {\\n          authorNickname\\n          authorKaid\\n          key\\n          displayableSpinoffCount\\n          sumVotesIncremented\\n          imagePath\\n          translatedTitle\\n          url\\n          deleted\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`
    },
    getJSON: function (dataIn, callback) {
        var variablesCode = "";
        var propertyCount = Object.keys(dataIn.variables).length;
        var propertyIdx = 0;
        for (var property in dataIn.variables) {
            variablesCode += '"' + property + '": "' + dataIn.variables[property] + '"';
            propertyIdx++;
            if (propertyIdx < propertyCount) {
            variablesCode += ",\\n";
            }
        }

        var queryString = "";
        if (dataIn.query) {
            queryString = dataIn.query;
        } else {
            queryString = this.queryStrings[dataIn.operationName];
        }

        fetch(
            "https://www.khanacademy.org/api/internal/graphql/" + dataIn.operationName, 
            {
            "headers": {
                "content-type": "application/json",
                "cookie": "fkey=0",
                "x-ka-fkey": "0"
            },
            "body": `{
                \"operationName\": \"` + dataIn.operationName + `\",
                \"variables\": {` + variablesCode + `},
                \"query\": \"query ` + queryString + `\"
            }`,
            "method": "POST"
            }
        )
        .then(function (response) {
            return response.json();
        })
        .then(function (JSON_data) {
            callback(JSON_data.data);
        })
    }
};
var users = require('./users');

var nicks = users.KA_USERS[0];

function notWhitespace (str) {
  return str.replace(/\s/g, '').length;
}

function searchUsers (input) {
  input = input.toLowerCase();
  var tokens = input.split(" ");

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

const nonoWords = {
  provided_by: "Free Web Headers",
  URL: "https://www.freewebheaders.com/full-list-of-bad-words-banned-by-google/",
  words: [
    "anal", "anus", "arse", "ass", "ass fuck", "ass hole", "assfucker", "asshole", "assshole", "bastard", "bitch", "black cock", "bloody hell", "boobies", "boob", "boobs", "boong", "butt hole", "cock", "cockfucker", "cocksuck", "cocksucker", "condom", "coon", "coonnass", "crap", "cum", "cunt", "cyberfuck", "damm", "dammm", "damn", "deez nut", "dick", "douche", "dummy", "erect", "erection", "erotic", "escort", "fag", "faggot", "fuck", "fuck off", "fuck you", "fuckass", "fuckhole", "god damn", "gook", "hard core", "hardcore", "the hell", "helll", "hell no", "homoerotic", "hore", "jerk off", "jerked off", "jerking off",  "mother fucker", "motherfuck", "motherfucker", "negro", "nigga", "nigger", "nudes", "orgasim", "orgasm", "penis", "penisfucker", "pervert", "piss", "piss off", "porn", "porno", "pornography", "pornstar", "pussy", "retard", "sadist", "sex", "sexy", "shit", "shithole", "slut", "son of a bitch", "sperm", "testicle", "tits", "vagina", "viagra", "whore"
  ],
};

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
    badWord = nonoWords.words[i];
    var variations = [];
    variations.push(" " + nonoWords.words[i]);

    if (msgCheck === badWord) {
      deletePost = true;
    }

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
      // check embeds
      else if (msg.embeds[0] && msg.embeds[0].description) {
        var msgCheck2 = msg.embeds[0].description;
        msgCheck2 = replaceAll(msgCheck2, "@", "a");
        msgCheck2 = replaceAll(msgCheck2, "$", "s");
        msgCheck2 = replaceAll(msgCheck2, "|", "l");
        msgCheck2 = replaceAll(msgCheck2, "/", "l");
        msgCheck2 = replaceAll(msgCheck2, "3", "e");

        if (msgCheck2.includes(wrd)) {
          var endChar = msgCheck2.charAt(msgCheck2.indexOf(wrd) + wrd.length);
          if (!alphabet.includes(endChar) || endChar === "") {
            deletePost = true;
            console.log("delete message");
            break;
          }
        }
      }
    }

    if (deletePost) {
      break;
    }
  }

  if (deletePost && msg.channel.type !== 'dm') {
    var msgToSend = "Deleted Message: ```" + msg.content + "``` because it contained `" + badWord + "`";

    msg.delete().catch(function() {
      msg.channel.send("Please give me permission to delete messages");
    });

    msg.channel.send("Comment Deleted - Reason: that word is not allowed here.");

    if (!msg.author.bot) {
      msg.author.send(msgToSend);
    }

    client.users.fetch("480905025112244234").then(function (user) {
      if (user) {
        user.send(msgToSend);
      }
    });

    return;
  }

  if (splitMsg[0] === "?online") {
    msg.channel.send("All systems are up and running!");
  }
  else if (splitMsg[0] === "?help") {
    msg.channel.send(
      "```\n" +
      "get\n\thot [NUMBER]\n\trecent [NUMBER]\n\tvotes [NUMBER]\n\tuser [USERNAME/KAID]\n\tprofilepic [@USER]\n\n" +
      "search\n\tuser [NICKNAME]\n\n" +
      "coolify\n\tgothic [WORDS]\n\toutline [WORDS]\n\tmonospace [WORDS]\n\tbubble [WORDS]\n\tcursive [WORDS]\n\n" +
      "wyr\n\n" +
      "define [WORD/PHRASE]" +
      "```"
    );
  }
  else if (splitMsg[0] === "?plagiarism") {
    var title = "";
    var code = {};
    var authorId = "";
    var spinoffs = [];
    var possibles = [];
    var recurves = 0;

    var checkPrograms = function (programs) {
      for (let program of programs) {
        // if is not by same author and is not spin-off
        if (program.authorID !== authorId && !spinoffs.includes(program._id)) {
          // check individual program          
          getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + program._id, function (data, program_) {
            if (data && data.revision.code) {
              let matches = 0;
              let lines = data.revision.code.split("\n").map(line => line.trim()).filter(line => line.length > 4);
              let linesSet = new Set(lines);
              for (let line of linesSet) {
                if (code.has(line)) {
                  matches++;
                }
              }
              if (matches > lines.length / 2) {
                possibles.push([
                  program_.programTitle,
                  program_.programId,    
                  matches            
                ]);
              }
            }
          }, {programId: program._id, programTitle: program.title});
        }
        
      }

      // for (var i = 0; i < programs.length; i++) {
      //   var program = programs[i];

      //   // if is not by same author and is not spin-off
      //   if (program.authorID !== authorId && !spinoffs.includes(program._id)) {
      //     // check individual program
      //     getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + program._id, function (data, program_) {
      //       if (data && data.revision.code) {
      //         var code2 = data.revision.code.split("\n");

      //         var linesMatching = 0;

      //         var numLines = Math.min(code.length, code2.length);
      //         var halfNumLines = numLines / 2;

      //         // check if lines match
      //         for (var l = 0; l < numLines; l++) {
      //           for (var l2 = l - 50; l2 < l + 50; l2++) {
      //             if (l2 > 0 && l2 < numLines) {
      //               var line1 = code[l2];
      //               var line2 = code2[l];
      //               if (line1.length > 3 && line2.length > 3 && line2 === line1) {
      //                 linesMatching++;
      //                 l2 = l + 50;
      //               }
      //             }
      //           }
      //         }

      //         if (linesMatching > halfNumLines) {
      //           possibles.push([
      //             program_.programTitle,
      //             program_.programId,    
      //             linesMatching            
      //           ]);
      //         }
      //       }
      //     }, {programId: program._id, programTitle: program.title});
      //   }
      // }

      if (possibles.length > 10 || recurves >= 1000) {
        const exampleEmbed = new Discord.MessageEmbed();

        possibles.sort(function (a, b) {
          return b[2] - a[2];
        });

        for (var i = 0; i < possibles.length; i++) {
          exampleEmbed.addField(possibles[i][2] + " lines that match", "[" + possibles[i][0] + "](https://www.khanacademy.org/computer-programming/i/" + possibles[i][1] + ")");
        }

        exampleEmbed.setColor("#14bf96");
        exampleEmbed.setTitle("**Results for: " + title + "**");
        exampleEmbed.setURL("https://www.khanacademy.org/computer-programming/i/" + splitMsg[1]);

        msg.channel.send({
          embed: exampleEmbed
        });

      } else if (recurves < 1000) {
        recurves++;
        console.log("page " + recurves);
        getJSON("https://willard.fun/programs?&start=" + recurves * 50, function (data2) {
          checkPrograms(data2);
        });
      }
    };

    // get program
    getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + splitMsg[1], function (data) {
      title = data.title;
      code = data.revision.code.split("\n").map(line => line.trim()).filter(line => line.length > 4);
      msg.channel.send(code.length + " lines of code to search...");
      code = new Set(code);
      authorId = data.kaid;

      // get spin-offs
      getJSON("https://www.khanacademy.org/api/internal/scratchpads/" + splitMsg[1] + "/top-forks?limit=1000", function (data2) {
        for (var i = 0; i < data2.scratchpads.length; i++) {
          spinoffs.push(data2.scratchpads[i].url.split("/")[5]);
        }

        // gets tops programs
        getJSON("https://willard.fun/programs?&start=0", function (data3) {
          checkPrograms(data3);
        });
      });
    });
  }
  else if (splitMsg[0] === "?get") {
    var num = parseInt(splitMsg[2], 10);
    if (typeof num !== "number") {
      return;
    }
    if (splitMsg[1] === "hot") {
      msg.channel.send("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=3&limit=" + num, num - 1, num, "lists").then(function(txt) {
        msg.channel.send(txt);
      });
    }
    if (splitMsg[1] === "recent") {
      msg.channel.send("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=2&limit=" + num, num - 1, num, "lists").then(function(txt) {
        msg.channel.send(txt);
      });
    }
    if (splitMsg[1] === "votes") {
      msg.channel.send("Here is what I found:");
      getKAData("https://www.khanacademy.org/api/internal/scratchpads/top?sort=5&limit=" + num + "&topic_id=xffde7c31", num - 1, num, "lists").then(function(txt) {
        msg.channel.send(txt);
      });
    }
    if (splitMsg[1] === "profilepic") {
      var mentionedUser = msg.mentions.users.first();
      var imgLink = false;
      if (mentionedUser) {
        imgLink = msg.mentions.users.first().displayAvatarURL();
      }
      if (imgLink) {
        console.log(imgLink);
        msg.channel.send(mentionedUser.username + (mentionedUser.username.charAt(mentionedUser.username.length - 1).toLowerCase() === "s" ? "" : "'s") +" Profile Image:", {
          files: [imgLink]
        });
      } else {
        msg.channel.send("Image not found");
      }
      
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
      KA_fetch.getJSON(
        {
          operationName: "getFullUserProfile",
          variables: variablesObj
        }, 
        function (data) {
          var dateJoined = data.user.joined.slice(0, 10).split("-");
          dateJoined = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][parseInt(dateJoined[1], 10) - 1] + " " + dateJoined[2] + "th " + dateJoined[0] + " (" + (new Date().getFullYear() - parseInt(dateJoined[0])) + " years ago)";

          const exampleEmbed = new Discord.MessageEmbed()
            .setColor("#14bf96")
            .setTitle("**" + data.user.nickname + "**")
            .setURL("https://www.khanacademy.org/profile/" + data.user.kaid)
            .setDescription("@" + data.user.username + " - " + data.user.bio + "\n\n**Date Joined:** " + dateJoined + "\n**Energy Points:** " + numberWithCommas(data.user.points) + "\n**KAID:** " + data.user.kaid)

          KA_fetch.getJSON(
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
  else if (splitMsg[0] === "?search") {
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
  else if (splitMsg[0] === "?testfilter") {
    msg.channel.send({
      embed: {
        color: 3447003,
        description: "what the **helll**"
      }
    });
  }

});

keepAlive();
client.login(process.env['myToken']);

setInterval(function() {
  var d = new Date().toLocaleTimeString();
  console.log(d);
}, 1000 * 60);
