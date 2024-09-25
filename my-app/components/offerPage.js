import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, Platform, StyleSheet } from "react-native";
import { getDatabase, ref, remove } from "firebase/database";

const OfferPage = ({ navigation, route }) => {
    const [offer, setOffer] = useState({});

    useEffect(() => {
        setOffer(route.params.offer[1]);

        return () => {
            setOffer({});
        };
    }, [route.params.offer]);

    const handleEdit = () => {
        const offer = route.params.offer;
        navigation.navigate('Edit Tutor Offer', { offer });
    };

    const confirmDelete = () => {
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            Alert.alert('Are you sure?', 'Do you want to delete this tutor offer?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
            ]);
        }
    };

    const handleDelete = async () => {
        const id = route.params.offer[0];
        const db = getDatabase();
        const offerRef = ref(db, `TutorOffers/${id}`);
        
        try {
            await remove(offerRef);
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
            <Button title="Edit" onPress={handleEdit} />
            <Button title="Delete" onPress={confirmDelete} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    value: {
        flex: 1,
    },
});

export default OfferPage;
