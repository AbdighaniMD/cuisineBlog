const mongoose = require('mongoose');

const cuisineRacipeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'most provide a Name']
    },
    description: {
        type: String,
        required: [true, 'most provide a Description']
    },
    email: {
        type: String,
        required: [true, 'most provide a email']
    },
    ingredients: {
        type: Array,
        required: [true, 'most provide a ingredients']
    },
    category: {
        type: String,
        enum: ['Thai', 'American', 'Chinese', 'Mexican', 'Indian'],
        required: [true, 'most provide a category']
    },
    image: {
        type:String,
        required:['true', 'Most provide an Image']
    }
});

cuisineRacipeSchema.index({ name: 'text', description: 'text' });

module.exports= mongoose.model('Racipe',cuisineRacipeSchema);