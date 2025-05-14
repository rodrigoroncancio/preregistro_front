<template>
  <v-main>
    <v-container class="flex-grow-1">
      <v-row>
        <v-col class="text-center mt-6">
          <v-img :src="'/src/assets/img/header-colombia.png'" :width="360" class="mx-auto" />
        </v-col>
      </v-row>
      <div class="main-container">
        <exp-survey-js
          ref="surveyRef"
          :json="json"
          :onCurrentPageChanging="onCurrentPageChanging"
          :onCompleting="onCompleting"
          :onValueChanged="onValueChanged"
          v-if="isLoaded"
        />
      </div>
    </v-container>
  </v-main>
  <expModalForm
    title="Código de confirmación"
    v-model="showModal"
    width="300"
    :btn-save="false"
    :btn-cancel-text="'Cerrar'"
  >
    <v-card-text>
      <h3 class="text-center">Su formulario ha sido guardado correctamente.</h3>
      <div>
        <p>Por favor, haga una captura de pantalla de este código.</p>
      </div>
      <h1 class="text-center mt-6 mb-0">{{ code }}</h1>
      <div>
        <p style="text-align: justify; font-style: italic;">{{ msg_alerta }}</p>
      </div>
    </v-card-text>
  </expModalForm>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { Model } from "survey-core";

  import useCrud from '@/composables/useCrud';
  import useToast from '@/composables/useToast';
  import expSurveyJs from '@/components/expSurveyJs';
  import expModalForm from '@/components/expModalForm';

  const route = useRoute();

  const convocatoria = route.params.convocatoria;
  const fase = route.params.fase;

  const uCrud = useCrud("/api/2.0");
  const uToast = useToast();

  const isLoaded = ref(false);
  const json = ref({});
  const formId = ref(0);
  const validatePage = ref(true);
  const showModal = ref(false);
  const msg_alerta = ref('');
  const code = ref('');

  const surveyRef = ref();

  const obtenerDatos = async (numero_documento: number) => {
    try {
      const response = await uCrud.custom(`ficha/${numero_documento}/obtener-datos`);

      if (surveyRef.value) {
        // Para persona
        if (response?.persona) {
          Object.entries(response.persona).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              surveyRef.value.setValue(`persona.${key}`, value);
            }
          });
        }

        // Para inscripcion
        if (response?.inscripcion) {
          Object.entries(response.inscripcion).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              surveyRef.value.setValue(`inscripcion.${key}`, value);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  onMounted(async () => {
    const data = await uCrud.custom(`inscripciones/estructura/${convocatoria}/${fase}`, "GET", {"parameters":{"tipo":1}});
    json.value = (data as any)?.json || {};
    formId.value = (data as any)?.id || 0;
    isLoaded.value = true;
  });

  const onValueChanged = async (sender: any, options: any) => {

  }

  const onCompleting = async (sender: any, options: any) => {
    options.allowComplete = false;

    const senderData = {
      ...sender.data,
      form_id: formId.value
    }

    uCrud.custom(`guardar`, "POST", senderData)
      .then((response: any) => {
        uToast.toastSuccess("Su formulario ha sido guardado correctamente.");
        sender.clear(true);
        showModal.value = true;
        // const predio_coca_tipo_documento = senderData["predio_coca_tipo_documento"];
        // msg_alerta.value = predio_coca_tipo_documento ? "" : "El núcleo familiar deberá aportar en los 30 días siguientes a su vinculación al programa el documento que acredite su relación con el predio";

        msg_alerta.value = response.alertas;
        code.value = response.code;
      })
      .catch((error: any) => {
        uToast.toastError("Ocurrió un error al guardar su formulario. Por favor, inténtelo de nuevo.");
      });
  }

  const onCurrentPageChanging = async (sender: any, options: any) => {
    const currentPage = sender.currentPage;
    const isMovingForward = sender.currentPageNo < options.newCurrentPage.visibleIndex;

    if (!isMovingForward) {
      options.allowChanging = true;
      return;
    }

    if (!validatePage.value) {
      validatePage.value = true;
      options.allowChanging = true;
      return;
    }

    try {
      const page = (json.value as any).pages.find((x: any) => x.name === currentPage.name);
      if (!page || !page.rule) {
        options.allowChanging = true;
        return;
      }

      options.allowChanging = false;
      let isValid: any = '';

      switch (page.rule) {
        case 'validar_acepta':
          const acepta_politica = sender.getValue("acepta_politica");
          isValid = acepta_politica ? "" : "No puede continuar sin aceptar";
          break;
        case 'validar_cupo':
          const es_colectivo: boolean = sender.getValue("es_colectivo") ?? true;
          if (es_colectivo){
            const cupo = sender.getValue("cupo");
            isValid = await uCrud.custom(`verificar-cupo/${convocatoria}/${cupo}`, "GET");
          }
          else {
            isValid = "";
          }
          break;
        case 'validar_documento':
          const numero_documento = sender.getValue("numero_documento");
          isValid = await uCrud.custom(`inscripciones/verificar-documento/${numero_documento}/${formId.value}`, "GET");
          if (isValid == ""){
            obtenerDatos(numero_documento);
          }
          break;
        case 'validar_inhabilidad':
          const tiene_coca = sender.getValue("tiene_coca");
          const tipo_exclusion = sender.getValue("tipo_exclusion");
          if (!(tiene_coca && tipo_exclusion == 11))
            isValid = "En este momento usted no puede continuar con la inscripción al programa RenHacemos, de acuerdo con los criterios de la Resolución 0076 de 2025 -y las normas que la modifiquen, deroguen o subroguen- de la Dirección de Sustitución de Cultivos de Uso Ilícito, de la Agencia de Renovación del Territorio";
          break;
        default:
          options.allowChanging = true;
          return;
      }

      if (isValid != '') {
        uToast.toastError(isValid);
      } else {
        validatePage.value = false;
        options.allowChanging = true;
        sender.nextPage();
      }
    } catch {
      options.allowChanging = false;
    }
  }
</script>