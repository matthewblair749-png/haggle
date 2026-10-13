import { StyleSheet, View } from 'react-native';

import { colors, radii, space, tones, type Tone } from '../theme';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Props = {
  label: string;
  icon?: IconName;
  tone?: Tone;
  /** Full sentence for screen readers when the visible label is terse. */
  accessibilityLabel?: string;
};

/** Pill badge: always icon + words, never color alone. */
export function Badge({ label, icon, tone = 'mint', accessibilityLabel }: Props) {
  const t = tones[tone];
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.pill, { backgroundColor: t.tint }]}
    >
      {icon ? <Icon name={icon} size={16} color={t.text} strokeWidth={2.6} /> : null}
      <Text variant="caption" color={tone === 'surface' ? colors.text : t.text}>
        {label}
      </Text>
    </View>
  );
}

/** Preset trust and disclosure badges, so wording stays consistent app-wide. */
export const badgePresets = {
  trusted: { label: 'Trusted store', icon: 'shield', tone: 'mint', accessibilityLabel: 'Trusted store: verified returns and secure checkout' },
  freeShipping: { label: 'Free shipping', icon: 'truck', tone: 'mint' },
  coupon: { label: 'Coupon applied', icon: 'tag', tone: 'coral' },
  sponsored: { label: 'Sponsored', icon: 'megaphone', tone: 'grape', accessibilityLabel: 'Sponsored result. This store paid to be shown.' },
  affiliate: { label: 'Affiliate link', icon: 'link', tone: 'grape', accessibilityLabel: 'Affiliate link. Haggle may earn a small commission. It never changes your price or our ranking.' },
  lowestEver: { label: 'Lowest in 90 days', icon: 'sparkle', tone: 'sunshine' },
} as const satisfies Record<string, Props>;

export type BadgePreset = keyof typeof badgePresets;

export function PresetBadge({ preset }: { preset: BadgePreset }) {
  return <Badge {...badgePresets[preset]} />;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: space.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
});
