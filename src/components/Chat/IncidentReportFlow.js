// components/Chat/IncidentReportFlow.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const INCIDENT_TYPES = {
  COLLISION: { value: 'collision', label: 'Colisión/Accidente' },
  CONSTRUCTION: { value: 'construction', label: 'Construcción/Obras' },
  CLOSURE: { value: 'closure', label: 'Vía Cerrada' },
  FLOODING: { value: 'flooding', label: 'Inundación' },
  OTHER: { value: 'other', label: 'Otro Problema' }
};

const IncidentReportFlow = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [incidentData, setIncidentData] = useState({
    type: '',
    details: '',
    location: ''
  });

  const handleTypeSelect = (type) => {
    setIncidentData(prev => ({ ...prev, type }));
    setStep(2);
  };

  const handleSubmit = () => {
    onSubmit({
      description: incidentData.type,
      details: `${INCIDENT_TYPES[incidentData.type.toUpperCase()]?.label} - Ubicación: ${incidentData.location || 'No especificada'} - Detalles: ${incidentData.details || 'No proporcionados'}`
    });
  };

  const renderStep1 = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona el tipo de incidente:</Text>
      {Object.entries(INCIDENT_TYPES).map(([key, { value, label }]) => (
        <TouchableOpacity
          key={key}
          style={styles.button}
          onPress={() => handleTypeSelect(value)}
        >
          <MaterialIcons 
            name={getIconForType(value)} 
            size={24} 
            color="#007AFF" 
          />
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Proporciona más detalles:</Text>
      
      <Text style={styles.label}>Ubicación específica:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Frente al edificio 3, cerca de..."
        value={incidentData.location}
        onChangeText={(text) => setIncidentData(prev => ({ ...prev, location: text }))}
        multiline
      />

      <Text style={styles.label}>Detalles adicionales:</Text>
      <TextInput
        style={[styles.input, styles.detailsInput]}
        placeholder="Describe lo que observas..."
        value={incidentData.details}
        onChangeText={(text) => setIncidentData(prev => ({ ...prev, details: text }))}
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.backButton]}
          onPress={() => setStep(1)}
        >
          <Text style={styles.actionButtonText}>Atrás</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.actionButtonText}>Reportar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {step === 1 ? renderStep1() : renderStep2()}
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={onCancel}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const getIconForType = (type) => {
  switch (type) {
    case 'collision': return 'car-crash';
    case 'construction': return 'construction';
    case 'closure': return 'block';
    case 'flooding': return 'water-damage';
    default: return 'warning';
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    margin: 10,
  },
  container: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  detailsInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 14,
  },
});

export default IncidentReportFlow;