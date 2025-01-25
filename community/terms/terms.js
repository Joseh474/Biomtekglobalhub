const dialog = document.getElementById('dialog');

const openDialogButton = document.getElementById('joinButton');
const closeDialogButton = document.getElementById('closeDialogButton');

openDialogButton.onclick = function () {
    dialog.style.display = 'block';
};

closeDialogButton.onclick = function () {
    dialog.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target === dialog) {
        dialog.style.display = 'none';
    }
};

document.getElementById('joinForm').onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission
    const selectedRole = document.querySelector('input[name="role"]:checked');
    if (selectedRole) {
        if (selectedRole.value === 'Student') {
            window.location.href = 'registrationforms/reg.html'; // Redirect to reg.html if 'Student' is selected
        } else if (selectedRole.value === 'Professional') {
            window.location.href = 'registrationforms/proffreg.html'; 
        }
        dialog.style.display = 'none'; // Close the dialog
    } else {
        alert('Please select a role.');
    }
};
