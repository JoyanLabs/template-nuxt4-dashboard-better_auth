<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'
import { es, en } from '@nuxt/ui/locale'

const { t, locale, setLocale } = useI18n()

function handleLocaleChange(value: string) {
  setLocale(value as 'es' | 'en')
}

const passwordSchema = z.object({
  current: z.string().min(8, t('security.password.minLength')),
  new: z.string().min(8, t('security.password.minLength'))
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: t('security.password.mustBeDifferent') })
  }
  return errors
}
</script>

<template>
  <UPageCard :title="$t('security.language.title')" :description="$t('security.language.description')" variant="subtle">
    <ULocaleSelect
      :model-value="locale"
      :locales="[es, en]"
      class="w-48"
      @update:model-value="handleLocaleChange"
    />
  </UPageCard>

  <UPageCard :title="$t('security.password.title')" :description="$t('security.password.description')" variant="subtle">
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          :placeholder="$t('security.password.current')"
          class="w-full"
        />
      </UFormField>
      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          :placeholder="$t('security.password.new')"
          class="w-full"
        />
      </UFormField>

      <UButton :label="$t('common.update')" class="w-fit" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    :title="$t('security.account.title')"
    :description="$t('security.account.description')"
    class="bg-linear-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton :label="$t('security.account.deleteAccount')" color="error" />
    </template>
  </UPageCard>
</template>
