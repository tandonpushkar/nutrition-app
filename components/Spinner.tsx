import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';

interface SpinnerDashProps {
  index: number;
  totalDashes: number;
  progress: Animated.SharedValue<number>;
}

const SpinnerDash = ({ index, totalDashes, progress }: SpinnerDashProps) => {
  const rotation = (index * (360 / totalDashes));
  const dashStyle = useAnimatedStyle(() => {
    const dashProgress = (progress.value + index) % totalDashes;
    const opacity = interpolate(
      dashProgress,
      [0, totalDashes * 0.2, totalDashes * 0.5],
      [1, 0.5, 0.2]
    );

    return {
      opacity,
      transform: [
        { rotate: `${rotation}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        width: 4,
        height: 24,
        backgroundColor: index < totalDashes / 2 ? '#66BB6A' : '#FFA726',
        borderRadius: 2,
        left: '50%',
        top: 0,
        marginLeft: -2,
        transformOrigin: '60% 70px',
      }, dashStyle]}
    />
  );
};

interface SpinnerProps {
  size?: number;
  color?: string;
  duration?: number;
}

export const Spinner = ({ 
  size = 120, 
  color = '#4CAF50',
  duration = 2000 
}: SpinnerProps) => {
  const progress = useSharedValue(0);
  const totalDashes = 30;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(totalDashes, {
        duration,
        easing: Easing.linear,
      }),
      -1
    );
  }, [duration]);

  return (
    <View style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {Array.from({ length: totalDashes }).map((_, index) => (
        <SpinnerDash
          key={index}
          index={index}
          totalDashes={totalDashes}
          progress={progress}
        />
      ))}
    </View>
  );
}; 