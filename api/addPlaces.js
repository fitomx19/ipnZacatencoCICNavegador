require('dotenv').config();
const mongoose = require('mongoose');
const Address = require('./models/addressModel');

const places = [
  { name: 'ESCOM', coordinate: { latitude: 19.504968, longitude: -99.146936 }, category: 'Academic Units' },
  { name: 'ESIA ZACATENCO', coordinate: { latitude: 19.504743, longitude: -99.133908 }, category: 'Academic Units' },
  { name: 'ESFM', coordinate: { latitude: 19.500915, longitude: -99.134511 }, category: 'Academic Units' },
  { name: 'METROBUS SAN JOSE DE LA ESCALERA', coordinate: { latitude: 19.52312, longitude: -99.16593 }, category: 'Services and Support' },
  { name: 'UPIITA', coordinate: { latitude: 19.511854, longitude: -99.129634 }, category: 'Academic Units' },
  { name: 'ESIME ZACATENCO', coordinate: { latitude: 19.504576, longitude: -99.133619 }, category: 'Academic Units' },
  { name: 'ENCB', coordinate: { latitude: 19.499721, longitude: -99.146478 }, category: 'Academic Units' },
  { name: 'BIBLIOTECA NACIONAL DE CIENCIA Y TECNOLOGÍA', coordinate: { latitude: 19.499544, longitude: -99.148538 }, category: 'Cultural and Educational Centers' },
  { name: 'CENTRO CULTURAL JAIME TORRES BODET', coordinate: { latitude: 19.499351, longitude: -99.149225 }, category: 'Cultural and Educational Centers' },
  { name: 'ESTADIO WILFRIDO MASSIEU', coordinate: { latitude: 19.500690, longitude: -99.144688 }, category: 'Sports Facilities' },
  { name: 'GIMNASIO DE EXHIBICIÓN EDEL OJEDA MALPICA', coordinate: { latitude: 19.501872, longitude: -99.145632 }, category: 'Sports Facilities' },
  { name: 'CAFETERÍA ZACATENCO', coordinate: { latitude: 19.503172, longitude: -99.146512 }, category: 'Services and Support' },
  { name: 'PLAZA ROJA', coordinate: { latitude: 19.504088, longitude: -99.146898 }, category: 'Services and Support' },
  { name: 'DIRECCIÓN GENERAL DEL IPN', coordinate: { latitude: 19.498991, longitude: -99.148184 }, category: 'Administrative Buildings' },
  { name: 'CICATA LEGARIA', coordinate: { latitude: 19.502853, longitude: -99.148983 }, category: 'Research Centers' },
  { name: 'CENTRO DE NANOCIENCIAS Y MICRO Y NANOTECNOLOGÍAS', coordinate: { latitude: 19.500822, longitude: -99.134897 }, category: 'Research Centers' },
  { name: 'CIDETEC', coordinate: { latitude: 19.504431, longitude: -99.147595 }, category: 'Research Centers' },
  { name: 'CICS UST', coordinate: { latitude: 19.505283, longitude: -99.148668 }, category: 'Academic Units' },
  { name: 'ESCUELA SUPERIOR DE CÓMPUTO (NUEVO EDIFICIO)', coordinate: { latitude: 19.506235, longitude: -99.147391 }, category: 'Academic Units' },
  { name: 'ALBERCA OLÍMPICA DEL IPN', coordinate: { latitude: 19.502440, longitude: -99.143954 }, category: 'Sports Facilities' },
  { name: 'CENTRO DE FORMACIÓN E INNOVACIÓN EDUCATIVA', coordinate: { latitude: 19.500726, longitude: -99.147926 }, category: 'Cultural and Educational Centers' },
  { name: 'COORDINACIÓN GENERAL DE SERVICIOS INFORMÁTICOS', coordinate: { latitude: 19.499619, longitude: -99.148967 }, category: 'Administrative Buildings' },
  { name: 'SECRETARÍA DE INVESTIGACIÓN Y POSGRADO', coordinate: { latitude: 19.498813, longitude: -99.149214 }, category: 'Administrative Buildings' },
  { name: 'UPIS (UNIDAD POLITÉCNICA DE INTEGRACIÓN SOCIAL)', coordinate: { latitude: 19.505584, longitude: -99.146518 }, category: 'Services and Support' },
  { name: 'PLANETARIO LUIS ENRIQUE ERRO', coordinate: { latitude: 19.499865, longitude: -99.147105 }, category: 'Cultural and Educational Centers' },
  { name: 'CENTRO DE DIFUSIÓN DE CIENCIA Y TECNOLOGÍA', coordinate: { latitude: 19.499526, longitude: -99.147448 }, category: 'Cultural and Educational Centers' },
  { name: 'OFICINA DEL ABOGADO GENERAL', coordinate: { latitude: 19.498654, longitude: -99.148436 }, category: 'Administrative Buildings' },
  { name: 'DIRECCIÓN DE ADMINISTRACIÓN ESCOLAR', coordinate: { latitude: 19.498345, longitude: -99.148758 }, category: 'Administrative Buildings' },
  { name: 'CENTRO DE EDUCACIÓN CONTINUA UNIDAD ALLENDE', coordinate: { latitude: 19.499102, longitude: -99.149654 }, category: 'Cultural and Educational Centers' },
  { name: 'CEPROBI (CENTRO DE DESARROLLO DE PRODUCTOS BIÓTICOS)', coordinate: { latitude: 19.501235, longitude: -99.135689 }, category: 'Research Centers' },
  { name: 'CAMPO DE BÉISBOL', coordinate: { latitude: 19.502548, longitude: -99.143215 }, category: 'Sports Facilities' },
  { name: 'CANCHA DE FÚTBOL RÁPIDO', coordinate: { latitude: 19.501987, longitude: -99.144588 }, category: 'Sports Facilities' },
  { name: 'CENTRO DE APOYO A ESTUDIANTES', coordinate: { latitude: 19.504721, longitude: -99.147012 }, category: 'Services and Support' },
  { name: 'UNIDAD POLITÉCNICA PARA EL DESARROLLO Y LA COMPETITIVIDAD EMPRESARIAL', coordinate: { latitude: 19.505123, longitude: -99.148234 }, category: 'Services and Support' },
  { name: 'INCUBADORA DE EMPRESAS DE BASE TECNOLÓGICA', coordinate: { latitude: 19.505678, longitude: -99.147789 }, category: 'Services and Support' },
  { name: 'CENTRO DE INVESTIGACIÓN EN COMPUTACIÓN (CIC)', coordinate: { latitude: 19.505912, longitude: -99.146716 }, category: 'Research Centers' },
  { name: 'LABORATORIO NACIONAL DE DESARROLLO Y ASEGURAMIENTO DE LA CALIDAD DE BIOCOMBUSTIBLES', coordinate: { latitude: 19.501456, longitude: -99.134987 }, category: 'Research Centers' },
  { name: 'CENTRO DE INVESTIGACIÓN EN BIOTECNOLOGÍA APLICADA', coordinate: { latitude: 19.500987, longitude: -99.135234 }, category: 'Research Centers' },
  { name: 'UNIDAD DE INFORMÁTICA', coordinate: { latitude: 19.499876, longitude: -99.148654 }, category: 'Services and Support' },
  { name: 'CENTRO INTERDISCIPLINARIO DE INVESTIGACIONES Y ESTUDIOS SOBRE MEDIO AMBIENTE Y DESARROLLO', coordinate: { latitude: 19.500345, longitude: -99.149123 }, category: 'Research Centers' },
];

const addPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const place of places) {
      const address = new Address({
        name: place.name,
        latitude: place.coordinate.latitude,
        longitude: place.coordinate.longitude,
        category: place.category,
      });
      await address.save();
      console.log(`Added: ${place.name}`);
    }

    console.log('All places added successfully');
  } catch (error) {
    console.error('Error adding places:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

addPlaces();