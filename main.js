import { createElement, renderer } from "./HTMLGenerator.mjs";
import { createSignal } from "./reactive.mjs";

const [count, setCount] = createSignal(1);

function App() {
	return createElement( "div", {},
		createElement("h1", {}, count()),
		createElement("button", { onclick: () => setCount(count() + 1) }, "++"),
		createElement("button", { onclick: () => setCount(count() -1 ) }, "--")
	);
}

renderer(App, document.getElementById("root"));
