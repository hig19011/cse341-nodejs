
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  depth: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../../util/shop/database').getDb;



// class Product {

//   constructor(id, title, imageUrl, description, price, height, width, depth, weight, user) {
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     this.height = height;
//     this.width = width;
//     this.depth = depth;
//     this.weight = weight;
//     this.user = user
//   }

//   save = () => {
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//       dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
//     } else {
//       dbOp = db.collection('products')
//       .insertOne(this)
//     }
    
//     return dbOp
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       })
//   }

//   static fetchAll = () => {
//     const db = getDb();
//     return db.collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         console.log(products);
//         return products;
//       }).catch(err => { console.log(err); });
//   };

//   static findById = (prodId) => {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then(product => {
//         console.log(product);
//         return product;
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static deleteById = (id) => {
//     const db = getDb();
//     return db.collection('products')
//       .deleteOne({_id: new mongodb.ObjectId(id)})
//       .then(result => {
//         console.log("Product deleted");
//       })
//       .catch(err => console.log(err));
      
//         // if(!err) {
//         //   Cart.deleteProduct(id, product.price);
//         // }  
//   }

// }

// module.exports = Product