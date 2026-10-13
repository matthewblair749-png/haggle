import { StyleSheet, View } from 'react-native';

import { colors, radii, space, tones } from '../theme';
import { Icon } from './Icon';
import { Text } from './Text';

export type VerdictKind = 'buy' | 'wait';

const config = {
  buy: { tone: tones.mint, icon: 'check', title: 'Buy now' },
  wait: { tone: tones.sunshine, icon: 'clock', title: 'Wait' },
} as const;

type Props = {
  verdict: VerdictKind;
  /** One short, honest reason. e.g. "Lowest price in 90 days." */
  reason?: string;
};

/** The Buy/Wait verdict. Icon + word + reason, so it never relies on color. */
export function Verdict({ verdict, reason }: Props) {
  const c = config[verdict];
  return (
    <View
      accessible
      accessibilityLabel={`Verdict: ${c.title}.${reason ? ` ${reason}` : ''}`}
      style={[styles.wrap, { backgroundColor: c.tone.edge }]}
    >
      <View style={[styles.face, { backgroundColor: c.tone.fill }]}>
        <View style={styles.iconBubble}>
          <Icon name={c.icon} size={22} color={colors.ink} strokeWidth={3} />
        </View>
        <View style={styles.copy}>
          <Text variant="h3" color={colors.ink} accessibilityRole="text">
            {c.title}
          </Text>
          {reason ? (
            <Text variant="label" color={colors.ink}>
              {reason}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radii.md, paddingBottom: 5 },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderRadius: radii.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
});
