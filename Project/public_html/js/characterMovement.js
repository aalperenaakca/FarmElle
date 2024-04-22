import * as THREE from 'three';
import { initLoadObjects } from './loadObjects.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export function initCharacterMovement(scene,characterobj,mixerobj,sound,allActions,actionHolder,lights) {

    initLoadObjects(scene,characterobj,mixerobj,allActions,actionHolder);

    var translateCharVector = new THREE.Vector3( 0, 1, 0 );

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    var direction = 0;

    const left = -1;
    const right = 1;
   
    let velocity = 0;
    const maxVelocity = 0.01;
    const acceleration = 0.0025;
    const deceleration = 0.00025;
    let decelerating = true;
    
    function onKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case 'a': // left a
                
                direction = left;
                if(!decelerating){
                    velocity = Math.min(velocity + acceleration, maxVelocity);
                }
                characterobj.character.rotateZ(-Math.PI/30);
                characterobj.character.getWorldDirection(translateCharVector);
                translateCharVector.negate();
                break;
                
            case 'w': // up w
                sound.moveSound();
                if(direction === right){
                    characterobj.character.rotateZ(Math.PI/30);
                    characterobj.character.getWorldDirection(translateCharVector);
                    translateCharVector.negate();
                    
                    
                }
                if(direction === left){
                    characterobj.character.rotateZ(-Math.PI/30);
                    characterobj.character.getWorldDirection(translateCharVector);
                    translateCharVector.negate();
                }
                
                velocity = Math.min(velocity + acceleration, maxVelocity);
                decelerating = false;
                if(lights.spotLightSwitch){
                    
                    
                    allActions.torchIdleAction.sol = true;
                    allActions.torchWalkingAction.sol = false;
                    allActions.idleAction.sol = true;
                    allActions.walkingAction.sol = true;
                    
                    allActions.torchWalkingAction.parla = true;
                    allActions.torchIdleAction.parla = false;
                    allActions.idleAction.parla = false;
                    allActions.walkingAction.parla = false;
                    
                }
                else{
                    allActions.idleAction.sol = true;
                    allActions.torchIdleAction.sol = true;
                    allActions.torchWalkingAction.sol = true;
                    allActions.walkingAction.sol = false;
                    
                    allActions.torchIdleAction.parla = false;
                    allActions.torchWalkingAction.parla = false;
                    allActions.idleAction.parla = false;
                    allActions.walkingAction.parla = true;
                }
                break;
                
            case 'd': // right d

                
                direction = right;
                if(!decelerating){
                    velocity = Math.min(velocity + acceleration, maxVelocity);
                }
                characterobj.character.rotateZ(Math.PI/30);
                characterobj.character.getWorldDirection(translateCharVector);
                translateCharVector.negate();
                break;
                
            case 'l':
                if(!lights.spotLightSwitch && velocity < 0.01){
                    lights.spotLightSwitch = !lights.spotLightSwitch;
                    allActions.torchIdleAction.sol = false;
                    allActions.torchIdleAction.parla = true;
                    allActions.idleAction.sol = true;
                    allActions.idleAction.parla = false;
                }
                else if(lights.spotLightSwitch && velocity < 0.01){
                    lights.spotLightSwitch = !lights.spotLightSwitch;
                    allActions.torchIdleAction.sol = true;
                    allActions.torchIdleAction.parla = false;
                    allActions.idleAction.sol = false;
                    allActions.idleAction.parla = true;
                }
                
        }
        
    }
    
    

    function onKeyUp(e) {
        switch (e.key.toLowerCase()) {
            case 'a': // left
                direction = 0;
                break;
            case 'w': // up
                sound.stopMoveSound();
                decelerating = true;
                
                if(lights.spotLightSwitch){
                    allActions.torchIdleAction.sol = false;
                    allActions.torchWalkingAction.parla = false;
                    allActions.torchIdleAction.parla = true;
                    allActions.torchWalkingAction.sol = true;
                }
                else{
                    allActions.idleAction.sol = false;
                    allActions.walkingAction.parla = false;
                    allActions.idleAction.parla = true;
                    allActions.walkingAction.sol = true;
                }
                break;
            case 'd': // right
                direction = 0;
                break;
        }
    }
    
    
    window.addEventListener( 'keydown', function ( event ) {
        switch ( event.keyCode ) {
                case 48: // 0
                    
                    allActions.idleAction.parla = true;
                    allActions.digAction.parla = false;
                    allActions.pullAction.parla = false;
                    allActions.torchWalkingAction.parla = false;
                    allActions.walkingAction.parla = false;
                    allActions.torchIdleAction.parla = false;
                    
                    allActions.idleAction.sol = false;
                    allActions.digAction.sol = true;
                    allActions.pullAction.sol = true;
                    allActions.torchWalkingAction.sol = true;
                    allActions.walkingAction.sol = true;
                    allActions.torchIdleAction.sol = true;
                    
                    allActions.idleAction.time = 0;
                    
                    
                        break;
                case 49: // 1
                    allActions.idleAction.parla = false;
                    allActions.digAction.parla = false;
                    allActions.pullAction.parla = false;
                    allActions.torchWalkingAction.parla = false;
                    allActions.walkingAction.parla = true;
                    allActions.torchIdleAction.parla = false;
                    
                    allActions.idleAction.sol = true;
                    allActions.digAction.sol = true;
                    allActions.pullAction.sol = true;
                    allActions.torchWalkingAction.sol = true;
                    allActions.walkingAction.sol = false;
                    allActions.torchIdleAction.sol = true;
                    
                    //walkingAction.time = 0;                    
                        break;
                case 50: // 2
                    allActions.idleAction.parla = false;
                    allActions.digAction.parla = false;
                    allActions.pullAction.parla = false;
                    allActions.torchWalkingAction.parla = false;
                    allActions.walkingAction.parla = false;
                    allActions.torchIdleAction.parla = true;
                    
                    allActions.idleAction.sol = true;
                    allActions.digAction.sol = true;
                    allActions.pullAction.sol = true;
                    allActions.torchWalkingAction.sol = true;
                    allActions.walkingAction.sol = true;
                    allActions.torchIdleAction.sol = false;
                    
                    allActions.torchIdleAction.time = 0;
                    
                        break;
                case 51: // 3
                    allActions.idleAction.parla = false;
                    allActions.digAction.parla = false;
                    allActions.pullAction.parla = false;
                    allActions.torchWalkingAction.parla = true;
                    allActions.walkingAction.parla = false;
                    allActions.torchIdleAction.parla = false;
                    
                    allActions.idleAction.sol = true;
                    allActions.digAction.sol = true;
                    allActions.pullAction.sol = true;
                    allActions.torchWalkingAction.sol = false;
                    allActions.walkingAction.sol = true;
                    allActions.torchIdleAction.sol = true;
                    
                    //torchWalkingAction.time = 0;
                        break;
                case 52: // 4                    
                    allActions.idleAction.parla = false;
                    allActions.digAction.parla = true;
                    allActions.pullAction.parla = false;
                    allActions.torchWalkingAction.parla = false;
                    allActions.walkingAction.parla = false;
                    allActions.torchIdleAction.parla = false;
                    
                    allActions.idleAction.sol = true;
                    allActions.digAction.sol = false;
                    allActions.pullAction.sol = true;
                    allActions.torchWalkingAction.sol = true;
                    allActions.walkingAction.sol = true;
                    allActions.torchIdleAction.sol = true;
                    
                    allActions.digAction.time = 0;
                        break;
                case 53: // 5                    
                    allActions.idleAction.parla = false;
                    allActions.digAction.parla = false;
                    allActions.pullAction.parla = true;
                    allActions.torchWalkingAction.parla = false;
                    allActions.walkingAction.parla = false;
                    allActions.torchIdleAction.parla = false;
                    
                    allActions.idleAction.sol = true;
                    allActions.digAction.sol = true;
                    allActions.pullAction.sol = false;
                    allActions.torchWalkingAction.sol = true;
                    allActions.walkingAction.sol = true;
                    allActions.torchIdleAction.sol = true;
                    
                    allActions.pullAction.time = 0;
                        break;
                
                        
        }
    } );


    function checkSolParla(){
        if (decelerating) {
            velocity = Math.max(velocity - deceleration, 0);
        }
        var actions = [allActions.idleAction,allActions.walkingAction,allActions.torchIdleAction,allActions.torchWalkingAction,allActions.digAction,allActions.pullAction];
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
           
        characterobj.character.translateOnAxis(translateCharVector,velocity);
    }

    
    
    return {
        checkSolParla: function () {
            checkSolParla();
        }
        
    };
}


