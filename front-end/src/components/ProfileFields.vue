<script lang="ts" setup>
interface Field {
	key: string;
	label: string;
}

defineProps<{
	fields: Field[];
	entity: Record<string, any>;
	editing: boolean;
}>();
const emit = defineEmits<{
	(e: "update", key: string, value: any): void;
}>();

function onInput(key: string, value: any) {
	emit("update", key, value);
}
</script>

<template>
	<template v-for="f in fields" :key="f.key">
		<li v-if="editing">
			<label @click.stop>
				{{ f.label }}:&ensp;
				<input
					:value="entity[f.key]"
					class="editTutor"
					type="text"
					@input="
						onInput(
							f.key,
							($event.target as HTMLInputElement).value
						)
					"
					@click.stop
				/>
			</label>
		</li>

		<li v-else>
			<strong v-if="false">{{ f.label }}</strong>
			<!-- hidden label → keeps spacing -->
			&ensp;
			<p class="d-inline">
				{{ entity[f.key] }}
			</p>
		</li>
	</template>
</template>

<style scoped></style>
