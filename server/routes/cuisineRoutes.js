const express = require('express');
const router = express.Router();
const {
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
    aboutus
} = require ('../controllers/cuisineController');


//App Routes
router.route('/').get(indexPage);
router.route('/about').get(aboutus);
router.route('/search').post(searchRecipe);
router.route('/categories').get(exploreCategories);
router.route('/categories/:id').get(exploreCategoriesByID);
router.route('/recipe/:id').get(exploreRecipe);
router.route('/explore-latest').get(exploreLatest);
router.route('/explore-random').get(exploreRandom);
router.route('/submit-recipe').get(submitRecipe);
router.route('/submit-recipe').post(submitRecipeOnPost);
router.route('/edit-submit-recipe/:id').get(GetupdateRecipe);
router.route('/edit-submit-recipe/:id').put(editupdateRecipe);
router.route('/recipe/:id').delete(deleteRecipe);


module.exports = router


