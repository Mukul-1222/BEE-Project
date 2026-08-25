/* =====================================================
   TRADEHUB ORDER SYSTEM
===================================================== */


/* =====================================================
   GET ORDERS
===================================================== */

function getOrders() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_orders"
        )
    ) || [];

}


/* =====================================================
   SAVE ORDERS
===================================================== */

function saveOrders(orders) {

    localStorage.setItem(
        "tradehub_orders",
        JSON.stringify(
            orders
        )
    );

}


/* =====================================================
   CREATE ORDER
===================================================== */

function createOrder(order) {

    const orders =
        getOrders();


    orders.push(
        order
    );


    saveOrders(
        orders
    );


    return order;

}


/* =====================================================
   GET ORDER
===================================================== */

function getOrderById(orderId) {

    const orders =
        getOrders();


    return orders.find(
        order =>
            String(
                order.id
            ) ===
            String(
                orderId
            )
    );

}


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

function updateOrderStatus(
    orderId,
    newStatus
) {

    const orders =
        getOrders();


    const order =
        orders.find(
            order =>
                String(order.id) ===
                String(orderId)
        );


    if (!order) {

        return false;

    }


    order.status =
        newStatus;


    order.updatedAt =
        new Date().toISOString();


    saveOrders(
        orders
    );


    return true;

}


/* =====================================================
   C2C SELLER STATUS UPDATE
===================================================== */

/*
 * Only the customer who originally listed the C2C
 * product can change the status of that sale.
 *
 * This prevents another account from changing an
 * unrelated order by knowing its order ID.
 */

function canCustomerUpdateSaleStatus(
    customerId,
    orderId
) {

    const order =
        getOrderById(
            orderId
        );


    if (
        !order ||
        !Array.isArray(
            order.items
        )
    ) {

        return false;

    }


    return order.items.some(
        function(item) {

            const isCustomerListing = (

                item.sourceType ===
                    "customer"

                ||

                item.isUsed ===
                    true

                ||

                item.isCustomerProduct ===
                    true

            );


            return (

                isCustomerListing

                &&

                String(
                    item.sellerId
                ) ===
                String(
                    customerId
                )

            );

        }
    );

}


/* =====================================================
   UPDATE C2C SALE STATUS
===================================================== */

function updateCustomerSaleStatus(
    customerId,
    orderId,
    newStatus
) {

    const allowedStatuses = [
        "confirmed",
        "packed",
        "shipped",
        "out for delivery",
        "delivered"
    ];


    const normalizedStatus =
        String(
            newStatus ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        !allowedStatuses.includes(
            normalizedStatus
        )
    ) {

        return false;

    }


    if (
        !canCustomerUpdateSaleStatus(
            customerId,
            orderId
        )
    ) {

        return false;

    }


    const orders =
        getOrders();


    const order =
        orders.find(
            function(item) {

                return (
                    String(
                        item.id
                    ) ===
                    String(
                        orderId
                    )
                );

            }
        );


    if (!order) {

        return false;

    }


    order.status =
        normalizedStatus;


    order.updatedAt =
        new Date().toISOString();


    /*
     * Keep a lightweight status history so the buyer
     * can see when the seller changed the order state.
     */

    if (
        !Array.isArray(
            order.statusHistory
        )
    ) {

        order.statusHistory =
            [];

    }


    order.statusHistory.push({

        status:
            normalizedStatus,

        updatedAt:
            order.updatedAt,

        updatedBy:
            customerId

    });


    saveOrders(
        orders
    );


    return true;

}


/* =====================================================
   GET C2C STATUS HISTORY
===================================================== */

function getOrderStatusHistory(
    order
) {

    if (
        !order ||
        !Array.isArray(
            order.statusHistory
        )
    ) {

        return [];

    }


    return [
        ...order.statusHistory
    ];

}


/* =====================================================
   CUSTOMER ORDERS
===================================================== */

function getCustomerOrders(
    customerId
) {

    return getOrders().filter(
        order =>
            String(
                order.customerId
            ) ===
            String(
                customerId
            )
    );

}


/* =====================================================
   BUSINESS ORDERS
===================================================== */

function getBusinessOrders(
    businessId
) {

    return getOrders().filter(
        order =>

            Array.isArray(
                order.items
            ) &&

            order.items.some(
                item =>
                    String(
                        item.businessId
                    ) ===
                    String(
                        businessId
                    )
            )

    );

}


/* =====================================================
   DECREASE INVENTORY
===================================================== */

function decreaseInventory(
    orderItems
) {

    const products =
        getProducts();


    orderItems.forEach(
        function(orderItem) {

            const product =
                products.find(
                    function(item) {

                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                orderItem.productId
                            )
                        );

                    }
                );


            if (!product) {

                return;

            }


            /*
             * C2C products represent one physical item.
             * The checkout sale workflow already records the
             * product as sold, so do not run a second generic
             * stock calculation here.
             */

            const isCustomerListing = (

                product.sourceType ===
                    "customer"

                ||

                product.isUsed ===
                    true

                ||

                product.isCustomerProduct ===
                    true

            );


            if (
                isCustomerListing
            ) {

                product.stock =
                    0;


                product.status =
                    "sold";


                product.sold =
                    true;


                return;

            }


            /*
             * Business inventory continues to work
             * exactly as a normal stock calculation.
             */

            product.stock =
                Math.max(
                    0,
                    Number(
                        product.stock
                    ) -
                    Number(
                        orderItem.quantity
                    )
                );

        }
    );


    saveProducts(
        products
    );

}



/* =====================================================
   RESTORE INVENTORY
===================================================== */

function restoreInventory(
    orderItems
) {

    const products =
        getProducts();


    orderItems.forEach(
        function(orderItem) {

            const product =
                products.find(
                    function(item) {

                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                orderItem.productId
                            )
                        );

                    }
                );


            if (!product) {

                return;

            }


            const isCustomerListing = (

                product.sourceType ===
                    "customer"

                ||

                product.isUsed ===
                    true

                ||

                product.isCustomerProduct ===
                    true

            );


            /*
             * A C2C listing is one physical item.
             * Restore it only when an order is explicitly
             * cancelled/refunded in a future workflow.
             */

            if (
                isCustomerListing
            ) {

                product.stock =
                    1;


                product.status =
                    "active";


                product.sold =
                    false;


                delete product.soldAt;
                delete product.buyerId;
                delete product.buyerName;
                delete product.buyerType;
                delete product.buyerPhone;
                delete product.buyerAddress;
                delete product.buyerCity;
                delete product.buyerPin;
                delete product.orderId;


                product.updatedAt =
                    new Date().toISOString();


                return;

            }


            product.stock =
                Number(
                    product.stock
                ) +
                Number(
                    orderItem.quantity
                );

        }
    );


    saveProducts(
        products
    );

}



/* =====================================================
   C2C SALES
===================================================== */

/*
 * Returns every order in which a customer was the
 * seller of at least one customer-listed product.
 */

function getCustomerSales(
    customerId
) {

    return getOrders().filter(
        function(order) {

            if (
                !Array.isArray(
                    order.items
                )
            ) {

                return false;

            }


            return order.items.some(
                function(item) {

                    return (

                        (
                            item.sourceType ===
                                "customer"

                            ||

                            item.isUsed ===
                                true

                            ||

                            item.isCustomerProduct ===
                                true

                        )

                        &&

                        String(
                            item.sellerId
                        ) ===
                        String(
                            customerId
                        )

                    );

                }
            );

        }
    );

}



/* =====================================================
   C2C SALES FOR ONE PRODUCT
===================================================== */

function getCustomerProductSales(
    customerId,
    productId
) {

    return getCustomerSales(
        customerId
    ).filter(
        function(order) {

            return order.items.some(
                function(item) {

                    return (

                        String(
                            item.productId
                        ) ===
                        String(
                            productId
                        )

                    );

                }
            );

        }
    );

}



/* =====================================================
   GET ONE SALE FOR A PRODUCT
===================================================== */

function getSoldProductOrder(
    customerId,
    productId
) {

    const sales =
        getCustomerProductSales(
            customerId,
            productId
        );


    if (
        sales.length ===
        0
    ) {

        return null;

    }


    /*
     * Most recent matching sale.
     */

    return [...sales].sort(
        function(a, b) {

            return (
                new Date(
                    b.createdAt || 0
                ) -

                new Date(
                    a.createdAt || 0
                )
            );

        }
    )[0];

}



/* =====================================================
   GET BUYER DETAILS FOR SALE
===================================================== */

function getBuyerDetailsForSale(
    customerId,
    productId
) {

    const order =
        getSoldProductOrder(
            customerId,
            productId
        );


    if (!order) {

        return null;

    }


    return {

        buyerId:
            order.customerId ||
            null,

        buyerName:
            order.customerName ||
            "Customer",

        buyerType:
            order.customerType ||
            "customer",

        phone:
            order.delivery
            ?
            order.delivery.phone ||
            ""
            :
            "",

        address:
            order.delivery
            ?
            order.delivery.address ||
            ""
            :
            "",

        city:
            order.delivery
            ?
            order.delivery.city ||
            ""
            :
            "",

        pin:
            order.delivery
            ?
            order.delivery.pin ||
            ""
            :
            "",

        orderId:
            order.id ||
            "",

        orderStatus:
            order.status ||
            "",

        paymentStatus:
            order.paymentStatus ||
            "",

        createdAt:
            order.createdAt ||
            null

    };

}



/* =====================================================
   CHECK CUSTOMER SOLD PRODUCT
===================================================== */

function hasCustomerSoldProduct(
    customerId,
    productId
) {

    return (
        getCustomerProductSales(
            customerId,
            productId
        ).length > 0
    );

}



/* =====================================================
   GET PRODUCTS SOLD BY CUSTOMER
===================================================== */

function getCustomerSoldProducts(
    customerId
) {

    const sales =
        getCustomerSales(
            customerId
        );


    const productIds =
        [];


    sales.forEach(
        function(order) {

            if (
                !Array.isArray(
                    order.items
                )
            ) {

                return;

            }


            order.items.forEach(
                function(item) {

                    const isCustomerListing = (

                        item.sourceType ===
                            "customer"

                        ||

                        item.isUsed ===
                            true

                        ||

                        item.isCustomerProduct ===
                            true

                    );


                    if (
                        !isCustomerListing
                    ) {

                        return;

                    }


                    if (
                        String(
                            item.sellerId
                        ) !==
                        String(
                            customerId
                        )
                    ) {

                        return;

                    }


                    if (
                        !productIds.some(
                            function(id) {

                                return (
                                    String(id) ===
                                    String(
                                        item.productId
                                    )
                                );

                            }
                        )
                    ) {

                        productIds.push(
                            item.productId
                        );

                    }

                }
            );

        }
    );


    return productIds;

}



/* =====================================================
   CHECK IF ORDER IS DELIVERED
===================================================== */

/*
    We currently use the order.status field
    to determine whether the order has been
    completed.

    Supported delivered statuses:

        delivered
        completed

    Case-insensitive.
*/

function isOrderDelivered(
    order
) {

    if (!order) {

        return false;

    }


    const status =
        String(
            order.status || ""
        )
        .trim()
        .toLowerCase();


    return (
        status === "delivered" ||
        status === "completed"
    );

}


/* =====================================================
   FIND PURCHASES OF A PRODUCT
===================================================== */

/*
    Returns all orders where the specified
    customer purchased the specified product.
*/

function getCustomerProductOrders(
    customerId,
    productId
) {

    return getOrders().filter(
        order => {


            /* =========================================
               CUSTOMER CHECK
            ========================================== */

            if (
                String(
                    order.customerId
                ) !==
                String(
                    customerId
                )
            ) {

                return false;

            }


            /* =========================================
               ITEMS CHECK
            ========================================== */

            if (
                !Array.isArray(
                    order.items
                )
            ) {

                return false;

            }


            return order.items.some(
                item =>

                    Number(
                        item.productId
                    ) ===
                    Number(productId)

            );

        }
    );

}


/* =====================================================
   CHECK CUSTOMER PURCHASED PRODUCT
===================================================== */

function hasCustomerPurchasedProduct(
    customerId,
    productId
) {

    const orders =
        getCustomerProductOrders(
            customerId,
            productId
        );


    return orders.length > 0;

}


/* =====================================================
   CHECK CUSTOMER RECEIVED PRODUCT
===================================================== */

/*
    A customer is considered to have received
    a product if at least one order containing
    that product has been delivered/completed.
*/

function hasCustomerReceivedProduct(
    customerId,
    productId
) {

    const orders =
        getCustomerProductOrders(
            customerId,
            productId
        );


    return orders.some(
        order =>
            isOrderDelivered(
                order
            )
    );

}


/* =====================================================
   GET DELIVERED PRODUCT ORDERS
===================================================== */

function getDeliveredProductOrders(
    customerId,
    productId
) {

    return getCustomerProductOrders(
        customerId,
        productId
    ).filter(
        order =>
            isOrderDelivered(
                order
            )
    );

}


/* =====================================================
   GET PURCHASE QUANTITY
===================================================== */

/*
    Calculates the total quantity of a product
    purchased by a customer across all orders.
*/

function getCustomerPurchasedQuantity(
    customerId,
    productId
) {

    const orders =
        getCustomerProductOrders(
            customerId,
            productId
        );


    let quantity = 0;


    orders.forEach(
        order => {


            if (
                !Array.isArray(
                    order.items
                )
            ) {

                return;

            }


            order.items.forEach(
                item => {


                    if (
                        Number(
                            item.productId
                        ) ===
                        Number(productId)
                    ) {

                        quantity +=
                            Number(
                                item.quantity
                            ) || 0;

                    }

                }
            );

        }
    );


    return quantity;

}


/* =====================================================
   GET SELLER DETAILS FOR PURCHASE
===================================================== */

/*
 * Returns seller information stored on a purchased
 * customer-to-customer order item.
 */

function getSellerDetailsForPurchase(
    customerId,
    productId
) {

    const orders =
        getCustomerProductOrders(
            customerId,
            productId
        );


    if (
        orders.length ===
        0
    ) {

        return null;

    }


    const sortedOrders =
        [...orders].sort(
            function(a, b) {

                return (
                    new Date(
                        b.createdAt || 0
                    ) -

                    new Date(
                        a.createdAt || 0
                    )
                );

            }
        );


    for (
        const order of
        sortedOrders
    ) {

        if (
            !Array.isArray(
                order.items
            )
        ) {

            continue;

        }


        const item =
            order.items.find(
                function(orderItem) {

                    return (
                        String(
                            orderItem.productId
                        ) ===
                        String(
                            productId
                        )

                        &&

                        (
                            orderItem.sourceType ===
                                "customer"

                            ||

                            orderItem.isUsed ===
                                true

                            ||

                            orderItem.isCustomerProduct ===
                                true

                        )
                    );

                }
            );


        if (
            !item
        ) {

            continue;

        }


        return {

            sellerId:
                item.sellerId ||
                null,

            sellerName:
                item.sellerName ||
                "Customer",

            orderId:
                order.id ||
                "",

            orderStatus:
                order.status ||
                "",

            paymentStatus:
                order.paymentStatus ||
                "",

            createdAt:
                order.createdAt ||
                null

        };

    }


    return null;

}



/* =====================================================
   REVIEW ELIGIBILITY
===================================================== */

/*
    A customer can review a product only when:

        1. They are a customer.
        2. They purchased the product.
        3. The order containing the product
           has been delivered/completed.

    Duplicate-review checking remains inside
    reviews.js.
*/

function canCustomerReviewProduct(
    customerId,
    productId
) {


    if (
        !customerId ||
        productId === undefined ||
        productId === null
    ) {

        return false;

    }


    return hasCustomerReceivedProduct(
        customerId,
        productId
    );

}


/* =====================================================
   GET REVIEW ELIGIBILITY DETAILS
===================================================== */

/*
    Useful when the UI needs to tell the customer
    WHY they cannot review a product.
*/

function getReviewEligibility(
    customerId,
    productId
) {


    if (!customerId) {

        return {

            eligible: false,

            reason:
                "login"

        };

    }


    const purchased =
        hasCustomerPurchasedProduct(
            customerId,
            productId
        );


    if (!purchased) {

        return {

            eligible: false,

            reason:
                "not-purchased"

        };

    }


    const received =
        hasCustomerReceivedProduct(
            customerId,
            productId
        );


    if (!received) {

        return {

            eligible: false,

            reason:
                "not-delivered"

        };

    }


    return {

        eligible: true,

        reason:
            "eligible"

    };

}