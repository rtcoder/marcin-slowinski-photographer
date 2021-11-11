
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Header.svelte generated by Svelte v3.44.1 */

    const file$1 = "src\\components\\Header.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let img;
    	let img_src_value;
    	let t0;
    	let nav;
    	let ul;
    	let li0;
    	let t2;
    	let li1;
    	let t4;
    	let li2;
    	let t6;
    	let li3;

    	const block = {
    		c: function create() {
    			header = element("header");
    			img = element("img");
    			t0 = space();
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "O mnie";
    			t2 = space();
    			li1 = element("li");
    			li1.textContent = "O mnie";
    			t4 = space();
    			li2 = element("li");
    			li2.textContent = "O mnie";
    			t6 = space();
    			li3 = element("li");
    			li3.textContent = "O mnie";
    			if (!src_url_equal(img.src, img_src_value = "images/camera-black.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			add_location(img, file$1, 4, 4, 63);
    			add_location(li0, file$1, 8, 12, 150);
    			add_location(li1, file$1, 9, 12, 179);
    			add_location(li2, file$1, 10, 12, 208);
    			add_location(li3, file$1, 11, 12, 237);
    			add_location(ul, file$1, 7, 8, 132);
    			add_location(nav, file$1, 6, 4, 117);
    			attr_dev(header, "class", "svelte-1d95fy");
    			add_location(header, file$1, 3, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, img);
    			append_dev(header, t0);
    			append_dev(header, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Header> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main0;
    	let h10;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let p0;
    	let t5;
    	let a0;
    	let t7;
    	let t8;
    	let main1;
    	let h11;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let p1;
    	let t13;
    	let a1;
    	let t15;
    	let t16;
    	let main2;
    	let h12;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let p2;
    	let t21;
    	let a2;
    	let t23;
    	let t24;
    	let main3;
    	let h13;
    	let t25;
    	let t26;
    	let t27;
    	let t28;
    	let p3;
    	let t29;
    	let a3;
    	let t31;
    	let t32;
    	let main4;
    	let h14;
    	let t33;
    	let t34;
    	let t35;
    	let t36;
    	let p4;
    	let t37;
    	let a4;
    	let t39;
    	let t40;
    	let main5;
    	let h15;
    	let t41;
    	let t42;
    	let t43;
    	let t44;
    	let p5;
    	let t45;
    	let a5;
    	let t47;
    	let t48;
    	let main6;
    	let h16;
    	let t49;
    	let t50;
    	let t51;
    	let t52;
    	let p6;
    	let t53;
    	let a6;
    	let t55;
    	let t56;
    	let main7;
    	let h17;
    	let t57;
    	let t58;
    	let t59;
    	let t60;
    	let p7;
    	let t61;
    	let a7;
    	let t63;
    	let t64;
    	let main8;
    	let h18;
    	let t65;
    	let t66;
    	let t67;
    	let t68;
    	let p8;
    	let t69;
    	let a8;
    	let t71;
    	let t72;
    	let main9;
    	let h19;
    	let t73;
    	let t74;
    	let t75;
    	let t76;
    	let p9;
    	let t77;
    	let a9;
    	let t79;
    	let current;
    	header = new Header({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main0 = element("main");
    			h10 = element("h1");
    			t1 = text("Hello ");
    			t2 = text(/*name*/ ctx[0]);
    			t3 = text("!");
    			t4 = space();
    			p0 = element("p");
    			t5 = text("Visit the ");
    			a0 = element("a");
    			a0.textContent = "Svelte tutorial";
    			t7 = text(" to learn how to build Svelte apps.");
    			t8 = space();
    			main1 = element("main");
    			h11 = element("h1");
    			t9 = text("Hello ");
    			t10 = text(/*name*/ ctx[0]);
    			t11 = text("!");
    			t12 = space();
    			p1 = element("p");
    			t13 = text("Visit the ");
    			a1 = element("a");
    			a1.textContent = "Svelte tutorial";
    			t15 = text(" to learn how to build Svelte apps.");
    			t16 = space();
    			main2 = element("main");
    			h12 = element("h1");
    			t17 = text("Hello ");
    			t18 = text(/*name*/ ctx[0]);
    			t19 = text("!");
    			t20 = space();
    			p2 = element("p");
    			t21 = text("Visit the ");
    			a2 = element("a");
    			a2.textContent = "Svelte tutorial";
    			t23 = text(" to learn how to build Svelte apps.");
    			t24 = space();
    			main3 = element("main");
    			h13 = element("h1");
    			t25 = text("Hello ");
    			t26 = text(/*name*/ ctx[0]);
    			t27 = text("!");
    			t28 = space();
    			p3 = element("p");
    			t29 = text("Visit the ");
    			a3 = element("a");
    			a3.textContent = "Svelte tutorial";
    			t31 = text(" to learn how to build Svelte apps.");
    			t32 = space();
    			main4 = element("main");
    			h14 = element("h1");
    			t33 = text("Hello ");
    			t34 = text(/*name*/ ctx[0]);
    			t35 = text("!");
    			t36 = space();
    			p4 = element("p");
    			t37 = text("Visit the ");
    			a4 = element("a");
    			a4.textContent = "Svelte tutorial";
    			t39 = text(" to learn how to build Svelte apps.");
    			t40 = space();
    			main5 = element("main");
    			h15 = element("h1");
    			t41 = text("Hello ");
    			t42 = text(/*name*/ ctx[0]);
    			t43 = text("!");
    			t44 = space();
    			p5 = element("p");
    			t45 = text("Visit the ");
    			a5 = element("a");
    			a5.textContent = "Svelte tutorial";
    			t47 = text(" to learn how to build Svelte apps.");
    			t48 = space();
    			main6 = element("main");
    			h16 = element("h1");
    			t49 = text("Hello ");
    			t50 = text(/*name*/ ctx[0]);
    			t51 = text("!");
    			t52 = space();
    			p6 = element("p");
    			t53 = text("Visit the ");
    			a6 = element("a");
    			a6.textContent = "Svelte tutorial";
    			t55 = text(" to learn how to build Svelte apps.");
    			t56 = space();
    			main7 = element("main");
    			h17 = element("h1");
    			t57 = text("Hello ");
    			t58 = text(/*name*/ ctx[0]);
    			t59 = text("!");
    			t60 = space();
    			p7 = element("p");
    			t61 = text("Visit the ");
    			a7 = element("a");
    			a7.textContent = "Svelte tutorial";
    			t63 = text(" to learn how to build Svelte apps.");
    			t64 = space();
    			main8 = element("main");
    			h18 = element("h1");
    			t65 = text("Hello ");
    			t66 = text(/*name*/ ctx[0]);
    			t67 = text("!");
    			t68 = space();
    			p8 = element("p");
    			t69 = text("Visit the ");
    			a8 = element("a");
    			a8.textContent = "Svelte tutorial";
    			t71 = text(" to learn how to build Svelte apps.");
    			t72 = space();
    			main9 = element("main");
    			h19 = element("h1");
    			t73 = text("Hello ");
    			t74 = text(/*name*/ ctx[0]);
    			t75 = text("!");
    			t76 = space();
    			p9 = element("p");
    			t77 = text("Visit the ");
    			a9 = element("a");
    			a9.textContent = "Svelte tutorial";
    			t79 = text(" to learn how to build Svelte apps.");
    			attr_dev(h10, "class", "svelte-1tky8bj");
    			add_location(h10, file, 6, 1, 115);
    			attr_dev(a0, "href", "https://svelte.dev/tutorial");
    			add_location(a0, file, 7, 14, 152);
    			add_location(p0, file, 7, 1, 139);
    			attr_dev(main0, "class", "svelte-1tky8bj");
    			add_location(main0, file, 5, 0, 107);
    			attr_dev(h11, "class", "svelte-1tky8bj");
    			add_location(h11, file, 11, 1, 266);
    			attr_dev(a1, "href", "https://svelte.dev/tutorial");
    			add_location(a1, file, 12, 14, 303);
    			add_location(p1, file, 12, 1, 290);
    			attr_dev(main1, "class", "svelte-1tky8bj");
    			add_location(main1, file, 10, 0, 258);
    			attr_dev(h12, "class", "svelte-1tky8bj");
    			add_location(h12, file, 16, 1, 417);
    			attr_dev(a2, "href", "https://svelte.dev/tutorial");
    			add_location(a2, file, 17, 14, 454);
    			add_location(p2, file, 17, 1, 441);
    			attr_dev(main2, "class", "svelte-1tky8bj");
    			add_location(main2, file, 15, 0, 409);
    			attr_dev(h13, "class", "svelte-1tky8bj");
    			add_location(h13, file, 21, 1, 568);
    			attr_dev(a3, "href", "https://svelte.dev/tutorial");
    			add_location(a3, file, 22, 14, 605);
    			add_location(p3, file, 22, 1, 592);
    			attr_dev(main3, "class", "svelte-1tky8bj");
    			add_location(main3, file, 20, 0, 560);
    			attr_dev(h14, "class", "svelte-1tky8bj");
    			add_location(h14, file, 26, 1, 719);
    			attr_dev(a4, "href", "https://svelte.dev/tutorial");
    			add_location(a4, file, 27, 14, 756);
    			add_location(p4, file, 27, 1, 743);
    			attr_dev(main4, "class", "svelte-1tky8bj");
    			add_location(main4, file, 25, 0, 711);
    			attr_dev(h15, "class", "svelte-1tky8bj");
    			add_location(h15, file, 31, 1, 870);
    			attr_dev(a5, "href", "https://svelte.dev/tutorial");
    			add_location(a5, file, 32, 14, 907);
    			add_location(p5, file, 32, 1, 894);
    			attr_dev(main5, "class", "svelte-1tky8bj");
    			add_location(main5, file, 30, 0, 862);
    			attr_dev(h16, "class", "svelte-1tky8bj");
    			add_location(h16, file, 36, 1, 1021);
    			attr_dev(a6, "href", "https://svelte.dev/tutorial");
    			add_location(a6, file, 37, 14, 1058);
    			add_location(p6, file, 37, 1, 1045);
    			attr_dev(main6, "class", "svelte-1tky8bj");
    			add_location(main6, file, 35, 0, 1013);
    			attr_dev(h17, "class", "svelte-1tky8bj");
    			add_location(h17, file, 41, 1, 1172);
    			attr_dev(a7, "href", "https://svelte.dev/tutorial");
    			add_location(a7, file, 42, 14, 1209);
    			add_location(p7, file, 42, 1, 1196);
    			attr_dev(main7, "class", "svelte-1tky8bj");
    			add_location(main7, file, 40, 0, 1164);
    			attr_dev(h18, "class", "svelte-1tky8bj");
    			add_location(h18, file, 46, 1, 1323);
    			attr_dev(a8, "href", "https://svelte.dev/tutorial");
    			add_location(a8, file, 47, 14, 1360);
    			add_location(p8, file, 47, 1, 1347);
    			attr_dev(main8, "class", "svelte-1tky8bj");
    			add_location(main8, file, 45, 0, 1315);
    			attr_dev(h19, "class", "svelte-1tky8bj");
    			add_location(h19, file, 51, 1, 1474);
    			attr_dev(a9, "href", "https://svelte.dev/tutorial");
    			add_location(a9, file, 52, 14, 1511);
    			add_location(p9, file, 52, 1, 1498);
    			attr_dev(main9, "class", "svelte-1tky8bj");
    			add_location(main9, file, 50, 0, 1466);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main0, anchor);
    			append_dev(main0, h10);
    			append_dev(h10, t1);
    			append_dev(h10, t2);
    			append_dev(h10, t3);
    			append_dev(main0, t4);
    			append_dev(main0, p0);
    			append_dev(p0, t5);
    			append_dev(p0, a0);
    			append_dev(p0, t7);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, main1, anchor);
    			append_dev(main1, h11);
    			append_dev(h11, t9);
    			append_dev(h11, t10);
    			append_dev(h11, t11);
    			append_dev(main1, t12);
    			append_dev(main1, p1);
    			append_dev(p1, t13);
    			append_dev(p1, a1);
    			append_dev(p1, t15);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, main2, anchor);
    			append_dev(main2, h12);
    			append_dev(h12, t17);
    			append_dev(h12, t18);
    			append_dev(h12, t19);
    			append_dev(main2, t20);
    			append_dev(main2, p2);
    			append_dev(p2, t21);
    			append_dev(p2, a2);
    			append_dev(p2, t23);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, main3, anchor);
    			append_dev(main3, h13);
    			append_dev(h13, t25);
    			append_dev(h13, t26);
    			append_dev(h13, t27);
    			append_dev(main3, t28);
    			append_dev(main3, p3);
    			append_dev(p3, t29);
    			append_dev(p3, a3);
    			append_dev(p3, t31);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, main4, anchor);
    			append_dev(main4, h14);
    			append_dev(h14, t33);
    			append_dev(h14, t34);
    			append_dev(h14, t35);
    			append_dev(main4, t36);
    			append_dev(main4, p4);
    			append_dev(p4, t37);
    			append_dev(p4, a4);
    			append_dev(p4, t39);
    			insert_dev(target, t40, anchor);
    			insert_dev(target, main5, anchor);
    			append_dev(main5, h15);
    			append_dev(h15, t41);
    			append_dev(h15, t42);
    			append_dev(h15, t43);
    			append_dev(main5, t44);
    			append_dev(main5, p5);
    			append_dev(p5, t45);
    			append_dev(p5, a5);
    			append_dev(p5, t47);
    			insert_dev(target, t48, anchor);
    			insert_dev(target, main6, anchor);
    			append_dev(main6, h16);
    			append_dev(h16, t49);
    			append_dev(h16, t50);
    			append_dev(h16, t51);
    			append_dev(main6, t52);
    			append_dev(main6, p6);
    			append_dev(p6, t53);
    			append_dev(p6, a6);
    			append_dev(p6, t55);
    			insert_dev(target, t56, anchor);
    			insert_dev(target, main7, anchor);
    			append_dev(main7, h17);
    			append_dev(h17, t57);
    			append_dev(h17, t58);
    			append_dev(h17, t59);
    			append_dev(main7, t60);
    			append_dev(main7, p7);
    			append_dev(p7, t61);
    			append_dev(p7, a7);
    			append_dev(p7, t63);
    			insert_dev(target, t64, anchor);
    			insert_dev(target, main8, anchor);
    			append_dev(main8, h18);
    			append_dev(h18, t65);
    			append_dev(h18, t66);
    			append_dev(h18, t67);
    			append_dev(main8, t68);
    			append_dev(main8, p8);
    			append_dev(p8, t69);
    			append_dev(p8, a8);
    			append_dev(p8, t71);
    			insert_dev(target, t72, anchor);
    			insert_dev(target, main9, anchor);
    			append_dev(main9, h19);
    			append_dev(h19, t73);
    			append_dev(h19, t74);
    			append_dev(h19, t75);
    			append_dev(main9, t76);
    			append_dev(main9, p9);
    			append_dev(p9, t77);
    			append_dev(p9, a9);
    			append_dev(p9, t79);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t2, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t10, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t18, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t26, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t34, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t42, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t50, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t58, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t66, /*name*/ ctx[0]);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t74, /*name*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main0);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(main1);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(main2);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(main3);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(main4);
    			if (detaching) detach_dev(t40);
    			if (detaching) detach_dev(main5);
    			if (detaching) detach_dev(t48);
    			if (detaching) detach_dev(main6);
    			if (detaching) detach_dev(t56);
    			if (detaching) detach_dev(main7);
    			if (detaching) detach_dev(t64);
    			if (detaching) detach_dev(main8);
    			if (detaching) detach_dev(t72);
    			if (detaching) detach_dev(main9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ Header, name });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
