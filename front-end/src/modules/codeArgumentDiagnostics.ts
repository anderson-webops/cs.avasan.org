import type { Diagnostic } from "@codemirror/lint";
import type { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

type Node = ReturnType<typeof syntaxTree>["topNode"];
type Language = "python" | "java";
type Binding =
	| { kind: "function"; node: Node }
	| { kind: "class"; node: Node }
	| { kind: "instance"; className: string; node: Node }
	| { kind: "unknown" };
interface Parameter {
	name: string;
	optional: boolean;
	keywordOnly: boolean;
	positionalOnly: boolean;
}

const pythonScopes = new Set([
	"Script",
	"FunctionDefinition",
	"ClassDefinition",
	"LambdaExpression"
]);
const javaScopes = new Set([
	"Program",
	"ClassDeclaration",
	"MethodDeclaration",
	"ConstructorDeclaration",
	"Block",
	"LambdaExpression"
]);

function children(node: Node): Node[] {
	const result: Node[] = [];
	for (let child = node.firstChild; child; child = child.nextSibling)
		result.push(child);
	return result;
}

// The parser supplies top-level commas, so commas in defaults, strings, nested
// calls and type annotations cannot be mistaken for argument separators.
function groups(node: Node, state: EditorState): Node[][] | null {
	const text = state.sliceDoc(node.from, node.to);
	if (!text.startsWith("(") || !text.endsWith(")")) return null;
	const result: Node[][] = [];
	let group: Node[] = [];
	for (const child of children(node).slice(1, -1)) {
		if (["Comment", "BlockComment", "LineComment"].includes(child.name))
			continue;
		if (child.name === ",") {
			result.push(group);
			group = [];
		} else {
			group.push(child);
		}
	}
	if (group.length) result.push(group);
	return result;
}

/**
 * Conservative, current-file checks. Never execute student code or infer an
 * imported/dynamic callable's signature. Ambiguous bindings are left to runtime.
 */
export function codeArgumentDiagnostics(
	state: EditorState,
	language: Language
): Diagnostic[] {
	if (state.doc.length > 200_000) return [];
	const tree = syntaxTree(state);
	const nodes: Node[] = [];
	const cursor = tree.cursor();
	do {
		// Incomplete syntax while typing is handled by the syntax diagnostics.
		if (
			cursor.type.isError ||
			cursor.name === "ScopeStatement" ||
			nodes.length >= 30_000
		) {
			return [];
		}
		nodes.push(cursor.node);
	} while (cursor.next());
	const scopes = language === "python" ? pythonScopes : javaScopes;
	const tables = new Map<string, Map<string, Binding[]>>();
	const changedMembers = new Set<string>();
	const text = (node: Node) => state.sliceDoc(node.from, node.to);
	const nameOf = (node: Node, name: string) => {
		const child = node.getChild(name);
		return child ? text(child) : "";
	};
	const scopeOf = (node: Node): Node => {
		let parent = node.parent;
		while (parent && !scopes.has(parent.name)) parent = parent.parent;
		return parent ?? tree.topNode;
	};
	const add = (scope: Node, name: string, binding: Binding) => {
		if (!name) return;
		let table = tables.get(`${scope.name}:${scope.from}`);
		if (!table)
			tables.set(`${scope.name}:${scope.from}`, (table = new Map()));
		const previous = table.get(name) ?? [];
		previous.push(binding);
		table.set(name, previous);
	};
	const lookup = (
		name: string,
		origin: Node,
		includeClass = false
	): Binding | null => {
		let scope = scopeOf(origin);
		while (true) {
			if (includeClass || scope.name !== "ClassDefinition") {
				const bindings = tables
					.get(`${scope.name}:${scope.from}`)
					?.get(name);
				if (bindings) return bindings.length === 1 ? bindings[0] : null;
			}
			if (!scope.parent) return null;
			scope = scopeOf(scope);
		}
	};
	const containingClass = (node: Node): Node | null => {
		let parent = node.parent;
		while (
			parent &&
			!["ClassDefinition", "ClassDeclaration"].includes(parent.name)
		) {
			parent = parent.parent;
		}
		return parent;
	};

	for (const node of nodes) {
		const scope = scopeOf(node);
		if (language === "python") {
			if (
				node.name === "FunctionDefinition" ||
				node.name === "ClassDefinition"
			) {
				add(scope, nameOf(node, "VariableName"), {
					kind:
						node.name === "FunctionDefinition"
							? "function"
							: "class",
					node
				});
				if (node.name === "FunctionDefinition") {
					for (const parameter of node
						.getChild("ParamList")
						?.getChildren("VariableName") ?? [])
						add(node, text(parameter), { kind: "unknown" });
				}
			} else if (
				node.name === "AssignStatement" ||
				node.name === "UpdateStatement" ||
				node.name === "NamedExpression"
			) {
				const parts = children(node);
				const op = parts.findIndex(child =>
					["AssignOp", "UpdateOp"].includes(child.name)
				);
				const target = parts[0];
				const value = parts[op + 1];
				if (target?.name === "MemberExpression")
					changedMembers.add(nameOf(target, "PropertyName"));
				if (
					op === 1 &&
					target?.name === "VariableName" &&
					parts.filter(child => child.name === "AssignOp").length ===
						1
				) {
					const className =
						value?.name === "CallExpression" &&
						value.firstChild?.name === "VariableName"
							? text(value.firstChild)
							: "";
					add(
						scope,
						text(target),
						className
							? { kind: "instance", className, node }
							: { kind: "unknown" }
					);
				} else {
					const lastOp = parts.findLastIndex(child =>
						["AssignOp", "UpdateOp"].includes(child.name)
					);
					for (const target of parts.slice(0, lastOp)) {
						if (target.name === "VariableName")
							add(scope, text(target), { kind: "unknown" });
					}
				}
			} else if (["WithStatement", "TryStatement"].includes(node.name)) {
				const parts = children(node);
				for (let index = 1; index < parts.length; index++) {
					if (
						parts[index - 1].name === "as" &&
						parts[index].name === "VariableName"
					) {
						add(scope, text(parts[index]), { kind: "unknown" });
					}
				}
			} else if (node.name === "ImportStatement") {
				for (const name of node.getChildren("VariableName"))
					add(scope, text(name), { kind: "unknown" });
			} else if (node.name === "ForStatement") {
				for (const child of children(node)) {
					if (child.name === "in") break;
					if (child.name === "VariableName")
						add(scope, text(child), { kind: "unknown" });
				}
			}
		} else {
			if (node.name === "ClassDeclaration")
				add(scope, nameOf(node, "Definition"), { kind: "class", node });
			if (
				node.name === "VariableDeclarator" ||
				node.name === "FormalParameter"
			) {
				const owner =
					node.name === "FormalParameter" ? node : node.parent;
				const className = owner ? nameOf(owner, "TypeName") : "";
				add(
					scope,
					nameOf(node, "Definition"),
					className
						? { kind: "instance", className, node }
						: { kind: "unknown" }
				);
			}
		}
	}

	const classFor = (binding: Binding | null): Node | null => {
		if (binding?.kind === "class") return binding.node;
		if (binding?.kind !== "instance") return null;
		const definition = lookup(
			binding.className,
			binding.node,
			language === "java"
		);
		return definition?.kind === "class" ? definition.node : null;
	};
	const classMethods = (owner: Node, name: string): Node[] => {
		if (language === "python") {
			const bindings = tables
				.get(`${owner.name}:${owner.from}`)
				?.get(name);
			return bindings?.length === 1 && bindings[0].kind === "function"
				? [bindings[0].node]
				: [];
		}
		const body = owner.getChild("ClassBody");
		if (!body) return [];
		return children(body).filter(
			child =>
				["MethodDeclaration", "ConstructorDeclaration"].includes(
					child.name
				) && nameOf(child, "Definition") === name
		);
	};
	const pythonParameters = (definition: Node): Parameter[] | null => {
		const list = definition.getChild("ParamList");
		const parts = list ? groups(list, state) : null;
		if (!parts || !list) return null;
		const parameters: Parameter[] = [];
		let keywordOnly = false;
		// The Python parser omits the positional-only slash from the node list.
		let previousEnd = list.from;
		let positionalOnlyEnd = -1;
		for (const child of children(list)) {
			if (state.sliceDoc(previousEnd, child.from).trim() === "/")
				positionalOnlyEnd = child.from;
			previousEnd = child.to;
		}
		for (const group of parts) {
			if (!group.length) continue;
			if (["*", "**"].includes(text(group[0]))) {
				keywordOnly = true;
				continue;
			}
			const name = group.find(child => child.name === "VariableName");
			if (!name) return null;
			parameters.push({
				name: text(name),
				optional: group.some(child => child.name === "AssignOp"),
				keywordOnly,
				positionalOnly: name.from < positionalOnlyEnd
			});
		}
		return parameters;
	};
	const diagnostics: Diagnostic[] = [];
	for (const call of nodes) {
		if (diagnostics.length >= 100) break;
		if (language === "python" && call.name === "CallExpression") {
			let context: Node | null = call.parent;
			let uncertainScope = false;
			while (context) {
				if (
					context.name === "LambdaExpression" ||
					context.name.includes("Comprehension")
				) {
					uncertainScope = true;
				}
				context = context.parent;
			}
			if (uncertainScope) continue;
			const callee = call.firstChild;
			const args = call.getChild("ArgList");
			const argumentsList = args ? groups(args, state) : null;
			if (!callee || !args || !argumentsList) continue;
			if (
				argumentsList.some(
					group =>
						!group.length || ["*", "**"].includes(text(group[0]))
				)
			) {
				continue;
			}
			let definition: Node | null = null;
			let bound = false;
			if (callee.name === "VariableName") {
				const binding = lookup(text(callee), call);
				if (binding?.kind === "function") {
					definition = binding.node;
				} else if (
					binding?.kind === "class" &&
					binding.node.parent?.name !== "DecoratedStatement"
				) {
					const constructors = classMethods(binding.node, "__init__");
					if (
						constructors.length === 1 &&
						!classMethods(binding.node, "__new__").length
					) {
						definition = constructors[0];
						bound = true;
					}
				}
			} else if (
				callee.name === "MemberExpression" &&
				callee.firstChild?.name === "VariableName"
			) {
				const member = nameOf(callee, "PropertyName");
				if (changedMembers.has(member)) continue;
				const receiver = text(callee.firstChild);
				const binding = lookup(receiver, call);
				let owner = classFor(binding);
				bound = binding?.kind === "instance";
				// Infer only the actual first parameter of the enclosing method, not
				// every variable spelled "self" elsewhere in the file.
				const scope = scopeOf(call);
				const receiverBindings = tables
					.get(`${scope.name}:${scope.from}`)
					?.get(receiver);
				if (
					scope.name === "FunctionDefinition" &&
					scopeOf(scope).name === "ClassDefinition" &&
					receiverBindings?.length === 1 &&
					!scope.parent
						?.getChildren("Decorator")
						.some(node => text(node).trim() === "@staticmethod") &&
					nameOf(scope.getChild("ParamList")!, "VariableName") ===
						receiver
				) {
					owner = containingClass(scope);
					bound = !scope.parent
						?.getChildren("Decorator")
						.some(node => text(node).trim() === "@classmethod");
				}
				if (!owner || owner.parent?.name === "DecoratedStatement")
					continue;
				const methods = classMethods(owner, member);
				if (methods.length === 1) definition = methods[0];
			}
			if (!definition) continue;
			const decorators =
				definition.parent?.name === "DecoratedStatement"
					? definition.parent.getChildren("Decorator").map(text)
					: [];
			if (
				decorators.some(
					value => !/^@(?:staticmethod|classmethod)\s*$/.test(value)
				)
			) {
				continue;
			}
			if (decorators.some(value => value.trim() === "@staticmethod"))
				bound = false;
			if (decorators.some(value => value.trim() === "@classmethod"))
				bound = true;
			let parameters = pythonParameters(definition);
			if (!parameters) continue;
			if (bound && parameters[0] && !parameters[0].keywordOnly)
				parameters = parameters.slice(1);
			const keywords = new Set<string>();
			let positional = 0;
			for (const group of argumentsList) {
				if (
					group[0].name === "VariableName" &&
					group[1]?.name === "AssignOp"
				) {
					keywords.add(text(group[0]));
				} else {
					positional++;
				}
			}
			const missing = parameters.filter(parameter => {
				if (!parameter.keywordOnly && positional > 0) {
					positional--;
					return false;
				}
				return (
					!parameter.optional &&
					(parameter.positionalOnly || !keywords.has(parameter.name))
				);
			});
			if (missing.length) {
				diagnostics.push({
					from: callee.from,
					to: call.to,
					severity: "warning",
					source: "Arguments",
					message: `${text(callee)}() is missing required ${missing.length === 1 ? "argument" : "arguments"}: ${missing.map(parameter => `'${parameter.name}'`).join(", ")}.`
				});
			}
		} else if (
			language === "java" &&
			["MethodInvocation", "ObjectCreationExpression"].includes(call.name)
		) {
			const args = call.getChild("ArgumentList");
			const argumentsList = args ? groups(args, state) : null;
			if (!args || !argumentsList) continue;
			const constructor = call.name === "ObjectCreationExpression";
			const name = nameOf(call, constructor ? "TypeName" : "MethodName");
			const parts = children(call);
			const receiver = parts[0];
			let owner: Node | null;
			if (constructor) owner = classFor(lookup(name, call, true));
			else if (receiver.name === "MethodName" || receiver.name === "this")
				owner = containingClass(call);
			else if (receiver.name === "Identifier")
				owner = classFor(lookup(text(receiver), call, true));
			else continue;
			if (
				!owner ||
				(!constructor &&
					(owner.getChild("Superclass") ||
						owner.getChild("SuperInterfaces")))
			) {
				continue;
			}
			const definitions = classMethods(owner, name);
			if (!definitions.length) continue;
			const counts = definitions.map(definition => {
				const parameters = definition.getChild("FormalParameters");
				return parameters?.getChildren("FormalParameter").length ?? 0;
			});
			const minimum = Math.min(...counts);
			if (argumentsList.length < minimum) {
				diagnostics.push({
					from: call.from,
					to: call.to,
					severity: "warning",
					source: "Arguments",
					message: `${name}() requires at least ${minimum} ${minimum === 1 ? "argument" : "arguments"}; ${argumentsList.length} provided.`
				});
			}
		}
	}
	return diagnostics;
}
