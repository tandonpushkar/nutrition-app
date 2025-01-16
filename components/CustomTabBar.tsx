import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSequence,
  withTiming,
  withSpring,
  useSharedValue,
  interpolate
} from 'react-native-reanimated';
import Images from "@/assets/images";

export function CustomTabBar({ state, navigation, descriptors }: any) {
  // Get the current route
  const currentRoute = state.routes[state.index];
  // Check if tab bar should be hidden
  const tabBarStyle = descriptors[currentRoute.key].options.tabBarStyle;
  
  // If tabBarStyle has display: 'none', don't render the tab bar
  if (tabBarStyle?.display === 'none') {
    return null;
  }

  const tabs = [
    {
      name: 'index',
      icon: Images.streak,
      label: 'Streaks',
    },
    {
      name: 'scan',
      icon: Images.scan,
    },
    {
      name: 'about',
      icon: Images.about,
      label: 'About',
    },
  ];

  // Add shared values for each tab
  const scaleValues = tabs.map(() => useSharedValue(1));
  const rotateValues = tabs.map(() => useSharedValue(0));
  const colorValues = tabs.map(() => useSharedValue(0));

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        let icon = tab.name === 'scan' || tab.name === 'about' ? tab.icon : isFocused ? Images.streak_active : Images.streak;

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { scale: scaleValues[index].value },
            { rotate: `${rotateValues[index].value}deg` }
          ],
          opacity: interpolate(
            colorValues[index].value,
            [0, 1],
            [1, 0.7]
          )
        }));

        return (
          <Pressable
            key={tab.name}
            style={styles.tabItem}
            onPress={() => {
              // Scale animation
              scaleValues[index].value = withSequence(
                withTiming(0.85, { duration: 100 }),
                withSpring(1, { 
                  damping: 10,
                  stiffness: 200
                })
              );
              
              // Rotation animation
              rotateValues[index].value = withSequence(
                withTiming(-15, { duration: 50 }),
                withTiming(15, { duration: 100 }),
                withSpring(0, { 
                  damping: 5,
                  stiffness: 200
                })
              );

              // Opacity/color animation
              colorValues[index].value = withSequence(
                withTiming(1, { duration: 100 }),
                withTiming(0, { duration: 100 })
              );

              navigation.navigate(tab.name);
            }}
          >
            <Animated.Image
              {...(tab.name === 'about' && {tintColor: isFocused ? '#E29523' : '#565656'})}
              source={icon} 
              style={[
                styles.icon,
                animatedStyle,
                tab.name === 'scan' ? { width: 48, height: 48 } : { width: 24, height: 24 },

              ]}
            />
            {tab.label ? (
              <Text style={[
                styles.label,
                { color: isFocused ? '#141414' : '#565656' }
              ]}>
                {tab.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
}); 