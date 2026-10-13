import { Redirect } from 'expo-router';

// Unknown links (old deep links, typos) go home instead of showing a dead end.
export default function NotFound() {
  return <Redirect href="/" />;
}
