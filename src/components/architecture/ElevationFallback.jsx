import { useMemo } from 'react';
import { projectBounds } from '../../data/spatialStories';

/* The study as an architect's elevation, drawn from the same piece list the
   3D scene builds from. It is the page's first frame while the WebGL chunk
   loads — the model then rises out of its own drawing — and the whole
   section when there is no usable WebGL at all. */

const FILL = {
  concrete: '#d9cdb6',
  plaster: '#ebe6dc',
  earth: '#8d6b5c',
  graphite: '#5a5957',
  paving: '#ddd7cc',
  plinth: '#f1ece3',
  wood: '#c0a078',
  walnut: '#7d5a44',
  metal: '#4a4d52',
  brass: '#b8996a',
  dark: '#2b2f34',
  marble: '#e6e0d6',
  marbleDark: '#3a3b3e',
  fabric: '#c4b8a6',
  cement: '#cfc8bc',
  light: '#fff0d8',
  glass: '#b9c4cb',
  water: '#b6c6cd',
};

function build(project) {
  const b = projectBounds(project);
  const prims = [];
  project.pieces.forEach((pc) => {
    // A cut-away shell is drawn at the height the scroll leaves it, so the
    // sectional model reads as a section here too.
    const keep = pc.anim === 'sink' ? pc.keep ?? 0.4 : 1;
    pc.prims.forEach((p) => {
      if (p.fine) return;
      const zc = p.k === 'b' ? p.z + p.d / 2 : p.z;
      prims.push({ ...p, h: p.h * keep, zc });
    });
  });
  // Painter's order: the far side of the plot first, the street side last.
  prims.sort((a, c) => a.zc - c.zc);

  const padX = 1.5;
  const x0 = Math.min(b.minX, -16) - padX;
  const x1 = Math.max(b.maxX, 16) + padX;
  const top = b.maxY + 1.2;
  const bottom = 1.1; // plinth + ground line
  return {
    prims,
    // y is flipped inside the drawing group, so the box is expressed upside down.
    viewBox: `${x0} ${-top} ${x1 - x0} ${top + bottom}`,
  };
}

export default function ElevationFallback({ project }) {
  const { prims, viewBox } = useMemo(() => build(project), [project]);
  const stroke = 'rgba(15, 36, 62, 0.55)';

  return (
    <svg
      className="ss-elev"
      viewBox={viewBox}
      role="img"
      aria-label={`Élévation principale — ${project.title}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="scale(1 -1)" stroke={stroke} strokeWidth="0.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round">
        <rect x={-16} y={-0.5} width={32} height={0.5} fill={FILL.plinth} vectorEffect="non-scaling-stroke" />
        {prims.map((p, i) =>
          p.k === 'b' ? (
            <rect
              key={i}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              fill={FILL[p.m] || FILL.concrete}
              fillOpacity={p.m === 'glass' || p.m === 'water' ? 0.7 : 1}
              vectorEffect="non-scaling-stroke"
            />
          ) : (
            <rect
              key={i}
              x={p.x - p.r}
              y={p.y}
              width={p.r * 2}
              height={p.h}
              fill={FILL[p.m] || FILL.concrete}
              vectorEffect="non-scaling-stroke"
            />
          )
        )}
        <line x1={-24} y1={-0.5} x2={24} y2={-0.5} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
