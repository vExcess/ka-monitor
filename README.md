### KA Monitor is a dying project. It used to have a ton of fun functionality, but as the many services it relied upon changed their APIs I haven't had the motivation to maintain it and simply removed the features instead. Overtime the project has slowly been losing features and eventually it probably won't even run anymore. So enjoy the few features it has left before it completely ceases to function I guess. After it stops working I'll delete this repo. 

# KA Monitor
A general purpose Discord bot. Has fairly advanced swear filtering. Is able to display information about a user's activity and provide leaderboards of user activity. Has multiple Khan Academy related commands: is able to search for users on KA and lookup information about them. Able to check if a KA program is plagiarised. Is able to define and translate words/phrases. Is able to run blocks of javascript code. Has many fun features such as would you rather questions.

Invite Link: https://discord.com/api/oauth2/authorize?client_id=845426453322530886&permissions=412317248576&scope=bot

# Commands
```
ping
invite
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
leaderboard
    sus
    activity
    pottymouth
eval [CODE] (code must be in code block)
translate "[WORD/PHRASE]" [ORIGIN_LANG] => [*TARGET_LANG*]
```
