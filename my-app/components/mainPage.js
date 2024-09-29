// Importerer nødvendige moduler og komponenter
import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";

// Komponent til at vise tilgængelige tutor-tilbud
const CreatePage = ({ navigation }) => {
  const [offers, setOffers] = useState(null); // State til at holde tilbud

  useEffect(() => {
    const db = getDatabase(); // Opretter forbindelse til Firebase-databasen
    const offersRef = ref(db, "TutorOffers"); // Referencen til tilbudsgruppen i databasen

    const unsubscribe = onValue(offersRef, (snapshot) => {
      const data = snapshot.val(); // Henter data fra databasen
      if (data) {
        setOffers(data); // Opdaterer state med de hentede data
      }
    });

    return () => {
      unsubscribe(); // Rydder op ved at afmelde lytning ved komponent-unmount
    };
  }, []); // Kører kun én gang ved første rendering

  if (!offers) {
    return (
      <Text>På nuværende tidspunkt er der ingen tutors tilgængelige...</Text> // Viser besked hvis ingen tilbud er tilgængelige
    );
  }

  const handleSelectOffer = (id) => {
    const offer = Object.entries(offers).find(([key]) => key === id); // Finder det valgte tilbud
    navigation.navigate("OfferPage", { offer }); // Navigerer til tilbudssiden
  };

  const offerArray = Object.values(offers); // Konverterer tilbud til en array for FlatList
  const offerKeys = Object.keys(offers); // Henter nøglerne til tilbud

  // Renderer UI for at vise tilgængelige tilbud
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velkommen til Tutor Match</Text>
      <Text style={styles.description}>Her kan du se tilgængelige tutors</Text>
      <FlatList
        data={offerArray} // Data til FlatList
        keyExtractor={(item, index) => offerKeys[index]} // Definerer unikke nøgler for hvert element
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.offerContainer}
            onPress={() => handleSelectOffer(offerKeys[index])} // Håndterer klik på tilbud
          >
            <Text>
              {item.subject} - {item.tutorName} -{" "}
              {item.date ? item.date : "Ingen dato"} {/* Vis datoen */}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Definerer styles til UI-elementerne
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center", // Centrerer titlen
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
    textAlign: "center", // Centrerer beskrivelsen
  },
  offerContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CreatePage; // Eksporterer komponenten
