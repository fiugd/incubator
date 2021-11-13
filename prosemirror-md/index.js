import {EditorState} from "https://cdn.skypack.dev/prosemirror-state"
import {EditorView} from "https://cdn.skypack.dev/prosemirror-view"
import {Schema, DOMParser} from "https://cdn.skypack.dev/prosemirror-model"
// import {schema} from "https://cdn.skypack.dev/prosemirror-schema-basic"
import {addListNodes} from "https://cdn.skypack.dev/prosemirror-schema-list"
import {
	schema, defaultMarkdownParser, defaultMarkdownSerializer
} from "https://cdn.skypack.dev/@timcchang/prosemirror-markdown"
import {exampleSetup} from "https://cdn.skypack.dev/prosemirror-example-setup"

import editorCss from "./index.css" assert { type: "css" }
import colorsCss from "/index.colors.css" assert { type: "css" }

document.adoptedStyleSheets = [
	editorCss, colorsCss, ...document.adoptedStyleSheets
];

const editor = document.createElement('div');
editor.id = 'editor';
document.body.append(editor);

document.body.insertAdjacentHTML('beforeend', `
<textarea style="display: none" id="content">
### Hello ProseMirror

This is editable text. You can focus it and start typing.

To apply styling, you can select a piece of text and manipulate its styling from the menu. The basic schema supports *emphasis*, **strong text**, [links](http://marijnhaverbeke.nl/blog), \`code font\`, and ![](https://prosemirror.net/img/smiley.png) images.

---

Block-level structure can be manipulated with key bindings (try ctrl-shift-2 to create a level 2 heading, or enter in an empty textblock to exit the parent block), or through the menu.

Try using the “list” item in the menu to wrap this paragraph in a ***numbered*** list.

</textarea>

<div style="text-align: center">
	<label style="border-right: 1px solid silver">
		Markdown
		<input type="radio" name="inputformat" value="markdown">
		&nbsp;
	</label>
  <label>
		&nbsp;
		<input type="radio" name="inputformat" value="prosemirror" checked="">
		WYSIWIG
	</label>
</div>
`);

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
	nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
	marks: schema.spec.marks
})

class MarkdownView {
	constructor(target, content) {
		this.textarea = target.appendChild(document.createElement("textarea"))
		this.textarea.value = content
	}

	get content() { return this.textarea.value }
	focus() { this.textarea.focus() }
	destroy() { this.textarea.remove() }
}

class ProseMirrorView {
	constructor(target, content) {
		this.view = new EditorView(target, {
			state: EditorState.create({
				doc: defaultMarkdownParser.parse(content),
				plugins: exampleSetup({schema})
			})
		})
	}

	get content() {
		return defaultMarkdownSerializer.serialize(this.view.state.doc)
	}
	focus() { this.view.focus() }
	destroy() { this.view.destroy() }
}

// window.view = new EditorView(editor, {
// 	state: EditorState.create({
// 		doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
// 		plugins: exampleSetup({schema: mySchema})
// 	})
// })

let view = new ProseMirrorView(editor, document.querySelector("#content").value)

document.querySelectorAll("input[type=radio]")
	.forEach(button => {
		button.addEventListener("change", () => {
			if (!button.checked) return
			let View = button.value == "markdown" ? MarkdownView : ProseMirrorView
			if (view instanceof View) return
			let content = view.content
			view.destroy()
			view = new View(editor, content)
			view.focus()
		})
	})