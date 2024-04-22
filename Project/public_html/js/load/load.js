import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

var idleAction;
var digAction;
var pullAction;
var torchWalkingAction;
var walkingAction;
var torchIdleAction;

var actions;
export function loadChar(scene){

    const peasantLoader = new GLTFLoader();
    peasantLoader.load( 'obj/Peasant.glb', function ( gltf ) {

        var model = gltf.scene;

        scene.add( model );

        var character = model.children[0];

        model.rotation.y = Math.PI /2;
        const modelMaterial = gltf.scene.children[0].material;
        
        modelTexture = modelMaterial.map;

        model.traverse( function ( object ) {

                if ( object.isMesh ) object.castShadow = true;

        } );


        var skeleton = new THREE.SkeletonHelper( model );
        skeleton.visible = false;
        scene.add( skeleton );

        const animations = gltf.animations;

        scene.mixer = new THREE.AnimationMixer( model );
        

        idleAction = scene.mixer.clipAction( animations[ 2 ] );
        digAction = scene.mixer.clipAction( animations[ 1 ] );
        pullAction = scene.mixer.clipAction( animations[ 3 ] );
        torchWalkingAction = scene.mixer.clipAction( animations[ 4 ] );
        walkingAction = scene.mixer.clipAction( animations[ 7 ] );
        torchIdleAction = scene.mixer.clipAction( animations[ 5 ] );

        idleAction.play();

        actions = [idleAction,walkingAction,torchIdleAction,torchWalkingAction,digAction,pullAction];

        digAction.play();
        pullAction.play();
        torchWalkingAction.play();
        walkingAction.play();
        torchIdleAction.play();

        digAction.weight = 0;
        pullAction.weight = 0;
        torchWalkingAction.weight = 0;
        walkingAction.weight = 0;
        torchIdleAction.weight = 0;

        idleAction.sol = false;
        idleAction.parla = false;

        digAction.sol = false;
        digAction.parla = false;

        pullAction.sol = false;
        pullAction.parla = false;

        torchWalkingAction.sol = false;
        torchWalkingAction.parla = false;

        walkingAction.sol = false;
        walkingAction.parla = false;

        torchIdleAction.sol = false;
        torchIdleAction.parla = false;
        
        character.idleAction = idleAction;
        character.digAction = digAction;
        character.walkingAction = walkingAction;
        character.torchWalkingAction = torchWalkingAction;
        character.torchIdleAction = torchIdleAction;
        character.pullAction = pullAction;
        
        scene.babushka = character;
    } );

}
export function checkSolParla(){
        actions.forEach(function(action) {
            if (action.sol) {
                action.weight -= 0.01;
                if(action.weight < 0){
                    action.weight = 0;
                    action.sol = false;
                }
            }
            if (action.parla) {
                action.weight += 0.01;
                if(action.weight > 1){
                    action.weight = 1;
                    action.parla = false;
                }
            }
        });
    }
