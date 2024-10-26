import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const incidentTypes = [
  { 
    key: 'pothole', 
    icon: 'road-variant', 
    label: 'Hoyo en el camino',
    color: '#FF6B6B',
    description: 'Daño en el pavimento que puede afectar vehículos'
  },
  { 
    key: 'flood', 
    icon: 'water', 
    label: 'Inundación',
    color: '#4ECDC4',
    description: 'Acumulación de agua que dificulta el paso'
  },
  { 
    key: 'collapse', 
    icon: 'landslide', 
    label: 'Hundimiento',
    color: '#FFD93D',
    description: 'Hundimiento en la vía o banqueta'
  },
  { 
    key: 'collision', 
    icon: 'car-crash', 
    label: 'Colisión',
    color: '#FF8066',
    description: 'Accidente vehicular'
  },
  { 
    key: 'breakdown', 
    icon: 'car-wrench', 
    label: 'Auto descompuesto',
    color: '#6C5CE7',
    description: 'Vehículo varado que obstaculiza el paso'
  },
];

const IncidentReportModal = ({ visible, onClose, onSubmit }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [description, setDescription] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0.95));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (selectedIncident) {
      onSubmit(selectedIncident, description);
      setSelectedIncident(null);
      setDescription('');
    }
  };

  const IncidentTypeCard = ({ type }) => {
    const isSelected = selectedIncident === type.key;
    return (
      <TouchableOpacity
        style={[
          styles.incidentTypeCard,
          isSelected && { backgroundColor: `${type.color}15` },
        ]}
        onPress={() => setSelectedIncident(type.key)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${type.color}15` }]}>
          <MaterialCommunityIcons
            name={type.icon}
            size={28}
            color={type.color}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{type.label}</Text>
          <Text style={styles.cardDescription}>{type.description}</Text>
        </View>
        <View style={styles.radioContainer}>
          <View style={[
            styles.radioOuter,
            isSelected && { borderColor: type.color }
          ]}>
            {isSelected && <View style={[styles.radioInner, { backgroundColor: type.color }]} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalView,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Reportar Incidente</Text>
            <Text style={styles.modalSubtitle}>
              Selecciona el tipo de incidente que deseas reportar
            </Text>
          </View>

          <ScrollView 
            style={styles.incidentTypesContainer}
            showsVerticalScrollIndicator={false}
          >
            {incidentTypes.map((type) => (
              <IncidentTypeCard key={type.key} type={type} />
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Detalles adicionales</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe brevemente la situación..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#A0AEC0"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !selectedIncident && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={!selectedIncident}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color="white" 
                style={styles.submitIcon}
              />
              <Text style={styles.submitButtonText}>Enviar Reporte</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 22,
  },
  incidentTypesContainer: {
    maxHeight: 400,
  },
  incidentTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  radioContainer: {
    marginLeft: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#EDF2F7',
  },
  cancelButtonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#4C51BF',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
});

export default IncidentReportModal;