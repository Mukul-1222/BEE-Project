/* =====================================================
   TRADEHUB PRODUCT REVIEW SYSTEM
===================================================== */


/* =====================================================
   GET ALL REVIEWS
===================================================== */

function getReviews() {

    return JSON.parse(
        localStorage.getItem(
            "tradehub_reviews"
        )
    ) || [];

}


/* =====================================================
   SAVE REVIEWS
===================================================== */

function saveReviews(reviews) {

    localStorage.setItem(
        "tradehub_reviews",
        JSON.stringify(
            reviews
        )
    );

}


/* =====================================================
   GET REVIEWS FOR PRODUCT
===================================================== */

function getProductReviews(productId) {

    return getReviews().filter(
        review =>
            Number(review.productId) ===
            Number(productId)
    );

}


/* =====================================================
   GET A USER'S REVIEW FOR PRODUCT
===================================================== */

function getUserProductReview(
    userId,
    productId
) {

    return getReviews().find(
        review =>

            review.userId === userId &&

            Number(review.productId) ===
            Number(productId)

    ) || null;

}


/* =====================================================
   CHECK IF USER HAS REVIEWED PRODUCT
===================================================== */

function hasUserReviewedProduct(
    userId,
    productId
) {

    return !!getUserProductReview(
        userId,
        productId
    );

}


/* =====================================================
   ADD REVIEW
===================================================== */

function addProductReview(
    user,
    product,
    rating,
    reviewText,
    photos = []
) {


    /* =================================================
       BASIC VALIDATION
    ================================================== */

    if (
        !user ||
        !product
    ) {

        return {

            success: false,

            message:
                "User or product information is missing."

        };

    }


    /* =================================================
       CUSTOMER ONLY
    ================================================== */

    if (
        user.type !==
        "customer"
    ) {

        return {

            success: false,

            message:
                "Only customers can leave product reviews."

        };

    }


    /* =================================================
       VERIFIED PURCHASE CHECK
    ================================================== */

    if (
        typeof canCustomerReviewProduct ===
        "function"
    ) {


        if (
            !canCustomerReviewProduct(
                user.id,
                product.id
            )
        ) {

            const eligibility =
                typeof getReviewEligibility ===
                "function"

                    ?

                getReviewEligibility(
                    user.id,
                    product.id
                )

                    :

                null;


            let message =
                "You can review this product only after receiving it.";


            if (
                eligibility &&
                eligibility.reason ===
                "not-purchased"
            ) {

                message =
                    "You can review this product after purchasing it.";

            }


            if (
                eligibility &&
                eligibility.reason ===
                "not-delivered"
            ) {

                message =
                    "You can review this product after your order is delivered.";

            }


            return {

                success: false,

                message:
                    message

            };

        }

    }


    /* =================================================
       RATING VALIDATION
    ================================================== */

    rating =
        Number(rating);


    if (
        rating < 1 ||
        rating > 5
    ) {

        return {

            success: false,

            message:
                "Rating must be between 1 and 5."

        };

    }


    /* =================================================
       REVIEW TEXT
    ================================================== */

    reviewText =
        String(
            reviewText || ""
        ).trim();


    if (
        reviewText.length < 3
    ) {

        return {

            success: false,

            message:
                "Please write a review."

        };

    }


    /* =================================================
       CHECK DUPLICATE REVIEW
    ================================================== */

    if (
        hasUserReviewedProduct(
            user.id,
            product.id
        )
    ) {

        return {

            success: false,

            message:
                "You have already reviewed this product."

        };

    }


    /* =================================================
       CLEAN PHOTOS
    ================================================== */

    if (
        !Array.isArray(photos)
    ) {

        photos = [];

    }


    /*
     * Limit number of photos.
     */

    photos =
        photos.slice(
            0,
            5
        );


    /* =================================================
       CREATE REVIEW
    ================================================== */

    const reviews =
        getReviews();


    const review = {

        id:
            "REVIEW-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            ),


        productId:
            product.id,


        productName:
            product.name,


        productImage:
            product.image || "",


        userId:
            user.id,


        userName:
            user.name ||
            "Customer",


        rating:
            rating,


        text:
            reviewText,


        photos:
            photos,


        /*
         * This lets us show:
         *
         * ✓ Verified Purchase
         *
         * on the product page.
         */

        verifiedPurchase:
            true,


        createdAt:
            new Date().toISOString()

    };


    /* =================================================
       SAVE REVIEW
    ================================================== */

    reviews.push(
        review
    );


    saveReviews(
        reviews
    );


    return {

        success: true,

        message:
            "Review submitted successfully.",

        review:
            review

    };

}


/* =====================================================
   CALCULATE AVERAGE RATING
===================================================== */

function getProductRating(
    productId
) {

    const reviews =
        getProductReviews(
            productId
        );


    if (
        reviews.length === 0
    ) {

        return {

            average: 0,

            count: 0

        };

    }


    let total = 0;


    reviews.forEach(
        review => {

            total +=
                Number(
                    review.rating
                );

        }
    );


    const average =
        total /
        reviews.length;


    return {

        average:
            Number(
                average.toFixed(1)
            ),

        count:
            reviews.length

    };

}


/* =====================================================
   CREATE STAR DISPLAY
===================================================== */

function getStarHTML(
    rating
) {

    rating =
        Number(rating);


    let html = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <= rating
        ) {

            html += "★";

        }

        else {

            html += "☆";

        }

    }


    return html;

}


/* =====================================================
   FORMAT REVIEW DATE
===================================================== */

function formatReviewDate(
    date
) {

    if (!date) {

        return "";

    }


    const reviewDate =
        new Date(date);


    return reviewDate.toLocaleDateString(
        "en-IN",
        {

            day:
                "numeric",

            month:
                "short",

            year:
                "numeric"

        }
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeReviewHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;

}


/* =====================================================
   CREATE REVIEW HTML
===================================================== */

function createReviewHTML(
    review
) {

    const photos =
        Array.isArray(
            review.photos
        )

            ?

        review.photos
            .map(
                photo => `

                    <img
                        src="${photo}"
                        alt="Customer review photo"
                        class="review-photo"
                    >

                `
            )
            .join("")

            :

        "";


    return `

        <article
            class="review-item">


            <!-- =========================================
                 REVIEW HEADER
            ========================================== -->

            <div
                class="review-header">


                <div
                    class="review-user">


                    <div
                        class="review-avatar">

                        👤

                    </div>


                    <div>


                        <strong>

                            ${escapeReviewHTML(
                                review.userName
                            )}

                        </strong>


                        <div
                            class="review-stars">

                            ${getStarHTML(
                                review.rating
                            )}

                        </div>


                        ${
                            review.verifiedPurchase

                            ?

                            `

                            <span
                                class="verified-purchase">

                                ✓ Verified Purchase

                            </span>

                            `

                            :

                            ""

                        }


                    </div>


                </div>



                <!-- REVIEW DATE -->

                <time>

                    ${formatReviewDate(
                        review.createdAt
                    )}

                </time>


            </div>



            <!-- =========================================
                 REVIEW TEXT
            ========================================== -->

            <p
                class="review-text">

                ${escapeReviewHTML(
                    review.text
                )}

            </p>



            <!-- =========================================
                 REVIEW PHOTOS
            ========================================== -->

            ${
                photos

                ?

                `

                <div
                    class="review-photos">

                    ${photos}

                </div>

                `

                :

                ""

            }


        </article>

    `;

}


/* =====================================================
   RENDER PRODUCT REVIEWS
===================================================== */

function renderProductReviews(
    productId,
    container
) {

    if (!container) {

        return;

    }


    const reviews =
        getProductReviews(
            productId
        );


    const rating =
        getProductRating(
            productId
        );


    let reviewsHTML = `

        <!-- =============================================
             REVIEW SUMMARY
        ============================================== -->

        <div
            class="reviews-summary">


            <div
                class="reviews-score">


                <strong>

                    ${
                        rating.count > 0
                            ?
                        rating.average
                            :
                        "—"
                    }

                </strong>


                <div
                    class="review-stars large">

                    ${
                        rating.count > 0

                            ?

                        getStarHTML(
                            Math.round(
                                rating.average
                            )
                        )

                            :

                        "☆☆☆☆☆"

                    }

                </div>


                <span>

                    ${rating.count}

                    ${
                        rating.count === 1
                            ?
                        "review"
                            :
                        "reviews"
                    }

                </span>


            </div>


            <div
                class="reviews-summary-text">

                ${
                    rating.count > 0

                        ?

                    `Customers have rated
                     this product ${rating.average}
                     out of 5.`

                        :

                    "No reviews yet. Be the first customer to review this product."

                }

            </div>


        </div>



        <!-- =============================================
             REVIEW LIST
        ============================================== -->

        <div
            class="reviews-list">

    `;


    /* =================================================
       NO REVIEWS
    ================================================== */

    if (
        reviews.length === 0
    ) {

        reviewsHTML += `

            <div
                class="no-reviews">


                <div>
                    ⭐
                </div>


                <h3>
                    No Reviews Yet
                </h3>


                <p>

                    Be the first customer to
                    share your experience.

                </p>


            </div>

        `;

    }


    /* =================================================
       REVIEWS
    ================================================== */

    else {

        reviews
            .slice()
            .sort(
                (a, b) =>

                    new Date(
                        b.createdAt
                    ) -

                    new Date(
                        a.createdAt
                    )

            )
            .forEach(
                review => {

                    reviewsHTML +=
                        createReviewHTML(
                            review
                        );

                }
            );

    }


    reviewsHTML += `

        </div>

    `;


    container.innerHTML =
        reviewsHTML;

}


/* =====================================================
   REVIEW ELIGIBILITY
===================================================== */

/*
    A customer can review only when:

    1. User is logged in.
    2. User is a customer.
    3. Customer purchased the product.
    4. Product was delivered/completed.
    5. Customer has not already reviewed it.
*/

function canReviewProduct(
    user,
    productId
) {


    /* =================================================
       LOGIN CHECK
    ================================================== */

    if (!user) {

        return false;

    }


    /* =================================================
       CUSTOMER CHECK
    ================================================== */

    if (
        user.type !==
        "customer"
    ) {

        return false;

    }


    /* =================================================
       DELIVERY CHECK
    ================================================== */

    if (
        typeof canCustomerReviewProduct ===
        "function"
    ) {


        if (
            !canCustomerReviewProduct(
                user.id,
                productId
            )
        ) {

            return false;

        }

    }


    /* =================================================
       DUPLICATE CHECK
    ================================================== */

    if (
        hasUserReviewedProduct(
            user.id,
            productId
        )
    ) {

        return false;

    }


    return true;

}


/* =====================================================
   CREATE REVIEW FORM
===================================================== */

function createReviewForm(
    product,
    user,
    container
) {

    if (!container) {

        return;

    }


    /* =================================================
       NOT LOGGED IN
    ================================================== */

    if (!user) {

        container.innerHTML = `

            <div
                class="review-login-box">


                <h3>

                    Want to review this product?

                </h3>


                <p>

                    Login as a customer to leave
                    a verified review.

                </p>


                <button
                    class="secondary-btn"
                    onclick="
                        window.location.href='login.html'
                    ">

                    Login

                </button>


            </div>

        `;


        return;

    }


    /* =================================================
       BUSINESS ACCOUNT
    ================================================== */

    if (
        user.type !==
        "customer"
    ) {

        container.innerHTML = `

            <div
                class="review-login-box">


                <h3>

                    Customer Reviews

                </h3>


                <p>

                    Only customers can leave
                    product reviews.

                </p>


            </div>

        `;


        return;

    }


    /* =================================================
       PURCHASE / DELIVERY CHECK
    ================================================== */

    let eligibility = {

        eligible:
            true,

        reason:
            "eligible"

    };


    if (
        typeof getReviewEligibility ===
        "function"
    ) {

        eligibility =
            getReviewEligibility(
                user.id,
                product.id
            );

    }


    if (
        !eligibility.eligible
    ) {


        let message =
            "You can review this product after receiving it.";


        if (
            eligibility.reason ===
            "not-purchased"
        ) {

            message =
                "Purchase this product first to leave a review.";

        }


        else if (
            eligibility.reason ===
            "not-delivered"
        ) {

            message =
                "You can review this product after your order is delivered.";

        }


        else if (
            eligibility.reason ===
            "login"
        ) {

            message =
                "Please login as a customer to review this product.";

        }


        container.innerHTML = `

            <div
                class="review-login-box">


                <h3>

                    🛍️ Verified Purchase Required

                </h3>


                <p>

                    ${message}

                </p>


            </div>

        `;


        return;

    }


    /* =================================================
       DUPLICATE REVIEW CHECK
    ================================================== */

    if (
        hasUserReviewedProduct(
            user.id,
            product.id
        )
    ) {

        container.innerHTML = `

            <div
                class="review-login-box">


                <h3>

                    ✓ You reviewed this product

                </h3>


                <p>

                    You can only submit one review
                    for each product.

                </p>


            </div>

        `;


        return;

    }


    /* =================================================
       REVIEW FORM
    ================================================== */

    container.innerHTML = `

        <form
            id="reviewForm"
            class="review-form">


            <h3>

                Write a Review

            </h3>


            <p
                class="review-form-subtitle">

                Share your experience with
                this product.

            </p>



            <!-- =========================================
                 RATING
            ========================================== -->

            <div
                class="rating-input">


                <label>

                    Your Rating

                </label>


                <div
                    class="rating-stars-input"
                    id="ratingStars">


                    <button
                        type="button"
                        data-rating="1">

                        ☆

                    </button>


                    <button
                        type="button"
                        data-rating="2">

                        ☆

                    </button>


                    <button
                        type="button"
                        data-rating="3">

                        ☆

                    </button>


                    <button
                        type="button"
                        data-rating="4">

                        ☆

                    </button>


                    <button
                        type="button"
                        data-rating="5">

                        ☆

                    </button>


                </div>


                <input
                    type="hidden"
                    id="selectedRating"
                    value="0"
                >

            </div>



            <!-- =========================================
                 REVIEW TEXT
            ========================================== -->

            <div
                class="review-field">


                <label
                    for="reviewText">

                    Your Review

                </label>


                <textarea
                    id="reviewText"
                    rows="5"
                    maxlength="1000"
                    placeholder="What did you think about this product?"
                    required></textarea>


                <small>

                    Maximum 1000 characters.

                </small>


            </div>



            <!-- =========================================
                 PHOTOS
            ========================================== -->

            <div
                class="review-field">


                <label
                    for="reviewPhotos">

                    Add Photos

                    <span>

                        (Optional)

                    </span>

                </label>


                <input
                    type="file"
                    id="reviewPhotos"
                    accept="image/*"
                    multiple
                >


                <small>

                    You can add up to 5 photos.

                </small>


                <div
                    id="reviewPhotoPreview"
                    class="review-photo-preview">

                </div>


            </div>



            <!-- =========================================
                 SUBMIT
            ========================================== -->

            <button
                type="submit"
                class="primary-btn">

                ⭐ Submit Review

            </button>


            <p
                id="reviewFormMessage"
                class="review-form-message">

            </p>


        </form>

    `;


    initializeReviewForm(
        product,
        user
    );

}


/* =====================================================
   INITIALIZE REVIEW FORM
===================================================== */

function initializeReviewForm(
    product,
    user
) {


    const form =
        document.getElementById(
            "reviewForm"
        );


    const stars =
        document.querySelectorAll(
            "#ratingStars button"
        );


    const ratingInput =
        document.getElementById(
            "selectedRating"
        );


    const photoInput =
        document.getElementById(
            "reviewPhotos"
        );


    const preview =
        document.getElementById(
            "reviewPhotoPreview"
        );


    let selectedPhotos = [];



    /* =================================================
       STAR SELECTION
    ================================================== */

    stars.forEach(
        star => {


            star.addEventListener(
                "click",
                function() {


                    const rating =
                        Number(
                            this.dataset.rating
                        );


                    ratingInput.value =
                        rating;


                    stars.forEach(
                        button => {


                            const buttonRating =
                                Number(
                                    button.dataset.rating
                                );


                            button.textContent =
                                buttonRating <=
                                rating

                                    ?

                                "★"

                                    :

                                "☆";

                        }
                    );

                }
            );

        }
    );



    /* =================================================
       PHOTO SELECTION
    ================================================== */

    photoInput.addEventListener(
        "change",
        function() {


            const files =
                Array.from(
                    this.files
                );


            if (
                files.length > 5
            ) {

                alert(
                    "You can upload a maximum of 5 photos."
                );

            }


            selectedPhotos =
                files.slice(
                    0,
                    5
                );


            preview.innerHTML =
                "";


            selectedPhotos.forEach(
                file => {


                    const reader =
                        new FileReader();


                    reader.onload =
                        function(event) {


                            const image =
                                document.createElement(
                                    "img"
                                );


                            image.src =
                                event.target.result;


                            image.className =
                                "review-photo";


                            preview.appendChild(
                                image
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }
    );



    /* =================================================
       SUBMIT REVIEW
    ================================================== */

    form.addEventListener(
        "submit",
        async function(event) {


            event.preventDefault();


            const rating =
                Number(
                    ratingInput.value
                );


            const reviewText =
                document.getElementById(
                    "reviewText"
                ).value.trim();


            const message =
                document.getElementById(
                    "reviewFormMessage"
                );


            /* =========================================
               RATING CHECK
            ========================================== */

            if (
                rating < 1
            ) {

                message.textContent =
                    "Please select a rating.";

                return;

            }


            /* =========================================
               FINAL ELIGIBILITY CHECK
            ========================================== */

            if (
                !canReviewProduct(
                    user,
                    product.id
                )
            ) {

                message.textContent =
                    "You are not eligible to review this product.";

                return;

            }


            /* =========================================
               READ PHOTOS
            ========================================== */

            const photos =
                await readReviewPhotos(
                    selectedPhotos
                );


            /* =========================================
               ADD REVIEW
            ========================================== */

            const result =
                addProductReview(
                    user,
                    product,
                    rating,
                    reviewText,
                    photos
                );


            /* =========================================
               RESULT
            ========================================== */

            message.textContent =
                result.message;


            if (
                result.success
            ) {


                message.classList.add(
                    "success"
                );


                /* =====================================
                   RE-RENDER REVIEWS
                ====================================== */

                const reviewsContainer =
                    document.getElementById(
                        "productReviews"
                    );


                if (
                    reviewsContainer
                ) {

                    renderProductReviews(
                        product.id,
                        reviewsContainer
                    );

                }


                /* =====================================
                   UPDATE REVIEW FORM
                ====================================== */

                setTimeout(
                    function() {


                        createReviewForm(
                            product,
                            user,
                            document.getElementById(
                                "writeReviewSection"
                            )
                        );


                    },
                    500
                );

            }

        }
    );

}


/* =====================================================
   READ REVIEW PHOTOS
===================================================== */

function readReviewPhotos(
    files
) {

    return Promise.all(

        files.map(
            file =>

                new Promise(
                    resolve => {


                        const reader =
                            new FileReader();


                        reader.onload =
                            event =>

                                resolve(
                                    event.target.result
                                );


                        reader.readAsDataURL(
                            file
                        );

                    }
                )

        )

    );

}