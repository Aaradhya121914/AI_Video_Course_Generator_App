import { createContext } from "react";

export const UserInputContext =createContext({
  category: "",
  difficulty: "",
  duration: "",
  videoLectures: "",
  videoChapters: ""
});