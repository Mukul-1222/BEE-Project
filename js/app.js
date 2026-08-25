/* =====================================================
   TRADEHUB
   Main JavaScript
===================================================== */

console.log("TradeHub loaded successfully!");


// =====================================================
// GET CURRENT USER
// =====================================================

let currentUser = null;


try {

    currentUser =
        JSON.parse(
            localStorage.getItem(
                "tradehub_current_user"
            )
        );

}
catch (error) {

    currentUser = null;

}


// =====================================================
// LOGIN BUTTON
// =====================================================

const loginBtn =
    document.getElementById(
        "loginBtn"
    );


if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/login.html";

        }
    );

}


// =====================================================
// EXPLORE PRODUCTS
// =====================================================

const exploreBtn =
    document.getElementById(
        "exploreBtn"
    );


if (exploreBtn) {

    exploreBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "pages/products.html";

        }
    );

}


// =====================================================
// START SELLING
// =====================================================

const sellBtn =
    document.getElementById(
        "sellBtn"
    );


if (sellBtn) {

    sellBtn.addEventListener(
        "click",
        function () {

            /*
             * =============================================
             * NOT LOGGED IN
             * =============================================
             */

            if (!currentUser) {

                window.location.href =
                    "pages/login.html";

                return;

            }


            /*
             * =============================================
             * BUSINESS ACCOUNT
             * =============================================
             *
             * Businesses use the existing business
             * product creation system.
             */

            if (
                currentUser.type ===
                "business"
            ) {

                window.location.href =
                    "pages/add-product.html";

                return;

            }


            /*
             * =============================================
             * CUSTOMER ACCOUNT
             * =============================================
             *
             * Customers can list their old / used
             * products through the new C2C system.
             */

            if (
                currentUser.type ===
                "customer"
            ) {

                window.location.href =
                    "pages/sell-used-product.html";

                return;

            }


            /*
             * =============================================
             * UNKNOWN ACCOUNT TYPE
             * =============================================
             */

            window.location.href =
                "pages/login.html";

        }
    );

}


// =====================================================
// NAVBAR SEARCH BUTTON
// =====================================================

const searchBtn =
    document.getElementById(
        "searchBtn"
    );


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            /*
             * If the homepage search bar exists,
             * scroll to it and focus it.
             */

            const homepageSearch =
                document.getElementById(
                    "homepageSearch"
                );


            if (homepageSearch) {

                homepageSearch.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });


                setTimeout(
                    function () {

                        homepageSearch.focus();

                    },
                    350
                );

            }

            /*
             * If the search button is used on
             * another page where the homepage
             * search bar doesn't exist, open
             * the marketplace directly.
             */

            else {

                window.location.href =
                    "pages/products.html";

            }

        }
    );

}


// =====================================================
// CHECK LOGGED-IN USER
// =====================================================

const accountArea =
    document.getElementById(
        "accountArea"
    );


if (
    currentUser &&
    accountArea
) {

    accountArea.innerHTML = `

        <button
            class="login-btn account-btn"
            id="accountBtn"
            type="button">

            👤 ${
                currentUser.businessName ||
                currentUser.name ||
                "Account"
            }

        </button>

    `;


    const accountBtn =
        document.getElementById(
            "accountBtn"
        );


    if (accountBtn) {

        accountBtn.addEventListener(
            "click",
            function () {

                /*
                 * BUSINESS ACCOUNT
                 */

                if (
                    currentUser.type ===
                    "business"
                ) {

                    window.location.href =
                        "pages/business-dashboard.html";

                }

                /*
                 * CUSTOMER ACCOUNT
                 */

                else if (
                    currentUser.type ===
                    "customer"
                ) {

                    window.location.href =
                        "pages/customer-dashboard.html";

                }

                /*
                 * UNKNOWN ACCOUNT
                 */

                else {

                    window.location.href =
                        "pages/login.html";

                }

            }
        );

    }

}