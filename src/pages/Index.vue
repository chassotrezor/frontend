<template>
  <q-page class="flex flex-center">
    <div class="column">
      <div class="text-h6">
        Cette application web est en version alpha
      </div>
      <div>Les parcours créés peuvent être effacés suite à une mise à jour du système.</div>
      <div style="height: 1em" />
      <app-progress
        name="Fonctionnement"
        :value="1"
      />
      <app-progress
        name="Ergonomie"
        :value="0.9"
      />
      <app-progress
        name="Esthétique"
        :value="0.8"
      />
    </div>
  </q-page>
</template>

<script>
import AppProgress from './AppProgress'

export default {
  name: 'PageIndex',
  components: { AppProgress }
}
</script>
