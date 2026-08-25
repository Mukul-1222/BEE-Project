/* =====================================================
   TRADEHUB COUPON SYSTEM
===================================================== */


/* =====================================================
   GET ALL COUPONS
===================================================== */

function getCoupons() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_coupons"
        )
    ) || [];

}


/* =====================================================
   SAVE COUPONS
===================================================== */

function saveCoupons(
    coupons
) {

    localStorage.setItem(
        "tradehub_coupons",
        JSON.stringify(
            coupons
        )
    );

}


/* =====================================================
   GENERATE COUPON
===================================================== */

function generateCoupon(
    business,
    code,
    discountType,
    discountValue,
    minimumOrder,
    expiryDate,
    usageLimit
) {

    const coupons =
        getCoupons();


    code =
        String(code)
            .trim()
            .toUpperCase();


    /* =================================================
       CHECK CODE
    ================================================== */

    if (!code) {

        return {
            success: false,
            message: "Coupon code is required."
        };

    }


    /* =================================================
       CHECK DUPLICATE
    ================================================== */

    const existing =
        coupons.find(
            coupon =>
                coupon.code === code
        );


    if (existing) {

        return {
            success: false,
            message: "This coupon code already exists."
        };

    }


    /* =================================================
       CHECK DISCOUNT
    ================================================== */

    discountValue =
        Number(
            discountValue
        );


    if (
        !discountValue ||
        discountValue <= 0
    ) {

        return {
            success: false,
            message: "Enter a valid discount."
        };

    }


    if (
        discountType ===
        "percentage" &&
        discountValue > 100
    ) {

        return {
            success: false,
            message:
                "Percentage discount cannot exceed 100%."
        };

    }


    /* =================================================
       CREATE COUPON
    ================================================== */

    const coupon = {

        id:
            "COUPON-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        code:
            code,


        businessId:
            business.id,


        businessName:
            business.businessName ||
            business.name,


        discountType:
            discountType,


        discountValue:
            discountValue,


        minimumOrder:
            Number(
                minimumOrder
            ) || 0,


        expiryDate:
            expiryDate ||
            null,


        usageLimit:
            Number(
                usageLimit
            ) || 0,


        usedCount:
            0,


        active:
            true,


        createdAt:
            new Date().toISOString()

    };


    coupons.push(
        coupon
    );


    saveCoupons(
        coupons
    );


    return {

        success: true,

        coupon:
            coupon

    };

}


/* =====================================================
   GET BUSINESS COUPONS
===================================================== */

function getBusinessCoupons(
    businessId
) {

    return getCoupons().filter(
        coupon =>
            String(
                coupon.businessId
            ) ===
            String(
                businessId
            )
    );

}


/* =====================================================
   GET COUPON BY CODE
===================================================== */

function getCouponByCode(
    code
) {

    code =
        String(
            code
        )
        .trim()
        .toUpperCase();


    return getCoupons().find(
        coupon =>
            coupon.code === code
    );

}


/* =====================================================
   CHECK COUPON EXPIRY
===================================================== */

function isCouponExpired(
    coupon
) {

    if (
        !coupon.expiryDate
    ) {

        return false;

    }


    const expiry =
        new Date(
            coupon.expiryDate
        );


    return (
        new Date() >
        expiry
    );

}


/* =====================================================
   VALIDATE COUPON
===================================================== */

function validateCoupon(
    code,
    cart,
    subtotal
) {

    const coupon =
        getCouponByCode(
            code
        );


    /* =================================================
       NOT FOUND
    ================================================== */

    if (!coupon) {

        return {

            valid: false,

            message:
                "Invalid coupon code."

        };

    }


    /* =================================================
       INACTIVE
    ================================================== */

    if (
        !coupon.active
    ) {

        return {

            valid: false,

            message:
                "This coupon is no longer active."

        };

    }


    /* =================================================
       EXPIRED
    ================================================== */

    if (
        isCouponExpired(
            coupon
        )
    ) {

        return {

            valid: false,

            message:
                "This coupon has expired."

        };

    }


    /* =================================================
       USAGE LIMIT
    ================================================== */

    if (

        coupon.usageLimit > 0 &&

        coupon.usedCount >=
        coupon.usageLimit

    ) {

        return {

            valid: false,

            message:
                "This coupon has reached its usage limit."

        };

    }


    /* =================================================
       MINIMUM ORDER
    ================================================== */

    if (
        subtotal <
        coupon.minimumOrder
    ) {

        return {

            valid: false,

            message:
                `Minimum order value is ₹${coupon.minimumOrder}.`

        };

    }


    /* =================================================
       CALCULATE DISCOUNT
    ================================================== */

    let discount = 0;


    if (
        coupon.discountType ===
        "percentage"
    ) {

        discount =
            subtotal *
            (
                coupon.discountValue /
                100
            );

    }

    else if (
        coupon.discountType ===
        "fixed"
    ) {

        discount =
            coupon.discountValue;

    }


    /* =================================================
       NEVER DISCOUNT BELOW ZERO
    ================================================== */

    discount =
        Math.min(
            discount,
            subtotal
        );


    return {

        valid: true,

        coupon:
            coupon,

        discount:
            Math.round(
                discount * 100
            ) / 100

    };

}


/* =====================================================
   USE COUPON
===================================================== */

function useCoupon(
    couponId
) {

    const coupons =
        getCoupons();


    const coupon =
        coupons.find(
            coupon =>
                coupon.id ===
                couponId
        );


    if (!coupon) {

        return false;

    }


    coupon.usedCount =
        Number(
            coupon.usedCount
        ) + 1;


    saveCoupons(
        coupons
    );


    return true;

}


/* =====================================================
   DELETE COUPON
===================================================== */

function deleteCoupon(
    couponId
) {

    let coupons =
        getCoupons();


    coupons =
        coupons.filter(
            coupon =>
                coupon.id !==
                couponId
        );


    saveCoupons(
        coupons
    );

}


/* =====================================================
   TOGGLE COUPON
===================================================== */

function toggleCoupon(
    couponId
) {

    const coupons =
        getCoupons();


    const coupon =
        coupons.find(
            coupon =>
                coupon.id ===
                couponId
        );


    if (!coupon) {

        return false;

    }


    coupon.active =
        !coupon.active;


    saveCoupons(
        coupons
    );


    return coupon.active;

}