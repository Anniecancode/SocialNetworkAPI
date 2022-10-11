const { Schema, model } = require('mongoose');

thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            maxlength: 280,
            minlength: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtValue) => 
            dateFormat(createdAtValue),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [{
            reactionId: {
                type: Schema.Types.ObjectId,
                default: () => 
                new Types.ObjectId,
            },
            reactionBody: {
                type: String,
                required: true,
                maxlength: 280,
            },
            username: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
                get: (createdAtValue) => 
                dateFormat(createdAtValue),
            },
        }],
    },
    {
        toJSON: { 
            virtuals: true,
            //getters: true
        },
        id: false,
    }
);

thoughtSchema.virtual('reactionCount')
.get(function(){
    return this.reactions.length
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;