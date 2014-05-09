USCSS
=====

United States of CSS Selectors.

Allows to declare rules for all states of an element in one line.

```css
element {
  $states: :hover, :active, .small;
  color: [blue, red];
  margin: [0, 0 50px, 0 25px, 10px];
  font-size: [1em, 1em, .8em]
}
```

will compile into:

```css
element {
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
