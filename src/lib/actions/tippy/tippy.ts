import tippy, {
	type ExtendedProps,
	hideOnEsc,
	hideOnPopperBlur,
	hideOthersOnOpen,
	hideOnSelfClick
} from './tippy-plugins';
import 'tippy.js/dist/tippy.css';

// action is a function that recieves a DOM node and some options
export default function (node: HTMLElement, options?: Partial<ExtendedProps>) {
	const plugins = [hideOnEsc, hideOnPopperBlur, hideOthersOnOpen, hideOnSelfClick];
	const _options = options ? { ...options, plugins } : { plugins };
	const instance = tippy(node, _options);
	return {
		update(newOptions: Partial<ExtendedProps>) {
			const _newOptions = newOptions ? { ...newOptions, plugins } : { plugins };
			instance.setProps(_newOptions);
		},

		destroy() {
			instance.destroy();
		}
	};
}
