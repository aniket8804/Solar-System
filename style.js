import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, skybox;
let planet_sun, planet_mercury, planet_venus, planet_earth, planet_mars, planet_jupiter, planet_saturn, planet_uranus, planet_neptune;
let planet_sun_label;


let mercury_orbit_radius = 50
let venus_orbit_radius = 60
let earth_orbit_radius = 70
let mars_orbit_radius = 80
let jupiter_orbit_radius = 100
let saturn_orbit_radius = 120
let uranus_orbit_radius = 140
let neptune_orbit_radius = 160

let revolutionSpeeds = {
  mercury: 2,
  venus: 1.5,
  earth: 1,
  mars: 0.8,
  jupiter: 0.7,
  saturn: 0.6,
  uranus: 0.5,
  neptune: 0.4
};

let isPaused = false;

function createMaterialArray() {
  const skyboxImagepaths = [
    "img/skybox/space_bk.png",
    "img/skybox/space_dn.png",
    "img/skybox/space_ft.png",
    "img/skybox/space_lf.png",
    "img/skybox/space_rt.png",
    "img/skybox/space_up.png"]
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

function setSkyBox() {
  const materialArray = createMaterialArray();
  let skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
  skybox = new THREE.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}

function loadPlanetTexture(texture, radius, widthSegments, heightSegments, meshType) {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });

  const planet = new THREE.Mesh(geometry, material);

  return planet
}

function createRing(innerRadius) {
  let outerRadius = innerRadius - 0.1
  let thetaSegments = 100
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
  mesh.rotation.x = Math.PI / 2
  return mesh;

}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  setSkyBox();
  planet_earth = loadPlanetTexture("img/earth_hd.jpg", 4, 100, 100, 'standard');
planet_sun = loadPlanetTexture("img/sun_hd.jpg", 20, 100, 100, 'basic');
planet_mercury = loadPlanetTexture("img/mercury_hd.jpg", 2, 100, 100, 'standard');
planet_venus = loadPlanetTexture("img/venus_hd.jpg", 3, 100, 100, 'standard');
planet_mars = loadPlanetTexture("img/mars_hd.jpg", 3.5, 100, 100, 'standard');
planet_jupiter = loadPlanetTexture("img/jupiter_hd.jpg", 10, 100, 100, 'standard');
planet_saturn = loadPlanetTexture("img/saturn_ring.jpg", 8, 100, 100, 'standard');
planet_uranus = loadPlanetTexture("img/uranus_hd.jpg", 6, 100, 100, 'standard');
planet_neptune = loadPlanetTexture("img/neptune_hd.jpg", 5, 100, 100, 'standard');


  scene.add(planet_earth);
  scene.add(planet_sun);
  scene.add(planet_mercury);
  scene.add(planet_venus);
  scene.add(planet_mars);
  scene.add(planet_jupiter);
  scene.add(planet_saturn);
  scene.add(planet_uranus);
  scene.add(planet_neptune);

  const sunLight = new THREE.PointLight(0xffffff, 1, 0); // White light, intensity 1, no distance attenuation
  sunLight.position.copy(planet_sun.position); // Position the light at the Sun's position
  scene.add(sunLight);

  // Rotation orbit
  createRing(mercury_orbit_radius)
  createRing(venus_orbit_radius)
  createRing(earth_orbit_radius)
  createRing(mars_orbit_radius)
  createRing(jupiter_orbit_radius)
  createRing(saturn_orbit_radius)
  createRing(uranus_orbit_radius)
  createRing(neptune_orbit_radius)

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.id = "c";
  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 12;
  controls.maxDistance = 1000;

  camera.position.z = 100;
}


function planetRevolver(time, speed, planet, orbitRadius, planetName) {

  let orbitSpeedMultiplier = 0.001;
  const planetAngle = time * orbitSpeedMultiplier * speed;
  planet.position.x = planet_sun.position.x + orbitRadius * Math.cos(planetAngle);
  planet.position.z = planet_sun.position.z + orbitRadius * Math.sin(planetAngle);
}

  function animate(time) {
    requestAnimationFrame(animate);
  
    if (isPaused) return; // To play/pause the rotation
  
    const rotationSpeed = 0.005;
    planet_earth.rotation.y += rotationSpeed;
    planet_sun.rotation.y += rotationSpeed;
    planet_mercury.rotation.y += rotationSpeed;
    planet_venus.rotation.y += rotationSpeed;
    planet_mars.rotation.y += rotationSpeed;
    planet_jupiter.rotation.y += rotationSpeed;
    planet_saturn.rotation.y += rotationSpeed;
    planet_uranus.rotation.y += rotationSpeed;
    planet_neptune.rotation.y += rotationSpeed;
  
    // Revolve planets
    planetRevolver(time, revolutionSpeeds.mercury, planet_mercury, mercury_orbit_radius, 'mercury');
    planetRevolver(time, revolutionSpeeds.venus, planet_venus, venus_orbit_radius, 'venus');
    planetRevolver(time, revolutionSpeeds.earth, planet_earth, earth_orbit_radius, 'earth');
    planetRevolver(time, revolutionSpeeds.mars, planet_mars, mars_orbit_radius, 'mars');
    planetRevolver(time, revolutionSpeeds.jupiter, planet_jupiter, jupiter_orbit_radius, 'jupiter');
    planetRevolver(time, revolutionSpeeds.saturn, planet_saturn, saturn_orbit_radius, 'saturn');
    planetRevolver(time, revolutionSpeeds.uranus, planet_uranus, uranus_orbit_radius, 'uranus');
    planetRevolver(time, revolutionSpeeds.neptune, planet_neptune, neptune_orbit_radius, 'neptune');
  
    controls.update();
    renderer.render(scene, camera);
  }

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

init();
function setupSpeedControls() {
  const ids = ["mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
  ids.forEach((planet) => {
    document.getElementById(planet + "Speed").addEventListener("input", (e) => {
      revolutionSpeeds[planet] = parseFloat(e.target.value);
    });
  });
}

document.getElementById("pauseBtn").addEventListener("click", () => {
  isPaused = true;
  document.getElementById("pauseBtn").disabled = true;
  document.getElementById("playBtn").disabled = false;
});

document.getElementById("playBtn").addEventListener("click", () => {
  isPaused = false;
  document.getElementById("pauseBtn").disabled = false;
  document.getElementById("playBtn").disabled = true;
});


setupSpeedControls();
animate(0); 