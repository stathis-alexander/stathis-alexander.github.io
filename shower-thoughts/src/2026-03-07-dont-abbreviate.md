# Don't Abbreviate

Engineers have a bad habit of abbreviating things. I guess it comes from some deep programming culture set in the 70's or 80's where space was expensive and being brief was better. But these days it just makes code harder to read:
* Unless abbreviations are super conventional or thoughtful, they require parsing.
* Preferred abbreviations tend to vary person by person, so you end up with a lot of different forms.
* Maybe a corrollary of the above, but they tend to vary from class to class or method to method even, which adds to cognitive load when reading code, and makes it more likely to make a stupid copy and paste error.

I prefer using fully qualified names for variables, methods, and classes.

Imagine you have an `Abbreviation` class. It's tempting to intantiate and store it in a number of variable names:
```ts
const a = new Abbreviation();
const abbr = new Abbreviation();
const abbreviation = new Abbreviation();
```

In isolation, all of these could be considered reasonable, and someone could make the case for each one. But it makes code hard to read, and if you're inconsistent, it makes code _very hard to read_.

```ts
function generateAbbr(fulltext: string) {
  const a = new Abbreviation(fulltext);
  // ... do something
  return a;
}

function manipAbbrev(abbrev: Abbreviation) {
  // some manipulation
}

const abbr = generateAbbr('this is my text');
const abbrs = [
  new Abbrevation('...'),
  abbr,
];

abbrs.foreach((abbrev) => {
  manipAbbrev(abbrev);
})
```

Maybe more verbose, but I much prefer the alternative:
```ts
function generateAbbreviation(fulltext: string) {
  const abbreviation = new Abbreviation(fulltext);
  // ... do something
  return abbreviation;
}

function manipulateAbbreviation(abbreviation: Abbreviation) {
  // some manipulation
}

const abbreviation = generateAbbreviation('this is my text');
const abbreviations = [
  new Abbrevation('...'),
  abbreviation,
];

abbreviations.foreach((abbreviation) => {
  manipulateAbbreviation(abbreviation);
})
```
