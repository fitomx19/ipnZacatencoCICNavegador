import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import { fetchIncidents } from '../api'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Ionicons } from '@expo/vector-icons'

const IncidentItem = ({ item }) => {
  const [expanded, setExpanded] = React.useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, "EEEE d 'de' MMMM h:mm aaa", { locale: es })
  }

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.incidentItem}>
      <View style={styles.incidentHeader}>
        <View style={styles.incidentIcon}>
          <Ionicons name="warning" size={24} color="#FFA500" />
        </View>
        <View style={styles.incidentInfo}>
          <Text style={styles.incidentTitle}>{item.details}</Text>
          <Text style={styles.incidentDate}>{formatDate(item.reportedAt)}</Text>
        </View>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666"
        />
      </View>
      {expanded && (
        <View style={styles.incidentDetails}>
          <Text style={styles.incidentDescription}>{item.description}</Text>
          <Text style={styles.incidentLocation}>
            <Ionicons name="location" size={16} color="#666" />
            {` ${item.latitude}, ${item.longitude}`}
          </Text>
          {item.details && <Text style={styles.incidentExtraDetails}>{item.details}</Text>}
        </View>
      )}
    </TouchableOpacity>
  )
}

export default function Incidents() {
  const [incidents, setIncidents] = React.useState([])
  const [refreshing, setRefreshing] = React.useState(false)

  const loadIncidents = () => {
    setRefreshing(true)
    fetchIncidents()
      .then(data => {
        setIncidents(data)
        setRefreshing(false)
      })
      .catch(error => {
        console.error(error)
        setRefreshing(false)
      })
  }

  React.useEffect(() => {
    loadIncidents()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incidentes</Text>
      </View>
      <FlatList
        data={incidents}
        renderItem={({ item }) => <IncidentItem item={item} />}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={loadIncidents}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  incidentItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  incidentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  incidentIcon: {
    marginRight: 15,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  incidentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  incidentDetails: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  incidentDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  incidentLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  incidentExtraDetails: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
})