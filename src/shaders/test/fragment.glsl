varying vec2 vUv;
uniform float uTime;

void main()
{
    float strength = vUv.y ;
//    float colorProgress = vUv.y + 1.0;
    gl_FragColor = vec4(strength,strength,strength, 1.0);
}