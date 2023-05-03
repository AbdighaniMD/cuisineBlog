const mongoose = require('mongoose');

const cuisineCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'most provide a Name']
    }, 
    image: {
        type:String,
        required:['true', 'Most provide an Image']
    }
});
//
module.exports = mongoose.model('Category',cuisineCategorySchema);