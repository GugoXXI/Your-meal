import { 
    API_URL, PREFIX_PRODUCT 
} from "./const.js";
import { 
    catalogList, countAmount, modalDelivery, modalProductBtn, order, orderClose, orderCount, orderList, orderSubmit, orderTotalAmount, orderWrapTitle
} from "./elements.js";
import { 
    getData 
} from "./getData.js";
import { orderController } from "./orderController.js";

const getCart = () => {
    const cartList = localStorage.getItem('cart');
    if(cartList) {
        return JSON.parse(cartList);
    } else {
        return [];
    }
}

const renderCartList = async () => {
    const cartList = getCart();
    orderSubmit.disabled = !cartList.length;
    const allIdProduct = cartList.map(item => item.id);
    const data = cartList.length ? 
    await getData(`${API_URL}${PREFIX_PRODUCT}?list=${allIdProduct}`) : [];
    console.log(data);
    const countProduct = cartList.reduce((acc, item) => acc + item.count, 0);
    orderCount.textContent = countProduct;
    orderList.textContent = '';
    const cartItems = data.map(item => {
        const li = document.createElement('li');
        li.classList.add('order__item');
        li.dataset.idProduct = item.id;
        const product = cartList.find((cartItem => cartItem.id === item.id));
        li.innerHTML = `
            <img class="order__img" src="${API_URL}/${item.image}" alt="${item.title}">
            <div class="order__product">
                <h3 class="order__product-title">${item.title}</h3>
                <p class="order__product-weight">${item.weight}</p>
                <p class="order__product-price">${item.price}<span class="currency">₽</span>
                </p>
            </div>
            <div class="order__product-count count">
                <button class="count__minus" data-id-product="${product.id}">-</button>
                <p class="count__amount">${product.count}</p>
                <button class="count__plus" data-id-product="${product.id}">+</button>
            </div>
    `;
    return li;
    });
    orderList.append(...cartItems);
    orderTotalAmount.textContent = data.reduce((acc, item) => {
        const product = cartList.find(cartItem => 
            cartItem.id === item.id);
        return acc + (product.count * item.price); 
    }, 0);
};

const updateCartList = (cartList) => {
    localStorage.setItem('cart', JSON.stringify(cartList));
    renderCartList();
};

const removeCart = (id) => {
    const cartList = getCart(); 
    const productIndex = cartList.findIndex((item) => {
        return item.id === id;
    });
    cartList[productIndex].count -= 1;
    if (cartList[productIndex].count === 0) {
        cartList.splice(productIndex, 1);
    }
    updateCartList(cartList);
}

const addCart = (id, count = 1) => {
    console.log(id, count);
    const cartList = getCart(); 
    const product = cartList.find((item) => { 
        return item.id === id;
    });
    if (product) { 
        product.count += count;
    } else {
        cartList.push({id, count});
    }
    updateCartList(cartList);
};

export const clearCart = () => {
    localStorage.removeItem('cart');
    renderCartList();
};

const cartController = () => {
    catalogList.addEventListener('click', ({target}) => {
        if (target.closest('.product__add')) {
            addCart(target.closest('.product').dataset.idProduct)
        }
    });
    modalProductBtn.addEventListener('click', () => {
        addCart(modalProductBtn.dataset.idProduct, parseInt(countAmount.textContent));
    });
    orderList.addEventListener('click', ({target}) => {
        const targetPlus = target.closest('.count__plus');
        const targetMinus = target.closest('.count__minus');
            if (targetPlus) {
                addCart(targetPlus.dataset.idProduct);
            }
            if (targetMinus) {
                removeCart(targetMinus.dataset.idProduct);
            }
    });
    orderWrapTitle.addEventListener('click', () => {
        order.classList.toggle('order_open');
    });
    orderClose.addEventListener('click', () => {
        order.classList.remove('order_open');
    });
    orderSubmit.addEventListener('click', () => {
        modalDelivery.classList.add('modal_open');
        window.addEventListener('keydown', closeModalEscapeDelivery);
    });
    modalDelivery.addEventListener('click', ({target}) => {
        if (target.closest('.modal__close') || target === modalDelivery) {
            modalDelivery.classList.remove('modal_open');
        }
    });
    let closeModalEscapeDelivery = (e) => {
        if (e.key === 'Escape') {
            modalDelivery.classList.remove('modal_open');
            window.removeEventListener('keydown', closeModalEscapeDelivery);
        }
    };

// ДЗ +/- в модальном окне
// modalProductContainer.addEventListener('click', ({target}) => {
//     const targetPlus = target.closest('.count__plus');
//     const targetMinus = target.closest('.count__minus');
//         if (targetPlus) {
//             countAmount.textContent = parseInt(countAmount.textContent) + 1;
//             addCart(targetPlus.dataset.idProduct);
//         }
//         if (targetMinus) {
//             countAmount.textContent = countAmount.textContent - 1;
//             removeCart(targetMinus.dataset.idProduct);
//         }
// });


    // modalProduct.addEventListener('click', ({target}) => {
    //     if (target.closest('.count__plus')) {
    //         countAmount.textContent = parseInt(countAmount.textContent) + 1;
    //     } else if (target.closest('.count__minus')) {
    //         countAmount.textContent = countAmount.textContent - 1;
    //             if (countAmount.textContent < 1) {
    //                 countAmount.textContent = 1;
    //             }
    //     }
    // });
}

export const cartInit = () => {
    cartController();
    renderCartList();
    orderController(getCart);
}
