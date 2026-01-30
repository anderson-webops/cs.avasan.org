<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";

defineOptions({ name: "WheelPage" });

onMounted(() => {
	document.body.classList.add("wheel-mode");
});

onBeforeUnmount(() => {
	document.body.classList.remove("wheel-mode");
});
</script>

<template>
	<section class="WheelPage" aria-label="Wheel Decide embed">
		<div class="wheel-frame">
			<iframe
				title="Sophia's Wheel"
				src="https://wheeldecide.com/e.php?c1=lies&c2=lier&c3=lies&c4=frog&c5=lier&c6=lies&c7=lier&c8=lies&c9=lier&c10=frog&c11=lies&c12=lier&c13=lies&c14=lier&c15=frog&t=Sophia%27s+Wheel&time=5"
				width="500"
				height="500"
				scrolling="no"
				frameborder="0"
			>
			</iframe>
		</div>
	</section>
</template>

<style scoped>
:global(body.wheel-mode) {
	background-color: #000;
	color: #fff;
}

.WheelPage {
	margin: 0;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #000;
	padding: 0;
	overflow: hidden;
}

.wheel-frame {
	width: min(90vw, 520px);
	height: min(90vw, 520px);
}

.wheel-frame iframe {
	width: 100%;
	height: 100%;
	border: 0;
	display: block;
}
@media (max-width: 600px) {
	.wheel-frame {
		width: min(92vw, 480px);
		height: min(92vw, 480px);
	}
}
</style>

<route lang="json">
{
	"meta": {
		"layout": "blank"
	}
}
</route>
