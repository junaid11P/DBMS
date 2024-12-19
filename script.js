let files = {}; // Simulate file storage

// Animation to Form
function goToForm() {
  document.getElementById('animation-container').classList.add('hidden');
  document.getElementById('form-container').classList.remove('hidden');
}

// Handle Form Submission
document.getElementById('file-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const fileName = document.getElementById('file-name').value;
  const password = document.getElementById('file-password').value;

  if (!files[fileName]) {
    // Create New File
    files[fileName] = { password, content: '' };
    alert('New file created!');
  } else if (files[fileName].password !== password) {
    alert('Incorrect password!');
    return;
  }

  openEditor(fileName);
});

// Open Editor
function openEditor(fileName) {
  document.getElementById('form-container').classList.add('hidden');
  document.getElementById('editor-container').classList.remove('hidden');
  document.getElementById('editor').value = files[fileName].content;
  document.getElementById('editor').dataset.currentFile = fileName;
}

// Save File
function saveFile() {
  const fileName = document.getElementById('editor').dataset.currentFile;
  const content = document.getElementById('editor').value;

  if (fileName) {
    files[fileName].content = content;
    alert('File saved successfully!');
  }
}

// Logout
function logout() {
  document.getElementById('editor-container').classList.add('hidden');
  document.getElementById('form-container').classList.remove('hidden');
  document.getElementById('editor').value = '';
}
