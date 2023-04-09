export const getDataFromForm = (form) => {
    const formData = new FormData(form);
    return Object.fromEntries(formData.entries());
}