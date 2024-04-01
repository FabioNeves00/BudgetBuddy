import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { authentication } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/contexts";
import { createAccount, getAccount } from "@/firebase/account";

type LoginScreenProps = {
  navigation: any;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const inputRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { setLoggedInUser } = useAuth();

  const handleSignIn = async () => {
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        authentication,
        email,
        password,
      );

      if (!userCredential.user) throw new Error("User not found");

      const account = await getAccount(userCredential.user.uid);
      if (!account) {
        throw new Error("Account not found");
      }
      setLoggedInUser({
        account,
        email,
      });
    } catch (error) {
      //@ts-ignore
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Image
        source={{
          uri: "https://ouch-cdn2.icons8.com/teMbWzQG6l5J7CQqv4TiWL2pvjv9-A1IUmfuhymu3zw/rs:fit:608:456/extend:false/wm:1:re:0:0:0.8/wmid:ouch/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvMzIy/LzEzODJjMmMwLThj/M2YtNGQ4Yy1iODk0/LWRkYTRhMDI3ZGFl/OS5zdmc.png",
        }}
        style={styles.logo}
      />

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#003f5c"
        value={email}
        onChangeText={(email) => setEmail(email)}
      />

      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#003f5c"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.loginText}>Login</Text>
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="white"
            style={{
              alignSelf: "center",
              justifyContent: "center",
              paddingLeft: 10,
            }}
          />
        )}
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={styles.downText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
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
  loginText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  downText: {
    color: "#331ece",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
  },
  signup: {
    alignSelf: "flex-start",
    textDecorationLine: "underline",
    color: "#331ece",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 5,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
