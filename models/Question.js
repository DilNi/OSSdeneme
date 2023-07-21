const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Zor', 'Orta', 'Kolay'],
        required: true
    },
    resim_yol:{
        type: String,
    required: true,
    },
    description: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function (options) {
                return options.length === 5; // Seçeneklerin tam olarak 5 adet olmasını sağlar
            },
            message: '5 adet seçenek girilmelidir.'
        }
    },
    correctOption: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
