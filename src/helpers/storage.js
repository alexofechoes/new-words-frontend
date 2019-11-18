export const save = (key, value) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const get = (key) => {
    return JSON.parse(window.localStorage.getItem(key));
};

export default {
    save,
    get,
}