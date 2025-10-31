<template>
  <div class="w-full">
    <label for="food-description" class="block text-sm font-medium text-gray-700 mb-2">
      Comidas favoritas
    </label>
    
    <div class="relative">
      <textarea
        id="food-description"
        v-model="internalValue"
        @input="handleInput"
        @blur="handleBlur"
        :maxlength="maxLength"
        :class="[
          'w-full px-4 py-3 sm:py-4 border-2 rounded-lg resize-none focus:ring-2 focus:ring-altar-orange-500 focus:border-altar-orange-500 transition-all duration-200',
          hasError ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
          'text-base sm:text-lg leading-relaxed min-h-[140px] sm:min-h-[120px] md:min-h-[140px]',
          'touch-manipulation'
        ]"
        :placeholder="`Describe las comidas favoritas de tu ser querido (${minLength}-${maxLength} caracteres)...`"
        rows="5"
        aria-describedby="char-count validation-message helper-text"
      ></textarea>
      
      <!-- Character counter -->
      <div
        id="char-count"
        :class="[
          'absolute bottom-3 right-3 text-sm sm:text-base font-semibold bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-md shadow-sm',
          remainingChars < 50 ? 'text-altar-orange-600' : 'text-gray-600',
          'pointer-events-none'
        ]"
        aria-live="polite"
      >
        {{ remainingChars }}
      </div>
    </div>
    
    <!-- Validation feedback -->
    <div
      v-if="validationMessage"
      id="validation-message"
      :class="[
        'mt-2 text-sm sm:text-base font-medium',
        hasError ? 'text-red-600' : 'text-green-600'
      ]"
      role="alert"
    >
      {{ validationMessage }}
    </div>
    
    <!-- Helper text -->
    <p v-else id="helper-text" class="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed">
      Ejemplo: Tamales de mole, pan de muerto, chocolate caliente, calabaza en tacha
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { validateFoodDescription, sanitizeFoodDescription, getRemainingCharacters } from '../utils/validators';

interface Props {
  modelValue: string;
  maxLength?: number;
  minLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 500,
  minLength: 10
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const internalValue = ref(props.modelValue);
const validationMessage = ref<string | null>(null);
const hasError = ref(false);
const touched = ref(false);

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
  }
});

const remainingChars = computed(() => {
  return getRemainingCharacters(internalValue.value);
});

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  let value = target.value;
  
  // Sanitize input
  value = sanitizeFoodDescription(value);
  
  // Update internal value
  internalValue.value = value;
  
  // Emit sanitized value
  emit('update:modelValue', value);
  
  // Validate if touched
  if (touched.value) {
    validateInput();
  }
};

const handleBlur = () => {
  touched.value = true;
  validateInput();
};

const validateInput = () => {
  const validation = validateFoodDescription(internalValue.value);
  
  if (!validation.isValid) {
    hasError.value = true;
    validationMessage.value = validation.error || 'Invalid input';
  } else {
    hasError.value = false;
    
    // Show success message if minimum length is met
    if (internalValue.value.trim().length >= props.minLength) {
      validationMessage.value = '✓ Descripción válida';
    } else {
      validationMessage.value = null;
    }
  }
};

// Expose validation method for parent components
defineExpose({
  validate: () => {
    touched.value = true;
    validateInput();
    return !hasError.value;
  }
});
</script>
