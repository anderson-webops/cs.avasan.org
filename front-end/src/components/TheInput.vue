<script lang="ts" setup>
withDefaults(
	defineProps<{
		id?: string;
	}>(),
	{
		id: undefined
	}
);

const modelValue = defineModel<string>();
</script>

<template>
	<input
		:id="id"
		v-model="modelValue"
		border="~ rounded gray-200 dark:gray-700"
		p="x-4 y-2"
		type="text"
		v-bind="$attrs"
		w="250px"
	/>
	<!--	<input
		id="input"
		v-model="modelValue"
		bg="transparent"
		border="~ rounded gray-200 dark:gray-700"
		outline="none active:none"
		p="x-4 y-2"
		text="center"
		type="text"
		v-bind="$attrs"
		w="250px"
	/> -->
</template>
