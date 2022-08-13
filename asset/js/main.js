class DrumKit {
    constructor() {
      this.pads = document.querySelectorAll(".pad");
      this.playBtn = document.querySelector(".play");
      this.currentKick = "./sound/kick-classic.wav";
      this.currentSnare = "./sound/snare-acoustic01.wav";
      this.currentHihat = "./sound/hihat.acoustic01.wav";
      this.kickAudio = document.querySelector(".kick-sound");
      this.snareAudio = document.querySelector(".snare-sound");
      this.hihatAudio = document.querySelector(".hihat-sound");
      this.hihatAudio2 = document.querySelector(".hihat-sound-2");
      this.clapAudio = document.querySelector(".clap-sound");
      this.index = 0;
      this.bpm = 150;
      this.isPlaying = null;
      this.selects = document.querySelectorAll("select");
      this.muteBtns = document.querySelectorAll(".mute");
      this.tempoSlider = document.querySelector(".tempo-slider");
    }
    activePad() {
      this.classList.toggle("active");
    }
    repeat() {
      let step = this.index % 8;
      const activeBars = document.querySelectorAll(`.b${step}`);
      //Loop over the pads
      activeBars.forEach(bar => {
        // bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
        if (bar.classList.contains("active")) {
          if (bar.classList.contains("kick-pad")) {
            this.kickAudio.currentTime = 0;
            this.kickAudio.play();
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
          }
          if (bar.classList.contains("snare-pad")) {
            this.snareAudio.currentTime = 0;
            this.snareAudio.play();
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
          }
          if (bar.classList.contains("hihat-pad")) {
            this.hihatAudio.currentTime = 0;
            this.hihatAudio.play();
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
          }
          if (bar.classList.contains("hihat-pad-2")) {
            this.hihatAudio2.currentTime = 0;
            this.hihatAudio2.play();
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
          }
          if (bar.classList.contains("clap-pad")) {
            this.clapAudio.currentTime = 0;
            this.clapAudio.play();
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
          }
        }
      });
      this.index++;
    }
    start() {
      const interval = (60 / this.bpm) * 1000;
      //Check if it's playing
  
      if (this.isPlaying) {
        //Clear the interval
        clearInterval(this.isPlaying);
        console.log(this.isPlaying);
        this.isPlaying = null;
      } else {
        this.isPlaying = setInterval(() => {
          this.repeat();
        }, interval);
      }
    }
    updateBtn() {
      //NULL
  
      if (!this.isPlaying) {
        this.playBtn.innerText = "Stop";
        this.playBtn.classList.add("active");
      } else {
        this.playBtn.innerText = "Play";
        this.playBtn.classList.remove("active");
      }
    }
    changeSound(e) {
      const selectionName = e.target.name;
      const selectionValue = e.target.value;
      switch (selectionName) {
        case "kick-select":
          this.kickAudio.src = selectionValue;
          break;
        case "snare-select":
          this.snareAudio.src = selectionValue;
          break;
        case "hihat-select":
          this.hihatAudio.src = selectionValue;
          break;
        case "hihat-select-2":
          this.hihatAudio.src = selectionValue;
          break;
      }
    }
    mute(e) {
      const muteIndex = e.target.getAttribute("data-track");
      e.target.classList.toggle("active");
      if (e.target.classList.contains("active")) {
        switch (muteIndex) {
          case "0":
            this.kickAudio.volume = 0;
            break;
          case "1":
            this.snareAudio.volume = 0;
            break;
          case "2":
            this.hihatAudio.volume = 0;
            break;
        }
      } else {
        switch (muteIndex) {
          case "0":
            this.kickAudio.volume = 1;
            break;
          case "1":
            this.snareAudio.volume = 1;
            break;
          case "2":
            this.hihatAudio.volume = 1;
            break;
        }
      }
    }
    changeTempo(e) {
      const tempoText = document.querySelector(".tempo-nr");
  
      tempoText.innerText = e.target.value;
    }
    updateTempo(e) {
      this.bpm = e.target.value;
      clearInterval(this.isPlaying);
      this.isPlaying = null;
      const playBtn = document.querySelector(".play");
      if (playBtn.classList.contains("active")) {
        this.start();
      }
    }
  }
  
  const drumKit = new DrumKit();
  
  //Event Listeners
  
  drumKit.pads.forEach(pad => {
    pad.addEventListener("click", drumKit.activePad);
    pad.addEventListener("animationend", function() {
      this.style.animation = "";
    });
  });
  
  drumKit.playBtn.addEventListener("click", function() {
    drumKit.updateBtn();
    drumKit.start();
  });
  
  drumKit.selects.forEach(select => {
    select.addEventListener("change", function(e) {
      drumKit.changeSound(e);
    });
  });
  drumKit.muteBtns.forEach(btn => {
    btn.addEventListener("click", function(e) {
      drumKit.mute(e);
    });
  });
  
  drumKit.tempoSlider.addEventListener("input", function(e) {
    drumKit.changeTempo(e);
  });
  drumKit.tempoSlider.addEventListener("change", function(e) {
    drumKit.updateTempo(e);
  });
  

  function log(fmt,args) {
    var text= this.sprintf.apply(this,arguments);
    console.log(text)
  }

  function loadScript(name,path,cb) {
    var node= document.createElement('SCRIPT');
    node.type= 'text/javascript';
    node.src= path;
    var head= document.getElementsByTagName('HEAD');
    if(head[0]!=null)
      head[0].appendChild(node);
    if(cb!=null) {
      node.onreadystagechange= cb;
      node.onload= cb;
    }
  }

//(C)2016 nlited systems inc. http://nlited.org
var gAudio= null;       //Audio context
var gAudioSrc= null;    //Audio source
var gNode= null;        //The audio processor node
var gIsLame= false;     //Has lame.min.js been loaded?
var gLame= null;        //The LAME encoder library
var gEncoder= null;     //The MP3 encoder object
var gStrmMp3= [];       //Collection of MP3 buffers
var gIsRecording= false;
var gCfg= {             //Encoder configuration
  chnlCt:         2,    //1=mono, 2=stereo
  bufSz:          4096, //input buffer size (bytes), 16bit signed int.
  sampleRate:     44100,//Input sample rate (samples per second)
  bitRate:        128    //Output bit rate (9-128)
};
var gPcmCt= 0;          //Total input bytes
var gMp3Ct= 0;          //Total output bytes

//Power button
function onPower(btn) {
  if(!gAudio) {
    PowerOn();
  } else {
    PowerOff();
  }
}
async function startCapture() {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({audio: { autoGainControl:false,echoCancellation:false,
                googleAutoGainControl:false,noiseSuppression:false
          } ,video: true});
  } catch(err) {
    console.error("Error: " + err);
  }
  return captureStream;
}

function PowerOn() {
  log("Powering up...");
  var caps= { audio: true };
  try {
    //Browser compatibility
    window.AudioContext= window.AudioContext || window.webkitAudioContext || AudioContext;
    navigator.getUserMedia= navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || MediaDevices.getUserMedia;

    //test

    if(!(gAudio= new window.AudioContext())) {
      log("ERR: Unable to create AudioContext.");
    } else {
      // navigator.getUserMedia(caps,onUserMedia,onFail);
      recorderStream=startCapture()
        recorderStream.then(v =>{
            audio_track = v.getAudioTracks()
    audio_steam = new MediaStream(audio_track)
        onUserMedia(audio_steam)}
    )
    }
  } catch(ex) {
      console.log(ex)
    log("ERR: Unable to find any audio support.");
    gAudio= null;
  }

  function onFail(ex) {
    log("ERR: getUserMedia failed: %s",ex);
  }
}

//Called when audio capture has been created.
function onUserMedia(stream) {
    console.log(stream);
  if(!(gAudioSrc= gAudio.createMediaStreamSource(stream))) {
    log("ERR: Unable to create audio source.");
  } else if(!gIsLame) {
    log("Fetching encoder...");
    loadScript("lame","asset/thirdpart/lame.js",LameCreate);
  } else {
    LameCreate();
  }
}

//Called when the lame library has been loaded.
function LameCreate() {
  gIsLame= true;
  if(!(gEncoder= Mp3Create())) {
    log("ERR: Unable to create MP3 encoder.");
  } else {
    gStrmMp3= [];
    gPcmCt= 0;
    gMp3Ct= 0;
    log("Power ON.");
  }
}

//Create the mp3 encoder object.
function Mp3Create() {
  if(!(gLame= new lamejs())) {
    log("ERR: Unable to create LAME object.");
  } else if(!(gEncoder= new gLame.Mp3Encoder(gCfg.chnlCt,gCfg.sampleRate,gCfg.bitRate))) {
    log("ERR: Unable to create MP3 encoder.");
  } else {
    log("MP3 encoder created.");
  }
  return(gEncoder);
}

//Shut everything down.
function PowerOff() {
  log("Power down...");
  if(gIsRecording) {
    log("ERR: PowerOff: You need to stop recording first.");
  } else {
    gEncoder= null;
    gLame= null;
    gNode= null;
    gAudioSrc= null;
    gAudio= null;
    log("Power OFF.");
  }
}

//Record button: Begin recording.
function onRecord(btn) {
  var creator;
  log("Start recording...");
  if(!gAudio) {
    log("ERR: No Audio source.");
  } else if(!gEncoder) {
    log("ERR: No encoder.");
  } else if(gIsRecording) {
    log("ERR: Already recording.");
  } else {
    //Create the audio capture node.
    if(!gNode) {
      if(!(creator= gAudioSrc.context.createScriptProcessor || gAudioSrc.createJavaScriptNode)) {
        log("ERR: No processor creator?");
      } else if(!(gNode= creator.call(gAudioSrc.context,gCfg.bufSz,gCfg.chnlCt,gCfg.chnlCt))) {
        log("ERR: Unable to create processor node.");
      }
    }
    if(!gNode) {
      log("ERR: onRecord: No processor node.");
    } else {
      //Set callbacks, connect the node between the audio source and destination.
      gNode.onaudioprocess= onAudioProcess;
      gAudioSrc.connect(gNode);
      gNode.connect(gAudioSrc.context.destination);
      gIsRecording= true;
      log("RECORD");
    }
  }
}

//Stop recording.
function onStop(btn) {
  log("Stop recording...");
  if(!gAudio) {
    log("ERR: onStop: No audio.");
  } else if(!gAudioSrc) {
    log("ERR: onStop: No audio source.");
  } else if(!gIsRecording) {
    log("ERR: onStop: Not recording.");
  } else {
    //Disconnect the node
    gNode.onaudioprocess= null;
    gAudioSrc.disconnect(gNode);
    gNode.disconnect();
    gIsRecording= false;
    //Flush the last mp3 buffer.
    var mp3= gEncoder.flush();
    if(mp3.length>0)
      gStrmMp3.push(mp3);
    //Present the mp3 stream on the page.
    showMp3(gStrmMp3);
    log("STOP");
  }
}

//Process a single audio buffer.
//Input is an array of floating-point samples.
function onAudioProcess(e) {
  //Cap output stream size
  if(gMp3Ct > 10*1000*1000)
    return;
  var inBuf= e.inputBuffer;

  var leftsamples= inBuf.getChannelData(0);
  var rightsamples= inBuf.getChannelData(0);
  var leftsampleCt= leftsamples.length;
   var rightsampleCt= rightsamples.length;
  //Convert floating-point to 16bit signed int.
  //This may modify the number of samples.
  var leftsamples16= convertFloatToInt16(leftsamples);
   var rightsamples16= convertFloatToInt16(rightsamples);
  if(leftsamples16.length > 0) {
   gPcmCt+= leftsamples16.length*2;
   gPcmCt+= rightsamples.length*2;

    //Encode PCM to mp3
    var mp3buf= gEncoder.encodeBuffer(leftsamples16,rightsamples16);
    var mp3Ct= mp3buf.length;
    if(mp3Ct>0) {
      //Add buffer to in-memory output stream.
      gStrmMp3.push(mp3buf);
      gMp3Ct+= mp3Ct;
    }
    // status("%d / %d: %2.2f%%",gPcmCt,gMp3Ct,(gMp3Ct*100)/gPcmCt);
  }
}

//Convert floating point to 16bit signed int.
function convertFloatToInt16(inFloat) {
  var sampleCt= inFloat.length;
  var outInt16= new Int16Array(sampleCt);
  for(var n1=0;n1<sampleCt;n1++) {
    //This is where I can apply waveform modifiers.
    var sample16= 0x8000*inFloat[n1];
    //Clamp value to avoid integer overflow, which causes audible pops and clicks.
    sample16= (sample16 < -32767) ? -32767 : (sample16 > 32767) ? 32767 : sample16;
    outInt16[n1]= sample16;
  }
  return(outInt16);
}

//Present the output mp3 stream on the page
//as a download link and content in the audio control.
function showMp3(mp3) {
  //Consolidate the collection of MP3 buffers into a single data Blob.
  var blob= new Blob(gStrmMp3,{type: 'audio/mp3'});
  //Create a URL to the blob.
  var url= window.URL.createObjectURL(blob);
  //Use the blob as the source for link and audio control
//   var audio= document.getElementById('AudioPlayer');
//   var download= document.getElementById('DownloadLink');
//   audio.src= url;
//   download.href= url;
   var download = document.getElementById("DownloadLink");
   download.href = url;
}