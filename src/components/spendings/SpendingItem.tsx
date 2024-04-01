import { useAuth } from "@/contexts";
import RNPickerSelect from "react-native-picker-select";
import { useState } from "react";
import {
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TextInput,
} from "react-native";

type SpendingsProps = {
  navigation: any;
};

export const SpendingItem = ({ navigation }: SpendingsProps) => {
  const { loggedInUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    //create a screen to create a transaction
    <View style={styles.container}></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 24,
  },
});
