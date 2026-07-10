const form = document.querySelector('#student-form');
const idInput = document.querySelector('#student-id');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const courseInput = document.querySelector('#course');
const ageInput = document.querySelector('#age');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const refreshButton = document.querySelector('#refresh-button');
const studentsBody = document.querySelector('#students-body');
const message = document.querySelector('#message');

function showMessage(text, type = 'success') {
  message.textContent = text;
  message.className = type;
}

function resetForm() {
  form.reset();
  idInput.value = '';
  saveButton.textContent = 'Create Student';
  cancelButton.hidden = true;
}

async function loadStudents() {
  const response = await fetch('/api/students');
  const students = await response.json();

  studentsBody.innerHTML = '';

  for (const student of students) {
    const row = document.createElement('tr');
    row.dataset.studentId = student.Id;
    row.innerHTML = `
      <td>${student.Id}</td>
      <td>${student.Name}</td>
      <td>${student.Email}</td>
      <td>${student.Course}</td>
      <td>${student.Age}</td>
      <td>
        <button class="edit-button" data-id="${student.Id}">Edit</button>
        <button class="delete-button danger" data-id="${student.Id}">Delete</button>
      </td>
    `;
    studentsBody.appendChild(row);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const student = {
    name: nameInput.value,
    email: emailInput.value,
    course: courseInput.value,
    age: Number(ageInput.value)
  };

  const id = idInput.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/students/${id}` : '/api/students';

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });

  const body = response.status === 204 ? null : await response.json();

  if (!response.ok) {
    showMessage(body?.message || 'Operation failed', 'error');
    return;
  }

  showMessage(id ? 'Student updated successfully' : 'Student created successfully');
  resetForm();
  await loadStudents();
});

studentsBody.addEventListener('click', async (event) => {
  const id = event.target.dataset.id;
  if (!id) return;

  if (event.target.classList.contains('edit-button')) {
    const response = await fetch(`/api/students/${id}`);
    const student = await response.json();

    idInput.value = student.Id;
    nameInput.value = student.Name;
    emailInput.value = student.Email;
    courseInput.value = student.Course;
    ageInput.value = student.Age;
    saveButton.textContent = 'Update Student';
    cancelButton.hidden = false;
    showMessage(`Editing student ID ${student.Id}`);
  }

  if (event.target.classList.contains('delete-button')) {
    const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      const body = await response.json();
      showMessage(body.message || 'Delete failed', 'error');
      return;
    }

    showMessage('Student deleted successfully');
    await loadStudents();
  }
});

cancelButton.addEventListener('click', resetForm);
refreshButton.addEventListener('click', loadStudents);

loadStudents().catch(error => showMessage(error.message, 'error'));
