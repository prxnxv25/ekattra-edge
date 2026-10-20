export const VERTEX = /* glsl */ `
  uniform float uTime, uMix, uIntro, uPx, uTheme, uAlpha;
  uniform vec2 uMouse;
  uniform vec3 uAct;
  attribute vec3 aFrom, aTo, aScatter;
  attribute float aRnd, aCluster;
  varying vec3 vCol;
  varying float vA;
  const vec3 INK = vec3(.082, .086, .11), PAPER = vec3(.957, .945, .918), ACC = vec3(.784, .267, .165);

  void main() {
    float m = smoothstep(0., 1., clamp(uMix * 1.6 - aRnd * .6, 0., 1.));
    vec3 p = mix(aFrom, aTo, m);
    float g = smoothstep(0., 1., clamp(uIntro * 1.5 - aRnd * .5, 0., 1.));
    p = mix(aScatter, p, g);
    p += .028 * vec3(sin(uTime * .6 + aRnd * 40.), cos(uTime * .5 + aRnd * 31.), sin(uTime * .4 + aRnd * 17.));

    vec4 wp = modelMatrix * vec4(p, 1.);
    vec2 d = wp.xy - uMouse;
    float fl = exp(-dot(d, d) * 3.2);
    wp.xy += normalize(d + 1e-4) * fl * .32;
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;

    vec3 onehot = vec3(step(abs(aCluster), .5), step(abs(aCluster - 1.), .5), step(abs(aCluster - 2.), .5));
    float act = dot(uAct, onehot);
    float anyAct = max(uAct.x, max(uAct.y, uAct.z));
    float accent = step(.94, aRnd);

    vec3 ink = mix(INK, PAPER, uTheme);
    vCol = mix(ink, ACC, clamp(accent + act * .9 + fl * .5, 0., 1.));
    vA = uAlpha * (.38 + .5 * aRnd) * mix(1., .4 + act * 1.2, anyAct) + fl * .35;
    gl_PointSize = (1.7 + aRnd * 1.7) * (1. + act * .45 + accent * .5) * uPx * (9. / -mv.z);
  }`;

export const FRAGMENT = /* glsl */ `
  varying vec3 vCol;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - .5);
    if (d > .5) discard;
    gl_FragColor = vec4(vCol, vA * smoothstep(.5, .12, d));
  }`;