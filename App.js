import React from "react";
import { StatusBar, View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./app/redux/store";
import { ThemeProvider } from "./app/context/ThemeContext";
import CheckNavigation from "./app/navigation/CheckNavigation";
// // import { LoginProvider } from "./app/context/LoginContext";
// // import { UserProvider } from "./app/context/UserContext";
// // import { DataProvider } from "./app/context/DataContext";
// // import { ChecklistProvider } from "./app/context/ChecklistContext";

import { PaperProvider } from "react-native-paper";

// // require("moment/locale/vi");
import SwitchTheme from "./app/screens/SwitchTheme";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar />
            <CheckNavigation />
          </NavigationContainer>
        </ThemeProvider>
      </PaperProvider>
    </Provider>
  );
}
