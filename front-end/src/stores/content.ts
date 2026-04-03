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
			subjects: [
				"Python",
				"Scratch",
				"C++",
				"C",
				"Java",
				"Intro to AI & Machine Learning"
			]
		},
		{
			title: "Web Development",
			subjects: [
				"HTML",
				"CSS",
				"JavaScript",
				"TypeScript",
				"Responsive Design"
			]
		},
		{
			title: "STEM & Language",
			subjects: ["Math", "Physics", "Spanish"]
		}
	]);

	const highlights = ref<Highlight[]>([
		{
			title: "Experienced, Personalized Instruction",
			copy: "Several years of one-on-one and small-group teaching experience, tailored to each learner’s pace, interests, and goals."
		},
		{
			title: "Project-Based Lessons",
			copy: "Sessions turn new ideas into games, apps, data explorations, and other meaningful work students can revisit and share."
		},
		{
			title: "Flexible Scheduling",
			copy: "Fifty-minute lessons include a built-in buffer, so a strong question or debugging session never has to stop abruptly."
		},
		{
			title: "Straightforward Billing",
			copy: "Pay only for completed classes. Missed or canceled sessions are not billed."
		},
		{
			title: "Satisfaction Guarantee",
			copy: "If a class does not meet expectations, I will make it right. Feedback is always welcome and encouraged."
		}
	]);

	// ----- Helpful derived data (optional) -----
	const allSubjects = computed<string[]>(() =>
		subjectGroups.value.flatMap(g => g.subjects)
	);

	const faqs = ref<FAQ[]>([
		{
			question: "Can siblings or friends join the same session?",
			answer: "At the moment, sessions are one learner at a time so each student gets focused attention. If you have multiple learners, I’m happy to schedule back-to-back classes."
		},
		{
			question: "What happens if we need to reschedule?",
			answer: "Life happens. Just let me know as soon as you can, and we’ll find a new time. There are no cancellation fees."
		},
		{
			question: "Do you offer progress updates?",
			answer: "Yes. I send short session notes with wins, challenges, and suggested next steps so families can stay aligned between meetings."
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
	import.meta.hot.accept(
		acceptHMRUpdate(useContentStore as any, import.meta.hot)
	);
}
