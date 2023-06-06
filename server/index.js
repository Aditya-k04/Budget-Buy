const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const db = require('./helpers/db');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(pino);
app.use("/public", express.static('public'));

const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/products');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(" ","-").toLowerCase());
  }
}); 

const uploadProducts = multer({ storage: storageProducts,
  fileFilter: (req, file, cb) => {
      if (file) {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('file missing!')); //Only .png, .jpg and .jpeg format allowed
      }
}}); 

const storageDocs = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/student_docs');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(" ","-").toLowerCase());
  }
}); 

const uploadDocs = multer({ storage: storageDocs,
  fileFilter: (req, file, cb) => {
      if (file) {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('file missing!')); //Only .png, .jpg and .jpeg format allowed
      }
}}); 

app.post('/api/isExistUser', async (req, res) => {
  console.log("body => ",req.body)
  const session = await db.isStudentExist(req.body);
  console.log("isUserResult => ",session);
  res.status(200).send(JSON.stringify({ userSession: session }));
});

app.post('/api/insertUser', uploadDocs.single('doc'), async(req, res) => {
  console.log("uploaded doc = ",req.file);  
  let data = JSON.parse(req.body?.reg_info);
  const session = await db.isStudentExist(data);
  console.log("session::",session);
  if(session?.length > 0) {
    res.status(200).send({ userSession: session, alreadyUser: true });
  } else {
    console.log(" data :: ",data);
    const userInsertResult = await db.studentInsert(data, req.file?.filename);
    const currentSession = (userInsertResult?.affectedRows)?await db.isStudentExist(data):[];
    res.status(200).send({ userSession: currentSession, alreadyUser: false });
  }
});

app.get(`/api/get-user-profile`, async (req, res) => {
  console.log("query :: ",req.query);
  const getCurrentUserProfile = await db.getCurrentStudentProfile(req.query);
  res.status(200).send(getCurrentUserProfile);
});

app.post('/api/updateUserProfile', async (req, res) => {
  const updateProfileResult = await db.updateStudentProfile(req.body);
  console.log("affectedRows :: ",updateProfileResult?.affectedRows);
  const currentSession = (updateProfileResult?.affectedRows)?await db.isStudentExist(req.body):[];
  res.status(200).send(JSON.stringify({ userSession: currentSession }));
})

app.get(`/api/get-all-categories`, async(req, res) => {
  const allCategories = await db.getAllCategory();
  res.status(200).send(allCategories);
});

app.post(`/api/add_category`, async (req, res) => {
  const isCatgExist = await db.getSingleCategory(req?.body?.new_catg);
  if(isCatgExist.length == 0) {
    const addCatg = await db.insertCategory(req?.body?.new_catg);
    res.status(200).send({'isSaved': addCatg?.affectedRows});
  }
});

app.post(`/api/update_category`, async (req, res) => {
  const updatedCatgResult = await db.updateCategory(req?.body?.updated_catg, req?.body?.catg_id);
  if(updatedCatgResult.affectedRows == 1) {
    res.status(200).send({'isUpdated': updatedCatgResult.affectedRows});
  }
});

app.post(`/api/delete_category`, async (req, res) => {
  const deletedCatgResult = await db.deleteCategory(req?.body?.catg_id);
  if(deletedCatgResult.affectedRows == 1) {
    res.status(200).send({'isDeleted': deletedCatgResult.affectedRows});
  }
});

app.get('/api/admin-students-list', async (req, res) => {
  const verifyStudentsList = await db.getVerifyStudents();
  res.status(200).send(verifyStudentsList);
});

app.post('/api/verify-student', async (req, res) => {
  const verifiedStudentsResult = await db.verifiedStudentStatus(req.body.student_id);
  res.status(200).send(verifiedStudentsResult);
});

app.post('/api/delete-student', async (req, res) => {
  const deleteStudentResult = await db.deleteStudent(req.body.student_id);
  res.status(200).send(deleteStudentResult);
});

app.get(`/api/get-all-products`, async (req, res) => {
  const getAllProductsResult = await db.getAllProduct();
  res.status(200).send(getAllProductsResult);
});

app.get(`/api/get-all-student-products`, async (req, res) => {
  const getAllProductsResult = await db.getAllStudentProducts(parseInt(req.query.id));
  res.status(200).send(getAllProductsResult);
});

app.get('/api/get-verified-students-products', async (req, res) => {
  const getVerifiedStudentProductsResult = await db.getVerifiedStudentProducts(req.query.student_id);
  res.status(200).send(getVerifiedStudentProductsResult);
});

app.post("/api/add-product", uploadProducts.array('product_images'), async(req, res) => {
  console.log(" >>> files >>> ",req.files);
  const files = req.files.map(({filename})=>{
    return filename;
  });
  const insertProductResult = await db.productInsert(JSON.parse(req.body.product), files);
  res.status(200).send(insertProductResult);
});

app.post("/api/update-product", uploadProducts.array('product_images'), async(req, res) => {
  console.log("files >>> ",req.files);
  let productData = JSON.parse(req.body.product);
  const files = req.files.map(({filename})=>{
    return filename;
  });
  productData.product_images.map((image, index) => {
    if(typeof image === 'object') {
      productData.product_images.splice(index, 1);
    }
  });
  const productImgs = [...productData.product_images, ...files];
  console.log("productImgs >> ",productImgs);
  const updateProductResult = await db.productUpdate(productData, productImgs);
  res.status(200).send(updateProductResult);
});

app.post('/api/delete-product', async(req, res) => {
  const deletedProductResult = await db.productDelete(req.body.product_id);
  res.status(200).send(deletedProductResult);
});

app.post('/api/purchase-product', async (req, res) => {
  const placedOrderResult = await db.placedOrderResult(req.body.product, req.body.user_id);
  res.status(200).send(placedOrderResult);
});

app.get('/api/get-user-orders', async(req, res) => {
  const allOrdersResult = await db.getAllUserOrders(req?.query?.user_id);
  res.status(200).send(allOrdersResult);
});

app.get('/api/get-orders', async(req, res) => {
  const allOrdersResult = await db.getAllOrders(req?.query?.seller_id);
  res.status(200).send(allOrdersResult);
});

app.post('/api/fulfill-order', async (req, res) => {
  const updateOrderResult = await db.updateOrder(req.body.order_id);
  res.status(200).send(updateOrderResult);
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);