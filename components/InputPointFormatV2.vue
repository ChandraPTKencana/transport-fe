<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | string | null
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    allowNegative?: boolean
    precision?: number
  }>(),
  {
    modelValue: null,
    placeholder: '0,00',
    disabled: false,
    readonly: false,
    allowNegative: true,
    precision: 2,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const displayValue = ref('')

const formatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: props.precision,
  maximumFractionDigits: props.precision,
})

/**
 * Parse the DISPLAY value (always Indonesian format)
 * . = thousand separator
 * , = decimal separator
 */
function parseDisplay(value: string): number | null {
  if (!value || value.trim() === '' || value === '-') return null

  let str = value
    .replace(/\./g, '')   // remove thousand separators
    .replace(',', '.')    // decimal comma → dot
    .replace(/[^\d.-]/g, '')

  if (!props.allowNegative) {
    str = str.replace(/-/g, '')
  }

  const num = parseFloat(str)
  return isNaN(num) ? null : num
}

/**
 * Parse incoming modelValue (can be number or English/Indonesian string)
 */
function parseModel(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'number') return isNaN(value) ? null : value

  let str = String(value).trim()
  if (!str || str === '-') return null

  const hasComma = str.includes(',')
  const hasDot = str.includes('.')

  if (hasComma && hasDot) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      str = str.replace(/\./g, '').replace(',', '.')
    } else {
      str = str.replace(/,/g, '')
    }
  } else if (hasComma) {
    str = str.replace(',', '.')
  } else if (hasDot) {
    const dotCount = (str.match(/\./g) || []).length
    if (dotCount > 1) {
      str = str.replace(/\./g, '')
    }
  }

  str = str.replace(/[^\d.-]/g, '')

  if (!props.allowNegative) {
    str = str.replace(/-/g, '')
  }

  const num = parseFloat(str)
  return isNaN(num) ? null : num
}

function format(value: number | null): string {
  if (value === null || isNaN(value)) return ''
  return formatter.format(value)
}

function getDigitsBeforeCursor(value: string, cursorPos: number): number {
  return value.slice(0, cursorPos).replace(/[^\d]/g, '').length
}

function setCursorByDigitCount(el: HTMLInputElement, digitCount: number) {
  const value = el.value
  let digitsSeen = 0
  let newPos = value.length

  for (let i = 0; i < value.length; i++) {
    if (/\d/.test(value[i])) {
      digitsSeen++
      if (digitsSeen === digitCount) {
        newPos = i + 1
        break
      }
    }
  }
  el.setSelectionRange(newPos, newPos)
}

function onKeydown(e: KeyboardEvent) {
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ]

  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return

  if (/^\d$/.test(e.key)) return

  if (e.key === ',') {
    if (displayValue.value.includes(',')) e.preventDefault()
    return
  }

  if (e.key === '.') return

  if (e.key === '-' && props.allowNegative) {
    const el = e.target as HTMLInputElement
    const cursorPos = el.selectionStart ?? 0
    if (cursorPos === 0 && !displayValue.value.includes('-')) return
    e.preventDefault()
    return
  }

  e.preventDefault()
}

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  let value = el.value

  // Strip invalid characters
  value = value.replace(/[^\d.,-]/g, '')

  // Only one minus at the beginning
  if (value.includes('-')) {
    value = (value.startsWith('-') ? '-' : '') + value.replace(/-/g, '')
  }

  // Only one decimal comma
  const commaParts = value.split(',')
  if (commaParts.length > 2) {
    value = commaParts[0] + ',' + commaParts.slice(1).join('')
  }

  // Limit decimal digits
  if (commaParts.length === 2 && commaParts[1].length > props.precision) {
    value = commaParts[0] + ',' + commaParts[1].slice(0, props.precision)
  }

  const cursorPos = el.selectionStart ?? value.length
  const digitsBefore = getDigitsBeforeCursor(value, cursorPos)

  const num = parseDisplay(value)
  let formatted = value

  if (num !== null) {
    if (value.endsWith(',') && !value.slice(0, -1).includes(',')) {
      // Just typed the comma
      formatted = format(num).replace(/,\d+$/, '') + ','
    } else if (value.includes(',')) {
      // Editing decimal part
      const [intPart, decPart = ''] = value.replace(/\./g, '').split(',')
      const intNum = parseFloat(intPart || '0')
      const formattedInt = isNaN(intNum)
        ? intPart
        : new Intl.NumberFormat('id-ID').format(intNum)

      formatted = formattedInt + ',' + decPart.slice(0, props.precision)
    } else {
      // Integer only → format without forcing ,00
      formatted = format(num).replace(/,\d+$/, '')
    }
  } else if (value === '-' || value === '') {
    formatted = value
  }

  displayValue.value = formatted
  emit('update:modelValue', parseDisplay(formatted))

  nextTick(() => {
    if (inputRef.value) {
      setCursorByDigitCount(inputRef.value, digitsBefore)
    }
  })
}

function onBlur() {
  const num = parseDisplay(displayValue.value)
  displayValue.value = format(num)
  emit('update:modelValue', num)
}

// Sync from parent
watch(
  () => props.modelValue,
  (val) => {
    if (document.activeElement === inputRef.value) return

    const num = parseModel(val)
    displayValue.value = format(num)
  },
  { immediate: true }
)
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    inputmode="decimal"
    :value="displayValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    @keydown="onKeydown"
    @input="onInput"
    @blur="onBlur"
    class="input-number-mask"
  />
</template>

<style scoped>
.input-number-mask {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}
.input-number-mask:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
</style>