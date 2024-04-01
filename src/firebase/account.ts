import { AccountType } from "@/@types";
import { User } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

export async function createAccount(user: User, name: string) {
  const db = getFirestore();
  await setDoc(doc(db, "accounts", user.uid), {
    userId: user.uid,
    spendings: [],
    categories: [
      {
        mutable: false,
        name: "Uncategorized",
      },
      {
        mutable: false,
        name: "Food",
      },
      {
        mutable: false,
        name: "Transportation",
      },
    ],
    name,
  } satisfies AccountType);

  return {
    userId: user.uid,
    spendings: [],
    categories: [
      {
        mutable: false,
        name: "Uncategorized",
      },
      {
        mutable: false,
        name: "Food",
      },
      {
        mutable: false,
        name: "Transportation",
      },
    ],
    name,
  };
}

export async function getAccount(userId: string) {
  const db = getFirestore();
  const docSnap = await getDoc(doc(db, "accounts", userId));
  if (docSnap.exists()) {
    return docSnap.data() as AccountType;
  } else {
    return null;
  }
}
