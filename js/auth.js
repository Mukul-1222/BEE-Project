/* =====================================================
   TRADEHUB AUTHENTICATION SYSTEM
===================================================== */


// =====================================================
// GET USERS
// =====================================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("tradehub_users")
    ) || [];

}


// =====================================================
// SAVE USERS
// =====================================================

function saveUsers(users) {

    localStorage.setItem(
        "tradehub_users",
        JSON.stringify(users)
    );

}


// =====================================================
// REDIRECT AFTER LOGIN
// =====================================================

function redirectAfterLogin(user) {

    // =================================================
    // CHECK IF USER WAS TRYING TO ACCESS A PAGE
    // BEFORE LOGIN
    // =================================================

    const returnUrl =
        localStorage.getItem(
            "tradehub_return_url"
        );


    if (returnUrl) {

        // Remove it so future logins
        // don't redirect to the same page

        localStorage.removeItem(
            "tradehub_return_url"
        );


        window.location.href =
            returnUrl;


        return;

    }


    // =================================================
    // NORMAL LOGIN REDIRECT
    // =================================================

    if (user.type === "business") {

        window.location.href =
            "business-dashboard.html";

    } else {

        window.location.href =
            "customer-dashboard.html";

    }

}


// =====================================================
// REGISTER
// =====================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =================================================
            // GET FORM VALUES
            // =================================================

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "registerConfirmPassword"
                ).value;


            const selectedUserType =
                document.querySelector(
                    'input[name="userType"]:checked'
                );


            const error =
                document.getElementById(
                    "registerError"
                );


            // =================================================
            // CHECK USER TYPE
            // =================================================

            if (!selectedUserType) {

                error.textContent =
                    "Please select Customer or Business.";

                error.style.display =
                    "block";

                return;

            }


            const userType =
                selectedUserType.value;


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                error.textContent =
                    "Please fill in all fields.";

                error.style.display =
                    "block";

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                error.textContent =
                    "Passwords do not match.";

                error.style.display =
                    "block";

                return;

            }


            if (
                password.length < 6
            ) {

                error.textContent =
                    "Password must be at least 6 characters.";

                error.style.display =
                    "block";

                return;

            }


            // =================================================
            // GET EXISTING USERS
            // =================================================

            const users =
                getUsers();


            // =================================================
            // CHECK EMAIL
            // =================================================

            const existingUser =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase()
                );


            if (existingUser) {

                error.textContent =
                    "An account with this email already exists.";

                error.style.display =
                    "block";

                return;

            }


            // =================================================
            // CREATE USER
            // =================================================

            const newUser = {

                id:
                    Date.now(),

                name:
                    name,

                email:
                    email,

                password:
                    password,

                type:
                    userType,


                // =================================================
                // BUSINESS VERIFICATION
                // =================================================
                //
                // Businesses are automatically verified
                // as requested.
                //
                // Customers don't need business verification.
                // =================================================

                verified:
                    userType === "business",


                verificationStatus:
                    userType === "business"
                    ? "verified"
                    : null,


                // =================================================
                // BUSINESS INFORMATION
                // =================================================

                businessName:
                    userType === "business"
                    ? name
                    : null,

                gstNumber:
                    userType === "business"
                    ? ""
                    : null,

                panNumber:
                    userType === "business"
                    ? ""
                    : null,

                businessCategory:
                    userType === "business"
                    ? ""
                    : null,

                businessAddress:
                    userType === "business"
                    ? ""
                    : null,


                // =================================================
                // ACCOUNT DATA
                // =================================================

                createdAt:
                    new Date().toISOString()

            };


            // =================================================
            // SAVE USER
            // =================================================

            users.push(
                newUser
            );


            saveUsers(
                users
            );


            // =================================================
            // AUTOMATIC LOGIN
            // =================================================

            localStorage.setItem(
                "tradehub_current_user",
                JSON.stringify(
                    newUser
                )
            );


            // =================================================
            // REDIRECT
            // =================================================

            redirectAfterLogin(
                newUser
            );

        }
    );

}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // =================================================
            // GET FORM VALUES
            // =================================================

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const error =
                document.getElementById(
                    "loginError"
                );


            // =================================================
            // GET USERS
            // =================================================

            const users =
                getUsers();


            // =================================================
            // FIND USER
            // =================================================

            const user =
                users.find(
                    user =>
                        user.email.toLowerCase() ===
                        email.toLowerCase() &&
                        user.password ===
                        password
                );


            // =================================================
            // INVALID LOGIN
            // =================================================

            if (!user) {

                error.textContent =
                    "Invalid email or password.";

                error.style.display =
                    "block";

                return;

            }


            // =================================================
            // UPDATE OLD BUSINESS ACCOUNTS
            // =================================================
            //
            // This makes previously-created business
            // accounts automatically verified too.
            // =================================================

            if (
                user.type === "business"
            ) {

                user.verified =
                    true;

                user.verificationStatus =
                    "verified";

            }


            // =================================================
            // SAVE UPDATED USER
            // =================================================

            const userIndex =
                users.findIndex(
                    item =>
                        item.id ===
                        user.id
                );


            if (
                userIndex !== -1
            ) {

                users[userIndex] =
                    user;

                saveUsers(
                    users
                );

            }


            // =================================================
            // SAVE CURRENT USER
            // =================================================

            localStorage.setItem(
                "tradehub_current_user",
                JSON.stringify(
                    user
                )
            );


            // =================================================
            // REDIRECT
            // =================================================

            redirectAfterLogin(
                user
            );

        }
    );

}


// =====================================================
// GOOGLE LOGIN PLACEHOLDER
// =====================================================

const googleLogin =
    document.getElementById(
        "googleLogin"
    );


if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        function () {

            alert(
                "Google OAuth will be integrated later."
            );

        }
    );

}


// =====================================================
// GOOGLE REGISTER PLACEHOLDER
// =====================================================

const googleRegister =
    document.getElementById(
        "googleRegister"
    );


if (googleRegister) {

    googleRegister.addEventListener(
        "click",
        function () {

            alert(
                "Google OAuth will be integrated later."
            );

        }
    );

}