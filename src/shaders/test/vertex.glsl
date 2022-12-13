
varying vec2 vUv;

void main()
{
    vUv = uv;
//    vec2 _uv = uv - 0.5;
//    vUv1 = _uv;
//    vUv1 *= uvRate1;
//    vUv1 += 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}