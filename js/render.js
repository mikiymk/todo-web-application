// render
const get = id => document.getElementById(id);

const html = (tagname, attributes, children) => {
  const elem = document.createElement(tagname);
  for (const [key, attribute] in Object.entries(attributes)) {
    if (key.startsWith("on")) {
      elem.addEventListener(key.substring(2), attribute);
    } else {
      elem.setAttribute(key, attribute);
    }
  }
  for (key in children) {
    elem.append(children[key]);
  }
  return elem;
};

const render = (html, elem) => {
  elem.append(html);
};
