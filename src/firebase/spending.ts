import { SpendingType } from "@/@types";
import { setDoc, doc } from "firebase/firestore";
import { getAccount } from "./account";
import { db } from ".";

export async function createSpending(userId: string, spending: SpendingType) {
  const account = await getAccount(userId);
  if (account) {
    if (spending.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (
      !account.categories.find(
        (category) => category.name === spending.category,
      )
    ) {
      throw new Error("Category does not exist");
    }

    account.spendings.push(spending);

    await setDoc(doc(db, "accounts", userId), account);
    return account;
  } else {
    return null;
  }
}

export async function getSpendings(userId: string) {
  const account = await getAccount(userId);
  if (account) {
    return account.spendings;
  } else {
    return [];
  }
}

export async function getSpendingsByCategory(
  userId: string,
  categoryName: string,
) {
  const spendings = await getSpendings(userId);
  if (spendings) {
    return spendings.filter((spending) => spending.category === categoryName);
  } else {
    return [];
  }
}

export async function updateSpending(
  userId: string,
  spending: SpendingType,
  spendId: string,
) {
  const account = await getAccount(userId);
  if (account) {
    if (spending.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    if (
      !account.categories.find(
        (category) => category.name === spending.category,
      )
    ) {
      throw new Error("Category does not exist");
    }

    const index = account.spendings.findIndex((spend) => spend.id === spendId);
    if (index === -1) {
      throw new Error("Spending does not exist");
    }

    account.spendings[index] = spending;

    await setDoc(doc(db, "accounts", userId), account);
    return account;
  } else {
    return null;
  }
}

export async function deleteSpending(userId: string, id: string) {
  const account = await getAccount(userId);
  if (account) {
    const index = account.spendings.findIndex((spend) => spend.id === id);
    if (index === -1) {
      throw new Error("Spending does not exist");
    }

    account.spendings.splice(index, 1);
    await setDoc(doc(db, "accounts", userId), account);
    return account;
  } else {
    return null;
  }
}
