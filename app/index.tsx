// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
    //  ⬇︎ point to the file that should open first
    //     (tabs)/index.tsx   →  href="/(tabs)/index"
    //     (tabs)/home.tsx    →  href="/(tabs)/home"
    return <Redirect href="/index" />;
}