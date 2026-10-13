import { Redirect } from 'expo-router';

// Phase 1: the app opens on the living style guide. Phase 2 replaces this with onboarding/home.
export default function Index() {
  return <Redirect href="/styleguide" />;
}
