/* =====================================================
   TRADEHUB CART SYSTEM
===================================================== */


/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentTradeHubUser() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_current_user"
        )
    );

}


/* =====================================================
   GET CART
===================================================== */

function getCartStorageKey(
    user = null
) {

    if (!user) {

        user =
            getCurrentTradeHubUser();

    }


    /*
     * Every logged-in TradeHub account gets
     * its own independent cart.
     *
     * Example:
     * tradehub_cart_customer_123
     * tradehub_cart_business_456
     */

    if (
        !user ||
        user.id === undefined ||
        user.id === null
    ) {

        return null;

    }


    return (
        "tradehub_cart_" +
        String(
            user.type || "user"
        ) +
        "_" +
        String(
            user.id
        )
    );

}


function getCart() {

    migrateLegacyCart();


    const key =
        getCartStorageKey();


    if (!key) {

        return [];

    }


    try {

        return JSON.parse(
            localStorage.getItem(
                key
            )
        ) || [];

    }
    catch (error) {

        console.error(
            "Unable to read TradeHub cart:",
            error
        );

        return [];

    }

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart(
    cart,
    user = null
) {

    const key =
        getCartStorageKey(
            user
        );


    if (!key) {

        return false;

    }


    localStorage.setItem(
        key,
        JSON.stringify(
            cart
        )
    );


    return true;

}


/* =====================================================
   MIGRATE OLD GLOBAL CART
===================================================== */

/*
 * Older versions of TradeHub used:
 *
 *     tradehub_cart
 *
 * That global cart caused one account to see another
 * account's items.
 *
 * We migrate the old cart only for the currently
 * logged-in account, then remove the old shared key.
 */

function migrateLegacyCart() {

    const user =
        getCurrentTradeHubUser();


    if (!user) {

        return;

    }


    const newKey =
        getCartStorageKey(
            user
        );


    if (!newKey) {

        return;

    }


    const legacyKey =
        "tradehub_cart";


    const legacyCart =
        localStorage.getItem(
            legacyKey
        );


    if (
        !legacyCart
    ) {

        return;

    }


    /*
     * Only migrate when this account does not
     * already have an account-specific cart.
     */

    if (
        localStorage.getItem(
            newKey
        ) === null
    ) {

        try {

            localStorage.setItem(
                newKey,
                legacyCart
            );

        }
        catch (error) {

            console.error(
                "Unable to migrate legacy cart:",
                error
            );

        }

    }


    /*
     * Remove the shared cart so another account
     * can never inherit it.
     */

    localStorage.removeItem(
        legacyKey
    );

}


/* =====================================================
   UPDATE CART COUNT
===================================================== */

function updateCartCount() {

    const cart =
        getCart();


    let count = 0;


    cart.forEach(
        item => {

            count +=
                Number(
                    item.quantity
                ) || 0;

        }
    );


    document
        .querySelectorAll(
            ".cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

            }
        );

}


/* =====================================================
   GET PRODUCT FROM CART ITEM
===================================================== */

function getCartProduct(
    item
) {

    /*
     * products.js must be loaded on pages
     * that call this function.
     */

    if (
        typeof getProductById !==
        "function"
    ) {

        return null;

    }


    return getProductById(
        item.productId
    );

}


/* =====================================================
   GET CURRENT PRICE FOR CART ITEM
===================================================== */

function getCartItemPrice(
    item,
    user = null
) {

    /*
     * Cart stores the final price when
     * product is added.
     *
     * Never recalculate here because it
     * can change checkout totals.
     */

    if (
        item &&
        Number(item.price) > 0
    ) {

        return Number(
            item.price
        );

    }


    /*
     * Fallback for old cart items
     */

    const product =
        getCartProduct(
            item
        );


    if (
        product &&
        typeof getProductPriceForUser ===
        "function"
    ) {

        return getProductPriceForUser(
            product,
            user
        );

    }


    return 0;

}


/* =====================================================
   GET CART ITEM PRICE TYPE
===================================================== */

function getCartItemPriceType(
    user = null
) {

    if (
        user &&
        typeof isBusinessVerified ===
        "function" &&
        isBusinessVerified(
            user
        )
    ) {

        return "wholesale";

    }


    return "retail";

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    product,
    quantity,
    price
) {


    /* =================================================
       CHECK LOGIN
    ================================================== */

    const currentUser =
        getCurrentTradeHubUser();


    if (!currentUser) {


        alert(
            "Please login or register before adding products to your cart."
        );


        localStorage.setItem(
            "tradehub_return_url",
            window.location.href
        );


        window.location.href =
            "login.html";


        return false;

    }


    /* =================================================
       BUSINESS CANNOT BUY OWN PRODUCT
    ================================================== */

    if (

        currentUser.type ===
        "business" &&

        typeof isProductOwnedByBusiness ===
        "function" &&

        isProductOwnedByBusiness(
            product,
            currentUser.id
        )

    ) {


        alert(
            "You cannot purchase your own product."
        );


        return false;

    }


    /* =================================================
       PRODUCT STOCK
    ================================================= */

    const availableStock =
        Number(
            product.stock
        ) || 0;


    if (
        availableStock <= 0
    ) {


        alert(
            "This product is out of stock."
        );


        return false;

    }


    /* =================================================
       VALIDATE QUANTITY
    ================================================= */

    quantity =
        Number(
            quantity
        );


    if (
        !Number.isInteger(
            quantity
        ) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    /* =================================================
       STOCK LIMIT
    ================================================= */

    if (
        quantity >
        availableStock
    ) {


        alert(
            `Only ${availableStock} units are available.`
        );


        return false;

    }


    /* =================================================
       B2B WHOLESALE QUANTITY
    ================================================= */

    if (
        currentUser.type ===
        "business" &&

        typeof isBusinessVerified ===
        "function" &&

        isBusinessVerified(
            currentUser
        ) &&

        typeof getMinimumWholesaleQuantity ===
        "function"
    ) {


        const minimumQuantity =
            getMinimumWholesaleQuantity(
                product
            );


        if (
            quantity <
            minimumQuantity
        ) {


            alert(
                `Verified business orders must contain at least ${minimumQuantity} units of this product.`
            );


            return false;

        }

    }


    /* =================================================
       GET CART
    ================================================== */

    const cart =
        getCart();


    /* =================================================
       CHECK EXISTING ITEM
    ================================================== */

    const existingItem =
        cart.find(
            item =>

                Number(
                    item.productId
                ) ===

                Number(
                    product.id
                )
        );


    /* =================================================
       EXISTING ITEM
    ================================================== */

    if (
        existingItem
    ) {


        const newQuantity =
            Number(
                existingItem.quantity
            ) +
            quantity;


        /* =============================================
           STOCK CHECK
        ============================================== */

        if (
            newQuantity >
            availableStock
        ) {


            alert(
                `Only ${availableStock} units are available.`
            );


            return false;

        }


        /* =============================================
           B2B MINIMUM CHECK
        ============================================== */

        if (
            currentUser.type ===
            "business" &&

            typeof isBusinessVerified ===
            "function" &&

            isBusinessVerified(
                currentUser
            ) &&

            typeof getMinimumWholesaleQuantity ===
            "function"
        ) {


            const minimumQuantity =
                getMinimumWholesaleQuantity(
                    product
                );


            if (
                newQuantity <
                minimumQuantity
            ) {


                alert(
                    `Verified business orders must contain at least ${minimumQuantity} units of this product.`
                );


                return false;

            }

        }


        existingItem.quantity =
            newQuantity;


        /*
         * Refresh product information.
         */

        existingItem.name =
            product.name;


        existingItem.brand =
            product.brand;


        existingItem.image =
            product.image;


        existingItem.businessId =
            product.businessId;


        existingItem.businessName =
            product.businessName;


        existingItem.sourceType =
            product.sourceType ||
            null;


        existingItem.isUsed =
            product.isUsed === true;


        existingItem.isCustomerProduct =
            product.isCustomerProduct === true;


        existingItem.sellerId =
            product.sellerId ||
            null;


        existingItem.sellerName =
            product.sellerName ||
            null;


        existingItem.retailPrice =
            getRetailPrice(
                product
            );


        existingItem.wholesalePrice =
            getWholesalePrice(
                product
            );


        existingItem.price =
            getCartItemPrice(
                existingItem,
                currentUser
            );

    }


    /* =================================================
       NEW ITEM
    ================================================== */

    else {


        cart.push({

            productId:
                product.id,

            name:
                product.name,

            brand:
                product.brand,

            /*
             * Keep both prices.
             * This allows the cart UI to show
             * the appropriate pricing information.
             */

            retailPrice:
                typeof getRetailPrice ===
                "function"

                    ?

                getRetailPrice(
                    product
                )

                    :

                Number(
                    product.retailPrice
                ) || 0,


            wholesalePrice:
                typeof getWholesalePrice ===
                "function"

                    ?

                getWholesalePrice(
                    product
                )

                    :

                Number(
                    product.wholesalePrice
                ) || 0,


            /*
             * Store the current user's price.
             */

            price:
                typeof getProductPriceForUser ===
                "function"

                    ?

                getProductPriceForUser(
                    product,
                    currentUser
                )

                    :

                Number(
                    price
                ) || 0,


            quantity:
                quantity,


            image:
                product.image || "",


            businessId:
                product.businessId,


            businessName:
                product.businessName,


            sourceType:
                product.sourceType ||
                null,


            isUsed:
                product.isUsed === true,


            isCustomerProduct:
                product.isCustomerProduct === true,


            sellerId:
                product.sellerId ||
                null,


            sellerName:
                product.sellerName ||
                null,


            minimumWholesaleQuantity:
                Number(
                    product.minimumWholesaleQuantity
                ) || 1

        });

    }


    /* =================================================
       SAVE CART
    ================================================== */

    saveCart(
        cart
    );


    /* =================================================
       UPDATE COUNT
    ================================================== */

    updateCartCount();


    return true;

}


/* =====================================================
   REFRESH CART PRICES
===================================================== */

/*
 * Important B2B feature.
 *
 * If the user changes from customer → business
 * or business → customer, the cart price is
 * recalculated.
 *
 * Product prices are also refreshed from the
 * latest product data.
 */

function refreshCartPrices() {

    const cart =
        getCart();


    const currentUser =
        getCurrentTradeHubUser();


    if (
        cart.length === 0
    ) {

        return cart;

    }


    cart.forEach(
        item => {


            const product =
                getCartProduct(
                    item
                );


            if (!product) {

                return;

            }


            /*
             * Refresh product information.
             */

            item.name =
                product.name;


            item.brand =
                product.brand;


            item.image =
                product.image;


            item.businessId =
                product.businessId;


            item.businessName =
                product.businessName;


            item.sourceType =
                product.sourceType ||
                null;


            item.isUsed =
                product.isUsed === true;


            item.isCustomerProduct =
                product.isCustomerProduct === true;


            item.sellerId =
                product.sellerId ||
                null;


            item.sellerName =
                product.sellerName ||
                null;


            item.retailPrice =
                typeof getRetailPrice ===
                "function"

                    ?

                getRetailPrice(
                    product
                )

                    :

                Number(
                    product.retailPrice
                ) || 0;


            item.wholesalePrice =
                typeof getWholesalePrice ===
                "function"

                    ?

                getWholesalePrice(
                    product
                )

                    :

                Number(
                    product.wholesalePrice
                ) || 0;


            item.minimumWholesaleQuantity =
                typeof getMinimumWholesaleQuantity ===
                "function"

                    ?

                getMinimumWholesaleQuantity(
                    product
                )

                    :

                1;


            /*
             * Recalculate current price.
             */

            /*
            * Do not update item.price here.
            *
            * The cart price is the locked price
            * selected when the product was added.
            */

        }
    );


    saveCart(
        cart
    );


    updateCartCount();


    return cart;

}


/* =====================================================
   VALIDATE ENTIRE CART
===================================================== */

/*
 * This should be called before checkout.
 *
 * It checks:
 *
 * - Product still exists
 * - Product is in stock
 * - Quantity is available
 * - Business doesn't own product
 * - Wholesale minimum is satisfied
 */

function validateCart() {

    const cart =
        getCart();


    const currentUser =
        getCurrentTradeHubUser();


    const errors = [];


    if (!currentUser) {

        errors.push(
            "Please login before checkout."
        );


        return {

            valid: false,

            errors: errors

        };

    }


    cart.forEach(
        item => {


            const product =
                getCartProduct(
                    item
                );


            /* =========================================
               PRODUCT EXISTS
            ========================================== */

            if (!product) {

                errors.push(
                    `${item.name} is no longer available.`
                );


                return;

            }


            /* =========================================
               OWN PRODUCT
            ========================================== */

            if (

                currentUser.type ===
                "business" &&

                typeof isProductOwnedByBusiness ===
                "function" &&

                isProductOwnedByBusiness(
                    product,
                    currentUser.id
                )

            ) {

                errors.push(
                    `You cannot purchase your own product: ${product.name}.`
                );


                return;

            }


            /* =========================================
               STOCK
            ========================================== */

            const stock =
                Number(
                    product.stock
                ) || 0;


            const quantity =
                Number(
                    item.quantity
                ) || 0;


            if (
                stock <= 0
            ) {

                errors.push(
                    `${product.name} is out of stock.`
                );


                return;

            }


            if (
                quantity >
                stock
            ) {

                errors.push(
                    `Only ${stock} units of ${product.name} are available.`
                );

            }


            /* =========================================
               B2B MINIMUM
            ========================================== */

            if (

                currentUser.type ===
                "business" &&

                typeof isBusinessVerified ===
                "function" &&

                isBusinessVerified(
                    currentUser
                ) &&

                typeof getMinimumWholesaleQuantity ===
                "function"

            ) {


                const minimum =
                    getMinimumWholesaleQuantity(
                        product
                    );


                if (
                    quantity <
                    minimum
                ) {

                    errors.push(
                        `${product.name} requires a minimum wholesale order of ${minimum} units.`
                    );

                }

            }

        }
    );


    return {

        valid:
            errors.length ===
            0,

        errors:
            errors

    };

}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(
    productId
) {

    const currentUser =
        getCurrentTradeHubUser();


    if (!currentUser) {

        alert(
            "Please login to manage your cart."
        );

        return false;

    }


    const cart =
        getCart();


    const originalLength =
        cart.length;


    const updatedCart =
        cart.filter(
            item =>

                String(
                    item.productId
                ) !==

                String(
                    productId
                )
        );


    if (
        updatedCart.length ===
        originalLength
    ) {

        return false;

    }


    saveCart(
        updatedCart,
        currentUser
    );


    updateCartCount();


    return true;

}


/* =====================================================
   UPDATE QUANTITY
===================================================== */

function updateCartQuantity(
    productId,
    quantity
) {

    const cart =
        getCart();


    const item =
        cart.find(
            item =>

                Number(
                    item.productId
                ) ===

                Number(
                    productId
                )
        );


    if (!item) {

        return false;

    }


    const product =
        getCartProduct(
            item
        );


    quantity =
        Number(
            quantity
        );


    if (
        !Number.isInteger(
            quantity
        ) ||
        quantity < 1
    ) {

        quantity = 1;

    }


    /* =================================================
       STOCK CHECK
    ================================================== */

    if (
        product
    ) {


        const stock =
            Number(
                product.stock
            ) || 0;


        if (
            quantity >
            stock
        ) {


            alert(
                `Only ${stock} units are available.`
            );


            return false;

        }

    }


    /* =================================================
       B2B MINIMUM CHECK
    ================================================== */

    const currentUser =
        getCurrentTradeHubUser();


    if (

        product &&

        currentUser &&

        currentUser.type ===
        "business" &&

        typeof isBusinessVerified ===
        "function" &&

        isBusinessVerified(
            currentUser
        ) &&

        typeof getMinimumWholesaleQuantity ===
        "function"

    ) {


        const minimum =
            getMinimumWholesaleQuantity(
                product
            );


        if (
            quantity <
            minimum
        ) {


            alert(
                `Verified business orders require at least ${minimum} units of this product.`
            );


            return false;

        }

    }


    item.quantity =
        quantity;


    /*
     * Recalculate price.
     */

    /*
    * Quantity changes should not modify
    * the product price.
    */


    saveCart(
        cart
    );


    updateCartCount();


    return true;

}


/* =====================================================
   GET CART SUBTOTAL
===================================================== */

function getCartSubtotal() {

    const cart =
        refreshCartPrices();


    let subtotal = 0;


    cart.forEach(
        item => {


            const price =
                Number(
                    item.price
                ) || 0;


            const quantity =
                Number(
                    item.quantity
                ) || 0;


            subtotal +=
                price *
                quantity;

        }
    );


    return subtotal;

}


/* =====================================================
   CLEAR CART
===================================================== */

function clearCart() {

    const key =
        getCartStorageKey();


    if (
        key
    ) {

        localStorage.removeItem(
            key
        );

    }


    /*
     * Also remove the old global key.
     * This prevents a stale cart from being
     * picked up later.
     */

    localStorage.removeItem(
        "tradehub_cart"
    );


    updateCartCount();

}


/* =====================================================
   INITIALIZE CART COUNT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        migrateLegacyCart();


        /*
         * Refresh prices when the cart page
         * loads.
         */

        if (
            typeof getProducts ===
            "function"
        ) {

            refreshCartPrices();

        }


        updateCartCount();

    }
);