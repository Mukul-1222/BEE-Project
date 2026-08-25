/* =====================================================
   TRADEHUB PRODUCT SYSTEM
===================================================== */


/* =====================================================
   GET ALL PRODUCTS
===================================================== */

function getProducts() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_products"
        )
    ) || [];

}


/* =====================================================
   SAVE PRODUCTS
===================================================== */

function saveProducts(products) {

    localStorage.setItem(
        "tradehub_products",
        JSON.stringify(
            products
        )
    );

}


/* =====================================================
   ADD PRODUCT
===================================================== */

function addProduct(product) {

    const products =
        getProducts();


    /*
     * Make sure important B2B fields
     * exist even if an older product
     * was created before the B2B system.
     */

    product.retailPrice =
        Number(
            product.retailPrice ??
            product.price ??
            0
        );


    product.wholesalePrice =
        Number(
            product.wholesalePrice ??
            product.retailPrice
        );


    product.minimumWholesaleQuantity =
        Number(
            product.minimumWholesaleQuantity ??
            1
        );


    product.stock =
        Number(
            product.stock ??
            0
        );


    /*
     * Add product.
     */

    products.push(
        product
    );


    saveProducts(
        products
    );


    return product;

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

function deleteProduct(
    productId
) {

    let products =
        getProducts();


    products =
        products.filter(
            product =>
                product.id !==
                productId
        );


    saveProducts(
        products
    );

}


/* =====================================================
   FIND PRODUCT
===================================================== */

function getProductById(
    productId
) {

    const products =
        getProducts();


    /*
     * Use String comparison so that
     * URL IDs such as "123" and stored
     * IDs such as 123 still work.
     */

    return products.find(
        product =>

            String(
                product.id
            ) ===
            String(
                productId
            )
    );

}


/* =====================================================
   UPDATE PRODUCT
===================================================== */

function updateProduct(
    productId,
    updatedData
) {

    const products =
        getProducts();


    const product =
        products.find(
            product =>

                String(
                    product.id
                ) ===
                String(
                    productId
                )
        );


    if (!product) {

        return false;

    }


    Object.assign(
        product,
        updatedData
    );


    /*
     * Keep numeric fields numeric.
     */

    if (
        updatedData.retailPrice !==
        undefined
    ) {

        product.retailPrice =
            Number(
                updatedData.retailPrice
            );

    }


    if (
        updatedData.wholesalePrice !==
        undefined
    ) {

        product.wholesalePrice =
            Number(
                updatedData.wholesalePrice
            );

    }


    if (
        updatedData.minimumWholesaleQuantity !==
        undefined
    ) {

        product.minimumWholesaleQuantity =
            Number(
                updatedData.minimumWholesaleQuantity
            );

    }


    if (
        updatedData.stock !==
        undefined
    ) {

        product.stock =
            Number(
                updatedData.stock
            );

    }


    saveProducts(
        products
    );


    return true;

}


/* =====================================================
   NORMALIZE PRODUCT
===================================================== */

/*
 * Makes older products compatible with
 * the new B2B system.
 */

function normalizeProduct(
    product
) {

    if (!product) {

        return null;

    }


    if (
        product.retailPrice ===
        undefined
    ) {

        product.retailPrice =
            Number(
                product.price ??
                0
            );

    }


    if (
        product.wholesalePrice ===
        undefined
    ) {

        product.wholesalePrice =
            Number(
                product.retailPrice
            );

    }


    if (
        product.minimumWholesaleQuantity ===
        undefined
    ) {

        product.minimumWholesaleQuantity =
            1;

    }


    if (
        product.stock ===
        undefined
    ) {

        product.stock =
            0;

    }


    return product;

}


/* =====================================================
   GET RETAIL PRICE
===================================================== */

function getRetailPrice(
    product
) {

    if (!product) {

        return 0;

    }


    return Number(
        product.retailPrice ??
        product.price ??
        0
    );

}


/* =====================================================
   GET WHOLESALE PRICE
===================================================== */

function getWholesalePrice(
    product
) {

    if (!product) {

        return 0;

    }


    const retailPrice =
        getRetailPrice(
            product
        );


    const wholesalePrice =
        Number(
            product.wholesalePrice
        );


    /*
     * If wholesale price is missing
     * or invalid, fall back to retail.
     */

    if (
        !Number.isFinite(
            wholesalePrice
        ) ||
        wholesalePrice <= 0
    ) {

        return retailPrice;

    }


    return wholesalePrice;

}


/* =====================================================
   CHECK BUSINESS VERIFICATION
===================================================== */

function isBusinessVerified(
    user
) {

    if (!user) {

        return false;

    }


    return (

        user.type ===
        "business" &&

        (
            user.verificationStatus ===
            "verified" ||

            user.businessVerified ===
            true
        )

    );

}


/* =====================================================
   GET PRODUCT PRICE FOR USER
===================================================== */

/*
 * Determines which price a user should see.
 *
 * Customer
 *      → Retail price
 *
 * Unverified Business
 *      → Retail price
 *
 * Verified Business
 *      → Wholesale price
 */

function getProductPriceForUser(
    product,
    user
) {

    if (!product) {

        return 0;

    }


    const retailPrice =
        getRetailPrice(
            product
        );


    if (
        isBusinessVerified(
            user
        )
    ) {

        return getWholesalePrice(
            product
        );

    }


    return retailPrice;

}


/* =====================================================
   GET PRODUCT PRICE TYPE
===================================================== */

function getProductPriceType(
    user
) {

    if (
        isBusinessVerified(
            user
        )
    ) {

        return "wholesale";

    }


    return "retail";

}


/* =====================================================
   GET MINIMUM WHOLESALE QUANTITY
===================================================== */

function getMinimumWholesaleQuantity(
    product
) {

    if (!product) {

        return 1;

    }


    const minimum =
        Number(
            product.minimumWholesaleQuantity
        );


    if (
        !Number.isFinite(
            minimum
        ) ||
        minimum < 1
    ) {

        return 1;

    }


    return Math.floor(
        minimum
    );

}


/* =====================================================
   CHECK BULK QUANTITY
===================================================== */

function isValidWholesaleQuantity(
    product,
    quantity
) {

    if (!product) {

        return false;

    }


    quantity =
        Number(
            quantity
        );


    const minimum =
        getMinimumWholesaleQuantity(
            product
        );


    return (

        Number.isInteger(
            quantity
        ) &&

        quantity >=
        minimum

    );

}


/* =====================================================
   GET WHOLESALE QUANTITY MESSAGE
===================================================== */

function getWholesaleQuantityMessage(
    product
) {

    const minimum =
        getMinimumWholesaleQuantity(
            product
        );


    if (
        minimum <= 1
    ) {

        return "";

    }


    return (
        "Minimum wholesale order: " +
        minimum +
        " units."
    );

}


/* =====================================================
   CALCULATE PRODUCT TOTAL
===================================================== */

function calculateProductTotal(
    product,
    quantity,
    user
) {

    if (!product) {

        return 0;

    }


    quantity =
        Number(
            quantity
        );


    if (
        !Number.isFinite(
            quantity
        ) ||
        quantity < 0
    ) {

        return 0;

    }


    const price =
        getProductPriceForUser(
            product,
            user
        );


    return (
        price *
        quantity
    );

}


/* =====================================================
   GET B2B SAVINGS
===================================================== */

function getWholesaleSavings(
    product
) {

    if (!product) {

        return 0;

    }


    const retail =
        getRetailPrice(
            product
        );


    const wholesale =
        getWholesalePrice(
            product
        );


    return Math.max(
        0,
        retail -
        wholesale
    );

}


/* =====================================================
   GET B2B SAVINGS PERCENTAGE
===================================================== */

function getWholesaleSavingsPercentage(
    product
) {

    if (!product) {

        return 0;

    }


    const retail =
        getRetailPrice(
            product
        );


    const wholesale =
        getWholesalePrice(
            product
        );


    if (
        retail <= 0
    ) {

        return 0;

    }


    const savings =
        (
            (retail - wholesale) /
            retail
        ) *
        100;


    return Number(
        Math.max(
            0,
            savings
        ).toFixed(1)
    );

}


/* =====================================================
   CHECK PRODUCT OWNER
===================================================== */

function isProductOwnedByBusiness(
    product,
    businessId
) {

    if (
        !product ||
        !businessId
    ) {

        return false;

    }


    return (
        String(
            product.businessId
        ) ===
        String(
            businessId
        )
    );

}


/* =====================================================
   GET BUSINESS PRODUCTS
===================================================== */

function getBusinessProducts(
    businessId
) {

    if (!businessId) {

        return [];

    }


    return getProducts().filter(
        product =>

            String(
                product.businessId
            ) ===
            String(
                businessId
            )
    );

}


/* =====================================================
   GET AVAILABLE PRODUCTS
===================================================== */

function isCustomerProduct(product) {

    if (!product) {

        return false;

    }


    return (

        product.sourceType ===
            "customer"

        ||

        product.isUsed ===
            true

        ||

        product.isCustomerProduct ===
            true

    );

}



/* =====================================================
   CHECK IF PRODUCT IS SOLD
===================================================== */

function isProductSold(product) {

    if (!product) {

        return false;

    }


    /*
     * Customer/C2C products are single-item listings.
     * Once purchased they are marked sold and must
     * disappear from the public marketplace.
     */

    if (
        isCustomerProduct(
            product
        )
    ) {

        return (

            product.sold ===
                true

            ||

            String(
                product.status ||
                ""
            ).toLowerCase() ===
                "sold"

            ||

            Number(
                product.stock
            ) <=
                0

        );

    }


    /*
     * Business products continue to use stock.
     */

    return Number(
        product.stock
    ) <= 0;

}



/* =====================================================
   GET AVAILABLE PRODUCTS
===================================================== */

function getAvailableProducts() {

    return getProducts().filter(
        product =>

            !isProductSold(
                product
            )

    );

}


/* =====================================================
   GET MARKETPLACE PRODUCTS
===================================================== */

/*
 * Returns only products that should be visible
 * in the public marketplace.
 *
 * Sold C2C products remain in localStorage so
 * seller history and order history continue to work,
 * but they are excluded from marketplace results.
 */

function getMarketplaceProducts() {

    return getProducts().filter(
        product =>

            !isProductSold(
                product
            )

    );

}


/* =====================================================
   GET PRODUCT MARKETPLACE BADGE
===================================================== */

function getProductMarketplaceBadge(
    product
) {

    if (
        isCustomerProduct(
            product
        )
    ) {

        return "♻️ PRE-OWNED • CUSTOMER";

    }


    return "";

}



/* =====================================================
   MARKETPLACE TYPE HELPERS
===================================================== */

/*
 * TradeHub supports three marketplace views:
 *
 * B2C
 * Business → Customer
 *
 * B2B
 * Business → Business
 *
 * C2C
 * Customer → Customer
 *
 * Products themselves do not need a separate "market"
 * field. We determine the marketplace from the product
 * owner and the product's B2B pricing information.
 */


/* =====================================================
   GET PRODUCT MARKET TYPE
===================================================== */

function getProductMarketplaceType(product) {

    if (!product) {
        return "";
    }


    /* Customer-listed / pre-owned product = C2C */

    if (
        isCustomerProduct(product)
    ) {

        return "c2c";

    }


    /* Business-listed product */

    if (
        product.businessId
    ) {

        return "business";

    }


    return "";

}


/* =====================================================
   GET PRODUCTS FOR MARKETPLACE
===================================================== */

function getProductsForMarketplace(
    market
) {

    const normalizedMarket =
        String(
            market || ""
        )
        .trim()
        .toLowerCase();


    /*
     * Always start with products that are actually
     * available in the public marketplace.
     */

    const products =
        getMarketplaceProducts();


    /* -------------------------------------------------
       ALL PRODUCTS
    ------------------------------------------------- */

    if (
        !normalizedMarket ||
        normalizedMarket === "all" ||
        normalizedMarket === "products"
    ) {

        return products;

    }


    /* -------------------------------------------------
       C2C
       Customer → Customer
    ------------------------------------------------- */

    if (
        normalizedMarket === "c2c"
    ) {

        return products.filter(
            product =>
                getProductMarketplaceType(
                    product
                ) === "c2c"
        );

    }


    /*
     * B2C and B2B both use business-listed products.
     * The difference is the buying context:
     *
     * B2C → normal retail shopping
     * B2B → wholesale/business shopping
     */

    const businessProducts =
        products.filter(
            product =>
                getProductMarketplaceType(
                    product
                ) === "business"
        );


    /* -------------------------------------------------
       B2C
       Business → Customer
    ------------------------------------------------- */

    if (
        normalizedMarket === "b2c"
    ) {

        return businessProducts;

    }


    /* -------------------------------------------------
       B2B
       Business → Business
    ------------------------------------------------- */

    if (
        normalizedMarket === "b2b"
    ) {

        return businessProducts.filter(
            product => {

                const retail =
                    getRetailPrice(
                        product
                    );

                const wholesale =
                    getWholesalePrice(
                        product
                    );

                const minimumQuantity =
                    getMinimumWholesaleQuantity(
                        product
                    );


                /*
                 * A product is considered useful for
                 * B2B when it has wholesale pricing
                 * or a bulk minimum quantity.
                 */

                return (
                    wholesale > 0 &&
                    (
                        wholesale < retail ||
                        minimumQuantity > 1
                    )
                );

            }
        );

    }


    /* -------------------------------------------------
       UNKNOWN MARKET
    ------------------------------------------------- */

    return products;

}


/* =====================================================
   CHECK MARKETPLACE TYPE
===================================================== */

function isProductMarketplaceType(
    product,
    market
) {

    const normalizedMarket =
        String(
            market || ""
        )
        .trim()
        .toLowerCase();


    if (
        normalizedMarket === "c2c"
    ) {

        return (
            getProductMarketplaceType(
                product
            ) === "c2c"
        );

    }


    if (
        normalizedMarket === "b2c" ||
        normalizedMarket === "b2b"
    ) {

        return (
            getProductMarketplaceType(
                product
            ) === "business"
        );

    }


    return true;

}


/* =====================================================
   GET LOW STOCK PRODUCTS
===================================================== */

function getLowStockProducts(
    threshold = 10
) {

    threshold =
        Number(
            threshold
        );


    if (
        !Number.isFinite(
            threshold
        )
    ) {

        threshold = 10;

    }


    return getProducts().filter(
        product =>

            Number(
                product.stock
            ) <=
            threshold
    );

}


/* =====================================================
   WISHLIST
===================================================== */


/* =====================================================
   GET WISHLIST
===================================================== */

function getWishlist() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_wishlist"
        )
    ) || [];

}


/* =====================================================
   SAVE WISHLIST
===================================================== */

function saveWishlist(
    wishlist
) {

    localStorage.setItem(
        "tradehub_wishlist",
        JSON.stringify(
            wishlist
        )
    );

}


/* =====================================================
   TOGGLE WISHLIST
===================================================== */

function toggleWishlist(
    productId
) {

    let wishlist =
        getWishlist();


    const exists =
        wishlist.includes(
            productId
        );


    if (exists) {

        wishlist =
            wishlist.filter(
                id =>
                    id !==
                    productId
            );


        alert(
            "Removed from wishlist."
        );

    }

    else {

        wishlist.push(
            productId
        );


        alert(
            "Added to wishlist ❤️"
        );

    }


    saveWishlist(
        wishlist
    );

}


/* =====================================================
   CHECK WISHLIST
===================================================== */

function isInWishlist(
    productId
) {

    return getWishlist().includes(
        productId
    );

}

/* =====================================================
   BUSINESS VERIFICATION CHECK
===================================================== */

function isBusinessVerified(user) {


    if (!user) {

        return false;

    }


    return (

        user.type === "business" &&

        (
            user.verificationStatus === "verified"

            ||

            user.verified === true
        )

    );

}