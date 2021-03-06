
//////////////////////////////////////////////////////////////
import {
	Attrs,
	bind,
	Component,
	o,
	on,
	MaybeObservable,
	Observable,
	Repeat,
	Display,
	Mixin
} from 'domic'


export type LabelFn<T> = (opt: T) => MaybeObservable<string>
// export type ChangeFn<T> = (value: T, event: Event, atom: Atom) => any
export type ChangeFn<T> = (value: T, ev?: Event) => any


export interface SelectAttributes<T> extends Attrs {
	model: Observable<T>
	options: MaybeObservable<T[]>
	labelfn?: LabelFn<T>
	onchange?: ChangeFn<T>
}

export class Select<T> extends Component {

	attrs: SelectAttributes<T>
	protected selected: Observable<string> = o('-1')

	/**
	 * Setup the observation logic.
	 */
	render(children: DocumentFragment): Element {
		let mod = false;

		let attrs = this.attrs

		let options = o(attrs.options)
		let {model, labelfn, onchange} = attrs

		// Used for typing, to avoid the undefined part.
		var real_labelfn = (obj: any) => {
			return obj.label || obj.text || obj
		}
		if (labelfn) real_labelfn = labelfn

		//  We use a touched() function to avoid infinite loops since there
		//  is a circular logic here.
		let touched = () => {
			if (mod)
				return true
			mod = true
			requestAnimationFrame(() => { mod = false; });
			return false
		}

		this.observe(options, (opts) => {
			if (touched()) return;

			this.selected.set('' + opts.indexOf(model.get()));

		});

		this.observe(model, (v) => {
			if (touched()) return;

			this.selected.set(''+ options.get().indexOf(v));
		});

		this.observe(this.selected, (v) => {
			if (touched()) return;
			model.set(options.get()[parseInt(v)]);
		});

		////////////////////////////////

		let decorators: Mixin[] = [bind(this.selected)];

		if (onchange) {
			var fn = onchange // used this for typing matters.
			decorators.push(on('change', ev => fn(model.get(), ev)))
		}

		return <label class='dm-select-label'>
			<select class='dm-select' $$={decorators}>
				{Repeat(options, (opt, i) => <option
						value={i}
						selected={model.equals(opt)}>
							{opt.tf(val => Display(real_labelfn(val)))}
					</option>
				)}
			</select>
		</label>
	}

}

