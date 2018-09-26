// use strict; 

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
var assetsManager = new BABYLON.AssetsManager(scene);
// var dome = new BABYLON.VideoDome(
//   "testdome",
//   ["./assets/video/VID_20180821_233000_ok_014_exerpt.mp4"],
//   {
//     resolution: 32,
//     clickToPlay: true,
//     loop: true,
//     size: 100,
//   },
//   scene
// );

// Sounds
var atmoPaths = {
  at00: "./assets/audio/180507_Brodowin_Test_Huegel_5pm45_cut_stereo.ogg",
  bell: "./assets/audio/Agogo\ Bell.wav"
}

var sounds = {};

var binaryTask0 = assetsManager.addBinaryFileTask("Brodowin0 task", atmoPaths.bell);
binaryTask0.onSuccess = function (task) {
  sounds.at00 = new BABYLON.Sound("Brodowin0", task.data, scene, soundReady, { loop: true });
}
debugger;

sounds.soundsReady = 0;
function soundReady() {
  sounds.soundsReady++;
  if (sounds.soundsReady === Object.keys(atmoPaths).length - 1) {
    Object.values(sounds).forEach(item => {
      item.play();
      console.log(`${item} played!`)
    });
  }
}
// Shperical UI Panel

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