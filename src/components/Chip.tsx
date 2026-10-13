import { StyleSheet } from 'react-native';

import { colors, depth, radii, space, tones } from '../theme';
import { PressableSurface } from './PressableSurface';
import { Text } from './Text';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

/** Selectable chip. Selection shows as fill AND a check-style weight change plus a11y state. */
export function Chip({ label, selected, onPress }: Props) {
  return (
    <PressableSurface
      tone={selected ? 'ink' : 'surface'}
      radius={radii.pill}
      depth={depth.sm}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
      contentStyle={styles.face}
    >
      <Text variant="label" color={selected ? tones.ink.label : colors.text}>
        {selected ? `✓ ${label}` : label}
      </Text>
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  face: { minHeight: 40, paddingHorizontal: space.md, justifyContent: 'center' },
});
