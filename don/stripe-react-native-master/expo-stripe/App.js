import { StripeProvider } from "@stripe/stripe-react-native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Payment from "./components/Payment";

export default function App() {
  return (
    <View style={styles.container}>
      <StripeProvider publishableKey="pk_test_51P8sr2Koiz7zeXxQu3ht4r78SMB2CuVV46tg6TFkDEfWnkRvEPb1CisOQjXoWopT9mZQ6mx8H0Zs0BgwG6nR9Mqj00Asi5cv0Y">
        <Payment />
      </StripeProvider>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
