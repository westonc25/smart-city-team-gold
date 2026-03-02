import { View, TextInput, Button } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      <Button title="Login" onPress={() => router.replace("/(tabs)/map")} />
      <Button title="Create account" onPress={() => router.push("/signup")} />
    </View>
  );
}