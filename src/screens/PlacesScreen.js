import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Platform,
  SafeAreaView,
  SectionList
} from 'react-native';
import { fetchPlaces, fetchIncidents } from '../api';
import { MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

const PlacesScreen = () => {
  const [places, setPlaces] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('places');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [fetchedPlaces, fetchedIncidents] = await Promise.all([
        fetchPlaces(),
        fetchIncidents()
      ]);
      setPlaces(fetchedPlaces || []);
      setIncidents(fetchedIncidents || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const formatCoordinates = (lat, lon) => {
    if (typeof lat !== 'number' || typeof lon !== 'number') return 'Coordenadas no disponibles';
    return `${lat?.toFixed(6) || '0.000000'}, ${lon?.toFixed(6) || '0.000000'}`;
  };


  const groupPlacesByCategory = (places) => {
    const grouped = places.reduce((acc, place) => {
      const category = place.category || 'Sin categoría';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(place);
      return acc;
    }, {});
  
    return Object.entries(grouped).map(([category, items]) => ({
      title: category,
      data: items
    }));
  };


  const groupIncidentsByDate = (incidents) => {
    const grouped = incidents.reduce((acc, incident) => {
      const date = new Date(incident.reportedAt).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(incident);
      return acc;
    }, {});
  
    return Object.entries(grouped).map(([date, items]) => ({
      title: date,
      data: items
    }));
  };


  // Renderizado de secciones - reemplazar el FlatList existente con SectionList
const renderSectionHeader = ({ section: { title } }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
  </View>
);


  const renderPlace = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <View style={styles.placeItem}>
        <View style={styles.placeHeader}>
          <MaterialIcons name="place" size={24} color="#007AFF" />
          <Text style={styles.placeName}>{item.name || 'Nombre no disponible'}</Text>
        </View>
        <Text style={styles.placeDescription}>
          {item.description || 'No hay descripción disponible.'}
        </Text>
        <View style={styles.placeFooter}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.placeCoordinates}>
            {formatCoordinates(item.latitude, item.longitude)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderIncident = ({ item }) => (
    <View style={styles.incidentItem}>
      <View style={styles.incidentHeader}>
        <View style={styles.incidentIconContainer}>
          <MaterialIcons name="warning" size={24} color="#FFF" />
        </View>
        <View style={styles.incidentHeaderText}>
          <Text style={styles.incidentTitle}>{item.details || 'Incidente sin detalles'}</Text>
          <Text style={styles.incidentDate}>{formatDate(item.reportedAt)}</Text>
        </View>
      </View>
  
      <Text style={styles.incidentDescription}>
        {item.description || 'Sin descripción disponible'}
      </Text>
  
      <View style={styles.divider} />
  
      <View style={styles.locationContainer}>
        <Text style={styles.sectionTitle}>Ubicación del incidente:</Text>
        <View style={styles.coordinatesContainer}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.coordinates}>
            {formatCoordinates(item.latitude, item.longitude)}
          </Text>
        </View>
      </View>
  
      {item.closest_address && item.closest_address.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.closestAddressContainer}>
            <Text style={styles.sectionTitle}>
              {item.closest_address.length > 1 ? 'Puntos de referencia cercanos:' : 'Punto de referencia más cercano:'}
            </Text>
            {item.closest_address.map((address, index) => (
              <View key={index} style={[
                styles.closestAddressInfo,
                index > 0 && styles.additionalAddressMargin
              ]}>
                <MaterialIcons name="place" size={20} color="#007AFF" />
                <View style={styles.addressDetails}>
                  <Text style={styles.addressName}>
                    {address.name || 'Nombre no disponible'}
                  </Text>
                  {typeof address.distance === 'number' && (
                    <Text style={styles.addressDistance}>
                      A {address.distance.toFixed(2)} km
                    </Text>
                  )}
                  {address.coordinates && (
                    <Text style={styles.addressCoordinates}>
                      ({formatCoordinates(address.coordinates.latitude, address.coordinates.longitude)})
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </>
      )}
  
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText,
          item.resolved ? styles.statusResolved : styles.statusPending
        ]}>
          {item.resolved ? 'Resuelto' : 'Pendiente'}
        </Text>
      </View>
    </View>
  );
  
  // Estilos adicionales
  const additionalStyles = {
    additionalAddressMargin: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
    },
    addressCoordinates: {
      fontSize: 11,
      color: '#999999',
      marginTop: 2,
    },
    statusContainer: {
      marginTop: 12,
      alignItems: 'flex-end',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    statusPending: {
      backgroundColor: '#FFE5E5',
      color: '#FF3B30',
    },
    statusResolved: {
      backgroundColor: '#E5FFE5',
      color: '#34C759',
    },
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  const TabButton = ({ title, isActive, onPress, icon }) => (
    <TouchableOpacity 
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <MaterialIcons 
        name={icon} 
        size={24} 
        color={isActive ? '#FFFFFF' : '#666666'} 
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {activeTab === 'places' ? 'Lugares de Interés' : 'Incidentes Reportados'}
          </Text>
        </View>
  
        <View style={styles.tabContainer}>
          <TabButton
            title="Lugares"
            isActive={activeTab === 'places'}
            onPress={() => setActiveTab('places')}
            icon="place"
          />
          <TabButton
            title="Incidentes"
            isActive={activeTab === 'incidents'}
            onPress={() => setActiveTab('incidents')}
            icon="warning"
          />
        </View>
  
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : loading && !refreshing ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : (
          <SectionList
            sections={
              activeTab === 'places' 
                ? groupPlacesByCategory(places)
                : groupIncidentsByDate(incidents)
            }
            renderItem={activeTab === 'places' ? renderPlace : renderIncident}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{title}</Text>
              </View>
            )}
            keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
            contentContainerStyle={styles.listContainer}
            refreshing={refreshing}
            onRefresh={loadData}
            stickySectionHeadersEnabled={true}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons 
                  name={activeTab === 'places' ? 'location-off' : 'notification-important'} 
                  size={48} 
                  color="#666"
                />
                <Text style={styles.emptyText}>
                  {activeTab === 'places' 
                    ? 'No hay lugares disponibles' 
                    : 'No hay incidentes reportados'}
                </Text>
              </View>
            }
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  {activeTab === 'places' 
                    ? `${places.length} lugares encontrados`
                    : `${incidents.length} incidentes reportados`}
                </Text>
              </View>
            }
            SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  placeItem: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
    flex: 1,
  },
  placeDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  placeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeCoordinates: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  incidentItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  incidentIconContainer: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 8,
  },
  incidentHeaderText: {
    marginLeft: 12,
    flex: 1,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  incidentDate: {
    fontSize: 12,
    color: '#666666',
  },
  incidentDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinates: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  closestAddressContainer: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  closestAddressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressDetails: {
    marginLeft: 8,
    flex: 1,
  },
  addressName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  addressDistance: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 12,
  },
  // Agrega estos estilos adicionales al StyleSheet existente
  
sectionHeader: {
  backgroundColor: '#f8f8f8',
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E5E5EA',
},
sectionHeaderText: {
  fontSize: 18,
  fontWeight: '600',
  color: '#007AFF',
  textTransform: 'capitalize',
},
listHeader: {
  padding: 16,
  backgroundColor: '#FFFFFF',
},
listHeaderText: {
  fontSize: 14,
  color: '#666666',
  textAlign: 'center',
},
sectionSeparator: {
  height: 16,
},
itemSeparator: {
  height: 1,
  backgroundColor: '#E5E5EA',
  marginHorizontal: 16,
},
emptyContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
  marginTop: 48,
},
emptyText: {
  fontSize: 16,
  color: '#666666',
  textAlign: 'center',
  marginTop: 12,
},
centered: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loadingText: {
  marginTop: 12,
  fontSize: 16,
  color: '#666666',
},
});

export default PlacesScreen;