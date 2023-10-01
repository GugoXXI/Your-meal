import { 
    navigationList, navigationListItems, catalogTitle 
} from "./elements.js"

export const navigationListController = (callback) => {
    navigationList.addEventListener('click', e => {
        const categoryItem = e.target.closest('.navigation__button');
        if(!categoryItem) return;
        navigationListItems.forEach((item) => {
            if (item === categoryItem) {
                item.classList.add('navigation__button_active');
                catalogTitle.textContent = item.textContent;
                callback(item.dataset.category);
            } else {
                item.classList.remove('navigation__button_active');
            }
        });
    })
};