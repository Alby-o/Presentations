var groups = [];

$(document).ready(function() {
    addNewGroup();
});

$("#add-group").click(function(event) {
    addNewGroup();
    event.preventDefault();
});

$("#group-input").on("click", ".remove", function(event){
    $(this).parent().parent().remove();
    
    event.preventDefault();
});

$("#confirm").click(function(event) {
    $(".group:not(.template)").each(function() {
        var letter = $(this).find(".letter").val();
        var name = $(this).find(".name").val();
        var poster = $(this).find(".poster").val();
        groups.push({"letter": letter, "name": name, "poster": poster, "presented": false});
    });

    $(this).parent().parent().parent().parent().remove();

    groups = shuffle(groups);
    displayOrder();
    
    event.preventDefault();
});


$("main").on("click", ".next", function() {
    $(this).parent().parent().remove();
    presentNextGroup();
});

$("main").on("click", ".continue", function() {
    $(this).parent().parent().remove();
    displayOrder();
});

function addNewGroup() {
    var group = $(".group.template").clone().removeClass("template");
    $(".button-container").before(group);
}

function displayOrder() {
    var allPresented = true;

    var article = $("<article>").append($("<h3>Order:</h3>"));
    var articleBody = $("<div>").addClass("article-body");
    article.append(articleBody);

    for (var i = 0; i < groups.length; i++) {
        var group = $("<p>").text(groups[i].letter + ": " + groups[i].name);
        if (groups[i].presented == true) {
            group.addClass("presented");
        } else {
            allPresented = false;
        }
        articleBody.append(group);
    }

    if (allPresented) {
        articleBody.append($("<p>").text("WOOP WOOP ALL DONESIES").addClass("done"));
    } else {
        articleBody.append($("<button>").text("Present Next Group").addClass("next"));
    }
    $("main").append(article);
}

function presentNextGroup() {
    var group;

    for (var i = 0; i < groups.length; i++) {
        if (groups[i].presented == false) {
            groups[i].presented = true;
            group = groups[i];
            break;
        }
    }

    var article = $("<article>").append($("<h3>").text(group.name));
    var articleBody = $("<div>").addClass("article-body");
    article.append(articleBody);

    articleBody.append($("<div>").addClass("img-container").append($("<img>").attr("src", group.poster)));
    articleBody.append($("<p>").attr("id", "counter"));
    articleBody.append($("<button>").text("Continue").addClass("continue"));

    $("main").append(article);    
    
    countdown(5);
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// https://www.w3schools.com/howto/howto_js_countdown.asp
function countdown(minutes) {
    // Set the date we're counting down to

    var firsthorn = false;
    var flashing = false;

    var currentDate = new Date().getTime();
    var countDownDate = new Date(currentDate + minutes*60000);

    // Update the count down every 1 second
    var x = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("counter").innerHTML = minutes + "m " + seconds + "s ";

        if (!firsthorn && minutes < 1) {
            document.getElementById("shorthorn").play();
            firsthorn = true;
        }

        if(!flashing && minutes < 1 && seconds < 16) {
            $("#counter").addClass("warning");
        }

        // If the count down is finished, write some text 
        if (distance < 0) {
            clearInterval(x);

            $("#counter").removeClass("warning").addClass("time-out").text("TIME OUT");
            $("img").attr("src", "img/horn.png").addClass("horn");
            document.getElementById("horn").play();
        }
    }, 1000);
}