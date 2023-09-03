import { View, Text, Dimensions, Pressable } from "react-native";
import React, { useCallback } from "react";
import ScreenWrapper from "./ScreenWrapper";
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import styles from "./styles";
import { getScaledDimension } from "./helpers";
import Brick from "./Brick";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const SPACE = getScaledDimension(20, "width");
const BALL_START_POSITION_X = (WIDTH - SPACE) / 1.825;
const BALL_START_POSITION_Y = HEIGHT - 3 * SPACE;
const SPEED = 3;

const bricks = new Array(10).fill(0);

const GameBoard = () => {
  const xFactor = useSharedValue(BALL_START_POSITION_X);
  const xMultiplier = useSharedValue(1);
  const yFactor = useSharedValue(BALL_START_POSITION_Y);
  const yMultiplier = useSharedValue(1);
  const ballOnBoard = useSharedValue(true);

  const animatedSensor = useAnimatedSensor(SensorType.ROTATION);

  const animatedButton = useAnimatedStyle(() => {
    return {
      opacity: ballOnBoard.value ? 1 : 0,
    };
  });

  const animatedBoard = useAnimatedStyle(() => {
    const roll = animatedSensor.sensor.value.roll;
    return {
      transform: [
        {
          translateX:
            (roll * 4.5 * WIDTH) / 8 + Math.abs((0.665 * 4.5 * WIDTH) / 8),
        },
      ],
    };
  });

  const animatedBall = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xFactor.value }, { translateY: yFactor.value }],
    };
  });

  const startGame = useCallback(() => {
    if (ballOnBoard.value) {
      ballOnBoard.value = false;
    }
  }, []);

  useFrameCallback(() => {
    if (ballOnBoard.value) {
      const roll = animatedSensor.sensor.value.roll;
      xFactor.value =
        (roll * 4.5 * WIDTH) / 8 + Math.abs((0.665 * 4.5 * WIDTH) / 5.75);
    } else {
      if (xFactor.value > WIDTH - SPACE || xFactor.value < 0) {
        xMultiplier.value = xMultiplier.value * -1;
      }
      if (yFactor.value < 0) {
        yMultiplier.value = yMultiplier.value * -1;
      }
      if (yFactor.value > BALL_START_POSITION_Y) {
        yMultiplier.value = yMultiplier.value * -1;
      }

      xFactor.value =
        xFactor.value + xMultiplier.value * SPEED * Math.cos(Math.PI / 6);
      yFactor.value =
        yFactor.value + yMultiplier.value * SPEED * Math.sin(Math.PI / 6);
    }
  });

  return (
    <ScreenWrapper>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, margin: SPACE / 2 }}>
          <Animated.View style={[animatedButton, styles.startContainer]}>
            <Pressable onPress={startGame}>
              <Text style={styles.startButton}>Start</Text>
            </Pressable>
          </Animated.View>

          <View
            style={{
              flexDirection: "row",
              rowGap: 4,
              columnGap: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {bricks?.map((_, index) => (
              <Brick
                ref={{
                  x: xFactor,
                  y: yFactor,
                  xM: xMultiplier,
                  yM: yMultiplier,
                }}
                key={index}
              />
            ))}
          </View>
        </View>

        <Animated.View style={[styles.ball, animatedBall]} />

        <Animated.View style={[styles.boardStyle, animatedBoard]} />
      </View>
    </ScreenWrapper>
  );
};

export default GameBoard;
