import './base.css'
import './style.css'
import './loader.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import {gsap} from 'gsap'
import img1 from './img/l6.jpg'
import img2 from './img/l3.jpg'
import img3 from './img/s3.jpg'
import img4 from './img/l2.jpg'
import img5 from './img/l5.jpg'
import imagesLoaded from 'imagesloaded/imagesloaded'

let loadingBar = document.querySelector(".loading-bar")
let loadingManager = new THREE.LoadingManager(
    () => {
        gsap.delayedCall(1,() => {
            gsap.to( overlayMaterial.uniforms.uAlpha, {
                duration: 3,
                value : 0,
            })
            gsap.to(loadingBar, {
                duration: 1,
                delay: .5,
                opacity: 0,
                display: 'none',
            })
            gsap.to('.html__section' , {
                opacity: 1,
            })
        })
    },
    (itemUrl, itemLoaded, itemTotal) => {
        const progressRatio = itemLoaded / itemTotal
        loadingBar.style.transform = `scaleX(${progressRatio})`
        gsap.to(loadingBar, {
            ease: "power2"
        })
        // console.log(progressRatio)
    },
)
let textureLoader = new THREE.TextureLoader(loadingManager)
let gallery = [
    textureLoader.load(img1),
    textureLoader.load(img2),
    textureLoader.load(img3),
    textureLoader.load(img4),
    textureLoader.load(img5),
]

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//  OverLay Screen
const overlayGeometry = new THREE.PlaneGeometry(1, 1, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms: {
        uAlpha: { value: 1 },
    },
    vertexShader: `
        void main()
        {           
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha); 
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
overlay.position.set(0,0,.9)
scene.add(overlay)

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

// Material
const material = new THREE.ShaderMaterial({
    // wireframe: true,
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,

    uniforms:{
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uAccel: { value: new THREE.Vector2(.5, 2)},
        uvRate1: { value: new THREE.Vector2(1 , 1 )},
        uPixels: { value: new THREE.Vector2( window.innerWidth, window.innerHeight )},
        uTexture1: { value: textureLoader.load(img1)},
        uTexture2: { value: textureLoader.load(img2)},
    }
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
// mesh.scale.set(.8,.8,.8)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,1 )
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsedTime * 0.9

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

//  Gsap Progress Animation
let tl = gsap.timeline()
let bodyDom = document.querySelector('body')
// bodyDom.addEventListener('click' , () => {
//     if (bodyDom.classList.contains("done")){
//         tl.to(material.uniforms.uProgress  , {
//             duration: 1,
//             value: 0,
//         })
//         bodyDom.classList.remove('done')
//
//     } else {
//         tl.to(material.uniforms.uProgress  , {
//             duration: 1,
//             value: 1,
//         })
//         bodyDom.classList.add('done')
//
//         console.log(material.uniforms.uProgress.value)
//     }
// })

// Resize Movements
window.addEventListener('resize', resize)
function resize () {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    renderer.setSize(sizes.width, sizes.height)
    camera.aspect = sizes.width / sizes.height

    material.uniforms.uvRate1.value.y = sizes.height / sizes.width

    // Calculate Scene
    let dist = camera.position.z - mesh.position.z
    let height = 1
    camera.fov = 2 * ( 180 / Math.PI ) * Math.atan(height / (2 * dist))

    // if (camera.aspect > 1){
    //     mesh.scale.x = mesh.scale.y = 1.05 * camera.aspect
    // }

    mesh.scale.x = camera.aspect

    // Update camera
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

resize()

// Scroll Movements
let speed = 0
let position = 0

document.addEventListener("wheel" , (event) => {
    speed += event.deltaY * 0.0002
    gsap.to('.scroll', {
        opacity: 0,
    })
    gsap.to('.main__text', {
        duration: 1,
        opacity: 1,
        x: 50,
    })
})

function raf(){
    position += speed
    speed *= .7;

    let i = Math.round(position)
    let difference = i - position

    // difference = difference < 0 ? Math.max(difference,-0.02) : Math.max(difference, +0.02)

    position += difference * 0.035
    // if (Math.abs(difference) < 0.001){
    //     position = i;
    // }

    // gsap.to('.dot' , {
    //     y: position * 200,
    // })

    material.uniforms.uProgress.value = position

    let currentSlide = Math.floor(position)
    let nextSlide = (Math.floor(position) + 1) % gallery.length
    material.uniforms.uTexture1.value = gallery[currentSlide]
    material.uniforms.uTexture2.value = gallery[nextSlide]

    // console.log(currentSlide, nextSlide)

    if (Math.floor(position) > 4 ){
        position = 0
    }
    if ( Math.floor(position) < 0){
        position = 4
    }

    // console.log(Math.floor(position))

    window.requestAnimationFrame(raf)
}
raf();