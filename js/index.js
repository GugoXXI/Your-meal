import {
    catalogList,
    modalDelivery,
    modalProduct
} from "./elements.js";

import {
    openModal
} from './openModel.js';

import {
    renderListProduct
} from "./renderListProduct.js";

import { 
    navigationListController 
} from "./navigationListController.js";
import { cartInit } from "./cart.js";

let closeModalEscape = (e) => {
    if (e.key === 'Escape') {
        modalProduct.classList.remove('modal_open');
        window.removeEventListener('keydown', closeModalEscape);
    }
};

catalogList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.closest('.product__detail')
    || target.closest('.product__image')) {
    const id = target.closest('.product').dataset.idProduct;
        openModal(id);
        window.addEventListener('keydown', closeModalEscape);
    }
});

modalProduct.addEventListener('click', function(event) {
    const target = event.target;
    if (target.closest('.modal__close')
    || target === modalProduct) {
        modalProduct.classList.remove('modal_open');
    } 
});

const init = () => {
    renderListProduct();
    navigationListController(renderListProduct);
    cartInit();
};
init();