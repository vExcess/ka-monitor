const Discord = require("discord.js");
const fetch = require("node-fetch");
const client = new Discord.Client();
const keepAlive = require("./server");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var fs = require('fs');
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

function notWhitespace (str) {
  return str.replace(/\s/g, '').length;
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
  var staffRole = msg.guild.roles.cache.find(function (role) {
    return role.name.toLowerCase().includes("staff");
  });
  var ownerRole = msg.guild.roles.cache.find(function (role) {
    return role.name.toLowerCase().includes("owner");
  });
  var modRole = msg.guild.roles.cache.find(function (role) {
    return role.name.toLowerCase().includes("moderator");
  });
  if (modRole === undefined) {
    modRole = msg.guild.roles.cache.find(function (role) {
      return role.name.toLowerCase().includes("mod");
    });
  }

  var authorRoles = msg.member.roles.cache;

  if (
    (staffRole !== undefined && authorRoles.has(staffRole.id)) || 
    (ownerRole !== undefined && authorRoles.has(ownerRole.id)) || 
    (modRole !== undefined && authorRoles.has(modRole.id))
  ) {
    return true;
  } else {
    return false;
  }
}

function filterMessage (msg, wordList, prefix) {
  if (msg.content.includes(prefix + "swearFilter remove")) {
    return false;
  }

  var lowMsg = msg.content;
  if (typeof lowMsg === "string") {
    lowMsg = lowMsg.toLowerCase();
  } else {
    console.log("ERROR: lowMsg is not typeof string" + lowMsg);
    return;
  }
  
  var isEmbed = false;
  var msgCheck = "" + lowMsg;

  if (msg.embeds[0] && msg.embeds[0].description) {
    isEmbed = true;
    msgCheck += msg.embeds[0].description.toLowerCase();
  }

  msgCheck = replaceAll(msgCheck, "@", "a");
  msgCheck = replaceAll(msgCheck, "$", "s");
  msgCheck = replaceAll(msgCheck, "|", "l");
  msgCheck = replaceAll(msgCheck, "/", "l");
  msgCheck = replaceAll(msgCheck, "3", "e");
  msgCheck = replaceAll(msgCheck, "4", "a");

  msgCheck = replaceAll(msgCheck, "*", "");
  msgCheck = replaceAll(msgCheck, "_", "");
  msgCheck = replaceAll(msgCheck, "~", "");

  var deletePost = false;
  var badWord = "";

  // go through all the bad words
  for (var i = 0; i < wordList.length; i++) {
    // the current bad word
    badWord = wordList[i];

    // create variations
    var variations = [];
    variations.push(" " + wordList[i]);

    // check if the message is the bad word
    if (msgCheck === badWord) {
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

    msg.delete().then(function () {
      channel.send("Comment Deleted - Reason: that word is not allowed here.");
    }).catch(function() {
      channel.send("An error has occured while attempting to delete the message.");
    });

    if (!msg.author.bot) {
      msg.author.send(msgToSend);
    }

    client.users.fetch("480905025112244234").then(function (user) {
      if (user) {
        user.send("Rule Breaker: " + username + "\n\n" + msgToSend);
      }
    });
  }

  return deletePost;
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

  if (msg.guild) {
    if (!serversDatabase[msg.guild.id]) {
      serversDatabase[msg.guild.id] = {};
    }
    var servDat = serversDatabase[msg.guild.id];
    if (!servDat.name) {
      servDat.name = msg.guild.name;
    }
    if (!servDat.prefix) {
      servDat.prefix = "?";
    }
    if (!servDat.bannedWords) {
      servDat.bannedWords = defaultBannedWords.slice(0, defaultBannedWords.length);
    }
  }
  
  if (!servDat) {
    servDat = {
      "swearFilterOn": false,
      "name": undefined,
      "prefix": "?",
      "bannedWords": []
    }
  }

  var channelName = undefined;
  if (msg.channel && msg.channel.name) {
    channelName = msg.channel.name.toLowerCase();
  }

  if (servDat.swearFilterOn && channelName && !channelName.includes("debate") && !channelName.includes("staff")) {
    var deletedMessage = filterMessage(msg, servDat.bannedWords, servDat.prefix);
    if (deletedMessage) {
      return;
    }
  }
  
  var p = servDat.prefix;

  var target = msg.mentions.users.first();
  if (msg.content === "<@!845426453322530886>" && target) {
    var memberTarget = msg.guild.members.cache.get(target.id);
    if (memberTarget && memberTarget.user.id === "845426453322530886") {
      msg.channel.send("My prefix is `" + servDat.prefix + "`");
    }
  }

  if (splitMsg[0] === p+"online" || splitMsg[0] === p+"ping") {
    msg.channel.send("Up and running!\n" + client.ws.ping + " millisecond delay");
  }
  else if (splitMsg[0] === p+"guild") {
    console.log(msg.guild.id);
  }
  else if (splitMsg[0] === p+"help") {
    msg.channel.send(
      "```\n" +
      "online\n\n" +
      "update\n\tprograms\n\n" +
      "plagiarism [PROGRAM_ID]\n\n" +
      "get\n\thot [NUMBER]\n\trecent [NUMBER]\n\tvotes [NUMBER]\n\tuser [USERNAME/KAID]\n\tprofilepic [@USER]\n\tdiscordId [@USER]\n\n" +
      "search\n\tuser [NICKNAME]\n\tgoogle [SEARCH QUERY]\n\n" +
      "coolify\n\tgothic [WORDS]\n\toutline [WORDS]\n\tmonospace [WORDS]\n\tbubble [WORDS]\n\tcursive [WORDS]\n\n" +
      "wyr\n\n" +
      "define [WORD/PHRASE]\n\n" +
      "set prefix [PREFIX]\n\n" +
      "swearFilter [ON/OFF/RESET/TEST]\n\n" +
      "```"
    );
  }
  else if (splitMsg[0] === p+"update") {
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
  else if (splitMsg[0] === p+"plagiarism") {
    if (servDat.busy) {
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
      
      servDat.busy = true;

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
          servDat.busy = false;

        });
      });
    }
  }
  else if (splitMsg[0] === p+"get") {
    var num = parseInt(splitMsg[2], 10);
    if (typeof num !== "number") {
      return;
    }
    if (splitMsg[1] === "hot") {
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
    if (splitMsg[1] === "discordid") {
      if (msg.guild && msg.guild.members && msg.guild.members.cache && msg.guild.members.cache.get) {
        var memberTarget = msg.guild.members.cache.get(target.id);
        if (memberTarget && memberTarget.user) {
          msg.channel.send(memberTarget.user.id);  
        }
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
  else if (splitMsg[0] === p+"search") {
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
  else if (splitMsg[0] === p+"coolify") {
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
  else if (splitMsg[0] === p+"wyr") {
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
    })
  }
  else if (splitMsg[0] === p+"define") {
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
  else if (splitMsg[0] === p+"swearfilter") {
    if (!authorIsStaff(msg)) {
      msg.channel.send("You do not have permission to use that command.");
      return;
    }

    if (splitMsg[1] === "on" || splitMsg[1] === "true" || splitMsg[1] === "yes") {
      servDat.swearFilterOn = true;
      msg.channel.send("The swear filter has been turned on in " + msg.guild.name);
      fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    }
    else if (splitMsg[1] === "off" || splitMsg[1] === "false" || splitMsg[1] === "no") {
      servDat.swearFilterOn = false;
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
      servDat.bannedWords = defaultBannedWords.slice(0, defaultBannedWords.length);
      msg.channel.send("The swear filter has been reset in " + msg.guild.name);
      fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    }
    else if (splitMsg[1] === "add") {
      splitMsg[2] = splitMsg[2].toLowerCase();
      var wordIdx = servDat.bannedWords.indexOf(splitMsg[2]);
      if (wordIdx < 0) {
        servDat.bannedWords.push(splitMsg[2]);
        msg.channel.send("The word `" + splitMsg[2] + "` has been added to the filter.");
        fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
      } else {
        msg.channel.send("The word `" + splitMsg[2] + "` is already on the filter.");
      }
    }
    else if (splitMsg[1] === "remove") {
      splitMsg[2] = splitMsg[2].toLowerCase();
      var wordIdx = servDat.bannedWords.indexOf(splitMsg[2]);
      if (wordIdx >= 0) {
        servDat.bannedWords.splice(wordIdx, 1);
        msg.channel.send("The word `" + splitMsg[2] + "` has been removed from the filter.");
        fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
      } else {
        msg.channel.send("The word `" + splitMsg[2] + "` is not on the filter.");
      }
    }
  }
  else if (splitMsg[0] === p+"set") {
    if (!authorIsStaff(msg)) {
      msg.channel.send("You do not have permission to use that command.");
      return;
    }

    if (splitMsg[1] === "prefix") {
      servDat.prefix = splitMsg[2];
      msg.channel.send("My prefix has been set to `" + servDat.prefix + "`");
      fs.writeFileSync('serversDatabase.js', "exports.SERVER_DATA = " + JSON.stringify(serversDatabase, null, "  "), 'utf-8');
    }
  }
  else if (splitMsg[0] === p+"temp") {
    var staffRole = msg.guild.roles.cache.find(function (role) {
      return role.name.toLowerCase().includes("mod");
    });
    console.log(staffRole);
  }
  

});

keepAlive();
client.login(process.env['myToken']);

setInterval(function() {
  var d = new Date().toLocaleTimeString();
  console.log(d);
}, 1000 * 60);
