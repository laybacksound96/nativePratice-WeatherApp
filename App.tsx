import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

interface IDay {
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  weather: [
    {
      id: number;
      main: "Clouds" | "Clear" | "Atmosphere" | "Snow" | "Rain" | "Drizzle" | "Thunderstorm";
      description: string;
      icon: string;
    }
  ];
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState<IDay[]>([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    if (location[0].district != null) {
      setCity(location[0].district);
    }
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  const getFont = async () => {
    await Font.loadAsync({
      "Pretendard-Medium": require("./assets/fonts/Pretendard-Medium.otf"),
    });
  };
  useEffect(() => {
    getWeather();
    getFont();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>{day.temp.day.toFixed(1)}°</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
    fontFamily: "Pretendard-Medium",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontFamily: "Pretendard-Medium",
    fontWeight: "600",
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
    fontFamily: "Pretendard-Medium",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
    fontFamily: "Pretendard-Medium",
  },
});
