# 🏷️ Get computed label

Get an element's computed label ("Accessible Name") from the Accessibility Tree

## 💡 Why?

Say you have a button which looks like this (this is invalid markup):

```html
<button
  alt="Alternate text"
  title="Title text"
  aria-label="ARIA label"
  aria-labelledby="ref1"
>
  <span id="ref">A span with an ID</span>
  <span>Inner text</span>
</button>
```

![Screenshot of the HTML button markup](https://user-images.githubusercontent.com/2841780/64767150-d47e3e80-d564-11e9-8563-c692779a4dcd.png)

What would a screen reader read?

Using the Accessibility Tree, screen readers and other assistive technologies figure out what they should read. In this case, even though the `<button>` has inner text, the [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) attributes take precedence. Even in that, the `aria-labelledby` is higher in the accessibility order than `aria-label`, but in this case, the element with the ID `#ref1` doesn't exist, so we fall back to `aria-label`.

Finally, the label is computed to be `Aria label`.

## 💻 Usage

Install the package from NPM:

```bash
npm install get-computed-label
```

```js
import getComputedLabel from "get-computed-label";

const label = getComputedLabel(document.getElementById("example"));
console.log(label);
```

You can also add this to the prototype, if you're into that:

```js
HTMLElement.prototype.getComputedLabel = function() {
  return getComputedLabel(this);
};

const image = document.querySelector("img");
console.log(image.getComputedLabel());
```

## ℹ️ Further reading

- [Accessible Name and Description Computation 1.1](https://www.w3.org/TR/accname-1.1/)
- **TODO** Use computation method described above

## 📝 License

[MIT](https://github.com/AnandChowdhary/get-computed-label/blob/master/LICENSE) © [Anand Chowdhary](https://anandchowdhary.com)
