import { setDoc, doc, getFirestore } from "firebase/firestore";
import { getAccount } from "./account";

export async function createCategory(userId: string, name: string) {
  const account = await getAccount(userId);
  if (account) {
    if (account.categories.find((category) => category.name === name)) {
      throw new Error("Category already exists");
    }

    account.categories.push({
      mutable: true,
      name,
    });

    await setDoc(doc(getFirestore(), "accounts", userId), account);
    return account;
  } else {
    return null;
  }
}

export async function updateCategory(
  userId: string,
  oldName: string,
  newName: string,
) {
  const account = await getAccount(userId);
  if (account) {
    if (!account.categories.find((category) => category.name === oldName)) {
      throw new Error("Category does not exist");
    }

    if (account.categories.find((category) => category.name === newName)) {
      throw new Error("Category already exists");
    }

    if (
      !account.categories.find((category) => category.name === oldName)?.mutable
    ) {
      throw new Error("Category is not mutable");
    }

    account.categories = account.categories.map((category) => {
      if (category.name === oldName) {
        return {
          ...category,
          name: newName,
        };
      } else {
        return category;
      }
    });

    await setDoc(doc(getFirestore(), "accounts", userId), account);
    return account;
  } else {
    return null;
  }
}

export async function deleteCategory(userId: string, name: string) {
  const account = await getAccount(userId);
  if (account) {
    if (!account.categories.find((category) => category.name === name)) {
      throw new Error("Category does not exist");
    }

    account.categories = account.categories.filter(
      (category) => category.name !== name,
    );

    account.spendings = account.spendings.map((spending) => {
      if (spending.category === name) {
        return {
          ...spending,
          category: "Uncategorized",
        };
      } else {
        return spending;
      }
    });

    await setDoc(doc(getFirestore(), "accounts", userId), account);
    return account;
  } else {
    return null;
  }
}
