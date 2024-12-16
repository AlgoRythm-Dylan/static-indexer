# How to use this indexer

1) Install dependencies

```bash
npm i
```

2) Put all your HTML files in a single folder
3) Run the indexer

```bash
node index.js <path to folder> <css query for body>
```

The CSS query for body param is optional.
It takes a CSS query that should resolve
to a single element which describes where
to start searching for text. For example
if all your text is inside a div with the
id "content", run:

```bash
node index.js <path> "#content"
```