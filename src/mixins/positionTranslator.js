import { firestore } from 'firebase/app'
import { latLng } from 'leaflet'

function to (positionArray) {
  return {
    toLatLng: () => latLng(...Object.values(positionArray)),
    toGeopoint: () => new firestore.GeoPoint(...positionArray)
  }
}

function fromGeopoint (geopoint) {
  const positionArray = Object.values(geopoint)
  return to(positionArray)
}

function fromLatLng (latlng) {
  const positionArray = Object.values(latlng)
  return to(positionArray)
}

function fromNavigatorPosition (navigatorPosition) {
  const positionArray = Object.values(navigatorPosition.coords.latitude, navigatorPosition.coords.longitude)
  return to(positionArray)
}

export default {
  methods: {
    fromGeopoint,
    fromLatLng,
    fromNavigatorPosition
  }
}
