// src/stores/content.ts
import { acceptHMRUpdate, defineStore } from "pinia";

export interface SubjectGroup {
	title: string;
	subjects: string[];
}

export interface Highlight {
	title: string;
	copy: string;
}

export interface FAQ {
	question: string;
	answer: string;
}

export const useContentStore = defineStore("content", () => {
	// ----- Static content moved from HomePage.vue -----
	const subjectGroups = ref<SubjectGroup[]>([
		{
			title: "Programming & Computer Science",
			subjects: ["Python", "Scratch", "C++", "C", "Java", "Intro to AI and Machine Learning"]
		},
		{
			title: "Web Technologies",
			subjects: ["HTML", "CSS", "JavaScript", "TypeScript", "Responsive Design"]
		},
		{
			title: "STEM & Language",
			subjects: ["Math", "Physics", "Spanish"]
		}
	]);

	const highlights = ref<Highlight[]>([
		{
			title: "Experienced Instructor",
			copy: "Former Juni Learning instructor now offering direct 1:1 sessions tailored to each learner's goals and pace."
		},
		{
			title: "Project-Based Learning",
			copy: "Every class connects concepts to real-world challenges so students can apply their skills immediately."
		},
		{
			title: "Flexible Scheduling",
			copy: "50-minute lessons with a 10-minute post-class time buffer to finish tough problems without feeling rushed."
		},
		{
			title: "Flexible Payment",
			copy: "Only pay for classes taught—missed or last-minute canceled sessions are not billed."
		},
		{
			title: "Satisfaction Guarantee",
			copy: "If you're not satisfied after any class, get a full refund. Feedback is always welcome and encouraged."
		}
	]);

	// ----- Helpful derived data (optional) -----
	const allSubjects = computed<string[]>(() => subjectGroups.value.flatMap(g => g.subjects));

	const faqs = ref<FAQ[]>([
		{
			question: "Can siblings or friends join the same session?",
			answer: "Sadly this option is not available at this time as it is harder to ensure each learner gets the attention they deserve. I’m happy to work with multiple learners back-to-back, though!"
		},
		{
			question: "What happens if we need to reschedule?",
			answer: "Life happens! Just please let me know as soon as possible. No fees are charged whatsoever for cancellations."
		},
		{
			question: "Do you offer progress updates?",
			answer: "Yes. I provide quick session summaries highlighting wins, challenges, and recommended practice so parents and students can stay aligned between meetings."
		}
	]);

	return {
		subjectGroups,
		highlights,
		allSubjects,
		faqs
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useContentStore as any, import.meta.hot));
}
