import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const incidentTypes = [
  { key: 'pothole', icon: 'road-variant', label: 'Hoyo en el camino' },
  { key: 'flood', icon: 'water', label: 'Inundación' },
  { key: 'collapse', icon: 'landslide', label: 'Hundimiento' },
  { key: 'collision', icon: 'car-crash', label: 'Colisión' },
  { key: 'breakdown', icon: 'car-wrench', label: 'Auto descompuesto' },
];

const IncidentReportModal = ({ visible, onClose, onSubmit }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (selectedIncident) {
      onSubmit(selectedIncident, description);
      setSelectedIncident(null);
      setDescription('');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Reportar Incidente</Text>
          <ScrollView style={styles.incidentTypesContainer}>
            {incidentTypes.map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.incidentTypeButton,
                  selectedIncident === type.key && styles.selectedIncidentType,
                ]}
                onPress={() => setSelectedIncident(type.key)}
              >
                <MaterialCommunityIcons
                  name={type.icon}
                  size={32}
                  color={selectedIncident === type.key ? '#FFFFFF' : '#007AFF'}
                />
                <Text style={[
                  styles.incidentTypeLabel,
                  selectedIncident === type.key && styles.selectedIncidentTypeLabel,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Descripción adicional (opcional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, !selectedIncident && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!selectedIncident}
            >
              <Text style={[styles.buttonText, styles.submitButtonText]}>Enviar Reporte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007AFF',
  },
  incidentTypesContainer: {
    width: '100%',
    maxHeight: 300,
  },
  incidentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  selectedIncidentType: {
    backgroundColor: '#007AFF',
  },
  incidentTypeLabel: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  selectedIncidentTypeLabel: {
    color: '#FFFFFF',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButtonText: {
    color: 'white',
  },
});

export default IncidentReportModal;