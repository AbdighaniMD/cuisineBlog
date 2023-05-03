const Category = require('../models/category');
const Recipe = require('../models/recipe');

/**
 * GET /
 * Homepage 
*/
const indexPage =  async (req,res) => {
    try{
        const onlyGet = 5;
        const categories = await Category.find({}).limit(onlyGet);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(onlyGet)

        const thai = await Recipe.find({ 'category': 'Thai' }).limit(onlyGet);
        const american = await Recipe.find({ 'category': 'American' }).limit(onlyGet);
        const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(onlyGet);

        const food = {latest, thai, american, mexican};

        res.render('index', {categories:categories, food:food});
    }catch(err){
        res.satus(500).send({message: err.message || "Error Occured" });
    }
    
    
}

/**
 * GET /categories
 * Categories 
*/
const exploreCategories = async (req, res) =>{
  try{
    const onlyGet = 15;
    const categories = await Category.find({}).limit(onlyGet);
    
    res.render('categories', {title: 'Cooking Blog - Categoreis', categories:categories});
    
  }catch(err){
        res.satus(500).send({message: err.message || "Error Occured" });
  }
}

/**
 * GET /categories/:id
 * Categories By Id
*/
const exploreCategoriesByID = async (req, res) =>{
  try {
    const categoryId = {_id:req.params.id};
    const onlyGet = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(onlyGet);
    
    res.render('categories', {title: 'Cooking Blog - Categoreis',categoryById:categoryById});
  }
  catch(err){
    res.satus(500).send({message: err.message || "Error Occured" });
  }

}

/**
 * GET /recipe/:id
 * Recipe 
*/
const exploreRecipe = async (req, res) => {
  try {
    const recipeId = {_id:req.params.id};
    const recipe = await Recipe.findById(recipeId)
    
    res.render('cuisineRecipe', {title: 'Cooking Blog - Recipe', recipe:recipe});
  }
  catch(err){
    res.satus(500).send({message: err.message || "Error Occured" });
  }

}

/**
 * POST /search
 * Search 
*/
const searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Cooking Blog - Search', recipe:recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }

}

/**
 * GET /explore-latest
 * Explplore Latest 
*/
const exploreLatest = async (req, res) =>{

  try {
    const onlyGet = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(onlyGet);
    res.render('explore-latest', { title: 'Cooking Blog - Explore Latest', recipe:recipe} );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }

} 

/**
 * GET /explore-random
 * Explore Random as JSON
*/
const exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }

}

/**
 * GET /submit-recipe
 * Submit Recipe
*/
const submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
const submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    const newRecipe = new Recipe(
    {      
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/api/v1/blog/submit-recipe')
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/api/v1/blog/submit-recipe')
  }
  
}

/**
 * GET /editsubmit-recipe:id
 * Submit Recipe
*/
const GetupdateRecipe = async (req, res) => {

  try {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');


    const recipeId = {_id:req.params.id};
    const recipes = await Racipe.findById(recipeId);

    
    res.render('editSubmit-recipe', { title: 'Cooking Blog - Edit Submit Recipe', recipes:recipes, infoErrorsObj, infoSubmitObj  } );
  }
  catch(err){
    res.satus(500).send({message: err.message || "Error Occured" });
  }



}

/**
 * PUT /editsubmit-recipe:id
 * Submit Recipe
*/
const editupdateRecipe = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }

    let viewID = {_id : req.params.id};
    
    let editRecipe = {
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    };
  
    Recipe.findByIdAndUpdate( viewID , {$set: editRecipe}, {new:true})
      .then(recipe => {
        if(!recipe ){
            res.status(404).send({ message : `Cannot Delete the  id ${req.params.id}. Maybe id is wrong`})
        }else{
          req.flash('infoSubmit', 'Recipe has been updated.')
          res.redirect('/api/v1/blog/edit-submit-recipe/'+ req.params.id);
        }
    });

  }
  catch (error){
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/api/v1/blog/edit-submit-recipe/'+ req.params.id);
  }

}


/**
 * Delete /deletesubmit-recipe:id
 * Submit Recipe
*/
const deleteRecipe = async (req, res) => {
  let viewID = {_id : req.params.id};

  Recipe.findByIdAndDelete(viewID)
      .then(recipe => {
          if(!recipe ){
              res.status(404).send({ message : `Cannot Delete the  id ${req.params.id}. Maybe id is wrong`})
          }else{
              res.redirect('/api/v1/blog');
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete Recipe with id=" + req.params.id
          });
      });
}

/**
 * Get /api/v1/blog/about
 * About
*/
const aboutus = async (req, res) => {
  res.render('about')
}

module.exports = {
    indexPage,
    exploreCategories,
    exploreCategoriesByID,
    exploreRecipe,
    searchRecipe,
    exploreLatest,
    exploreRandom,
    submitRecipe,
    submitRecipeOnPost,
    GetupdateRecipe,
    editupdateRecipe,
    deleteRecipe, 
    aboutus,
}


/**
 * Dummy Data Example 
*/

/*
async function insertDymmyCategoryData(){
      try {
        await Category.insertMany([
          {
            "name": "Thai",
            "image": "thai-food.jpg"
          },
          {
            "name": "American",
            "image": "american-food.jpg"
          }, 
          {
            "name": "Chinese",
            "image": "chinese-food.jpg"
          },
          {
          "name": "Mexican",
          "image": "mexican-food.jpg"
        }, 
        {
          "name": "Indian",
          "image": "indian-food.jpg"
        },
        {
           "name": "Spanish",
           "image": "spanish-food.jpg"
         }
       ]);
   } catch (error) {
    console.log('err:', + error)
  }
}

insertDymmyCategoryData();
*/

/*

async function insertDymmyRecipeData(){
       try {
        await Racipe.insertMany([
       { 
        "name": "Recipe Name Goes Here",
        "description": `Recipe Description Goes Here`,
        "email": "recipeemail@Abdighanimd.co.uk",
        "ingredients": [
            "1 level teaspoon baking powder",
            "1 level teaspoon cayenne pepper",
            "1 level teaspoon hot smoked paprika",
        ],
        "category": "American", 
        "image": "jay-American.jpg"
        },
        { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "American", 
         "image": "louis-hansel-American (2).jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "American", 
         "image": "louis-hansel-American (3).jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "American", 
         "image": "louis-hansel-American .jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Thai", 
         "image": "alyssa-kowalski-thai.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Thai", 
         "image": "dolores-preciado-thai.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Thai", 
         "image": "mahadev-ittina-thai.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Thai", 
         "image": "ruth-georgiev-thai.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Mexican", 
         "image": "amie-watson-mexican.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Mexican", 
         "image": "frederik-trovatten-mexican.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Mexican", 
         "image": "hybrid-storytellers-mexican.jpg"
          },
          { 
            "name": "Recipe Name Goes Here",
            "description": `Recipe Description Goes Here`,
            "email": "recipeemail@Abdighanimd.co.uk",
            "ingredients": [
                "1 level teaspoon baking powder",
                "1 level teaspoon cayenne pepper",
                "1 level teaspoon hot smoked paprika",
            ],
         "category": "Mexican", 
         "image": "natasha-bhogal-mexican.jpg"
          },
        ]);
       } catch (error) {
        console.log('err', + error)
    }
 }
    
insertDymmyRecipeData();
*/