import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '../theme';

/**
 * A small hand-drawn icon set on a 24 grid with chunky round strokes, so it
 * matches the type and costs no icon-font download.
 */
const paths = {
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  search: ['M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z', 'M15.5 15.5L20 20'],
  link: ['M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1', 'M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1'],
  truck: ['M3 7h11v9H3z', 'M14 10h4l3 3v3h-7', 'M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'],
  tag: ['M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z', 'M8 8.5h.01'],
  shield: ['M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z', 'M8.5 12l2.5 2.5 4.5-5'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  bell: ['M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z', 'M10 20.5a2.2 2.2 0 0 0 4 0'],
  arrowDown: ['M12 5v14', 'M6 13l6 6 6-6'],
  arrowUp: ['M12 19V5', 'M6 11l6-6 6 6'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
  sparkle: ['M12 3v5', 'M12 16v5', 'M3 12h5', 'M16 12h5', 'M6 6l2.5 2.5', 'M15.5 15.5L18 18', 'M18 6l-2.5 2.5', 'M8.5 15.5L6 18'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5', 'M12 7.5h.01'],
  megaphone: ['M4 10v4h3l7 4V6l-7 4z', 'M17.5 9.5a3.5 3.5 0 0 1 0 5'],
  wifiOff: ['M3 3l18 18', 'M8.5 16a5 5 0 0 1 7 0', 'M5 12.5a10 10 0 0 1 4-2.3', 'M19 12.5a10 10 0 0 0-3-2', 'M12 19.5h.01'],
  piggy: ['M5 11a6.5 5.5 0 0 1 12-2.5h2v3l-1.5 1V16h-3v2h-2.5v-1.5h-3V18H6.5v-2.5A5 5 0 0 1 5 11z', 'M14 10.5h.01', 'M9 7.5h4'],
  volume: ['M4 9.5v5h3.5L12 18V6L7.5 9.5z', 'M15.5 9a4 4 0 0 1 0 6', 'M18 6.5a7.5 7.5 0 0 1 0 11'],
  vibrate: ['M8 4h8v16H8z', 'M4.5 8v8', 'M19.5 8v8'],
  motion: ['M4 12c2.5-5 5.5-5 8 0s5.5 5 8 0'],
  lock: ['M6 11h12v9.5H6z', 'M8.5 11V8a3.5 3.5 0 0 1 7 0v3'],
  chevronRight: ['M9.5 6l6 6-6 6'],
} as const;

export type IconName = keyof typeof paths;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color = colors.ink, strokeWidth = 2.4 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {paths[name].map((d) => (
        <Path key={d} d={d} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {name === 'info' || name === 'tag' ? <Circle cx={name === 'tag' ? 8 : 12} cy={name === 'tag' ? 8.5 : 7.5} r={1.2} fill={color} /> : null}
    </Svg>
  );
}
