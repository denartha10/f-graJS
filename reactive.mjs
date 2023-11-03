let currentListener = undefined;

/**
 * Creates a signal with an initial value.
 * @template T
 * @param {T} initialValue - The initial value of the signal.
 * @returns {[() => T, (newValue: T) => void]} - An array containing a getter and a setter for the signal.
 */
function createSignal(initialValue) {
	let value = initialValue;
	const subscribers = new Set();

	const getValue = () => {
		if (currentListener !== undefined) {
			subscribers.add(currentListener);
		}
		return value;
	};

	const setValue = (newValue) => {
		value = newValue;
		subscribers.forEach((fn) => fn());
	};

	return [getValue, setValue];
}

/**
 * Creates an effect.
 * @param {() => void} callback - A callback function to be executed.
 */
function createEffect(callback) {
	currentListener = callback;
	callback();
	currentListener = undefined;
}

/**
 * Creates a resource which is a signal returning the result of a Promise.
 * @template T, U
 * @param {() => T} source - A function that returns the source of the resource.
 * @param {(source: T) => Promise<U>} fetcher - A function that fetches the resource.
 * @returns {[() => (U | 'loading' | false)]} - An array containing a function which returns the value of the resource.
 */
function createResource(source, fetcher) {
	const [value, setValue] = createSignal(false);

	async function runfetcher() {
		try {
			setValue("loading");
			const data = await fetcher(source());
			setValue(data);
		} catch (error) {
			setValue(false);
		}
	}

	createEffect(() => {
		runfetcher();
	});

	return [value];
}

export { createSignal, createEffect, createResource };

// apparently fetch if passed a blank string returns an ok response?
// weird
// const [source, setSource] = createSignal('');
// const [data] = createResource(source, fetch);
