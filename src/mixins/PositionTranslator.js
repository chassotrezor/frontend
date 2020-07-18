import { firestore } from 'firebase/app'
import { latLng } from 'leaflet'

function to (positionArray) {
  return {
    toLatLng: () => latLng(...positionArray),
    toGeopoint: () => new firestore.GeoPoint(...positionArray),
    toArray: () => positionArray
  }
}

function fromGeopoint (geopoint) {
  const positionArray = [geopoint.latitude, geopoint.longitude]
  return to(positionArray)
}

function fromLatLng (latlng) {
  const positionArray = [latlng.lat, latlng.lng]
  return to(positionArray)
}

function fromNavigatorPosition (navigatorPosition) {
  const positionArray = [navigatorPosition.coords.latitude, navigatorPosition.coords.longitude]
  return to(positionArray)
}

function fromArray (array) {
  return to(array)
}

export default {
  methods: {
    fromGeopoint,
    fromLatLng,
    fromNavigatorPosition,
    fromArray
  }
}
