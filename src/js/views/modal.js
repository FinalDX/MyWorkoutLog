import { elements } from './base';

export const confirm = (text, buttonName) => {
    const markup = `
        <div class="modal">
            <div class="modal-box">
                <p class="modal-text">${text}</p>
                <div class="modal-btn-container">
                    <button class="modal-${buttonName}-btn complete-btn btn">Yes</button>
                    <button class="modal-btn cancel-btn btn">No</button>
                </div>
            </div>
        </div>
    `
    elements.modalContainer.insertAdjacentHTML('beforeend', markup);
    
}

export const prompt = (text) => {
    const markup = `
        <div class="modal">
            <div class="modal-box">
                <p class="modal-text">${text}</p>
                <input class="modal-input" type="text" maxlength="30">
                <div class="modal-btn-container">
                    <button class="modal-input-btn complete-btn btn">Create</button>
                    <button class="modal-btn cancel-btn btn">Cancel</button>
                </div>
            </div>
        </div>
    `
    elements.modalContainer.insertAdjacentHTML('beforeend', markup);
}

export const alert = (text) => {
    const markup = `
        <div class="modal">
            <div class="modal-box">
                <p class="modal-text">${text}</p>
                <div class="modal-btn-container">
                    <button class="modal-btn complete-btn btn">OK</button>
                </div>
            </div>
        </div>
    `
    elements.modalContainer.insertAdjacentHTML('beforeend', markup);
}