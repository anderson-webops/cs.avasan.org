// src/stores/app.ts
import type { StudentAccount, StudentSession } from "@/modules/studentAccounts";
import { defineStore } from "pinia";
import { api } from "@/api";
import { studentAccountsAreEnabled } from "@/modules/classroomFeatures";
import {
	clearAllStudentPythonProjectRecoveryFromLocalStorage,
	purgeAllStudentPythonProjectRecovery,
	volatileStudentPythonProjectRecovery
} from "@/modules/pythonIde";
import {
	fetchStudentSession,
	setStudentPassword,
	signOutStudent
} from "@/modules/studentAccounts";
import {
	broadcastStudentSessionChanged,
	broadcastStudentSessionEnded,
	cancelStudentLogoutInOtherTabs,
	prepareStudentLogoutInOtherTabs
} from "@/modules/studentSessionBroadcast";
import {
	endStudentSessionHandoff,
	prepareStudentSessionHandoff,
	resumeStudentSessionHandoff,
	suspendStudentSessionHandoff
} from "@/modules/studentSessionHandoff";

type Displayable = string | number | boolean | null | undefined | string[];

/* ------------------------------------------------------------------ */
/*  TypeScript interfaces                                             */
/* ------------------------------------------------------------------ */
export type User = StudentAccount;

export interface Admin {
	_id: string;
	name: string;
	email: string;
	passwordChangedAt?: string | null;
	editAdmins: boolean;
	saveEdit: string;
	[key: string]: Displayable;
}

/* ------------------------------------------------------------------ */
/*  Pinia store                                                       */
/* ------------------------------------------------------------------ */
export const useAppStore = defineStore("app", {
	state: () => ({
		currentUser: null as User | null,
		currentAdmin: null as Admin | null,
		adminSessionRevalidating: false,
		adminSessionValidatedAt: 0,
		studentRequiresPasswordSetup: false,
		studentSessionRevalidating: false,
		studentSessionValidatedAt: 0,
		sessionBootstrapStatus: "pending" as "failed" | "pending" | "ready",
		sessionRevision: 0,

		error: null as string | null
	}),

	getters: {
		isLoggedIn: state => !!state.currentAdmin || !!state.currentUser,

		isAdmin: state => !!state.currentAdmin,

		isStudent: state => !!state.currentUser,

		currentStudent: state => state.currentUser,

		studentProjectOwnerID: state =>
			state.currentUser && !state.studentRequiresPasswordSetup
				? state.currentUser._id
				: null
	},

	actions: {
		async bootstrapSession() {
			const bootstrapRevision = this.sessionRevision;
			const existingAdminID = this.currentAdmin?._id ?? null;
			this.sessionBootstrapStatus = "pending";
			try {
				const { data } = await api.get<{ adminID: string | null }>(
					"/accounts/me"
				);
				if (this.sessionRevision !== bootstrapRevision) {
					this.sessionBootstrapStatus = "ready";
					return;
				}
				if (data.adminID) {
					const { data: adminData } = await api.get<{
						currentAdmin: Admin;
					}>("/admins/loggedin");
					if (this.sessionRevision !== bootstrapRevision) {
						this.sessionBootstrapStatus = "ready";
						return;
					}
					this.setCurrentAdmin(adminData.currentAdmin);
					this.sessionBootstrapStatus = "ready";
					return;
				}

				if (!studentAccountsAreEnabled()) {
					this.setStudentSession({
						student: null,
						requiresPasswordSetup: false
					});
					this.sessionBootstrapStatus = "ready";
					return;
				}

				const session = await fetchStudentSession();
				if (this.sessionRevision !== bootstrapRevision) {
					this.sessionBootstrapStatus = "ready";
					return;
				}
				this.setStudentSession(session);
				this.sessionBootstrapStatus = "ready";
			} catch {
				// Keep the anonymous shell responsive during an outage, and never
				// let a delayed bootstrap failure erase a newer interactive login.
				if (this.sessionRevision !== bootstrapRevision) {
					this.sessionBootstrapStatus = "ready";
					return;
				}
				if (
					existingAdminID &&
					this.sessionRevision === bootstrapRevision
				) {
					this.clearSession();
				}
				this.sessionBootstrapStatus = "failed";
			}
		},

		/* ---------- setters ---------- */
		setCurrentUser(u: User | null) {
			this.sessionRevision += 1;
			this.currentUser = u;
			if (u) {
				this.currentAdmin = null;
				this.studentSessionRevalidating = false;
				this.studentSessionValidatedAt = Date.now();
			} else {
				this.studentRequiresPasswordSetup = false;
				if (!this.studentSessionRevalidating)
					this.studentSessionValidatedAt = 0;
			}
		},
		setCurrentAdmin(a: Admin | null) {
			this.sessionRevision += 1;
			this.currentAdmin = a;
			this.adminSessionRevalidating = false;
			this.adminSessionValidatedAt = a ? Date.now() : 0;
			if (a) {
				this.currentUser = null;
				this.studentRequiresPasswordSetup = false;
				this.studentSessionRevalidating = false;
				this.studentSessionValidatedAt = 0;
			}
		},
		setStudentSession(session: StudentSession) {
			if (!session.student) {
				this.setCurrentUser(null);
				this.studentRequiresPasswordSetup = false;
				return;
			}
			// Remove every legacy owner-keyed browser record before exposing a
			// student identity on a shared classroom device. Anonymous projects
			// and their atomic import markers remain available.
			clearAllStudentPythonProjectRecoveryFromLocalStorage();
			void purgeAllStudentPythonProjectRecovery().catch(() => undefined);
			volatileStudentPythonProjectRecovery.retainAcrossOwnerChange(
				session.student._id
			);
			this.setCurrentUser(session.student);
			this.studentRequiresPasswordSetup = session.requiresPasswordSetup;
		},
		setError(e: string | null) {
			this.error = e;
		},
		clearSession() {
			this.sessionRevision += 1;
			this.currentUser = null;
			this.currentAdmin = null;
			this.adminSessionRevalidating = false;
			this.adminSessionValidatedAt = 0;
			this.studentRequiresPasswordSetup = false;
			this.studentSessionRevalidating = false;
			this.studentSessionValidatedAt = 0;
			this.error = null;
		},
		hideAdminSession(expectedAdminID?: string | null) {
			const adminID = this.currentAdmin?._id ?? expectedAdminID ?? null;
			if (!adminID) return null;
			this.sessionRevision += 1;
			this.currentUser = null;
			this.currentAdmin = null;
			this.adminSessionRevalidating = true;
			this.adminSessionValidatedAt = 0;
			this.studentRequiresPasswordSetup = false;
			this.error = null;
			return adminID;
		},
		hideStudentSession(expectedStudentID?: string | null) {
			if (this.currentAdmin) return null;
			const studentID =
				this.currentUser?._id ?? expectedStudentID ?? null;
			if (!studentID) return null;
			if (
				this.currentUser?._id === studentID &&
				!this.studentRequiresPasswordSetup
			) {
				// The mounted IDE handoff synchronously snapshots and hides the
				// old owner into volatile memory before async revalidation.
				void suspendStudentSessionHandoff(studentID).catch(
					() => undefined
				);
			}
			this.sessionRevision += 1;
			this.currentUser = null;
			this.studentRequiresPasswordSetup = false;
			this.studentSessionRevalidating = true;
			this.studentSessionValidatedAt = 0;
			this.error = null;
			return studentID;
		},
		cancelStudentSessionRevalidation() {
			this.studentSessionRevalidating = false;
			if (!this.currentUser) this.studentSessionValidatedAt = 0;
		},
		async revalidateStudentSession(expectedStudentID: string) {
			const validationRevision = this.sessionRevision;
			const failClosed = () => {
				if (this.sessionRevision === validationRevision) {
					void endStudentSessionHandoff(expectedStudentID).catch(
						() => undefined
					);
					this.clearSession();
				}
			};

			try {
				const session = await fetchStudentSession();
				if (this.sessionRevision !== validationRevision) return false;
				if (session.student?._id !== expectedStudentID) {
					failClosed();
					return false;
				}
				this.setStudentSession(session);
				return true;
			} catch {
				failClosed();
				return false;
			}
		},
		async revalidateAdminSession(expectedAdminID: string) {
			const validationRevision = this.sessionRevision;
			const failClosed = () => {
				if (this.sessionRevision === validationRevision) {
					this.clearSession();
				}
			};

			try {
				const { data: marker } = await api.get<{
					adminID: string | null;
				}>("/accounts/me");
				if (this.sessionRevision !== validationRevision) return false;
				if (marker.adminID !== expectedAdminID) {
					failClosed();
					return false;
				}

				const { data } = await api.get<{ currentAdmin: Admin }>(
					"/admins/loggedin"
				);
				if (this.sessionRevision !== validationRevision) return false;
				if (data.currentAdmin?._id !== expectedAdminID) {
					failClosed();
					return false;
				}

				this.setCurrentAdmin(data.currentAdmin);
				return true;
			} catch {
				failClosed();
				return false;
			}
		},

		/* ---------- session helpers ---------- */
		async logout() {
			const adminID = this.currentAdmin?._id ?? null;
			try {
				await api.delete("/accounts/logout");
				this.clearSession();
				broadcastStudentSessionEnded();
			} catch (error: unknown) {
				if (adminID) {
					try {
						const { data: marker } = await api.get<{
							adminID: string | null;
						}>("/accounts/me");
						if (marker.adminID === adminID) {
							const { data } = await api.get<{
								currentAdmin: Admin;
							}>("/admins/loggedin");
							if (data.currentAdmin?._id === adminID) {
								this.setCurrentAdmin(data.currentAdmin);
								this.setError(
									error instanceof Error
										? error.message
										: "Couldn’t log out. Try again."
								);
								return;
							}
						}
					} catch {
						// A failed or inconclusive probe cannot justify keeping
						// privileged classroom data visible.
					}
				}

				this.clearSession();
				broadcastStudentSessionEnded();
			}
		},

		async logoutStudent() {
			const studentID = this.currentUser?._id;
			if (!studentID) return;
			if (this.studentRequiresPasswordSetup) {
				await signOutStudent();
				this.setCurrentUser(null);
				this.setError(null);
				broadcastStudentSessionEnded();
				return;
			}
			let handoffPrepared = false;
			let logoutRequested = false;
			try {
				await prepareStudentSessionHandoff(studentID);
				handoffPrepared = true;
				await prepareStudentLogoutInOtherTabs(studentID);
				logoutRequested = true;
				await signOutStudent();
				await this.failClosedStudentSessionExit(studentID);
			} catch (error) {
				if (!logoutRequested) {
					if (handoffPrepared) {
						cancelStudentLogoutInOtherTabs(studentID);
						await resumeStudentSessionHandoff(studentID).catch(
							() => undefined
						);
					}
					throw error;
				}

				let recoveredSession: StudentSession;
				try {
					recoveredSession = await fetchStudentSession();
				} catch (probeError) {
					await this.failClosedStudentSessionExit(studentID);
					throw new Error(
						"Student session status could not be confirmed.",
						{ cause: probeError }
					);
				}

				if (
					recoveredSession.student?._id === studentID &&
					!recoveredSession.requiresPasswordSetup
				) {
					this.setStudentSession(recoveredSession);
					await this.cancelStudentSessionExit(studentID);
					throw error;
				}

				await this.failClosedStudentSessionExit(studentID);
			}
		},

		async prepareStudentSessionExit() {
			const studentID = this.currentUser?._id;
			if (!studentID) return null;
			if (this.studentRequiresPasswordSetup) return null;
			let localPrepared = false;
			try {
				await prepareStudentSessionHandoff(studentID);
				localPrepared = true;
				await prepareStudentLogoutInOtherTabs(studentID);
				return studentID;
			} catch (error) {
				if (localPrepared) {
					cancelStudentLogoutInOtherTabs(studentID);
					await resumeStudentSessionHandoff(studentID).catch(
						() => undefined
					);
				}
				throw error;
			}
		},

		async cancelStudentSessionExit(studentID: string) {
			cancelStudentLogoutInOtherTabs(studentID);
			await resumeStudentSessionHandoff(studentID);
		},

		async finishStudentSessionExit(studentID?: string | null) {
			if (studentID) {
				await Promise.resolve(
					endStudentSessionHandoff(studentID)
				).catch(() => undefined);
			}
			this.setCurrentUser(null);
			this.setError(null);
			broadcastStudentSessionChanged(null, "admin");
		},

		async failClosedStudentSessionExit(studentID?: string | null) {
			if (studentID) {
				await Promise.resolve(
					endStudentSessionHandoff(studentID)
				).catch(() => undefined);
			}
			this.clearSession();
			broadcastStudentSessionEnded();
		},

		async acceptStudentSessionEndedFromAnotherTab() {
			const studentID = this.currentUser?._id;
			if (!studentID) return;
			try {
				await endStudentSessionHandoff(studentID);
			} finally {
				this.setCurrentUser(null);
				this.setError(null);
			}
		},

		async completeStudentPassword(password: string, requestID: string) {
			const expectedStudentID = this.currentUser?._id ?? null;
			const expectedRevision = this.sessionRevision;
			if (
				!expectedStudentID ||
				this.currentAdmin ||
				!this.studentRequiresPasswordSetup
			) {
				throw new Error("Student password setup is no longer active.");
			}
			const session = await setStudentPassword(password, requestID);
			if (
				session.passwordSetupRequestID !== requestID ||
				session.student?._id !== expectedStudentID ||
				session.requiresPasswordSetup
			) {
				throw new Error(
					"Password change could not be confirmed for this request."
				);
			}
			if (
				this.sessionRevision !== expectedRevision ||
				this.currentAdmin ||
				this.currentUser?._id !== expectedStudentID ||
				!this.studentRequiresPasswordSetup
			) {
				throw new Error("Student password setup is no longer active.");
			}
			this.setStudentSession(session);
			return session;
		},

		async refreshCurrentUser() {
			try {
				const session = await fetchStudentSession();
				this.setStudentSession(session);
			} catch {
				this.setCurrentUser(null);
			}
		},

		async refreshCurrentAdmin() {
			try {
				const { data } = await api.get<{ currentAdmin: Admin }>(
					"/admins/loggedin"
				);
				this.setCurrentAdmin(data.currentAdmin);
			} catch {
				this.clearSession();
			}
		}
	}
});
