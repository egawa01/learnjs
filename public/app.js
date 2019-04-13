'use strict';


var learnjs = {
    poolId: 'us-east-1:6d7480d0-8fb2-400a-8a5c-cc3512715e60'
};

learnjs.identity = new $.deferred();

learnjs.problems = [
    {
        description: "What is truth?",
        code: "function problem() {return __; }"
    },
    {
        description: "Simple Math",
        code: "function problem() {return 42 === 6 * __; }"
    }
];

learnjs.problemView = function(data) {
    var problemNumber = parseInt(data, 10);
    var view = $('.templates .problem-view').clone();
    var problemData = learnjs.problems[problemNumber - 1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        var answer = view.find('.answer').val();
        var test = problemData.code.replace('__', answer) + '; problem();';
        try {
            return eval(test);
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    function checkAnswerClick() {
        if (checkAnswer()) {
             var correctFlash = learnjs.buildCorrectFlash(problemNumber);
            learnjs.flashElement(resultFlash, correctFlash); 
        } else {
            learnjs.flashElement(resultFlash, 'Incorrect!'); 
       }
        return false;
    }

    if (problemNumber < learnjs.problems.length) {
        var buttonItem = learnjs.template('skip-btn');
        buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
        $('.nav-list').append(buttonItem);
        view.bind('removingView', function() {
            buttonItem.remove();
        });
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
};

learnjs.landingView = function() {
    return learnjs.template('landing-view');
}

learnjs.showView = function(hash) {
    var routes = {
        '#problem': learnjs.problemView,
        '': learnjs.landingView
    };
    var hashParts = hash.split('-');
    var viewFn = routes[hashParts[0]];
    if(viewFn) {
        learnjs.triggerEvent('removingView', []);
        $('.view-container').empty().append(viewFn(hashParts[1]));    };
 };

 learnjs.appOnReady = function() {
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };
     learnjs.showView(window.location.hash);
 };

 learnjs.applyObject = function(obj, elem) {
     for (var key in obj) {
         elem.find('[data-name="' + key + '"]').text(obj[key]);
     }
 }

 learnjs.flashElement = function(elem, content) {
    elem.fadeOut('slow', function() {
        elem.html(content);
        elem.fadeIn();
    });
};

learnjs.template = function(name) {
    return $('.templates .' + name).clone();
};

learnjs.buildCorrectFlash = function(problemNum) {
    var correctFlash = learnjs.template('correct-flash');
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1));
    } else {
        link.attr('href', '');
        link.text("You're Finished!");
    }
    return correctFlash;
};

learnjs.triggerEvent = function(name, args) {
    $('.view-container>*').trigger(name, args);
}



function googleSignIn(googleUser){
    console.log('arguments');
    console.log(arguments);
    var id_token = googleUser.getAuthResponse().id_token;
    AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: learnjs.poolId,
            Logins: {
                'accounts.google.com': id_token
            }
        })
    });

    learnjs.awsRefresh = function() {
        var deferred = new $.Deferred();
        AWS.config.credentials.refresh(function(err) {
            if (err) {
                deferred.resolve(AWS.config.credentials.identityId);
            }
        });
        return deferred.promise();
    }

    learnjs.awsRefresh().then(function(id) {
        learnjs.identity.resolve({
            id: id,
            email: googleUser.getBasicProfile().getEmail(),
            refresh: refresh
        });
    });
}

function refresh() {
    return gapi.auth2.getAuthInstance().signIn({
        prompt: 'login'
    }).then(function(userUpdate) {
        var creds = AWS.config.credentials;
        var newToken = userUpdate.getAuthResponse().id_token;
        creds.params.Logins['accounts.google.com'] = newToken;
        return learnjs.awsRefresh();
    });
}
