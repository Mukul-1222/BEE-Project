/* =====================================================
   TRADEHUB WISHLIST SYSTEM
   User-specific wishlist
   Works for CUSTOMER + BUSINESS accounts
===================================================== */


/* =====================================================
   GET CURRENT USER
===================================================== */

function getWishlistUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "tradehub_current_user"
            )
        );

    }
    catch (error) {

        console.error(
            "Unable to read current TradeHub user:",
            error
        );

        return null;

    }

}


/* =====================================================
   NORMALIZE PRODUCT ID
===================================================== */

function normalizeWishlistId(
    productId
) {

    return String(
        productId ?? ""
    ).trim();

}


/* =====================================================
   GET WISHLIST STORAGE KEY
===================================================== */

function getWishlistKey() {

    const user =
        getWishlistUser();


    if (
        !user ||
        user.id === undefined ||
        user.id === null
    ) {

        return null;

    }


    /*
     * Keep customer and business wishlists
     * completely separate.
     *
     * Example:
     *
     * tradehub_wishlist_customer_123
     * tradehub_wishlist_business_456
     */

    return (
        "tradehub_wishlist_" +
        String(
            user.type || "user"
        ) +
        "_" +
        String(
            user.id
        )
    );

}


/* =====================================================
   GET WISHLIST
===================================================== */

function getWishlist() {

    const key =
        getWishlistKey();


    if (!key) {

        return [];

    }


    try {

        const stored =
            localStorage.getItem(
                key
            );


        if (!stored) {

            /*
             * Check the old wishlist key format
             * so existing saved products are not lost.
             */

            const user =
                getWishlistUser();


            if (
                user &&
                user.id !== undefined
            ) {

                const oldKey =
                    "tradehub_wishlist_" +
                    String(
                        user.id
                    );


                const oldWishlist =
                    localStorage.getItem(
                        oldKey
                    );


                if (oldWishlist) {

                    try {

                        const parsedOldWishlist =
                            JSON.parse(
                                oldWishlist
                            );


                        if (
                            Array.isArray(
                                parsedOldWishlist
                            )
                        ) {

                            localStorage.setItem(
                                key,
                                JSON.stringify(
                                    parsedOldWishlist
                                )
                            );


                            localStorage.removeItem(
                                oldKey
                            );


                            return parsedOldWishlist;

                        }

                    }
                    catch (error) {

                        console.error(
                            "Unable to migrate old wishlist:",
                            error
                        );

                    }

                }

            }


            return [];

        }


        const wishlist =
            JSON.parse(
                stored
            );


        if (
            !Array.isArray(
                wishlist
            )
        ) {

            return [];

        }


        return wishlist.map(
            id =>
                normalizeWishlistId(
                    id
                )
        );


    }
    catch (error) {

        console.error(
            "Unable to read TradeHub wishlist:",
            error
        );


        return [];

    }

}


/* =====================================================
   SAVE WISHLIST
===================================================== */

function saveWishlist(
    wishlist
) {

    const key =
        getWishlistKey();


    if (!key) {

        return false;

    }


    try {

        const normalizedWishlist =
            wishlist
                .map(
                    id =>
                        normalizeWishlistId(
                            id
                        )
                )
                .filter(
                    id =>
                        id !== ""
                );


        localStorage.setItem(
            key,
            JSON.stringify(
                normalizedWishlist
            )
        );


        return true;

    }
    catch (error) {

        console.error(
            "Unable to save TradeHub wishlist:",
            error
        );


        return false;

    }

}


/* =====================================================
   CHECK IF PRODUCT IS WISHLISTED
===================================================== */

function isWishlisted(
    productId
) {

    const normalizedId =
        normalizeWishlistId(
            productId
        );


    if (!normalizedId) {

        return false;

    }


    const wishlist =
        getWishlist();


    return wishlist.some(
        id =>

            normalizeWishlistId(
                id
            ) ===

            normalizedId
    );

}


/* =====================================================
   TOGGLE WISHLIST
===================================================== */

function toggleWishlist(
    productId
) {

    const user =
        getWishlistUser();


    /*
     * Wishlist requires login.
     */

    if (!user) {

        alert(
            "Please login to use your wishlist."
        );


        localStorage.setItem(
            "tradehub_return_url",
            window.location.href
        );


        window.location.href =
            "login.html";


        return false;

    }


    const normalizedId =
        normalizeWishlistId(
            productId
        );


    if (!normalizedId) {

        console.error(
            "Wishlist error: missing product ID."
        );


        return false;

    }


    let wishlist =
        getWishlist();


    const index =
        wishlist.findIndex(
            id =>

                normalizeWishlistId(
                    id
                ) ===

                normalizedId
        );


    /*
     * ADD
     */

    if (
        index === -1
    ) {

        wishlist.push(
            normalizedId
        );

    }


    /*
     * REMOVE
     */

    else {

        wishlist.splice(
            index,
            1
        );

    }


    const saved =
        saveWishlist(
            wishlist
        );


    if (!saved) {

        return false;

    }


    updateWishlistButtons();


    /*
     * Refresh wishlist page immediately
     * if displayWishlist() exists.
     */

    if (
        typeof displayWishlist ===
        "function"
    ) {

        displayWishlist();

    }


    return true;

}


/* =====================================================
   UPDATE ALL WISHLIST BUTTONS
===================================================== */

function updateWishlistButtons() {

    const buttons =
        document.querySelectorAll(
            ".wishlist-btn, .product-wishlist"
        );


    buttons.forEach(
        button => {

            const productId =
                normalizeWishlistId(
                    button.dataset.id
                );


            if (
                !productId
            ) {

                return;

            }


            if (
                isWishlisted(
                    productId
                )
            ) {

                /*
                 * Wishlist page buttons
                 * should show a remove action.
                 */

                if (
                    button.classList.contains(
                        "product-wishlist"
                    )
                ) {

                    button.innerHTML =
                        "♥ Remove from Wishlist";

                }

                else {

                    button.innerHTML =
                        "♥ Remove from Wishlist";

                }


                button.classList.add(
                    "wishlisted"
                );


                button.setAttribute(
                    "aria-label",
                    "Remove from wishlist"
                );


                button.setAttribute(
                    "title",
                    "Remove from wishlist"
                );

            }


            else {

                button.innerHTML =
                    "♡ Add to Wishlist";


                button.classList.remove(
                    "wishlisted"
                );


                button.setAttribute(
                    "aria-label",
                    "Add to wishlist"
                );


                button.setAttribute(
                    "title",
                    "Add to wishlist"
                );

            }

        }
    );

}


/* =====================================================
   REMOVE FROM WISHLIST
===================================================== */

function removeFromWishlist(
    productId
) {

    const normalizedId =
        normalizeWishlistId(
            productId
        );


    if (!normalizedId) {

        return false;

    }


    let wishlist =
        getWishlist();


    const originalLength =
        wishlist.length;


    wishlist =
        wishlist.filter(
            id =>

                normalizeWishlistId(
                    id
                ) !==

                normalizedId
        );


    if (
        wishlist.length ===
        originalLength
    ) {

        return false;

    }


    const saved =
        saveWishlist(
            wishlist
        );


    if (!saved) {

        return false;

    }


    updateWishlistButtons();


    /*
     * If this is the wishlist page,
     * refresh the product cards immediately.
     */

    if (
        typeof displayWishlist ===
        "function"
    ) {

        displayWishlist();

    }


    return true;

}


/* =====================================================
   ADD WISHLIST PRODUCT TO CART
===================================================== */

function addWishlistProductToCart(
    productId
) {

    const user =
        getWishlistUser();


    /*
     * Check login.
     */

    if (!user) {

        alert(
            "Please login before adding products to your cart."
        );


        localStorage.setItem(
            "tradehub_return_url",
            window.location.href
        );


        window.location.href =
            "login.html";


        return false;

    }


    const normalizedId =
        normalizeWishlistId(
            productId
        );


    if (!normalizedId) {

        alert(
            "Unable to identify this product."
        );


        return false;

    }


    /*
     * Get the COMPLETE product object.
     *
     * cart.js expects:
     *
     * addToCart(product, quantity, price)
     */

    if (
        typeof getProductById !==
        "function"
    ) {

        console.error(
            "getProductById() is not available."
        );


        alert(
            "Unable to load product information."
        );


        return false;

    }


    const product =
        getProductById(
            normalizedId
        );


    if (!product) {

        alert(
            "This product is no longer available."
        );


        /*
         * Remove stale product from wishlist.
         */

        removeFromWishlist(
            normalizedId
        );


        return false;

    }


    /*
     * Make sure cart.js is loaded.
     */

    if (
        typeof addToCart !==
        "function"
    ) {

        console.error(
            "addToCart() is not available."
        );


        alert(
            "Cart system is unavailable."
        );


        return false;

    }


    /*
     * Add the actual product object.
     */

    const added =
        addToCart(
            product,
            1
        );


    /*
     * Update cart count immediately.
     */

    if (
        typeof updateCartCount ===
        "function"
    ) {

        updateCartCount();

    }


    return added !== false;

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateWishlistButtons();

    }
);


/* =====================================================
   SYNC BETWEEN TABS
===================================================== */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key &&
            event.key.startsWith(
                "tradehub_wishlist_"
            )
        ) {

            updateWishlistButtons();


            if (
                typeof displayWishlist ===
                "function"
            ) {

                displayWishlist();

            }

        }

    }
);