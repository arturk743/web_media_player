var video = document.getElementById('video');
var hls = new Hls();

function init() {
  loadVideo('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
  window.addEventListener('load', loadQualityLevels);
  displayInformation();

  //when user hits enter, video is loaded from given url
  document.getElementsByName("url")[0]
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var url = document.getElementsByName("url")[0];
        changeVideo(url.value); 
      }
});
}

function displayInformation(level){
  console.log(hls.currentLevel);

  if(hls.currentLevel !== -1){
    var hls_information;

    if(typeof(level)==='undefined'){
      hls_information = hls.levels[hls.currentLevel];
    } else {
      hls_information = hls.levels[level];
    }

    console.log(hls.levels);
    console.log(hls.currentLevel);

    var bitrate = document.getElementById("bitrate");
    var height = document.getElementById("height");
    var width = document.getElementById("width");
    var video_coded = document.getElementById("video_coded");
    var audio_codec = document.getElementById("audio_codec");

    bitrate.innerText = "Bitrate: " + hls_information.bitrate;
    height.innerText = "Height: " + hls_information.height;
    width.innerText = "Width: " + hls_information.width;
    video_coded.innerText = "Video codes: " + hls_information.videoCodec;
    audio_codec.innerText = "Audio codec: " + hls_information.audioCodec;

  } else if(hls.currentLevel === -1) {
    sleep(1000).then(() => {
      displayInformation();
    });
  }

}

function loadVideo(videoSrc){
  if (Hls.isSupported()) {
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      // video.play();
    });
  }else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
    video.addEventListener('loadedmetadata', function() {
      video.play();
    });
  }
}


function changeVideo(source){
  hls = new Hls();
  console.log(hls.levels);
  loadVideo(source);
  loadQualityLevels();
  displayInformation();  
}

function loadQualityLevels(){
  if(hls.levels === undefined){
    sleep(500).then(() => {
    loadQualityLevels();
    });
  }else{
    var dropdown = document.getElementsByClassName("dropdown-content")[1];
    removeAllChilden(dropdown);
    var hls_list = hls.levels;
    console.log(hls_list);
    hls.currentLevel=0;
    console.log(hls.currentLevel);

    for (let i =0; i < hls_list.length; i++){
      console.log(hls_list[i].url)
      var bitrate = hls_list[i].bitrate;
      var name = hls_list[i].name;
      var videoCodec = hls_list[i].videoCodec;
      var audioCodec = hls_list[i].audioCodec;
      var resolution = hls_list[i].resolution;
      var a = document.createElement('a');

      if (hls_list[i].name === undefined){

        try{
            if (hls_list[i].attrs.RESOLUTION === undefined){
              a.innerText = "Auto";
            } else {
              a.innerText = hls_list[i].attrs.RESOLUTION;
            }
        }catch {
          a.innerText = "Auto";
        }
        
      }else {
        a.innerText = hls_list[i].name+'p';
      }

      a.addEventListener('click', function(){
        changeQuality(i);
      });
      dropdown.appendChild(a);

      if (hls.currentLevel === i){
        displayInformation(i);
      }
    }
  }
}

function removeAllChilden(element){
  element.querySelectorAll('*').forEach(n => n.remove());
}

function changeQuality(level){
  hls.currentLevel=level;
  displayInformation(level);
  console.log("current level "+ level);
}

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


init();