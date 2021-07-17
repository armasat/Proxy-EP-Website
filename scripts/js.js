// GLOBALS
var VOLUM_LEVEL;
var PAGE_NAME;
var CURRENT_SONG;
var AUDIO_OBJ;
var HIDDEN_AUDIO_OBJ;
var SONGS_OBJ;
var COMMANDS_OBJ;
var DEFAULT_PASSWORD = "unity";
var COMMAND_HISTORY = [];

document.addEventListener("keyup", event => {
  if (event.isComposing || event.keyCode === 229) {
    return;
  }
    if(event.keyCode==38){
      if(PAGE_NAME=='terminal'){
        if(COMMAND_HISTORY.length>0){
          document.getElementById('commandLine').value = COMMAND_HISTORY[COMMAND_HISTORY.length-1];
        }
      }
    }
    if (event.keyCode==18){
      if(PAGE_NAME!='terminal'){
        navigateToTerminal();
      }
    }
});
function submitCommand(str){
let command_raw = String(str).trim().toLowerCase();
// for multiple commands
// check if command contains ; character
if(command_raw.includes(";")){
  // split string with ; delimiter and process commands sequentially
  let commandsArr = command_raw.split(";");
  for (var i = 0; i < commandsArr.length; i++) {
    // process command
    if(commandsArr[i]!=''){
      submitCommand(commandsArr[i]);
    }
  }
  return;
}
// for cases where there is only one command
let command     = escapeHtml(command_raw);

  if(command.length>100){
    alert('Command too long, please behave yourself');
    processCommand('clr');
    focusOnCommandLine();
    return;
  }
  if(command!=''){
      logCommand(command);
      processCommand(command);
      historyCommand(command);
      scrollLogWindow('content');
  }else{
    return;
  }
}
function formatTime(seconds){
  return new Date(parseInt(seconds) * 1000).toISOString().substr(11, 8);
}
function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
function scrollLogWindow(ID){
  var objDiv = document.getElementById(ID);
  objDiv.scrollTop = objDiv.scrollHeight;
}
function logCommand(str){
  // a-> str [str]
  let commandSpan = document.getElementById('logSpan');
  let logHistory = commandSpan.innerHTML;
  // append command to the span
  commandSpan.innerHTML = logHistory+'</br>'+'&gt; '+str;
  // focus on input
  focusOnCommandLine();
}
function historyCommand(str){
  COMMAND_HISTORY.push(str);
}
function getCommandHistory(){
  let o = '<u>COMMAND HISTORY</u>:<br>';
  for (var i = 0; i < COMMAND_HISTORY.length; i++) {
    o += '('+i+') '+COMMAND_HISTORY[i]+'<br>';
  }
  if(COMMAND_HISTORY.length<1){
    o += 'No Commands Found...<br>';
  }
  return o;
}
function processCommand(str){
  // a-> str [str]
  if(PAGE_NAME=='terminal'){
    playSound('enterCommand','quiet');
    // process command and send results to log
    // test if str is array of arg
    var arrayStr = str.split(" ");
    let funcFlag = 0;
        if(arrayStr.length > 1){
            funcFlag = 1;
        }
    let logSpan = document.getElementById('logSpan');

    // COMMANDS WITH ARGUMENTS
    if(funcFlag==1){
      let command = arrayStr[0];
      if(command=="add"){
        let output = 0;
        for(var i = 0; i < arrayStr.length; i++){
          if(i>0){
              output = output + parseInt(arrayStr[i]);
          }
        }
        // log this output
        logCommand('Output(add): '+output+'<br>');
      }else if(command=="sub"){
        let output = 0;
        for(var i = 0; i < arrayStr.length; i++){
          if(i>1){
              output = output - parseInt(arrayStr[i]);
          }else{
            output = parseInt(arrayStr[i]);
          }
        }
        // log this output
        logCommand('Output(sub): '+output+'<br>');
      }else if (command=="man") {
        let arg1 = arrayStr[1];
          if(arg1=="add"){
            logCommand('Small function to add arguments sequentially<br>Usage: add 5 5<br>Will result in an output of 10<br>');
          }else if (arg1=="locations") {
            logCommand('List locations in the system<br>');
          }else if (arg1=="sub") {
            logCommand('Small function to subtract arguments sequentially<br>Usage: sub 10 2 2<br>Will result in an output of 6, which is equal to 10 subtract 2 subtract 2<br>');
          }else if (arg1=="navigate") {
            logCommand('Small function to navigate around the system pages<br>Usage: navigate entry<br>Will result in navigating to the entry page<br>');
          }else if (arg1=="exit") {
            logCommand('Small function for closing the terminal window<br>Usage: exit<br>Will result in closing the page, if multiple tabs are open.<br>');
          }else if (arg1=="tracks") {
            logCommand('Small function for displaying the tracklist on the system<br>Usage: tracks<br>Will result of the list of tracks in the system, with the current song noted.<br>');
          }else if (arg1=="next") {
            logCommand('Will play the next track in the tracklist<br>Usage: next<br>Plays the next track in the playlist, loops if at the end.<br>');
          }else if (arg1=="play") {
            logCommand('Will play the currently paused track<br>Usage: play<br>If a track is already playing, it will notify you of the currently playing track.<br>');
          }else if (arg1=="pause") {
            logCommand('Will pause the currently playing track<br>Usage: pause<br>If a track is already paused, it will notify you of the currently paused track.<br>');
          }else if (arg1=="currtrack") {
            logCommand('Will show the currently selected track on the tracklist<br>Usage: currtrack<br>');
          }else if (arg1=="history") {
            logCommand('Displays a list of recent commands<br>Usage: history<br>');
          }else if (arg1=="help") {
            logCommand('Displays the introduction help message<br>Usage: help<br>');
          }else if (arg1=="clear") {
            logCommand('clears the screen<br>Usage: clear<br>');
          }else if (arg1=="man") {
            logCommand('Small function to describe system commands<br>Usage: man `command`<br>Will result in a description of the `command`'+'<br>');
          }else if (arg1=="reload") {
            logCommand('Will reload the page<br>Usage: reload<br>');
          }else if (arg1=="currtime") {
            logCommand('Will give the current track\'s time elapsed in hh:mm:ss format<br>Usage: currtime<br>');
          }else if (arg1=="goback") {
            logCommand('Will bring you back one page in your browser history<br>Usage: goback<br>');
          }else if (arg1=="proxy") {
            logCommand('Will navigate the user to the Proxy EP page<br>Usage: proxy<br>');
          }
      }else if (command=="navigate") {
        let arg1 = arrayStr[1];
          if(arg1=="hub"){
            window.location.href="/hubWorld.html";
          }else if (arg1=="entry") {
            window.location.href="/index.html";
          }else if (arg1=="lounge") {
            window.location.href="/lounge.html";
          }else if (arg1=="stream") {
            window.location.href="/stream.html";
          }else if (arg1=="music") {
            window.location.href="/music.html";
          }else if (arg1=="proxy") {
            window.location.href="/sdsduhf98w822heuih2i287efewef.html";
          }else{
            logCommand('System Location Does Not Exist');
          }
      }else if (command=="playtrack") {
          let arg1 = arrayStr[1];
          // find song and play
          logCommand(findTrack(arg1));
      }else if (command=="eval") {
        let arg1 = arrayStr[1];
        try {
          // ...for eval() but decided against it
        } catch (e) {
            console.log(e);
        } finally {
            console.log('Be careful with the eval command!');
        }
      }
    }else{
      // COMMANDS WITH NO ARGUMENT
      if (str=="exit") {
        if(confirm('Are you sure you want to exit?')){
          alert('Goodbye!');
          window.close();
          logCommand('Could not close terminal as this is the only window open...');
          playSound('error','999');
        }else{
          alert('I knew you loved it here :)');
          return;
        }
      }else if (str=="locations") {
        let locationString = '<u>LOCATIONS:</u>';
            locationString += '<br><i>entry   - entry page for the site</i>';
            locationString += '<br><i>proxy   - listen to the Proxy EP</i>';
            locationString += '<br><i>hub     - welcome message with access to terminal cube</i>';
            locationString += '<br><i>stream  - watch ausa streams</i>';
            locationString += '<br><i>lounge  - chill in the lounge</i>';
            locationString += '<br><i>music   - listen to ausa music</i>';
        logCommand(locationString+'<br>');
      }else if (str=="proxy") {
        // navigate to proxy ep page
        window.location.href="/sdsduhf98w822heuih2i287efewef.html";
      }else if (str=="help") {
        let helpString = 'Try commands like: <br>`commands` || `man` || `navigate` || `exit` || `add` || `sub` || `clear`<br>I am adding new commands over time';
        logCommand(helpString+'<br>');
      }else if (str=="clear" || str=="clr" || str=="cl") {
        logSpan.innerHTML = '';
      }else if (str=="man") {
        logCommand('Must provide second argument<br>Usage: man `command`<br>Will result in a description of the `command`'+'<br>');
      }else if (str=="currtrack" || str=="currentsong") {
        logCommand('Current Song: '+getCurrentSong()+'<br>');
      }else if (str=="pause") {
        if(pauseSong()==-1){
          logCommand("Song Already Paused: "+CURRENT_SONG+"<br>");
          playSound('error','quiet');
        }else{
          logCommand("Song Paused: "+CURRENT_SONG+"<br>");
        }
      }else if(str=="play"){
        if(playSong()==-1){
          logCommand("Song Already Playing: "+CURRENT_SONG+"<br>");
          playSound('error','quiet');
        }else{
          logCommand("Song Played: "+CURRENT_SONG+"<br>");
        }
      }else if (str=="tracks") {
        logCommand(getTrackList());
      }else if (str=="commands") {
        logCommand(getCommandList());
      }else if (str=="history") {
        logCommand(getCommandHistory());
      }else if (str=="next") {
        let next_song = getNextSong();
          changeSourceSong(next_song);
          playSong();
          if(PAGE_NAME=="terminal"){
            logCommand('Now Playing: '+getCurrentSong()+'<br>');
          }
      }else if (str=="currtime") {
        let currTimeFormat  = formatTime(getCurrentSongTime());
        let totalTimeFormat = formatTime(getTotalSongTime());
          logCommand('Now Playing: '+getCurrentSong()+'<br>Current Time-> '+currTimeFormat+' | '+totalTimeFormat+'<br>');
      }else if (str=="reload") {
        location.reload();
        focusOnCommandLine();
      }else if (str=="goback") {
        history.back();
      }else if (str=="quiet" || str=="quieter") {
        changeVolume('quieter');
        logCommand('Volume Lowered<br>Volume:'+roundToTwo(parseFloat(AUDIO_OBJ.volume)*100)+'%<br>');
      }else if (str=="louder" || str=="loud") {
        changeVolume('louder');
        logCommand('Volume Raised<br>Volume: '+roundToTwo(parseFloat(AUDIO_OBJ.volume)*100)+'%<br>');
      }else if (str=="mute") {
        changeVolume('mute');
        logCommand('Toggle Mute<br>Volume: '+roundToTwo(parseFloat(AUDIO_OBJ.volume)*100)+'%<br>');
      }else if (str=="volume") {
        logCommand('Current Volume: '+roundToTwo(parseFloat(AUDIO_OBJ.volume)*100)+'%<br>');
      }
    }
  }
}
document.onkeydown = keyDownEvent;
document.onkeyup = keyUpEvent;

var isCtrl = false;

function keyDownEvent() {
    var keyid = event.keyCode;

    if(keyid == 17) {
        isCtrl = true;
    }
}

function keyUpEvent() {
    var keyid = event.keyCode;

    if(keyid == 17) {
        isCtrl = false;
    }

    if(keyid == 76 && isCtrl == true) {
      processCommand("clr");
    }
}
function navigateToTerminal(){
  window.location.href = "/terminal.html";
}

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
function fadeToWhite(){
  let element = document.getElementById('content');
  element.style.filter = "opacity(0)";
}
function playSound(a,b){
  // a-> sound type
  // b-> exit sound flag
  let filename = "/assets/sounds/"+a+".wav";
  let audio = new Audio(filename);
  if(b=="quiet"){
    audio.volume = 0.2;
  }
  audio.play();
  if(b=="exit"){
    // fade the content
      fadeToWhite();
    // leave page in 5 seconds
      setTimeout(function(){ leaveButton(); }, 3000);

  }
}
function leaveButton(){
  // change location to hub world
  window.location.href = '/hubWorld.html';
}
var cube = document.querySelector('.cube');
var radioGroup = document.querySelector('.radio-group');
var currentClass = '';

let assoSides = [
  "right",
  "back",
  "left",
  "top",
  "bottom",
  "front"
];
let assoCount = 0;
function cycle(){
  let orientation = '';
  var showClass;
    if(assoCount==6){
      assoCount=0;
    }
    for (var i = 0; i < assoSides.length; i++) {
      if(i==assoCount){
        orientation = assoSides[i]
        showClass   = 'show-' + orientation;
        if ( currentClass ) {
          cube.classList.remove( currentClass );
        }
        cube.classList.add( showClass );
        currentClass = showClass;
      }
    }
  assoCount = assoCount + 1;
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
let welcome_message = "Welcome to my website! I am going to be updating it more and more over the next couple of weeks, so be sure to check back over time to view the progress. I have a lot of cool ideas for this.But for now enjoy this unreleased ambient version of my song Plantae Type: Lunar Tear!";
let messageIndex = 0;
function addText(){
  let messageDiv = document.getElementById('welcome_message');
    if(messageIndex>welcome_message.length){
      // do nothing
    }else{
      for (var i = 0; i < welcome_message.length; i++) {
        if(messageIndex==i){
          messageDiv.innerHTML += welcome_message[i];
        }
      }
      messageIndex = messageIndex + 1;
      playSound('typing','quiet');
    }
}
function focusOnCommandLine(){
  document.getElementById('commandLine').value = '';
  document.getElementById('commandLine').focus();
  document.getElementById('commandLine').click();
}
function showMessage(){
  if(messageIndex<=welcome_message.length){
    setInterval(function(){ addText(); },25);
  }
}
function spin(){
  setInterval(function(){ cycle(); }, getRandomArbitrary(10,30)*100);
  console.log(getRandomArbitrary(10,30)*100);
}

function getCommandList(){
  let o = '<u>COMMANDS</u>:<br><small>you can view more about these by using `man`, followed by the command name: <br>Ex. man navigate</small><br>';
  let command_name = '';
  for (var i = 0; i < COMMANDS_OBJ.length; i++) {
    command_name = COMMANDS_OBJ[i];
      o = o+'('+i+') '+command_name+'<br>';
  }
    if(!(COMMANDS_OBJ.length>0)){
      o = -1;
    }
  return o;
}
function getCurrentSongTime(){
  return AUDIO_OBJ.currentTime;
}
function getTotalSongTime(){
  return AUDIO_OBJ.duration;
}
function getTrackList(){
  let o = '<u>TRACKLIST</u>:<br>';
  let track_name = '';
  for (var i = 0; i < SONGS_OBJ.length; i++) {
    track_name = SONGS_OBJ[i][0];
    if(track_name==CURRENT_SONG){
      o = o+'('+i+') (<b>currently playing</b>) '+track_name+'<br>';
    }else{
      o = o+'('+i+') '+track_name+'<br>';
    }
  }
    if(!(SONGS_OBJ.length>0)){
      o = -1;
    }
  return o;
}
function getNextSong(){
  let track_name  = '';
  let next_song   = [];
  let o           = -1;
  for (var i = 0; i < SONGS_OBJ.length; i++) {
    track_name = SONGS_OBJ[i][0];
    if(track_name==CURRENT_SONG){
        if(i==SONGS_OBJ.length-1){
          // last song loop
          next_song = SONGS_OBJ[0];
        }else{
          // next index
          next_song = SONGS_OBJ[i+1];
        }
    }
  }
  return next_song;
}
function changeVolume(a){
  // a-> type [str]->quiet,loud
  let currentVolume = parseFloat(AUDIO_OBJ.volume);
  let newVolume = parseFloat('0.0');
  if(a=='quieter'){
    newVolume = currentVolume - (0.25);
      if(newVolume<0){
        newVolume = 0;
      }
    AUDIO_OBJ.volume = parseFloat(newVolume);
    VOLUM_LEVEL = AUDIO_OBJ.volume;
  }else if (a=='louder') {
    newVolume = currentVolume + (0.25);
      if(newVolume>=1){
        newVolume = 1;
      }
      if(currentVolume==0){
        newVolume = '0.25';
      }
    AUDIO_OBJ.volume = parseFloat(newVolume);
    VOLUM_LEVEL = AUDIO_OBJ.volume;
  }else if (a=='mute') {
    if(AUDIO_OBJ.volume==0){
      AUDIO_OBJ.volume=VOLUM_LEVEL;
    }else{
      AUDIO_OBJ.volume = parseFloat('0.0');
    }
  }
}
function findTrack(index){
  let o='';
  let track='';
  for (var i = 0; i < SONGS_OBJ.length; i++) {
    if(i==index){
      track  = SONGS_OBJ[i];
    }
  }
  if(track!=''){
    changeSourceSong(track);
    playSong();
    o += 'Now Playing: '+getCurrentSong()+'<br>';
  }else{
    o += 'Could Not Find Track(remember to search by index number 0-n)<br>';
  }
  return o;
}
function changeSourceSong(next_song){
  // change hidden audio element value
  HIDDEN_AUDIO_OBJ.value = next_song[0];
  // change source
  AUDIO_OBJ.pause();
  AUDIO_OBJ.src = '/assets/sounds/'+next_song[1]+'.wav';
  setCurrentSong();
}
function pauseSong(){
  let o = 1;
    if(AUDIO_OBJ.duration >= 0 && AUDIO_OBJ.paused){
      o = -1
    }else{
      AUDIO_OBJ.pause();
    }
    return o;
}
function playSong(){
  let o = 1;
    if(AUDIO_OBJ.duration >= 0 && !AUDIO_OBJ.paused){
      o = -1;
    }else{
      AUDIO_OBJ.play();
    }
    return o;
}
function isPlaying(audio) { return
  !audio.paused;
}
function getCurrentSong(){
  return CURRENT_SONG;
}
function setCurrentSong(){
  CURRENT_SONG = HIDDEN_AUDIO_OBJ.value;
}
function setAudioVariables(){
  SONGS_OBJ         = [
    ['Blessed - Ausa','ambient'],
    ['Plantae Type: Lunar Tear(Ambient Edit) - Ausa','longAmbientHub'],
    ['Do you wish to proceed - Doxy','tired'],
    ['sleep - Doxy','sleep'],
    ['contemptible 打撃 - Doxy','contemptible 打撃']
  ];
  AUDIO_OBJ         = document.getElementById('main_song');
  VOLUM_LEVEL       = AUDIO_OBJ.volume;
  HIDDEN_AUDIO_OBJ  = document.getElementById('main_song_name');
  CURRENT_SONG      = HIDDEN_AUDIO_OBJ.value;
  COMMANDS_OBJ      = ['tracks','next','pause','play','playtrack','quieter','louder','mute','volume','currtime','currtrack','navigate','exit','man','add','sub','history','help','clear','reload','goback','locations','proxy'];
  // set handler function for ended tracks
  AUDIO_OBJ.onended = function() {
    processCommand('next');
    scrollLogWindow('content');
  };
}
function secureSwitch(){
  var password_entry = prompt("Please Enter The Password");
  if(password_entry!=DEFAULT_PASSWORD){
    alert('Incorrect password, page reloading...');
    location.reload();
  }else{
    //continue
    alert('Welcome, you may access the unity proxy application!');
    location.replace("sdsduhf98w822heuih2i287efewef.html");
  }
}
function setPageName(page){
  PAGE_NAME = page;
}
function onLoad(a){
  setPageName(a);
  setAudioVariables();
  if(a=="hubWorld"){
    spin();
    showMessage();
  }else if (a=="terminal") {
    focusOnCommandLine();
    scrollLogWindow('content');
  }else if (a=="entry") {
  }else if (a=="proxy") {
    setTimeout(function(){ secureSwitch(); },3000);
  }
}
