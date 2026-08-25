/* =====================================================
   TRADEHUB MESSAGING SYSTEM
===================================================== */


/* =====================================================
   GET ALL CONVERSATIONS
===================================================== */

function getConversations() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_conversations"
        )
    ) || [];

}


/* =====================================================
   SAVE CONVERSATIONS
===================================================== */

function saveConversations(
    conversations
) {

    localStorage.setItem(
        "tradehub_conversations",
        JSON.stringify(
            conversations
        )
    );

}


/* =====================================================
   CREATE CONVERSATION
===================================================== */

/*
    Customer → Business:
        Created from a product.

    Business → Customer:
        Can only happen if a conversation
        already exists.

    Business → Business:
        Can create a direct conversation
        if we explicitly provide the target
        business.

    IMPORTANT:
        Nobody can create a conversation
        with themselves.
*/

function createConversation(
    customer,
    business,
    product
) {


    /* =============================================
       BASIC VALIDATION
    ============================================== */

    if (
        !customer ||
        !business
    ) {

        return null;

    }


    if (
        !customer.id ||
        !business.id
    ) {

        return null;

    }


    /* =============================================
       PREVENT SELF-MESSAGING
    ============================================== */

    if (
        customer.id ===
        business.id
    ) {

        console.warn(
            "TradeHub: A user cannot message themselves."
        );

        return null;

    }


    /* =============================================
       PRODUCT VALIDATION
    ============================================== */

    if (!product) {

        return null;

    }


    /*
     * The product MUST belong to
     * the business we're contacting.
     */

    if (
        product.businessId !==
        business.id
    ) {

        console.warn(
            "TradeHub: Product does not belong to this business."
        );

        return null;

    }


    /* =============================================
       GET CONVERSATIONS
    ============================================== */

    const conversations =
        getConversations();


    /* =============================================
       CHECK EXISTING CONVERSATION
    ============================================== */

    const existing =
        conversations.find(
            conversation =>

                conversation.customerId ===
                    customer.id &&

                conversation.businessId ===
                    business.id &&

                conversation.productId ===
                    product.id

        );


    if (existing) {

        return existing;

    }


    /* =============================================
       CREATE NEW CONVERSATION
    ============================================== */

    const conversation = {

        id:
            "CONV-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        customerId:
            customer.id,


        customerName:
            customer.name,


        businessId:
            business.id,


        businessName:
            business.businessName ||
            business.name,


        productId:
            product.id,


        productName:
            product.name,


        productImage:
            product.image || "",


        createdAt:
            new Date().toISOString(),


        updatedAt:
            new Date().toISOString(),


        messages: []

    };


    conversations.push(
        conversation
    );


    saveConversations(
        conversations
    );


    return conversation;

}


/* =====================================================
   CREATE CUSTOMER → CUSTOMER CONVERSATION
===================================================== */

/*
    Customer-to-customer conversations are used for
    C2C / pre-owned product listings.

    sellerCustomer = customer who owns the listing
    buyerCustomer  = customer who wants to contact seller
*/

function createCustomerConversation(
    sellerCustomer,
    buyerCustomer,
    product
) {


    /* =============================================
       VALIDATION
    ============================================== */

    if (
        !sellerCustomer ||
        !buyerCustomer ||
        !product
    ) {

        return null;

    }


    if (
        !sellerCustomer.id ||
        !buyerCustomer.id
    ) {

        return null;

    }


    if (
        sellerCustomer.type !==
            "customer" ||
        buyerCustomer.type !==
            "customer"
    ) {

        return null;

    }


    /* =============================================
       PREVENT SELF-MESSAGING
    ============================================== */

    if (
        String(sellerCustomer.id) ===
        String(buyerCustomer.id)
    ) {

        console.warn(
            "TradeHub: A customer cannot message themselves."
        );

        return null;

    }


    /* =============================================
       PRODUCT VALIDATION
    ============================================== */

    if (
        !product.id ||
        product.isUsed !== true ||
        product.sourceType !== "customer"
    ) {

        console.warn(
            "TradeHub: Customer-to-customer messaging requires a customer-listed used product."
        );

        return null;

    }


    if (
        !product.sellerId
    ) {

        return null;

    }


    if (
        String(product.sellerId) !==
        String(sellerCustomer.id)
    ) {

        console.warn(
            "TradeHub: Product does not belong to the customer seller."
        );

        return null;

    }


    const conversations =
        getConversations();


    /* =============================================
       CHECK EXISTING CONVERSATION
    ============================================== */

    const existing =
        conversations.find(
            conversation =>

                conversation.type ===
                    "customer-customer" &&

                String(
                    conversation.sellerCustomerId
                ) ===
                    String(
                        sellerCustomer.id
                    ) &&

                String(
                    conversation.buyerCustomerId
                ) ===
                    String(
                        buyerCustomer.id
                    ) &&

                String(
                    conversation.productId
                ) ===
                    String(
                        product.id
                    )
        );


    if (existing) {

        return existing;

    }


    /* =============================================
       CREATE CONVERSATION
    ============================================== */

    const conversation = {

        id:
            "CONV-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        type:
            "customer-customer",


        /* Legacy customer/business fields remain
           available for compatibility. */

        customerId:
            buyerCustomer.id,

        customerName:
            buyerCustomer.name,


        businessId:
            null,

        businessName:
            null,


        /* C2C participants */

        sellerCustomerId:
            sellerCustomer.id,

        sellerCustomerName:
            sellerCustomer.name,


        buyerCustomerId:
            buyerCustomer.id,

        buyerCustomerName:
            buyerCustomer.name,


        productId:
            product.id,

        productName:
            product.name,

        productImage:
            product.image || "",


        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        messages: []

    };


    conversations.push(
        conversation
    );


    saveConversations(
        conversations
    );


    return conversation;

}


/* =====================================================
   CREATE CUSTOMER → CUSTOMER CONVERSATION
===================================================== */

/*
    Used for Customer-to-Customer marketplace
    conversations.

    Example:

        Customer A
        Seller
            ↕
        Customer B
        Buyer

    The conversation is tied to the used product.
*/

function createCustomerConversation(
    seller,
    buyer,
    product
) {

    /* =============================================
       BASIC VALIDATION
    ============================================== */

    if (
        !seller ||
        !buyer ||
        !product
    ) {

        return null;

    }


    if (
        !seller.id ||
        !buyer.id ||
        !product.id
    ) {

        return null;

    }


    if (
        seller.type !==
            "customer" ||
        buyer.type !==
            "customer"
    ) {

        return null;

    }


    /* =============================================
       PREVENT SELF-MESSAGING
    ============================================== */

    if (
        String(seller.id) ===
        String(buyer.id)
    ) {

        console.warn(
            "TradeHub: A customer cannot message themselves."
        );

        return null;

    }


    /* =============================================
       PRODUCT MUST BELONG TO SELLER
    ============================================== */

    if (
        product.sourceType !==
            "customer" &&
        product.isUsed !== true &&
        product.isCustomerProduct !== true
    ) {

        console.warn(
            "TradeHub: This is not a customer listing."
        );

        return null;

    }


    if (
        String(product.sellerId) !==
        String(seller.id)
    ) {

        console.warn(
            "TradeHub: Product does not belong to this customer."
        );

        return null;

    }


    /* =============================================
       GET CONVERSATIONS
    ============================================== */

    const conversations =
        getConversations();


    /* =============================================
       CHECK EXISTING CONVERSATION

       Use both participants and product so
       different used products can have separate
       conversations.
    ============================================== */

    const existing =
        conversations.find(
            conversation =>

                conversation.type ===
                    "customer-customer" &&

                String(
                    conversation.productId
                ) ===
                String(
                    product.id
                ) &&

                (
                    (
                        String(
                            conversation.sellerCustomerId
                        ) ===
                        String(seller.id) &&

                        String(
                            conversation.buyerCustomerId
                        ) ===
                        String(buyer.id)
                    )

                    ||

                    (
                        String(
                            conversation.sellerCustomerId
                        ) ===
                        String(buyer.id) &&

                        String(
                            conversation.buyerCustomerId
                        ) ===
                        String(seller.id)
                    )
                )
        );


    if (existing) {

        return existing;

    }


    /* =============================================
       CREATE CONVERSATION
    ============================================== */

    const conversation = {

        id:
            "CONV-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        type:
            "customer-customer",


        /*
         * Keep these fields for compatibility
         * with existing customer conversation
         * handling.
         */

        customerId:
            buyer.id,

        customerName:
            buyer.name,


        /*
         * No business is involved.
         */

        businessId:
            null,

        businessName:
            null,


        /*
         * C2C participants.
         */

        sellerCustomerId:
            seller.id,

        sellerCustomerName:
            seller.name,


        buyerCustomerId:
            buyer.id,

        buyerCustomerName:
            buyer.name,


        /*
         * Product information.
         */

        productId:
            product.id,

        productName:
            product.name,

        productImage:
            product.image || "",


        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        messages:
            []

    };


    conversations.push(
        conversation
    );


    saveConversations(
        conversations
    );


    return conversation;

}


/* =====================================================
   CREATE BUSINESS → BUSINESS CONVERSATION
===================================================== */

/*
    This is used when one business wants
    to contact another business.

    Example:

    Business A
        ↓
    Business B
        ↓
    New conversation
*/

function createBusinessConversation(
    senderBusiness,
    targetBusiness
) {


    /* =============================================
       VALIDATION
    ============================================== */

    if (
        !senderBusiness ||
        !targetBusiness
    ) {

        return null;

    }


    if (
        !senderBusiness.id ||
        !targetBusiness.id
    ) {

        return null;

    }


    /* =============================================
       PREVENT SELF-MESSAGING
    ============================================== */

    if (
        senderBusiness.id ===
        targetBusiness.id
    ) {

        console.warn(
            "TradeHub: A business cannot message itself."
        );

        return null;

    }


    const conversations =
        getConversations();


    /* =============================================
       CHECK EXISTING CONVERSATION
    ============================================== */

    const existing =
        conversations.find(
            conversation =>

                conversation.type ===
                    "business-business" &&

                conversation.senderBusinessId ===
                    senderBusiness.id &&

                conversation.targetBusinessId ===
                    targetBusiness.id

        );


    if (existing) {

        return existing;

    }


    /* =============================================
       CREATE CONVERSATION
    ============================================== */

    const conversation = {

        id:
            "CONV-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        type:
            "business-business",


        customerId:
            null,


        customerName:
            null,


        businessId:
            targetBusiness.id,


        businessName:
            targetBusiness.businessName ||
            targetBusiness.name,


        senderBusinessId:
            senderBusiness.id,


        senderBusinessName:
            senderBusiness.businessName ||
            senderBusiness.name,


        targetBusinessId:
            targetBusiness.id,


        targetBusinessName:
            targetBusiness.businessName ||
            targetBusiness.name,


        productId:
            null,


        productName:
            null,


        productImage:
            "",


        createdAt:
            new Date().toISOString(),


        updatedAt:
            new Date().toISOString(),


        messages: []

    };


    conversations.push(
        conversation
    );


    saveConversations(
        conversations
    );


    return conversation;

}


/* =====================================================
   CREATE CUSTOMER ↔ BUSINESS DIRECT CONVERSATION
===================================================== */

/*
 * Used by features such as Logistics where there is
 * no product involved.
 *
 * Customer ↔ Business:
 * - creates a conversation without requiring a product
 *
 * Business ↔ Customer:
 * - same conversation format used by the existing
 *   customer/business messaging UI
 *
 * A user can never create a conversation with themselves.
 */

function createCustomerBusinessConversation(
    userA,
    userB
) {

    if (
        !userA ||
        !userB ||
        !userA.id ||
        !userB.id
    ) {

        return null;

    }


    if (
        String(userA.id) ===
        String(userB.id)
    ) {

        console.warn(
            "TradeHub: A user cannot message themselves."
        );

        return null;

    }


    const validPair =
        (
            userA.type === "customer" &&
            userB.type === "business"
        )
        ||
        (
            userA.type === "business" &&
            userB.type === "customer"
        );


    if (!validPair) {

        return null;

    }


    const customer =
        userA.type === "customer"
            ? userA
            : userB;


    const business =
        userA.type === "business"
            ? userA
            : userB;


    const conversations =
        getConversations();


    /*
     * Find an existing direct conversation.
     * We intentionally do not require productId because
     * logistics conversations are account-to-account.
     */

    const existing =
        conversations.find(
            function(conversation) {

                if (
                    conversation.type ===
                    "customer-business"
                ) {

                    return (
                        String(
                            conversation.customerId
                        ) ===
                        String(customer.id)
                        &&
                        String(
                            conversation.businessId
                        ) ===
                        String(business.id)
                    );

                }


                /*
                 * Backwards compatibility with older
                 * customer/business conversations that
                 * were stored without an explicit type.
                 */

                return (
                    conversation.type !==
                        "customer-customer"
                    &&
                    conversation.type !==
                        "business-business"
                    &&
                    String(
                        conversation.customerId
                    ) ===
                    String(customer.id)
                    &&
                    String(
                        conversation.businessId
                    ) ===
                    String(business.id)
                );

            }
        );


    if (existing) {

        return existing;

    }


    const conversation = {

        id:
            "CONV-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        type:
            "customer-business",


        customerId:
            customer.id,


        customerName:
            customer.name ||
            customer.businessName ||
            "Customer",


        businessId:
            business.id,


        businessName:
            business.businessName ||
            business.name ||
            "Business",


        /*
         * No product is attached.
         * This is useful for logistics and other
         * account-to-account communication.
         */

        productId:
            null,


        productName:
            "",


        productImage:
            "",


        createdAt:
            new Date().toISOString(),


        updatedAt:
            new Date().toISOString(),


        messages:
            []

    };


    conversations.push(
        conversation
    );


    saveConversations(
        conversations
    );


    return conversation;

}



/* =====================================================
   GET CONVERSATION
===================================================== */

function getConversation(
    conversationId
) {

    const conversations =
        getConversations();


    return conversations.find(
        conversation =>
            conversation.id ===
            conversationId
    );

}


/* =====================================================
   CHECK WHETHER USER BELONGS TO CONVERSATION
===================================================== */

function isConversationParticipant(
    conversation,
    userId,
    userType
) {

    if (
        !conversation ||
        !userId ||
        !userType
    ) {

        return false;

    }


    /* =============================================
       CUSTOMER
    ============================================== */

    if (
        userType ===
        "customer"
    ) {

        /*
         * C2C conversation:
         * both seller and buyer are participants.
         */

        if (
            conversation.type ===
            "customer-customer"
        ) {

            return (
                String(
                    conversation.sellerCustomerId
                ) ===
                String(userId)

                ||

                String(
                    conversation.buyerCustomerId
                ) ===
                String(userId)
            );

        }


        /*
         * Normal Customer ↔ Business
         */

        return (
            String(
                conversation.customerId
            ) ===
            String(userId)
        );

    }


    /* =============================================
       BUSINESS
    ============================================== */

    if (
        userType ===
        "business"
    ) {

        /*
         * Normal Customer ↔ Business
         */

        if (
            String(
                conversation.businessId
            ) ===
            String(userId)
        ) {

            return true;

        }


        /*
         * Business ↔ Business
         */

        if (
            conversation.type ===
                "business-business" &&

            (
                String(
                    conversation.senderBusinessId
                ) ===
                String(userId)

                ||

                String(
                    conversation.targetBusinessId
                ) ===
                String(userId)
            )
        ) {

            return true;

        }

    }


    return false;

}

/* =====================================================
   GET DIRECT CUSTOMER ↔ BUSINESS CONVERSATION
===================================================== */

function getCustomerBusinessConversation(
    customerId,
    businessId
) {

    return getConversations().find(
        function(conversation) {

            return (
                String(
                    conversation.customerId
                ) ===
                String(customerId)
                &&
                String(
                    conversation.businessId
                ) ===
                String(businessId)
            );

        }
    ) || null;

}



/* =====================================================
   GET CUSTOMER CONVERSATIONS
===================================================== */

function getCustomerConversations(
    customerId
) {

    return getConversations().filter(
        conversation => {

            /*
             * C2C:
             * customer can be either seller or buyer.
             */

            if (
                conversation.type ===
                "customer-customer"
            ) {

                return (
                    String(
                        conversation.sellerCustomerId
                    ) ===
                    String(customerId)

                    ||

                    String(
                        conversation.buyerCustomerId
                    ) ===
                    String(customerId)
                );

            }


            /*
             * Existing Customer ↔ Business
             */

            return (
                String(
                    conversation.customerId
                ) ===
                String(customerId)
            );

        }
    );

}

/* =====================================================
   GET BUSINESS CONVERSATIONS
===================================================== */

function getBusinessConversations(
    businessId
) {

    return getConversations().filter(
        conversation => {


            /*
             * Normal Business ↔ Customer
             */

            if (
                conversation.businessId ===
                businessId
            ) {

                return true;

            }


            /*
             * Business ↔ Business
             */

            if (
                conversation.type ===
                    "business-business" &&

                (
                    conversation.senderBusinessId ===
                        businessId ||

                    conversation.targetBusinessId ===
                        businessId
                )
            ) {

                return true;

            }


            return false;

        }
    );

}


/* =====================================================
   SEND MESSAGE
===================================================== */

/*
    A user can only send a message if they
    actually belong to the conversation.
*/

function sendMessage(
    conversationId,
    senderId,
    senderType,
    senderName,
    text
) {


    /* =============================================
       VALIDATE INPUT
    ============================================== */

    if (
        !conversationId ||
        !senderId ||
        !senderType ||
        !text
    ) {

        return false;

    }


    const cleanText =
        String(
            text
        ).trim();


    if (!cleanText) {

        return false;

    }


    const conversations =
        getConversations();


    const conversation =
        conversations.find(
            conversation =>
                conversation.id ===
                conversationId
        );


    /* =============================================
       CONVERSATION NOT FOUND
    ============================================== */

    if (!conversation) {

        console.warn(
            "TradeHub: Conversation not found."
        );

        return false;

    }


    /* =============================================
       PERMISSION CHECK
    ============================================== */

    if (
        !isConversationParticipant(
            conversation,
            senderId,
            senderType
        )
    ) {

        console.warn(
            "TradeHub: User is not a participant in this conversation."
        );

        return false;

    }


    /* =============================================
       PREVENT SELF MESSAGE
    ============================================== */

    if (
        conversation.type ===
            "business-business" &&

        String(
            conversation.senderBusinessId
        ) ===
        String(
            conversation.targetBusinessId
        )
    ) {

        console.warn(
            "TradeHub: Invalid self conversation."
        );

        return false;

    }


    /*
     * C2C conversations have two distinct
     * customer participants.
     */

    if (
        conversation.type ===
            "customer-customer" &&

        String(
            conversation.sellerCustomerId
        ) ===
        String(
            conversation.buyerCustomerId
        )
    ) {

        console.warn(
            "TradeHub: Invalid customer self conversation."
        );

        return false;

    }


    /* =============================================
       CREATE MESSAGE
    ============================================== */

    const message = {

        id:
            "MSG-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        senderId:
            senderId,


        senderType:
            senderType,


        senderName:
            senderName,


        text:
            cleanText,


        createdAt:
            new Date().toISOString()

    };


    /* =============================================
       ADD MESSAGE
    ============================================== */

    conversation.messages.push(
        message
    );


    conversation.updatedAt =
        new Date().toISOString();


    saveConversations(
        conversations
    );


    return true;

}


/* =====================================================
   GET UNREAD MESSAGE COUNT
===================================================== */

/*
    This currently counts incoming messages
    for conversations belonging to the user.

    Proper read/unread state can be added later.
*/

function getUnreadMessageCount(
    userId,
    userType
) {

    let count = 0;


    const conversations =
        userType === "customer"

            ?

        getCustomerConversations(
            userId
        )

            :

        getBusinessConversations(
            userId
        );


    conversations.forEach(
        conversation => {

            conversation.messages.forEach(
                message => {


                    if (
                        message.senderId !==
                        userId
                    ) {

                        count++;

                    }

                }
            );

        }
    );


    return count;

}


/* =====================================================
   CHECK WHETHER CUSTOMER CAN CONTACT CUSTOMER
===================================================== */

function canCustomerContactCustomer(
    buyerCustomer,
    sellerCustomer,
    product
) {

    if (
        !buyerCustomer ||
        !sellerCustomer ||
        !product
    ) {

        return false;

    }


    if (
        buyerCustomer.type !==
            "customer" ||
        sellerCustomer.type !==
            "customer"
    ) {

        return false;

    }


    if (
        String(buyerCustomer.id) ===
        String(sellerCustomer.id)
    ) {

        return false;

    }


    if (
        product.isUsed !== true ||
        product.sourceType !== "customer"
    ) {

        return false;

    }


    if (
        String(product.sellerId) !==
        String(sellerCustomer.id)
    ) {

        return false;

    }


    return true;

}


/* =====================================================
   CHECK WHETHER CUSTOMER CAN CONTACT CUSTOMER
===================================================== */

/*
    A customer can contact another customer only
    through a customer-owned / pre-owned product.
*/

function canCustomerContactCustomer(
    buyer,
    seller,
    product
) {

    if (
        !buyer ||
        !seller ||
        !product
    ) {

        return false;

    }


    if (
        buyer.type !==
            "customer" ||
        seller.type !==
            "customer"
    ) {

        return false;

    }


    if (
        String(buyer.id) ===
        String(seller.id)
    ) {

        return false;

    }


    if (
        product.sourceType !==
            "customer" &&
        product.isUsed !== true &&
        product.isCustomerProduct !== true
    ) {

        return false;

    }


    if (
        String(product.sellerId) !==
        String(seller.id)
    ) {

        return false;

    }


    /*
     * A sold listing should not start a new
     * marketplace conversation.
     */

    if (
        product.status ===
            "sold" ||
        product.sold ===
            true
    ) {

        return false;

    }


    return true;

}


/* =====================================================
   CHECK WHETHER CUSTOMER CAN CONTACT BUSINESS
===================================================== */

/*
    A customer can contact a business only
    through a product belonging to that business.
*/

function canCustomerContactBusiness(
    customer,
    business,
    product
) {


    if (
        !customer ||
        !business ||
        !product
    ) {

        return false;

    }


    if (
        customer.type !==
        "customer"
    ) {

        return false;

    }


    if (
        business.type !==
        "business"
    ) {

        return false;

    }


    /*
     * Customer and business must
     * have different IDs.
     */

    if (
        customer.id ===
        business.id
    ) {

        return false;

    }


    /*
     * Product must belong to
     * the business.
     */

    if (
        product.businessId !==
        business.id
    ) {

        return false;

    }


    return true;

}


/* =====================================================
   CHECK WHETHER BUSINESS CAN CONTACT BUSINESS
===================================================== */

function canBusinessContactBusiness(
    senderBusiness,
    targetBusiness
) {


    if (
        !senderBusiness ||
        !targetBusiness
    ) {

        return false;

    }


    if (
        senderBusiness.type !==
        "business"
    ) {

        return false;

    }


    if (
        targetBusiness.type !==
        "business"
    ) {

        return false;

    }


    /*
     * Prevent self-messaging.
     */

    if (
        senderBusiness.id ===
        targetBusiness.id
    ) {

        return false;

    }


    return true;

}