import { AccountType } from "@/@types";
import { authentication } from "@/firebase";
import { getAccount } from "@/firebase/account";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthUserType = {
  email: string;
  account: AccountType;
};

type AuthContextType = {
  loggedInUser: AuthUserType | null;
  setLoggedInUser: (user: AuthUserType | null) => void;
  refreshUser: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  loggedInUser: null,
  setLoggedInUser: () => {},
  refreshUser: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loggedInUser, setLoggedInUser] = React.useState<AuthUserType | null>(
    null,
  );

  const refreshUser = async () => {
    const user = authentication.currentUser;
    if (user) {
      const account = await getAccount(user.uid);
      setLoggedInUser({
        email: user.email!,
        account: {
          ...account!,
          spendings: account!.spendings.reverse(),
        },
      });
    }
  };

  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (user) => {
      if (user) {
        const account = await getAccount(user.uid);
        setLoggedInUser({
          email: user.email!,
          account: {
            ...account!,
            spendings: account!.spendings.reverse(),
          },
        });
      } else {
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedInUser, setLoggedInUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
