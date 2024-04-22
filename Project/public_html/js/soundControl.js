import * as THREE from 'three';

let sounds = {
    soundArray: 0
};

export function initSound(camera){
    const listener = new THREE.AudioListener();
    camera.add( listener );
    // create a global audio source
    const backgroundSound = new THREE.Audio( listener );
    const stepSound = new THREE.Audio( listener );
    sounds.soundArray = [backgroundSound, stepSound];
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    
    
    function backSound(){
        audioLoader.load( './sounds/Minecraft.mp3', function( buffer ) {
                backgroundSound.setBuffer( buffer );
                backgroundSound.setLoop( true );
                backgroundSound.setVolume( 0.5 );
                backgroundSound.play();
        });
    }
    
    audioLoader.load( './sounds/footsteps.mp3', function( buffer ) {
            stepSound.setBuffer( buffer );
            stepSound.setLoop( true );
            stepSound.setVolume( 1 );
    });
    
    function moveSound(){
        if(!stepSound.isPlaying){
            stepSound.play();
        }
    }
    
    function stopMoveSound(){
        stepSound.stop();
    }
    
    
    return {
        backSound: function () {
            backSound();
        },
        moveSound: function () {
            moveSound();
        },
        stopMoveSound: function () {
            stopMoveSound();
        },
        listener:listener,
        loader:audioLoader
    };
}
   
export function mute(){
    sounds.soundArray.forEach(sound => {
        sound.setVolume(sound.getVolume() === 0 ? 0.5 : 0);
    });
}



