export type AccountType = {
  spendings: SpendingType[];
  categories: CategoryType[];
  userId: string;
  name: string;
};

export type SpendingType = {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export type CategoryType = {
  name: string;
  mutable: boolean;
};
