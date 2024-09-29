// Importer nødvendige moduler og komponenter
import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, Linking } from "react-native";
import { getDatabase, ref, remove } from "firebase/database";

// Komponent til at vise detaljerne for et tutor-tilbud
const OfferPage = ({ navigation, route }) => {
  const [offer, setOffer] = useState({}); // State til at holde det valgte tilbud

  useEffect(() => {
    if (route.params && route.params.offer) {
      setOffer(route.params.offer[1]); // Sætter det valgte tilbud fra ruten
    } else {
      Alert.alert("Ingen tilbud tilgængelig."); // Håndterer tilfælde uden data
    }

    // Rydder op ved at nulstille state når komponent unmountes
    return () => {
      setOffer({}); // Nulstiller state
    };
  }, [route.params]);

  const SeeLocation = () => {
    const location = offer.location; // Henter placering fra tilbuddet
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`; // Opretter URL til Google Maps
      Linking.openURL(url).catch(
        (err) => Alert.alert("Error", "Could not open Google Maps.") // Håndterer fejl
      );
    } else {
      Alert.alert("Error", "Location not found."); // Advarer hvis placering ikke findes
    }
  };

  const confirmOrder = () => {
    Alert.alert("Er du sikker?", "Vil du bestille denne tutor?", [
      { text: "Fortryd", style: "cancel" },
      { text: "Bestil", onPress: handleOrder, style: "default" },
    ]);
  };

  const handleOrder = async () => {
    const id = route.params.offer[0]; // Henter ID'et på tilbuddet
    const db = getDatabase();
    const offerRef = ref(db, `TutorOffers/${id}`); // Referencen til tilbuddet i databasen

    try {
      await remove(offerRef); // Fjerner tilbuddet fra databasen
      Alert.alert("Din tid er blevet bestilt"); // Bekræfter bestilling
      navigation.goBack(); // Navigerer tilbage til forrige skærm
    } catch (error) {
      Alert.alert(error.message); // Viser fejlbesked ved problemer
    }
  };

  if (!offer || Object.keys(offer).length === 0) {
    return <Text>Ingen data tilgængelig</Text>; // Viser besked hvis der ikke er data for tilbuddet
  }

  // Renderer UI for at vise tilbuddet
  return (
    <View style={styles.container}>
      {Object.entries(offer).map((item, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.label}>{item[0]}</Text>
          <Text style={styles.value}>{item[1]}</Text>
        </View>
      ))}
      <Button title="Se lokation på kort" onPress={SeeLocation} />
      <Button title="Bestil Tutor" onPress={confirmOrder} />
    </View>
  );
};

// Definerer styles til UI-elementerne
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginVertical: 8,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
});

export default OfferPage; // Eksporterer komponenten
