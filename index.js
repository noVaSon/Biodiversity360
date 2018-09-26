// use strict; 

// setup babylon
var canvas = document.getElementById('babylon-canvas');
var container =  document.getElementById('babylon');
container.style.width= `${window.innerWidth}`;
container.style.height= `${window.innerHeight}`;
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
camera.lowerRadiusLimit = 8;
camera.upperRadiusLimit = 30;
var anchor = new BABYLON.TransformNode("");

camera.wheelDeltaPercentage = 0.01;
// TODO: Zoom limits
camera.attachControl(canvas, true);

var manager = new BABYLON.GUI.GUI3DManager(scene);
// TODO: implement assetsManager properly
// var assetsManager = new BABYLON.AssetsManager(scene);

// TODO: How to mute audio of video? >> demux
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

// setup spherical UI
var panel = new BABYLON.GUI.SpherePanel();
panel.margin = 5;
panel.radius = 49.9;
// panel.position.z = 1;

manager.addControl(panel);
panel.linkToTransformNode(anchor);

// Sounds

function playSound(soundStr, volumeInDb) {
  const playVol = Math.pow(10, volumeInDb/20) || 0.5;
  const sound = sounds[soundStr];
  sound.setVolume(playVol)
  sound.play();
  console.log(`${soundStr} played!`)
}


var audioPaths = {};
audioPaths.at00 = "./assets/audio/180507_Brodowin_Test_Huegel_5pm45_cut_stereo.ogg";
audioPaths.bell = "./assets/audio/Agogo\ Bell.wav";

var sounds = {};
sounds.at00 = new BABYLON.Sound("Atmo", audioPaths.at00, scene, null, { loop: true, autoplay: true , volume: 0.6});
sounds.bell = new BABYLON.Sound("Bell", audioPaths.bell, scene, null, { loop: false, autoplay: false });


//  add some buttons!
// TODO: How to position?

var addButton = function() {
  var button = new BABYLON.GUI.HolographicButton("orientation");
  panel.addControl(button);
  button.text = "Bird #" + panel.children.length;
  button.height = 200;

  buttonScaler = 8;
  button.scaling.x = buttonScaler;
  button.scaling.y = buttonScaler;
  button.scaling.z = buttonScaler;

  button.onPointerClickObservable.add(() => {
    console.log("Clicked!")
    // spacialise sound
    sounds.bell.attachToMesh(button.mesh);
    playSound("bell", -6)
  })
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