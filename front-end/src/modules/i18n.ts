import type { App } from "vue-demi";
import type { Locale } from "vue-i18n";
import type { UserModule } from "~/types";
import { createI18n } from "vue-i18n";
import { parse } from "yaml";

const LOCALE_FILE_RE = /([\w-]*)\.yml$/;
interface LocaleMessages {
	[key: string]: LocaleMessages | string;
}

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
const i18n = createI18n({
	legacy: false,
	locale: "",
	messages: {}
});
const localeFiles = import.meta.glob("../../locales/*.yml", {
	import: "default",
	query: "?raw"
});

const localesMap = Object.fromEntries(
	Object.entries(localeFiles).map(([path, loadLocale]) => [
		path.match(LOCALE_FILE_RE)?.[1],
		async () => {
			const rawMessages = await loadLocale();
			return parse(String(rawMessages)) as LocaleMessages;
		}
	])
) as Record<Locale, () => Promise<LocaleMessages>>;

export const availableLocales: string[] = Object.keys(localesMap);

const loadedLanguages: string[] = [];

function setI18nLanguage(lang: Locale) {
	i18n.global.locale.value = lang as Locale;
	if (typeof document !== "undefined")
		document.querySelector("html")?.setAttribute("lang", lang);
	return lang;
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
	// If the same language
	if (i18n.global.locale.value === lang) return setI18nLanguage(lang);

	// If the language was already loaded
	if (loadedLanguages.includes(lang)) return setI18nLanguage(lang);

	// If the language hasn't been loaded yet
	const messages = await localesMap[lang]();
	i18n.global.setLocaleMessage(lang, messages);
	loadedLanguages.push(lang);
	return setI18nLanguage(lang);
}

export const install: UserModule = ({ app }: { app: App<Element> }): void => {
	app.use(i18n);
	loadLanguageAsync("en").then(() => {});
};
