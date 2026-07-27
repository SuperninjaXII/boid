import * as THREE from 'three';
import { vec2 } from 'three/tsl';
import { Vector2 } from 'three/webgpu';

// rituals
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//the origin shape
//lmao i wanted to wrap em in afunction called draw() :-(
const BoatGeometry = new THREE.BoxGeometry(5, 2.5, 5);
const BoatMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(BoatGeometry, BoatMaterial);
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
cube.add(sphere);
sphere.position.setX(5);

// the target 
const targetGeometry = new THREE.SphereGeometry(2, 32, 16);
const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const targetsphere = new THREE.Mesh(targetGeometry, targetMaterial);
scene.add(targetsphere);

//some variables i guess change these for different effects
let speed = 30;
const turnSpeed = 0.01;
const steeringSpeed = 0.9
//let oPos = { x: -70, y: 20 };
let oPos = new THREE.Vector2(-70, 20);
cube.position.set(oPos.x, oPos.y, 0);

//let tPos = { x: 1, y: -1 };
let tPos = new THREE.Vector2(1, -1);
targetsphere.position.set(tPos.x, tPos.y, 0);

//const velVec = { x: 0, y: 1 };
let velVec = new THREE.Vector2(0, 1);

camera.position.z = 70;

// the grand util
//function lerp(x, y, t) {
// return (1 - t) * x + t * y;
//}

function update(dt) {
  // const targetDir = {
  // x: tPos.x - oPos.x,
  // y: tPos.y - oPos.y,
  // };
  // i dont like the code below the code above is elgant
  // targetDir.add(direction.normalize().multiplyScalar(tPos.distanceTo(oPos)).
  //
  const targetDir = new THREE.Vector2(tPos.x - oPos.x, tPos.y - oPos.y)

  const targetDirLength = tPos.distanceTo(oPos)
  //i kind of remember after the bathroom break
  // i just find the peperndicular to the target
  //lets say the target vector is the hypotenus i just need to find theadjecent.. i can now see i might need to find the one closest but yeah
  //even better with vector i can just sawpp,, ahhhh  vectors

  /*const adjacent1 = {
    x: -targetDir.y,
    y: targetDir.x
  }
  const adjacent2 = {
    x: targetDir.y,
    y: -targetDir.x
  };*/
  const adjacent1 = new THREE.Vector2(-targetDir.y, targetDir.x)
  const adjacent2 = new THREE.Vector2(targetDir.y, -targetDir.x)
  // when zero
  if (targetDirLength > 0) {
    targetDir.normalize()
  }


  // Steer away // but am chosing stop and rotate i will comment the steear awya
  if (targetDirLength < 20) {
    targetDir.x *= -1;
    targetDir.y *= -1;
    //
    //speed = lerp(speed, 0, dt)

    console.log("called")
    //this is the part where it should rotate

    const dot1 = velVec.x * adjacent1.x + velVec.y * adjacent1.y;
    const dot2 = velVec.x * adjacent2.x + velVec.y * adjacent2.y;
    const bestBroadside = (dot1 > dot2) ? adjacent1 : adjacent2;
    ///fisrt attempt failled
    /// cube.rotation.z = lerp(angle, Math.atan2(bestBroadside.y, bestBroadside.x), dt);

    velVec = velVec.lerp(bestBroadside, turnSpeed * dt);
    //velVec.y = lerp(velVec.y, bestBroadside.y, dt * turnSpeed);

    //normalizing the vector as articles say :-(
    const currentSpeed = Math.hypot(velVec.x, velVec.y);
    if (currentSpeed > 0) {
      velVec.normalize()
    }

    cube.rotation.z = Math.atan2(velVec.y, velVec.x);
  } else {
    //this code changed behavior of the ship
    velVec = velVec.lerp(targetDir, steeringSpeed * dt)

    const currentSpeed = Math.hypot(velVec.x, velVec.y);
    if (currentSpeed > 0) {
      velVec.normalize()
    }

    oPos.x += velVec.x * speed * dt;
    oPos.y += velVec.y * speed * dt;

    cube.position.set(oPos.x, oPos.y, 0);
    //should i rotate ??
    //const angle = Math.atan2(velVec.y, velVec.x);
    //ccube.rotation.z = angle;
    cube.rotation.z = velVec.angle();
  }

}


const timer = new THREE.Timer();
timer.connect(document);
let t = 0


function animate() {
  requestAnimationFrame(animate);
  timer.update()

  const dt = timer.getDelta()
  t += dt

  update(dt);

  renderer.render(scene, camera);

}
animate();
