import GameBoard from "./components/GameBoard";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <GameBoard />
    </SafeAreaProvider>
  );
}
