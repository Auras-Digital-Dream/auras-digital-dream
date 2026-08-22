import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* A scanned classical figure, decimated to something a phone could carry if
   we ever showed it one. She stands on white paper, so she cannot be white:
   the stone is cut dark and raked from behind with the site's own gold, which
   is what lifts her off the page without asking the page to change colour. */

/* CC BY 4.0 — uz comercial permis, cu creditul din .statue-credit.
   Phones get a lighter cut of the same scan: at the size she is shown there
   the two are indistinguishable, and it halves what a person on mobile data
   has to fetch. */
const MODEL = "/models/thalia.glb";
const MODEL_NARROW = "/models/thalia-mobil.glb";

/* The scan is modelled facing down its own +X axis, so a quarter turn is what
   brings her face to the camera. Every angle below is written as a distance
   from that, which makes the arc readable: negative is still turning toward
   you, zero is meeting your eye, positive is turning away again. */
const FRONT = Math.PI / 2;

/* Where she is at each point of the band. She enters turned away and deep in
   the page, comes round and forward as you read, meets you near the end, then
   withdraws so she never fights the section that follows. Positions are in
   statue-heights: the model was normalised to exactly one unit tall. */
const KEYS = [
  { at: 0.00, pos: [0.46, -0.02, -1.35], turn: -1.10, scale: 0.94, fade: 0, credit: 0 },
  { at: 0.14, pos: [0.41, 0.00, -0.78], turn: -0.82, scale: 1.00, fade: 1, credit: 0 },
  { at: 0.38, pos: [0.35, 0.02, -0.22], turn: -0.40, scale: 1.06, fade: 1, credit: 0 },
  { at: 0.58, pos: [0.31, 0.00, 0.16], turn: 0.06, scale: 1.11, fade: 1, credit: 0 },
  /* The turn she gained: past meeting your eye she keeps rotating and
     drops a little, as though settling back onto her plinth. */
  { at: 0.78, pos: [0.33, -0.05, 0.24], turn: 0.52, scale: 1.14, fade: 1, credit: 0.35 },
  { at: 0.92, pos: [0.36, -0.07, 0.04], turn: 0.82, scale: 1.09, fade: 1, credit: 1 },
  { at: 1.00, pos: [0.42, -0.08, -0.34], turn: 1.02, scale: 1.04, fade: 0.92, credit: 1 },
];

function sample(t) {
  const clamped = Math.min(Math.max(t, 0), 1);
  let i = 0;
  while (i < KEYS.length - 2 && clamped > KEYS[i + 1].at) i += 1;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const span = b.at - a.at;
  const raw = span === 0 ? 0 : (clamped - a.at) / span;
  /* Smoothstep, so she never changes speed abruptly at a keyframe. */
  const k = raw * raw * (3 - 2 * raw);
  const mix = (from, to) => from + (to - from) * k;
  return {
    pos: [mix(a.pos[0], b.pos[0]), mix(a.pos[1], b.pos[1]), mix(a.pos[2], b.pos[2])],
    rotY: FRONT + mix(a.turn, b.turn),
    scale: mix(a.scale, b.scale),
    fade: mix(a.fade, b.fade),
    credit: mix(a.credit, b.credit),
  };
}

function Figure({ still, narrow }) {
  const group = useRef();
  const last = useRef(-1);
    /* Draco and meshopt both switched off: their decoders are WebAssembly, and
     the site's Content-Security-Policy allows neither wasm-unsafe-eval nor
     blob: connections. The model is quantised instead, which needs no
     decoder at all — see scripts/make-statue.py. */
  const { scene } = useGLTF(narrow ? MODEL_NARROW : MODEL, false, false);
  const canvas = useThree((state) => state.gl.domElement);

  /* Marble is a dielectric, so no metalness; the roughness is high enough to
     read as stone rather than as plastic. Transparent from the start, because
     a material that only becomes transparent mid-scroll re-compiles the
     shader and drops a frame exactly when she is moving fastest. */
  const stone = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#414B54"),
        roughness: 0.58,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.material = stone;
      child.castShadow = false;
      child.receiveShadow = false;
      /* Only compute normals when the file carries none. Recomputing them
         here averages every face meeting at a vertex regardless of the angle
         between them, which on a decimated scan turns each sharp crease into
         a mirror-bright splinter. The exporter already worked them out with
         the full-resolution mesh in hand. */
      if (!child.geometry.attributes.normal) child.geometry.computeVertexNormals();
    });
    return clone;
  }, [scene, stone]);

  /* Damped mouse follow. The target is set by the pointer, the actual value
     chases it — a statue with no inertia reads as a sticker. */
  const aim = useRef({ x: 0, y: 0 });
  const now = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (still) return undefined;
    const onMove = (event) => {
      aim.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      aim.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useFrame((state, delta) => {
    if (!group.current) return;

    /* Progress through the band that owns her, not through the whole page.
       The band is taller than the screen and its inner pane is sticky, so this
       reads 0 as the band's top reaches the viewport and 1 as its bottom does
       — exactly the stretch she is visible for. */
    const band = canvas.closest("[data-statue-band]");
    let progress = 0.5;
    if (band && !still) {
      const rect = band.getBoundingClientRect();
      const view = window.innerHeight;
      /* Two shapes of band, one number. Taller than the screen, the pane is
         sticky and progress is how far the band has slid under it. Shorter
         than the screen — which is what a phone gets — nothing sticks, so
         progress is the band's own passage across the viewport. Reading the
         tall formula on a short band gives a negative travel, and she spends
         the whole section at zero opacity. */
      progress =
        rect.height > view
          ? -rect.top / (rect.height - view)
          : (view - rect.top) / (view + rect.height);
      progress = Math.min(Math.max(progress, 0), 1);
    }
    const frame = sample(progress);

    /* Frame-rate independent easing: the same settle time at 60 and 144 Hz. */
    const ease = 1 - Math.pow(0.0015, delta);
    now.current.x += (aim.current.x - now.current.x) * ease;
    now.current.y += (aim.current.y - now.current.y) * ease;

    const lookX = still ? 0 : now.current.x * 0.14;
    const lookY = still ? 0 : now.current.y * 0.07;

    /* On a narrow screen she is not beside the words but behind them, so
       she stands in the middle of the frame rather than off to one side —
       and the frame is barely half a statue wide, which is why the offset
       cannot simply be reused. */
    const x = narrow ? 0 : frame.pos[0];
    group.current.position.set(x, frame.pos[1], frame.pos[2]);
    group.current.rotation.set(lookY, frame.rotY + lookX, 0);
    group.current.scale.setScalar(frame.scale);
    stone.opacity = still ? 1 : frame.fade;

    /* Her name belongs to the end of the walk, not to the whole of it: the
       band publishes how far along she is, and the credit fades up on it. */
    if (band) band.style.setProperty("--statue-in", still ? "1" : frame.credit.toFixed(3));

    /* Demand rendering: keep drawing only while something is still moving.
       Once the pose and the damped mouse have both settled the loop stops and
       the GPU goes quiet, which is what keeps the page's own scroll animations
       from having to share the frame budget. */
    const settled =
      Math.abs(aim.current.x - now.current.x) < 0.0004 &&
      Math.abs(aim.current.y - now.current.y) < 0.0004 &&
      Math.abs(progress - last.current) < 0.00002;
    last.current = progress;
    if (!settled) state.invalidate();
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

/* Redraw on scroll and on pointer movement. Between those, nothing is asked
   of the GPU at all. */
function WakeOnInput() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const wake = () => invalidate();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("resize", wake);
    };
  }, [invalidate]);
  return null;
}

function Lights() {
  return (
    <>
      {/* Enough ambient that the shadow side is stone, not a hole. */}
      <ambientLight intensity={0.68} color="#DCE9F0" />

      {/* Key: cool daylight from the upper left, the way a window would. */}
      <directionalLight position={[-3.2, 3.6, 2.8]} intensity={2.5} color="#FFFFFF" />

      {/* Rim: the site's gold, raking across the silhouette from behind. This
          is the light doing the actual work of lifting her off the page. */}
      <directionalLight position={[3.4, 1.2, -2.6]} intensity={4.2} color="#C9A86A" />

      {/* A whisper of bounce from below, so the jaw and brow do not go black. */}
      <directionalLight position={[0.4, -2.4, 1.6]} intensity={0.5} color="#BECED1" />
    </>
  );
}

export default function Statue({ className = "", narrow = false }) {
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setStill(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className={`statue-stage ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 34, position: [0, 0, 2.6] }}
        frameloop="demand"
      >
        <Lights />
        <WakeOnInput />
        <Suspense fallback={null}>
          <Figure still={still} narrow={narrow} />
        </Suspense>
      </Canvas>
    </div>
  );
}

