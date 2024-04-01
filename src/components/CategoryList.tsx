import { useAuth } from "@/contexts";
import { uuid } from "expo-modules-core";
import { useState, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';

import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/firebase/category";

export function CategoryList() {
  const { loggedInUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [oldName, setOldName] = useState<string | null>(null);
  const [clickedSearchBar, setClickedSearchBar] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");

  const cleanInput = () => {
    setCategory("");
    setOldName(null);
  };

  const handleDeleteCategory = async (name: string) => {
    try {
      setLoading(true);
      await deleteCategory(loggedInUser?.account.userId!, name);
    } catch (error) {
      //@ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
      cleanInput();
      setError(null);
      refreshUser();
    }
  };

  const handleUpdateCategory = async () => {
    try {
      setLoading(true);
      await updateCategory(loggedInUser?.account.userId!, "jesus", category);
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

  const handleNewCategory = async () => {
    try {
      setLoading(true);
      await createCategory(loggedInUser?.account.userId!, category);
    } catch (error) {
      //@ts-ignore
      setError(error.message);
    } finally {
      setLoading(false);
      cleanInput();
      setError(null);
      refreshUser();
    }
  };

  const filterCategories = useMemo(() => {
    return loggedInUser?.account.categories.filter((category) => {
      return category.name.toLowerCase().includes(searchPhrase.toLowerCase());
    });
  }, [loggedInUser?.account.categories, searchPhrase]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>+ New Category</Text>
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
                {oldName ? "Edit" : "New"} Category
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Category Name"
                value={category}
                onChangeText={setCategory}
              />
              {error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={
                  category.length === 0 || loading
                    ? [styles.button, styles.buttonDisabled]
                    : [styles.button]
                }
                onPress={oldName ? handleUpdateCategory : handleNewCategory}
                disabled={category.length === 0 || loading}
              >
                <Text style={styles.buttonText}>
                  {oldName ? "Edit" : "Create"}
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

      <View
        style={
          clickedSearchBar
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        <AntDesign name="search1" size={15} color="black" />

        <TextInput
          style={styles.inputSearch}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClickedSearchBar(true);
          }}
        />
      </View>

      <FlatList
        data={filterCategories}
        style={{
          marginBottom: 15,
        }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.spendingContainer}
              onPress={() => {
                if (!item.mutable) return;
                if (loading) return;
                setModalVisible(true);
                setOldName(item.name);
              }}
            >
              <View style={styles.spendingWrapper}>
                <Text
                  style={{
                    color: "#8A19D6",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    marginHorizontal: 10,
                  }}
                >
                  {loggedInUser?.account.spendings.filter(
                    (spending) => spending.category === item.name
                  ).reduce((acc, spending) => acc + spending.amount, 0).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
              {item.mutable && (
                <TouchableOpacity
                  onPress={() => {
                    if (loading) return;
                    handleDeleteCategory(item.name);
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
              )}
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
    paddingVertical: 20,
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
  inputcategory: {
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
    marginBottom: 10,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    backgroundColor: "#8A19D6",
    borderRadius: 12,
    padding: 10,
    width: "100%",
    height: 56,
    marginTop: 10,
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
  searchBar__unclicked: {
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputSearch: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});
