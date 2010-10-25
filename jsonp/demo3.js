var auchenberg = function() {

    var handlers = {

        lastfmCompleted: function(data) {

            if (!$('div.lastfm h2')[0]) $('div.lastfm').prepend('<h2>Your favorite artists</h2><ul>');

            for (i = 0; i <= 5; i++) {
                var artistName = data.topartists.artist[i].name;
                getSingleYouTubeVideo(artistName);
                $('div.lastfm ul').append($('<li>').text(artistName));
            };

        },

        youtubeCompleted: function(data) {

            if (!$('div.video h2')[0]) $('div.video').append('<h2>Videos with your favorites</h2>');

            var video = data.feed.entry[0];
            var videoURL = video.link[0].href;
            var thumbnailURL = video.media$group.media$thumbnail[0].url

            $('div.video').append($("<a href=" + videoURL + "><img src=" + thumbnailURL + "></a>"));
        }
    };

    var actions = {

        lastfmButtonClick: function() {

            $('div.video, div.lastfm').empty();
            var username = $('input[type=text]').val();
            var url = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=' + username + '&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&callback=?';
            $.getJSON(url, handlers.lastfmCompleted);
        }
    };

    function getSingleYouTubeVideo(artistName) {

        var url = 'http://gdata.youtube.com/feeds/api/videos?q=' + artistName + '&alt=json-in-script&max-results=5&format=5&callback=?';
        $.getJSON(url, handlers.youtubeCompleted);
    };

    function doTheMagic() {
        $('input[type=submit]').bind('click', actions.lastfmButtonClick);
        $('input[type=text]').bind('keypress', function(e) {
            if (e.keyCode == 13) actions.lastfmButtonClick();
        });
    };

    return {
        initialise: function() {
            doTheMagic();
        }
    };

} ();

$(document).ready(function () {
            
    auchenberg.initialise();

});