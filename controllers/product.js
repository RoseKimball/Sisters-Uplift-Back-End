const Product = require('../models/product');
const slugify = require('slugify');

exports.create =  async (req, res) => {
    try {
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message 
        })
    }
}

exports.listAll = async (req, res) => {
    console.log('list all req', req.params.count)
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('Category')
        .sort([['createdAt', 'desc']])
        .exec()
    res.json(products);
    console.log('products res', products)
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deleted)
    } catch (err) {
        console.log(err)
        return res.status(400).send('product delete failed')
    }
}

exports.read = async (req, res) => {
    // console.log('backend slug', req.params.slug)
    const product = await Product.findOne({slug: req.params.slug})
    .populate('Category')
    .exec();

    return res.json(product);
    // console.log('backend response', res.json(product))
}

exports.update = async (req, res) => {
    try {
        if(req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updated = await Product.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true}).exec();
        return res.json(updated);
    } catch (err) {
        console.log(err);
        return res.status(400).send('product update failed')
    }
}

exports.list = async (req, res) => {
    try {
        const {sort, order, page} = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
        .skip((currentPage - 1) * perPage)
        .populate('Category')
        .sort([[sort, order]])
        .limit(perPage)
        .exec();

        return res.json(products);
    } catch(err) {
        console.log(err);
    }
}

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total); 
}

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id},
        category: product.category
    })
    .limit(3)
    .populate('Category')
    .exec();
    // .populate('postedBy')

    res.json(related);
}

// search helper functions
// DIDN'T CHANGE THIS ONE!
const handleQuery = async (req, res, query) => {
    const products = await Product.find({
        $or: [
            {title: new RegExp(query, 'i')},
            {description: new RegExp(query, 'i')},
            {slug: new RegExp(query, 'i')}
        ]
    }).populate('Category', '_id name').exec();
    res.json(products)
}

// const handlePrice = async (req, res, price) => {
//     try {
//         let products = await Product.find({
//             price: {
//                 $gte: price[0],
//                 $lte: price[1]
//             }
//         })
//         .sort({price: 1})
//         .populate('Category', '_id name')
//         .exec();

//         res.json({products})
//     } catch (err) {
//         console.log(err);
//     }
// }

const handlePrice = async (req, res, price) => {
    try {
      let products = await Product.find({
        price: {
          $gte: price[0],
          $lte: price[1],
        },
      })
        .populate("category", "_id name")
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };

// const handleCategory =  async (req, res, category) => {
//     try {
//         console.log('categories recieved in handler', category)
//         // console.log('handleCategory reached')
//         let products = await Product.find({category}).populate('Category', '_id name').exec();
//         // console.log('database categories query', products)
//         res.json(products);
//         console.log('backend category res', products)
//     } catch(err) {
//         console.log(err);
//     }
// }

const handleCategory = async (req, res, category) => {
    try {
      let products = await Product.find({ category })
        .populate("category", "_id name")
        .exec();
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  

// const handleColor = async (req, res, color) => {
//     const products = await Product.find({color}).populate('Category', '_id name').exec();
//     res.json(products);
// }

const handleColor = async (req, res, color) => {
    const products = await Product.find({ color })
      .populate("category", "_id name")
      .exec();
  
    res.json(products);
  };
  

// const handleBrand = async (req, res, brand) => {
//     const products = await Product.find({brand}).populate('Category', '_id name').exec();
//     res.json(products);
// }

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
      .populate("category", "_id name")
      .exec();
  
    res.json(products);
  };


// exports.searchFilters = async (req, res) => {
//     const {query, price, category, color, brand} = req.body;

//     if(query) {
//         console.log(query);
//         await handleQuery(req, res, query)
//     }

//     // price [10-200]
//     if(price !== undefined) {
//         console.log('price', price);
//         await handlePrice(req, res, price)
//     }

//     if(category) {
//         console.log('category recieved on backend', category);
//         await handleCategory(req, res, category)
//     }
    
//     if(color) {
//         console.log('color recieved on backend', color);
//         await handleColor(req, res, color);
//     }

//     if(brand) {
//         console.log('brand recieved on backend', brand);
//         await handleBrand(req, res, brand);
//     }

// }

exports.searchFilters = async (req, res) => {
    const {
      query,
      price,
      category,
      color,
      brand,
    } = req.body;
  
    if (query) {
      console.log("query --->", query);
      await handleQuery(req, res, query);
    }
  
    // price [20, 200]
    if (price !== undefined) {
      console.log("price ---> ", price);
      await handlePrice(req, res, price);
    }
  
    if (category) {
      console.log("category ---> ", category);
      await handleCategory(req, res, category);
    }
  
    
    if (color) {
      console.log("color ---> ", color);
      await handleColor(req, res, color);
    }
  
    if (brand) {
      console.log("brand ---> ", brand);
      await handleBrand(req, res, brand);
    }
  };