import * as THREE from 'three';
import { mute } from '../soundControl.js';
import { updateShader } from '../loadObjects.js';

export function initMenuControls(menu) {
    const playButton = document.getElementById('playButton');
    const godModeButton = document.getElementById('godModeButton');
    const shaderButton = document.getElementById('shaderButton');
    const soundButton = document.getElementById('soundButton');
    const quitButton = document.getElementById('quitButton');

    playButton.addEventListener('click', function () {
      // Get the menu container element
        changeMenuVisibility(false);
        menu.inMenu = false;

    });

    godModeButton.addEventListener('click', function () {
        menu.godMode = !menu.godMode;
        godModeButton.textContent = menu.godMode ? 'God Mode: On' : 'God Mode: Off';
    });
    
    shaderButton.addEventListener('click', function () {
        menu.isFlat = !menu.isFlat;
        shaderButton.textContent = menu.isFlat ? 'Shader: Flat' : 'Shader: Toon';
    });
    
    soundButton.addEventListener('click', function () {
        menu.isMuted = !menu.isMuted;
        soundButton.style.background = menu.isMuted ? '#f70000' : '#727272';
        mute();
    });
    
    quitButton.addEventListener('click', function () {
        self.close();
    });
    
    shaderButton.addEventListener('click', function () {
        menu.isPhong = !menu.isPhong;
        updateShader(menu.isPhong);
        shaderButton.textContent = menu.isPhong ? 'Shader: Phong' : 'Shader: Toon';
    });
    



}
export function changeMenuVisibility(visibility){
        const menuContainer = document.querySelector('.container');
        menuContainer.style.display = visibility ? 'flex' : 'none';
    }
    
    
    

    
    
   