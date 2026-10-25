"use client";
// ============================================================
// ANDEAN TEXTILE DIVIDER — a raw WebGL fragment shader weaving
// diamonds, stepped zig-zags and stripes in the brand palette.
// It drifts like fabric in the wind; pauses when off-screen.
// ============================================================
import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t;
vec3 terracotta = vec3(0.757, 0.314, 0.180);
vec3 ochre      = vec3(0.831, 0.635, 0.298);
vec3 valley     = vec3(0.243, 0.337, 0.255);
vec3 bone       = vec3(0.961, 0.945, 0.910);
vec3 ink        = vec3(0.051, 0.051, 0.051);

void main(){
  vec2 uv = gl_FragCoord.xy / r.y;           // square cells, height = 1
  uv.x += t * 0.04;                          // slow drift
  uv.y += sin(uv.x * 3.0 + t * 0.8) * 0.015; // fabric wave
  float y = fract(uv.y);
  vec3 col = ink;

  // Outer stripes
  if (y < 0.08 || y > 0.92) col = terracotta;
  else if (y < 0.12 || y > 0.88) col = bone;
  else if (y < 0.20 || y > 0.80) {
    // Stepped zig-zag band (pixel-woven look)
    vec2 g = floor(vec2(uv.x * 28.0, y * 28.0));
    float zz = abs(mod(g.x, 8.0) - 4.0);
    float row = y < 0.5 ? g.y - 3.0 : 24.0 - g.y;
    col = (abs(row - zz * 0.5) < 1.0) ? ochre : valley;
  } else {
    // Central diamonds (rhombus motif with nested eye)
    float cx = fract(uv.x * 1.6) - 0.5;
    float cy = (y - 0.5) / 0.6;
    float d = abs(cx) * 1.2 + abs(cy);
    float q = floor(d * 8.0);
    col = mod(q, 2.0) < 1.0 ? terracotta : ink;
    if (d < 0.18) col = ochre;
    if (d < 0.08) col = bone;
    if (q > 3.0) col = mix(ink, valley, 0.6);
  }
  // Thread texture
  float thread = 0.9 + 0.1 * sin(gl_FragCoord.x * 2.2) * sin(gl_FragCoord.y * 2.2);
  gl_FragColor = vec4(col * thread, 1.0);
}`;

export default function TextileDivider() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current!;
    const gl = c.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r"), uT = gl.getUniformLocation(prog, "t");

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, visible = false;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      gl.viewport(0, 0, c.width, c.height);
    };
    const frame = (ms: number) => {
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uT, reduced ? 0 : ms / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };
    resize();
    frame(0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(c);
    addEventListener("resize", resize);
    return () => { io.disconnect(); cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvas} className="block h-16 w-full md:h-24" aria-hidden />;
}
