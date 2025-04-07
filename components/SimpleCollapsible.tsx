import { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SimpleCollapsibleProps extends PropsWithChildren {
  collapsed: boolean;
}

export function SimpleCollapsible({ children, collapsed }: SimpleCollapsibleProps) {
  const collapsibleStyle = useAnimatedStyle(() => {
    return {
      maxHeight: !collapsed ? withTiming(1000) : withTiming(0),
      opacity: !collapsed ? withTiming(1) : withTiming(0),
      overflow: 'hidden',
    };
  });

  return (
    <Animated.View style={collapsibleStyle}>
      {children}
    </Animated.View>
  );
} 