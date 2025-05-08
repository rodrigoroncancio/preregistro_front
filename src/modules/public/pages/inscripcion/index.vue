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
      <h3 class="text-center">
        <p>Su formulario ha sido guardado correctamente.</p><br />
        <p>Por favor, haga una captura de pantalla de este código.</p>
      </h3>
      <h1 class="text-center mt-6 mb-0">{{ code }}</h1>
    </v-card-text>
  </expModalForm>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import useCrud from '@/composables/useCrud';
  import useToast from '@/composables/useToast';
  import expSurveyJs from '@/components/expSurveyJs';
  import expModalForm from '@/components/expModalForm';

  const route = useRoute();

  const convocatoria = route.params.convocatoria;
  const fase = route.params.fase;

  const uCrud = useCrud("api/2.0/inscripciones");
  const uToast = useToast();

  const isLoaded = ref(false);
  const json = ref({});
  const formId = ref(0);
  const validatePage = ref(true);
  const showModal = ref(false);
  const code = ref('');

  onMounted(async () => {
    const data = await uCrud.custom(`estructura/${convocatoria}/${fase}`, "GET");

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
        case 'validar_cupo':
          const cupo = sender.getValue("cupo");
          isValid = await uCrud.custom(`verificar-cupo/${convocatoria}/${cupo}`, "GET");
          break;
        case 'validar_documento':
          const numero_documento = sender.getValue("numero_documento");
          isValid = await uCrud.custom(`verificar-documento/${numero_documento}/${formId.value}`, "GET");
          break;
        case 'validar_inhabilidad':
          const tiene_coca = sender.getValue("tiene_coca");
          const tipo_exclusion = sender.getValue("tipo_exclusion");
          if (!(tiene_coca && tipo_exclusion == 11))
            isValid = "No cumple los criterios para poder participar en la convocatoria";
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