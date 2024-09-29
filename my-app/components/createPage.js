// Importerer nødvendige moduler og komponenter
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

// Komponent til at tilføje eller redigere et tutor-tilbud
const AddEditTutorOffer = ({ navigation, route }) => {
  const db = getDatabase(); // Opretter forbindelse til Firebase-databasen

  // Sørger for, at der ikke står noget i forvejen
  const initialState = {
    subject: "",
    description: "",
    tutorName: "",
    availableTime: "",
    price: "",
    location: "",
    date: "",
  };

  const [newOffer, setNewOffer] = useState(initialState); // State til at holde oplysninger om tilbuddet

  // Tjekker om der er redigeret på eksisterende tilbud
  const isEditOffer = route.name === "Edit Tutor Offer";

  useEffect(() => {
    if (isEditOffer) {
      // Kontrollerer om der er data at redigere
      if (!route.params || !route.params.offer) {
        Alert.alert("Ingen opslag til redigering");
        return;
      }
      const offer = route.params.offer[1]; // Henter det eksisterende tilbud
      setNewOffer(offer); // Opdaterer state med eksisterende tilbud
    }

    // Rydder op ved at nulstille state, når der navigeres væk
    return () => {
      setNewOffer(initialState); // Nulstiller state til initial
    };
  }, [isEditOffer, route.params]);

  // Opdaterer tekstinputfelter i tilbuddet
  const changeTextInput = (name, event) => {
    setNewOffer({ ...newOffer, [name]: event }); // Opdaterer state med den nye værdi
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
    } = newOffer; // Henter værdier fra state

    // Tjekker om alle felter er udfyldt
    if (
      subject.length === 0 ||
      description.length === 0 ||
      tutorName.length === 0 ||
      availableTime.length === 0 ||
      price.length === 0 ||
      location.length === 0 ||
      date.length === 0
    ) {
      return Alert.alert("Et af felterne er tomme!");
    }

    try {
      if (isEditOffer) {
        const id = route.params.offer[0]; // Henter ID'et på det tilbud, der redigeres
        const offerRef = ref(db, `TutorOffers/${id}`); // Referencen til tilbuddet i databasen

        const updatedFields = {
          subject,
          description,
          tutorName,
          availableTime,
          price,
          location,
          date,
        };

        await update(offerRef, updatedFields); // Opdaterer tilbuddet i databasen
        Alert.alert("Dit tutor-opslag er nu opdateret");
        navigation.navigate("OfferPage", { offer: newOffer }); // Navigerer til tilbudssiden
      } else {
        const offersRef = ref(db, "/TutorOffers/"); // Referencen til tilbudsgruppen i databasen
        const newOfferData = {
          subject,
          description,
          tutorName,
          availableTime,
          price,
          location,
          date,
        };

        await push(offersRef, newOfferData); // Tilføjer det nye tilbud til databasen
        Alert.alert("Opbevares");
        setNewOffer(initialState); // Nulstiller tilbuddet til initial state
      }
    } catch (error) {
      Alert.alert(`Fejl: ${error.message}`); // Viser fejlbesked ved problemer
    }
  };

  // Renderer UI til at indtaste eller redigere et tilbud
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <TextInput
              value={newOffer[key]} // Viser den nuværende værdi i inputfeltet
              onChangeText={(event) => changeTextInput(key, event)} // Opdaterer værdien ved ændringer
              style={styles.input}
              placeholder={`Indtast ${key}`} // Pladsholder tekst
              keyboardType="default" // Juster tastaturtype
            />
          </View>
        ))}
        <Button
          title={isEditOffer ? "Gem ændringer" : "Tilføj opslag"} // Viser knaptekst baseret på tilstand
          onPress={handleSave} // Håndterer gemme-funktionalitet
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Definerer styles til UI-elementerne
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

export default AddEditTutorOffer; // Eksporterer komponenten
