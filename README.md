USCSS
=====

United States of CSS Selectors.

Allows to declare rules for all states of an element in one line.

```css
element {
  $states: :hover, :active, .small;
  display: block;
  font-style: italic;
  color: [blue, red];
  margin: [0, 0 50px, 0 25px, 10px];
  font-size: [1em, 1em, .8em]
}
```

will compile into:

```css
element {
    display: block;
    font-style: italic;
	color: blue;
	margin: 0;
	font-size: 1em;
}
element:hover {
	color: red;
	margin: 0 50px;
	font-size: 1em;
}
element:active {
	margin: 0 25px;
	font-size: .8em;
}
element.small {
	margin: 10px;
}
```

As of 1.1.0 USCSS now allows for nested rules, but not in the fashion as LESS/SASS allows. You should use a "$" character at the beginning of children selector. Children selectors must be written relative to the main element. i.e. `"$ a" -> el a {...}`

```css
p {
    $states: :not(.hede), $ a, $ i em:hover b;
    color: [blue, red, yellow, green];
    background: [url(lel.png),
                (url(lol.png) left center, url(ley.png) right bottom),
                blue,
                #f08];
    
}
```

will compile into:

```css
p {
	color: blue;
	background: url(lel.png);
}
p:not(.hede) {
	color: red;
	background: url(lol.png) left center, url(ley.png) right bottom;
}
p a {
	color: yellow;
	background: blue;
}
p i em:hover b {
	color: green;
	background: #f08;
}
```

How to start
============

In the main directory of project run `node demo/uscss.js`.

`style.css` will appear next to it. You can configure input and output paths/files in uscss.json.

You only need "lib" folder and files in the demo folder.

Test
====

In the main directory, run `jasmine-node test`