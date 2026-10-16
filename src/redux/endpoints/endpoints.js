// src/redux/endpoints/endpoints.js

export const endpoints = {
  // 1. Auth & User API
  auth: {
    registration: "register",
    login: "login",
    sendOtp: "new-otp",
    otpVerifyLogin: "otp-verify",
    logout: "logout",
    getUserProfile: "get-user-profile",
    updateUser: "update-user",
    updatePassword: "update-password",
    becomeSeller: "become-seller",
  },

  // 2. User Management (Admin)
  user: {
    getAllUsers: "get-list-users",
    getUserById: "get-user-profile",
    updateUserByAdmin: "update-user-by-admin",
    deleteUserByAdmin: "delete-user-by-admin",
    getActiveAuthors: "get-all-active-authors",
    getAuthorProfile: "author-profile",
  },

  // 3. Role & Permissions API
  role: {
    getAllRoles: "get-all-roles",
    getRoleById: "get-role-by-id",
    createRole: "create-role",
    updateRole: "update-role",
    deleteRole: "delete-role",
  },

  // 4. Category API
  category: {
    getAllCategories: "get-all-categories",
    getListCategories: "get-list-categories",
    getCategoryBySlug: "get-category-by-slug",
    getCategoryById: "get-category-by-id",
    createCategory: "create-category",
    updateCategory: "update-category",
    deleteCategory: "delete-category",
    toggleCategoryStatus: "toggle-category-status",
  },

  // 5. Subcategory (Dub category) API
  subcategory: {
    getAllSubcategories: "get-all-subcategories",
    getListSubcategories: "get-list-subcategories",
    getSubcategoryBySlug: "get-subcategory-by-slug",
    getSubcategoryById: "get-subcategory-by-id",
    createSubcategory: "create-subcategory",
    updateSubcategory: "update-subcategory",
    deleteSubcategory: "delete-subcategory",
    toggleSubcategoryStatus: "toggle-subcategory-status",
  },

  // 6. Product API
  product: {
    getAllProducts: "get-all-products",
    getSellerProducts: "get-seller-products",
    getProductById: "get-product-by-id",
    getProductBySlug: "get-product-by-slug",
    createProduct: "create-product",
    updateProduct: "update-product",
    deleteProduct: "delete-product",
    toggleProductStatus: "toggle-product-status",
  },

  // 7. Order API
  order: {
    createOrder: "create-order",
    getBuyerOrders: "get-buyer-orders",
    getSellerOrders: "get-seller-orders",
    getAllOrders: "get-all-orders",
    getOrderById: "get-order-by-id",
    buyPoints: "buy-points",
    getMyPoints: "my-points",
  },

  // 8. Earning & Escrow API
  earning: {
    getSellerEarnings: "get-seller-earnings",
    getAllEarnings: "get-all-earnings",
    releaseEscrow: "release-escrow",
  },

  // 9. Withdraw & Payouts API
  withdraw: {
    createWithdraw: "create-withdraw",
    getMyWithdrawals: "get-my-withdrawals",
    getAllWithdrawals: "get-all-withdrawals",
    updateWithdrawStatus: "update-withdraw-status",
  },

  // 10. Review API
  review: {
    createReview: "create-review",
    getBuyerReviews: "get-buyer-reviews",
    getProductReviews: "get-product-reviews",
    getStoreReviews: "get-store-reviews",
    getAdminReviews: "get-admin-reviews",
    approveReview: "approve-review",
    rejectReview: "reject-review",
    deleteReview: "delete-review",
    replyToReview: "reply-to-review",
  },

  // 11. Support & Dispute Tickets API
  support: {
    createTicket: "create-ticket",
    getMyTickets: "get-my-tickets",
    getTicketById: "get-ticket-by-id",
    replyTicket: "reply-ticket",
    getAllTickets: "get-all-tickets",
    updateTicketStatus: "update-ticket-status",
  },

  // 12. Store & Settings API
  store: {
    getStoreSettings: "get-store-settings",
    updateStoreSettings: "update-store-settings",
    getStoreBySlug: "get-store-by-slug",
    getAllStores: "get-all-stores",
    toggleStoreVerification: "toggle-store-verification",
  },

  setting: {
    getPlatformSettings: "get-platform-settings",
    updatePlatformSettings: "update-platform-settings",
    getSetting: "setting",
  },

  // Profile API
  profile: {
    profile: "profile",
  },

  // Pages & Contact
  pages: {
    contact: "contact",
  },

  // Tracking API
  tracking: {
    getTracking: "track",
  },
};
