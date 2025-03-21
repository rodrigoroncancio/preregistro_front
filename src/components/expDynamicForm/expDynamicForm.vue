<script lang="ts" setup>
  import { useAttrs } from 'vue';
  import brsDateTime from '@/components/expInput/dateTime.vue';
  import expSnippet from '@/components/expSnippet/expSnippet.vue';

  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'

  const attrs = useAttrs();
  const modelValue = defineModel<object>();

  const editorOption = {
    placeholder: '',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] as any[] }, { background: [] as any[] }],
        [{ 'align': [] as any[] }],
        [{ 'list': 'ordered' }, { list: 'bullet' }],
        [{ 'indent': '-1' }, { indent: '+1' }],
        ['clean'],
      ]
    }
  }

  const props = defineProps({
    readOnly: {
      type: Boolean,
      default: false,
    },
    schema: {
      type: Array
    },
    errors: {
      type: Array
    },
    header1Style: {
      type: Object,
      default: () => ({
        fontSize: '24px',
        backgroundColor: '#f5f5f5',
        padding: '8px',
        borderRadius: '4px',
        width: '100%',
        textAlign: 'center',
        display: 'block'
      })
    },
    header2Style: {
      type: Object,
      default: () => ({
        fontSize: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        width: '100%',
        textAlign: 'center',
        display: 'block'
      })
    },
    header3Style: {
      type: Object,
      default: () => ({
        fontSize: '18px',
        backgroundColor: '#ffffff',
        width: '100%',
        textAlign: 'left',
        display: 'block'
      })
    }
  });

  const getClass = (item: any) => {
    let classReturn = "";

    try {
      if ('col' in item) {
        item.col.split(" ").forEach((t:string) => {
          if (t.trim()!== "")
            classReturn += `v-col-${t} `
        });
      }
    } catch { console.log('') }
    classReturn += `v-col-12 `

    if ('class' in item) {
      classReturn += ` ${(item as any).class} `
    }

    return classReturn;
  }
</script>

<template>
  <v-row>
    <v-col v-for="(item, key) in schema" :class="getClass(item)" :key="key">
      <slot :name="`item.${(item as any).key}`" :item="item" :key="(item as any).key">
        <template v-if="(item as any).type == 'switch'">
          <v-switch
            v-model="(modelValue as any)[(item as any).key]"
            :label="(item as any).title"
            color="primary"
            class="ml-3"
            v-bind="attrs"
            :readonly="readOnly"
          />
        </template>
        <v-menu :close-on-content-click="false" v-else-if="(item as any).type == 'color'">
          <template v-slot:activator="{ props }">
            <v-text-field
              :label="(item as any).title"
              v-model="(modelValue as any)[(item as any).key]"
              v-bind="props"
              :readonly="true"
            />
          </template>
          <v-color-picker
            v-model="(modelValue as any)[(item as any).key]"
          />
        </v-menu>
        <v-textarea v-else-if="(item as any).type == 'textarea'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          v-bind="attrs"
          :readonly="readOnly"
        />
        <template v-else-if="(item as any).type == 'editor'">
          <label>{{ (item as any).title }}</label>
          <div>
            <quill-editor theme="snow"
              v-model:content="(modelValue as any)[(item as any).key]"
              contentType="html"
              :options="editorOption"
              style="height: 175px;"
              :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
            ></quill-editor>
          </div>
        </template>
        <div v-else-if="(item as any).type == 'header1'">
          <span class="text-h6" :style="header1Style">{{ (item as any).title }}</span>
        </div>
        <div v-else-if="(item as any).type == 'header2'">
          <span class="text-h6" :style="header2Style">{{ (item as any).title }}</span>
        </div>
        <div v-else-if="(item as any).type == 'header3'">
          <span class="text-h6" :style="header3Style">{{ (item as any).title }}</span>
        </div>
        <div v-else-if="(item as any).type == 'snippet'">
          <exp-snippet
            v-model="(modelValue as any)[(item as any).key]"
            :title="(item as any).title"
            :endpoint="(item as any).extra.endpoint"
            :fields="(item as any).extra.fields"
          />
        </div>
        <brs-date-time v-else-if="(item as any).type == 'date'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          type="date"
          :readonly="readOnly"
        ></brs-date-time>
        <brs-date-time v-else-if="(item as any).type == 'time'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          type="time"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        ></brs-date-time>
        <brs-date-time v-else-if="(item as any).type == 'datetime'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          type="datetime"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        ></brs-date-time>
        <v-autocomplete v-else-if="(item as any).type == 'select'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          :items="((item as any).items as any[])"
          :item-title="(item: any) => item.name || item.label" 
          item-value="id"
          v-bind="attrs"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        />
        <v-select v-else-if="(item as any).type == 'multi_select'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          :items="((item as any).items as any[])"
          item-title="label"
          item-value="id"
          multiple
          v-bind="attrs"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        />
        <v-text-field v-else-if="(item as any).type == 'password'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          type="password"
          v-bind="attrs"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        />
        <v-text-field v-else-if="(item as any).type == 'number'"
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          type="number"
          v-bind="attrs"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        />
        <v-text-field v-else
          :label="(item as any).title"
          v-model="(modelValue as any)[(item as any).key]"
          v-bind="attrs"
          :error="((errors as any)?.filter((x: any) => x.$property == (item as any).key)?.length > 0)"
          :readonly="readOnly"
        />
      </slot>
    </v-col>
  </v-row>
</template>