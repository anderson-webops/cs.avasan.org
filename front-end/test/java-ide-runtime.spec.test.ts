import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { KarelWorldState } from "../src/modules/javaIdeRuntime";
import {
	blueJMainStarterCode,
	blueJStudentStarterCode,
	javaOutlineStarterCode,
	javaStarterCode,
	karelOutlineStarterCode,
	karelOutlineWorld,
	karelStarterCode,
	karelStarterWorld
} from "../src/modules/pythonIde";
import { runJavaIdeProject } from "../src/modules/javaIdeRuntime";
import { createKarelWorldPlaybackController } from "../src/modules/karelWorldPlayback";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
}

function karelStep(label: string): KarelWorldState {
	return {
		beepers: [],
		cols: 3,
		paints: [],
		robot: {
			avenue: label === "initial" ? 1 : label === "middle" ? 2 : 3,
			beepers: 0,
			direction: "East",
			name: "karel",
			street: 1
		},
		rows: 3,
		trace: [label],
		walls: []
	};
}

describe("java IDE runtime", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("skips oversized Java and Karel sources before preview parsing", () => {
		const oversizedSource = `public class Main {\n${"// source padding\n".repeat(13000)}}`;
		const javaResult = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: oversizedSource
				}
			],
			mode: "java"
		});
		const karelResult = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: oversizedSource.replace("Main", "Algo")
				},
				{
					name: "world.txt",
					content: karelStarterWorld
				}
			],
			mode: "karel"
		});

		expect(javaResult.stdout).toEqual([]);
		expect(javaResult.stderr).toEqual([
			expect.stringContaining("Java preview skipped files over")
		]);
		expect(karelResult.stdout).toEqual([]);
		expect(karelResult.karelWorld).toBeUndefined();
		expect(karelResult.stderr).toEqual(javaResult.stderr);
	});

	it("skips oversized active Java helpers before entry-point selection", () => {
		const oversizedHelper = `public class Helper {\n${"// helper padding\n".repeat(13000)}}`;
		const result = runJavaIdeProject({
			activeFileName: "Helper.java",
			files: [
				{
					name: "Helper.java",
					content: oversizedHelper
				},
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("safe main");
    }
}
`
				}
			],
			mode: "java"
		});

		expect(result.stdout).toEqual([]);
		expect(result.stderr).toEqual([
			expect.stringContaining("Java preview skipped files over")
		]);
	});

	it("skips oversized combined Java projects before preview parsing", () => {
		const files = Array.from({ length: 5 }, (_, index) => ({
			content: `public class Helper${index} {\n${"// project padding\n".repeat(10000)}}`,
			name: `Helper${index}.java`
		}));
		const result = runJavaIdeProject({
			activeFileName: "Helper0.java",
			files,
			mode: "java"
		});

		expect(result.stdout).toEqual([]);
		expect(result.stderr).toEqual([
			expect.stringContaining(
				"Java preview skipped projects over 800,000 total Java characters"
			)
		]);
	});

	it("previews the Java and Karel outline templates in the browser subset", () => {
		const javaResult = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: javaOutlineStarterCode
				}
			],
			mode: "java"
		});
		const karelResult = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: karelOutlineStarterCode
				},
				{
					name: "world.txt",
					content: karelOutlineWorld
				}
			],
			mode: "karel"
		});

		expect(javaResult.stderr).toEqual([]);
		expect(javaResult.stdout).toEqual(["Student: 0"]);
		expect(karelResult.stderr).toEqual([]);
		expect(karelResult.karelWorld?.robot).toMatchObject({
			avenue: 5,
			direction: "West",
			street: 1
		});
		expect(karelResult.stdout.at(-1)).toContain("direction: West");
	});

	it("previews Java console print output", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: javaStarterCode.replace(
						"System.out.println(GREETING_MESSAGE);",
						'System.out.print("Hello, ");\n        System.out.println("Java " + (2 + 3));'
					)
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Hello, Java 5"]);
	});

	it("previews the BlueJ starter through browser-friendly console output", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: blueJMainStarterCode
				},
				{
					name: "Student.java",
					content: blueJStudentStarterCode
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"Ada is in grade 9",
			"Average: 91"
		]);
	});

	it("runs the Java driver file when a helper class is active", () => {
		const result = runJavaIdeProject({
			activeFileName: "Dog.java",
			files: [
				{
					name: "Dog.java",
					content: `public class Dog {
    // main(String[] args) belongs in Main.java.
    String reminder = "main(String[] args)";
}
`
				},
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("driver");
    }
}
`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["driver"]);
	});

	it("runs the Karel driver file when a helper class is active", () => {
		const result = runJavaIdeProject({
			activeFileName: "Helper.java",
			files: [
				{
					name: "Helper.java",
					content: `public class Helper {
    // run() belongs in MyProgram.java.
    String reminder = "run()";
}
`
				},
				{
					name: "MyProgram.java",
					content: karelOutlineStarterCode
				},
				{
					name: "world.txt",
					content: karelOutlineWorld
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 5,
			direction: "West",
			street: 1
		});
	});

	it("explains the beginner Java preview scope when no main body runs", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: "public class Main {\n}\n"
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([
			"The browser Java runner previews beginner console Java from main: System.out output, variables, Scanner input, decisions, loops, helper methods, arrays, ArrayLists, and maps."
		]);
		expect(result.stdout).toEqual([]);
	});

	it("previews beginner Java formatted console output", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        String name = "Ada";
        int score = 7;
        double ratio = 2.0 / 3.0;
        System.out.printf("%s scored %03d%n", name, score);
        System.out.format("ratio=%.2f done=%b", ratio, true);
        System.out.println();
        System.out.println(String.format("[%6s] %.1f%%", name, ratio * 100));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"Ada scored 007",
			"ratio=0.67 done=true",
			"[   Ada] 66.7%"
		]);
	});

	it("bounds Java console output lines in the browser runner", () => {
		const printLines = Array.from(
			{ length: 520 },
			(_, index) => `        System.out.println("line ${index}");`
		).join("\n");
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
${printLines}
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stdout).toHaveLength(500);
		expect(result.stdout[0]).toBe("line 0");
		expect(result.stdout.at(-1)).toBe("line 499");
		expect(result.stderr).toContain(
			"Stopped Java preview after 500 output lines."
		);
	});

	it("bounds individual Java console output lines in the browser runner", () => {
		const longText = "x".repeat(13000);
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("${longText}");
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stdout).toHaveLength(1);
		expect(result.stdout[0]?.length).toBeLessThan(longText.length);
		expect(result.stdout[0]).toContain(
			"[Output truncated to keep the browser responsive.]"
		);
		expect(result.stderr).toContain(
			"Truncated Java output lines after 12,000 characters."
		);
	});

	it("ignores Java console prints inside comments", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        // System.out.println("hidden line");
        /*
           System.out.println("hidden block");
        */
        System.out.println("https://classes.example/java");
        System.out.println("literal /* not a comment */ text");
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"https://classes.example/java",
			"literal /* not a comment */ text"
		]);
	});

	it("previews simple Scanner input and beginner variables", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.print("Name: ");
        String name = input.nextLine();
        System.out.print("Age: ");
        int age = input.nextInt();
        System.out.println("Hi " + name + ", next year you will be " + (age + 1));
    }
}`
				}
			],
			inputText: "Jacob\n14",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"Name: Age: Hi Jacob, next year you will be 15"
		]);
	});

	it("skips oversized Java console input before scanner parsing", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        System.out.println(input.nextLine());
    }
}`
				}
			],
			inputText: "x".repeat(200001),
			mode: "java"
		});

		expect(result.stdout).toEqual([]);
		expect(result.stderr).toEqual([
			"Java preview skipped input over 200,000 characters. Shorten the input before running in the browser."
		]);
	});

	it("reports invalid Scanner numeric input without server execution", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        int age = input.nextInt();
        System.out.println("Age: " + age);
    }
}`
				}
			],
			inputText: "not-a-number",
			mode: "java"
		});

		expect(result.stderr).toEqual([
			'Scanner could not read int from "not-a-number".'
		]);
		expect(result.stdout).toEqual(["Age: 0"]);
	});

	it("previews Scanner token reads and nextLine newline behavior", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String name = input.next();
        int age = input.nextInt();
        String leftover = input.nextLine();
        String city = input.nextLine();
        double temp = input.nextDouble();
        boolean ready = input.nextBoolean();
        System.out.println(name + "|" + age + "|" + leftover + "|" + city + "|" + temp + "|" + ready);
    }
}`
				}
			],
			inputText: "Ada 36\nSeattle WA\n98.6 true",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Ada|36||Seattle WA|98.6|true"]);
	});

	it("previews Scanner hasNext validation without consuming tokens", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String skipped = "";
        while (!input.hasNextInt() && input.hasNext()) {
            skipped = input.next();
        }
        int value = input.nextInt();
        System.out.println(skipped + ":" + value + ":" + input.hasNextLine());
    }
}`
				}
			],
			inputText: "oops 5\nnext line",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["oops:5:true"]);
	});

	it("only consumes IDE input from declared Scanner receivers", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        String label = "not a scanner";
        int value = label.nextInt();
        System.out.println(value);
    }
}`
				}
			],
			inputText: "42",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["label.nextInt()"]);
	});

	it("previews Java console if/else decisions from stored input", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        String color = input.nextLine();
        int age = input.nextInt();
        boolean hasTicket = input.nextBoolean();

        if (color.equalsIgnoreCase("blue") && age >= 13 && hasTicket) {
            System.out.println("Enter the blue room");
        } else if (age < 13) {
            System.out.println("Come back later");
        } else {
            System.out.println("Try another line");
        }
    }
}`
				}
			],
			inputText: "Blue\n14\ntrue",
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Enter the blue room"]);
	});

	it("previews bounded Java console for and while loops", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        int total = 0;
        for (int i = 1; i <= 3; i++) {
            total += i;
            System.out.print(i);
        }
        System.out.println(" total=" + total);

        int count = 0;
        while (count < 2) {
            System.out.print(" w" + count);
            count++;
        }
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["123 total=6", " w0 w1"]);
	});

	it("previews beginner string, cast, and Math expressions", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        String word = "Python";
        String padded = "  grid  ";
        char letter = (char) ('a' + 2);
        char upper = 'A';
        System.out.println(word.length());
        System.out.println(word.charAt(2));
        System.out.println(word.substring(1, 4));
        System.out.println(word.equals("Python"));
        System.out.println(word.equalsIgnoreCase("PYTHON"));
        System.out.println(word.toLowerCase());
        System.out.println(word.toUpperCase());
        System.out.println(padded.trim());
        System.out.println(word.indexOf("th"));
        System.out.println(word.indexOf("x"));
        System.out.println(word.compareTo("Java"));
        System.out.println(word.compareTo("Python"));
        System.out.println(word.toUpperCase().indexOf("TH"));
        System.out.println(word.compareTo("Java") > 0);
        System.out.println((int) 3.9);
        System.out.println(Math.max(4, 7));
        System.out.println(Math.round(Math.PI * 100));
        System.out.println((int) Math.E);
        System.out.println(2 + 3 + " points");
        System.out.println("points " + 2 + 3);
        System.out.println(letter);
        System.out.println((int) upper);
        System.out.println(upper + 2);
        System.out.println('Z');
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"6",
			"t",
			"yth",
			"true",
			"true",
			"python",
			"PYTHON",
			"grid",
			"2",
			"-1",
			"6",
			"0",
			"2",
			"true",
			"3",
			"7",
			"314",
			"2",
			"5 points",
			"points 23",
			"c",
			"65",
			"67",
			"Z"
		]);
	});

	it("previews beginner java.util.Random expressions in the browser subset", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Random generator = new Random(4);
        int first = generator.nextInt(6);
        int second = generator.nextInt(6);
        generator.setSeed(4);
        boolean repeatsFirst = first == generator.nextInt(6);
        double decimal = generator.nextDouble();
        boolean coin = generator.nextBoolean();
        float floatValue = generator.nextFloat();
        java.util.Random fixed = new java.util.Random(9);

        System.out.println(first >= 0 && first < 6);
        System.out.println(second >= 0 && second < 6);
        System.out.println(repeatsFirst);
        System.out.println(decimal >= 0 && decimal < 1);
        System.out.println(coin == true || coin == false);
        System.out.println(floatValue >= 0 && floatValue < 1);
        System.out.println(fixed.nextInt(1));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"true",
			"true",
			"true",
			"true",
			"true",
			"true",
			"0"
		]);
	});

	it("previews beginner Java static methods with parameters and returns", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("sum=" + sum(2, 3));
        System.out.println("max=" + max(9, 4));
        System.out.println("even=" + isEven(sum(1, 5)));
        System.out.println("next=" + (sum(2, 3) + 1));
        say("done");
    }

    public static int sum(int a, int b) {
        return a + b;
    }

    public static int max(int a, int b) {
        if (a > b) {
            return a;
        }
        return b;
    }

    public static boolean isEven(int value) {
        return value % 2 == 0;
    }

    public static void say(String text) {
        System.out.println(text);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"sum=5",
			"max=9",
			"even=true",
			"next=6",
			"done"
		]);
	});

	it("shares Java class constants with helper methods instead of caller locals", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    private static final String SCORE_LABEL = "Score";
    private static final int SCORE_BONUS = 4;

    public static void main(String[] args) {
        String SCORE_LABEL = "Local";
        int SCORE_BONUS = 99;
        print_score(6);
        System.out.println("Main: " + SCORE_LABEL + " " + SCORE_BONUS);
    }

    static void print_score(int score) {
        System.out.println(SCORE_LABEL + ": " + (score + SCORE_BONUS));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["Score: 10", "Main: Local 99"]);
	});

	it("previews recursive Java return methods with a browser call-depth cap", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `public class Main {
    public static void main(String[] args) {
        System.out.println("factorial=" + factorial(5));
        System.out.println("capped=" + neverDone(0));
    }

    public static int factorial(int value) {
        if (value <= 1) {
            return 1;
        }
        return value * factorial(value - 1);
    }

    public static int neverDone(int value) {
        return neverDone(value + 1);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toContain(
			"Stopped Java preview after 40 nested method calls."
		);
		expect(result.stdout).toEqual(["factorial=120", "capped=null"]);
	});

	it("previews beginner Java arrays with indexing, copyOf, length, and loops", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = {2, 4, 6};
        scores[1] = scores[0] + 5;
        boolean[] flags = {true};

        int total = 0;
        for (int i = 0; i < scores.length; i++) {
            total += scores[i];
        }

        String[] names = new String[2];
        names[0] = "Ada";
        names[1] = "Grace";

        int[] padded = Arrays.copyOf(scores, 5);
        int[] trimmed = Arrays.copyOf(scores, 2);
        String[] moreNames = Arrays.copyOf(names, 3);
        boolean[] moreFlags = Arrays.copyOf(flags, 3);
        padded[0] = 99;

        System.out.println(Arrays.toString(scores));
        System.out.println(Arrays.toString(padded));
        System.out.println(Arrays.toString(trimmed));
        System.out.println(Arrays.toString(moreNames));
        System.out.println(Arrays.toString(moreFlags));
        System.out.println("total=" + total);
        System.out.println(names[1]);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"[2, 7, 6]",
			"[99, 7, 6, 0, 0]",
			"[2, 7]",
			"[Ada, Grace, null]",
			"[true, false, false]",
			"total=15",
			"Grace"
		]);
	});

	it("previews beginner Java Arrays.sort mutations for one-dimensional arrays", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scores = {7, 2, 6};
        String[] names = {"Grace", "Ada", "Linus"};

        Arrays.sort(scores);
        Arrays.sort(names);

        System.out.println(Arrays.toString(scores));
        System.out.println(Arrays.toString(names));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["[2, 6, 7]", "[Ada, Grace, Linus]"]);
	});

	it("previews beginner Java two-dimensional arrays with row and column indexing", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[][] grid = {{1, 2, 3}, {4, 5, 6}};
        grid[1][2] = grid[0][1] + 7;

        int total = 0;
        for (int row = 0; row < grid.length; row++) {
            for (int col = 0; col < grid[row].length; col++) {
                total += grid[row][col];
            }
        }

        int[][] blank = new int[2][2];
        blank[0][1] = total;

        System.out.println(grid.length);
        System.out.println(grid[0].length);
        System.out.println(total);
        System.out.println(Arrays.deepToString(grid));
        System.out.println(Arrays.deepToString(blank));
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"2",
			"3",
			"24",
			"[[1, 2, 3], [4, 5, 9]]",
			"[[0, 24], [0, 0]]"
		]);
	});

	it("previews beginner Java ArrayLists with add, get, set, remove, contains, clear, and size", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> names = new ArrayList<>();
        names.add("Ada");
        names.add("Grace");
        names.add(1, "Katherine");
        names.set(1, "Linus");
        names.remove("Grace");
        boolean hadAda = names.contains("Ada");
        boolean hadGrace = names.contains("Grace");

        ArrayList<Integer> points = new ArrayList<Integer>();
        points.add(3);
        points.add(4);

        System.out.println(names.size());
        System.out.println(names.get(1));
        System.out.println(points.get(0) + points.get(1));
        System.out.println(hadAda + ":" + hadGrace);
        names.clear();
        System.out.println(names.isEmpty());
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"2",
			"Linus",
			"7",
			"true:false",
			"true"
		]);
	});

	it("previews beginner Java maps with core map methods and entry iteration", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> counts = new HashMap<>();
        counts.put("Ada", 2);
        counts.put("Linus", 1);
        counts.putIfAbsent("Ada", 9);
        counts.putIfAbsent("Grace", 3);

        String trace = "";
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            trace += entry.getKey() + "=" + entry.getValue() + ";";
        }

        Map<String, Integer> sorted = new TreeMap<>();
        sorted.put("Linus", 1);
        sorted.put("Ada", 2);

        System.out.println(counts.get("Ada"));
        System.out.println(counts.getOrDefault("Karel", 0));
        System.out.println(counts.containsKey("Grace"));
        System.out.println(counts.size());
        System.out.println(counts.keySet());
        System.out.println(counts.values());
        System.out.println(counts.entrySet());
        System.out.println(trace);
        System.out.println(sorted.keySet());
        System.out.println(counts);
        counts.remove("Linus");
        counts.clear();
        System.out.println(counts.isEmpty());
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual([
			"2",
			"0",
			"true",
			"3",
			"[Ada, Linus, Grace]",
			"[2, 1, 3]",
			"[Ada=2, Linus=1, Grace=3]",
			"Ada=2;Linus=1;Grace=3;",
			"[Ada, Linus]",
			"{Ada=2, Linus=1, Grace=3}",
			"true"
		]);
	});

	it("previews beginner Java enhanced for loops over arrays and ArrayLists", () => {
		const result = runJavaIdeProject({
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        int[] scores = {2, 4, 6};
        int total = 0;
        for (int score : scores) {
            total += score;
        }

        ArrayList<String> names = new ArrayList<>();
        names.add("Ada");
        names.add("Grace");

        String initials = "";
        for (String name : names) {
            initials += name.charAt(0);
        }

        System.out.println(total);
        System.out.println(initials);
    }
}`
				}
			],
			mode: "java"
		});

		expect(result.stderr).toEqual([]);
		expect(result.stdout).toEqual(["12", "AG"]);
	});

	it("runs the beginner Karel command subset into a visual world state", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{ name: "Algo.java", content: karelStarterCode },
				{ name: "world.txt", content: karelStarterWorld }
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.rows).toBe(10);
		expect(result.karelWorld?.cols).toBe(10);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 4,
			direction: "West",
			name: "sam",
			street: 6
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 9,
			count: 1,
			street: 6
		});
		expect(result.karelWorldSteps).toHaveLength(6);
		expect(result.karelWorldSteps?.[0]?.robot).toMatchObject({
			avenue: 7,
			direction: "East",
			street: 6
		});
		expect(result.karelWorldSteps?.[1]?.robot?.direction).toBe("North");
		expect(result.karelWorldSteps?.[2]?.robot?.direction).toBe("West");
		expect(result.karelWorldSteps?.at(-1)?.robot).toMatchObject({
			avenue: 4,
			direction: "West",
			street: 6
		});
		expect(result.stdout.at(-1)).toContain("(avenue: 4)");
	});

	it("reports Karel boundary collisions without moving through them", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: karelStarterCode.replace(
						"private static final int MOVE_COUNT = 3;",
						"private static final int MOVE_COUNT = 10;"
					)
				},
				{ name: "world.txt", content: karelStarterWorld }
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([
			"sam.move() hit the edge of the world."
		]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 1,
			street: 6
		});
	});

	it("bounds oversized Karel world files before rendering snapshots", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(999, 999, East, 0);
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=999
cols=500
beeper 40 40 1
beeper 41 40 2
wall 40 40 east
wall 40 40 east
wall 41 40 west
paint 40 40 red
paint 40 41 blue`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld).toMatchObject({
			cols: 40,
			rows: 40,
			robot: {
				avenue: 40,
				street: 40
			}
		});
		expect(result.karelWorld?.beepers).toEqual([
			{
				avenue: 40,
				count: 1,
				street: 40
			}
		]);
		expect(result.karelWorld?.paints).toEqual([
			{
				avenue: 40,
				color: "#dc2626",
				street: 40
			}
		]);
		expect(result.karelWorld?.walls).toEqual([
			{
				avenue: 40,
				side: "east",
				street: 40
			}
		]);
		expect(result.karelWorldSteps?.[0]).toMatchObject({
			cols: 40,
			rows: 40
		});
	});

	it("caps oversized Karel world line counts before parsing late objects", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(1, 1, East, 0);
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{
					name: "world.txt",
					content: [
						"rows=5",
						"cols=5",
						...Array.from(
							{ length: 2100 },
							() => "wall 1 1 north"
						),
						"paint 1 1 red"
					].join("\n")
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([
			"Stopped reading Karel world after 2000 lines."
		]);
		expect(result.karelWorld?.walls).toEqual([
			{
				avenue: 1,
				side: "north",
				street: 1
			}
		]);
		expect(result.karelWorld?.paints).toEqual([]);
	});

	it("skips oversized Karel world text before splitting lines", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(1, 1, East, 0);
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=40\n${"wall 1 1 east ".repeat(20000)}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([
			"Skipped Karel world files over 200,000 characters."
		]);
		expect(result.karelWorld).toMatchObject({
			cols: 10,
			rows: 10,
			robot: {
				avenue: 1,
				direction: "East",
				street: 1
			}
		});
		expect(result.karelWorld?.walls).toEqual([]);
	});

	it("parses CodeHS-style labeled Karel world files", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(1, 1, East, 0);
        sam.move();
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{
					name: "world.txt",
					content: `Dimension: (3, 4)
Beeper: (1, 1); 2
Wall: (1, 1); East
Color: (2, 2); Blue`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual(["sam.move() hit a wall."]);
		expect(result.karelWorld).toMatchObject({
			cols: 4,
			rows: 3,
			robot: {
				avenue: 1,
				street: 1
			}
		});
		expect(result.karelWorld?.beepers).toEqual([
			{
				avenue: 1,
				count: 2,
				street: 1
			}
		]);
		expect(result.karelWorld?.paints).toEqual([
			{
				avenue: 2,
				color: "#2563eb",
				street: 2
			}
		]);
		expect(result.karelWorld?.walls).toEqual([
			{
				avenue: 1,
				side: "east",
				street: 1
			}
		]);
	});

	it("ignores inline comments before parsing Karel world objects", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(1, 1, East, 0);
        sam.move();
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=2 // keep this small
cols=3 # keep this narrow
Beeper: (1, 1); 2 // this count stays two
Wall: (1, 1); // East should stay a comment
Color: (1, 2); // Blue should stay a comment`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			street: 1
		});
		expect(result.karelWorld?.beepers).toEqual([
			{
				avenue: 1,
				count: 2,
				street: 1
			}
		]);
		expect(result.karelWorld?.walls).toEqual([]);
		expect(result.karelWorld?.paints).toEqual([]);
	});

	it("applies Karel dimensions before parsing world objects", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(20, 20, East, 0);
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{
					name: "world.txt",
					content: `beeper 20 20 1
wall 20 20 north
rows=20
cols=20`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld).toMatchObject({
			cols: 20,
			rows: 20,
			robot: {
				avenue: 20,
				street: 20
			}
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 20,
			count: 1,
			street: 20
		});
		expect(result.karelWorld?.walls).toContainEqual({
			avenue: 20,
			side: "north",
			street: 20
		});
	});

	it("keeps Karel animation snapshots independent as beeper counts change", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(1, 1, East, 2);
        sam.putBeeper();
        sam.putBeeper();
    }

    static {
        World.readWorld("world.txt");
    }
}`
				},
				{ name: "world.txt", content: "rows=3\ncols=3\n" }
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorldSteps?.map(step => step.beepers[0]?.count)).toEqual([
			undefined,
			1,
			2
		]);
	});

	it("runs Karel helper methods and simple loops from main only", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(6, 7, Directions.East, 0);
        turnRight(sam);
        moveTwice(sam);
        for (int i = 0; i < 2; i++) {
            sam.turnLeft();
        }
    }

    static void turnRight(UrRobot robot) {
        robot.turnLeft();
        robot.turnLeft();
        robot.turnLeft();
    }

    static void moveTwice(UrRobot robot) {
        robot.move();
        robot.move();
    }

    static void hidden(UrRobot robot) {
        robot.move();
    }

    static {
        World.setVisible(true);
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 7,
			direction: "North",
			street: 4
		});
		expect(result.stdout).toHaveLength(8);
	});

	it("previews Karel for loops that use class constants", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    private static final int START_INDEX = 0;
    private static final int MOVE_COUNT = 4;
    private static final int STEP_AMOUNT = 2;

    public void run() {
        for (int step = START_INDEX; step < MOVE_COUNT; step += STEP_AMOUNT) {
            move();
        }
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 3,
			direction: "East",
			name: "karel",
			street: 1
		});
		expect(result.stdout).toHaveLength(3);
	});

	it("caps long Karel preview loops in the browser runner", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(6, 7, East, 0);
        for (int i = 0; i < 600; i++) {
            sam.turnLeft();
        }
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([
			"Stopped Karel preview after 500 commands."
		]);
		expect(result.stdout).toHaveLength(501);
		expect(result.karelWorld?.robot?.direction).toBe("East");
	});

	it("runs CodeHS-style Karel commands from run methods", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        putBall();
        move();
        turnRight();
    }

    private void turnRight() {
        turnLeft();
        turnLeft();
        turnLeft();
    }

    private void hidden() {
        move();
    }
}`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "South",
			name: "karel",
			street: 1
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 1,
			count: 1,
			street: 1
		});
		expect(result.stdout).toHaveLength(6);
	});

	it("runs CodeHS-style Karel commands and helpers through this or super receivers", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (this.frontIsClear()) {
            this.stepAndPaint();
        }

        super.turnLeft();

        if (this.leftIsClear()) {
            this.move();
        }
    }

    private void stepAndPaint() {
        this.move();
        this.paint(Color.green);
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=3
cols=4`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "North",
			name: "karel",
			street: 2
		});
		expect(result.karelWorld?.paints).toContainEqual({
			avenue: 2,
			color: "#16a34a",
			street: 1
		});
		expect(result.karelWorldSteps).toHaveLength(5);
		expect(result.stdout).toHaveLength(5);
	});

	it("evaluates Karel conditions through object receivers", () => {
		const result = runJavaIdeProject({
			activeFileName: "Algo.java",
			files: [
				{
					name: "Algo.java",
					content: `import kareltherobot.UrRobot;
import kareltherobot.Directions;

public class Algo implements Directions {
    public static void main(String[] args) {
        UrRobot sam = new UrRobot(1, 1, East, 0);
        if (sam.frontIsClear()) {
            sam.move();
        }
        if (sam.leftIsClear()) {
            sam.turnLeft();
        }
        while (sam.frontIsClear()) {
            sam.move();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=3
cols=3`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "North",
			name: "sam",
			street: 3
		});
		expect(result.karelWorldSteps).toHaveLength(5);
		expect(result.stdout).toHaveLength(5);
	});

	it("runs CodeHS-style Karel if/else and while conditions", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (ballsPresent()) {
            takeBall();
        } else {
            move();
        }

        while (frontIsClear()) {
            move();
        }

        if (frontIsBlocked()) {
            turnLeft();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=3
cols=4`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 4,
			direction: "North",
			name: "karel",
			street: 1
		});
		expect(result.karelWorld?.beepers).toEqual([]);
		expect(result.stdout).toHaveLength(5);
	});

	it("evaluates Karel ball and facing conditions against preview state", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (ballsPresent()) {
            takeBall();
        }
        if (noBallsPresent()) {
            putBall();
        }
        if (facingEast()) {
            turnLeft();
        }
        if (!notFacingNorth()) {
            move();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=3
cols=4
beeper 1 1 1`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 1,
			direction: "North",
			street: 2
		});
		expect(result.karelWorld?.beepers).toContainEqual({
			avenue: 1,
			count: 1,
			street: 1
		});
		expect(result.stdout).toHaveLength(5);
	});

	it("evaluates compound Karel Java conditions in preview control flow", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        if (frontIsClear() && ballsPresent()) {
            takeBall();
            move();
        }

        if (frontIsBlocked() || noBallsPresent()) {
            turnLeft();
        }

        while (frontIsClear() && noBallsPresent()) {
            move();
        }

        if (!(ballsPresent() || facingWest()) && facingNorth()) {
            putBall();
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=2
cols=3
beeper 1 1 1`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "North",
			name: "karel",
			street: 2
		});
		expect(result.karelWorld?.beepers).toEqual([
			{ avenue: 2, count: 1, street: 2 }
		]);
	});

	it("previews CodeHS-style Karel painted cells and color conditions", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        paint(Color.red);
        if (colorIs(Color.red)) {
            move();
            paint(Color.blue);
        }
        if (colorIsNot(Color.red)) {
            paint(Color.random());
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=2
cols=3
paint 2 3 purple`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 2,
			direction: "East",
			street: 1
		});
		expect(result.karelWorld?.paints).toEqual(
			expect.arrayContaining([
				{ avenue: 1, color: "#dc2626", street: 1 },
				{ avenue: 3, color: "#9333ea", street: 2 }
			])
		);
		const randomPaint = result.karelWorld?.paints.find(
			paint => paint.street === 1 && paint.avenue === 2
		);
		expect(randomPaint?.color).toMatch(/^#[0-9a-f]{6}$/);
		expect(randomPaint?.color).not.toBe("#2563eb");
		expect(result.stdout).toHaveLength(5);
	});

	it("previews Karel paintCorner aliases and quoted corner colors", () => {
		const result = runJavaIdeProject({
			activeFileName: "MyProgram.java",
			files: [
				{
					name: "MyProgram.java",
					content: `public class MyProgram extends SuperKarel {
    public void run() {
        paintCorner("red");
        if (cornerColorIs("red")) {
            move();
            paintCorner(Color.BLUE);
        }
        if (cornerColorIsNot(Color.red)) {
            move();
            paintCorner("green");
        }
    }
}`
				},
				{
					name: "world.txt",
					content: `rows=1
cols=3`
				}
			],
			mode: "karel"
		});

		expect(result.stderr).toEqual([]);
		expect(result.karelWorld?.robot).toMatchObject({
			avenue: 3,
			direction: "East",
			street: 1
		});
		expect(result.karelWorld?.paints).toEqual(
			expect.arrayContaining([
				{ avenue: 1, color: "#dc2626", street: 1 },
				{ avenue: 2, color: "#2563eb", street: 1 },
				{ avenue: 3, color: "#16a34a", street: 1 }
			])
		);
		expect(result.karelWorldSteps).toHaveLength(6);
	});

	it("plays Karel world snapshots frame by frame and supports cancellation", async () => {
		vi.useFakeTimers();
		const shownSteps: KarelWorldState[] = [];
		const controller = createKarelWorldPlaybackController({
			delayMs: 350,
			showStep: step => shownSteps.push(step)
		});
		const steps = [
			karelStep("initial"),
			karelStep("middle"),
			karelStep("final")
		];

		const playback = controller.play(steps, () => true);

		expect(shownSteps.map(step => step.trace[0])).toEqual(["initial"]);
		await vi.advanceTimersByTimeAsync(349);
		expect(shownSteps.map(step => step.trace[0])).toEqual(["initial"]);
		await vi.advanceTimersByTimeAsync(1);
		expect(shownSteps.map(step => step.trace[0])).toEqual([
			"initial",
			"middle"
		]);
		await vi.advanceTimersByTimeAsync(350);
		expect(shownSteps.map(step => step.trace[0])).toEqual([
			"initial",
			"middle",
			"final"
		]);
		await expect(playback).resolves.toBe(true);

		const cancelledPlayback = controller.play(steps, () => true);
		controller.clear();
		await expect(cancelledPlayback).resolves.toBe(false);
		expect(vi.getTimerCount()).toBe(0);
	});

	it("ignores stale Karel playback callbacks after a newer run starts", async () => {
		const scheduledCallbacks: Array<() => void> = [];
		const shownSteps: KarelWorldState[] = [];
		const scheduler = {
			clearTimeout: () => {},
			setTimeout: (callback: () => void) => {
				scheduledCallbacks.push(callback);
				return scheduledCallbacks.length as unknown as ReturnType<
					typeof globalThis.setTimeout
				>;
			}
		};
		const controller = createKarelWorldPlaybackController({
			delayMs: 350,
			scheduler,
			showStep: step => shownSteps.push(step)
		});
		const firstPlayback = controller.play(
			[karelStep("initial"), karelStep("middle")],
			() => true
		);
		let secondResolved: boolean | null = null;

		const staleCallback = scheduledCallbacks[0]!;
		const secondPlayback = controller.play(
			[karelStep("final"), karelStep("middle")],
			() => true
		);
		secondPlayback.then(completed => {
			secondResolved = completed;
		});

		staleCallback();
		await Promise.resolve();

		expect(shownSteps.map(step => step.trace[0])).toEqual([
			"initial",
			"final"
		]);
		expect(secondResolved).toBeNull();

		scheduledCallbacks[1]!();

		await expect(firstPlayback).resolves.toBe(false);
		await expect(secondPlayback).resolves.toBe(true);
		expect(shownSteps.map(step => step.trace[0])).toEqual([
			"initial",
			"final",
			"middle"
		]);
	});

	it("renders Karel playback with one transitioning robot overlay", () => {
		const workspaceSource = sourceFile(
			"../src/components/CodeIdeWorkspace.vue"
		);

		expect(workspaceSource).toContain(
			"const karelRobotStyle = computed(() => {"
		);
		expect(workspaceSource).toContain(':style="karelRobotStyle"');
		expect(workspaceSource).toContain(':class="karelRobotDirectionClass"');
		expect(workspaceSource).toContain("left 240ms ease");
		expect(workspaceSource).toContain("top 240ms ease");
		expect(workspaceSource).not.toContain('v-if="cell.isRobot"');
	});

	it("loads Java and Karel execution through the client IDE workspace", () => {
		const routeSource = sourceFile("../src/pages/ide.vue");
		const workspaceSource = sourceFile(
			"../src/components/CodeIdeWorkspace.vue"
		);

		expect(routeSource).toContain(
			'() => import("@/components/CodeIdeWorkspace.vue")'
		);
		expect(workspaceSource).toContain(
			'import { runJavaIdeProject } from "@/modules/javaIdeRuntime";'
		);
		expect(workspaceSource).toContain("const result = runJavaIdeProject({");
		expect(workspaceSource).toContain("inputText: inputText.value");
		expect(workspaceSource).toContain("mode: project.mode");
		expect(workspaceSource).not.toContain("javac");
		expect(workspaceSource).not.toContain("child_process");
	});

	it("keeps the Java/Karel runner isolated from backend and worker execution", () => {
		const runtimeSource = sourceFile("../src/modules/javaIdeRuntime.ts");

		expect(runtimeSource).not.toMatch(/\bfetch\s*\(/);
		expect(runtimeSource).not.toMatch(/\bnew\s+Worker\b|\bWorker\s*\(/);
		expect(runtimeSource).not.toContain("child_process");
		expect(runtimeSource).not.toMatch(
			/(?:^|[^.\w])(?:spawn|exec|execFile|fork)\s*\(/m
		);
		expect(runtimeSource).not.toMatch(/\bjavac\b|\bdocker\b/i);
	});

	it("keeps backend health and project APIs separate from Java execution", () => {
		const studentRoutesSource = sourceFile(
			"../../back-end/src/routes/studentRoutes.ts"
		);
		const backendSource = [
			sourceFile("../../back-end/src/server.ts"),
			studentRoutesSource,
			sourceFile(
				"../../back-end/src/controllers/users/pythonProjectController.ts"
			)
		].join("\n");
		const compactStudentRoutes = studentRoutesSource.replace(/\s+/g, " ");

		expect(backendSource).toContain('app.get("/healthz"');
		expect(compactStudentRoutes).toContain(
			'router.use( ["/projects", "/project-reviews"], validStudent, requireStudentContext )'
		);
		for (const route of [
			'router.post( "/projects", ...projectWriteLimiters, withProjectPayloadReservation( withStudentDataWriteLease( withStudentRecordMutationLease(createPythonProject) ) ) )',
			'router.put( "/projects/:projectID", ...projectWriteLimiters, withProjectPayloadReservation( withStudentDataWriteLease( withStudentRecordMutationLease(updatePythonProject) ) ) )',
			'router.delete( "/projects/:projectID", ...projectWriteLimiters, withProjectPayloadReservation( withStudentDataWriteLease( withStudentRecordMutationLease(deletePythonProject) ) ) )'
		]) {
			expect(compactStudentRoutes).toContain(route);
		}
		expect(backendSource).toContain(
			'const projectModeSchema = z.enum(["data", "pgzero", "python", "turtle"])'
		);
		expect(backendSource).not.toContain("/projects/shared/");
		expect(backendSource).not.toContain("runJavaIdeProject");
		expect(backendSource).not.toContain("javaIdeRuntime");
		expect(backendSource).not.toContain("node:child_process");
		expect(backendSource).not.toMatch(
			/(?:^|[^.\w])(?:spawn|exec|execFile|fork)\s*\(/m
		);
		expect(backendSource).not.toMatch(/\bjavac\b|\bdocker\b/i);
	});
});
