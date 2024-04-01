import { SpendingType } from "@/@types";
import { useAuth } from "@/contexts";
import {
  createSpending,
  deleteSpending,
  updateSpending,
} from "@/firebase/spending";
import { uuid } from "expo-modules-core";
import { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { Feather } from '@expo/vector-icons';

export function Spendings() {
  const { loggedInUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [idContent, setIdContent] = useState<string | null>(null);

  const cleanInput = () => {
    setDescription("");
    setAmount(0);
    setSelectedValue(null);
    setIdContent(null);
  };

  const handleDeleteSpending = async (id: string) => {
    try {
      setLoading(true);
      await deleteSpending(loggedInUser!.account.userId, id);
    } catch (error) {
      //@ts-ignore
      Alert.alert("Error", error.message);
      //@ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
      cleanInput();
      setError(null);
      refreshUser();
    }
  };

  const handleUpdateSpending = async () => {
    const newSpend = {
      id: idContent!,
      description,
      amount,
      category: selectedValue!,
      date: new Date().toLocaleDateString("pt-Br", { dateStyle: "short" }),
    } satisfies SpendingType;

    try {
      setLoading(true);
      await updateSpending(loggedInUser!.account.userId, newSpend, idContent!);
    } catch (error) {
      //@ts-ignore
      Alert.alert("Error", error.message);
      //@ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
      setModalVisible(false);
      cleanInput();
      setError(null);
      refreshUser();
    }
  };

  const handleNewSpend = async () => {
    const newSpend = {
      id: uuid.v4(),
      description,
      amount,
      category: selectedValue!,
      date: new Date().toLocaleDateString("pt-Br", { dateStyle: "short" }),
    } satisfies SpendingType;

    try {
      setLoading(true);
      await createSpending(loggedInUser!.account.userId, newSpend);
    } catch (error) {
      //@ts-ignore
      Alert.alert("Error", error.message);
      //@ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
      cleanInput();
      setError(null);
      refreshUser();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.downText}>Your expenses</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ New Expense</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          cleanInput();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => {
                cleanInput();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.buttonCloseText}>X</Text>
            </TouchableOpacity>
            <View style={styles.modalWrapper}>
              <Text style={styles.modalText}>
                {idContent ? "Edit" : "New"} Expense
              </Text>

              <TextInput
                style={[styles.input, styles.inputDescription]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount"
                value={amount.toString()}
                onChangeText={(text) => {
                  if (!Number(text)) return;
                  setAmount(Number(text));
                }}
              />
              <Text style={styles.downText}>Select an option:</Text>
              <RNPickerSelect
                placeholder={{ label: "Select a category", value: null }}
                items={
                  loggedInUser?.account.categories.map((category) => ({
                    label: category.name,
                    value: category.name,
                  }))!
                }
                onValueChange={(value) => setSelectedValue(value)}
                value={selectedValue}
              />
              <Text style={styles.error}>{error}</Text>

              <TouchableOpacity
                style={
                  description.length === 0 || amount <= 0 || loading
                    ? [styles.button, styles.buttonDisabled]
                    : [styles.button]
                }
                onPress={idContent ? handleUpdateSpending : handleNewSpend}
                disabled={description.length === 0 || amount <= 0 || loading}
              >
                <Text style={styles.buttonText}>
                  {idContent ? "Edit" : "Create"}
                </Text>
                {loading && (
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
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={loggedInUser?.account.spendings}
        style={{
          marginBottom: 15,
        }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.spendingContainer}
              onPress={() => {
                if (loading) return;
                setDescription(item.description);
                setAmount(item.amount);
                setSelectedValue(item.category);
                setModalVisible(true);
                setIdContent(item.id);
              }}
            >
              <View style={styles.spendingWrapper}>
                <View>
                  <Text
                    style={{
                      marginBottom: 5,
                    }}
                  >
                    {item.description}
                  </Text>
                  <Text
                    style={{
                      color: "#8A19D6",
                    }}
                  >
                    {item.category}
                  </Text>
                </View>

                <Text
                  style={{
                    fontWeight: "bold",
                    marginHorizontal: 10,
                  }}
                >
                  {item.amount.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteSpending(item.id);
                }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  height: "100%",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color="#8A19D6"
                    style={{
                      alignSelf: "center",
                      justifyContent: "center",
                      paddingLeft: 10,
                    }}
                  />
                ) : (
                  <Feather name="trash-2" size={24} color="black" />
                )}
                
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        keyExtractor={() => uuid.v4()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: "red",
    marginBottom: 10,
  },
  spendingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    borderColor: "#8D8D99",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  container: {
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inputDescription: {
    height: 90,
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonDisabled: {
    backgroundColor: "#8D8D99",
  },
  modalWrapper: {
    display: "flex",
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  buttonClose: {
    alignSelf: "flex-end",
  },
  modalText: {
    fontWeight: "bold",
    marginBottom: 15,
    fontSize: 16,
  },
  spendingWrapper: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
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
    backgroundColor: "#8A19D6",
    borderRadius: 12,
    padding: 10,
    marginTop: 15,
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  buttonCloseText: {
    fontWeight: "bold",
    marginRight: 5,
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
    color: "#3A3A3E",
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
