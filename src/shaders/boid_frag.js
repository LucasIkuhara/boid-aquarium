export default `

precision mediump float;
uniform vec4 color;
uniform vec3 start;
uniform vec2 end;
uniform vec2 resolution;

void main () {

    // Compute position
    vec2 position = resolution.yx / 2.0 + start.xy;

    // 5%
    float distThresholdInPixels = ((resolution[0] + resolution[1]) / 2.0) * 0.006;

    if (distance(position, gl_FragCoord.xy) > distThresholdInPixels) {
    discard;
    }

    gl_FragColor = vec4(position, 0.0, 1.0);

}
`
