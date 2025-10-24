"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_1 = __importDefault(require("@controllers/feed"));
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("src/middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.default, feed_1.default.getFeed); // get feed
router.post('/', authMiddleware_1.default, feed_1.default.createPost); // create a new post
router.get('/:id', authMiddleware_1.default, feed_1.default.getPostbyId); // get a specific post
router.put('/:id', authMiddleware_1.default, feed_1.default.updatePost); // update a specific post
router.delete('/:id'); // delete a specific post
// complex feed route
router.post('/:id/like', authMiddleware_1.default, feed_1.default.likePost); // like or unlike a post
router.post('/:id/comment', authMiddleware_1.default, feed_1.default.commentPost); // add a comment to a post
router.post('/:id/comment/:commentId/like', authMiddleware_1.default, feed_1.default.likeComment); // like or unlike a comment
router.put('/:id/comment/:commentId'); // update a comment on a post
router.delete('/:id/comment/:commentId'); // delete a comment from a post
exports.default = router;
