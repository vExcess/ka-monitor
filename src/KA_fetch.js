exports.KA_fetch = {
    queryStrings: {
        getFullUserProfile: `getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      unverifiedAuthEmailToken\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n`,
        avatarDataForProfile: `avatarDataForProfile($kaid: String!) {\\n  user(kaid: $kaid) {\\n    id\\n    avatar {\\n      name\\n      imageSrc\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`,
        getPublicBadgesForProfiles: `getPublicBadgesForProfiles($kaid: String) {\\n  user(kaid: $kaid) {\\n    id\\n    publicBadges {\\n      badgeCategory\\n      description\\n      isOwned\\n      isRetired\\n      name\\n      points\\n      absoluteUrl\\n      hideContext\\n      icons {\\n        smallUrl\\n        compactUrl\\n        emailUrl\\n        largeUrl\\n        __typename\\n      }\\n      relativeUrl\\n      safeExtendedDescription\\n      slug\\n      translatedDescription\\n      translatedSafeExtendedDescription\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`,
        discussionAvatar: `discussionAvatar {\\n  user {\\n    id\\n    avatar {\\n      name\\n      imageSrc\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`,
        isHellbanned: `isHellbanned($kaid: String!) {\\n  user(kaid: $kaid) {\\n    id\\n    discussionBanned\\n    __typename\\n  }\\n}\\n`,
        getProfileWidgets: `getProfileWidgets($kaid: String) {\\n  user(kaid: $kaid) {\\n    id\\n    profileWidgets {\\n      widgetId\\n      translatedTitle\\n      viewAllPath\\n      readAccessLevel\\n      readLevelOptions\\n      editSettings\\n      isEditable\\n      isEmpty\\n      ... on BadgeCountWidget {\\n        badgeCounts {\\n          count\\n          category\\n          compactIconSrc\\n          __typename\\n        }\\n        __typename\\n      }\\n      ... on DiscussionWidget {\\n        statistics {\\n          answers\\n          flags\\n          projectanswers\\n          projectquestions\\n          votes\\n          comments\\n          questions\\n          replies\\n          __typename\\n        }\\n        __typename\\n      }\\n      ... on ProgramsWidget {\\n        programs {\\n          authorNickname\\n          authorKaid\\n          key\\n          displayableSpinoffCount\\n          sumVotesIncremented\\n          imagePath\\n          translatedTitle\\n          url\\n          deleted\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n`
    },
    getJSON: function (fetchReference, dataIn, callback) {
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

        fetchReference(
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