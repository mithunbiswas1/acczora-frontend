// src/redux/endpoints/endpoints.js

export const endpoints = {
  //Auth API
  auth: {
    registration: "register",
    login: "login",
    sendOtp: "new-otp",
    otpVerifyLogin: "otp-verify",
  },

  // Order endpoints
  order: {
    createOrder: "create-order",
  },

  // Category API
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

  // Subcategory API
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

  // Product API
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

  //Product Review
  productReview: {
    productReview: "product-review",
  },

  //Profile API
  profile: {
    profile: "profile",
  },

  //Pages API
  pages: {
    contact: "contact",
  },

  //Setting API
  setting: {
    getSetting: "setting",
  },
  //Tracking API
  tracking: {
    getTracking: "track",
  },
};
