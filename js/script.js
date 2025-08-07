let tableData = [];
let originalData = [...tableData];

const formTask = document.getElementById("formTask");
const deleteAll = document.getElementById("deleteAll");
const filterButton = document.getElementById("filter");

const RenderTable = () => {
    let table = document.getElementById("editableData");
    table.innerHTML = ''; // reset first

    if (tableData.length === 0)
        table.innerHTML = `<td colspan="5" class="px-2 py-1">No data available.</td>`;

    tableData.forEach(data => {
        table.innerHTML += `
            <tr>
                <td class="table-cell">${data.id}</td>
                <td class="table-cell"><input type="text" id="taskname_${data.id}" value="${data.name}" class="text-center" disabled></td>
                <td class="table-cell"><input type="date" id="taskdate_${data.id}" value="${data.date}" disabled></td>
                <td class="table-cell"><input type="checkbox" id="taskdone_${data.id}" ${data.done ? 'checked' : ''} disabled></td>
                <td class="table-cell">
                    <div class="mx-auto">
                        <button id="edit_${data.id}" class="btn-primary">EDIT</button>
                        <button id="delete_${data.id}" class="btn-danger mx-1">DELETE</button>
                    </div>
                </td>
            </tr>
        `
    });

    LoadEvents();
}

const LoadEvents = () => {
    tableData.forEach(data => {
        const editButton = document.getElementById(`edit_${data.id}`);
        const deleteButton = document.getElementById(`delete_${data.id}`);

        let isEditing = false; // state variable for both delete and edit button

        const SetInputState = (id, disabled) => {
            document.getElementById(`taskname_${id}`).disabled = disabled;
            document.getElementById(`taskdate_${id}`).disabled = disabled;
            document.getElementById(`taskdone_${id}`).disabled = disabled;
        }

        const HandleSave = (id) => {
            SetInputState(id, true);

            const updatedObj = { name: '', date: '', done: false };

            updatedObj.name = document.getElementById(`taskname_${id}`).value;
            updatedObj.date = document.getElementById(`taskdate_${id}`).value;
            updatedObj.done = document.getElementById(`taskdone_${id}`).checked;

            tableData = tableData.map(data => data.id === id ? { ...data, ...updatedObj } : data); // modifying by mapping
            originalData = [...tableData];

            RenderTable();
        }

        // edit button functionality
        editButton.addEventListener("click", () => {
            if (isEditing) { // editing state (save function)
                HandleSave(data.id);

                // manually set instead of using outerHTML :D
                editButton.textContent = "EDIT";
                editButton.className = "btn-primary";

                deleteButton.textContent = "DELETE";
                deleteButton.className = "btn-danger mx-1";

                isEditing = false;
            } else { // normal state (edit function)
                SetInputState(data.id, false);

                // manually set instead of using outerHTML :D
                editButton.textContent = "SAVE";
                editButton.className = "bg-green-400 hover:bg-green-200 text-white font-bold px-3 py-1 rounded";

                deleteButton.textContent = "CANCEL";
                deleteButton.className = "btn-danger mx-1";

                isEditing = true;
            }
        });

        deleteButton.addEventListener("click", () => {
            if (isEditing) { // editing state (cancel function)
                // delete by creating new array with filter 
                SetInputState(data.id, true);

                // manually set instead of using outerHTML :D
                editButton.textContent = "EDIT";
                editButton.className = "btn-primary";

                deleteButton.textContent = "DELETE";
                deleteButton.className = "btn-danger mx-1";

                isEditing = false;
            } else { // normal state (delete function)
                tableData = tableData.filter(newData => newData.id !== data.id);
                originalData = [...tableData];

                RenderTable();
            }
        });
    });
}

formTask.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent like auto refresh?

    const taskContent = document.getElementById("taskContent").value.trim();
    const taskDate = document.getElementById("taskDate").value;

    const nextId = tableData.length > 0 ? tableData[tableData.length - 1].id + 1 : 1;

    if (taskContent && taskDate) { // validate form
        tableData.push({ id: nextId, name: taskContent, date: taskDate, done: false });
        originalData = [...tableData];

        RenderTable();

        alert("Added new task.");
    } else if (!taskContent) {
        alert("Task name must not be empty.");
    } else if (!taskDate) {
        alert("Task date must not be empty.");
    }
});

deleteAll.addEventListener("click", () => {
    tableData = []; // clear array
    originalData = [];

    RenderTable();
});

filterButton.addEventListener("click", () => {
    const filterOptions = document.getElementById("filterOptions").value;
    switch (filterOptions) {
        case "showAll":
            tableData = [...originalData];
            break;
        case "unfinishedOnly":
            tableData = originalData.filter(data => data.done === false);
            break;
        default: break;
    }

    RenderTable();
});

RenderTable();