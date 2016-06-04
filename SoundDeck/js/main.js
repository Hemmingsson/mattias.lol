// settings
var clientId = '3704e007c260afa92227c9006034af90';
var accounts = ["timsweeney", "mrtophat", "babastiltz", "tjorvens", "paulahalldin", "viktor-rohlin", "kornel"]
var audioPlayer = new Audio();
var lazyload
$(function() {

    var millisecondsToHuman = function(milliseconds) {
        var date = new Date(null);
        date.setMilliseconds(milliseconds);
        var time = date.toISOString().substr(11, 8);
        return time
    };

    var formatTime = function(time, letters) {

        if (time.substring(0, 2) == 00) {
            return time.substr(3) + "m"
        } else {
            return time + "h"
        }


    }

    function convert_range(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]
    }

    var shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    SC.initialize({
        client_id: clientId,
    });

    var track_template = $('#track_template').html();
    var column_template = $('#column_template').html();



    var fetchTracks = function(columnElement) {
        var userId = $(columnElement).attr('data-userid');
        SC.get('/users/' + userId + '/favorites').then(function(tracks) {
            $.each(tracks, function(i, track) {

                // Make data readable t300x300
                track.timeAgo = $.timeago(track.created_at);
                track.durationHuman = formatTime(millisecondsToHuman(track.duration), true)
                //track.artwork_url =    track.artwork_url.replace('large.jpg', 't300x300.jpg')

                var track = Mustache.render(track_template, track);
                columnElement.find(".tracks").append(track);
            });
            lazyload.revalidate()
            columnElement.removeClass("hidden");
            console.timeEnd("time");
        })
    };


    var renderColumn = function(userData) {
        console.log
        userData.backgroundColor = colorByHashCode(userData.username)
        var columnElement = $(Mustache.render(column_template, userData));
        $(".column_scroll").append(columnElement)
        return columnElement;
    };


    var userFeed = function(username) {
        console.time("time");
        console.log("Creating User Feed for: " + username);
        var userUrl = 'http://soundcloud.com/' + username
        SC.resolve(userUrl)
            .then(renderColumn)
            .then(fetchTracks)
    };


    function colorByHashCode(value) {
        return value.getHashCode().intToHSL()
    }
    String.prototype.getHashCode = function() {
        var hash = 0;
        if (this.length == 0) return hash;
        for (var i = 0; i < this.length; i++) {
            hash = this.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };
    Number.prototype.intToHSL = function() {
        var shortened = this % 360;
        return "hsl(" + shortened + ",90%,60%)";
    };



    $.each(shuffleArray(accounts), function(index, username) {
        new userFeed(username)
    });

    $('#resolve').click(function() {
        if ($('#username').val().length > 0) {
            var username = $('#username').val()
            new userFeed(username)
        }
    });

    $('#resolve').keypress(function(e) {
        if (e.which == 13) {
            if ($('#username').val().length > 0) {
                var username = $('#username').val()
                new userFeed(username)
            }
            return false;
        }
    });


    var progressbar = $(".progressbar")
    var progressbar_progress = $(".progressbar_progress")
    var progressbar_buffer = $(".progressbar_buffer")
    var time_elapsed = $("#time_elapsed")
    var time_total = $("#time_total")
    var track_title = $("#track_title")
    var track_owner = $("#track_owner")

    var updatePlayer = function() {
        var progressbar_progress_width = convert_range(audioPlayer.currentTime, [0, audioPlayer.duration], [0, progressbar.width()])
        progressbar_progress.width(progressbar_progress_width + "px")
        var currentTime = millisecondsToHuman(audioPlayer.currentTime * 1000)
        time_elapsed.text(currentTime)
        if (time_total.text() == "" || time_total.text() == "00:00:00") {
            var duration = millisecondsToHuman(audioPlayer.duration * 1000)
            time_total.text(duration)
        }

        if (audioPlayer.paused) {
            $(".play_btn").removeClass('is_paused')
        } else {
            $(".play_btn").addClass('is_paused')
        }

    }

    $(audioPlayer).bind('timeupdate', updatePlayer);

    //$(audioPlayer).bind('oncanplay', );

    var getPercentProg = function() {
        var endBuf = audioPlayer.buffered.end(0);
        var progressbar_buffer_width = parseInt(((endBuf / audioPlayer.duration) * 100));
        progressbar_buffer.width(progressbar_buffer_width + "%")
    }

    var confirmOnPageExit = function (e) 
{
    // If we haven't been passed the event get the window.event
    e = e || window.event;

    var message = 'Any text will block the navigation and display a prompt';

    // For IE6-8 and Firefox prior to version 4
    if (e) 
    {
        e.returnValue = message;
    }

    // For Chrome, Safari, IE8+ and Opera 12+
    return message;
};

confirmOnPageExit()

    audioPlayer.addEventListener('progress', getPercentProg, false);

    $(document).on('click', '.play_btn', function() {
        console.log("klick");
        if (audioPlayer.paused) {
            audioPlayer.play()
        } else {
            audioPlayer.pause()
        }

    });

    var resetPlayer = function() {
        progressbar_buffer.width(0)
        progressbar_progress.width(0)
    }


    $(document).on('click', '.track', function() {
        resetPlayer()
        var parentFeed = $(this).parents(".column")
        var trackId = $(this).attr('data-trackid');
        var trackDuration = $(this).attr('data-duration');
        var trackName = $(this).find("p").text()
        var trackOwner = $(this).attr('data-owner');
        playTrack(trackId, trackDuration, parentFeed, trackName, trackOwner)
    });


    var playTrack = function(trackId, trackDuration, parentFeed, trackName, trackOwner) {
        color = parentFeed.find('.header').css("background-color")
        track_title.text(trackName)
        track_owner.text(trackOwner)
        $('.progressbar_progress, .progressbar_buffer').css("background-color", color)
        $('.play_btn i').css("color", color)
        streamUrl = "https://api.soundcloud.com/tracks/" + trackId + "/stream?client_id=" + clientId
        audioPlayer.src = streamUrl
        audioPlayer.play()
    }







});




/*
var clientId = '3704e007c260afa92227c9006034af90';


$(function() {


    var track_template = $('#track_template').html();
    var column_template = $('#column_template').html();

    SC.initialize({
        client_id: clientId,
    });

    var createcolumn = function(user_data) {

        var column = Mustache.render(column_template, columnData);
        $(".column_scroll").append(column);

        console.log("column");
        return SC.get('/users/' + data.id + '/favorites');

    };

    var appendTracks = function(tracks) {
        console.log(tracks);
        var column = $('.column').last().find(".tracks")
        
        $.each(tracks, function( i, track ){
            var track = Mustache.render(track_template, track);
            column.append(track);
        });

        
    };

    var resolveUser = function(username) {
        var userUrl = 'http://soundcloud.com/' + username
        SC.resolve(userUrl).then(createcolumn).then(appendTracks);
    };


    $.each([ "tjorvens", "paulahalldin", "viktor-rohlin", "kornel", "platform", "lukiss", "mountliberationunlimited" ], function( index, value ) {
      resolveUser(value)
    });

    $('#resolve').click(function() {
        if ($('#username').val().length > 0) {
            var val = $('#username').val()
            resolveUser(val)
        }
    });

    $('#resolve').keypress(function (e) {
      if (e.which == 13) {
       if ($('#username').val().length > 0) {
            var val = $('#username').val()
            resolveUser(val)
        }
        return false;
      }
    });

});*/