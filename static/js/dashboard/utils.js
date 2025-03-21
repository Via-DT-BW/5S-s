export function renderAvatar(username) {
    const initial = username.charAt(0).toUpperCase();
    return `
        <div class="user-avatar rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
             data-bs-toggle="popover" data-bs-trigger="hover" data-bs-content="${username}">${initial}</div>`;
}
