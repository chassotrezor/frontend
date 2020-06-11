import Vue from 'vue'

export function setUser (state, user) {
  Object.entries(user).forEach(entry => {
    Vue.set(state, entry[0], entry[1])
  })
}

export function delUser (state) {
  Object.entries(state).forEach(entry => {
    Vue.set(state, entry[0], undefined)
  })
}
