uniform float uTime;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTexture3;
uniform vec2 uPixels;
uniform vec2 uvRate1;

varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vPosition;

void main()
{
    vUv = uv;
//    vec2 _uv = uv - 0.5;
//    vUv1 = _uv;
//    vUv1 *= uvRate1;
//    vUv1 += 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}