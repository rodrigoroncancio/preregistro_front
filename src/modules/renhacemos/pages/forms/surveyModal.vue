<template>
  <v-main>
    <v-container class="flex-grow-1">
      <div class="main-container">
        <SurveyComponent :model="survey" />
      </div>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
  import 'survey-core/defaultV2.min.css';
  import { Model } from "survey-core";
  import { SurveyComponent } from "survey-vue3-ui";
  import useCrud from "@/composables/useCrud";
  import useToast from "@/composables/useToast";
  import axios from "axios";
  import { useLoading } from "vue-loading-overlay";
  import { ref, onMounted } from "vue";
  
  const uLoading = useLoading();
  const uCrud = useCrud("forms/catatumbo/preinscripcionnucleosindividuales");
  const uToast = useToast();
  const itemsDepartments = ref<Array<{ id: number; label: string }>>([]);

  const getDepartmentList = async () => {
    try {
      const response = await axios.get("/api/1.0/core/departments");
      itemsDepartments.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
      }));

    } catch (error) {
      console.error("Error fetching department list:", error);
    }
  };

  const itemsMunicipalities = ref<Array<{ id: number; label: string }>>([]);
  const getMunicipalityList = async (departmentId: number) => {
    try {
      const response = await axios.get(`/api/1.0/core/municipalities/by-department/${departmentId}/`);
      itemsMunicipalities.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching municipality list:", error);
    }
  };

  const itemSTownShips = ref<Array<{ id: number; label: string }>>([]);
  const getTownShipsList = async (municipalityId: number) => {
    try {
      const response = await axios.get(`/api/1.0/core/townships/by-municipality/${municipalityId}/`);
      itemSTownShips.value = response.data.map((dept: any) => ({
        value: dept.id,
        text: dept.nombre || dept.name || "Sin nombre" // Asegurar compatibilidad
      }));
    } catch (error) {
      console.error("Error fetching municipality list:", error);
    }
  };

  onMounted(async () => {
    getDepartmentList();
  });

  const json = {
  "title": "Formulario de validación",
  "description": "\n",
  "logoPosition": "right",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "radiogroup",
          "name": "status",
          "title": "Cumple con el requerimiento",
          "isRequired": true,
          "choices": [
            {
              "value": "Item 1",
              "text": "Si"
            },
            {
              "value": "Item 2",
              "text": "No"
            },
            {
              "value": "Item 3",
              "text": "No aplica"
            }
          ]
        },
        {
          "type": "comment",
          "name": "observation",
          "title": "Observaciones",
          "isRequired": true
        },
        {
          "type": "file",
          "name": "attachment",
          "title": "Archivo de Evidanecia"
        }
      ]
    }
  ]
}

const survey = new Model(json);
  
survey.onCompleting.add((sender, options) => {
  options.allowComplete = false;
  const senderData = {
    ...sender.data,
    foto_frente: Array.isArray(sender.data.foto_frente) && sender.data.foto_frente.length > 0 ? sender.data.foto_frente[0].content : null,
    foto_relacion_predio1: Array.isArray(sender.data.foto_relacion_predio1) && sender.data.foto_relacion_predio1.length > 0 ? sender.data.foto_relacion_predio1[0].content : null,
    foto_relacion_predio2: Array.isArray(sender.data.foto_relacion_predio2) && sender.data.foto_relacion_predio2.length > 0 ? sender.data.foto_relacion_predio2[0].content : null,
    foto_relacion_predio3: Array.isArray(sender.data.foto_relacion_predio3) && sender.data.foto_relacion_predio3.length > 0 ? sender.data.foto_relacion_predio3[0].content : null,
    foto_relacion_predio4: Array.isArray(sender.data.foto_relacion_predio4) && sender.data.foto_relacion_predio4.length > 0 ? sender.data.foto_relacion_predio4[0].content : null,
    foto_relacion_predio5: Array.isArray(sender.data.foto_relacion_predio5) && sender.data.foto_relacion_predio5.length > 0 ? sender.data.foto_relacion_predio5[0].content : null,
    foto_respaldo: Array.isArray(sender.data.foto_respaldo) && sender.data.foto_respaldo.length > 0 ? sender.data.foto_respaldo[0].content : null
  };
  uCrud.create(senderData).then((item) => {
    uToast.toastSuccess("Su formulario ha sido guardado correctamente.");
    sender.clear(true);
    survey.showNavigationButtons = false;
  }).catch((error) => {
    uToast.toastError("Ocurrió un error al guardar su formulario. Por favor, inténtelo de nuevo.");
  });
  return false;
});


  survey.onValueChanged.add(async (sender, options) => {
    if (options.name === "ocupacion_beneficiario") {
      survey.showNavigationButtons = options.value;
    }

    const departamentoQuestion = survey.getQuestionByName("departamento");
    const departamentoNucleoQuestion = survey.getQuestionByName("departamento_nucleo_familiar");
    
    if (departamentoQuestion) {
      departamentoQuestion.choices = itemsDepartments.value;
      departamentoNucleoQuestion.choices = itemsDepartments.value;
    }
    const municipioQuestion = survey.getQuestionByName("municipio");
    const municipioNucleoQuestion = survey.getQuestionByName("municipio_nucleo_familiar");
    const veredapredio1Question = survey.getQuestionByName("vereda_predio1");

    if (options.name === "municipio_predio1") {
        const municipio_id = options.value;
        let loading = uLoading.show({});
        await getTownShipsList(municipio_id);
          if (veredapredio1Question) {
            veredapredio1Question.choices = itemSTownShips.value
          }
        loading.hide()
    }
    
    if (options.name === "departamento") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (municipioQuestion) {
              municipioQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }

    if (options.name === "departamento_nucleo_familiar") {
        const departamento_id = options.value;
        let loading = uLoading.show({});
        await getMunicipalityList(departamento_id);
          if (municipioNucleoQuestion) {
              municipioNucleoQuestion.choices = itemsMunicipalities.value
          }
        loading.hide()
    }


    if (options.name === "posee_predios") {
      survey.showNavigationButtons = false;
      sender.clearValue("numero_documento");
    }
    if (options.name === "numero_documento") {
      if (options.value === null || options.value === "")
        return;

      try {
        let loader = uLoading.show({});
        axios.get(`forms/catatumbo/validar_documento/?documento=${options.value}`)
          .then((resp: any) => {
            if (resp.data) {
              survey.showNavigationButtons = false;
              sender.clearValue("numero_documento");
              uToast.toastError("No se puede continuar con el formulario. El documento ya está registrado en las bases de datos de beneficiarios PNIS.");
            } else
              survey.showNavigationButtons = true;
          })
          .catch((err: any) => { console.log(err) })
          .finally(() => { loader.hide() });
      } catch (error) {
        console.error("Error al consultar el endpoint:", error);
      }
    }


  });
</script>

<style scoped>

</style>