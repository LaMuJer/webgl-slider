uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform vec2 uPixels;
uniform vec2 uvRate1;
uniform vec2 uAccel;

varying vec2 vUv;
varying vec2 vUv1;
varying vec2 vPosition;

vec2 mirrored(vec2 v){
    vec2 m = mod(v, 2.0);
    return mix(m, 2.0 - m, step(1.0, m) );
}

float triangle(float p){
    return mix(p, 1.0 - p, step(0.5, p)) * 2.0;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / uPixels.xy ;
    float p = fract(uProgress); 
    float delayValue = p * 7. - uv.y * 2. + uv.x - 2.0 ;
    delayValue = clamp(delayValue,0.0,1.0) ;

    vec2 translateValue = p + delayValue * uAccel ;
//    vec2 translateValue1 = vec2(-.5, 1.) * translateValue;
//    vec2 translateValue2 = vec2(-.5, 1.) * (translateValue - 1. - uAccel);

    vec2 w = sin(sin(uTime) * vec2(0., 0.3) + vUv.yx * vec2(0, 4.)) * vec2(0., 0.5);
    vec2 xy = w * (triangle(p) * .5 + triangle(delayValue) * .5);

    vec4 texture1 = texture2D(uTexture1, mirrored(vec2(vUv.x , vUv.y + translateValue * translateValue )+ xy ));
    vec4 texture2 = texture2D(uTexture2, mirrored(vec2(vUv.x , vUv.y + ((translateValue * delayValue ) - 1.)* .08 )+ xy )) ;

//    vec4 texture1 = texture2D(uTexture1, vUv * translateValue1);
//    vec4 texture2 = texture2D(uTexture2, vUv * translateValue2 );

    vec4 mixTexture = mix(texture1, texture2, delayValue);
    gl_FragColor = mixTexture ;
//    gl_FragColor = vec4(triangle(uProgress));
}