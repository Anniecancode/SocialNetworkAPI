const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {

    // GET all users
    getUsers(req, res) {
        User.find()
        //.select('-__v')
        .then((users) => res.json(users))
        .catch((err) => res.status(500).josn(err));
    },

    // GET a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .populate({
            path: 'friends',
            select: '-__v',
        })
        .select('-__v')
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    }, 

    // CREATE a new user
    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // UPDATE a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // DELETE a user and thoughts
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User and thoughts deleted!' }))
        .catch((err) => res.status(500).json(err));
    },

    // ADD a friend
    addFriend(req, res) {
        console.log('You are adding a new friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friend: req.body }},
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res
                    .status(404)
                    .json({ message: 'No user found with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));   
    },

    // DELETE a friend
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friend: { friendId: req.params.friendId }}},
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res
                    .status(404)
                    .json({ message: 'No user found with that ID' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

}