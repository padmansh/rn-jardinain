import { View, Text } from "react-native";
import React, { forwardRef } from "react";
import { getScaledDimension } from "./helpers";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const SPACE = getScaledDimension(20, "width");

const Brick = forwardRef((props, ref) => {
  const isVisible = useSharedValue(true);
  const layout = useSharedValue({});

  const animatedBrick = useAnimatedStyle(() => {
    const brickHeight = layout.value?.height;
    const brickWidth = layout.value?.width;
    const brickTop = layout.value?.y;
    const brickLeft = layout.value?.x;
    const brickRight = brickLeft + brickWidth;
    const brickBottom = brickTop + brickHeight;

    if (isVisible.value) {
      if (
        ref.y.value <= brickBottom &&
        ref.y.value >= brickBottom - brickHeight / 3 &&
        ref.x.value >= brickLeft &&
        ref.x.value + SPACE <= brickRight
      ) {
        ref.yM.value = ref.yM.value * -1;
        isVisible.value = false;
      } else if (
        ref.y.value + SPACE >= brickTop &&
        ref.y.value + SPACE <= brickTop + brickHeight / 3 &&
        ref.x.value >= brickLeft &&
        ref.x.value + SPACE <= brickRight
      ) {
        ref.yM.value = ref.yM.value * -1;
        isVisible.value = false;
      } else if (
        ref.x.value + SPACE >= brickLeft &&
        ref.x.value + SPACE <= brickLeft + brickWidth / 3 &&
        ref.y.value >= brickTop &&
        ref.y.value + SPACE <= brickBottom
      ) {
        ref.xM.value = ref.xM.value * -1;
        isVisible.value = false;
      } else if (
        ref.x.value <= brickRight &&
        ref.x.value >= brickRight - brickWidth / 3 &&
        ref.y.value >= brickTop &&
        ref.y.value + SPACE <= brickBottom
      ) {
        ref.xM.value = ref.xM.value * -1;
        isVisible.value = false;
      }
    }

    return {
      opacity: isVisible.value ? 1 : 0,
    };
  });

  return (
    <Animated.View
      onLayout={(e) => {
        layout.value = e.nativeEvent.layout;
      }}
      style={[
        {
          backgroundColor: "black",
          height: 1.5 * SPACE,
          width: 3 * SPACE,
          borderRadius: 6,
        },
        animatedBrick,
      ]}
    />
  );
});

export default Brick;
