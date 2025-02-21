<template>
  <v-row>
    <v-col cols="3">
      <v-table height="600px" fixed-header>
        <thead>
          <tr>
            <th class="text-left">{{ $t('commons.common.date_time') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in listLocations" :key="item.id">
            <td>{{ item.timestamp }}</td>
            <td><v-btn size="small" color="primary" icon="mdi-map" @click="clickView(item)"></v-btn></td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
    <v-col cols="9">
      <div class="mapContainer">
        <l-map ref="map" :zoom="zoom" :center="center" :useGlobalLeaflet="false">
          <l-tile-layer :url="getWsUrl()" layer-type="base" name="OpenStreetMap"></l-tile-layer>
          <l-feature-group ref="fg">
            <l-marker v-if="viewLocation" :lat-lng="objLocation" />
          </l-feature-group>
        </l-map>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPolygon, LTooltip, LFeatureGroup } from '@vue-leaflet/vue-leaflet'

import useCustomer from "@/modules/core/composables/useCustomer";

const { t } = useI18n();
const uCustomer = useCustomer();

const listLocations = ref();

const viewLocation = ref(false);
const objLocation = ref([]);
const zoom = ref(15)
const center = ref([19.3906594,-99.3084211])
const map = ref<typeof LMap>()
const fg = ref<typeof LFeatureGroup | null>(null)

const props = defineProps({
  userId: {
    type: Number,
    default: null,
  },
});

onBeforeMount(async () => {

});

onMounted(async () => {
  listLocations.value = await uCustomer.getListLocation(props.userId);
});

const getWsUrl = (): string => {
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}

const clickView = (item: any) => {
  objLocation.value = [item.latitude, item.longitude];
  center.value = objLocation.value;
  viewLocation.value = true;
};
</script>


<style scoped>
  .mapContainer {
    width: 100%;
    height: 600px;
  }

  .leaflet-div-icon {
    background: steelblue;
    color: rgba(255, 255, 255, 0.5);
    border-radius: 80%;
    font-weight: bold;
    font-size: large;
    text-align: center;
    line-height: 21px;
  }
</style>