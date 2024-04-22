import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';


let scene2;
let shaderArray = [];

let shaders = {
    vertexShader: null,
    fragmentShader: null
};

let uniforms2 = {
    light1_position: { value: new THREE.Vector3(5, 5, 5) },
    light1_color: { value: new THREE.Color(1, 1, 1) },
    light1_intensity: { value: 1.0 },
    u_lightDirection:{ value: new THREE.Vector3() },
    spotLightPosition:{ value: new THREE.Vector3() },
    spotLightSwitch:{ value: false }
};

export function updateUniforms(lp1, lc1, li1,ld2,lp2,ls2){
    uniforms2.light1_position.value.copy(lp1);
    uniforms2.light1_color.value.copy(lc1);
    uniforms2.light1_intensity.value = li1;
    uniforms2.u_lightDirection.value = new THREE.Vector3(ld2[0],ld2[1],ld2[2]);
    uniforms2.spotLightPosition.value = new THREE.Vector3(lp2[0],2,lp2[2]);
    uniforms2.spotLightSwitch.value = ls2;
}

export function updateShader(isPhong){
    if (isPhong) {
        shaders.vertexShader = shaderArray[2];
        shaders.fragmentShader = shaderArray[3];
        
    }
    else {
        shaders.vertexShader = shaderArray[0];
        shaders.fragmentShader = shaderArray[1];
    }
    scene2.traverse((object) => {
        if (object.isMesh && object.material.isShaderMaterial) {

            if (object.name !== 'sky') {
                object.material.vertexShader = shaders.vertexShader;
                object.material.fragmentShader = shaders.fragmentShader;

                // Make sure to set needsUpdate to true
                object.material.needsUpdate = true;
            }
        }
    });
}




export function initLoadObjects(scene,characterobj,mixerobj,allActions,actionHolder) {
    const animatedVegLoader = new GLTFLoader();
    actionHolder.veggieActions = {char: null};
    actionHolder.modelsToAnimate = {char: null};
   
    scene2 = scene;
    shaderArray[0] = document.getElementById("vertexShader").textContent;
    shaderArray[1] = document.getElementById("fragmentShader").textContent;
    shaderArray[2] = document.getElementById("vertexShaderPhong").textContent;
    shaderArray[3] = document.getElementById("fragmentShaderPhong").textContent;


    shaders.vertexShader = shaderArray[2];
    shaders.fragmentShader = shaderArray[3];

   
   
   
   
   
   
    let initArray = [0,1,2,3];
    initArray.forEach(function (item) {
        if(item === 0 ){
            initVeggieActions('obj/pumpkinanimated.glb',0);
        }
        if(item === 1 ){
            initVeggieActions('obj/tomatoanimated.glb',1);
        }
        if(item === 2 ){
            initVeggieActions('obj/cornanimated.glb',2);
        }
        if(item === 3 ){
            initVeggieActions('obj/sunfloweranimated.glb',3);
        }            
    });
    
    
function initVeggieActions(vegLocString,type){

    animatedVegLoader.load( vegLocString, function ( gltf ) {

    var model = gltf.scene;

    scene.add( model );        

    model.traverse( function ( object ) {

            if(object.isMesh && object.material.map){

                let uniforms = {
                            u_texture: {value: object.material.map},
                            light1_position: uniforms2.light1_position,
                            light1_color: uniforms2.light1_color,
                            light1_intensity: uniforms2.light1_intensity,
                            light2_position: uniforms2.light2_position,
                            light2_color: uniforms2.light2_color,
                            light2_direction: uniforms2.light2_direction

                        };
                object.material =  new THREE.ShaderMaterial({
                        uniforms: uniforms,
                        vertexShader: shaders.vertexShader,
                        fragmentShader: shaders.fragmentShader,
                        glslVersion: "THREE.GLSL3"
                });
                
            }
                  
            if ( object.isMesh && object.name.startsWith("Mud")) {
                
                var min = 3;
                var max = 10;
                
                object.userData.minerals =  [Math.floor(Math.random() * (max - min + 1)) + min,
                                             Math.floor(Math.random() * (max - min + 1)) + min,
                                             Math.floor(Math.random() * (max - min + 1)) + min];
                
            }

    } );
    const animations = gltf.animations;

    
    
    if(type === 0){
        actionHolder.modelsToAnimate.pumpkin = model;
        mixerobj.mixerPumpkin = new THREE.AnimationMixer( model );
        actionHolder.veggieActions.pumpkinAnimation = mixerobj.mixerPumpkin.clipAction( animations[ 0 ] );
        actionHolder.veggieActions.pumpkinAnimation2 = mixerobj.mixerPumpkin.clipAction( animations[ 1 ] );
        actionHolder.modelsToAnimate.pumpkin.position.set(0, -3, 0);
    }
    if(type === 1){
        actionHolder.modelsToAnimate.tomato = model;           
        mixerobj.mixerTomato = new THREE.AnimationMixer( model );
        actionHolder.veggieActions.tomatoAnimation = mixerobj.mixerTomato.clipAction( animations[ 0 ] );
        actionHolder.modelsToAnimate.tomato.position.set(0, -3, 0);
    }
    if(type === 2){
        actionHolder.modelsToAnimate.corn = model;
        mixerobj.mixerCorn = new THREE.AnimationMixer( model );
        actionHolder.veggieActions.cornAnimation = mixerobj.mixerCorn.clipAction( animations[ 0 ] );
        actionHolder.modelsToAnimate.corn.position.set(0, -3, 0);
    }
    if(type === 3){
        actionHolder.modelsToAnimate.sunflower = model;
        mixerobj.mixerSunflower = new THREE.AnimationMixer( model );
        actionHolder.veggieActions.sunflowerAnimation = mixerobj.mixerSunflower.clipAction( animations[ 0 ] );
        actionHolder.modelsToAnimate.sunflower.position.set(0, -3, 0);
    }
            
            

} );


}
   
    const gltfLoader = new GLTFLoader();
    loadGLTF('./obj/scene.glb');

    
    function loadGLTF(path){
    gltfLoader.load(
        path,
        function ( gltf ) {
            scene.add( gltf.scene );
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object
            
            
            /////////////////////////////////////////////// objeler mud ise onlara 3 adet mineral değeri veriyor N P K ben ekledim
            gltf.scene.traverse( function ( object ) {
                if(object.isMesh && object.material.map){

                    let uniforms = {
                                u_texture: {value: object.material.map},
                                light1_position: uniforms2.light1_position,
                                light1_color: uniforms2.light1_color,
                                light1_intensity: uniforms2.light1_intensity,
                                u_lightDirection:uniforms2.u_lightDirection,
                                spotLightPosition:uniforms2.spotLightPosition,
                                spotLightSwitch:uniforms2.spotLightSwitch

                            };
                    object.material =  new THREE.ShaderMaterial({
                            uniforms: uniforms,
                            vertexShader: shaders.vertexShader,
                            fragmentShader: shaders.fragmentShader,
                            glslVersion: "THREE.GLSL3"
                    });
                    
                }
                      
                if ( object.isMesh && object.name.startsWith("Mud")) {
                    
                    var min = 3;
                    var max = 10;
                    
                    object.userData.minerals =  [Math.floor(Math.random() * (max - min + 1)) + min,
                                                 Math.floor(Math.random() * (max - min + 1)) + min,
                                                 Math.floor(Math.random() * (max - min + 1)) + min];
                    
                }

            } );

        },
        function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        function ( error ) {
                console.log( 'An error happened', error );
        }
    );

    }

    
    
    
    const peasantLoader = new GLTFLoader();
    peasantLoader.load( 'obj/Peasant.glb', function ( gltf ) {

            var model = gltf.scene;
            
            scene.add( model );
            
            characterobj.character = model.children[0];
            
            model.rotation.y = Math.PI /2;
              
            
            var skeleton = new THREE.SkeletonHelper( model );
            skeleton.visible = false;
            scene.add( skeleton );

            const animations = gltf.animations;

            mixerobj.mixer = new THREE.AnimationMixer( model );


            allActions.idleAction = mixerobj.mixer.clipAction( animations[ 2 ] );
            allActions.digAction = mixerobj.mixer.clipAction( animations[ 1 ] );
            allActions.pullAction = mixerobj.mixer.clipAction( animations[ 3 ] );
            allActions.torchWalkingAction = mixerobj.mixer.clipAction( animations[ 4 ] );
            allActions.walkingAction = mixerobj.mixer.clipAction( animations[ 7 ] );
            allActions.torchIdleAction = mixerobj.mixer.clipAction( animations[ 5 ] );
                        

            allActions.idleAction.play();
           
            allActions.digAction.play();
            allActions.pullAction.play();
            allActions.torchWalkingAction.play();
            allActions.walkingAction.play();
            allActions.torchIdleAction.play();
            
            allActions.digAction.weight = 0;
            allActions.pullAction.weight = 0;
            allActions.torchWalkingAction.weight = 0;
            allActions.walkingAction.weight = 0;
            allActions.torchIdleAction.weight = 0;
            
            allActions.idleAction.sol = false;
            allActions.idleAction.parla = false;
         
            allActions.digAction.sol = false;
            allActions.digAction.parla = false;
            
            allActions.pullAction.sol = false;
            allActions.pullAction.parla = false;
            
            allActions.torchWalkingAction.sol = false;
            allActions.torchWalkingAction.parla = false;
            
            allActions.walkingAction.sol = false;
            allActions.walkingAction.parla = false;
            
            allActions.torchIdleAction.sol = false;
            allActions.torchIdleAction.parla = false;
            
            
            
            
            
            

            
    } );

    
    return {
    };
}




