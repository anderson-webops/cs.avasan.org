<template>
	<div class="m-auto py-8 text-left prose prose-sm">
		<h2>File-based Routing</h2>
		<p>
			Routes are auto-generated for Vue files in this directory using the
			same file structure.
		</p>
		<p>
			Check out
			<a
				href="https://router.vuejs.org/guide/advanced/typed-routes.html"
				target="_blank"
				rel="noopener"
			>
				Vue Router typed routes
			</a>
			for more details.
		</p>

		<h3>Path Aliasing</h3>
		<p><code>~/</code> is aliased to the <code>./src/</code> folder.</p>
		<p>For example, instead of having:</p>
		<pre><code>import { isDark } from "../../../../composables";</code></pre>
		<p>you can use:</p>
		<pre><code>import { isDark } from "~/composables";</code></pre>
	</div>
</template>
