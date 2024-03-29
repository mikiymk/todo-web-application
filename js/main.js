// render
const get = id => document.getElementById(id);

const html = (tagname, attributes, ...children) => {
  if (typeof tagname === "function") {
    return tagname({ ...attributes, children });
  }

  return {
    tagname,
    attributes: { ...attributes, children },
  };
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
  elem.append(JSON.stringify(html));
};

// reactive
const reactive = (value) => {
  return value;
};

const createSignal = (value) => {
  const dispatchers = [];
  let currentValue = value;

  const getValue = (dispatcher) => {
    if (!dispatchers.includes(dispatcher)) {
      dispatchers.push(dispatcher);
    }

    return currentValue;
  };

  const setValue = (newValue) => {
    currentValue = newValue;

    if (!Object.is(currentValue, newValue)) {
      for (const dispatcher of dispatchers) {
        dispatcher.dispatch();
      }
    }
  };

  return [getValue, setValue];
};

const createEffect = (effectFunction) => {
  const dispatcher = {
    dispatch() {
      effectFunction(dispatcher);
    }
  };

  dispatcher.dispatch();
};

const mapArray = (array, mapFunction) => {
  const dispatchers = new Set();
  const totaldispatcher = {
    dispatch() {
      for (const dispatcher of dispatchers) {
        dispatcher.dispatch();
      }
    }
  };

  return array(totaldispatcher)
    .map((item) => mapFunction(dispatcher => {
      dispatchers.set(dispatcher);
      return item;
    }));
};

// components
const Main = () => {
  const [tasks, setTasks] = createSignal([]);
  const add = (taskname) => setTasks(tasks => [...tasks, taskname]);

  createEffect((d) => {
    console.log(tasks(d));
  });

  return html("li", {},
    html(AddButton, { add }),
    ...mapArray(tasks, taskname => html(Task, { taskname })),
  );
};

const AddButton = ({ add }) => {
  const [value, setValue] = createSignal("");
  const onchange = (event) => {
    setValue(event.currentTarget.value);
  };
  const onclick = (event) => {
    add(value());
  };

  return html("li", {},
    html("label", {},
      "new task name",
      html("input", { value, onchange }),
    ),
    html("button", { onclick }, "click to add"),
  );
};

const Task = ({ taskname }) => {
  return html("li", {},
    html("input", { type: "checkbox" }),
    taskname,
  );
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

const mainelem = Main();
const appelem = get("app");

// init
try {
  render(mainelem, appelem);
} catch(e) {
  alert("no goodness 1: " + e);
}

get("add-button").addEventListener("click", onClick);
alert("goodness");
