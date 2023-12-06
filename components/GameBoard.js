import { View, Text, Dimensions, Pressable } from "react-native";
import React, { useCallback } from "react";
import ScreenWrapper from "./ScreenWrapper";
import Animated, {
  Extrapolation,
  SensorType,
  interpolate,
  useAnimatedSensor,
  useAnimatedStyle,
  useDerivedValue,
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

const bricks = new Array(35).fill(0);

const extrapolation = {
  extrapolateLeft: Extrapolation.CLAMP,
  extrapolateRight: Extrapolation.CLAMP,
};

const GameBoard = () => {
  const xFactor = useSharedValue(BALL_START_POSITION_X);
  const xMultiplier = useSharedValue(1);
  const yFactor = useSharedValue(BALL_START_POSITION_Y);
  const yMultiplier = useSharedValue(1);
  const boardXFactor = useSharedValue(0);
  const ballOnBoard = useSharedValue(true);
  const ballAngle = useSharedValue(Math.PI / 6);

  const animatedSensor = useAnimatedSensor(SensorType.ROTATION);

  const animatedButton = useAnimatedStyle(() => {
    return {
      opacity: ballOnBoard.value ? 1 : 0,
    };
  });

  const animatedBoard = useAnimatedStyle(() => {
    const roll = animatedSensor.sensor.value.roll;
    boardXFactor.value =
      (roll * 4.5 * WIDTH) / 8 + Math.abs((0.665 * 4.5 * WIDTH) / 8);
    return {
      transform: [
        {
          translateX: boardXFactor.value,
        },
      ],
    };
  });

  const animatedBall = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xFactor.value }, { translateY: yFactor.value }],
    };
  });

  const normalAngle = useDerivedValue(() => {
    return interpolate(
      xFactor.value + SPACE / 2,
      [boardXFactor.value, boardXFactor.value + WIDTH / 4],
      [-Math.PI / 4, Math.PI / 4],
      extrapolation
    );
  }, []);

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
        if (
          (xFactor.value > boardXFactor.value &&
            xFactor.value < boardXFactor.value + WIDTH / 4) ||
          (xFactor.value + SPACE > boardXFactor.value &&
            xFactor.value + SPACE < boardXFactor.value + WIDTH / 4)
        ) {
          yMultiplier.value = yMultiplier.value * -1;
          ballAngle.value = interpolate(
            ballAngle.value - normalAngle.value,
            [0, 2 * Math.PI],
            [Math.PI / 6, (5 * Math.PI) / 6]
          );
        } else {
          //game over
          yMultiplier.value = yMultiplier.value * 0;
          xMultiplier.value = xMultiplier.value * 0;

          xFactor.value = BALL_START_POSITION_X;
          yFactor.value = BALL_START_POSITION_Y;
          ballOnBoard.value = true;
          xMultiplier.value = 1;
          yMultiplier.value = 1;
          ballAngle.value = Math.PI / 6;
        }
      }

      xFactor.value =
        xFactor.value + xMultiplier.value * SPEED * Math.cos(ballAngle.value);
      yFactor.value =
        yFactor.value + yMultiplier.value * SPEED * Math.sin(ballAngle.value);
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
