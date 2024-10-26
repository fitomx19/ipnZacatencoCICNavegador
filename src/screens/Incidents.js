import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { fetchIncidents } from '../api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const getIncidentIcon = (description) => {
  const icons = {
    'breakdown': { name: 'car', color: '#E74C3C' },
    'flooding': { name: 'water', color: '#3498DB' },
    'collision': { name: 'alert-circle', color: '#E67E22' },
    'construction': { name: 'construct', color: '#F1C40F' },
    'closure': { name: 'close-circle', color: '#9B59B6' },
    'default': { name: 'warning', color: '#95A5A6' }
  };
  return icons[description] || icons.default;
};

const IncidentItem = ({ item }) => {
  const [expanded, setExpanded] = React.useState(false);
  const icon = getIncidentIcon(item.description);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "EEEE d 'de' MMMM 'a las' h:mm aaa", { locale: es });
  };

  const getIncidentTypeText = (description) => {
    const types = {
      'breakdown': 'Avería de vehículo',
      'flooding': 'Inundación',
      'collision': 'Colisión',
      'construction': 'Obras en la vía',
      'closure': 'Vía cerrada',
      'default': 'Incidente'
    };
    return types[description] || types.default;
  };

  return (
    <TouchableOpacity 
      onPress={() => setExpanded(!expanded)} 
      style={styles.incidentItem}
      activeOpacity={0.7}
    >
      <View style={styles.incidentHeader}>
        <View style={[styles.incidentIcon, { backgroundColor: `${icon.color}15` }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>
        <View style={styles.incidentInfo}>
          <View style={styles.tagContainer}>
            <Text style={[styles.tag, { backgroundColor: `${icon.color}15`, color: icon.color }]}>
              {getIncidentTypeText(item.description)}
            </Text>
            {!item.resolved && (
              <Text style={styles.activeTag}>Activo</Text>
            )}
          </View>
          <Text style={styles.incidentTitle} numberOfLines={expanded ? undefined : 2}>
            {item.details}
          </Text>
          <Text style={styles.incidentDate}>
            <Ionicons name="time-outline" size={14} color="#666" /> {formatDate(item.reportedAt)}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#666"
          style={styles.chevron}
        />
      </View>
      {expanded && (
        <View style={styles.incidentDetails}>
          {item.closest_address && item.closest_address.length > 0 && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.locationText}>
                Cerca de: {item.closest_address[0].name}
              </Text>
            </View>
          )}
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinates}>
              <Ionicons name="navigate" size={14} color="#666" /> {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
            </Text>
          </View>
          {item.description !== item.details && (
            <Text style={styles.incidentDescription}>{item.description}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function Incidents() {
  const [incidents, setIncidents] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadIncidents = () => {
    setRefreshing(true);
    fetchIncidents()
      .then(data => {
        setIncidents(data);
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        setRefreshing(false);
      });
  };

  React.useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incidentes Reportados</Text>
        <Text style={styles.headerSubtitle}>
          {incidents.length} incidente{incidents.length !== 1 ? 's' : ''} en total
        </Text>
      </View>
      <FlatList
        data={incidents}
        renderItem={({ item }) => <IncidentItem item={item} />}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={loadIncidents}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BDC3C7',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  incidentItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  incidentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  incidentInfo: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  activeTag: {
    backgroundColor: '#2ECC7115',
    color: '#2ECC71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  incidentTitle: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 6,
    lineHeight: 22,
  },
  incidentDate: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 4,
  },
  chevron: {
    marginLeft: 10,
  },
  incidentDetails: {
    padding: 16,
    backgroundColor: '#F8FAFB',
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#34495E',
    flex: 1,
  },
  coordinatesContainer: {
    backgroundColor: '#ECF0F1',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  incidentDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 8,
    fontStyle: 'italic',
  }
});