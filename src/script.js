import './base.css'
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
import {gsap} from 'gsap'
import img1 from './img/l6.jpg'
import img2 from './img/l2.jpg'
import img3 from './img/s4.jpg'
import img4 from './img/s3.jpg'
import img5 from './img/l5.jpg'

let loadingManager = new THREE.LoadingManager()
let gallery = [
    new THREE.TextureLoader(loadingManager).load(img1),
    new THREE.TextureLoader(loadingManager).load(img2),
    new THREE.TextureLoader(loadingManager).load(img3),
    new THREE.TextureLoader(loadingManager).load(img4),
    new THREE.TextureLoader(loadingManager).load(img5),
]

// let texts = [
//
// ]

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

// Material
const material = new THREE.ShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    side: THREE.DoubleSide,

    uniforms:{
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uAccel: { value: new THREE.Vector2(.5, 2)},
        uvRate1: { value: new THREE.Vector2(1 , 1 )},
        uPixels: { value: new THREE.Vector2( window.innerWidth, window.innerHeight )},
        uTexture1: { value: new THREE.TextureLoader().load(img1)},
        uTexture2: { value: new THREE.TextureLoader().load(img2)},
    }
})

// Mesh
const mesh = new THREE.Mesh(geometry, material)
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
})

function raf(){
    position += speed
    speed *= .7;

    let i = Math.round(position)
    let difference = i - position

    position += difference * 0.035
    if (Math.abs(difference) < 0.001){
        position = i;
    }

    gsap.to('.dot' , {
        y: position * 200,
    })
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

    window.requestAnimationFrame(raf)
}
raf();