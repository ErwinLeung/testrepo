var express = require('express');
var router = express.Router();
var path = require("path");
//var ObjectId = require(ObjectId);
var fs = require('fs');

/* create db entries */
const {ObjectId, MongoClient} = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017/");
//const usersdb = client.db("fashionstore").collection("users");
//const categoriesdb = client.db("fashionstore").collection("categories");
//const productsdb = client.db("fashionstore").collection("products");
const ordersdb = client.db("fashionstore").collection("orders");

/* GET users listing. */
//http://localhost:3000/users/OnlineShop
router.get('/OnlineShop', function(req, res, next) {
    res.sendFile(path.join(__dirname,"OnlineShop.html"));
    //res.sendFile("OnlineShop.html");
})
//router.get('/OnlineShop1', function(req, res, next) {
//  res.sendFile(path.join("OnlineShop1.html"));
//  //res.sendFile("OnlineShop.html");
//})
router.get('/Signin', function(req, res, next) {
  res.sendFile(path.join(__dirname,"SigninPage.html"));
})
router.get('/MemberService', function(req, res, next) {
  res.sendFile(path.join(__dirname,"MemberService.html"));
})
router.get('/ShoppingCart', function(req, res, next) {
  res.sendFile(path.join(__dirname,"ShoppingCart.html"));
})
router.get('/Register', function(req, res, next) {
  res.sendFile(path.join(__dirname,"Register.html"));
})
// API to get the first order by user_id and status "Pending"
router.get('/orders/first', async (req, res) => {
  const { user_id } = req.query; // Retrieve user_id from query parameters

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    const order = await db.collection('orders').findOne(
      { user_id: ObjectId(user_id), status: 'Pending' },
      { sort: { order_date: 1 } } // Sort by order_date to get the first one
    );

    if (!order) {
      return res.status(404).json({ message: 'No pending orders found for this user.' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
router.get('/api/allusers', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //curl "http://localhost:3000/apix/api/allusers"
  try {
      console.log("manager.js - /api/allusers")
      await client.connect();
      const db = client.db("FashionStore");
      const users = await db.collection('users').find({},{sort: {name:1}}).toArray();
      res.json(users);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Server error');
  } finally {
      await client.close();
  }
})
//----------------------------------------------------------
router.post('/api/addbasket', async (req, res) => {
  console.log("->/api/addbasket");
  console.log("req.body:",req.body);
  console.log("user_id:",req.body.user_id);

  await client.connect();
  const db = client.db("FashionStore");
  const ordersCollection = db.collection('orders');

  const { user_id } = req.body.user_id;
  //const currentOrder = await ordersdb.findOne(
  //  //{ user_id: user_id, status: 'Pending' },
  //  { user_id: new ObjectId(user_id), status: 'Pending' },
  //  { sort: { order_date: 1 } } // Sort by order_date to get the first one
  //);
  //const currentOrder1 = await db.collection('orders').findOne({ user_id: new ObjectId(user_id1), status: 'Pending' }, { sort: { order_date: 1 }});  //const currentOrder = await db.collection('orders').find({$and: [{status: { $regex: "Pending", $options: "i" },},{ user_id: { $regex: req.body.user_id },}],}).limit(1).toArray();
  //var UobjectId= new ObjectId("66e3f5e5b98cc4996974a4a1")
  // const currentOrder1 = db.collection('orders').find({user_id: new ObjectId('66e1433d4debe924ef58f9b2'), status: "Pending"}).toArray();
  //const currentOrder1 = db.collection('orders').find({user_id: user_id1 , status: "Pending"}).toArray();
  //const currentOrder = await db.collection('orders').find({$and: [{status: { $regex: "Pending", $options: "i" },},{ user_id: { $regex: "66e3f5e5b98cc4996974a4a1" },}],}).limit(1).toArray();
  //const currentOrder = await db.collection('orders').find({$and: [{status: { $regex: "Pending", $options: "i" },},{user_id: { $regex: "66e2404cdcca5a73748d5eda"},}],}).limit(1).toArray();
  //
  //const currentOrder = await db.collection('orders').findOne({ user_id: new ObjectId('66e784899360d07ff6a414d5'),status: 'Pending'}{ sort: { order_date: 1 }});
  
  //const currentOrder1 = await db.collection('orders').findOne({ user_id: new ObjectId(req.body.user_id),status: 'Pending'},{ sort: { order_date: 1 }});
  
  //const currentOrder1 = await db.collection('orders').findOne({ user_id: new ObjectId(req.body.user_id) , status : 'Pending'},{ sort: { order_date: -1 }});
  const currentOrder1 = await db.collection('orders').findOne({ user_id: req.body.user_id , status : 'Pending'},{ sort: { order_date: -1 }});
  //const currentOrder1 = await db.collection('orders').find({ user_id: new ObjectId('66e7cf54302c4b113dfa9003'), status : 'Pending' });
  console.log("currentOrder found:",currentOrder1);
    
  if (currentOrder1 != null) {
      console.log("currentOrder -> use exists order basket", currentOrder1._id);
      //console.log("currentOrder1[0]._id",currentOrder1[0]);
      newProduct = [{ product_id: req.body.product_id, quantity: req.body.quantity }];
      //--------remove product sub record--------
      await db.collection('orders').updateOne(
          {  _id: new ObjectId(currentOrder1._id) } ,
          {
            $pull: {
              products: {
                product_id: new ObjectId(req.body.product_id) // Product ID to remove
              }
            }
          }
       );
       console.log("pull product:", req.body.product_id )
      //--------add product sub record--------
      await db.collection('orders').updateOne(
        //{ _id: new ObjectId('66e7cf54302c4b113dfa901f') }, // Filter for the specific order
        { _id: new ObjectId(currentOrder1._id) }, // Filter for the specific order
        { 
          $push: { 
            products: { 
              product_id: new ObjectId(req.body.product_id), quantity: req.body.quantity
            }
          }
        }
      );
      console.log("push product:", req.body.product_id )
  }
  else { 
    console.log("currentOrder -> add new order basket");
    //const newOrder2 = {_id: new ObjectId(), user_id: '66e2404cdcca5a73748d5eda', products: [{ product_id: '66e2404cdcca5a73748d5ee4', quantity: 456 }], order_date: new Date(), status: 'pending', Remarks: 'Basket'};
    const newOrder = {_id: new ObjectId(),
      user_id:  req.body.user_id,
        products: [{ product_id: new ObjectId(req.body.product_id), quantity: req.body.quantity }],
        order_date: new Date(), status: 'Pending', Remarks: 'Basket'
    };
    console.log("add new order to basket with pending :", newOrder);
    await ordersCollection.insertOne(newOrder, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Order inserted successfully');
    });
  }
  //----------
})
//-----------------------------------------------
router.get('/api/allcategories', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  try {
      await client.connect();
      const db = client.db("FashionStore");
      const categories = await db.collection('categories').find({},{sort: {name:1,description:1}}).toArray();
      //console.log("categories:",categories)
      res.json(categories);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Server error');
  } finally {
      await client.close();
  }
})
//router.get('/allcategories', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
//  try {
//      await client.connect();
//      const db = client.db("FashionStore");
//      const categories = await db.collection('categories').find({},{sort: {name:1,description:1}}).toArray();
//      //console.log("categories:",categories)
//      res.json(categories);
//  } catch (error) {
//      console.error('Error fetching categories:', error);
//      res.status(500).send('Server error');
//  } finally {
//      await client.close();
//  }
//})
// API to get a category by name-----------------------------------------
router.get('/api/categories/name/:name', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
  const categoryName = req.params.name;
  //console.log(req.body);
  //const categoryName = req.body.name;
  try {
    await client.connect();
    const db = client.db("FashionStore");
    const category = await db.collection('categories').findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error retrieving category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} finally {
  await client.close();
}
})
// API to insert a new category------------------------------------
router.post('/api/insertCategories', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
//app.post('/api/insertCategories', async (req, res) => {
//try {
  //console.log('manager.js - /api/insertCategories-req.body:',req.body);
  await client.connect();
  const db = client.db("FashionStore");
  console.log('manager.js - /api/insertCategories-req.body:',req.body);
  const { name, description, cname, cdescription } = req.body;
  let status1="000"
  // Check if the category already exists
  const existingCategory = await db.collection('categories').findOne({ name: req.body.name });
  if (existingCategory) {
      console.log("Category exists")
      status1="Category exists"
      //return res.status(400).json({ message: 'Category already exists' });
      //res.json(status1)
  } else {
      // Create a new category
      console.log("insert category")
      let Category1 = { name: req.body.name,
                        description: req.body.description,
                        cname: req.body.cname,
                        cdescription: req.body.cdescription};
      db.collection("categories").insertOne(Category1);
      //status1="Category inserted"
      res.send("<h3>Category inserted</h3>");
  } 
//} finally {
//    await client.close();
//}
})
// API to get a product by name-----------------------------------------
router.get('/api/products/name/:name', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
  const productName = req.params.name;
  //console.log(req.body);
  //const productName = req.body.name;
  try {
    await client.connect();
    const db = client.db("FashionStore");
    const product = await db.collection('products').findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("manager.js - /api/products/name/" + productName, product);
    res.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} finally {
  await client.close();
}
})
// API to get a product by name-----------------------------------------
router.get('/api/users/id/:id', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
  const id = req.params.id;
  console.log("id:",id);
  
  try {
    await client.connect();
    const db = client.db("FashionStore");
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("manager.js - /api/user/id/" + id, user);
    res.json(user);
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} finally {
  await client.close();
}
})
// API to insert a new product------------------------------------
router.post('/api/insertProducts', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //console.log("insert product")  
  console.log('manager.js - /api/insertProducts-req.body:',req.body);
  await client.connect();
  const db = client.db("FashionStore");
  //const { name, description, cname, cdescription } = req.body;
  let status1="000"
  // Check if the category already exists
  const existingProduct = await db.collection('products').findOne({ name: req.body.name });
  if (existingProduct) {
      console.log("Product already exists")
      status1="Product already exists"
  } else {
      // Create a new category
      console.log("insert product")
      let Product1 = {  name: req.body.name,
                        description: req.body.description,
                        cname: req.body.cname,
                        cdescription: req.body.cdescription,
                        price: Number(req.body.price),
                        category_id: new ObjectId(req.body.category_id),
                        stock: Number(req.body.stock),
                        image_url: req.body.image_url,
                        size: req.body.size,
                        color: req.body.color,
                        brand: req.body.brand,
                        created_at: new Date(),
                        updated_at: new Date(),
                        discount: Number(req.body.discount)
                      };
      db.collection("products").insertOne(Product1);
      res.send("<h3>Product inserted</h3>");
  } 
})
// API to insert a new product------------------------------------
router.post('/api/insertUsers', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //console.log("insert product")  
  console.log('manager.js - /api/insertUsers-req.body:',req.body);
  
  await client.connect();
  const db = client.db("FashionStore");
  //const { name, description, cname, cdescription } = req.body;
  let status1="000"
  // Check if the category already exists
  const existingUser = await db.collection('users').findOne({ name : req.body.name });
  if (existingUser) {
      console.log("User already exists")
      status1="User already exists"
  } else {
      // Create a new category
      console.log("insert user")
      let User1 = {   name: req.body.name,
                      email: req.body.email,
                      password: req.body.password,
                      address: req.body.address,
                      phone: req.body.phone,
                      created_at: new Date(),
                      updated_at: new Date(),
                      is_admin: req.body.is_admin,
                      discount: Number(req.body.discount)
                  };
      db.collection("users").insertOne(User1);
      res.send("<h3>User inserted</h3>");
  }
})
// API to edit a category---------------------------------------------
router.put('/api/updateCategories/', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
//router.put('/api/editCategories/:id', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //const { name, description, cname, cdescription } = req.body;
  await client.connect();
  const db = client.db("FashionStore");
  console.log('/api/editCategories-req.body:',req.body);

  let id1  = { _id: new ObjectId(req.body.id) };
  let newvalues = {  $set: { name: req.body.name,
      description: req.body.description,
      cname: req.body.cname,
      cdescription: req.body.cdescription}};
  await db.collection("categories").updateOne(id1, newvalues);
})
// API to edit a product---------------------------------------------
router.put('/api/updateProducts/', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
//router.put('/api/editCategories/:id', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //const { name, description, cname, cdescription } = req.body;
  await client.connect();
  const db = client.db("FashionStore");
  console.log('manager.js - /api/updateProducts-req.body:',req.body);

  let id1  = { _id: new ObjectId(req.body.id) };
  let newvalues = {  $set: { name: req.body.name,
      description: req.body.description,
      cname: req.body.cname,
      cdescription: req.body.cdescription,
      price: Number(req.body.price),
      category_id: new ObjectId(req.body.category_id),
      stock: Number(req.body.stock),
      image_url: req.body.image_url,
      size: req.body.size,
      color: req.body.color,
      brand: req.body.brand,
      created_at: Date(req.body.created_at),
      updated_at: Date(new Date()),
      discount: Number(req.body.discount)
    }};
  await db.collection("products").updateOne(id1, newvalues);
})
// API to edit a product---------------------------------------------
router.put('/api/updateUsers/', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
    await client.connect();
    const db = client.db("FashionStore");
    console.log('manager.js - /api/updateUsers-req.body:',req.body);
  
    let id1  = { _id: new ObjectId(req.body.id) };
    let newvalues = {  $set: { name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phone: req.body.phone,
        is_admin: req.body.is_admin,
        created_at: Date(req.body.created_at),
        updated_at: Date(new Date()),
        discount: Number(req.body.discount)
      }};
    await db.collection("users").updateOne(id1, newvalues);
  })
// API to delete a category-----------------------------------------
router.delete('/api/deleteCategories/', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
await client.connect();
    const db = client.db("FashionStore");
    console.log('/api/deleteCategories-req.body:',req.body);

    let id1  = { _id: new ObjectId(req.body.id) };
    await db.collection("categories").deleteOne(id1);
    //console.error('Error deleting category:', error);
    //res.status(500).json({ message: 'Internal server error' });
    res.json({ message: 'Category deleted successfully' });
  } finally {
    await client.close();
}
})
// API to delete a product-----------------------------------------
router.delete('/api/deleteProducts/', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
await client.connect();
    const db = client.db("FashionStore");
    console.log('/api/deleteProducts-req.body:',req.body);

    let id1  = { _id: new ObjectId(req.body.id) };
    await db.collection("products").deleteOne(id1);
    //console.error('Error deleting category:', error);
    //res.status(500).json({ message: 'Internal server error' });
    res.json({ message: 'Product deleted successfully' });
  } finally {
    await client.close();
}
})
// API to delete a user-----------------------------------------
router.delete('/api/deleteUsers/', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
await client.connect();
    const db = client.db("FashionStore");
    console.log('/api/deleteUser-req.body:',req.body);

    let id1  = { _id: new ObjectId(req.body.id) };
    await db.collection("users").deleteOne(id1);
    res.json({ message: 'User deleted successfully' });
  } finally {
    await client.close();
}
})
// API to get a category by name-----------------------------------------
router.get('/api/categories/name/:name', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
  const categoryName = req.params.name;
  //console.log(req.body);
  //const categoryName = req.body.name;
  try {
    await client.connect();
    const db = client.db("FashionStore");
    const category = await db.collection('categories').findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error retrieving category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} finally {
  await client.close();
}
})
// API to get all orders----------------------------------------------------
router.get('/api/allorders', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //curl "http://localhost:3000/apix/api/allorders"
  try {
      await client.connect();
      const db = client.db("FashionStore");
      const orders = await db.collection('orders').find({}).toArray();
      res.json(orders);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Server error');
  } finally {
      await client.close();
  }
})
router.get('/api/allproducts', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  try {
      await client.connect();
      const db = client.db("FashionStore");
      const products = await db.collection('products').find({},{sort: {name:1,description:1}}).toArray();
      res.json(products);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Server error');
  } finally {
      await client.close();
  }
})
// API to get a category by name-----------------------------------------
router.get('/api/products/name/:name', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
try {
  const productName = req.params.name;
  //console.log(req.body);
  //const productName = req.body.name;
  try {
    await client.connect();
    const db = client.db("FashionStore");
    const product = await db.collection('products').findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("->/api/products/name/" + productName, product);
    res.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} finally {
  await client.close();
}
})
router.get('/api/getUser', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  try {
      await client.connect();
      const db = client.db("FashionStore");
      //const user1 = await db.collection('users').find().limit(1).toArray();
      //---get a random user
      //const users1 = await db.collection('users').find().toArray();
      //console.log("users1:",users1)
      //let index = Math.floor(Math.random() *  users1.length)  //get a random user
      //const user1 = users1[index];
      //const user1 = await db.collection('users').aggregate.find().limit(1).toArray();
      const user1 = await db.collection('users').aggregate([{ $sample: { size: 1 } }]).toArray();
      //------------
      console.log("/api/getUser-user1  x :",user1)
      let sid = req.sessionID;
      console.log("sid:",sid);
      res.json(user1);
  } catch (error) {
      console.error('Error fetching /api/getUser:', error);
      res.status(500).send('Server error');
  } finally {
      await client.close();
  }
})
//---------------------------------------------------------------
router.get('/api/orders/id/:id', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  //console.log("manager.js - /api/orders/id/:id' - req.body:", req.body);
  console.log("manager.js - /api/orders/id/:id' - req.params:", req.params);
  
  //try {
  const id = req.params.id;
  console.log("order._id", id);
  await client.connect();
  const db = client.db("FashionStore");
  const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });

    if (!order) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log("manager.js -> /api/orders/id/" + id);
    console.log(order);
    res.json(order);
  //} catch (error) {
  //  console.error('Error retrieving product:', error);
  //  res.status(500).json({ message: 'Internal server error' });
  //}
//} finally {
//  await client.close();
//}
})
//---------------------------------------------------
router.get('/api/getUserX', async (req, res, next) => {const MongoClient = require('mongodb').MongoClient;
  try {
      await client.connect();
      const db = client.db("FashionStore");
      //const user1 = await db.collection('users').find().limit(1).toArray();
      //---get a random user
      //const users1 = await db.collection('users').find().toArray();
      //console.log("users1:",users1)
      //let index = Math.floor(Math.random() *  users1.length)  //get a random user
      //const user1 = users1[index];
      //const user1 = await db.collection('users').aggregate.find().limit(1).toArray();
      const user1 = await db.collection('users').aggregate([{ $sample: { size: 1 } }]).toArray();
      //------------
      console.log("/api/getUser-user1  x :",user1)
      let sid = req.sessionID;
      console.log("sid:",sid);
      res.json(user1);
  } catch (error) {
      console.error('Error fetching /api/getUser:', error);
      res.status(500).send('Server error');
  } finally {
      await client.close();
  }
})
//----------------------------------------------------------------
router.get('/api/productslist', async function(req, res, next) {
//router.post('/onlineshop', async function(req, res, next) {
  console.log("->/api/productslist");
  console.log("/api/productslist - req.body:",req.body);
  console.log("req.body.categories:",req.body.categories);
  //console.log("req.body.categories.length:",req.body.categories.length);
  //console.log("req.body.length:",req.body.length);
  //console.log("Object.keys(req.body).length",Object.keys(req.body).length);
  const db = client.db("FashionStore");
  await client.connect();
  let cat1 = new Array();
  try{
    if (Array.isArray(req.body.categories)) {
      for (let i = 0; i < req.body.categories.length; i++) {
        //console.log("here", req.body.categories[i]);
        let obj = new ObjectId(req.body.categories[i]);
        cat1.push(obj);
      }
    } else cat1.push(new ObjectId(req.body.categories));
    //cat1.push(new ObjectId("66dfbc8465f8ccc5fb2c5a91"));
    //cat1.push(new ObjectId("66d904d028edea198d6d132d"));
    console.log("cat1:",cat1);
    //for (i=0; i<)
    //const products1 = await db.collection('products').find({category_id:new ObjectId("66d904d028edea198d6d132c")}).toArray();
    //const products1 = await db.collection('products').find({category_id: (new ObjectId("66d904d028edea198d6d132c"), new ObjectId("66d904d028edea198d6d132d"))}).toArray();
    //const products1 = await db.collection('products').find({category_id:{$in : [new ObjectId("66d904d028edea198d6d132c"), new ObjectId("66d904d028edea198d6d132d")]}}).toArray();
    const products1 = await db.collection('products').find({category_id:{$in : cat1}}).toArray();
    //const products1 = await db.collection('products').find({category_id:new (req.body)}).toArray();
    //res.json(products1);
    let html1="";
    for(let i = 0; i < products1.length; i++) {
      let p1 = products1[i];
      //console.log("i=:",i)
      console.log(p1.name,p1.cname,p1.description,p1.cdescription,p1.stock,p1.price,p1.image_url);
      html1+='<div id="1ist-1" class="list">';
      html1+='<img src="'+p1.image_url+'" class="cloth" id="cloth-1" alt="cloth" width="208">';
      html1+='<h3 class="text">'+p1.name+p1.cname+'</h3>';
      html1+='<p class="price: $">'+p1.price+'+</p>';
      html1+='<p class="text">'+p1.description+p1.cdescription+'</p>';
      html1+='</div>';
    }
    //res.send(html1);
    res.json(html1);
    //const data = await db.find({Quantity:"5"}, {
    //const data = await db.find({Quantity:{$gte:5, $lte:8 }}, 
    //const data = await db.find({Quantity:{$in:[4,5,6]}}, 
    //const data = await db.find({Location:"KL", Quantity:"5"}, 
    //console.log("req.body.location:",req.body.location);
    //console.log("Object.keys(req.body).length",Object.keys(req.body).length);

  } finally {
    await client.close();
    //res.send("OnlineShop exit");
  }
  //res.send("OnlineShop done");
})
router.get('/OnlineShop', async function(req, res, next) {
  console.log("->/onlineshop.get");
  console.log("req.body:",req.body);
})
//----------------------------------------------------------------------------------------------------------
router.post('/OnlineShop', async function(req, res, next) {
  //router.post('/onlineshop', async function(req, res, next) {
    console.log("->/onlineshop");
    console.log("req.body:",req.body);
    console.log("req.body.categories:",req.body.categories);
    const db = client.db("FashionStore");

    //-------get the user---------------
    await client.connect();

    let u1 = [];
    //const user1 = await db.collection('users').find().limit(1).toArray(); // get top on user from users
    //const user1 = await db.collection('users').aggregate([{ $sample: { size: 1 } }]).toArray();
    // get random user
    
    //const user1 = await db.collection('users').aggregate([{ $sample: { size: 1 } }]).toArray();
    //for(let i = 0; i < user1.length; i++) {
    //  u1 = user1[i];
    //  console.log("u_i=:",i,u1._id,u1.name,u1.email,u1.address,u1.discount,u1.is_admin);
    //}
    let u1name =  req.body.textusername; // Get the userId from the URL
    let u1id =  req.body.textuserid; // Get the userId from the URL
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    //const session = require('express-session');
    const flash = require('connect-flash');
    //const { ObjectId } = require('mongodb');
    const { checkUserCredentials, findUserById, findUserByName } = require('./dblogin');
    const { registerUser } = require('./regHandler');
    const { reset } = require('./reset'); // Import the reset function
    const bcrypt = require('bcrypt');
    const path = require('path');

    //----------------------------------
        
    //----read template file begin-----------
    //console.log("__dirname:,",__dirname);
    //console.log("path.join(__dirname,'test.txt:'",path.join(__dirname,'test.txt'));
    filename1=path.join(__dirname,'onlineshop.html');
    //const dataf = fs.readFileSync(filename1,{ encoding: 'utf8', flag: 'r' });
    let theFile = "";
    //let tlines = require('fs').readFileSync(filename1, 'utf-8').split('\n').filter(Boolean);
    let tlines = require('fs').readFileSync(filename1, 'utf-8').split('\n').filter(Boolean);
    for(let i = 0; i < tlines.length; i++) {
       //tlines[i]=tlines[i].trim();
       //console.log(i,  tlines[i].indexOf('id="product-list'), tlines[i]);
       if( tlines[i].indexOf('id="product-list')>0){
          //console.log(i,  tlines[i].indexOf('id="product-list'), tlines[i]);
          console.log("===========end of template==========================");
          break;
       } else  {
          //console.log(i,tlines[i]);
          theFile+=tlines[i]+"\n";
       }
    }
    theFile += '<div id="product-list">';
    html1=theFile;
    //console.log("theFile:",theFile);
    //----read template file end-------------
    
    // -------------find product by text box------------------------------------
    if (req.body.searchproduct.trim()!=""){
      console.log("req.body2:",req.body);
      console.log("req.body.searchproduct:",req.body.searchproduct);
      let pstring= req.body.searchproduct.trim();
        console.log("pstring:",pstring);
        //const db = client.db("FashionStore");
        await client.connect();
        //const products1 = await db.collection('products').find({"name": new RegExp('.*' + pstring + '.*'), 'i'}).toArray();
        const products1 = await db.collection('products').find( { $or: [
            {"name": new RegExp('.*' + pstring + '.*', 'i')}, 
            {"cname": new RegExp('.*' + pstring + '.*', 'i')},
            {"description": new RegExp('.*' + pstring + '.*', 'i')},
            {"cdescription": new RegExp('.*' + pstring + '.*', 'i')},
            //{"price": new RegExp('.*' + pstring + '.*', 'i')}
          ]}).toArray();
         //{sort: {name:1,cname:1},
          //projection : {_id:0, Type:1, Location:1, Quantity:1 }
         //}).toArray();
        console.log("products1.length:",products1.length)
        for(let i = 0; i < products1.length; i++) {
          let p1 = products1[i];
          console.log("i=:",i)
          console.log(p1.name,p1.cname,p1.description,p1.cdescription,p1.stock,p1.price,p1.image_url);
          // search box
          html1+='<div id="1ist-1" class="div1">';
          //html1+='<div id="1ist-1" class="list">';
          html1+='<form action="/addbasket.html" id="form_' + i + '" target="addbasket">';
          //html1+='<form action="http://localhost:3000/addbasket.html" id="form_'+i+' " target="addbasket">';
          html1+='<img src="'+p1.image_url+'" class="cloth" id="cloth-' + i + '" alt="cloth" width="200">';
          html1+='<h3 class="text">'+p1.name+p1.cname+'</h3>';
          html1+='<p class="price: $">'+p1.price+'+</p>';
          html1+='<p class="text">'+p1.description+p1.cdescription+'</p>';
          html1+='<p><input type="hidden"  maxlength="10" size="10" id="uname" name="uname" value="'+u1name+'">';
          html1+='<p><input type="hidden"  maxlength="10" size="10" id="uid" name="uid" value="'+u1id+'">';
          html1+='<p><input type="hidden" maxlength="10" size="10" id="pid" name="pid" value="'+p1._id+'">';
          html1+='<p><input type="hidden" maxlength="10" size="10" id="img" name="img" value="'+p1.image_url+'">';
          html1+='<table border="0">';
          html1+='<tr>';
          html1+='<th></th>';
          html1+='<th></th>';
          html1+='<th></th>';
          html1+='</tr>';
          html1+='<tr>';
          html1+='<td>';
          html1+='<p><input type="hidden" id="qty_'+i+'" name="qty" value="1">';
          html1+='<p><h3>&nbsp;Available Stock&nbsp;&nbsp;&nbsp;</h3><input type="text" id="stock_'+i+'" name="stock" value="'+p1.stock+'">';
          //html1+='<button  type="button" class="button3 button2" id="AddQty1" onclick="AddQty_'+i+'()"><img width="35" height="30" src="/images/plus.png" title="Add More" ></button>';
          //html1+='<button  type="button" class="button3 button2" id="MinusQty1" onclick="MinusQty_'+i+'()"><img width="30" height="30" src="/images/minus.png" title="Minus" ></button>';
          html1+='</td>';
          html1+='<td></td>';
          html1+='<td><button type="submit" class="button3 button1" id="AddBasket" onclick="Add2Basket()" type="button"><img  src="/images/ShoppingBasket.png" title="Add to Shopping Cart" ></button></p></td>';
          html1+='</tr>';
          //html1+='<tr>';
          //html1+='<td></td>';
          //html1+='<td></td>';
          //html1+='<td></td>';
          //html1+='</tr>';
          html1+='</table>';
          html1+='<script>';
          html1+='function AddQty_'+i+'(){';
          //html1+='  alert("AddQty_'+i+'");';
          html1+='let i1 = document.getElementById("qty_'+i+'").value;';
          html1+='document.getElementById("qty_'+i+'").value = ++i1';
          html1+='}';
          html1+='function MinusQty_'+i+'(){';
          //html1+='  alert("MinusQty_'+i+'");';
          html1+='let i1 = document.getElementById("qty_'+i+'").value;';
          html1+='if (i1 > 1){document.getElementById("qty_'+i+'").value = --i1};';
          html1+='}';
          html1+='</script>';
          //html1+='<p><input type="text" id="qty" name="qty" value="2">';
          //html1+='<button type="submit" src="/images/ShoppingBasket.png" id="AddBasket" onclick="Add2Basket()" type="button"><img  src="/images/ShoppingBasket.png" title="Add to Shopping Cart" ></button></p>';
          html1+='</form>';
          html1+='</div>';
        }
        html1+='</div>';
        html1+='</body>';
        html1+='</html>';
        console.log(html1);
        try {
          res.send(html1);
        } finally {
          await client.close();
        }
      // -------------find product by text box------------------------------------
      } else {
    //console.log("req.body.categories.length:",req.body.categories.length);
    //console.log("req.body.length:",req.body.length);
    //console.log("Object.keys(req.body).length",Object.keys(req.body).length);
    const db = client.db("FashionStore");
    await client.connect();
    let cat1 = new Array();
    try{
      if (Array.isArray(req.body.categories)) {
        for (let i = 0; i < req.body.categories.length; i++) {
          //console.log("here", req.body.categories[i]);
          let obj = new ObjectId(req.body.categories[i]);
          cat1.push(obj);
        }
      } else cat1.push(new ObjectId(req.body.categories));
      //cat1.push(new ObjectId("66d904d028edea198d6d132c"));
      //cat1.push(new ObjectId("66d904d028edea198d6d132d"));
      console.log("cat1:",cat1);
      //for (i=0; i<)
      //const products1 = await db.collection('products').find({category_id:new ObjectId("66d904d028edea198d6d132c")}).toArray();
      //const products1 = await db.collection('products').find({category_id: (new ObjectId("66d904d028edea198d6d132c"), new ObjectId("66d904d028edea198d6d132d"))}).toArray();
      //const products1 = await db.collection('products').find({category_id:{$in : [new ObjectId("66d904d028edea198d6d132c"), new ObjectId("66d904d028edea198d6d132d")]}}).toArray();
      const products1 = await db.collection('products').find({category_id:{$in : cat1}}).toArray();
      //const products1 = await db.collection('products').find({category_id:new (req.body)}).toArray();
      //res.json(products1);
      let html1=theFile;
      for(let i = 0; i < products1.length; i++) {
        let p1 = products1[i];
        //console.log("i=:",i)
        console.log(p1.name,p1.cname,p1.description,p1.cdescription,p1.stock,p1.price,p1.image_url);
        html1+='<div id="1ist-1" class="div1">';
        //html1+='<div id="1ist-1" class="list">';
        html1+='<form action="/addbasket.html" id="form_' + i + '" target="addbasket">';
        //html1+='<form action="http://localhost:3000/addbasket.html" id="form_'+i+' " target="addbasket">';
        html1+='<img src="'+p1.image_url+'" class="cloth" id="cloth-' + i + '" alt="cloth" width="200">';
        html1+='<h3 class="text">'+p1.name+p1.cname+'</h3>';
        html1+='<p class="price: $">'+p1.price+'+</p>';
        html1+='<p class="text">'+p1.description+p1.cdescription+'</p>';
        html1+='<p><input type="hidden"  maxlength="10" size="10" id="uname" name="uname" value="'+u1name+'">';
        html1+='<p><input type="hidden"  maxlength="10" size="10" id="uid" name="uid" value="'+u1id+'">';
        html1+='<p><input type="hidden" maxlength="10" size="10" id="pid" name="pid" value="'+p1._id+'">';
        html1+='<p><input type="hidden" maxlength="10" size="10" id="img" name="img" value="'+p1.image_url+'">';
        html1+='<table border="0">';
        html1+='<tr>';
        html1+='<th></th>';
        html1+='<th></th>';
        html1+='<th></th>';
        html1+='</tr>';
        html1+='<tr>';
        html1+='<td>';
        html1+='<p><input type="hidden" id="qty_'+i+'" name="qty" value="1">';
        html1+='<p><h3>&nbsp;Available Stock&nbsp;&nbsp;&nbsp;</h3><input type="text" id="stock_'+i+'" name="stock" value="'+p1.stock+'">';
        //html1+='<button type="button" class="button3 button2" id="AddQty1" onclick="AddQty_'+i+'()"><img width="35" height="30" src="/images/plus.png" title="Add More" ></button>';
        //html1+='<button type="button" class="button3 button2" id="MinusQty1" onclick="MinusQty_'+i+'()"><img width="30" height="30" src="/images/minus.png" title="Minus" ></button>';
        html1+='</td>';
        html1+='<td></td>';
        html1+='<td ><button type="submit" class="button3 button1" id="AddBasket" onclick="Add2Basket()" type="button"><img  src="/images/ShoppingBasket.png" title="Add to Shopping Cart" ></button></p></td>';
        html1+='</tr>';
        //html1+='<tr>';
        //html1+='<td></td>';
        //html1+='<td></td>';
        //html1+='<td></td>';
        //html1+='</tr>';
        html1+='</table>';
        html1+='<script>';
        html1+='function AddQty_'+i+'(){';
        //html1+='  alert("AddQty_'+i+'");';
        html1+='let i1 = document.getElementById("qty_'+i+'").value;';
        html1+='document.getElementById("qty_'+i+'").value = ++i1';
        html1+='}';
        html1+='function MinusQty_'+i+'(){';
        //html1+='  alert("MinusQty_'+i+'");';
        html1+='let i1 = document.getElementById("qty_'+i+'").value;';
        html1+='if (i1 > 1){document.getElementById("qty_'+i+'").value = --i1};';
        html1+='}';
        html1+='</script>';
        //html1+='<p><input type="text" id="qty" name="qty" value="2">';
        //html1+='<button type="submit" src="/images/ShoppingBasket.png" id="AddBasket" onclick="Add2Basket()" type="button"><img  src="/images/ShoppingBasket.png" title="Add to Shopping Cart" ></button></p>';
        html1+='</form>';
        html1+='</div>';
      }
      html1+='</div>';
      html1+='</body>';
      html1+='</html>';
      //console.log(html1);
      res.send(html1);
      //res.json(html1);
      //const data = await db.find({Quantity:"5"}, {
      //const data = await db.find({Quantity:{$gte:5, $lte:8 }}, 
      //const data = await db.find({Quantity:{$in:[4,5,6]}}, 
      //const data = await db.find({Location:"KL", Quantity:"5"}, 
      //console.log("req.body.location:",req.body.location);
      //console.log("Object.keys(req.body).length",Object.keys(req.body).length);
    } finally {
      await client.close();
    }
  }
  })
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
