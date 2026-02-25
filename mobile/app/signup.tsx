import { View, TextInput, Button } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

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

  const handleSignup = () => 
    {
    if (!isStrictEmail(email)) 
    {
      alert("Enter a valid email");
      return;
    }

    //later on in coding, call backend database here
    router.replace("/(tabs)/map");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Create Account" onPress={handleSignup} />
    </View>
  );
}