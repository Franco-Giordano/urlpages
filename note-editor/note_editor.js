/**
 * editor/editor.js: the main code that runs what is referred to as the "editor"
 * in the documentation
 */

api = apiVersions[LATEST_API_VERSION]

const DEFAULT_HTML1 = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Note</title>
</head>
<body class="back">
<div class="box">`
const DEFAULT_HTML2 = `</div>
</body>
</html>`

const DEFAULT_NOTE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Nunc pretium metus vitae arcu pulvinar, at facilisis sapien rhoncus.
Morbi id leo dui. Curabitur finibus, tortor sit amet laoreet sodales,
nunc urna venenatis lacus, varius aliquet lacus eros id eros.
Proin a interdum purus, eu maximus metus.`

const DEFAULT_CSS = `.box
{
    width: 60vw;
    font-size: 3rem;
    color: #2b2b2b;
    font-style: oblique;
    text-align: center;
    margin: auto;
    padding-top: 10vh;
    display: flex;
    justify-content: center; /* align horizontal */
    align-items: center; /* align vertical */
}

.back {
    background-color: #fff1e6
}`

/***
 * Helper functions
 ***/

/* Return the HTML string for the page */
function getHTML(data) {
  // Generate an HTML page from the contents of each <textarea>
  var pageData =
`
<!DOCTYPE html>
<head>
<style>
${data["css"]}
</style>
<script type="text/javascript">
${data["js"]}
</scr` +
// This has to be broken up because otherwise it is recognized as the main
// document's end script tag
`ipt>
</head>
<body>
${data["html"]}
</body>
`;

  return pageData;
}


/***
 * Button press functions
 ***/


/* Set the TinyUrl form hidden 'url' field to the view URL */
function setViewUrl() {
  var data = {
    "css" : document.getElementById("css").value,
    "js" : document.getElementById("javascript").value,
    "html" : document.getElementById("html").value
  };

  var html = getHTML(data);

	// Update the URL for the "Short Link" button
  document.getElementById("url").value = api.getViewLink(html);
}


/* Set the TinyUrl form hidden 'url' field to the code URL */
function setCodeUrl() {
  document.getElementById("url").value = window.location.href;
}


/* Show a prompt with the HTML page data so the user can copy the code */
function showCopyCodePrompt() {
  var data = {
    "css" : document.getElementById("css").value,
    "js" : document.getElementById("javascript").value,
    "html" : document.getElementById("html").value
  };

  var html = getHTML(data);

  window.prompt("Copy to clipboard: ", html)
}


/* Hide and show buttons based on checkbox state */
function hideButtons(box) {
  let buttons = document.querySelectorAll("button");
  if (box.checked) {
    buttons.forEach((button) => button.style.display = "none");
  } else {
    buttons.forEach((button) => button.style.display = "block");
  }
}



/***
 * Main procedure functions
 ***/

/* Run once when the page is loaded */
function initialize() {
  // Get page data from the URL and load it into the boxes
  if (window.location.hash) {
    var encoded = window.location.hash.slice(1);
    var json = b64.decode(encoded);
    var data = JSON.parse(json);

    document.getElementById("css").value = data["css"];
    document.getElementById("javascript").value = data["js"];
    document.getElementById("html").value = data["html"];
  } else {
    document.getElementById("css").value = DEFAULT_CSS;
    document.getElementById("notetext").value = DEFAULT_NOTE;
  }

  update();
}


/* Run each time a key is pressed on a text box */
function update() {
  var data = {
    "css" : document.getElementById("css").value,
    "js" : document.getElementById("javascript").value,
    "html" : noteToHTML()
  };

  var html = getHTML(data);

  // Save encoded page data to the URL
  window.location.hash = "#" + b64.encode(JSON.stringify(data));

  // Update the URL for the "Get Link" button
  document.getElementById("getLinkLink").href = api.getViewLink(html);

  // Update the download link
  document.getElementById("downloadLink").href = `data:text/html,${html}`

  // Update the <iframe> to display the generated page
  window.frames[0].location.replace(`data:text/html;charset=utf-8;base64,${b64.encode(html)}`);
}

function noteToHTML(isDefault) {
  var note = document.getElementById("notetext").value;

  return DEFAULT_HTML1 + note + DEFAULT_HTML2;
}