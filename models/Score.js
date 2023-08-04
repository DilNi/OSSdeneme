const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Zor', 'Orta', 'Kolay'],
        required: true
    },
    resim_yol: {
        data: Buffer, // Tampon türü ile resim verisini saklayacak alan
        contentType: String // Resim dosyasının türünü belirten alan (örn. 'image/png', 'image/jpeg' vb.)
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

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
