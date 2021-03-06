
import {Attrs} from 'domic'
import {Column} from './flex'


export function Card(a: Attrs, children: DocumentFragment): Element {
	var {$$children, ...attrs} = a
	return <Column class='dm-card-frame' {...attrs}>{children}</Column>
}
