/**
 * Responsible for interacting with the canvas element to draw objects on it.
 */
export class Painter {

    /**
     * Generates a new Painter.
     * @param {string} canvasElementId The element id of a canvas element.
     */
    constructor(canvasElementId) {

        // Setup REGL
        const elem = createREGL(document.getElementById(canvasElementId));
        this.canvas = elem;
    }
    
    paint() {
        
        const draw = this.canvas({
            frag:  `
            precision mediump float;
            uniform vec4 color;
            uniform vec2 start;
            uniform vec2 end;
            uniform float intensity;
            uniform vec2 resolution;
            
            void main () {
                gl_FragColor = color;
                return;
                
                if (intensity < 0.0005) discard;
            
                // Converter start e end em valores absolutos
                vec2 startAbs = vec2(start.x * resolution.x, start.y * resolution.x);
                vec2 endAbs = vec2(end.x * resolution.x, end.y * resolution.x);
            
                vec2 pathVec = endAbs - startAbs;
            
                // Vetor ortogonal ao path
                vec2 orthPath = pathVec.yx;
                orthPath.x = -orthPath.x;
            
                // Dado os dois vetores ortogonais pathVec e orthPath, o ponto P, representando
                // a posição do fragmento P' (a, b) pode ser descrito na base {pathVec, orthPath} da seguinte forma:
            
                // P = a*pathVec + b*orthPath =>
            
                // { Px = a*pathVec.x + b*orthPath.x
                // { Py = a*pathVec.y + b*orthPath.y
            
                // Py = a*pathVec.y + b*orthPath.y
                // a = (Py - b*orthPath.y) / pathVec.y
            
                // Px = ((Py - b*orthPath.y) / pathVec.y)*pathVec.x + b*orthPath.x =>
            
                // Posição relativa do fragmento em relação ao ponto inicial
                vec2 delta = vec2(gl_FragCoord.xy) - startAbs;
            
                // Calcular a e b
                float b = (pathVec.y * delta.x - pathVec.x * delta.y) / (orthPath.x * pathVec.y - orthPath.y * pathVec.x);  
                float a = (delta.y - b*orthPath.y) / pathVec.y;
            
                float threshold = 0.015;
            
                // Se b for menor que zero, ou seja, em um dos lados do feixe, retornar o fundo
                // Não foi usado só discard para evitar aliasing
                if (b < 0. ) {
                  if ( a < 0.0 || a > 1.0 ) discard;
                  gl_FragColor = vec4(color.xyz, 1. - smoothstep(0., -threshold, b));
                  return;
                }
                
                // Se a for menor que zero, ou maior que a norma de pathVec, retornar o fundo 
                if ( a < 0.0 || a > 1.0 ) discard;
            
                // Se o fragmento não foi descartado, desenha a intensidade do feixe
                // baseado em b, ou seja, na distância do ponto para uma reta que contenha pathVec
            
            
                // Calcular a intensidade (decaimento quadrático)
                float brightness = (1./pow(b, 2.)) * intensity;
                gl_FragColor = vec4(color.xyz, brightness);
            
            } // End main
            
            `,
        
            vert: `
            attribute vec2 position;
            void main () {
              gl_Position = vec4(position, 0., 1.);
            }`,
        
            attributes: {
              position: [
                [-1, -1],
                [1, -1],
                [1, 1],
                [-1, 1]
              ]
            },
        
            depth: {
              enable: false
            },
        
            primitive: "triangle fan",
        
            blend: {
              enable: false,
              func: {
                srcRGB: "src alpha",
                srcAlpha: 1,
                dstRGB: "one minus src alpha",
                dstAlpha: 1
              }
            },
        
            count: 4,
        
            uniforms: {
              resolution: [500,500],
              intensity: 1,
              start: [1, 3],
              end: [20, 30],
              color: [1.0, 0.5, 0.3, 1.0]
            }
        });
        
        draw();
    }


}
