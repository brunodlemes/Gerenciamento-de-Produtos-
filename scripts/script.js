async function fetchProducts() {
    try {
        const response = await fetch('database/products.json');
        if (!response.ok) {
            throw new Error(`Erro de requisição: ${response.status}`);
        };
        return await response.json();
    } catch (error) {
        console.error(error);
    };
}


function createElementWithClass(tagName, className) {
    const element = document.createElement(tagName);
    
    element.classList.add(className);
    
    return element;
}


function createImageArea(product){
    const productImage = createElementWithClass('div', 'product-image');
    const slideButtons = createElementWithClass('div', 'slide-buttons');
    const prevButton = createElementWithClass('button', 'prev-button');
    const nextButton = createElementWithClass('button', 'next-button');
    const image = document.createElement('img');
    let currentIndex = 0;
    
    image.src = product.images[0];
    image.alt = `Imagem de ${product.name}`;
    productImage.appendChild(image);
    
    if (product.images.length > 1) {
        
        prevButton.textContent = '«';
        nextButton.textContent = '»';

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 < 0) ? product.images.length - 1 : currentIndex - 1;
            console.log(`Index anterior: ${currentIndex}`);
            image.src = product.images[currentIndex];
            image.alt = `Imagem de ${product.name}`
        });
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1 == product.images.length) ? 0 : currentIndex + 1;
            console.log(`Index próximo: ${currentIndex}`);
            image.src = product.images[currentIndex];
            image.alt = `Imagem de ${product.name}`
        });
    
        slideButtons.appendChild(prevButton);
        slideButtons.appendChild(nextButton);
        productImage.appendChild(image);
        productImage.appendChild(slideButtons);
    
    };
    
    return productImage;
}


function createInfoArea(product) {
    const productInfo = createElementWithClass('div', 'product-info');
    
    productInfo.innerHTML = `
        <p><strong>Preço:</strong></p>
        <span>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        
        <p><strong>Dimensões:</strong></p>
        <span>${product.dimensions}</span>
        
        <p><strong>Material:</strong></p>
        <span>${product.material}</span>
    `;
    
    return productInfo;
}


function createDetailsArea(product) {
    const detailsGroup = [];
    const productDetails = createElementWithClass('div', 'product-details');
    const detailsButton = createElementWithClass('button', 'details-button');
    
    productDetails.innerHTML = `
        <p><strong>Origem:</strong></p>
        <span>${product.origin}</span>
        
        <p><strong>Dicas de cuidados:</strong></p>
        <span>${product.care_tips}</span>
        
        <p><strong>Recomendações de uso: </strong></p>
        <span>${product.tips_for_use}</span>
        
        <p><strong>Sugestões de produtos complementares:</strong></p>
        <span>${product.complementary_product_tips}</span>
        
        <p><strong>Informações adicionais: </strong></p>
        <span>${product.additional_information}</span>
    `;
    productDetails.style.display = 'none';
    
    detailsButton.textContent = 'Detalhes';
    detailsButton.addEventListener('click', () => {
        productDetails.style.display = productDetails.style.display === 'block' ? 'none' : 'block';
    });
    
    detailsGroup.push(detailsButton);
    detailsGroup.push(productDetails);
    
    return detailsGroup;
}


function createProductCard(product) {
    const productCard = createElementWithClass('div', 'product-card');
    const imageArea = createImageArea(product);
    const infoArea = createInfoArea(product);
    const detailsArea = createDetailsArea(product);
    
    infoArea.appendChild(detailsArea[0]);
    infoArea.appendChild(detailsArea[1]);
    
    productCard.innerHTML = `
        <h2>${product.name} - ${product.id}</h2>
    `;
    
    productCard.appendChild(imageArea);
    productCard.appendChild(infoArea);

    return productCard;
}


async function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const products = await fetchProducts();
    let filteredProducts = [];
    
    filteredProducts = products.filter(product => {
        if (product.name.toLowerCase().includes(searchTerm) || product.id.toLowerCase() == searchTerm || product.price.toString() == searchTerm) {
            return product
        };
    });
    
    return filteredProducts;
}


async function addProductsToCard(productList) {
    const filteredProducts = await filterProducts();

    filteredProducts.forEach(product => {
        productList.appendChild(createProductCard(product));
        });
}


function displayProducts() {
    const productList = document.getElementById('productList');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', () => {
        productList.innerHTML = '';
        addProductsToCard(productList);
    });
    searchInput.addEventListener('keydown', () => {
        if (event.key == 'Enter') {
            productList.innerHTML = '';
            addProductsToCard(productList);
        };
    })

    addProductsToCard(productList);
}


displayProducts();
