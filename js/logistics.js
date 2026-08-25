/* =====================================================
   TRADEHUB LOGISTICS SYSTEM
   Complete frontend/localStorage logistics engine

   Supports:
   - Customer + business providers
   - Trucks, ships, boats, trains
   - Containers, godowns, warehouses, storage
   - Photo/data-url storage
   - Per km / day / hour / flat pricing
   - Listing CRUD
   - Booking creation
   - Booking management
   - Provider/customer ownership
   - Cross-tab synchronization
===================================================== */


/* =====================================================
   STORAGE KEYS
===================================================== */

const LOGISTICS_LISTINGS_KEY =
    "tradehub_logistics_listings";

const LOGISTICS_BOOKINGS_KEY =
    "tradehub_logistics_bookings";


/* =====================================================
   CURRENT USER
===================================================== */

function getLogisticsCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "tradehub_current_user"
            )
        );

    }
    catch (error) {

        console.error(
            "TradeHub Logistics: unable to read current user.",
            error
        );

        return null;

    }

}


/* =====================================================
   ID HELPERS
===================================================== */

function generateLogisticsId(
    prefix = "LOG"
) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.floor(
            Math.random() * 100000
        )
    );

}


function generateLogisticsBookingId() {

    return generateLogisticsId(
        "BOOK"
    );

}


/* =====================================================
   SAFE JSON HELPERS
===================================================== */

function readLogisticsStorage(
    key
) {

    try {

        const value =
            localStorage.getItem(
                key
            );


        if (!value) {
            return [];
        }


        const parsed =
            JSON.parse(
                value
            );


        return Array.isArray(
            parsed
        )
            ? parsed
            : [];

    }
    catch (error) {

        console.error(
            "TradeHub Logistics: storage read failed.",
            error
        );

        return [];

    }

}


function writeLogisticsStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                value
            )
        );


        return true;

    }
    catch (error) {

        console.error(
            "TradeHub Logistics: storage write failed.",
            error
        );


        alert(
            "TradeHub could not save this information. Your browser storage may be full."
        );


        return false;

    }

}


/* =====================================================
   LOGIN CHECK
===================================================== */

function requireLogisticsLogin() {

    const user =
        getLogisticsCurrentUser();


    if (!user) {

        alert(
            "Please login to use TradeHub Logistics."
        );


        window.location.href =
            "login.html";


        return null;

    }


    return user;

}


/* =====================================================
   LISTING READ / WRITE
===================================================== */

function getLogisticsListings() {

    return readLogisticsStorage(
        LOGISTICS_LISTINGS_KEY
    );

}


function saveLogisticsListings(
    listings
) {

    return writeLogisticsStorage(
        LOGISTICS_LISTINGS_KEY,
        Array.isArray(
            listings
        )
            ? listings
            : []
    );

}


/* =====================================================
   BOOKING READ / WRITE
===================================================== */

function getLogisticsBookings() {

    return readLogisticsStorage(
        LOGISTICS_BOOKINGS_KEY
    );

}


function saveLogisticsBookings(
    bookings
) {

    return writeLogisticsStorage(
        LOGISTICS_BOOKINGS_KEY,
        Array.isArray(
            bookings
        )
            ? bookings
            : []
    );

}


/* =====================================================
   PRICING TYPES
===================================================== */

function getLogisticsPricingTypes() {

    return [

        {
            value:
                "per_km",

            label:
                "₹ per Kilometer (transport)"

        },

        {
            value:
                "per_day",

            label:
                "₹ per Day (storage/rental)"

        },

        {
            value:
                "per_hour",

            label:
                "₹ per Hour"

        },

        {
            value:
                "flat",

            label:
                "Flat Rental Price"

        }

    ];

}


/* =====================================================
   LOGISTICS TYPES
===================================================== */

function getLogisticsTypes() {

    return [

        {
            value:
                "truck",

            label:
                "🚚 Truck",

            pricingType:
                "per_km"

        },

        {
            value:
                "ship",

            label:
                "🚢 Ship",

            pricingType:
                "per_km"

        },

        {
            value:
                "boat",

            label:
                "🚤 Boat",

            pricingType:
                "per_km"

        },

        {
            value:
                "train",

            label:
                "🚆 Train",

            pricingType:
                "per_km"

        },

        {
            value:
                "container",

            label:
                "📦 Container",

            pricingType:
                "per_day"

        },

        {
            value:
                "godown",

            label:
                "🏢 Godown / Warehouse",

            pricingType:
                "per_day"

        },

        {
            value:
                "warehouse",

            label:
                "🏭 Warehouse",

            pricingType:
                "per_day"

        },

        {
            value:
                "storage",

            label:
                "🏠 Storage Unit",

            pricingType:
                "per_day"

        }

    ];

}


/* =====================================================
   TYPE LABEL
===================================================== */

function getLogisticsTypeLabel(
    type
) {

    const labels = {

        truck:
            "Truck",

        ship:
            "Ship",

        boat:
            "Boat",

        train:
            "Train",

        container:
            "Container",

        godown:
            "Godown / Warehouse",

        warehouse:
            "Warehouse",

        storage:
            "Storage Unit"

    };


    const key =
        String(
            type || ""
        )
        .trim()
        .toLowerCase();


    return (
        labels[key] ||
        String(
            type || "Logistics Service"
        )
    );

}


/* =====================================================
   NORMALIZE LISTING
===================================================== */

function normalizeLogisticsListing(
    listing
) {

    if (!listing) {
        return null;
    }


    const normalized =
        {

            id:
                String(
                    listing.id ||
                    ""
                ),

            providerId:
                String(
                    listing.providerId ||
                    ""
                ),

            providerType:
                listing.providerType ||
                "",

            providerName:
                listing.providerName ||
                "TradeHub Provider",

            title:
                listing.title ||
                "Logistics Service",

            type:
                listing.type ||
                "truck",

            category:
                listing.category ||
                getLogisticsTypeLabel(
                    listing.type
                ),

            description:
                listing.description ||
                "",

            location:
                listing.location ||
                "",

            destination:
                listing.destination ||
                "",

            availability:
                listing.availability ||
                "available",

            availableFrom:
                listing.availableFrom ||
                "",

            pricingType:
                listing.pricingType ||
                "per_km",

            price:
                Number(
                    listing.price
                ) || 0,

            currency:
                listing.currency ||
                "INR",

            minimumBooking:
                Number(
                    listing.minimumBooking
                ) || 1,

            securityDeposit:
                Number(
                    listing.securityDeposit ??
                    listing.deposit ??
                    0
                ) || 0,

            capacity:
                listing.capacity ||
                "",

            capacityUnit:
                listing.capacityUnit ||
                "",

            vehicleModel:
                listing.vehicleModel ||
                "",

            vehicleYear:
                listing.vehicleYear ||
                "",

            vehicleCapacity:
                listing.vehicleCapacity ||
                "",

            vehicleFuel:
                listing.vehicleFuel ||
                "",

            vehicleNumber:
                listing.vehicleNumber ||
                "",

            dimensions:
                listing.dimensions ||
                "",

            storageArea:
                listing.storageArea ||
                "",

            storageSecurity:
                listing.storageSecurity ||
                "",

            storageFeatures:
                listing.storageFeatures ||
                "",

            photos:
                Array.isArray(
                    listing.photos
                )
                    ? listing.photos
                    : [],

            active:
                listing.active !== false,

            createdAt:
                listing.createdAt ||
                new Date().toISOString(),

            updatedAt:
                listing.updatedAt ||
                new Date().toISOString()

        };


    return normalized;

}


/* =====================================================
   CREATE LISTING
===================================================== */

function createLogisticsListing(
    data
) {

    const user =
        requireLogisticsLogin();


    if (!user) {
        return null;
    }


    if (
        !data ||
        !String(
            data.title || ""
        ).trim()
    ) {

        alert(
            "Please enter a logistics service name."
        );

        return null;

    }


    const title =
        String(
            data.title
        ).trim();


    const type =
        String(
            data.type || ""
        ).trim();


    const description =
        String(
            data.description || ""
        ).trim();


    const location =
        String(
            data.location || ""
        ).trim();


    if (!type) {

        alert(
            "Please select a logistics service type."
        );

        return null;

    }


    if (!description) {

        alert(
            "Please add a description."
        );

        return null;

    }


    if (!location) {

        alert(
            "Please enter the service location."
        );

        return null;

    }


    const price =
        Number(
            data.price
        );


    if (
        !Number.isFinite(
            price
        ) ||
        price <= 0
    ) {

        alert(
            "Please enter a valid rental price."
        );

        return null;

    }


    const listing =
        normalizeLogisticsListing({

            ...data,

            id:
                generateLogisticsId(
                    "LOG"
                ),

            providerId:
                user.id,

            providerType:
                user.type,

            providerName:
                user.businessName ||
                user.name ||
                "TradeHub Provider",

            title,

            type,

            description,

            location,

            price,

            active:
                true,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        });


    const listings =
        getLogisticsListings();


    listings.unshift(
        listing
    );


    if (
        !saveLogisticsListings(
            listings
        )
    ) {

        return null;

    }


    return listing;

}


/* =====================================================
   SAVE LISTING
   Compatibility helper used by listing pages.
===================================================== */

function saveLogisticsListing(
    listing
) {

    if (!listing) {
        return null;
    }


    /*
     * If the listing already has an ID belonging
     * to the current user, update it.
     */

    if (
        listing.id
    ) {

        const existing =
            getLogisticsListingById(
                listing.id
            );


        if (
            existing
        ) {

            return updateLogisticsListing(
                listing.id,
                listing
            );

        }

    }


    return createLogisticsListing(
        listing
    );

}


/* =====================================================
   GET LISTING BY ID
===================================================== */

function getLogisticsListingById(
    listingId
) {

    const id =
        String(
            listingId || ""
        ).trim();


    if (!id) {
        return null;
    }


    const listing =
        getLogisticsListings()
            .find(
                item =>
                    String(
                        item.id
                    ) === id
            );


    return listing
        ? normalizeLogisticsListing(
            listing
        )
        : null;

}


/* =====================================================
   UPDATE LISTING
===================================================== */

function updateLogisticsListing(
    listingId,
    updates
) {

    const user =
        requireLogisticsLogin();


    if (!user) {
        return null;
    }


    const listings =
        getLogisticsListings();


    const index =
        listings.findIndex(
            listing =>
                String(
                    listing.id
                ) ===
                String(
                    listingId
                )
        );


    if (
        index === -1
    ) {

        alert(
            "Logistics listing not found."
        );

        return null;

    }


    const listing =
        normalizeLogisticsListing(
            listings[index]
        );


    if (
        String(
            listing.providerId
        ) !==
        String(
            user.id
        )
    ) {

        alert(
            "You can only edit your own logistics listings."
        );

        return null;

    }


    const updated =
        normalizeLogisticsListing({

            ...listing,

            ...updates,

            id:
                listing.id,

            providerId:
                listing.providerId,

            providerType:
                listing.providerType,

            providerName:
                listing.providerName,

            updatedAt:
                new Date().toISOString()

        });


    listings[index] =
        updated;


    if (
        !saveLogisticsListings(
            listings
        )
    ) {

        return null;

    }


    return updated;

}


/* =====================================================
   DELETE LISTING
===================================================== */

function deleteLogisticsListing(
    listingId
) {

    const user =
        requireLogisticsLogin();


    if (!user) {
        return false;
    }


    const listings =
        getLogisticsListings();


    const listing =
        listings.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    listingId
                )
        );


    if (!listing) {

        alert(
            "Logistics listing not found."
        );

        return false;

    }


    if (
        String(
            listing.providerId
        ) !==
        String(
            user.id
        )
    ) {

        alert(
            "You can only delete your own logistics listings."
        );

        return false;

    }


    const filtered =
        listings.filter(
            item =>
                String(
                    item.id
                ) !==
                String(
                    listingId
                )
        );


    return saveLogisticsListings(
        filtered
    );

}


/* =====================================================
   AVAILABLE LISTINGS
===================================================== */

function getAvailableLogisticsListings() {

    return getLogisticsListings()
        .map(
            normalizeLogisticsListing
        )
        .filter(
            listing => {

                if (
                    !listing.active
                ) {
                    return false;
                }


                return (
                    String(
                        listing.availability
                    ).toLowerCase() !==
                    "unavailable"
                );

            }
        );

}


/* =====================================================
   TYPE FILTER
===================================================== */

function getLogisticsListingsByType(
    type
) {

    const key =
        String(
            type || ""
        )
        .trim()
        .toLowerCase();


    return getAvailableLogisticsListings()
        .filter(
            listing =>
                String(
                    listing.type
                ).toLowerCase() ===
                key
        );

}


/* =====================================================
   MY LISTINGS
===================================================== */

function getMyLogisticsListings() {

    const user =
        getLogisticsCurrentUser();


    if (!user) {
        return [];
    }


    return getLogisticsListings()
        .map(
            normalizeLogisticsListing
        )
        .filter(
            listing =>
                String(
                    listing.providerId
                ) ===
                String(
                    user.id
                )
        );

}


/* =====================================================
   SEARCH
===================================================== */

function searchLogisticsListings(
    searchTerm
) {

    const term =
        String(
            searchTerm || ""
        )
        .trim()
        .toLowerCase();


    const listings =
        getAvailableLogisticsListings();


    if (!term) {
        return listings;
    }


    return listings.filter(
        listing => {

            const searchable =
                [

                    listing.title,
                    listing.type,
                    listing.category,
                    listing.description,
                    listing.location,
                    listing.destination,
                    listing.vehicleModel,
                    listing.vehicleCapacity,
                    listing.capacity,
                    listing.storageFeatures

                ]
                .join(" ")
                .toLowerCase();


            return searchable.includes(
                term
            );

        }
    );

}


/* =====================================================
   IMAGE FILE HELPERS
===================================================== */

function logisticsFileToDataURL(
    file
) {

    return new Promise(
        function(
            resolve,
            reject
        ) {

            if (!file) {

                resolve(
                    ""
                );

                return;

            }


            if (
                !file.type ||
                !file.type.startsWith(
                    "image/"
                )
            ) {

                reject(
                    new Error(
                        "Only image files are allowed."
                    )
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function() {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Unable to read image."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


async function logisticsFilesToDataURLs(
    files
) {

    const array =
        Array.from(
            files || []
        );


    const results = [];


    for (
        const file of array
    ) {

        try {

            const image =
                await logisticsFileToDataURL(
                    file
                );


            if (image) {

                results.push(
                    image
                );

            }

        }
        catch (error) {

            console.error(
                error
            );

        }

    }


    return results;

}


/* =====================================================
   COST CALCULATION
===================================================== */

function calculateLogisticsCost(
    listing,
    quantity
) {

    if (!listing) {
        return 0;
    }


    const price =
        Number(
            listing.price
        ) || 0;


    const amount =
        Number(
            quantity
        );


    if (
        !Number.isFinite(
            amount
        ) ||
        amount < 0
    ) {

        return 0;

    }


    return (
        price *
        amount
    );

}


function formatLogisticsCurrency(
    amount
) {

    const value =
        Number(
            amount
        ) || 0;


    return (
        "₹" +
        value.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        )
    );

}


function formatLogisticsPricing(
    listing
) {

    if (!listing) {
        return "";
    }


    const price =
        formatLogisticsCurrency(
            listing.price
        );


    const units = {

        per_km:
            " / km",

        per_day:
            " / day",

        per_hour:
            " / hour",

        flat:
            " flat"

    };


    return (
        price +
        (
            units[
                listing.pricingType
            ] ||
            ""
        )
    );

}


/* =====================================================
   BOOKING NORMALIZATION
===================================================== */

function normalizeLogisticsBooking(
    booking
) {

    if (!booking) {
        return null;
    }


    const baseCost =
        Number(
            booking.baseCost ??
            booking.estimatedCost ??
            0
        ) || 0;


    const securityDeposit =
        Number(
            booking.securityDeposit ??
            booking.deposit ??
            0
        ) || 0;


    const pricingType =
        String(
            booking.pricingType ||
            ""
        ).trim().toLowerCase();


    /*
     * The billable unit depends on the pricing model.
     *
     * Transport:
     *   per_km  -> distance
     *
     * Storage/rental:
     *   per_day -> days
     *   per_hour -> hours
     *
     * Flat:
     *   flat -> quantity / unit count
     *
     * Older bookings may have these values stored
     * under different fields, so the fallbacks below
     * keep them compatible.
     */

    let unitCount = 0;


    if (
        pricingType === "per_km"
    ) {

        unitCount =
            Number(
                booking.distance ??
                booking.unitCount ??
                booking.quantity ??
                0
            ) || 0;

    }
    else if (
        pricingType === "per_day"
    ) {

        unitCount =
            Number(
                booking.days ??
                booking.unitCount ??
                booking.quantity ??
                0
            ) || 0;

    }
    else if (
        pricingType === "per_hour"
    ) {

        unitCount =
            Number(
                booking.hours ??
                booking.unitCount ??
                booking.quantity ??
                0
            ) || 0;

    }
    else {

        unitCount =
            Number(
                booking.unitCount ??
                booking.quantity ??
                1
            ) || 0;

    }


    /*
     * If an older booking does not have pricePerUnit,
     * recover it from baseCost / billable units.
     */
    let pricePerUnit =
        Number(
            booking.pricePerUnit ??
            booking.unitPrice ??
            booking.price ??
            0
        ) || 0;


    if (
        pricePerUnit <= 0 &&
        unitCount > 0 &&
        baseCost > 0
    ) {

        pricePerUnit =
            baseCost /
            unitCount;

    }


    const quantityValue =
        Number(
            booking.quantity
        );


    const normalizedQuantity =
        Number.isFinite(
            quantityValue
        ) && quantityValue > 0
            ? quantityValue
            : unitCount;


    return {

        id:
            String(
                booking.id ||
                ""
            ),

        listingId:
            String(
                booking.listingId ||
                ""
            ),

        providerId:
            String(
                booking.providerId ||
                ""
            ),

        providerType:
            booking.providerType ||
            "",

        providerName:
            booking.providerName ||
            "TradeHub Provider",

        renterId:
            String(
                booking.renterId ||
                ""
            ),

        renterType:
            booking.renterType ||
            "",

        renterName:
            booking.renterName ||
            "TradeHub User",

        serviceTitle:
            booking.serviceTitle ||
            "Logistics Service",

        serviceType:
            booking.serviceType ||
            "",

        pricingType,

        unitCount,

        unitLabel:
            booking.unitLabel ||
            (
                pricingType === "per_km"
                    ? "km"
                    : pricingType === "per_day"
                        ? "day"
                        : pricingType === "per_hour"
                            ? "hour"
                            : "unit"
            ),

        pricePerUnit,

        baseCost,

        estimatedCost:
            Number(
                booking.estimatedCost ??
                baseCost
            ) || 0,

        securityDeposit,

        totalCost:
            Number(
                booking.totalCost ??
                (
                    baseCost +
                    securityDeposit
                )
            ) || 0,

        distance:
            Number.isFinite(
                Number(
                    booking.distance
                )
            )
                ? Number(
                    booking.distance
                )
                : null,

        days:
            Number.isFinite(
                Number(
                    booking.days
                )
            )
                ? Number(
                    booking.days
                )
                : null,

        hours:
            Number.isFinite(
                Number(
                    booking.hours
                )
            )
                ? Number(
                    booking.hours
                )
                : null,

        quantity:
            normalizedQuantity,

        pickupLocation:
            booking.pickupLocation ||
            "",

        deliveryLocation:
            booking.deliveryLocation ||
            "",

        bookingDate:
            booking.bookingDate ||
            booking.startDate ||
            "",

        startDate:
            booking.startDate ||
            booking.bookingDate ||
            "",

        endDate:
            booking.endDate ||
            "",

        notes:
            booking.notes ||
            "",

        status:
            booking.status ||
            "pending",

        createdAt:
            booking.createdAt ||
            new Date().toISOString(),

        updatedAt:
            booking.updatedAt ||
            new Date().toISOString()

    };

}


/* =====================================================
   CREATE BOOKING
===================================================== */

function createLogisticsBooking(
    listingId,
    bookingData = {}
) {

    const user =
        requireLogisticsLogin();


    if (!user) {
        return null;
    }


    const listing =
        getLogisticsListingById(
            listingId
        );


    if (!listing) {

        alert(
            "Logistics service not found."
        );

        return null;

    }


    /*
     * A provider cannot book their own service.
     */

    if (
        String(
            listing.providerId
        ) ===
        String(
            user.id
        )
    ) {

        alert(
            "You cannot book your own logistics service."
        );

        return null;

    }


    if (
        !listing.active ||
        String(
            listing.availability
        ).toLowerCase() ===
        "unavailable"
    ) {

        alert(
            "This logistics service is currently unavailable."
        );

        return null;

    }


    const pricingType =
        String(
            listing.pricingType ||
            ""
        ).trim().toLowerCase();


    /*
     * Determine the actual billable quantity from
     * the pricing model.
     *
     * per_km  -> distance
     * per_day -> days
     * per_hour -> hours
     * flat    -> quantity
     */

    let billableQuantity = 0;


    if (
        pricingType === "per_km"
    ) {

        billableQuantity =
            Number(
                bookingData.distance ??
                bookingData.quantity
            );

    }
    else if (
        pricingType === "per_day"
    ) {

        billableQuantity =
            Number(
                bookingData.days ??
                bookingData.quantity
            );

    }
    else if (
        pricingType === "per_hour"
    ) {

        billableQuantity =
            Number(
                bookingData.hours ??
                bookingData.quantity
            );

    }
    else {

        billableQuantity =
            Number(
                bookingData.quantity
            );

    }


    if (
        !Number.isFinite(
            billableQuantity
        ) ||
        billableQuantity <= 0
    ) {

        const unitMessage =
            pricingType === "per_km"
                ? "distance in kilometers"
                : pricingType === "per_day"
                    ? "number of days"
                    : pricingType === "per_hour"
                        ? "number of hours"
                        : "rental quantity";


        alert(
            `Please enter a valid ${unitMessage}.`
        );

        return null;

    }


    const minimum =
        Number(
            listing.minimumBooking
        ) || 1;


    if (
        billableQuantity <
        minimum
    ) {

        const unitName =
            pricingType === "per_km"
                ? "km"
                : pricingType === "per_day"
                    ? "day(s)"
                    : pricingType === "per_hour"
                        ? "hour(s)"
                        : "unit(s)";


        alert(
            `Minimum booking is ${minimum} ${unitName}.`
        );

        return null;

    }


    /*
     * Calculate the base price from the actual
     * billable quantity, not just quantity: 1.
     */

    const baseCost =
        calculateLogisticsCost(
            listing,
            billableQuantity
        );


    const deposit =
        Number(
            listing.securityDeposit
        ) || 0;


    const now =
        new Date();


    /*
     * Keep an explicit booking/start date when supplied.
     * For bookings without a date, use the creation date
     * so the booking never displays an unexplained blank
     * start date.
     */

    const bookingDate =
        bookingData.bookingDate ||
        bookingData.startDate ||
        now.toISOString();


    const startDate =
        bookingData.startDate ||
        bookingDate;


    /*
     * For day-based rentals, if the form supplies a
     * duration but no end date, calculate the end date.
     *
     * Example:
     * 5 days starting 25 Aug -> 30 Aug.
     */

    let endDate =
        bookingData.endDate ||
        "";


    if (
        !endDate &&
        pricingType === "per_day" &&
        Number(
            bookingData.days
        ) > 0
    ) {

        const calculatedEnd =
            new Date(
                startDate
            );


        if (
            !Number.isNaN(
                calculatedEnd.getTime()
            )
        ) {

            calculatedEnd.setDate(
                calculatedEnd.getDate() +
                Number(
                    bookingData.days
                ) -
                1
            );


            endDate =
                calculatedEnd.toISOString();

        }

    }


    const booking =
        normalizeLogisticsBooking({

            id:
                generateLogisticsBookingId(),

            listingId:
                listing.id,

            providerId:
                listing.providerId,

            providerType:
                listing.providerType,

            providerName:
                listing.providerName,

            renterId:
                user.id,

            renterType:
                user.type,

            renterName:
                user.businessName ||
                user.name ||
                "TradeHub User",

            serviceTitle:
                listing.title,

            serviceType:
                listing.type,

            pricingType,

            unitCount:
                billableQuantity,

            unitLabel:
                pricingType === "per_km"
                    ? "km"
                    : pricingType === "per_day"
                        ? "day"
                        : pricingType === "per_hour"
                            ? "hour"
                            : "unit",

            pricePerUnit:
                Number(
                    listing.price
                ) || 0,

            baseCost,

            estimatedCost:
                baseCost,

            securityDeposit:
                deposit,

            totalCost:
                baseCost +
                deposit,

            pickupLocation:
                bookingData.pickupLocation ||
                "",

            deliveryLocation:
                bookingData.deliveryLocation ||
                "",

            bookingDate,

            startDate,

            endDate,

            distance:
                pricingType === "per_km"
                    ? billableQuantity
                    : (
                        bookingData.distance ??
                        null
                    ),

            days:
                pricingType === "per_day"
                    ? billableQuantity
                    : (
                        bookingData.days ??
                        null
                    ),

            hours:
                pricingType === "per_hour"
                    ? billableQuantity
                    : (
                        bookingData.hours ??
                        null
                    ),

            quantity:
                billableQuantity,

            notes:
                bookingData.notes ||
                "",

            status:
                "pending",

            createdAt:
                now.toISOString(),

            updatedAt:
                now.toISOString()

        });


    const bookings =
        getLogisticsBookings();


    bookings.unshift(
        booking
    );


    if (
        !saveLogisticsBookings(
            bookings
        )
    ) {

        return null;

    }


    return booking;

}



/* =====================================================
   SAVE BOOKING
   Compatibility helper used by details page.
===================================================== */

function saveLogisticsBooking(
    booking
) {

    if (!booking) {
        return null;
    }


    const bookings =
        getLogisticsBookings();


    const index =
        bookings.findIndex(
            item =>
                String(
                    item.id
                ) ===
                String(
                    booking.id
                )
        );


    /*
     * If it already exists, update it.
     */

    if (
        index !== -1
    ) {

        bookings[index] =
            normalizeLogisticsBooking(
                {
                    ...bookings[index],
                    ...booking,
                    updatedAt:
                        new Date().toISOString()
                }
            );

    }
    else {

        /*
         * The details page supplies all ownership
         * information itself, so preserve it.
         */

        bookings.unshift(
            normalizeLogisticsBooking(
                booking
            )
        );

    }


    if (
        !saveLogisticsBookings(
            bookings
        )
    ) {

        return null;

    }


    return normalizeLogisticsBooking(
        bookings[
            index === -1
                ? 0
                : index
        ]
    );

}


/* =====================================================
   GET BOOKING BY ID
===================================================== */

function getLogisticsBookingById(
    bookingId
) {

    const booking =
        getLogisticsBookings()
            .find(
                item =>
                    String(
                        item.id
                    ) ===
                    String(
                        bookingId
                    )
            );


    return booking
        ? normalizeLogisticsBooking(
            booking
        )
        : null;

}


/* =====================================================
   MY BOOKINGS
===================================================== */

function getMyLogisticsBookings() {

    const user =
        getLogisticsCurrentUser();


    if (!user) {
        return [];
    }


    return getLogisticsBookings()
        .map(
            normalizeLogisticsBooking
        )
        .filter(
            booking =>
                String(
                    booking.renterId
                ) ===
                String(
                    user.id
                )
        );

}


/* =====================================================
   RECEIVED BOOKINGS
===================================================== */

function getReceivedLogisticsBookings() {

    const user =
        getLogisticsCurrentUser();


    if (!user) {
        return [];
    }


    return getLogisticsBookings()
        .map(
            normalizeLogisticsBooking
        )
        .filter(
            booking =>
                String(
                    booking.providerId
                ) ===
                String(
                    user.id
                )
        );

}


/* =====================================================
   BOOKING STATUS HELPERS
===================================================== */

function isTransportLogisticsBooking(
    booking
) {

    if (!booking) {
        return false;
    }


    const transportTypes = [
        "truck",
        "ship",
        "boat",
        "train"
    ];


    return transportTypes.includes(
        String(
            booking.serviceType || ""
        ).toLowerCase()
    );

}


function getLogisticsBookingStatusLabel(
    status
) {

    const labels = {

        pending:
            "Booking Requested",

        confirmed:
            "Confirmed",

        vehicle_assigned:
            "Vehicle Assigned",

        picked_up:
            "Picked Up",

        in_transit:
            "In Transit",

        arrived:
            "Arrived",

        active:
            "Service Active",

        completed:
            "Completed",

        cancelled:
            "Cancelled"

    };


    const key =
        String(
            status || "pending"
        ).toLowerCase();


    return (
        labels[key] ||
        "Booking Requested"
    );

}


function getLogisticsBookingStatusIcon(
    status
) {

    const icons = {

        pending: "📝",

        confirmed: "✓",

        vehicle_assigned: "🚚",

        picked_up: "📦",

        in_transit: "🚚",

        arrived: "📍",

        active: "🔄",

        completed: "✓",

        cancelled: "✕"

    };


    const key =
        String(
            status || "pending"
        ).toLowerCase();


    return (
        icons[key] ||
        "•"
    );

}


/* =====================================================
   UPDATE BOOKING STATUS
===================================================== */

function updateLogisticsBookingStatus(
    bookingId,
    newStatus
) {

    const user =
        requireLogisticsLogin();


    if (!user) {
        return null;
    }


    const allowedStatuses = [

        "pending",
        "confirmed",
        "vehicle_assigned",
        "picked_up",
        "in_transit",
        "arrived",
        "active",
        "completed",
        "cancelled"

    ];


    const status =
        String(
            newStatus || ""
        )
        .trim()
        .toLowerCase();


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        alert(
            "Invalid logistics booking status."
        );

        return null;

    }


    const bookings =
        getLogisticsBookings();


    const index =
        bookings.findIndex(
            booking =>
                String(
                    booking.id
                ) ===
                String(
                    bookingId
                )
        );


    if (
        index === -1
    ) {

        alert(
            "Booking not found."
        );

        return null;

    }


    const booking =
        normalizeLogisticsBooking(
            bookings[index]
        );


    /*
     * Keep the lifecycle in a sensible order.
     * Cancellation remains available to the renter/provider
     * according to the existing permission rules.
     */

    const transport =
        isTransportLogisticsBooking(
            booking
        );


    const transitions = {

        pending: [
            "confirmed",
            "cancelled"
        ],

        confirmed:
            transport
                ? [
                    "vehicle_assigned",
                    "picked_up",
                    "in_transit",
                    "arrived",
                    "completed",
                    "cancelled"
                ]
                : [
                    "active",
                    "completed",
                    "cancelled"
                ],

        vehicle_assigned: [
            "picked_up",
            "cancelled"
        ],

        picked_up: [
            "in_transit",
            "arrived",
            "completed",
            "cancelled"
        ],

        in_transit: [
            "arrived",
            "completed",
            "cancelled"
        ],

        arrived: [
            "completed",
            "cancelled"
        ],

        active: [
            "completed",
            "cancelled"
        ],

        completed: [],

        cancelled: []

    };


    const currentStatus =
        String(
            booking.status ||
            "pending"
        ).toLowerCase();


    if (
        status !== "cancelled" &&
        currentStatus !== status &&
        !(
            transitions[currentStatus] ||
            []
        ).includes(
            status
        )
    ) {

        alert(
            `Cannot change booking from "${getLogisticsBookingStatusLabel(
                currentStatus
            )}" to "${getLogisticsBookingStatusLabel(
                status
            )}".`
        );

        return null;

    }


    /*
     * Provider can manage the booking lifecycle.
     */

    if (
        String(
            booking.providerId
        ) ===
        String(
            user.id
        )
    ) {

        booking.status =
            status;

    }

    /*
     * Renter can only cancel their own booking.
     */

    else if (
        String(
            booking.renterId
        ) ===
        String(
            user.id
        ) &&
        status === "cancelled"
    ) {

        booking.status =
            "cancelled";

    }
    else {

        alert(
            "You are not allowed to change this booking status."
        );

        return null;

    }


    booking.updatedAt =
        new Date().toISOString();


    bookings[index] =
        booking;


    if (
        !saveLogisticsBookings(
            bookings
        )
    ) {

        return null;

    }


    return booking;

}


/* =====================================================
   CANCEL BOOKING
===================================================== */

function cancelLogisticsBooking(
    bookingId
) {

    return updateLogisticsBookingStatus(
        bookingId,
        "cancelled"
    );

}


/* =====================================================
   ICON HELPER
===================================================== */

function getLogisticsIcon(
    type
) {

    const icons = {

        truck: "🚚",
        ship: "🚢",
        boat: "🚤",
        train: "🚆",
        container: "📦",
        godown: "🏢",
        warehouse: "🏭",
        storage: "🏠"

    };


    return (
        icons[
            String(
                type || ""
            ).toLowerCase()
        ] ||
        "🚚"
    );

}


/* =====================================================
   CROSS-TAB SYNCHRONIZATION
===================================================== */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key ===
                LOGISTICS_LISTINGS_KEY ||
            event.key ===
                LOGISTICS_BOOKINGS_KEY
        ) {

            window.dispatchEvent(
                new CustomEvent(
                    "tradehubLogisticsUpdated"
                )
            );

        }

    }
);