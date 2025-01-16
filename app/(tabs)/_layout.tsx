import { Tabs } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomTabBar } from '@/components/CustomTabBar';

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen 
          name="index" 
        />
        <Tabs.Screen 
          name="scan"
          options={{
            // Hide tab bar when scan screen is active
            tabBarStyle: { display: 'none' },
            // Make the screen full screen
            headerShown: false,
          }}
        />
         <Tabs.Screen 
          name="about"
          
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
