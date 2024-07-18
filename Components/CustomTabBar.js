import React from "react";
import { View } from "react-native";
import SecondTab from "./SecondTab";
import ThirdTab from "./ThirdTab";
import HomeTab from "./HomeTab";

const iconSize = 25;
export default ({ navigation }) => {

  return <>
    <View style={style.tabContainer}>
      <View style={{ flexDirection: "row" }}>
        <HomeTab navigation={navigation}
                 style={style}
                 iconSize={iconSize} />
        <SecondTab navigation={navigation}
                   iconSize={iconSize}
                   style={style} />
        <ThirdTab navigation={navigation}
                  style={style}
                  iconSize={iconSize} />
      </View>
    </View>
  </>;
};

const style = {
  tabContainer: {
    height: 70,
    flex: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.0,
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    elevation: 10,
    zIndex: 1,
    alignItems: "space-between",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  tab: {
    width: "33%",
    alignItems: "center",
  },
  slider: {
    height: 5,
    position: "absolute",
    top: 0,
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    width: iconSize,
  },
  textStyle: {
    fontSize: 12,
    color: "fff",
  },
  iconStyle: {
    marginTop: 18,
    width: 32,
    height: 32,
  },
};