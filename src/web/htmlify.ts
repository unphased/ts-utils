type Item = { [key: string]: Item } | Item[] | string | number;

const isPrimitive = (item: Item): item is string | number => {
  return typeof item !== 'object';
};
type Options = { input_binding?: {
  pathTo: string,
  ref: object,
  prop: string,
  type: 'number'|'text'|'checkbox'
}};

function resolveBinding(item: Item, opts?: Options, key?: string): HTMLElement {
  const bindp = opts?.input_binding?.pathTo;
  let nopts = opts?.input_binding ? { input_binding: { ...opts.input_binding } } : {}
  let newbindp: string | undefined;
  if (bindp && bindp.indexOf('.' + key) === 0) {
    newbindp = bindp.slice(key.length + 1);
  }

  if (newbindp === '') {
    const input = document.createElement('input');
    (input as any)[opts.input_binding.type === 'checkbox' ? 'checked' : 'value']
      = opts.input_binding.ref[opts.input_binding.prop];
    input.type = opts.input_binding.type;
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      let value: string | number | boolean = target.value;
      if (opts.input_binding.type === 'number') {
        value = parseFloat(value);
      } else if (opts.input_binding.type === 'checkbox') {
        value = target.checked;
      }
      opts.input_binding.ref[opts.input_binding.prop] = value;
    });
    return input;
  }

  if (newbindp === undefined) {
    nopts = {};
  } else {
    nopts.input_binding.pathTo = newbindp;
  }

  const div = document.createElement('div');
  if (isPrimitive(item)) {
    div.setAttribute('data-value', item.toString());
    div.appendChild(document.createTextNode(item.toString()));
  } else {
    div.appendChild(htmlify(item, nopts))
  }
  return div;
}

export const htmlify = (
  item: Item,
  opts?: Options): HTMLElement => {

  // console.log('htmlify:', item, opts, typeof item);
  let node: HTMLElement;

  if (typeof item === 'object') {
    node = document.createElement('div');

    if (Array.isArray(item)) {
      node.className = 'array';
      item.forEach((e, i) => {
        const div = resolveBinding(e, opts, '[]');
        div.setAttribute('data-arridx', i.toString());
        node.appendChild(div);
      });
    } else {
      node.className = 'object';
      Object.entries(item).forEach(([k, v]) => {
        const div = resolveBinding(v, opts, k);
        div.className = k;
        node.appendChild(div);
      });
    }
  } else {
    throw 'should not have primitive sent in';
  }
  return node;
}
