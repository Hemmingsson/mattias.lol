// settings
var clientId = '3704e007c260afa92227c9006034af90';
var accounts = ["moody-official-1", "svensk-rap", "clubberia", "rinsefm", "platform", "studiobarnhus", "timsweeney", "mrtophat", "babastiltz", "tjorvens", "paulahalldin", "viktor-rohlin", "kornel"]
var audioPlayer = new Audio();
//audioPlayer.volume = 0

$(function() {

    SC.initialize({
        client_id: clientId,
    });

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

    var track_template = $('#track_template').html();
    var column_template = $('#column_template').html();

    var fetchTracks = function(data) {
        var column_element = $(data[0])
        var trackCount = data[1]
        var userId = column_element.attr('data-userid');

        var tracksEndpoint = "/tracks"

        if (trackCount < 3) {
            tracksEndpoint = "/favorites"
        }

        SC.get('/users/' + userId + tracksEndpoint).then(function(tracks) {
            $.each(tracks, function(i, track) {

                track.timeAgo = $.timeago(track.created_at);
                track.durationHuman = formatTime(millisecondsToHuman(track.duration), true)
                //track.artwork_url =    track.artwork_url.replace('large.jpg', 't300x300.jpg')
                var track = Mustache.render(track_template, track);
                $(column_element).find(".tracks").append(track);

            });
            eachAccount()
        });


    };

    var renderColumn = function(userData) {
        userData.backgroundColor = colorByHashCode(userData.username)
        var columnElement = $(Mustache.render(column_template, userData));
        //$(".column_scroll").append(columnElement)
        $(columnElement).insertBefore(".help_card");
        return [$(columnElement), userData.track_count]
    };

    var userFeed = function(username) {
        console.time("time");
        console.log("Creating User Feed for: " + username);
        var userUrl = 'http://soundcloud.com/' + username
        SC.resolve(userUrl)
            .then(renderColumn)
            .then(fetchTracks)
    };

    var colorByHashCode = function(value) {
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

    });
    var me = ["tjorvens"]
    var eachAccount = function() {
        if (accounts[0]) {
            new userFeed(accounts[0])
            accounts.splice(0, 1);
        }
    }


    accounts = shuffleArray(accounts)
    eachAccount()


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
    var player_wrap = $(".player_wrap")
    
    var progressbar_seek = $(".progressbar_seek")
    var progressbar = $(".progressbar")
    var time_tooltip = $("#time_tooltip")
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



    var test = function(loading) {

        console.log("sdsdssd");
    }

    
    
    //$(audioPlayer).bind('playing', playerLoading(false));

    var getPercentProg = function() {
        var endBuf = audioPlayer.buffered.end(0);
        var progressbar_buffer_width = parseInt(((endBuf / audioPlayer.duration) * 100));
        progressbar_buffer.width(progressbar_buffer_width + "%")
        
    }

    audioPlayer.addEventListener('progress', getPercentProg, false);


    var old_time = 0
    setInterval(function(){
        var current_time = parseInt(audioPlayer.currentTime)
        if(old_time === current_time && audioPlayer.src && !audioPlayer.paused){
            time_elapsed.addClass('flash')
            time_tooltip.addClass('flash')
            

        } else{
            old_time = current_time
            time_elapsed.removeClass('flash')
            time_tooltip.removeClass('flash')
            
        }
    }, 1000);



    var seek_element = $(".progressbar_seek")
    var seekOffset = seek_element.position()
    var mouseTime = function(e) {
        var relX = e.pageX - seekOffset.left
        return convert_range(relX, [0, seek_element.width()], [0, audioPlayer.duration])
    }

    seek_element.mousemove(function(e){
        if(audioPlayer.duration){
        var ra = mouseTime(e)
        var human = millisecondsToHuman(ra * 1000)
        $('#time_tooltip').css({
           left:  e.pageX - seekOffset.left
        });
        $('#time_tooltip').text(human)
        }
        
    }).click(function(e){
        
        var ra = mouseTime(e)
        audioPlayer.currentTime = ra 
    
        
    });
    progressbar_seek.hover(function(){
        if(audioPlayer.duration){player_wrap.addClass('seek_active')}
        }, function(){
        if(audioPlayer.duration){player_wrap.removeClass('seek_active')}
    });

    $(document).on('click', '.play_btn', function() {
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
        $(".play_btn").removeClass('is_paused')
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