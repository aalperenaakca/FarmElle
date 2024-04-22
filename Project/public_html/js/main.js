import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { initMovementControls } from './controls/movementControls.js';
import { initLightingAndCamera } from './lightingAndCamera.js';
import { initCharacterMovement } from './characterMovement.js';
import { initMenuControls } from './controls/menuControls.js';
import { initSound } from './soundControl.js';
import { multiDimensionalKnapsack } from './knapsack.js';
import { updateUniforms } from './loadObjects.js';

let characterobj = {
    character:null
};
let mixerobj = {
    mixer:null
};
let actionHolder = {
    veggieActions:null,
    modelsToAnimate:null
};
let menu = {
        godMode: false,
        inMenu: true,
        isPhong: true,
        isMuted: false
    };
    
let isObjectSelected = false;

let controls = {
    orbitControl:null,
    tControl:null
};


let allActions = {
        idleAction:null,
        digAction:null,
        pullAction:null,
        torchWalkingAction:null,
        walkingAction:null,
        torchIdleAction:null
    };



function main(){
    const lightingAndCamera = initLightingAndCamera(characterobj,menu);
    const renderer = lightingAndCamera.renderer;
    const scene = lightingAndCamera.scene;
    const camera = lightingAndCamera.camera;
    const sound = initSound(camera);
    sound.backSound();
    var clock = new THREE.Clock();
    let lights = lightingAndCamera.lights;
    const charamovements = initCharacterMovement(scene,characterobj,mixerobj,sound,allActions,actionHolder,lights);
    
    controls.tControl = new TransformControls( camera, renderer.domElement ); 
    scene.add(controls.tControl);
    
    initMovementControls(controls, scene, controls.tControl, camera, menu,characterobj,allActions,mixerobj,actionHolder);
    
    

    initMenuControls(menu);
    
    renderer.render( scene, camera );
        
    function animate() {
        
        requestAnimationFrame( animate );
        
        const delta = clock.getDelta();
        
        if ( mixerobj.mixer ) mixerobj.mixer.update( delta );
        
        if ( mixerobj.mixerPumpkin ) mixerobj.mixerPumpkin.update( delta );
        
        if ( mixerobj.mixerSunflower ) mixerobj.mixerSunflower.update( delta );
        
        if ( mixerobj.mixerCorn ) mixerobj.mixerCorn.update( delta );
        
        if ( mixerobj.mixerTomato ) mixerobj.mixerTomato.update( delta );
        
        
        updateUniforms(lights.dirLight.position, lights.dirLight.color, 
        lights.dirLight.intensity, lights.spotLightDirection,lights.spotLightPosition,lights.spotLightSwitch);
        
        if ( characterobj.character && !menu.inMenu ) {
            charamovements.checkSolParla();
            lightingAndCamera.updateCamera();
        }
        lightingAndCamera.updateLighting();
        renderer.render( scene, camera );
    }

    animate();
}

main();