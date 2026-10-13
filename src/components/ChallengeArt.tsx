const labels: Record<string, string> = {
  face: 'A playful face made from a circle and rectangle',
  name: 'An abstract monogram made from chunky shapes',
  poster: 'Four bold colored blocks forming a poster',
  triangle: 'A geometric logo made from three triangles',
  sign: 'A hand-lettered Stay curious sign',
  flower: 'An ink flower with a red center',
};

export function ChallengeArt({ kind }: { kind: string }) {
  return (
    <svg className={`challenge-art art-${kind}`} viewBox="0 0 360 170" role="img" aria-label={labels[kind] ?? 'Geometric design'}>
      {kind === 'face' && (
        <>
          <circle className="fill-mustard ink-stroke" cx="155" cy="85" r="56" />
          <rect className="fill-red ink-stroke" x="175" y="48" width="69" height="80" rx="3" transform="rotate(12 210 85)" />
          <circle className="fill-ink" cx="137" cy="75" r="6" />
          <circle className="fill-ink" cx="181" cy="75" r="6" />
          <path className="ink-stroke no-fill" d="M139 99q20 22 40 0" />
        </>
      )}
      {kind === 'name' && (
        <g transform="translate(93 28)">
          <path className="fill-cream ink-stroke" d="M0 112V0h38l30 43L98 0h38v112H98V59L68 97 38 59v53z" />
          <circle className="fill-mustard ink-stroke" cx="146" cy="97" r="19" />
        </g>
      )}
      {kind === 'poster' && (
        <g transform="translate(108 17) rotate(-6 72 68)">
          <rect className="fill-cream ink-stroke" width="145" height="137" />
          <path className="fill-indigo" d="M3 3h69v66H3z" />
          <path className="fill-red" d="M73 3h69v66H73z" />
          <path className="fill-mustard" d="M3 70h69v64H3z" />
          <path className="fill-green" d="M73 70h69v64H73z" />
          <circle className="fill-cream" cx="72" cy="69" r="34" />
          <path className="ink-stroke no-fill" d="M61 81V54l27 14z" />
        </g>
      )}
      {kind === 'triangle' && (
        <>
          <path className="fill-cream ink-stroke" d="M180 25l-48 86h96z" />
          <path className="fill-red ink-stroke" d="M130 62l-48 86h96z" />
          <path className="fill-mustard ink-stroke" d="M230 62l-48 86h96z" />
        </>
      )}
      {kind === 'sign' && (
        <g transform="rotate(-7 180 85)">
          <rect className="fill-mustard ink-stroke" x="86" y="26" width="188" height="118" rx="8" />
          <text className="fill-ink art-lettering" x="180" y="76" textAnchor="middle">Stay</text>
          <text className="fill-ink art-lettering" x="180" y="119" textAnchor="middle">curious</text>
        </g>
      )}
      {kind === 'flower' && (
        <>
          <path className="ink-stroke no-fill" d="M180 99v56m0-15q-47-2-36-27 24-2 36 27m0-7q36-3 34-27-25-1-34 27" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse key={angle} className="fill-cream ink-stroke" cx="180" cy="48" rx="16" ry="26" transform={`rotate(${angle} 180 78)`} />
          ))}
          <circle className="fill-red ink-stroke" cx="180" cy="78" r="20" />
        </>
      )}
    </svg>
  );
}
