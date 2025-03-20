export function renderAvatar(user) {
    let initial = user.username.charAt(0).toUpperCase();
    return user.avatar
        ? `<img src="${user.avatar}" class="rounded-circle" alt="Avatar">`
        : `<div class="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center">${initial}</div>`;
}

