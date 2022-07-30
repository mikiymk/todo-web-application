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

// reactive
const reactive = (value) => {
  return value;
};

// components
const Main = () => {
  const tasks = reactive([]);
  const add = (taskname) => tasks.push(taskname);

  return html("li", {}, [
    AddButton(add),
    ...tasks.map(Task),
  ]);
};

const AddButton = (add) => {
  const value = reactive("");
  const onchange = (event) => {
    value = event.currentTarget.value;
  };
  const onclick = (event) => {
    add(value);
  };

  return html("li", {}, [
    html("label", {}, [
      "new task name",
      html("input", { value, onchange }, []),
    ]),
    html("button", { onclick }, ["click to add"]),
  ]);
};

const Task = (taskname) => {
  return html("li", {}, [
    html("input", { type: "checkbox" }, []),
    taskname,
  ]);
};

// functions
const addTask = (taskname) => {
  const elem = Task(taskname);
  const listelem = get("list");
  listelem.append(elem);
};

const onClick = (event) => {
  const elem = get("input-name");
  addTask(elem.value);
};

// init
try {
  render(Main(), get("app"));
  get("add-button").addEventListener("click", onClick);
} catch(e) {
  alert("no goodness: " + e);
} finally {
  alert("goodness");
}
