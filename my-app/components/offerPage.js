import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  StyleSheet,
  Linking,
} from "react-native";
import { getDatabase, ref, remove } from "firebase/database";

const OfferPage = ({ navigation, route }) => {
  const [offer, setOffer] = useState({});

  useEffect(() => {
    setOffer(route.params.offer[1]);

    return () => {
      setOffer({});
    };
  }, [route.params.offer]);

  const SeeLocation = () => {
    // Assuming location is stored under 'location' key in offer object
    const location = offer.location; // Adjust this based on your actual structure
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`;
      Linking.openURL(url).catch((err) =>
        Alert.alert("Error", "Could not open Google Maps.")
      );
    } else {
      Alert.alert("Error", "Location not found.");
    }
  };

  const confirmOrder = () => {
    Alert.alert("Er du sikker?", "Vil du bestille denne tutor?", [
      { text: "Fortryd", style: "cancel" },
      { text: "Bestil", onPress: handleOrder, style: "default" },
    ]);
  };

  const handleOrder = async () => {
    const id = route.params.offer[0];
    const db = getDatabase();
    const offerRef = ref(db, `TutorOffers/${id}`);

    try {
      await remove(offerRef);
      Alert.alert("Din tid er blevet bestilt");
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (!offer) {
    return <Text>No data</Text>;
  }

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

export default OfferPage;
