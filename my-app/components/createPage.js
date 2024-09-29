import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { getDatabase, ref, push, update } from "firebase/database";

const AddEditTutorOffer = ({ navigation, route }) => {
  const db = getDatabase();

  const initialState = {
    subject: "",
    description: "",
    tutorName: "",
    availableTime: "",
    price: "",
    location: "",
    date: "", // Tilføj dato til initial state
  };

  const [newOffer, setNewOffer] = useState(initialState);

  // Return true if we are editing an offer
  const isEditOffer = route.name === "Edit Tutor Offer";

  useEffect(() => {
    if (isEditOffer) {
      // Check if route.params and route.params.offer are defined
      if (!route.params || !route.params.offer) {
        Alert.alert("Ingen opslag til redigering");
        return;
      }
      const offer = route.params.offer[1];
      setNewOffer(offer);
    }

    // Cleanup: reset the state when navigating away
    return () => {
      setNewOffer(initialState);
    };
  }, [isEditOffer, route.params]);

  const changeTextInput = (name, event) => {
    setNewOffer({ ...newOffer, [name]: event });
  };

  const handleSave = async () => {
    const {
      subject,
      description,
      tutorName,
      availableTime,
      price,
      location,
      date,
    } = newOffer;

    if (
      subject.length === 0 ||
      description.length === 0 ||
      tutorName.length === 0 ||
      availableTime.length === 0 ||
      price.length === 0 ||
      location.length === 0 ||
      date.length === 0 // Tjek om datoen er indtastet
    ) {
      return Alert.alert("Et af felterne er tomme!");
    }

    try {
      if (isEditOffer) {
        const id = route.params.offer[0]; // Ensure this is correct
        const offerRef = ref(db, `TutorOffers/${id}`);

        const updatedFields = {
          subject,
          description,
          tutorName,
          availableTime,
          price,
          location,
          date, // Opdater datoen
        };

        await update(offerRef, updatedFields);
        Alert.alert("Dit tutor-opslag er nu opdateret");
        navigation.navigate("OfferPage", { offer: newOffer });
      } else {
        const offersRef = ref(db, "/TutorOffers/");
        const newOfferData = {
          subject,
          description,
          tutorName,
          availableTime,
          price,
          location,
          date,
        };

        await push(offersRef, newOfferData);
        Alert.alert("Opbevares");
        setNewOffer(initialState);
      }
    } catch (error) {
      Alert.alert(`Fejl: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <TextInput
              value={newOffer[key]}
              onChangeText={(event) => changeTextInput(key, event)}
              style={styles.input}
              placeholder={`Indtast ${key}`}
              keyboardType={key === "date" ? "default" : "default"} // Juster tastaturtype
            />
          </View>
        ))}
        <Button
          title={isEditOffer ? "Gem ændringer" : "Tilføj opslag"}
          onPress={handleSave}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default AddEditTutorOffer;
