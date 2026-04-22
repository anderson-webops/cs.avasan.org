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
			title: "Direct 1:1 Support",
			copy: "Each session is built around one learner, so pace, difficulty, and examples can change as soon as the student gets stuck or pulls ahead."
		},
		{
			title: "Real Project Work",
			copy: "Class time can go toward current assignments, debugging, portfolio projects, or a longer course path with concrete deliverables."
		},
		{
			title: "Clear Follow-Through",
			copy: "Students leave with short notes, next steps, and the links or materials used in class instead of vague homework reminders."
		},
		{
			title: "Simple Scheduling",
			copy: "Book one-time or recurring sessions, and pay after completed classes."
		}
	]);

	const allSubjects = computed<string[]>(() =>
		subjectGroups.value.flatMap(g => g.subjects)
	);

	const faqs = ref<FAQ[]>([
		{
			question: "Are sessions one-on-one?",
			answer: "Yes. Classes are one learner at a time so pacing, examples, and feedback can stay focused."
		},
		{
			question: "What happens if we need to reschedule?",
			answer: "Email as soon as you can and we can move the session to another time."
		},
		{
			question: "Do you send follow-up notes?",
			answer: "Yes. After class I send short notes with what we covered, what still needs work, and the next step."
		},
		{
			question:
				"Can you help with school assignments or outside projects?",
			answer: "Yes. Many sessions focus on current coursework, debugging, project feedback, or preparing for the next class or check-in."
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
