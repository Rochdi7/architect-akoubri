/* Where is this running? Decided once at mount; the scene never re-tiers
   itself except to lower its own pixel ratio when frames run long. */

const mq = (query) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;

export function detectEnvironment() {
  const mobile = mq('(max-width: 767px)');
  const tablet = !mobile && mq('(max-width: 1023px)');
  const reduced = mq('(prefers-reduced-motion: reduce)');
  const pointerFine = mq('(hover: hover) and (pointer: fine)');
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const saveData = Boolean(nav.connection && nav.connection.saveData);

  let tier = 'high';
  if (tablet || cores <= 4) tier = 'mid';
  if (mobile) tier = cores <= 4 || memory <= 3 ? 'low' : 'mid';
  if (saveData) tier = 'low';

  return { mobile, tablet, reduced, pointerFine, tier };
}

export function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    // Software renderers (SwiftShader, Mesa llvmpipe) technically work but
    // cannot hold a shadowed scene at 60 fps; the drawing is the better page.
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
      if (/swiftshader|llvmpipe|software/i.test(r)) return false;
    }
    return true;
  } catch {
    return false;
  }
}
