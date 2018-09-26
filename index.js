// use strict; 

// setup BufferLoader

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}
  
  BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
  request.send();
}

  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}

// setup web audio

window.onload = init;
var context;
var bufferLoader;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  bufferLoader = new BufferLoader(
    context,
    [
      './assets/audio/180507_Brodowin_Test_Huegel_5pm45_cut_stereo.ogg', 
      './assets/audio/Agogo Bell.wav',
    ],
    finishedLoading
    );
  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
//   var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
//   source2.buffer = bufferList[1];

  source1.connect(context.destination);
//   source2.connect(context.destination);
  source1.start(0);
//   source2.start(0);
}

function playSound(buffer, volume, time) {
  var starttime = time | 0;
  var palybackVol = volume | 0.5;
  var source = context.createBufferSource();
  source.buffer = buffer;
  // Create a gain node.
  var gainNode = context.createGain();
  // Connect the source to the gain node.
  source.connect(gainNode);
  // Connect the gain node to the destination.
  gainNode.connect(context.destination);
  // Reduce the volume.
  gainNode.gain.value = palybackVol;

  source.connect(context.destination);
  source.start(starttime);
}



function createSource(buffer) {
  var source = context.createBufferSource();
  // Create a gain node.
  var gainNode = context.createGain();
  source.buffer = buffer;
  // Turn on looping.
  source.loop = true;
  // Connect source to gain.
  source.connect(gainNode);
  // Connect gain to destination.
  gainNode.connect(context.destination);

  return {
    source: source,
    gainNode: gainNode
  };
}

// function playHelper(bufferNow, bufferLater) {
//   var playNow = createSource(bufferNow);
//   var source = playNow.source;
//   var gainNode = playNow.gainNode;
//   var duration = bufferNow.duration;
//   var currTime = context.currentTime;
//   // Fade the playNow track in.
//   gainNode.gain.linearRampToValueAtTime(0, currTime);
//   gainNode.gain.linearRampToValueAtTime(1, currTime + ctx.FADE_TIME);
//   // Play the playNow track.
//   source.start(0);
//   // At the end of the track, fade it out.
//   gainNode.gain.linearRampToValueAtTime(1, currTime + duration-ctx.FADE_TIME);
//   gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
//   // Schedule a recursive track change with the tracks swapped.
//   var recurse = arguments.callee;
//   ctx.timer = setTimeout(function() {
//     recurse(bufferLater, bufferNow);
//   }, (duration - ctx.FADE_TIME) * 1000);
// }



// setup babylon

var canvas = document.getElementById('babylon-canvas');
var container =  document.getElementById('babylon');
container.style.width= `${window.innerWidth}`;
container.style.height= `${window.innerHeight}`;
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
var anchor = new BABYLON.TransformNode("");

camera.wheelDeltaPercentage = 0.01;
// TODO: Zoom limits
camera.attachControl(canvas, true);

var manager = new BABYLON.GUI.GUI3DManager(scene);

var dome = new BABYLON.VideoDome(
  "testdome",
  ["./assets/video/VID_20180821_233000_ok_014_exerpt.mp4"],
  {
    resolution: 32,
    clickToPlay: true,
    loop: true,
    size: 100,
  },
  scene
);

debugger;

var panel = new BABYLON.GUI.SpherePanel();
panel.margin = 5;
panel.radius = 49.9;
// panel.position.z = 1;

manager.addControl(panel);
panel.linkToTransformNode(anchor);

//  add some buttons!
// TODO: How to position?

var addButton = function() {
  var button = new BABYLON.GUI.HolographicButton("orientation");
  panel.addControl(button);
  button.text = "Button #" + panel.children.length;
  button.height = 200;

  buttonScaler = 5;
  button.scaling.x = buttonScaler;
  button.scaling.y = buttonScaler;
  button.scaling.z = buttonScaler;

  button.onPointerClickObservable.add(() => console.log("Clicked!"))
  button.onPointerEnterObservable.add(() => console.log("Hovered!"))
  // TODO: doesnt work as expected, out trigges on nex button in
  button.onPointerOutObservable.add(() => console.log("Left!")) 
  // debugger;
}

panel.blockLayout = true;
for (var index = 0; index < 10; index++) {
  addButton();
}
panel.blockLayout = false;

engine.runRenderLoop(function () {
scene.render();
});