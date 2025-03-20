export function renderAvatar(username) {
    let initial = username.charAt(0).toUpperCase();
    return `<div class="user-avatar rounded-circle bg-primary text-white d-flex justify-content-center align-items-center">${initial}</div>`;
}

