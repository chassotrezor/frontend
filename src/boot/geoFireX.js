import Vue from 'vue'
import firebase from 'firebase/app'
import { init } from 'geofirex'

const geo = init(firebase)

Vue.prototype.$geo = geo
