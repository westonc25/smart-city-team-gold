import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { AuthService } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await AuthService.login(email, password);
<<<<<<< HEAD
      router.replace("/(tabs)/map");
=======
      router.replace({ pathname: '/(tabs)/map' });
>>>>>>> b97b3ac (finished implementing forum and map in the backend, connected forum to the frontend and fixed some minor bugs.)
    } catch (e: any) {
      Alert.alert("Login failed", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Create account" onPress={() => router.push("/signup")} />
    </View>
  );
}