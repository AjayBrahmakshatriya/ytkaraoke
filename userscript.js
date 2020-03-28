// ==UserScript==
// @name         YouTube Sync player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @grant       GM_xmlhttpRequest
// @connect     kael.csail.mit.edu
// ==/UserScript==

(function() {
    'use strict';
    function gobuttonhandler() {
        var time_to_play = parseInt(document.getElementById("time_to_play").value);
        console.log(time_to_play);
        var interval = setInterval(function(){check_interval();}, 10);
        function check_interval() {
            var time_now = new Date().getTime();
            if (time_now >= time_to_play) {
                clearInterval(interval);
                var myPlayer = document.getElementsByClassName('video-stream html5-main-video')[0];
                myPlayer.play();
                console.log("Started");
                document.getElementById("displaydiv").innerHTML = "";
            } else {
                document.getElementById("displaydiv").innerHTML = "Starting in ... " + Math.ceil((time_to_play - time_now)/1000);
            }
        }
    }
    window.addEventListener('load', function() {
        var spacer = document.createTextNode("    ");
        var inputfield = document.createElement("input");
        var gobutton = document.createElement("button");
        var displaydiv = document.createElement("div");
        gobutton.addEventListener('click', gobuttonhandler);
        gobutton.innerHTML = "GO!";
        gobutton.id="gobutton";
        inputfield.id = "time_to_play";
        displaydiv.id = "displaydiv";
        inputfield.style.visibility="hidden";
        gobutton.style.visibility="hidden";
        document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].appendChild(spacer);
        document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].appendChild(inputfield);
        document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].appendChild(gobutton);
        document.getElementsByClassName("ytd-video-primary-info-renderer title")[0].appendChild(displaydiv);
        var myPlayer = document.getElementsByClassName('video-stream html5-main-video')[0];
        myPlayer.pause();
        myPlayer.currentTime=0;

        GM_xmlhttpRequest ( {
            method: "GET",
            url: "http://kael.csail.mit.edu:8244/fetch",
            onload: function (response) {
                console.log (response.responseText);
                document.getElementById("time_to_play").value = response.responseText;
                var time_to_play = parseInt(response.responseText);
                if (time_to_play < new Date().getTime()) {
                    document.getElementById("displaydiv").innerHTML = "<span style=\"color:red\">Time to play is too old, ask host to reset!</span>";
                } else {
                    document.getElementById("gobutton").click();
                }
            }
        } );
    }, false);

})();
