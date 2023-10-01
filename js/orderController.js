// работаем с формой в модальном окне delivery!!!
import { clearCart } from "./cart.js";
import { API_URL, PREFIX_PRODUCT } from "./const.js";
import { modalDeliveryContainer, modalDeliveryForm, order } from "./elements.js"

export const orderController = (getCart) => {
    const checkDelivery = () => {
            if (modalDeliveryForm.format.value === 'pickup') {
                modalDeliveryForm['address-info'].classList.add('modal-delivery__fieldset-input_hide');
            }
            if (modalDeliveryForm.format.value === 'delivery') {
                modalDeliveryForm['address-info'].classList.remove('modal-delivery__fieldset-input_hide');
            }
        };
    
    modalDeliveryForm.addEventListener('change', checkDelivery );
    modalDeliveryForm.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(modalDeliveryForm);
        console.log(formData);
        const data = Object.fromEntries(formData);
        if (modalDeliveryForm.format.value === 'pickup') {
            delete data.address;
            delete data.floor;
            delete data.intercom;
        }
        data.order = getCart();
        console.log(data);
        fetch('https://63895b67c5356b25a2feb4a8.mockapi.io/order', {
            method: 'post',
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(response => {
            clearCart();
            modalDeliveryContainer.innerHTML = `
            <h2>Спасибо за заказ</h2>
            <h3>Номер вашего заказа ${response.id}</h3>
            <p>в ближайшее время с вами свяжется наш менеджер ${response.manager}</p>
            <br>
            <p><strong>Ваш заказ:</strong></p>
            `;
            getNameProduct(data);
        });
        order.classList.remove('order_open');
    })
        const getNameProduct = (data) => {
        const allIdProduct = data.order.map(item => item.id);
        fetch(`${API_URL}${PREFIX_PRODUCT}?list=${allIdProduct}`)
            .then(response => response.json())
            .then(response => {
                const titleFromCart = response.map(item => `${item.category} ${item.title.toLowerCase()}`);
                console.log(titleFromCart);
                const ul = document.createElement('ul');
                titleFromCart.forEach(item => {
                    
                    ul.insertAdjacentHTML('beforeend', `<li>${item}</li>`)
                });
                modalDeliveryContainer.insertAdjacentElement('beforeend', ul);
            })
        }  
}
