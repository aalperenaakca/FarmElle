import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { lookAt,flatten } from './MV.js';

export function initLightingAndCamera(characterobj,menu) {
    let lights = {
        dirLight: null,
        spotLightDirection: null,
        spotLightPosition:null,
        spotLightSwitch:false
    };

    //set renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true,physicallyCorrectLights: true, powerPreference:'high-performance' });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapCullFace = THREE.CullFaceBack;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


    //set camera and background
    renderer.setClearColor(0xffffff);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 500 );
    camera.position.set( -4,6,0);
    camera.lookAt( scene.position );
    
    var spotLightCamera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 500 );
    spotLightCamera.position.set( -4,6,0);
    spotLightCamera.lookAt( scene.position );
    
    window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    spotLightCamera.aspect = window.innerWidth / window.innerHeight;
    spotLightCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

    
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 5;
    orbitControls.enablePan = false;
    orbitControls.enableZoom = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    
    const spotLightControl = new OrbitControls(spotLightCamera, renderer.domElement);
    spotLightControl.enableDamping = true;
    spotLightControl.minDistance = 0.1;
    spotLightControl.maxDistance = 0.1;
    spotLightControl.enablePan = false;
    spotLightControl.enableZoom = false;
    spotLightControl.maxPolarAngle = Math.PI / 2 - 0.05;
    spotLightControl.minPolarAngle = Math.PI /3;
    
    
    const orbitControls2 = new OrbitControls(camera, renderer.domElement);
    orbitControls2.enableDamping = true;
    orbitControls2.enableZoom = true;
    orbitControls2.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls2.maxDistance = 50;
    

    //spotligt
    var lmat = lookAt([2,2,2], [orbitControls.target.x,orbitControls.target.y,orbitControls.target.z], [0,1,0]);
    var spotLightDirection = flatten([-lmat[2][0], -lmat[2][1], -lmat[2][2]]);
    var spotLightPosition = flatten([-lmat[2][0], -lmat[2][1], -lmat[2][2]]);
    
   
    


    //Hemilight
    
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    // Directional light that acts as a sun and moon.
    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 0.75, 1 );
    dirLight.position.multiplyScalar( 50 );
    scene.add( dirLight );
    dirLight.shadowCameraVisible = true;
    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.000001;
    dirLight.shadowDarkness = 0.35;
    scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

    var d = 30;

    dirLight.shadowCameraLeft = -d;
    dirLight.shadowCameraRight = d;
    dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;


    scene.fog = new THREE.Fog(0x222233, 0, 20000);
    renderer.setClearColor(scene.fog.color, 1 );
    
    
        //sky Vertex Shader
    var vertexShader = `
        varying vec3 worldPosition;
        void main() {
            vec4 mPosition = modelMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            worldPosition = mPosition.xyz;
    }
`;


    // sky fragment Shader
    var fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;

        varying vec3 worldPosition;

        void main() {

            float h = normalize( worldPosition + offset ).y;
            gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );

}

`;
    
    
    //Adds sky created from SphereGeometry
    var uniforms = {
        topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
        bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
        offset:      { type: "f", value: 33 },
        exponent:    { type: "f", value: 0.6 }
    };
    uniforms.topColor.value.copy( hemiLight.color );
    scene.fog.color.copy( uniforms.bottomColor.value );
    var skyGeo = new THREE.SphereGeometry( 100, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
    var sky = new THREE.Mesh( skyGeo, skyMat );
    sky.material.glslVersion = "THREE.GLSL3";
    sky.name = 'sky';
    
    scene.add( sky );
    

    
    var dayAndNight = true;
    var rotat = 1;
    var time=  Math.PI/2;
    function updateLighting(){
        time += 0.0005*rotat ;
        if ((time > Math.PI-0.06 && dayAndNight) || (time < 0.04 && !dayAndNight))   // day
        {
            dayAndNight = !dayAndNight;
            if(dayAndNight){
                time = 0.01;
                rotat *= -1;
                
            }else if(!dayAndNight){
                time = Math.PI;
                rotat *= -1;
            }
        }
        
        
        // var time = 2.1;
        var nsin = Math.sin(time);
        var ncos = Math.cos(time);

        // set the sun
        dirLight.position.set( 1500*nsin, 2000*nsin, 2000*ncos);

        if(dayAndNight === true){
            if (nsin > 0.2 && time){
                sky.material.uniforms.topColor.value.setRGB(0.25,0.55,1);
                sky.material.uniforms.bottomColor.value.setRGB(1,1,1);
                var f = 1;
                dirLight.intensity = f;
                dirLight.shadowDarkness = f;
        }

            else if (nsin < 0.2 && nsin > 0.0 ){
                var f = (nsin/0.2)*1;
                dirLight.intensity = f;
                dirLight.shadowDarkness = f;
                sky.material.uniforms.topColor.value.setRGB(0.25*f,0.55*f,1*f);
                sky.material.uniforms.bottomColor.value.setRGB(1*f,   1*f,1*f);
            }
            
            
        }else if(dayAndNight === false){
            if (nsin > 0.0){
                sky.material.uniforms.topColor.value.setRGB(0.1,0.1,0.1);
                sky.material.uniforms.bottomColor.value.setRGB(0.1,0.1,0.1);
                var f = 0.2;
                dirLight.intensity = f;
                dirLight.shadowDarkness = f*0.7;
            }
        }
    }
    
    
    var target = new THREE.Vector3();
    
    
    function updateCamera(){
        
        characterobj.character.getWorldPosition(target);
        if(!menu.godMode){
            orbitControls2.enabled = false;
            orbitControls.enabled = true;
            orbitControls.target.set( target.x,target.y+2,target.z);
            spotLightControl.target.set( target.x,target.y+2,target.z);
            orbitControls.update();
            spotLightControl.update();
        }
        else if(menu.godMode){
            orbitControls.enabled = false;
            orbitControls2.enabled = true;
            orbitControls2.update();
        }
        spotLightPosition = [target.x,target.y+3,target.z];
        lmat = lookAt(spotLightPosition, [target.x+4,target.y,target.z], [0,1,0]);
        
        
        var vector = new THREE.Vector3( 0, 0, - 1 );
        vector.applyQuaternion( spotLightCamera.quaternion );
        vector.normalize();
        spotLightDirection = [vector.x, vector.y, vector.z];
        spotLightPosition = [target.x,target.y+5,target.z];
        lights.dirLight = dirLight;
        lights.spotLightDirection = spotLightDirection;
        lights.spotLightPosition = spotLightPosition;
    }
    
    
    lights.dirLight = dirLight;
    lights.spotLightDirection = spotLightDirection;
    lights.spotLightPosition = spotLightControl.target;
    
    return {
        updateLighting: function () {
            updateLighting();
        },
        updateCamera: function () {
            updateCamera();
        },
        renderer:renderer,
        scene:scene,
        camera:camera,
        lights: lights
    };
}
