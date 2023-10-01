import { 
    API_URL, 
    PREFIX_PRODUCT 
} from "./const.js";
import {
    ingredientsList,
    modalProduct,     
    modalProductTitle,
    modalProductImage,
    modalProductDescription,
    ingredientsCalories,
    modalProductPrice,
    modalProductBtn,
    modalProductCount,
    countAmount,
} from "./elements.js";
import {
    getData
} from "./getData.js"

export const openModal = async (id) => {
    const product = await getData(`${API_URL}${PREFIX_PRODUCT}/${id}`)
    modalProductTitle.textContent = product.title;
    modalProductImage.src = `${API_URL}/${product.image}`;
    modalProductDescription.textContent = product.description;
    ingredientsList.textContent = '';
    const ingredientsListItems = product.ingredients.map((elem) => {
        const li = document.createElement('li');
        li.classList.add('ingredients__item'); 
        li.textContent = elem;
        return li
    });
    ingredientsList.append(...ingredientsListItems);
    ingredientsCalories.textContent = `${product.weight}г, ккал ${product.calories}`;
    modalProductPrice.textContent = product.price;
    modalProductBtn.dataset.idProduct = product.id;
    modalProduct.classList.add('modal_open'); 
    countAmount.textContent = 1;
    };