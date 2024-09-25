import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";

const CreatePage = ({ navigation }) => {
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const offersRef = ref(db, "TutorOffers");

    const unsubscribe = onValue(offersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOffers(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!offers) {
    return (
      <Text>På nuværende tidspunkt er der ingen tutors tilgængelige...</Text>
    );
  }

  const handleSelectOffer = (id) => {
    const offer = Object.entries(offers).find(([key]) => key === id);
    navigation.navigate("OfferPage", { offer });
  };

  const offerArray = Object.values(offers);
  const offerKeys = Object.keys(offers);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velkommen til Tutor Match</Text>
      <Text style={styles.description}>Her kan du se tilgængelige tutors</Text>
      <FlatList
        data={offerArray}
        keyExtractor={(item, index) => offerKeys[index]}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.offerContainer}
            onPress={() => handleSelectOffer(offerKeys[index])}
          >
            <Text>
              {item.subject} - {item.tutorName} - {item.date ? item.date : "Ingen dato"} {/* Vis datoen */}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

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

export default CreatePage;
