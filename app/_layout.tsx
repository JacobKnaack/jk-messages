import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        title: 'Messages'
      }} />
      <Stack.Screen name="outgoing/[email]" options={{
        title: 'Outgoing'
      }}/>
    </Stack>
  );
}
