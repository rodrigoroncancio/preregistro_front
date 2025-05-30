
<template>
  <expModalForm
    v-model="modalMap"
    title="Mapa"
    :btn-save="false"
    btn-cancel-text="commons.common.close"
  >
    <div class="mapContainer">
      <l-map ref="map" :zoom="zoom" :center="center" :useGlobalLeaflet="false">
        <l-tile-layer :url="getWsUrl" layer-type="base" name="OpenStreetMap"></l-tile-layer>
        <l-feature-group ref="fg">
          <l-marker :lat-lng="objLocation" />
        </l-feature-group>
      </l-map>
    </div>
    <v-btn icon="" style="position:absolute; z-index: 9999; margin-top: -60px; margin-left: 10px;"><v-icon>mdi-map</v-icon>
      <v-menu activator="parent">
        <v-list>
          <v-list-item
            v-for="(item, index) in typeMaps"
            :key="index"
            :value="index"
            @click="typeMapSelected = item.id"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </expModalForm>

  <table class="w-100">
    <tbody>
      <tr>
        <td class="text-left">Longitud</td>
        <td class="py-1 pl-4 w-100">
          <input
            v-model="longitude"
            class="sd-input sd-text"
            type="number"
            aria-required="false"
            @change="updateValue()"
          >
        </td>
        <td rowspan="2" class="pl-4">
          <v-btn icon="mdi-map-marker" size="x-small" @click="clickView()"></v-btn>
        </td>
      </tr>
      <tr>
        <td class="text-left">Latitud</td>
        <td class="py-1 pl-4 w-100">
          <input
            v-model="latitude"
            class="sd-input sd-text"
            type="number"
            aria-required="false"
            @change="updateValue()"
          >
        </td>
      </tr>
    </tbody>
  </table>
  <div v-if="!result" class="error-message">
    <h3 class="text-center text-red">Las coordenadas no son válidas</h3>
  </div>
</template>

<script lang="ts">
import { polygon, point, booleanPointInPolygon, midpoint } from '@turf/turf';
import { ElementFactory, Question, Serializer, SvgRegistry } from "survey-core";

const CUSTOM_TYPE = "coordinates-question";

export class CoordinatesQuestionModel extends Question {
  getType() {
    return CUSTOM_TYPE;
  }

  get polygon() {
    return this.getPropertyValue("polygon");
  }
  set polygon(val) {
    this.setPropertyValue("polygon", val);
  }
}

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name: string) => {
  return new CoordinatesQuestionModel(name);
});

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [{
    name: "polygon",
    default: [],
    category: "general",
    visibleIndex: 2
  }],
  function () {
    return new CoordinatesQuestionModel("");
  },
  "question"
);
</script>

<script setup lang="ts">
import { ref, computed } from "vue";

import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LPolygon, LTooltip, LFeatureGroup } from '@vue-leaflet/vue-leaflet'
import expModalForm from "@/components/expModalForm";

const result = ref(true);
const latitude = ref("");
const longitude = ref("");
const modalMap = ref(false);
const typeMapSelected = ref(1);
const typeMaps = ref([
  { id: 1, name: "ArcGIS", url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png' },
  { id: 2, name: "OpenStreetMap", url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  { id: 3, name: "Google", url: 'http://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' },
]);

const objLocation = ref([]);
const zoom = ref(15)
const center = ref([19.3906594,-99.3084211])
const map = ref<typeof LMap>()
const fg = ref<typeof LFeatureGroup | null>(null)

defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: CoordinatesQuestionModel }>();

function updateValue() {
  try {
    const _long = parseFloat(longitude.value)
    const _lat = parseFloat(latitude.value)
    longitude.value = _long.toString().slice(0, 14)
    latitude.value = _lat.toString().slice(0, 14)

    const point = `${longitude.value}|${latitude.value}`;
    result.value = isPointInPolygon(props.question.polygon, point);
    props.question.value = result.value ? point : null;
  } catch {
    result.value = false
    props.question.value = null;
  }
}

const getWsUrl = computed(() => {
  return typeMaps.value.find((item) => (item.id == typeMapSelected.value))?.url || "";
})

function isPointInPolygon(coordinates: string[], pointStr: string): boolean {
  const polygonCoordinates = coordinates.map(coord => {
    const [_longitude, _latitude] = coord.split('|').map(parseFloat);
    return [_longitude, _latitude];
  });
  const poly = polygon([polygonCoordinates]);
  const [longitude, latitude] = pointStr.split('|').map(parseFloat);
  const pt = point([longitude, latitude]);
  return booleanPointInPolygon(pt, poly);
}

const clickView = () => {
  objLocation.value = [latitude.value, longitude.value];
  center.value = objLocation.value;
  modalMap.value = true
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
