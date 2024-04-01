import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";

import { useAuth } from "@/contexts";
import { authentication } from "@/firebase";
import { signOut } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";

import { Spendings } from "@/components/spendings";
import { Feather } from "@expo/vector-icons";

type HomeScreenProps = {
  navigation: any;
};

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { loggedInUser, setLoggedInUser } = useAuth();

  const signOutUser = () => {
    signOut(authentication)
      .then((res) => {
        setLoggedInUser(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather name="menu" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOutUser}>
              <MaterialIcons name="logout" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Welcome, {loggedInUser?.account.name}
            </Text>
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.spendingContainer}>
            <Text style={styles.price}>
              {loggedInUser?.account.spendings
                .reduce((acc, curr) => acc + curr.amount, 0)
                .toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
            </Text>
            <Text style={styles.subTitlePrice}>Sum of monthly expenses</Text>
          </View>

          <Spendings />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spendingContainer: {
    backgroundColor: "#C693E9",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 35,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  header: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    backgroundColor: "#8A19D6",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  subTitlePrice: {
    marginTop: 5,
    fontSize: 12,
    color: "#3A3A3E",
  },
  price: {
    fontSize: 30,
    fontWeight: "bold",
  },
  titleContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
  },
  wrapper: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#302298",
    borderRadius: 20,
    padding: 10,
    margin: 14,
    width: "78%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  signOutText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
});
