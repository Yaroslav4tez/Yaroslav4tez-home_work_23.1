const API = "https://yaroslav4tez-home-work-23-1-1.onrender.com/tasks";
const ul = document.getElementById("task");
const btnMore = document.getElementById("btnMore");
const inpTask = document.getElementById("inpTask");


function renderTask(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  if (task.done) li.classList.add("done");


const cb = document.createElement("input");
cb.type = "checkbox";
cb.checked = task.done;


const span = document.createElement("span");
span.textContent = task.text;

const delBtn = document.createElement("button");
delBtn.textContent = "delete";


cb.addEventListener("change", () => {
    fetch(`${API}/${li.dataset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: cb.checked })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(updated => {
        li.classList.toggle("done", updated.done);
      });
    });


span.addEventListener("dblclick", () => {
    const next = prompt("Новий текст", span.textContent);
    if (!next || !next.trim()) return;
    fetch(`${API}/${li.dataset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: next.trim() })
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(updated => { span.textContent = updated.text; });
  });

delBtn.addEventListener("click", () => {
    fetch(`${API}/${li.dataset.id}`, { method: "DELETE" })
      .then(r => r.status === 204 ? li.remove() : null);
  });

  li.append(cb, span, delBtn);
  ul.appendChild(li);
}


fetch(API)
  .then(res => res.json())
  .then(list => list.forEach(renderTask));


btnMore.addEventListener("click", () => {
  const text = inpTask.value.trim();
  if (!text) return;
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(newTask => {
      renderTask(newTask);
      inpTask.value = "";
      inpTask.focus();
    });
});
