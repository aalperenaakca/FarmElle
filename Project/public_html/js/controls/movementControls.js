import * as THREE from 'three';
import { changeMenuVisibility } from './menuControls.js';
import { multiDimensionalKnapsack } from '../knapsack.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

  export function initMovementControls(controls, scene, tControl, camera, menu, characterobj, allActions,mixerobj,actionHolder) {
    
    var modelsToAnimate = {char: null};
    var veggieActions = {char: null};
    const animatedVegLoader = new GLTFLoader();
     
    let isObjectSelected = false;
    
    ///////////////////////////// alperenin verdiği değerler buraya koydum
    let values = [10, 7, 6, 4]; // Balkabağı, Domates, Mısır, Ayçiçeği
    let weights = [[3, 4, 3], [1, 4, 2], [2, 3, 1], [2, 1, 1]]; // Fosfor, Potasyum, Magnezyum
    //let capacities = [7,8,6]; // Fosfor, Potasyum, Magnezyum
    
    window.addEventListener('keydown', keydown);
   
    function keydown(e) {
        if(e.key ==='Escape'){
            control();
            menu.inMenu = true;
            isObjectSelected = false;
            tControl.visible = false;
            tControl.enabled = false;
        }
        switch(e.key.toLowerCase()){
            case 'g':
                isObjectSelected = false;
                tControl.visible = false;
            case 'q':
                if(isObjectSelected)
                tControl.mode = "translate";
                break;
            case 'e':
                if(isObjectSelected)
                tControl.mode = "rotate";
                break;
            case 'r':
                if(isObjectSelected)
                tControl.mode = "scale";
                break;
            case 's':
                onMouseDown(e);
                break;
            case 'f': 
                farm(mixerobj);
                break;
        }  

    }
    
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    
    document.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    
    

    function farm(mixerobj) { 
        var alert = document.getElementById("alert"); 
		var loadingBarContainer = document.getElementById("loading-bar-container");
        var loadingBar = document.getElementById("loading-bar");
        raycaster.setFromCamera(mouse, camera);
        
        let objectsToIntersect = [];
            scene.traverse(function (child) {
                if (child.userData.canFarm) {
                    objectsToIntersect.push(child);
                }
            });
        
        var intersects = raycaster.intersectObjects(objectsToIntersect);
        if (intersects.length > 0) {
            var clickedObject = intersects[0].object;
            var charPos = characterobj.character.getWorldPosition(new THREE.Vector3());
            var farmPos = clickedObject.position;
            var distance = charPos.distanceTo(farmPos);
            if(distance < 0.75){
                ////DIG
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
                
                let capacities = clickedObject.userData.minerals;
                var result = multiDimensionalKnapsack(values, weights, capacities);
                let plants = result.selectedItems.map(function(index) {
                    return indexToPlants(index);
                });
                
                loadingBarContainer.style.display = "block";

                var progress = 0;
                var interval = setInterval(function() {
                    progress += 1;
                    loadingBar.style.width = progress + "%";
                    if (progress >= 100) {
                        clearInterval(interval);
                        loadingBar.style.width = 0 + "%";
                        setTimeout(function() {
                          loadingBarContainer.style.display = "none";
                        });
                    }
                }, 30);
                
                
                setTimeout(function() {
                    alert.innerHTML = `KNAPSACK CALCULATED <br>
                                   <br>
                                   Minerals of the Soil (unit): <br>
                                   - Nitrogen (N): ${capacities[0]} <br>
                                   - Phosphorus (P): ${capacities[1]} <br>
                                   - Potassium (K): ${capacities[2]} <br>
                                   <br>
                                   Maximum Efficiency: ${result.maxValue}<br>
                                   <br>
                                   Choosen Plants : <br>
                                   - ${plants.join(", ")} <br>
                                   <button id="alertButton" onclick="closeAlert()">Close</button>
                                    `;
                    alert.style.display = "block";
                }, 3000);
                
                setTimeout(function() {
                    ////IDLE
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
                    
                    animateAtPoint(clickedObject.position, result.selectedItems,mixerobj);
                }, 8000);
            }
            else{
                alert.innerHTML = 'You are far from the farm tile you choose.';
                alert.style.display = "block";
                setTimeout(function() {
                    alert.style.display = "none";
                }, 2000);
            }
        }
    }
    
    
    function indexToPlants(index) {
        var plants = ["Pumpkin", "Tomato", "Corn", "Sunflower"];

        if (index >= 0 && index < plants.length) {
          return plants[index];
        } else {
          return "Unknown";
        }
    }

    
    
    function animateAtPoint(position, results, mixerobj){
        function playNextAnimation(index,results) {
            
            if (index >= results.length) {
                actionHolder.modelsToAnimate.pumpkin.position.set(1000, 1000, 1000);
                actionHolder.modelsToAnimate.tomato.position.set(1000, 1000, 1000);
                actionHolder.modelsToAnimate.corn.position.set(1000, 1000, 1000);
                actionHolder.modelsToAnimate.sunflower.position.set(1000, 1000, 1000);
                return;
            }

            var modelIndex = results[index];
            var model;
            if(modelIndex === 0){
                model = actionHolder.modelsToAnimate.pumpkin;
            }
            if(modelIndex === 1){
                model = actionHolder.modelsToAnimate.tomato;
            }
            if(modelIndex === 2){
                model = actionHolder.modelsToAnimate.corn;
            }
            if(modelIndex === 3){
                model = actionHolder.modelsToAnimate.sunflower;
            }

            model.position.set(position.x, position.y, position.z);

            switch (modelIndex) {
                case 0:
                    actionHolder.veggieActions.pumpkinAnimation.timeScale = 0.2;
                    actionHolder.veggieActions.pumpkinAnimation2.timeScale = 0.2;
                    actionHolder.veggieActions.pumpkinAnimation.play();
                    actionHolder.veggieActions.pumpkinAnimation2.play();
                    break;
                case 1:
                    actionHolder.veggieActions.tomatoAnimation.timeScale = 0.25;
                    actionHolder.veggieActions.tomatoAnimation.play();
                    break;
                case 2:
                    actionHolder.veggieActions.cornAnimation.timeScale = 0.25;
                    actionHolder.veggieActions.cornAnimation.play();
                    break;
                case 3:
                    actionHolder.veggieActions.sunflowerAnimation.timeScale = 0.25;
                    actionHolder.veggieActions.sunflowerAnimation.play();
                    break;
                default:
                    break;
            }
            
            
            setTimeout(function () {

                
                actionHolder.modelsToAnimate.pumpkin.position.set(1000, 1000, 1000);
                actionHolder.modelsToAnimate.tomato.position.set(1000, 1000, 1000);
                actionHolder.modelsToAnimate.corn.position.set(1000, 1000, 1000);
                actionHolder.modelsToAnimate.sunflower.position.set(1000, 1000, 1000);

                actionHolder.veggieActions.pumpkinAnimation.stop();
                actionHolder.veggieActions.pumpkinAnimation2.stop();
                actionHolder.veggieActions.sunflowerAnimation.stop();
                actionHolder.veggieActions.cornAnimation.stop();
                actionHolder.veggieActions.tomatoAnimation.stop();

                playNextAnimation(index + 1,results);
            }, 5000);
            
        }
        playNextAnimation(0,results);
    }
    
    
    function control(){
        changeMenuVisibility(true);
    }
    
    function objectAddControl(event){
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        if (!isObjectSelected) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            let objectsToIntersect = [];
            scene.traverse(function (child) {
                if (child.userData.canMove) {
                    objectsToIntersect.push(child);
                }
            });
            
            var intersects = raycaster.intersectObjects(objectsToIntersect);
            
            if (intersects.length > 0) {
                var selectedObject = intersects[0].object;

                tControl.attach(selectedObject);
                tControl.enabled = true;
                isObjectSelected = true;
            }
        }
    }
    
    window.addEventListener('mousedown', onMouseDown);
    
    function onMouseDown(event) {
        
        if(menu.godMode && !menu.inMenu){
            
            objectAddControl(event); 
        }
    }

    
    return {    
    };
}


    

    
