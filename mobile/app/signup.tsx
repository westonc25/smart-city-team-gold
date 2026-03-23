import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { AuthService } from "@/services/auth";

//I included this purely to make sure you couldn't just put in "potato" as an email
const isStrictEmail = (email: string) => {
  if (!email) 
  {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) 
  {
    return false;
  }

  const [local, domain] = email.split("@");

  if (email.includes("..")) 
  {
    return false;
  }

  if (local.startsWith(".") || local.endsWith(".")) 
  {
    return false;
  }

  if (domain.startsWith("-") || domain.endsWith("-")) 
  {
    return false;
  }

  return true;
};

export default function Signup()
{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSignup = async () =>
  {
    if (!isStrictEmail(email))
    {
      Alert.alert("Invalid email", "Enter a valid email address");
      return;
    }

    try {
      await AuthService.signup(email, password, firstName, lastName);
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Signup failed", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="First name" onChangeText={setFirstName} />
      <TextInput placeholder="Last name" onChangeText={setLastName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Create Account" onPress={handleSignup} />
    </View>
  );
}