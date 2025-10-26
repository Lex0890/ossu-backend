import feed from '@controllers/feed';
import { Router } from 'express';
import authMiddleware from 'src/middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, feed.getFeed); // get feed
router.post('/', authMiddleware, feed.createPost); // create a new post
router.get('/:id', authMiddleware, feed.getPostbyId); // get a specific post
router.put('/:id', authMiddleware, feed.updatePost); // update a specific post
router.delete('/:id'); // delete a specific post

// complex feed route

router.post('/:id/like', authMiddleware, feed.likePost); // like or unlike a post
router.post('/:id/comment', authMiddleware, feed.commentPost); // add a comment to a post
router.post('/:id/comment/:commentId/like', authMiddleware, feed.likeComment); // like or unlike a comment
router.put('/:id/comment/:commentId', authMiddleware, feed.updateComment); // update a comment on a post
router.delete('/:id/comment/:commentId', authMiddleware, feed.deleteComment); // delete a comment from a post

export default router;
