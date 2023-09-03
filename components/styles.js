import { Dimensions, StyleSheet } from "react-native";
import { getScaledDimension } from "./helpers";

const SPACE = getScaledDimension(20, "width");
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: SPACE,
    backgroundColor: "#FFF",
  },
  boardStyle: {
    backgroundColor: "black",
    height: SPACE,
    width: WIDTH / 4,
    borderRadius: 99,
  },
  ball: {
    height: SPACE,
    width: SPACE,
    borderRadius: 99,
    backgroundColor: "#888888",
    position: "absolute",
  },
  startContainer: {
    backgroundColor: "red",
    alignSelf: "center",
    position: "absolute",
    top: HEIGHT / 2,
  },
  startButton: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 60,
  },
});

export default styles;
