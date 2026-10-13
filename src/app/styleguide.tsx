import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge, badgePresets, PresetBadge, type BadgePreset } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { Confetti } from '../components/Confetti';
import { CountUp } from '../components/CountUp';
import { Icon } from '../components/Icon';
import { Mascot, MASCOT_MOODS, type MascotMood } from '../components/mascot/Mascot';
import { emitMascot, useMascotStore, type MascotEvent } from '../components/mascot/mascotStore';
import { ResultCardSkeleton, Skeleton } from '../components/Skeleton';
import { Text } from '../components/Text';
import { ToggleRow } from '../components/ToggleRow';
import { Verdict } from '../components/Verdict';
import { feedback } from '../feedback/feedback';
import { StaggerIn } from '../motion/StaggerIn';
import { useSystemReduceMotion } from '../motion/useMotion';
import { useSettings } from '../state/settingsStore';
import { colors, gutter, palette, radii, space, typeScale, type TypeVariant } from '../theme';
import { formatCents } from '../utils/money';

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="h2">{title}</Text>
      {note ? (
        <Text variant="label" color={colors.textSecondary}>
          {note}
        </Text>
      ) : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const swatches: { name: string; fill: string; pressed: string; text?: string; onFill: string; note?: string }[] = [
  { name: 'Coral', fill: palette.coral, pressed: palette.coralPressed, text: palette.coralText, onFill: palette.ink },
  { name: 'Mint', fill: palette.mint, pressed: palette.mintPressed, text: palette.mintText, onFill: palette.ink },
  { name: 'Sunshine', fill: palette.sunshine, pressed: palette.sunshinePressed, text: palette.sunshineText, onFill: palette.ink },
  { name: 'Grape', fill: palette.grape, pressed: palette.grapePressed, text: palette.grapeText, onFill: palette.white, note: 'Decorative fill. Text surfaces use the text shade + white.' },
  { name: 'Ink', fill: palette.ink, pressed: palette.inkPressed, onFill: palette.white },
  { name: 'Cream', fill: palette.cream, pressed: palette.creamPressed, onFill: palette.ink },
];

function Swatch({ s }: { s: (typeof swatches)[number] }) {
  return (
    <View style={styles.swatch} accessible accessibilityLabel={`${s.name}, ${s.fill}`}>
      <View style={[styles.swatchChip, { backgroundColor: s.pressed }]}>
        <View style={[styles.swatchFace, { backgroundColor: s.fill }]}>
          <Text variant="h3" color={s.onFill}>
            Aa
          </Text>
        </View>
      </View>
      <Text variant="label">{s.name}</Text>
      <Text variant="caption" color={colors.textSecondary}>
        {s.fill} · edge {s.pressed}
      </Text>
      {s.text ? (
        <Text variant="caption" color={s.text}>
          text {s.text}
        </Text>
      ) : null}
      {s.note ? (
        <Text variant="caption" color={colors.textSecondary}>
          {s.note}
        </Text>
      ) : null}
    </View>
  );
}

const typeSamples: { v: TypeVariant; sample: string }[] = [
  { v: 'display', sample: 'Your side of the deal.' },
  { v: 'h1', sample: 'Best price found' },
  { v: 'h2', sample: 'Compare stores' },
  { v: 'h3', sample: 'Why this pick' },
  { v: 'bodyLg', sample: 'Paste a link and I’ll check every store.' },
  { v: 'body', sample: 'Includes shipping, tax and coupons. No surprises.' },
  { v: 'label', sample: 'Ships in 2 days' },
  { v: 'caption', sample: 'Updated 3 min ago' },
  { v: 'priceXl', sample: '$249.99' },
  { v: 'price', sample: '$249.99' },
];

const events: { event: MascotEvent; label: string }[] = [
  { event: 'searchStarted', label: 'Search' },
  { event: 'goodPrice', label: 'Good price' },
  { event: 'dealFound', label: 'Deal found' },
  { event: 'priceRose', label: 'Price rose' },
  { event: 'moneySaved', label: 'Saved' },
  { event: 'offline', label: 'Offline' },
  { event: 'ready', label: 'Reset' },
];

export default function StyleGuide() {
  const insets = useSafeAreaInsets();
  const settings = useSettings();
  const systemReduce = useSystemReduceMotion();
  const liveMood = useMascotStore((s) => s.mood);
  const [previewMood, setPreviewMood] = useState<MascotMood>('idle');
  const [saved, setSaved] = useState(12_840);
  const [confetti, setConfetti] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chip, setChip] = useState('Best price');

  const celebrate = () => {
    setSaved((s) => s + 2_350);
    setConfetti((c) => c + 1);
    emitMascot('moneySaved');
    feedback('success');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + space.lg, paddingBottom: insets.bottom + space.xxxl }]}>
        <View style={styles.hero}>
          <Mascot mood={liveMood} size={132} />
          <View style={styles.heroCopy}>
            <Text variant="caption" color={palette.coralText}>
              PHASE 1 · STYLE GUIDE
            </Text>
            <Text variant="display">Haggle</Text>
            <Text variant="bodyLg" color={colors.textSecondary}>
              Your side of the deal.
            </Text>
          </View>
        </View>

        <Section title="Try it" note="Feedback settings apply everywhere. The app has to work well with all three off.">
          <Card>
            <ToggleRow icon="volume" label="Sounds" description="Short chimes for deals and savings" value={settings.soundEnabled} onChange={(v) => settings.set('soundEnabled', v)} />
            <ToggleRow icon="vibrate" label="Haptics" description="Taps you can feel" value={settings.hapticsEnabled} onChange={(v) => settings.set('hapticsEnabled', v)} />
            <ToggleRow
              icon="motion"
              label="Reduce motion"
              description={systemReduce ? 'On in your device settings' : 'Fades instead of movement'}
              value={settings.reduceMotion || systemReduce}
              disabled={systemReduce}
              onChange={(v) => settings.set('reduceMotion', v)}
            />
          </Card>
        </Section>

        <Section title="Mascot" note="Driven by app events. Tap an event and the llama reacts the way it will in the app.">
          <Card contentStyle={styles.center}>
            <Mascot mood={liveMood} size={200} />
            <Text variant="h3">{liveMood}</Text>
            <View style={styles.wrap}>
              {events.map((e) => (
                <Chip key={e.event} label={e.label} onPress={() => emitMascot(e.event)} />
              ))}
            </View>
          </Card>
          <Text variant="h3">All moods</Text>
          <View style={styles.grid}>
            {MASCOT_MOODS.map((m) => (
              <Card key={m} onPress={() => setPreviewMood(m)} padding={space.xs} style={styles.moodCell} contentStyle={styles.center} accessibilityLabel={`Preview ${m}`}>
                <Mascot mood={m} size={96} decorative />
                <Text variant="caption">{m}</Text>
              </Card>
            ))}
          </View>
          <Card contentStyle={styles.center}>
            <Mascot mood={previewMood} size={160} />
            <Text variant="label" color={colors.textSecondary}>
              Preview: {previewMood}
            </Text>
          </Card>
        </Section>

        <Section title="Savings moment" note="Count-up, confetti, celebrating llama, success haptic.">
          <Card tone="surface" contentStyle={styles.center}>
            <Mascot mood={liveMood} size={120} decorative />
            <Text variant="label" color={colors.textSecondary}>
              Total saved
            </Text>
            <CountUp cents={saved} variant="priceXl" color={palette.mintText} />
            <Button label="Simulate a price drop" icon="arrowDown" tone="mint" onPress={celebrate} haptic="none" />
          </Card>
        </Section>

        <Section title="Buttons" note="Press: scale 0.96 + edge collapse in 80ms. Release: spring.">
          <Button label="Find the best price" icon="search" fullWidth onPress={() => {}} />
          <Button label="Set price alert" icon="bell" tone="mint" fullWidth onPress={() => {}} />
          <Button label="Paste a link" icon="link" tone="surface" fullWidth onPress={() => {}} />
          <View style={styles.wrap}>
            <Button label="Sunshine" tone="sunshine" size="md" onPress={() => {}} />
            <Button label="Grape" tone="grape" size="md" onPress={() => {}} />
            <Button label="Ink" tone="ink" size="md" onPress={() => {}} />
          </View>
          <View style={styles.wrap}>
            <Button label="Small" size="sm" onPress={() => {}} />
            <Button label="Disabled" size="sm" disabled />
            <Button
              label="Loading"
              size="sm"
              tone="mint"
              loading={loading}
              onPress={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1600);
              }}
            />
          </View>
        </Section>

        <Section title="Chips">
          <View style={styles.wrap}>
            {['Best price', 'Fastest', 'Trusted only'].map((c) => (
              <Chip key={c} label={c} selected={chip === c} onPress={() => setChip(c)} />
            ))}
          </View>
        </Section>

        <Section title="Cards" note="Result card preview. Lists enter with a 40ms stagger.">
          {[
            { store: 'Parcelbay', total: 24_999, base: 22_999, ship: 0, tax: 2_000, badges: ['trusted', 'freeShipping', 'lowestEver'] as BadgePreset[], best: true },
            { store: 'Brightmart', total: 25_874, base: 23_499, ship: 499, tax: 1_876, badges: ['coupon', 'affiliate'] as BadgePreset[] },
            { store: 'ShopNest', total: 26_350, base: 24_350, ship: 0, tax: 2_000, badges: ['sponsored'] as BadgePreset[] },
          ].map((r, i) => (
            <StaggerIn key={r.store} index={i}>
              <Card onPress={() => {}} accessibilityLabel={`${r.store}, ${formatCents(r.total)} total${r.best ? ', best price' : ''}`}>
                <View style={styles.cardHead}>
                  <View style={[styles.logo, { backgroundColor: [palette.coralTint, palette.mintTint, palette.grapeTint][i] }]}>
                    <Text variant="h3">{r.store[0]}</Text>
                  </View>
                  <View style={styles.flex}>
                    <Text variant="h3">{r.store}</Text>
                    <Text variant="label" color={colors.textSecondary}>
                      {formatCents(r.base)} + {r.ship ? `${formatCents(r.ship)} ship` : 'free ship'} + {formatCents(r.tax)} tax
                    </Text>
                  </View>
                  {r.best ? <Badge label="Best" icon="check" tone="mint" accessibilityLabel="Best price" /> : null}
                </View>
                <View style={styles.priceRow}>
                  <Text variant="price">{formatCents(r.total)}</Text>
                  <Text variant="label" color={colors.textSecondary}>
                    true total
                  </Text>
                </View>
                <View style={styles.wrap}>
                  {r.badges.map((b) => (
                    <PresetBadge key={b} preset={b} />
                  ))}
                </View>
              </Card>
            </StaggerIn>
          ))}
        </Section>

        <Section title="Verdicts" note="Icon + word + reason: never color alone.">
          <Verdict verdict="buy" reason="Lowest price in 90 days." />
          <Verdict verdict="wait" reason="Usually drops ~12% in late November." />
        </Section>

        <Section title="Badges" note="Sponsored and affiliate results are always labeled.">
          <View style={styles.wrap}>
            {(Object.keys(badgePresets) as BadgePreset[]).map((b) => (
              <PresetBadge key={b} preset={b} />
            ))}
          </View>
        </Section>

        <Section title="Loading" note="Shimmer skeletons + thinking llama. Never a bare spinner.">
          <View accessible accessibilityLabel="Loading results" style={styles.loadingRow}>
            <Mascot mood="thinking" size={88} decorative />
            <View style={styles.flex}>
              <Text variant="bodyStrong">Checking 14 stores…</Text>
              <Skeleton width="80%" height={12} />
            </View>
          </View>
          <ResultCardSkeleton />
        </Section>

        <Section title="Type" note="Fredoka for headings and numbers, Nunito for body. Scales with Dynamic Type.">
          {typeSamples.map(({ v, sample }) => (
            <View key={v} style={styles.typeRow}>
              <Text variant="caption" color={colors.textMuted}>
                {v} · {typeScale[v].fontSize}/{typeScale[v].lineHeight}
              </Text>
              <Text variant={v}>{sample}</Text>
            </View>
          ))}
        </Section>

        <Section title="Color" note="Brand fill · pressed edge · AA text shade.">
          <View style={styles.grid}>
            {swatches.map((s) => (
              <Swatch key={s.name} s={s} />
            ))}
          </View>
        </Section>

        <Section title="Shape & space" note="Radii 20–34, 4pt grid, thick bottom edges, no hairlines.">
          <View style={styles.wrap}>
            {Object.entries(radii)
              .filter(([k]) => k !== 'pill')
              .map(([k, r]) => (
                <View key={k} style={[styles.radiusBox, { borderRadius: r }]}>
                  <Text variant="caption">
                    {k} {r}
                  </Text>
                </View>
              ))}
          </View>
          <View style={styles.spaceRow}>
            {Object.entries(space).map(([k, v]) => (
              <View key={k} style={styles.center}>
                <View style={{ width: v, height: v, backgroundColor: palette.grape, borderRadius: 4 }} />
                <Text variant="caption">{v}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Icons">
          <View style={styles.wrap}>
            {(['search', 'link', 'truck', 'tag', 'shield', 'clock', 'bell', 'arrowDown', 'arrowUp', 'sparkle', 'info', 'megaphone', 'wifiOff', 'piggy', 'lock'] as const).map((n) => (
              <View key={n} style={styles.iconCell}>
                <Icon name={n} size={26} />
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>
      <Confetti trigger={confetti} originY={0.3} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: gutter, gap: space.xxl, maxWidth: 640, width: '100%', alignSelf: 'center' },
  hero: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  heroCopy: { flex: 1, gap: 2 },
  section: { gap: space.xs },
  sectionBody: { gap: space.md, marginTop: space.xs },
  center: { alignItems: 'center', gap: space.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  moodCell: { width: '31%' },
  swatch: { width: '31%', gap: 2 },
  swatchChip: { borderRadius: radii.sm, paddingBottom: 6 },
  swatchFace: { height: 72, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  logo: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: space.xxs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.xs, marginVertical: space.sm },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  typeRow: { gap: 2 },
  radiusBox: { width: 84, height: 84, backgroundColor: palette.mintTint, alignItems: 'center', justifyContent: 'center' },
  spaceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, flexWrap: 'wrap' },
  iconCell: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
});
