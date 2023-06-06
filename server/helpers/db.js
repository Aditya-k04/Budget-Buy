const mysql = require('promise-mysql');
const md5 = require('md5');

const config = {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'budgetbuy'
};

const query = async (QUERY) => {
    try {
        const connection = await mysql.createConnection(config);
        const result = await connection.query(QUERY);
        connection.end();
        return result;        
    } catch (error) {
        console.log("My SQL connection issue has ",error);
        return error;
    }    
}

const getAdminDetails = async (email) => {
    let isAdminQuery = "SELECT * FROM tbl_user_auth WHERE email = '"+email+"'";
    const isAdminResult = await query(isAdminQuery);
    return isAdminResult;
}

const isStudentExist = async (reqBody) => {
    const adminInfo = await getAdminDetails(reqBody.email);
    if(adminInfo.length > 0 && adminInfo[0]?.is_admin) {        
        return adminInfo;
    } else {
        let isUserQuery = "SELECT tbl_user_auth.id, tbl_user_auth.first_name, tbl_user_auth.last_name, tbl_user_auth.email, tbl_user_auth.is_admin, tbl_profile.is_verified, tbl_profile.prn, tbl_profile.document, tbl_profile.phone FROM tbl_user_auth JOIN tbl_profile ON tbl_profile.stud_id = tbl_user_auth.id WHERE tbl_user_auth.email = '"+reqBody.email+"' OR tbl_profile.prn = '"+reqBody.prn+"'";
        const isUserResult = await query(isUserQuery);
        console.log("isUserResult ",isUserResult.length);
        return isUserResult;
    }
}

const studentInsert = async (reqBody, studDoc) => {
    let isUserInsertQuery = "INSERT INTO tbl_user_auth(first_name, last_name, email, password) VALUES('"+reqBody.first_name+"', '"+reqBody.last_name+"', '"+reqBody.email+"','"+md5(reqBody.password)+"')";
    const isUserInsertResult = await query(isUserInsertQuery);
    console.log("isUserInsertResult :: ",isUserInsertResult);
    if(isUserInsertResult?.affectedRows) {
        let UserProfileInsertQuery = "INSERT INTO tbl_profile(stud_id, phone, prn, document) VALUES('"+isUserInsertResult?.insertId+"', "+reqBody.contact_no+", '"+reqBody.prn+"', '"+studDoc+"')";
        const UserProfileInsertResult = await query(UserProfileInsertQuery);
        return UserProfileInsertResult;
    }
}

const getCurrentStudentProfile = async (reqQuery) => {
    let getCurrentUserProfileQuery = "SELECT * FROM tbl_profile WHERE stud_id = "+reqQuery?.student_id;
    const getCurrentUserProfileResult = await query(getCurrentUserProfileQuery);
    return getCurrentUserProfileResult;
}

const updateStudentProfile = async (reqBody) => {
    let updateAuthQuery = "UPDATE tbl_user_auth SET first_name = '"+reqBody.first_name+"', last_name = '"+reqBody.last_name+"', email = '"+reqBody.email+"', modified_at = now() WHERE id = "+reqBody.id;
    const updateAuthResult = await query(updateAuthQuery);
    if(updateAuthResult?.affectedRows && !reqBody.is_admin) {
        console.log("profile updating: ",reqBody.is_admin);
        let updateProfileQuery = "UPDATE tbl_profile SET gender = '"+reqBody.gender+"', address = '"+reqBody.address+"', landmark = '"+reqBody.landmark+"', city = '"+reqBody.city+"', state = '"+reqBody.state+"', pincode = '"+reqBody.pincode+"', phone = "+parseInt(reqBody.contact_no)+", modified_at = now() WHERE stud_id = "+reqBody.id;    
        const updateProfileResult = await query(updateProfileQuery);
        return updateProfileResult;
    } else {
        console.log("auth updating: ",reqBody.is_admin);
        return updateAuthResult;
    }
}

const getSingleCategory = async (category) => {
    let getCategoryQuery = "SELECT * FROM tbl_category WHERE category = '"+category+"'";
    const getCategoryResult = await query(getCategoryQuery);
    return getCategoryResult;
}

const getAllCategory = async () => {
    let getCategoryQuery = "SELECT * FROM tbl_category";
    const getCategoryResult = await query(getCategoryQuery);
    return getCategoryResult;
}

const insertCategory = async (category) => {
    let addCategoryQuery = "INSERT INTO tbl_category(category) VALUES('"+category+"')";
    const insertCategory = await query(addCategoryQuery);
    return insertCategory;
}

const updateCategory = async (category, id) => {
    let updateCategoryQuery = "UPDATE tbl_category SET category = '"+category+"', modified_at = NOW() WHERE id = "+id;
    const updateCategory = await query(updateCategoryQuery);
    return updateCategory;
}

const deleteCategory = async (id) => {
    let deleteCategoryQuery = "DELETE FROM tbl_category WHERE id = "+id;
    const deletedCategory = await query(deleteCategoryQuery);
    return deletedCategory;
}

const getVerifyStudents = async () => {
    let getVerifyStudentsQuery = "SELECT tbl_user_auth.id, tbl_user_auth.first_name, tbl_user_auth.last_name, tbl_user_auth.email, tbl_profile.stud_id, tbl_profile.document, tbl_profile.is_verified, tbl_profile.gender FROM tbl_user_auth JOIN tbl_profile ON tbl_profile.stud_id = tbl_user_auth.id";
    const getVerifyStudentsResult = query(getVerifyStudentsQuery);
    return getVerifyStudentsResult;
}

const verifiedStudentStatus = async (studId) => {
    let verifyStudentQuery = "UPDATE tbl_profile SET is_verified = 1 WHERE stud_id = "+studId;
    const verifyStudentResult = await query(verifyStudentQuery);
    return verifyStudentResult;
}

const deleteStudent = async (studId) => {
    let deleteStudentProfileQuery = "DELETE FROM tbl_profile WHERE stud_id = "+studId;
    const deleteStudentProfileResult = await query(deleteStudentProfileQuery);
    if(deleteStudentProfileResult?.affectedRows) {        
        let deleteStudentQuery = "DELETE FROM tbl_user_auth WHERE id = "+studId;
        const deleteStudentResult = await query(deleteStudentQuery);
        return deleteStudentResult;
    }
}

const getAllProduct = async () => {
    let getAllStudentQuery = "SELECT tbl_products.id, tbl_products.stud_id, tbl_products.category_id, tbl_products.title, tbl_products.images, tbl_products.description, tbl_products.tags, tbl_products.use_time, tbl_products.price, tbl_products.status, tbl_products.created_at, tbl_category.category, tbl_user_auth.first_name, tbl_user_auth.last_name, tbl_user_auth.email, tbl_profile.phone FROM tbl_products JOIN tbl_category ON tbl_category.id = tbl_products.category_id JOIN tbl_user_auth ON tbl_user_auth.id = tbl_products.stud_id JOIN tbl_profile ON tbl_profile.stud_id = tbl_products.stud_id";
    const getAllStudentResult = await query(getAllStudentQuery);
    return getAllStudentResult;
}

const getAllStudentProducts = async (student_id) => {
    let getAllStudentProductsQuery = "SELECT tbl_products.id, tbl_products.stud_id, tbl_products.category_id, tbl_products.title, tbl_products.images, tbl_products.description, tbl_products.tags, tbl_products.use_time, tbl_products.price, tbl_products.status, tbl_products.created_at, tbl_category.category FROM tbl_products JOIN tbl_category ON tbl_category.id = tbl_products.category_id WHERE stud_id = "+student_id;
    const getAllStudentProductsResult = await query(getAllStudentProductsQuery);
    return getAllStudentProductsResult;
}

const getVerifiedStudentProducts = async () => {
    let getVerifiedStudentProductsQuery = "SELECT tbl_products.id, tbl_products.stud_id, tbl_products.category_id, tbl_products.title, tbl_products.images, tbl_products.description, tbl_products.tags, tbl_products.use_time, tbl_products.price, tbl_products.status, tbl_products.created_at, tbl_category.category, tbl_profile.is_verified FROM tbl_products JOIN tbl_category ON tbl_category.id = tbl_products.category_id JOIN tbl_user_auth ON tbl_user_auth.id = tbl_products.stud_id JOIN tbl_profile ON tbl_profile.stud_id = tbl_products.stud_id WHERE tbl_profile.is_verified = 1";
    const getVerifiedStudentProductsResult = await query(getVerifiedStudentProductsQuery);
    return getVerifiedStudentProductsResult;
}

const productInsert = async (reqBody, images) => {
    let insertProductQuery = "INSERT INTO tbl_products(stud_id, category_id, title, images, description, tags, use_time, price, status) VALUES("+reqBody.stud_id+", "+reqBody.category_id+", '"+reqBody.product_title+"', '"+images+"', '"+reqBody.product_description+"', '"+reqBody.product_tags+"', '"+reqBody.used_time+"', '"+reqBody.product_price+"', '"+reqBody.status+"')";
    const insertProductResult = await query(insertProductQuery);
    return insertProductResult;
}

const productUpdate = async (reqBody, images) => {
    let updateProductQuery = "UPDATE tbl_products SET category_id = "+reqBody.category_id+", title = '"+reqBody.product_title+"', images = '"+images.toString()+"', description = '"+reqBody.product_description+"', tags = '"+reqBody.product_tags+"', use_time = '"+reqBody.used_time+"', price = '"+reqBody.product_price+"', status = "+parseInt(reqBody.status)+" WHERE id = "+reqBody.id;
    const updateProductResult = await query(updateProductQuery);
    return updateProductResult;
}

const productDelete = async (productId) => {
    let deleteProductQuery = "DELETE FROM tbl_products WHERE id = "+productId;
    const deleteProductResult = await query(deleteProductQuery);
    return deleteProductResult;
}

const placedOrderResult = async (orderDetails, orderBy) => {
    let newOrderQuery = "INSERT INTO tbl_orders(seller_id, user_id, product_id, product_name, images, price) VALUES("+orderDetails?.stud_id+", "+orderBy+", "+orderDetails?.id+", '"+orderDetails?.title+"', '"+orderDetails?.images+"', '"+orderDetails?.price+"')";
    const newOrderResult = await query(newOrderQuery);
    if(newOrderResult?.affectedRows){
        let updateProductQuery = "UPDATE tbl_products SET status = 2 WHERE id = "+orderDetails.id;
        const updateProductResult = await query(updateProductQuery);
        console.log(`${updateProductResult.affectedRows} product status updated!`);
    }
    return newOrderResult;
}

const getAllUserOrders = async (userId) => {
    let getOrdersQuery = "SELECT tbl_orders.id, tbl_orders.seller_id, tbl_orders.user_id, tbl_orders.product_id, tbl_orders.product_name, tbl_orders.images, tbl_orders.price, tbl_orders.fulfillment_status, tbl_orders.created_at, tbl_user_auth.first_name, tbl_user_auth.last_name, tbl_user_auth.email, tbl_profile.phone FROM tbl_orders JOIN tbl_user_auth ON tbl_user_auth.id = tbl_orders.seller_id JOIN tbl_profile ON tbl_profile.stud_id = tbl_orders.seller_id WHERE tbl_orders.user_id = "+userId;
    const getOrdersResult = await query(getOrdersQuery);
    return getOrdersResult;
}

const getAllOrders = async (sellerId) => {
    let getOrdersQuery = "SELECT tbl_orders.id, tbl_orders.seller_id, tbl_orders.user_id, tbl_orders.product_id, tbl_orders.product_name, tbl_orders.images, tbl_orders.price, tbl_orders.fulfillment_status, tbl_orders.created_at, tbl_user_auth.first_name, tbl_user_auth.last_name, tbl_user_auth.email, tbl_profile.phone FROM tbl_orders JOIN tbl_user_auth ON tbl_user_auth.id = tbl_orders.user_id JOIN tbl_profile ON tbl_profile.stud_id = tbl_orders.user_id WHERE tbl_orders.seller_id = "+sellerId;
    const getOrdersResult = await query(getOrdersQuery);
    return getOrdersResult;
}

const updateOrder = async (orderId) => {
    let updateOrderQuery = "UPDATE tbl_orders SET fulfillment_status = 1, modified_at = now() WHERE id = "+orderId;
    const updateOrderResult = await query(updateOrderQuery);
    return updateOrderResult;
}

module.exports = { query, isStudentExist, studentInsert, deleteStudent, getCurrentStudentProfile, updateStudentProfile, getSingleCategory, getAllCategory, insertCategory, updateCategory, deleteCategory, getVerifyStudents, verifiedStudentStatus, getAllProduct, getAllStudentProducts, getVerifiedStudentProducts, productInsert, productUpdate, productDelete, placedOrderResult, getAllOrders, getAllUserOrders, updateOrder };